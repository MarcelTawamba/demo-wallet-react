import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import Text from 'components/outputs/Text';
import { displayFormatDivisibility, getCurrencyCode } from 'util/general';

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
    // textOverflow: 'ellipsis',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    // minHeight: 46,
    // height: '100%',
  },
  amount: {
    minWidth: 80,
    fontSize: 14,
  },
  currency: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function AmountCell(props) {
  const { value = 0, row = {}, context } = props;

  const currency = row?.currency ??
    row?.request_currency ??
    context?.business?.currency ?? {
      code: 'USD',
      display_code: 'USD',
      description: 'United States Dollar',
      symbol: '$',
      unit: 'dollar',
      divisibility: 2,
    };
  const classes = useStyles();

  return (
    <TableCell key={value}>
      <div className={classes.container}>
        <Text noWrap className={classes.amount} c="fontDark" width="auto">
          {displayFormatDivisibility(value ?? 0, currency?.divisibility)}
        </Text>
        <Text
          noWrap
          className={classes.currency}
          variant="body2"
          opacity={0.67}
          width="auto">
          {getCurrencyCode(currency)}
        </Text>
      </div>
    </TableCell>
  );
}
