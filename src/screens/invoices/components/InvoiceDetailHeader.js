import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Box, CircularProgress } from '@material-ui/core';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import Status from 'components/outputs/Status';
import { formatAmountString } from 'util/general';
// import { Button } from 'components/inputs/Button';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import MuiSwitch from '@material-ui/core/Switch';
import { updateBusinessInvoice } from 'util/rehive';
import { useTranslation } from 'react-i18next';

export default function InvoiceDetailHeader(props) {
  const { t } = useTranslation(['common']);
  const { item, history, context, setItem } = props;
  const { business } = context;

  const [isSubmitting, setSubmitting] = useState(false);
  const {
    id,
    status,
    request_reference: reference = '',
    updated,
    request_amount: amount,
    request_currency: currency = {
      code: 'USD',
      display_code: 'USD',
      description: 'United States Dollar',
      symbol: '$',
      unit: 'dollar',
      divisibility: 2,
    },
    send_reminders,
    refunded,
  } = item;
  const isDraft = status === 'draft';
  function handleEdit() {
    history.push('edit/');
  }

  async function handleSubmit() {
    setSubmitting(true);
    const resp = await updateBusinessInvoice(business?.id, id, {
      send_reminders: !send_reminders,
    });
    if (resp?.status === 'success') {
      setItem(resp?.data);
    }
  }
  useEffect(() => {
    if (isSubmitting) {
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const ReminderComp = (
    <FormControlLabel
      labelPlacement="start"
      loading={isSubmitting}
      disabled={isSubmitting}
      style={{ whiteSpace: 'pre', position: 'relative' }}
      size="small"
      control={
        <>
          <MuiSwitch
            size="small"
            onChange={e => handleSubmit()}
            checked={send_reminders}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <CircularProgress
              size={20}
              style={{ position: 'absolute', right: 9 }}
            />
          )}
        </>
      }
      label={t('send_reminders')}
    />
  );

  return (
    <Box>
      <Box flexDirection="row" pb={2} display="flex" alignItems="center">
        {/* <Text width="auto" variant="h5" style={{ paddingBottom: 4 }}>
          {'Invoice #' + reference}
        </Text> */}
        <Text variant="h5" bold color="primary" width="auto">
          {formatAmountString(amount, currency, true)}
        </Text>
        <Box pl={2} pr={1}>
          <Status>{standardizeString(status)}</Status>
        </Box>
        {refunded && (
          <Box pl={1} pr={1}>
            <Status>{'Refunded'}</Status>
          </Box>
        )}
        <Text width="auto" opacity={0.67}>
          {'Last saved ' + moment(updated).fromNow()}
        </Text>
        <Box
          flexDirection="row"
          display="flex"
          justifyContent="flex-end"
          flex={1}
          pr={1}>
          {ReminderComp}
        </Box>
      </Box>
      {/* <Box
        pb={2}
        pr={1}
        flexDirection="row"
        justifyContent="space-between"
        display="flex">
        <Text variant="h5" bold color="primary">
          {formatAmountString(amount, currency, true)}
        </Text>

      </Box> */}

      {/* {isDraft && (
        <Box
          pb={2}
          pr={1}
          flexDirection="row"
          justifyContent="space-between"
          display="flex">
          <Button
            size="small"
            color="primary"
            variant="outlined"
            noPadding
            onPress={handleEdit}>
            Edit draft
          </Button>
        </Box>
      )} */}
    </Box>
  );
}
