import React, { useMemo, useState, useEffect } from 'react';
import Text from 'components/outputs/Text';
import { IconButton, ListItem, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import { isEmpty, round } from 'lodash';
import { Description } from '@material-ui/icons';
import OnBoardingAccordion from './OnboardingAccordion';
import { View } from 'components/layout/View';
// import Icon from '';

export default function OnboardingSidebar(props) {
  let {
    tierConfig,
    activeTier,
    setActiveTier,
    activeTierRequirement,
    setActiveTierRequirement,
    activeTierSubRequirement,
    setActiveTierSubRequirement,
    minimumTierRequirement,
    userActiveTierLevel,
    combinedSections,
    currentSection,
    setCurrentSection,
    isBusinessGroup,
    setIsUserOnboarding,
  } = props;

  const theme = UI_useTheme();

  const hexToRGBAWithOpacity = (hex, opacity) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const horizontal = false;

  const classes = useStyles();
  const initialOpen = tierConfig?.map(tier => {
    if (
      tier?.requirementSets?.length > 0 ||
      tier?.subRequirementSets?.length > 0
    ) {
      return true;
    }
    return false;
  })[0]?.level; // for initial open that need requirements to open initially

  const [expanded, setExpanded] = React.useState(initialOpen);
  useEffect(() => {
    setExpanded(activeTier.level);
  }, [activeTier]);

  // const handleTierClick = tier => {
  //   if (tier.id === activeTier?.id) return;
  //   setActiveTier(tier);
  //   if (tier.requirementSets.length > 0) {
  //     if (!activeTierRequirement?.parent) {
  //       setActiveTierRequirement(tier.requirementSets[0]);
  //       if (
  //         tier.requirementSets[0]?.subRequirementSets?.length > 0 &&
  //         isEmpty(tier.requirementSets[0]?.fields)
  //       ) {
  //         setActiveTierSubRequirement(
  //           tier.requirementSets[0].subRequirementSets[0],
  //         );
  //       } else if (activeTierSubRequirement) setActiveTierSubRequirement(null);
  //     }
  //   } else if (activeTierRequirement) {
  //     setActiveTierRequirement(null);
  //     setActiveTierSubRequirement(null);
  //   }
  // };

  const handleTierRequirementClick = (tier, requirementSet) => {
    if (tier?.id !== activeTier?.id) setActiveTier(tier);
    // if (!isEmpty(requirementSet?.fields)) {
    //   setActiveTierSubRequirement(null);
    // } else if (requirementSet?.subRequirementSets?.length > 0) {
    //   setActiveTierSubRequirement(requirementSet.subRequirementSets[0]);
    // } else if (activeTierSubRequirement) setActiveTierSubRequirement(null);
    setActiveTierSubRequirement(null);
    setActiveTierRequirement(requirementSet);
  };

  // const handleTierSubRequirementClick = (
  //   tier,
  //   requirementSet,
  //   subRequirementSet,
  // ) => {
  //   if (subRequirementSet.id === activeTierSubRequirement?.id) return;
  //   if (tier?.id !== activeTier?.id) setActiveTier(tier);
  //   if (requirementSet?.id !== activeTierRequirement?.id)
  //     setActiveTierRequirement(requirementSet);
  //   setActiveTierSubRequirement(subRequirementSet);
  // };

  const lastTierHeight = useMemo(() => {
    const lastTierIndex = tierConfig.length - 1;
    const tierRequirementLength =
      tierConfig[lastTierIndex]?.requirementSets?.length ?? 0;
    const tierSubRequirementLength = tierRequirementLength
      ? tierConfig[lastTierIndex]?.requirementSets[tierRequirementLength - 1]
          ?.subRequirementSets?.length ?? 0
      : 0;
    return (tierRequirementLength + tierSubRequirementLength) * 25;
  }, [tierConfig]);

  function renderSection({ horizontal }) {
    return (
      <List disablePadding={true}>
        {tierConfig?.map((tier, index) => {
          const isActiveTier = index + 1;
          const tierCompletedPercentage = tier.tierCompletionPercentage;
          const isCompletedTier =
            tierCompletedPercentage === 100 ? true : false;
          return (
            <>
              <div key={tier.id} style={{ display: 'flex' }}>
                <OnBoardingAccordion
                  expanded={expanded}
                  setExpanded={setExpanded}
                  title={`Tier ${tier.level} - ${tier.name}`}
                  level={tier.level}
                  initialOpen={true}
                  titleVariant={''}
                  isTierDisable={tier?.requirementSets?.length ? false : true}
                  titleColor={
                    isCompletedTier
                      ? '#2CB392'
                      : `${theme.palette.primary.main}`
                  }
                  titleBackground={
                    isCompletedTier
                      ? 'rgba(232, 247, 244, 1)'
                      : `${hexToRGBAWithOpacity(
                          theme.palette.secondary.main,
                          0.1,
                        )}`
                  }
                  completePercentage={`${tierCompletedPercentage}%`}>
                  <Collapse in={true} timeout="auto" unmountOnExit>
                    {tier.requirementSets?.map(requirementSet => (
                      <>
                        <List
                          style={{ width: '100%' }}
                          component="div"
                          disablePadding
                          key={requirementSet.id}>
                          <ListItem
                            button
                            className={classes.nested}
                            style={{
                              backgroundColor:
                                activeTierRequirement?.id === requirementSet.id
                                  ? '#F8F8F8'
                                  : null,
                              width: '100%',
                            }}
                            onClick={() =>
                              handleTierRequirementClick(tier, requirementSet)
                            }>
                            <ListItemIcon
                              style={{
                                minWidth: 40,
                                marginLeft: 24,
                              }}>
                              <span
                                className={`${classes.tierIcon} ${
                                  requirementSet.isCompleted
                                    ? classes.activeSectionIcon
                                    : classes.notActiveSectionIcon
                                }`}>
                                <IconButton>
                                  <Description
                                    style={{
                                      color: requirementSet.isCompleted
                                        ? '#fff'
                                        : '#BEBEBE',
                                    }}
                                  />
                                </IconButton>
                              </span>
                            </ListItemIcon>
                            <Text
                              className={
                                activeTierRequirement?.id === requirementSet.id
                                  ? classes.activeSection
                                  : classes.notActiveSection
                              }>
                              {requirementSet.name}
                            </Text>
                          </ListItem>
                        </List>
                      </>
                    ))}
                  </Collapse>
                </OnBoardingAccordion>
              </div>
            </>
          );
        })}
      </List>
    );
  }

  const getMinimumTierContent = () =>
    minimumTierRequirement
      ? null
      : // <div
        //   style={{
        //     paddingTop: '24px',
        //     paddingBottom: '24px',
        //     backgroundColor: 'rgba(255, 255, 255)',
        //   }}>
        //   <Text c={`${theme.palette.primary.main}`} s={14} tA="center">
        //     Minimum required level {minimumTierRequirement} to access app
        //   </Text>
        //   <Text
        //     c={`${theme.palette.primary.main}`}
        //     s={14}
        //     tA="center"
        //     style={{ marginTop: 4 }}
        //     bold>
        //     You are on level {userActiveTierLevel ?? 1}
        //   </Text>
        // </div>
        null;

  const renderBusinessSections = () => {
    if (!isBusinessGroup || !combinedSections) return null;
    
    const businessSections = combinedSections.filter(section => section.businessSection);
    if (businessSections.length === 0) return null;

    // Check if business onboarding is complete
    const isBusinessComplete = businessSections.every(section => section.completed);
    const completedCount = businessSections.filter(section => section.completed).length;
    const businessCompletedPercentage = businessSections.length > 0 
      ? Math.round((completedCount / businessSections.length) * 100) 
      : 0;

    const titleColor = isBusinessComplete ? '#2CB392' : `${theme.palette.primary.main}`;
    const titleBackground = isBusinessComplete
      ? 'rgba(232, 247, 244, 1)'
      : `${hexToRGBAWithOpacity(theme.palette.secondary.main, 0.1)}`;

    return (
      <List disablePadding={true} style={{ marginTop: 16 }}>
        <div style={{ display: 'flex' }}>
          <div 
            style={{ width: '100%', cursor: 'pointer' }}
            onClick={() => {
              // Switch to business onboarding mode
              if (typeof setIsUserOnboarding === 'function') {
                setIsUserOnboarding(false);
              }
            }}
          >
            <OnBoardingAccordion
              expanded={false}
              setExpanded={() => {}} // Disable expansion
              title="Business Onboarding"
              titleVariant={''}
              isTierDisable={true} // Disable accordion behavior
              titleColor={titleColor}
              titleBackground={titleBackground}
              completePercentage={`${businessCompletedPercentage}%`}
            >
              {/* Empty content */}
            </OnBoardingAccordion>
          </div>
        </div>
      </List>
    );
  };

  return horizontal ? (
    <div className={classes.horizontal}>
      {getMinimumTierContent()}
      {renderSection({ horizontal })}
      {renderBusinessSections()}
    </div>
  ) : (
    <>
      {getMinimumTierContent()}
      {renderSection({ horizontal })}
      {renderBusinessSections()}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: 1 * 16,
    marginLeft: 1 * 16,
    marginRight: 1 * 16,
    [theme.breakpoints.down(670)]: {
      justifyContent: 'space-evenly',
      paddingBottom: 0,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0.5 * 16,
    paddingLeft: theme.spacing(6),
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
      textAlign: 'center',
      padding: 1 * 16,
      paddingLeft: 1 * 16,
      margin: 'auto',
    },
    [theme.breakpoints.down(480)]: {
      padding: 0.5 * 16,
    },
  },
  icon: {
    marginRight: 1 * 16,
    [theme.breakpoints.down(950)]: {
      marginRight: 0,
      marginBottom: 0.5 * 16,
    },
    [theme.breakpoints.down(670)]: {
      marginBottom: 0.5,
    },
  },
  text: {
    [theme.breakpoints.down(670)]: {
      display: 'none',
    },
  },
  nested: {
    // marginLeft: 4,
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    marginBottom: 3.5,
  },
  nestedForSub: {
    paddingLeft: theme.spacing(11),
  },
  tierIcon: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    width: '40px',
    borderRadius: '50%',
  },
  activeSection: {
    color: '#BEBEBE',
    fontSize: 14,
  },
  notActiveSection: {
    color: '#BEBEBE',
    fontSize: 14,
  },
  activeSectionIcon: {
    color: '#ffffff',
    backgroundColor: '#2CB392',
  },
  notActiveSectionIcon: {
    color: '#BEBEBE',
    backgroundColor: '#EFEFEF',
  },
  activeIcon: {
    color: '#ffffff',
    backgroundColor: '#2CB392',
  },
}));
