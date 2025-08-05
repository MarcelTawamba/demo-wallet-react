import React from 'react';

import AccordionMui from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const Accordion = props => {
  const {
    expanded,
    onChange,
    summary,
    detail,
    backgroundColor = 'white',
    noBorder,
  } = props;
  return (
    <div
      style={{
        borderTop: noBorder ? '' : '1px solid #EFEFEF',
        width: '100%',
        backgroundColor,
      }}>
      <AccordionMui
        elevation={0}
        style={{
          width: '100%',
          borderTop: '0px',
          borderBottom: '0px',
          paddingLeft: 0,
          marginLeft: 0,
          backgroundColor,
        }}
        expanded={expanded}
        onChange={onChange}>
        <AccordionSummary>{summary}</AccordionSummary>
        <AccordionDetails>{detail}</AccordionDetails>
      </AccordionMui>
    </div>
  );
};

export default Accordion;
