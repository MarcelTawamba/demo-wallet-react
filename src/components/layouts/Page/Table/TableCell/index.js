import React from 'react';
import { get } from 'lodash';

import { formatOutputValue, standardizeString } from 'util/general';
import MuiTableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';

import StatusCell from './StatusCell';
import AmountCell from './AmountCell';
import TextCell from './TextCell';
import ImageCell from './ImageCell';

export default function TableCell(props) {
  const {
    variant,
    value,
    row,
    standardize,
    skeleton,
    children,
    placeholder,
    ...restProps
  } = props;

  if (children) {
    return (
      <MuiTableCell {...restProps} key={row}>
        {children}
      </MuiTableCell>
    );
  }
  if (skeleton) {
    return (
      <MuiTableCell key={row} colSpan={2}>
        {skeleton}
      </MuiTableCell>
    );
  }
  let valueFormatted = formatOutputValue(
    typeof value === 'function' ? value(row, props) : get(row, value, children),
    variant ? variant : '',
  );
  if (valueFormatted === 'Invalid date') {
    valueFormatted = '';
  }
  if (!valueFormatted && placeholder) {
    valueFormatted = placeholder;
  }
  if (standardize) {
    valueFormatted = standardizeString(valueFormatted);
  }

  switch (variant) {
    case 'status':
      return <StatusCell {...props} value={valueFormatted} />;

    case 'amount':
      return <AmountCell {...props} row={row} value={valueFormatted} />;

    case 'image':
      return <ImageCell {...props} row={row} value={valueFormatted} />;

    default:
      return <TextCell {...props} value={valueFormatted} />;
  }
}
