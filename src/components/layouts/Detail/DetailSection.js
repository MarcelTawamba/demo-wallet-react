import React from 'react';
import { get } from 'lodash';

import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { standardizeString, formatOutputValue, isOdd } from 'util/general';
import OutputList from 'components/lists/OutputList';
import Output from 'components/outputs/Output';
import { useMediaQuery } from '@material-ui/core';
import DetailSectionLayout from './DetailSectionLayout';
import OutputTable from './OutputTable';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    width: '100%',
  },
  component: {
    width: '100%',
    height: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 650,
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 300,
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 300,
    overflow: 'scroll',
  },
  section: {
    width: '100%',
    padding: theme.spacing(1.5),
    paddingLeft: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    border: ({ variant }) => (variant ? '' : '1px solid #EFEFEF'),
    backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  footerOutput: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));

export default function DetailSection(props) {
  const { item, section, variant } = props;

  let {
    id,
    label,
    fields = [],
    table,
    actions,
    component,
    layout,
    rightField,
    variant: sectionVariant,
  } = section;
  if (!label) label = standardizeString(id);
  const classes = useStyles({ variant });
  const theme = useMuiTheme();
  const isRtl = theme.direction === 'rtl';
  const matches = useMediaQuery(theme.breakpoints.down(720));
  const split = matches || layout === 'single';

  if (typeof component === 'function') {
    return component(props);
  }

  const { length } = fields;
  const hasFooterOutput = Boolean(isOdd(length)) && !rightField;

  const half = Math.ceil(length / 2);
  function formatValue(field) {
    if (typeof field === 'string') {
      return {
        label: field,
        value: get(item, field),
      };
    }
    const {
      value,
      valueOverride,
      variant = '',
      condition,
      hideIfEmpty,
    } = field;
    let valueFormatted =
      valueOverride ??
      formatOutputValue(
        typeof value === 'function' ? value(item) : get(item, value),
        variant,
        item,
      );
    if ((condition && !condition(item)) || (hideIfEmpty && !valueFormatted)) {
      return null;
    }

    return {
      ...field,
      value: valueFormatted,
    };
  }
  const outputs = fields.map(formatValue).filter(item => item);
  if (outputs.length === 0 && !table) {
    return null;
  }
  const footerOutput = hasFooterOutput ? outputs.pop() : null;
  const firstHalf = rightField
    ? outputs
    : split
    ? outputs
    : outputs.splice(0, half - (hasFooterOutput ? 1 : 0));
  const secondHalf = rightField
    ? [formatValue(rightField)]
    : split
    ? []
    : outputs.splice(-half);

  return (
    <DetailSectionLayout {...props}>
      {length === 0 ? (
        <div style={{ height: 16 }}></div>
      ) : (
        <>
          <div className={classes.columns}>
            <OutputList
              pr={!split ? (isRtl ? 0 : 2) : 0}
              items={firstHalf}
              outputProps={{
                placeholderId: 'not_yet_provided',
                horizontal: !Boolean(variant),
                labelColor: Boolean(variant),
                labelBold: Boolean(variant),
                // align: 'right',
                sectionVariant,
              }}
            />
            <OutputList
              items={secondHalf}
              outputProps={{
                placeholderId: 'not_yet_provided',
                horizontal: !Boolean(variant),
                labelColor: Boolean(variant),
                labelBold: Boolean(variant),
                // align: 'right',
                sectionVariant,
              }}
            />
          </div>
        </>
      )}
      {hasFooterOutput && typeof footerOutput === 'object' && (
        <div className={classes.footerOutput}>
          <Output
            {...footerOutput}
            horizontal={!Boolean(variant)}
            labelColor={Boolean(variant)}
            labelBold={Boolean(variant)}
            sectionVariant={sectionVariant}
          />
        </div>
      )}
      {Boolean(table) && <OutputTable {...props} config={table} />}
    </DetailSectionLayout>
  );
}
