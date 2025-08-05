import React from 'react';
import Text from 'components/outputs/Text';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { View } from 'components/layout/View';

const Accordion = withStyles({
  root: {
    paddingLeft: 0,
    marginBottom: 20,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles(theme => ({
  root: {
    marginBottom: -1,
    height: '38px',
    paddingLeft: 40,
    width: '100%',
    minHeight: 37,
    display: 'flex',
    alignItems: 'center',
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
    paddingLeft: 0,
    paddingRight: 0,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}))(MuiAccordionDetails);

export default function OnBoardingAccordion(props) {
  const {
    title,
    children,
    titleVariant = 'h3',
    titleColor,
    titleBackground,
    completePercentage = '100 %',
    setExpanded,
    expanded,
    isTierDisable,
    level,
  } = props;

  const handleChange = panel => (event, newExpanded) => {
    // console.log('level', level);
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={{ width: '100%' }}>
      <Accordion
        square
        expanded={isTierDisable ? false : expanded === level}
        onChange={handleChange(level)}>
        <AccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          style={{
            backgroundColor: titleBackground,
          }}>
          <View w={'100%'} aI={'center'} jC={'space-between'} fD={'row'}>
            {title ? (
              <>
                <View>
                  <Text variant={titleVariant ?? 'p'} c={titleColor}>
                    {title}
                  </Text>
                </View>
                <View>
                  <Text variant={titleVariant ?? 'p'} c={titleColor}>
                    {completePercentage}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
}
