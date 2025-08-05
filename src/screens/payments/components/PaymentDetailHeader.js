import React from 'react';

import { Box } from '@material-ui/core';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import Status from 'components/outputs/Status';
import { formatAmountString } from 'util/general';
import { Button } from 'components/inputs/Button';
import en from '../config/lang';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import ChevronForwardIcon from '@material-ui/icons/ChevronRight';

export default function PaymentDetailHeader(props) {
  const { item, history } = props;
  // console.log('PaymentDetailHeader -> props', props);
  if (!item) return null;
  const { amount, currency, status, id } = item;

  function handleBack() {
    history.push('/payments/');
  }
  const isRtl = document.dir === 'rtl';

  return (
    <Box
      flexDirection="row"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      pb={2}
      width="100%">
      <Box>
        <Box
          style={{
            cursor: 'pointer',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={handleBack}>
          {isRtl ? (
            <ChevronForwardIcon
            color="action"
              fontSize="medium"
              style={{
                margin: '-1px -6px 0px 2px',
              }}
            />
          ) : (
            <ChevronBackIcon
            color="action"
              fontSize="medium"
              style={{
                margin: '-1px 2px 0px -6px',
              }}
            />
          )}
          <Text width="auto" s={14} id="back" />
        </Box>
        <Box flexDirection="row" display="flex">
          <Text
            id="payment_id_header"
            context={{ paymentId: id }}
            s={20}
            c="fontDark"
            fontWeight={500}
          />
          <Box pl={2} pr={1}>
            <Status>{standardizeString(status)}</Status>
          </Box>
        </Box>
        <Box marginTop={0.5}>
          <Text color="primary" s={24} fontWeight={700}>
            {formatAmountString(amount, currency, true)}
          </Text>
        </Box>
      </Box>
      {/* <Button
        size="small"
        color="primary"
        // variant="outlined"
        disabled
        noPadding
        // onPress={handleEdit}
      >
        {en.refund}
      </Button> */}
    </Box>
  );
}
