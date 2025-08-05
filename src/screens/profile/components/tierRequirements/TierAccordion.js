import React from 'react';
import Text from 'components/outputs/Text';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { ArrowForwardIos, Done } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { View } from 'components/layout/View';
import SectionListHeader from 'components/lists/SectionListHeader';
import Icon from 'components/outputs/NewIcon';
const useStyles = makeStyles(theme => ({
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
    minHeight: 24,
    minWidth: 24,
    borderRadius: 100,
    marginRight: 4,
    // paddingRight: 30,
  },
}));
const Accordion = withStyles({
  root: {
    border: '1px solid #e4dada',
    borderRadius: 10,
    marginBottom: 14,
    paddingLeft: 6,

    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded:last-child': {
      marginBottom: 14,
    },
    '&$expanded': {
      marginBottom: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    marginBottom: 0,
    height: '38px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
    '&$expanded': {
      minHeight: 0,
    },
  },
  content: {
    '&$expanded': { margin: '12px 0' },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    paddingLeft: 28,
    paddingRight: 6,
    paddingBottom: 0,
    paddingTop: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}))(MuiAccordionDetails);

export default function TierAccordion(props) {
  const {
    title,
    children,

    titleBackground,
    setExpanded,
    expanded,
    isTierDisable,
    level,
    status,
  } = props;

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const classes = useStyles();
  //   const status = "pending"

  return (
    <div style={{ width: '100%' }}>
      <Accordion
        square
        expanded={isTierDisable ? false : expanded === level}
        onChange={handleChange(level)}>
        <AccordionSummary
          expandIcon={
            expanded === level
              ? !isTierDisable && (
                  <KeyboardArrowDownIcon
                    style={{ marginLeft: 12, fontSize: '28px' }}
                  />
                )
              : !isTierDisable && (
                  <KeyboardArrowRightIcon
                    style={{ marginRight: 12, fontSize: '28px' }}
                  />
                )
          }
          aria-controls="panel1d-content"
          id="panel1d-header"
          style={{
            backgroundColor: titleBackground,
          }}>
          <View w={'100%'} aI={'center'} fD={'row'}>
            {/* <Done
              style={{
                // color: '#fff',
                color: '#2CB392',
                borderRadius: '50%',
                padding: '6px',
                fontSize: '2rem',
                // marginRight: 8,
              }}
            /> */}
            <div className={classes.status}>
              <Icon
                icon={
                  status === 'pending'
                    ? 'Hourglass'
                    : status
                    ? 'check'
                    : 'errorOutline'
                }
                circled={false}
                color={
                  status === 'pending'
                    ? 'fontLight'
                    : status
                    ? '#0daf2e'
                    : '#CC2538'
                }
              />
            </div>
            {title ? (
              <View>
                <SectionListHeader
                  textStyle={{ fontSize: 15 }}
                  navigateTo="/onboarding"
                  notShow={true}
                  navigationState={{ tierLevel: level }}>
                  {title}
                </SectionListHeader>
              </View>
            ) : null}
          </View>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
