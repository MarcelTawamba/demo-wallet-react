import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getCompanyAppConfig, getUserAppConfig } from 'util/rehive';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';
import { configActionsSelector } from 'redux/rehive/selectors';

/**
 * React Query hook to fetch company app configuration
 * @param {string} companyId - Company ID to fetch config for
 * @param {boolean} enabled - Whether the query should run
 * @returns {object} React Query result with app config data
 */
export function useCompanyAppConfig(companyId, enabled = true) {
  return useQuery(
    ['appConfig', 'company', companyId],
    () => getCompanyAppConfig(companyId, false), // doThrow = false for graceful error handling
    {
      enabled: enabled && !!companyId,
      staleTime: 5 * 60 * 1000, // 5 minutes - config doesn't change frequently
      cacheTime: 15 * 60 * 1000, // 15 minutes cache
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      select: (data) => {
        // Transform the data if needed
        if (data?.status === 'success') {
          return data.data;
        }
        return null;
      },
    }
  );
}

/**
 * React Query hook to fetch user-specific app configuration
 * @param {boolean} enabled - Whether the query should run
 * @returns {object} React Query result with user app config data
 */
export function useUserAppConfig(enabled = true) {
  return useQuery(
    ['appConfig', 'user'],
    () => getUserAppConfig(false), // doThrow = false for graceful error handling
    {
      enabled,
      staleTime: 2 * 60 * 1000, // 2 minutes - user config might change more frequently
      cacheTime: 10 * 60 * 1000, // 10 minutes cache
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      select: (data) => {
        // Transform the data if needed
        if (data?.status === 'success') {
          return data.data;
        }
        return null;
      },
    }
  );
}

/**
 * Combined hook that fetches both company and user app config
 * Merges the configurations with user config taking precedence
 * @param {string} companyId - Company ID to fetch config for
 * @param {boolean} enabled - Whether the queries should run
 * @returns {object} Combined configuration data with loading states
 */
export function useAppConfig(companyId, enabled = true) {
  const queryClient = useQueryClient();
  
  const {
    data: companyConfig,
    isLoading: isCompanyConfigLoading,
    error: companyConfigError,
  } = useCompanyAppConfig(companyId, enabled);

  const {
    data: userConfig,
    isLoading: isUserConfigLoading,
    error: userConfigError,
  } = useUserAppConfig(enabled);

  // Merge configurations with user config taking precedence
  const mergedConfig = React.useMemo(() => {
    if (!companyConfig && !userConfig) return null;
    
    return {
      ...companyConfig,
      ...userConfig,
    };
  }, [companyConfig, userConfig]);

  // Invalidate related queries when company changes
  React.useEffect(() => {
    if (companyId) {
      queryClient.invalidateQueries(['appConfig', 'company']);
    }
  }, [companyId, queryClient]);

  return {
    data: mergedConfig,
    companyConfig,
    userConfig,
    isLoading: isCompanyConfigLoading || isUserConfigLoading,
    isCompanyConfigLoading,
    isUserConfigLoading,
    error: companyConfigError || userConfigError,
    companyConfigError,
    userConfigError,
  };
}

/**
 * Hook that automatically uses the current company from Redux
 * Convenience hook for components that need current company's app config
 * @returns {object} App configuration for current company
 */
export function useCurrentCompanyAppConfig() {
  const currentCompany = useSelector(currentCompanySelector);
  return useAppConfig(currentCompany?.id, !!currentCompany?.id);
}

/**
 * Hook to get specific configuration sections
 * @param {string} section - Configuration section (e.g., 'actions', 'auth', 'menu')
 * @param {string} companyId - Company ID (optional, uses current company if not provided)
 * @returns {object} Specific section of the configuration
 */
export function useAppConfigSection(section, companyId) {
  const currentCompany = useSelector(currentCompanySelector);
  const targetCompanyId = companyId || currentCompany?.id;
  
  const { data: config, ...rest } = useAppConfig(targetCompanyId, !!targetCompanyId);
  
  return {
    ...rest,
    data: config?.[section] || config?.config?.[section] || null,
    fullConfig: config,
  };
}

/**
 * Specialized hooks for common configuration sections
 */
export const useActionsConfig = (companyId) => useAppConfigSection('actions', companyId);
export const useAuthConfig = (companyId) => useAppConfigSection('auth', companyId);
export const useMenuConfig = (companyId) => useAppConfigSection('menu', companyId);
export const useAccountsConfig = (companyId) => useAppConfigSection('accounts', companyId);
export const useDesignConfig = (companyId) => useAppConfigSection('design', companyId);
export const useBusinessConfig = (companyId) => useAppConfigSection('business', companyId);
export const useCheckoutConfig = (companyId) => useAppConfigSection('checkout', companyId);

/**
 * Hook to get withdraw subtype configuration
 * @param {string} companyId - Company ID (optional)
 * @returns {object} Object with withdraw subtype configuration
 */
export function useWithdrawSubtypeConfig(companyId) {
  // Use the same Redux-based actions config that other parts of the app use
  const reduxActionsConfig = useSelector(configActionsSelector);
  
  const config = React.useMemo(() => {
    if (!reduxActionsConfig) {
      return {
        defaultSubtype: 'withdraw_manual',
        options: [],
        isLoading: true,
      };
    }
    
    // Get withdraw configuration from Redux state
    const withdrawConfig = reduxActionsConfig?.withdraw?.config || {};
    
    // Future extensibility: Support multiple withdraw options
    const withdrawOptions = withdrawConfig.subtypes || [];
    
    // Current implementation: Just get the default subtype
    const defaultSubtype = withdrawConfig.defaultSubtype || 'withdraw_manual';
    
    return {
      defaultSubtype,
      options: withdrawOptions,
      isLoading: false,
      config: withdrawConfig,
    };
  }, [reduxActionsConfig]);
  
  return config;
}

/**
 * Hook to get translation key with fallback for custom withdraw subtypes
 * @param {string} subtype - The withdraw subtype
 * @param {string} action - The action type (e.g., 'success', 'confirmation')
 * @returns {string} Translation key
 */
export function useWithdrawTranslationKey(subtype, action) {
  const withdrawSubtypeConfig = useWithdrawSubtypeConfig();
  
  const translationKey = React.useMemo(() => {
    // For crypto withdrawals, always use crypto key
    if (subtype === 'withdraw_crypto') {
      return `withdraw_crypto_${action}`;
    }
    
    // For custom subtypes, try custom key first, then fallback to manual
    const defaultSubtype = withdrawSubtypeConfig?.defaultSubtype || 'withdraw_manual';
    
    if (subtype === defaultSubtype || !subtype) {
      // Check if we have a custom subtype configured
      if (defaultSubtype !== 'withdraw_manual') {
        // Custom subtype - fallback to manual if no translation exists
        return `${defaultSubtype}_${action}`;
      }
      // Standard manual withdrawal
      return `withdraw_manual_${action}`;
    }
    
    // Fallback for any other subtype
    return `${subtype}_${action}`;
  }, [subtype, action, withdrawSubtypeConfig]);
  
  return translationKey;
}

/**
 * Hook to check if a specific action is allowed based on configuration
 * @param {string} action - Action name (e.g., 'send', 'receive', 'deposit')
 * @param {string} currency - Currency code
 * @param {string} userGroup - User group
 * @param {string} accountId - Account ID
 * @returns {object} Object with isAllowed boolean and configuration
 */
export function useActionPermission(action, currency, userGroup, accountId) {
  const { data: actionsConfig, isLoading } = useActionsConfig();
  
  const isAllowed = React.useMemo(() => {
    if (isLoading || !actionsConfig || !actionsConfig[action]) {
      return true; // Default to allowed if config not loaded or action not configured
    }
    
    const actionConfig = actionsConfig[action];
    const { condition } = actionConfig;
    
    if (!condition) return true;
    
    // Check currency restrictions
    if (condition.hideCurrency?.includes(currency)) return false;
    if (condition.showCurrency?.length && !condition.showCurrency.includes(currency)) return false;
    
    // Check user group restrictions
    if (condition.hideGroups?.includes(userGroup)) return false;
    if (condition.showGroups?.length && !condition.showGroups.includes(userGroup)) return false;
    
    // Check account restrictions
    if (condition.hideAccounts?.includes(accountId)) return false;
    if (condition.showAccounts?.length && !condition.showAccounts.includes(accountId)) return false;
    
    return true;
  }, [actionsConfig, action, currency, userGroup, accountId, isLoading]);
  
  return {
    isAllowed,
    isLoading,
    actionConfig: actionsConfig?.[action],
    condition: actionsConfig?.[action]?.condition,
    config: actionsConfig?.[action]?.config,
  };
}

/**
 * Hook to check if a menu item should be hidden
 * @param {string} menuItemName - Name of the menu item
 * @returns {object} Object with shouldHide boolean and menu configuration
 */
export function useMenuItemVisibility(menuItemName) {
  const { data: menuConfig, isLoading } = useMenuConfig();
  
  const shouldHide = React.useMemo(() => {
    if (isLoading || !menuConfig?.items) return false;
    
    const menuItem = menuConfig.items.find(item => item.name === menuItemName);
    return menuItem?.hide === true;
  }, [menuConfig, menuItemName, isLoading]);
  
  return {
    shouldHide,
    shouldShow: !shouldHide,
    isLoading,
    menuConfig,
  };
}