import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import Form from 'components/form';
import { verifyPaymentRequestChallenge } from 'screens/checkout/util/rehive';
import { useForm } from 'react-hook-form';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import { Box } from '@material-ui/core';

const defaultValues = {
  otp: '',
};

const formConfig = {
  title: '',
  defaultValues,
  submitLabel: 'SUBMIT',
  fields: ['otp'],
};

export default function WalletCheckoutRequest(props) {
  const { setInitiated, history, context } = props;
  const { invoice } = context;

  const classes = useStyles();
  const [isSubmitting, setSubmitting] = useState(false);

  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, getValues, setError, errors, setValue } = formMethods;
  const values = getValues();
  const inputPropsControl = formMethods;
  async function onSubmit() {
    setSubmitting(true);
    const resp = await verifyPaymentRequestChallenge(invoice?.id, values);

    if (resp?.status === 'success') {
      setInitiated(true);
    } else {
      setError('otp', {
        type: 'manual',
        message: resp?.data?.[0]?.includes('exceeds')
          ? 'Insufficient balance'
          : resp?.message ?? 'Unable to verify OTP',
      });
      setValue('otp', '');
    }
    setSubmitting(false);
  }
  const { payer_mobile_number } = invoice;

  if (!payer_mobile_number) {
    return (
      <PageContent>
        <Box pt={2} p={0.5}>
          <ErrorOutput>User mobile and email mismatch</ErrorOutput>
          <PageButtons
            layout="vertical"
            items={[
              {
                label: 'Back',
                onPress: () =>
                  history.push('/checkout/?request=' + invoice?.id),
              },
            ]}
          />
        </Box>
      </PageContent>
    );
  }

  return (
    <>
      <PageContent pb={0.5}>
        <div className={classes.inner}>
          <>
            <Text align="center" style={{ fontSize: 16 }}>
              Payment link sent to
            </Text>
            <Text
              align="center"
              color="primary"
              bold
              className={classes.amount}>
              {payer_mobile_number}
            </Text>
            {/* <div className={classes.row}>
              <>
                <Text width="auto">Did not receive link?</Text>
                <Button
                  label="Resend"
                  color="primary"
                  disabled
                  noPadding
                  variant="text"
                />
              </>
            </div> */}

            <Text align="center" variant="body2" className={classes.amount}>
              Customer can confirm payment on their device or type a one time
              payment pin below:
            </Text>
            {/* {errors?.otp?.message && (
              <ErrorOutput>{errors?.otp?.message ?? ''}</ErrorOutput>
            )} */}
          </>
        </div>
      </PageContent>
      <Form
        formConfig={{ ...formConfig, onSubmit }}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        noLayout
        inputPropsControl={inputPropsControl}
      />
    </>
  );
}

const useStyles = makeStyles(theme => ({
  inner: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    height: '100%',
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  amount: {
    padding: theme.spacing(1),
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  success: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '85%',
    width: '100%',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },

  icon: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));
