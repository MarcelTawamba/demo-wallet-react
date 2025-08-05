import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { userProfileSelector } from 'redux/rehive/selectors';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import Spinner from 'components/outputs/Spinner';
import { View } from 'components/layout/View';
import TierRequirements from './TierRequirements';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Tabs from 'components/menu/Tabs';
import TierLimitsList from './TierLimitsList';
import { useRehive } from 'hooks/rehive';
import IncreaseKycLimitCard from '../IncreaseKycLimitCard';
import { useFetchMultiTierRequirementSets } from 'hooks/tierRequirementAPI';
import { getTierConfiguration } from 'screens/onboarding/config';
import { useFetchDocumentTypes } from 'hooks/documentAPI';
import Text from 'components/outputs/Text';
import TierAccordion from './TierAccordion';
import { isRequirementMet } from './TierRequirement';

import { useFetchTierLimits } from 'hooks/groupAPI';
const tabs = [
  { label: 'requirements', value: 'requirements' },
  { label: 'limits', value: 'limits' },
];

export default function TierRequirementsPage(props) {
  const [state, setState] = useState('requirements');
  const [tierIcons, setTierIcons] = useState({});

  const user = useSelector(userProfileSelector)?.items;
  const { context, loading } = useRehive(
    ['profile', 'documents', 'addresses', 'tiers', 'tier', 'bankAccounts'],
    true,
    { user },
  );
  const { tiers, tier, profile } = context;

  const groupName = useMemo(
    () => get(profile, ['items', 'groups', 0, 'name'], ''),
    [profile],
  );
  const company = useMemo(() => profile?.items?.company, [profile]);
  const tierLimitData = useFetchTierLimits(
    groupName,
    tier?.items?.[0]?.id,
    Boolean(groupName, company),
  );
  const tierLimits = tierLimitData?.data?.data?.results || [];

  const currencies = useSelector(walletsSelector);

  const userGroup = user?.groups?.[0]?.name;
  const tiersWithRequirementSets = useFetchMultiTierRequirementSets(
    userGroup,
    tiers?.items,
  );
  const documentTypes = useFetchDocumentTypes(
    user?.company,
    Boolean(user?.company),
  )?.data?.results;
  const tierConfig = getTierConfiguration({
    tiersWithRequirementSets,
    documentTypes,
  });
  const entry = Object.entries(tierIcons).find(([_, value]) => value === false);
  const initialOpen = tierConfig?.find(tier => {
    return tier.id === parseInt(entry?.[0]);
  })?.level;

  const [expanded, setExpanded] = useState(initialOpen);
  useEffect(() => {
    const open = tierConfig?.find(
      tier => tier.id === parseInt(entry?.[0]),
    )?.level;

    setExpanded(open);
  }, entry);
  return (
    <View ph={2} pv={1} w={'100%'}>
      {/* <IncreaseKycLimitCard backgroundColor="#fafafa" /> */}
      <Tabs state={state} onChange={setState} tabs={tabs} tabSpaceBetween />
      {!(tierConfig?.length > 0) ? (
        <View jC={'center'} aI={'center'} w={'100%'} mv={2}>
          <Spinner size={30} />
        </View>
      ) : (
        <React.Fragment>
          {state === 'requirements' ? (
            <>
              <View mt={0.25} mb={0.5}>
                <Text
                  style={{ fontSize: 13 }}
                  myColor={'#848484'}
                  lH={18}
                  id="manage_tier_requirement_description"
                />
              </View>
              {tierConfig?.length > 0 ? (
                tierConfig.map(tier => {
                  return (
                    <TierAccordion
                      key={tier.level}
                      expanded={expanded}
                      level={tier.level}
                      setExpanded={setExpanded}
                      titleVariant={''}
                      title={`Tier ${tier.level} - ${tier.name}`}
                      isTierDisable={
                        tier?.requirementSets?.length ? false : true
                      }
                      status={tierIcons[tier.id] ?? 'pending'}
                      initialOpen={true}>
                      <TierRequirements
                        {...{
                          key: tier?.level,
                          ...context,
                          tier,
                          currencies,
                          tierConfig,
                          setTierIcons,
                        }}
                        history={props.history}
                      />
                    </TierAccordion>
                  );
                })
              ) : (
                <EmptyListMessage id="tier_requirements_empty" />
              )}
            </>
          ) : state === 'limits' ? (
            <div style={{ paddingTop: 8, width: '100%' }}>
              <TierLimitsList items={tierLimits} currencies={currencies} />
            </div>
          ) : (
            <EmptyListMessage id="tier_requirements_empty" />
          )}
        </React.Fragment>
      )}
    </View>
  );
}
