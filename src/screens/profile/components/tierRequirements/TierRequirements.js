import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';

import Text from 'components/outputs/Text';
import SectionListHeader from 'components/lists/SectionListHeader';
import TierRequirement, { isRequirementMet } from './TierRequirement';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default function TierRequirements(props) {
  const { tier = {}, tierIcons, setTierIcons, ...restProps } = props;
  const classes = useStyles();
  const [statuses, setStatuses] = useState([]);

  const requirements = useMemo(() => {
    if (!tier.requirementSets) return [];
    let fields = [];
    tier.requirementSets.forEach(requirementSet => {
      if (requirementSet.fields?.length > 0) {
        fields = fields.concat(requirementSet.fields);
      } else if (requirementSet.subRequirementSets?.length > 0) {
        requirementSet.subRequirementSets.forEach(subRequirementSet => {
          if (subRequirementSet?.fields?.length > 0) {
            fields = fields.concat(subRequirementSet?.fields);
          }
        });
      }
    });
    return fields;
  }, []);

  const updateStatuses = useCallback(() => {
    const newStatuses = requirements.map(requirement => {
      return isRequirementMet({
        requirement,
        ...restProps,
      });
    });
    const allComplete = newStatuses.every(s => s.status === true);
    const allPending = newStatuses.every(s => s.status === 'pending');
    let status;
    if (allComplete) status = true;
    else if (allPending) status = 'pending';
    else status = false;

    setTierIcons(prev => ({ ...prev, [tier.id]: status }));
  }, [requirements]);

  useEffect(() => {
    updateStatuses();
  }, [updateStatuses]);

  return (
    <div className={classes.container}>
      {/* <SectionListHeader
        textStyle={{ fontSize: 15 }}
        navigateTo="/onboarding"
        navigationState={{ tierLevel: tier.level }}>
        {`Tier ${tier.level} - ${tier.name}`}
      </SectionListHeader> */}
      {requirements && requirements?.length > 0 ? (
        requirements.map(requirement => (
          <TierRequirement
            key={requirement.itemId}
            {...restProps}
            requirement={requirement}
          />
        ))
      ) : (
        <Text
          className={classes.requirement}
          myColor="fontDark"
          id="no_requirements"
        />
      )}
    </div>
  );
}
