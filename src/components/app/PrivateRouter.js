import React, { useState, Suspense, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

import { configAuthSelector, configOnboardingSelector, userBankAccountsSelector } from 'redux/rehive/selectors';
import {
  userTierSelector,
  userTiersSelector,
} from 'screens/accounts/redux/selectors';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { useLanguage } from 'components/contexts/LanguageContext';

import Drawer from 'components/layout/Drawer';
// import Toast from 'components/outputs/Toast';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { SplashScreen } from 'components/rehive/SplashScreen';

import AppMenu from './AppMenu';
import {
  getBusinessServiceSettings,
  getProductServiceSettings,
} from 'util/rehive';
import { Providers } from 'contexts';
import ThrottlingScreen from './ThrottlingScreen';
import { useBusinessSettings } from 'hooks/businessAPI';
import { isAdmin } from 'util/general';
import { checkBusinessGroup } from 'util/business';
import { useBusiness } from 'contexts';
import { useAddressesFetch } from 'hooks/addressAPI';
import { useDocumentsFetch, useFetchDocumentTypes } from 'hooks/documentAPI';
import { useFetchMultiTierRequirementSets, useFetchActiveTier } from 'hooks/tierRequirementAPI';
import { getTierConfiguration } from 'screens/onboarding/config';
import businessFormConfig from 'screens/onboarding/config/business';
import { validateRequiredFieldsCompletionHome } from 'screens/onboarding/util';
import { useKYCLink } from 'hooks/bridgeAPI';
import { currentCompanyServicesSelector, appLoadedSelector } from 'redux/auth/selectors';

// Lazy load components without try-catch to avoid page refresh on error
const HomeContainer = React.lazy(() => import('screens/home'));
const AccountsContainer = React.lazy(() => import('screens/accounts'));
const OnboardingContainer = React.lazy(() => import('screens/onboarding'));
const BusinessSettingsContainer = React.lazy(() =>
  import('screens/business_settings'),
);
const GetStartedContainer = React.lazy(() => import('screens/get_started'));
const SettingsContainer = React.lazy(() => import('screens/settings'));
const ProfileContainer = React.lazy(() => import('screens/profile'));
const ReportingContainer = React.lazy(() => import('screens/reporting'));
const RewardsContainer = React.lazy(() => import('screens/rewards'));
const OrdersContainer = React.lazy(() => import('screens/orders'));
const RewardsAdminContainer = React.lazy(() => import('screens/rewards_admin'));
const ProductsAdminContainer = React.lazy(() => import('screens/products_admin'));
const ProductsContainer = React.lazy(() => import('screens/products'));
const InvoicesContainer = React.lazy(() => import('screens/invoices'));
const CustomersContainer = React.lazy(() => import('screens/customers'));
const DevelopersContainer = React.lazy(() => import('screens/developers'));
const PayoutsContainer = React.lazy(() => import('screens/payouts'));
const PaymentsContainer = React.lazy(() => import('screens/payments'));
const PointOfSalePage = React.lazy(() => import('screens/pos'));
const HelpContainer = React.lazy(() => import('screens/help'));
const MobileDownloadPage = React.lazy(() => import('./MobileDownloadPage'));
const TeamContainer = React.lazy(() => import('screens/team'));
const KYCContainer = React.lazy(() => import('screens/webview'));
const BridgeTermsContainer = React.lazy(() => import('screens/bridge/BridgeTermsPage'));

/**
 * PrivateRouter - Main routing guard for authenticated users
 * 
 * This component handles all routing decisions for logged-in users and ensures they
 * complete necessary verification steps before accessing the main application.
 * 
 * ROUTING PRIORITY ORDER:
 * 1. Bridge Service KYC/TOS - Must be completed first if bridge service is enabled
 * 2. Tier Verification - User must meet minimum tier requirements
 * 3. Business Onboarding - Business users must complete business setup
 * 4. Additional Requirements - Granular field validation (addresses, documents, etc.)
 * 
 * CRITICAL RACE CONDITION HANDLING:
 * - Waits for tier data to load before making routing decisions
 * - Waits for business data to load before checking business onboarding
 * - Waits for addresses/documents to load before granular validation
 * 
 * COMMON ISSUES:
 * - False redirects during app initialization due to data loading delays
 * - Redirect loops if loading states aren't properly handled
 * - Business users getting stuck in onboarding when requirements are met
 * 
 * @param {Object} props - Component props including user, company, logoutUser
 */
const PrivateRouter = props => {
  const { logoutUser, company, user } = props;
  const drawerHook = useState(false);
  const location = window.location;
  const { pathname } = location;
  const history = useHistory();
  const paths = pathname.split('/');
  let { config: client } = useConfiguration();
  const [showThrottle, setShowThrottle] = useState(false);
  const isPoS = paths.length > 1 && paths[1].match(/pos/);

  const isOnboarding = paths.length > 1 && paths[1].match(/onboarding/);
  const isSEP24Widget = paths.length > 1 && paths[1].match(/sep24/);
  const isBridgeTerms = paths.length > 1 && paths[1].match(/bridge-terms/);
  const {
    data: businessServiceSettings,
    isLoading: businessServiceSettingsLoading,
  } = useBusinessSettings(company?.id);
  const queryProductServiceSettings = useQuery(
    ['productServiceSettings', company?.id, user?.id],
    getProductServiceSettings,
  );
  const productServiceSettings = queryProductServiceSettings?.data;

  const authConfig = useSelector(configAuthSelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const bankAccountsData = useSelector(userBankAccountsSelector);
  const bankAccounts = bankAccountsData?.items || [];
  const bankAccountsLoading = !bankAccountsData || bankAccountsData.loading;
  const { data: addresses, isLoading: addressesLoading } = useAddressesFetch(user?.id);
  const { data: { results: userDocuments } = { results: [] }, isLoading: documentsLoading } = useDocumentsFetch(user?.id) ?? {};
  const tiers = useSelector(userTiersSelector);
  const tier = useSelector(userTierSelector);
  const userGroup = user?.groups?.[0]?.name;
  
  // Get fresh tier data to match onboarding component's data source
  const { data: freshActiveTierData } = useFetchActiveTier(userGroup, user?.id);
  
  const tiersWithRequirementSets = useFetchMultiTierRequirementSets(
    userGroup,
    tiers.items,
  );
  const { data: { results: documentTypes } = { results: [] }, isLoading: documentTypesLoading } = useFetchDocumentTypes(company?.id, Boolean(company?.id)) ?? {};

  // ===== TIER VERIFICATION LOGIC =====
  // This section determines if the user meets the minimum tier requirements to access the app
  
  const tierConfig = getTierConfiguration({
    tiersWithRequirementSets,
    documentTypes,
  });
  
  // Extract user's current tier level (0 if no tier data loaded yet)
  // Use fresh API data as primary source, fall back to Redux if not available
  const freshTierLevel = get(freshActiveTierData, ['data', 'results', 0, 'level']);
  const reduxTierLevel = get(tier, ['items', 0, 'level']);
  const userTier = freshTierLevel || reduxTierLevel || 0;
  
  // Get the minimum required tier from company auth configuration (defaults to 0)
  const requiredTier = get(authConfig, 'tier') || 0;
  
  // Check if user is an admin (admins bypass tier requirements)
  const adminCheck = Boolean(isAdmin({ userGroup: user?.groups?.[0]?.section })?.length);
  
  // CRITICAL: Track if tier data has actually loaded from the API
  // This prevents false redirects during the loading phase when userTier = 0
  // Check both Redux data and fresh API data since verification uses both
  // Also ensure we have the user group needed to fetch tier data
  const hasTierData = (tier?.items?.length > 0 || Boolean(freshActiveTierData?.data?.results?.length > 0)) && Boolean(userGroup);
  
  // User is verified if they meet tier requirements OR are an admin
  const isVerified = userTier >= requiredTier || adminCheck;
  
  

  const services = useSelector(currentCompanyServicesSelector);
  const appLoaded = useSelector(appLoadedSelector);
  const { data: kycLinkResponse, isLoading: isKycLinkLoading } = useKYCLink(`${window.location.origin}/bridge-terms/`, services?.bridge_service);
  
  // ===== BUSINESS ONBOARDING LOGIC =====
  // This section handles business-specific onboarding requirements for business users
  
  const { 
    business, 
    hasBusinessService, 
    isBusinessGroup,
    loading: businessLoading 
  } = useBusiness();
  
  // Check if business onboarding is complete
  // This is a complex check that validates business profile, documents, and configuration
  // Redirect loop protection - track consecutive business onboarding redirects
  const businessRedirectCountRef = React.useRef(0);
  const lastBusinessCompletionStatusRef = React.useRef(null);
  
  const isBusinessOnboardingComplete = React.useMemo(() => {
    // Skip business checks for non-business users or if business service not enabled
    if (!isBusinessGroup || !hasBusinessService) {
      return true;
    }
    
    // CRITICAL RACE CONDITION FIX: Prevent premature redirects during data loading
    // If business data is still loading OR business query hasn't been enabled yet,
    // return true to avoid false redirects during app initialization
    if (businessLoading || !business?.id) {
      return true;
    }
    
    // Additional safety: Wait for user documents and bank accounts to load before checking completion
    // Business onboarding depends on document verification and banking information
    if (documentsLoading || !userDocuments || bankAccountsLoading) {
      return true;
    }
    
    // REDIRECT LOOP PROTECTION: If we've had too many consecutive incomplete checks,
    // assume completion to prevent infinite loops
    if (businessRedirectCountRef.current >= 3) {
      console.warn('Business onboarding redirect loop protection activated - allowing access');
      return true;
    }
    
    try {
      // Use the business form configuration to determine if onboarding is complete
      // This checks business profile, documents, banking info, etc.
      const { isOnboardingComplete, sections } = businessFormConfig({
        business,
        documents: userDocuments,
        bankAccounts: bankAccounts, // Use actual bank account data from Redux
        defaults: { colors: { primary: '#000', secondary: '#fff' } },
        user,
        onboardingConfig: onboardingConfig || {},
        sellers: []
      });
      
      // DEBUG LOGGING: Track completion status changes for troubleshooting (dev only)
      if (lastBusinessCompletionStatusRef.current !== isOnboardingComplete) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Business onboarding completion status changed:', {
            previous: lastBusinessCompletionStatusRef.current,
            current: isOnboardingComplete,
            totalSections: sections?.length,
            completedSections: sections?.filter(s => s.completed)?.length,
            hiddenSections: sections?.filter(s => s.hidden)?.length,
            businessId: business?.id,
            redirectCount: businessRedirectCountRef.current
          });
        }
        lastBusinessCompletionStatusRef.current = isOnboardingComplete;
      }
      
      // Update redirect counter based on completion status
      if (isOnboardingComplete) {
        businessRedirectCountRef.current = 0; // Reset counter on completion
      } else {
        businessRedirectCountRef.current += 1; // Increment counter on incomplete status
      }
      
      return isOnboardingComplete;
    } catch (error) {
      console.warn('Business onboarding completion check failed:', error);
      return true; // Default to complete to avoid redirect loops
    }
  }, [business, userDocuments, user, isBusinessGroup, hasBusinessService, businessLoading, documentsLoading, bankAccountsLoading, onboardingConfig, bankAccounts]);

  // ===== MAIN ROUTING LOGIC =====
  // This useEffect handles all redirect decisions based on user state and requirements
  // The order of checks is CRITICAL - each priority level must be evaluated in sequence
  useEffect(() => {
    // Early return if we're already on onboarding or bridge-terms pages
    // Prevents redirect loops and unnecessary processing
    if (isOnboarding || isBridgeTerms) {
      return;
    }

    // ===== RACE CONDITION PROTECTION =====
    // CRITICAL: Wait for tier data to load before making routing decisions
    // This prevents false redirects when userTier = 0 during initial app load
    // Only wait if the company actually requires a tier (requiredTier > 0)
    // Also wait if we have tier requirements configured but data isn't loaded yet
    if ((!hasTierData && requiredTier > 0) || (!hasTierData && tierConfig && tierConfig.length > 0)) {
      return;
    }

    // ===== PRIORITY 1: BRIDGE SERVICE KYC/TOS CHECKS =====
    // Bridge service users must complete KYC and Terms of Service before anything else
    // This takes precedence over tier verification and onboarding
    if (services?.bridge_service && !isKycLinkLoading && kycLinkResponse) {
      const kycStatus = kycLinkResponse?.data?.kyc?.status;
      const tosStatus = kycLinkResponse?.data?.tos?.status;
      const isKYCComplete = kycStatus === 'approved';
      const isTOSComplete = tosStatus === 'approved';

      if (!isKYCComplete || !isTOSComplete) {
        history.replace('/bridge-terms/');
        return;
      }
    }

    // ===== PRIORITY 2: TIER VERIFICATION =====
    // Check if user meets minimum tier requirements to access the app
    // This is the primary gatekeeper for app access
    if (!isVerified && !isSEP24Widget) {
      history.replace('/onboarding/');
      return;
    } else if (isVerified) {
      // ===== PRIORITY 3: BUSINESS ONBOARDING COMPLETION =====
      // For verified users in business groups, ensure business onboarding is complete
      // Only check if ALL required data has finished loading to avoid race conditions
      if (isBusinessGroup && hasBusinessService && !businessLoading && !documentsLoading && !bankAccountsLoading && !isBusinessOnboardingComplete && !isSEP24Widget) {
        history.replace('/onboarding/');
        return;
      }
      // User is verified and business onboarding is complete (if applicable)
      // No further checks needed - allow access to the app
      return;
    }

    // ===== PRIORITY 4: ADDITIONAL TIER REQUIREMENT VALIDATION =====
    // For users who don't meet basic tier requirements, check specific field completion
    // This provides more granular validation of addresses, documents, etc.
    // CRITICAL: Wait for all data to load before checking requirements
    // CRITICAL: Only run this check for users who are NOT verified - verified users should not be redirected
    if (!isVerified && tierConfig && tierConfig.length > 0 && !addressesLoading && !documentsLoading && addresses && userDocuments) {
      const onboardingError = validateRequiredFieldsCompletionHome(
        requiredTier,
        tierConfig,
        {
          user,
          addresses,
          userDocuments,
        },
      );

      if (onboardingError && !isSEP24Widget) {
        history.replace('/onboarding/');
      }
    }
  }, [
    // Core verification states
    isVerified,
    hasTierData,
    requiredTier,
    
    // Data loading states - critical for race condition prevention
    tiersWithRequirementSets.length,
    addresses,
    userDocuments,
    businessLoading,
    documentsLoading,
    addressesLoading,
    bankAccountsLoading,
    
    // User and service context
    user,
    services?.bridge_service,
    kycLinkResponse,
    isKycLinkLoading,
    
    // Current page context
    isOnboarding,
    isBridgeTerms,
    isSEP24Widget,
    
    // Business-specific states
    isBusinessGroup,
    hasBusinessService,
    isBusinessOnboardingComplete,
  ]);

  const receiveAPIStatusMessage = event => {
    try {
      if (showThrottle) return;
      const message = JSON.parse(event.data);
      if (!showThrottle && message?.rehiveThrottling) {
        setShowThrottle(true);
      } else if (message?.authSessionExpired) {
        logoutUser();
      }
    } catch (error) {}
  };

  useEffect(() => {
    window.addEventListener('message', receiveAPIStatusMessage);
    return () => window.removeEventListener('message', receiveAPIStatusMessage);
  }, []);

  const appMenuProps = {
    loading:
      businessServiceSettingsLoading || queryProductServiceSettings?.isLoading,
    businessServiceSettings,
    productServiceSettings,
    user,
    company,
    pathname,
    drawerHook,
  };


  // Bridge service loading logic: show loading if bridge service is enabled and KYC data is loading, 
  // OR if app is still loading and we can't determine bridge service status yet
  const servicesStillLoading = !appLoaded && !services;
  const isBridgeServiceLoading = servicesStillLoading || (services?.bridge_service && (isKycLinkLoading || !kycLinkResponse));
  const isOnboardingDataLoading = (isOnboarding || !isVerified) ? 
    (documentTypesLoading || !tiersWithRequirementSets?.length || !documentTypes) : 
    queryProductServiceSettings?.isLoading;
  
  // Show loading screen while required data is loading
  if (!isBridgeTerms && (isBridgeServiceLoading || isOnboardingDataLoading)) {
    return <SplashScreen />;
  }

  return (
    <Providers>
      <>
        {isOnboarding ? (
          <OnboardingContainer {...{ ...props, businessServiceSettings }} />
        ) : isPoS ? (
          <Suspense fallback={<SplashScreen />}>
            <PointOfSalePage />
          </Suspense>
        ) : isBridgeTerms ? (
          <Suspense fallback={< SplashScreen />}>
            <ErrorBoundary>
              <BridgeTermsContainer businessServiceSettings={businessServiceSettings} />
            </ErrorBoundary>
          </Suspense>
        ) : (
          <Drawer
            pathname={pathname}
            drawerHook={drawerHook}
            company={company}
            menu={
              <ErrorBoundary>
                <AppMenu
                  {...appMenuProps}
                  authConfig={authConfig}
                  logoutUser={logoutUser}
                  isVerified
                />
              </ErrorBoundary>
            }>
            <ErrorBoundary>
              {showThrottle ? (
                <ThrottlingScreen setShowThrottle={setShowThrottle} />
              ) : (
                <Switch>
                  <Suspense fallback={<SplashScreen />}>
                    <Route path="/settings/" render={routeProps => <SettingsContainer {...routeProps} />} />
                    <Route path="/mobile/" render={routeProps => <MobileDownloadPage {...routeProps} />} />
                    <Route path="/profile/" render={routeProps => <ProfileContainer {...routeProps} />} />
                    <Route path="/home/" render={routeProps => <HomeContainer {...routeProps} businessServiceSettings={businessServiceSettings} />} />
                    <Route path="/accounts/" render={routeProps => <AccountsContainer {...routeProps} businessServiceSettings={businessServiceSettings} />} />
                    <Route path="/rewards_admin/" render={routeProps => <RewardsAdminContainer {...routeProps} />} />
                    <Route path="/products_admin/" render={routeProps => <ProductsAdminContainer {...routeProps} />} />
                    <Route path="/rewards/" render={routeProps => <RewardsContainer {...routeProps} />} />
                    <Route path="/payments/" render={routeProps => <PaymentsContainer {...routeProps} />} />
                    <Route path="/products/" render={routeProps => <ProductsContainer {...routeProps} />} />
                    <Route path="/orders/" render={routeProps => <OrdersContainer {...routeProps} />} />
                    <Route path="/invoices/" render={routeProps => <InvoicesContainer {...routeProps} />} />
                    <Route path="/customers/" render={routeProps => <CustomersContainer {...routeProps} />} />
                    <Route path="/help/" render={routeProps => <HelpContainer {...routeProps} />} />
                    <Route path="/developers/" render={routeProps => <DevelopersContainer {...routeProps} />} />
                    <Route path="/business/" exact render={routeProps => <BusinessSettingsContainer {...routeProps} />} />
                    <Route path="/reporting/" render={routeProps => <ReportingContainer {...routeProps} />} />
                    <Route path="/payouts/" render={routeProps => <PayoutsContainer {...routeProps} />} />
                    <Route path="/kyc/" render={routeProps => <KYCContainer {...routeProps} />} />
                    <Route path="/get_started/" render={routeProps => <GetStartedContainer {...routeProps} />} />
                    <Route path="/team/" render={routeProps => <TeamContainer {...routeProps} />} />
                    <Route path="/" exact render={routeProps => <HomeContainer {...routeProps} />} />
                    {/* <Route component={AccountsContainer} path="/" exact /> */}
                  </Suspense>
                </Switch>
              )}
            </ErrorBoundary>
          </Drawer>
        )}
      </>
    </Providers>
  );
};
export default PrivateRouter;
