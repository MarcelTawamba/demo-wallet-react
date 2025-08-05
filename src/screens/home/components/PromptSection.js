import React, { useState, useEffect, useRef } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import PromptCard from './PromptCard';
import { getBankAccounts, getAddresses, getTiers } from 'util/rehive';
import { max } from 'lodash';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useRehiveContext, useRehiveMethods } from 'contexts';
import { validateTierAndReqCompletion } from 'screens/onboarding/util/tierCompletion';
import { useDocumentsFetch } from 'hooks/documentAPI';
import { useAddressesFetch } from 'hooks/addressAPI';
import { useFetchMultiTierRequirementSets } from 'hooks/tierRequirementAPI';
import { useFetchDocumentTypes } from 'hooks/documentAPI';
import { getTierConfiguration } from 'screens/onboarding/config';

export default function PromptSection(props) {
  const { prompts, wallets, history } = props;

  const [userGroupTiers, setUserGroupTiers] = useState();
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const tiersRefreshed = useRef(false);

  const { tier, user, tiers: contextTiers, company } = useRehiveContext();
  const { refreshTiers } = useRehiveMethods();
  const { data: userDocuments } = useDocumentsFetch(user?.id, !!user?.id);
  const { data: addresses } = useAddressesFetch(user?.id, !!user?.id);
  
  // Get tier requirements (same as onboarding page)
  const tiersWithRequirementSets = useFetchMultiTierRequirementSets(
    user?.groups?.[0]?.name,
    contextTiers
  );
  
  // Get document types for field transformation
  const documentTypes = useFetchDocumentTypes(company?.id, Boolean(company?.id))
    ?.data?.results;
  
  // Transform tier data with proper fields (same as onboarding page)
  const tierRequirementsData = getTierConfiguration({
    tiersWithRequirementSets,
    documentTypes,
    user,
  });

  useEffect(() => {
    if (user?.id) {
      handleFetch();
    }
  }, [user]);

  // Separate effect for refreshing tiers - only run once when component mounts
  useEffect(() => {
    if (user?.id && user?.groups?.[0]?.name && !tiersRefreshed.current) {
      // Only refresh once per component lifecycle
      tiersRefreshed.current = true;
      refreshTiers();
    }
  }, [user?.id, user?.groups?.[0]?.name, refreshTiers]); // Only refresh when needed

  useEffect(() => {
    isHighestTierLevel();
  }, [tier]);

  // Re-evaluate when relevant data changes
  useEffect(() => {
    // This will trigger a re-render when the verification status changes
  }, [tierRequirementsData, userDocuments, addresses, tier, user]);

  /**
   * VERIFICATION PROMPT LOGIC
   * 
   * This function determines whether to show the verification prompt on the homepage.
   * It mirrors the onboarding page logic to ensure consistency.
   * 
   * KEY PRINCIPLES:
   * 1. Only show prompt when user has incomplete verification requirements
   * 2. Account for declined documents (they don't count as completed)
   * 3. Use the same tier completion calculation as onboarding page
   * 4. Ensure all required data is loaded before making decisions
   */
  function shouldShowVerificationPrompt() {
    // STEP 1: Data Preparation
    // Extract documents and addresses from API response format
    const documentsData = userDocuments?.results || userDocuments?.items || [];
    const addressesData = addresses?.results || addresses?.items || [];
    
    // STEP 2: Data Availability Check
    // Ensure all required data is loaded before proceeding with verification logic
    // This prevents false negatives during the loading phase
    if (!tierRequirementsData || !tierRequirementsData.length || !user) {
      return false;
    }
    
    // STEP 3: Loading State Check
    // Additional safety check to ensure documents/addresses data is fully loaded
    // Prevents showing/hiding prompt during data loading transitions
    if (userDocuments === undefined || addresses === undefined) {
      return false;
    }

    // STEP 4: Tier Analysis Setup
    const topTier = max(tierRequirementsData?.map(x => x.level)) ?? 0;
    const currentTier = tier?.level ?? 0;
    
    // Create a deep copy of tier data to avoid mutating the original
    // This is important because validateTierAndReqCompletion modifies the data
    const tiersCopy = JSON.parse(JSON.stringify(tierRequirementsData));
    
    // STEP 5: Tier Completion Calculation
    // This is the core logic that determines tier completion percentages
    // It accounts for:
    // - Verified documents (count as completed)
    // - Pending documents (count as completed)
    // - Declined documents (DON'T count as completed)
    // - Missing documents (DON'T count as completed)
    // - User fields (first_name, last_name, etc.)
    // - Address verification
    // - Mobile/email verification
    validateTierAndReqCompletion(0, tiersCopy, {
      user,
      addresses: addressesData,
      userDocuments: documentsData,
    });
    
    // STEP 6: Decision Logic - Smart Tier Filtering
    // Only check requirements that are actually relevant for the user's progression
    // Don't show prompt for requirements from tiers the user doesn't need to reach
    //
    // LOGIC:
    // - If user is below top tier: Check requirements for current tier + next tier only
    // - If user is at top tier: Don't show prompt (they've reached maximum)
    // - This prevents showing prompts for irrelevant declined documents
    //
    // IMPORTANT: The tier completion percentage already accounts for declined documents
    // because validateTierAndReqCompletion only counts 'pending' and 'verified' documents
    // as completed. Declined documents are NOT counted, so they reduce the completion %.
    const hasIncompleteRequirements = currentTier < topTier && tiersCopy.some(tier => {
      // Only check tiers that are relevant for progression:
      // - Current tier (in case user was downgraded due to declined docs)
      // - Next tier (what they're trying to reach)
      const isRelevantTier = tier.level <= currentTier + 1;
      return isRelevantTier && tier.tierCompletionPercentage < 100;
    });
    
    // STEP 8: Final Decision
    // Return true to show verification prompt, false to hide it
    // This decision is based solely on whether tier requirements are incomplete
    return hasIncompleteRequirements;
  }

  if (!prompts.length) return null;

  async function isHighestTierLevel() {
    if (!userGroupTiers) return false;
    const topTier = max(userGroupTiers?.map(x => x?.level));
    const currentTier = tier?.level;
    return currentTier === topTier;
  }

  async function handleFetch() {
    getTiers(user?.groups?.[0]?.name).then(resp =>
      setUserGroupTiers(resp?.data?.results),
    );


    await Promise.all([
      new Promise(resolve => {
        getAddresses().then(resp => {
          setUserAddresses(resp ?? []);
          resolve();
        });
      }),
      new Promise(resolve => {
        getBankAccounts().then(resp => {
          setBankAccounts(resp);
          return resolve();
        });
      }),
    ]);

    setLoading(false);
  }

  function renderItem(item) {
    let {
      variant,
      onPress,
      rightSlot,
      colorVariant,
      image,
      action,
      title,
      description,
      actionText,
    } = item;

    switch (variant) {
      case 'document':
        onPress = () => history.push(`/profile/documents/`);
        image = variant;
        break;
      case 'kyc':
        onPress = () => history.push(`/kyc/`);
        image = 'userVerify';
        break;
      case 'bank':
      case 'crypto':
        if (
          (variant === 'crypto' && userAddresses?.length) ||
          (variant === 'bank' && bankAccounts?.length)
        )
          return null;
        if (variant === 'crypto') {
          title = 'crypto_address_setup_title';
          description = 'crypto_address_setup_description';
        } else if (variant === 'bank') {
          title = 'bank_setup_title';
          description = 'bank_setup_description';
        }

        image = variant;
        onPress = () =>
          history.push(
            `/settings/${variant === 'bank' ? 'bankAccounts' : 'bitcoin'}`,
          );
        break;

      case 'verify':
        /**
         * VERIFICATION PROMPT RENDERING LOGIC
         * 
         * This case handles when to show the verification prompt card on the homepage.
         * 
         * BEHAVIOR:
         * - Shows when user has incomplete verification requirements
         * - Accounts for declined documents (they make requirements incomplete)
         * - Uses the same logic as onboarding page for consistency
         * - Directs user to onboarding page to complete verification
         * 
         * RETURNS NULL WHEN:
         * - All tier requirements are 100% complete
         * - Data is still loading (prevents flickering)
         * 
         * SHOWS PROMPT WHEN:
         * - Current or next tier has < 100% completion due to:
         *   • Declined/missing documents (if required by tier)
         *   • Incomplete profile fields (if required by tier)
         *   • Address verification incomplete (if required by tier)
         *   • Mobile/email verification incomplete (if required by tier)
         * - Only checks requirements actually defined in the tier configuration
         */
        if (!shouldShowVerificationPrompt()) {
          return null; // Hide verification prompt - all requirements complete
        }
        
        // Configure prompt appearance and behavior
        title = title || item.title || 'Complete verification';
        description = description || item.description || 'Get verified to get started';
        image = 'userVerify';
        onPress = () => history.push('/onboarding/'); // Direct to onboarding page
        break;

      default:
        const accountReference = Object.keys(wallets?.accounts)?.[0];
        onPress = action
          ? () =>
              history.push(
                `/accounts/${accountReference}/${wallets?.accounts?.[accountReference]?.keys?.[0]}/${action}/`,
              )
          : null;
    }

    return (
      <PromptCard
        {...{
          item,
          ...{
            variant,
            onPress,
            rightSlot,
            colorVariant,
            image,
            action,
            title,
            description,
            actionText,
          },
        }}
      />
    );
  }

  const actions = prompts?.map(item => renderItem(item));

  return !actions?.length ? null : (
    <>
      <View mb={1}>
        <Text id="actions" fontWeight={500} style={{ fontSize: 18 }} />
      </View>
      {loading ? (
        <>
          <Skeleton
            variant="rect"
            width={'100%'}
            height={80}
            style={{ borderRadius: 10 }}
          />
          <View mt={1}>
            <Skeleton
              variant="rect"
              width={'100%'}
              height={80}
              style={{ borderRadius: 10 }}
            />
          </View>
        </>
      ) : (
        actions?.map((item, index) => (
          <View mb={1} key={index}>
            {item}
          </View>
        ))
      )}
    </>
  );
}

