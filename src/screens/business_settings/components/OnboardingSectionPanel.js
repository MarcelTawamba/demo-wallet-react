import React from 'react';
import { ListItem, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme as useThemeMui } from '@material-ui/core/styles';
import { findIndex } from 'lodash';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';

export default function OnboardingSectionPanel(props) {
  const { sections, activeSection, setCurrentStep } = props;
  const { id } = activeSection;
  const { colors } = useTheme();

  const activeSectionIndex = findIndex(sections, { id });

  const theme = useThemeMui();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const classes = useStyles();

  function renderSection(section, index) {
    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <Icon
            icon={section.icon}
            backgroundColor={
              index === activeSectionIndex ? colors.primary : '#EFEFEF'
            }
            color={index !== activeSectionIndex ? '#707070' : null}
            size={18}
          />
        </div>
        <Text
          className={classes.text}
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: index === activeSectionIndex ? colors.primary : '#BEBEBE',
          }}
          id={section.title}
        />
      </div>
    );
  }

  return (
    <React.Fragment>
      {horizontal ? (
        <div className={classes.horizontal}>
          {sections.map((section, index) => (
            <ListItem
              // button
              key={section?.id ?? section}
              disableGutters
              disabled={section.disabled}
              onClick={() => (section.disabled ? null : setCurrentStep(index))}>
              {renderSection(section, index)}
            </ListItem>
          ))}
        </div>
      ) : (
        sections.map((section, index) => (
          <ListItem
            // button
            key={section?.id ?? section}
            disableGutters
            disabled={section.disabled}
            onClick={() => (section.disabled ? null : setCurrentStep(index))}>
            {renderSection(section, index)}
          </ListItem>
        ))
      )}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    overflowX: 'scroll',
    [theme.breakpoints.down(738)]: {
      justifyContent: 'space-evenly',
      paddingBottom: 0,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(0.5),
    paddingLeft: 0,
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
      textAlign: 'center',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      margin: 'auto',
    },
    [theme.breakpoints.down(480)]: {
      padding: theme.spacing(0.5),
    },
  },
  icon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down(950)]: {
      marginRight: 0,
      marginBottom: theme.spacing(0.5),
    },
    [theme.breakpoints.down(738)]: {
      marginBottom: theme.spacing(0.5),
    },
  },
  text: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(738)]: {
      display: 'none',
    },
  },
}));
