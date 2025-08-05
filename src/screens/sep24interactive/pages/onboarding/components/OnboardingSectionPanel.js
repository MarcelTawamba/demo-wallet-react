import React, { useState, useEffect } from 'react';
import { findIndex } from 'lodash';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { useTheme } from 'components/app/context';
import { ListItem, useMediaQuery } from '@material-ui/core';
import {
  makeStyles,
  withStyles,
  useTheme as UI_useTheme,
} from '@material-ui/core/styles';
import chroma from 'chroma-js';

export default function OnboardingSectionPanel(props) {
  let {
    combinedSections,
    activeSection,
    setCurrentStep,
    lockNavigation,
    isBusinessGroup,
  } = props;

  const { id } = activeSection;
  const { colors } = useTheme();

  const sections = [
    {
      value: 'user',
      title: 'user_onboarding',
      subSections: combinedSections?.filter(x => !x.businessSection),
    },
    {
      value: 'business',
      title: 'business_onboarding',
      hidden: !isBusinessGroup,
      subSections: combinedSections?.filter(x => x.businessSection),
    },
  ];

  const [expandedSection, setExpandedSection] = useState(sections?.[0]?.value);

  const activeSectionIndex = findIndex(combinedSections, { id });

  const theme = UI_useTheme();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const classes = useStyles();

  useEffect(() => {
    setExpandedSection(
      sections?.find(x => x.subSections.find(y => y.id === id))?.value,
    );
  }, [activeSectionIndex]);

  const handleExpandedChange = panel => (event, newExpanded) => {
    setExpandedSection(newExpanded ? panel : false);
  };

  const onSetCurrentStep = index => {
    setCurrentStep(index);
  };

  function renderSection({ value, title, subSections, horizontal }) {
    const content = (
      <>
        {subSections
          ?.filter(
            x =>
              !x.parent ||
              (x.parent && !subSections.find(y => y.id === x.parent)),
          )
          ?.map(x => {
            const index = findIndex(combinedSections, y => y.id === x.id);
            return (
              <ListItem
                button
                key={x?.id ?? x}
                disableGutters
                disabled={x.disabled || (lockNavigation && x?.id !== id)}
                onClick={() => onSetCurrentStep(index)}>
                {renderSubSection(x, index)}
              </ListItem>
            );
          })}
      </>
    );

    if (sections?.filter(x => !x.hidden)?.length === 1 || horizontal)
      return content;

    return (
      <Accordion
        square
        expanded={expandedSection === value}
        onChange={handleExpandedChange(value)}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
            <Text id={title} myColor={'primary'} s={14} />
            <Icon
              name={expandedSection === value ? 'arrowDropUp' : 'arrowDropDown'}
              circled={false}
              color={'primary'}
            />
          </View>
        </AccordionSummary>
        <AccordionDetails>{content}</AccordionDetails>
      </Accordion>
    );
  }

  function renderSubSection(section, index) {
    const childActive =
      combinedSections[activeSectionIndex]?.parent === section.id;

    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <Icon
            icon={
              section?.completed && index !== activeSectionIndex && !childActive
                ? 'Check'
                : section.icon
            }
            backgroundColor={
              index === activeSectionIndex || childActive
                ? colors.primary
                : section?.completed
                ? '#2BB292'
                : '#EFEFEF'
            }
            color={
              !section?.completed &&
              index !== activeSectionIndex &&
              !childActive
                ? '#BEBEBE'
                : null
            }
            size={18}
          />
        </div>
        <Text
          className={classes.text}
          style={{
            fontSize: 14,
            fontWeight: '500',
            color:
              index === activeSectionIndex || childActive
                ? colors.primary
                : '#BEBEBE',
          }}
          id={section.title}
        />
      </div>
    );
  }

  return horizontal ? (
    <div className={classes.horizontal}>
      {sections
        ?.filter(x => !x.hidden)
        ?.map(section => renderSection({ ...section, horizontal }))}
    </div>
  ) : (
    sections
      ?.filter(x => !x.hidden)
      ?.map(section => renderSection({ ...section, horizontal }))
  );

  // <React.Fragment>
  //   {horizontal ? (
  //     <div className={classes.horizontal}>
  //       {sections.map((section, index) => (
  //         <ListItem
  //           button
  //           key={section?.id ?? section}
  //           disableGutters
  //           disabled={lockNavigation && section?.id !== id}
  //           onClick={() => setCurrentStep(index)}>
  //           {renderSubSection(section, index)}
  //         </ListItem>
  //       ))}
  //     </div>
  //   ) : (
  //     sections.map((section, index) => (
  //       <ListItem
  //         button
  //         key={section?.id ?? section}
  //         disableGutters
  //         disabled={lockNavigation && section?.id !== id}
  //         onClick={() => setCurrentStep(index)}>
  //         {renderSubSection(section, index)}
  //       </ListItem>
  //     ))
  //   )}
  // </React.Fragment>
}

const Accordion = withStyles(theme => ({
  root: {
    boxShadow: 'none',
    marginBottom: theme.spacing(2),
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
      marginBottom: theme.spacing(2),
    },
  },
  expanded: {},
}))(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    background: `rgba(${chroma(theme.palette.primary.main)
      .alpha(0.11)
      .rgba()})`,
    marginBottom: -1,
    paddingLeft: theme.spacing(6),
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    margin: '6px 0',
    '&$expanded': {
      margin: '6px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    display: 'block',
    padding: 0,
  },
}))(MuiAccordionDetails);

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
}));
