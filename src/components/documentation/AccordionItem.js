import React from 'react';

import Text from 'components/outputs/Text';

import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Accordion = withStyles({
  root: {
    paddingLeft: 0,
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
    minHeight: 56,
    paddingLeft: 0,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
}))(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    paddingLeft: 0,
    display: 'flex',
    flexDirection: 'column',
  },
}))(MuiAccordionDetails);

export default function AccordionItem(props) {
  const {
    summary,
    title,
    children,
    initialOpen = false,
    titleVariant = 'h3',
  } = props;
  const [expanded, setExpanded] = React.useState(initialOpen);

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Accordion square expanded={expanded} onChange={handleChange(true)}>
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        expandIcon={<ExpandMoreIcon />}>
        {summary ? (
          summary
        ) : title ? (
          <Text variant={titleVariant} gutterBottom>
            {title}
          </Text>
        ) : null}
      </AccordionSummary>
      <AccordionDetails>
        <>{children}</>
      </AccordionDetails>
    </Accordion>
  );
}
