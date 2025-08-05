import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {
  calculateInvoiceTotal,
  multiplyDivisibility,
  toDivisibility,
} from 'util/general';
import AmountCell from 'components/layouts/Page/Table/TableCell/AmountCell';
import Text from 'components/outputs/Text';
import Big from 'big.js';

export default function ProductItemListFooter(props) {
  const { items, context } = props;
  const { currency = {} } = context?.business ?? {};
  const totalAmount = calculateInvoiceTotal(items);
  const totalFormatted = toDivisibility(
    Big(totalAmount),
    currency?.divisibility ?? 2,
  );
  return (
    <TableRow>
      <TableCell colSpan={3} align="right">
        <Text bold id="total" uppercase />
      </TableCell>
      <AmountCell
        {...props}
        align="right"
        row={{ currency }}
        value={totalFormatted}
      />
    </TableRow>
  );
}
