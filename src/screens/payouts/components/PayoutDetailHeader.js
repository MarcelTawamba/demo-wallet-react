import React from 'react';

import { Box } from '@material-ui/core';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import Status from 'components/outputs/Status';
import { formatAmountString } from 'util/general';
import { Button } from 'components/inputs/Button';
// import en from '../config/locales';

export default function PayoutDetailHeader(props) {
  const { item } = props;
  if (!item) return null;
  const { amount, currency, status, id } = item;

  return (
    <Box
      flexDirection="row"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      pb={2}
      width="100%">
      <Box>
        <Text width="auto" variant="h5" id="payout" paragraph />
        <Box flexDirection="row" display="flex">
          <Text variant="h5" bold color="primary" width="auto">
            {formatAmountString(amount, currency, true)}
          </Text>
          <Box pl={2} pr={1}>
            <Status>{standardizeString(status)}</Status>
          </Box>
        </Box>
      </Box>
      <Button
        size="small"
        color="primary"
        // variant="outlined"
        disabled
        noPadding
        // onPress={handleEdit}
        id="refund"
      />
    </Box>
  );
}
