import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import LottieImage from 'components/outputs/LottieImage';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import PageButtons from 'components/layout/page/PageButtons';

import { getSEP24Transaction } from 'util/rehive';


const status_messages = {
  'deposit': {
    'initiated': {
      'display_status': 'Initiated',
      'message': 'Your purchase has been initiated.'
    },
    'initiated_invoicing': {
      'display_status': 'Invoicing Initiated',
      'message': 'Transaction details collected.'
    },
    'prs_requested': {
      'display_status': 'Invoicing Initiated',
      'message': 'An invoice has been generated and requires payment.'
    },
    'prs_quoted': {
      'display_status': 'Invoicing Initiated',
      'message': 'An invoice has been generated and requires payment.'
    },
    'prs_processing': {
      'display_status': 'Invoice Processing',
      'message': 'An external deposit is detected and being processed.'
    },
    'prs_complete': {
      'display_status': 'Invoice Completed',
      'message': 'External deposit has been completed. The Anchor will process the transaction shortly.'
    },
    'processing_internal_dispersal': {
      'display_status': 'Processing Internal Dispersal',
      'message': 'The Anchor is processing the transaction'
    },
    'completed_internal_dispersal': {
      'display_status': 'Completed Internal Dispersal',
      'message': "The Anchor's internal processing is complete. A Stellar transaction should be initiated shortly."
    },
    'processing_external_dispersal': {
      'display_status': 'Processing On-chain Dispersal',
      'message': 'A Stellar transaction has been initiated and should reflect in your wallet soon.'
    },
    'completed_external_dispersal': {
      'display_status': 'Completed On-chain Dispersal',
      'message': 'The Stellar transaction is Complete and your wallet should reflect a new balance.'
    },
    'complete': {
      'display_status': 'Anchor Purchase Completed',
      'message': 'The Stellar transaction has completed on-chain and your wallet should reflect a new balance.'
    },
    'failed': {
      'display_status': 'Failed',
      'message': 'An error occured during the processing of your Anchor purchase.'
    },
  },
  'withdraw': {
    'initiated': {
      'display_status': 'Initiated',
      'message': 'Your purchase has been initiated.'
    },
    'initiated_invoicing': {
      'display_status': 'Invoicing Initiated',
      'message': 'Transaction details collected.'
    },
    'prs_requested': {
      'display_status': 'Invoicing Initiated',
      'message': 'An invoice has been generated and requires payment.'
    },
    'prs_quoted': {
      'display_status': 'Invoicing Initiated',
      'message': 'An invoice has been generated and requires payment.'
    },
    'prs_processing': {
      'display_status': 'Invoice Processing',
      'message': 'An external deposit is detected and being processed.'
    },
    'prs_complete': {
      'display_status': 'Invoice Completed',
      'message': 'External deposit has been completed. The Anchor will process the transaction shortly.'
    },
    'processing_internal_dispersal': {
      'display_status': 'Processing Internal Dispersal',
      'message': 'The Anchor is processing the transaction'
    },
    'completed_internal_dispersal': {
      'display_status': 'Completed Internal Dispersal',
      'message': "The Anchor's internal processing is complete. A Stellar transaction should be initiated shortly."
    },
    'processing_external_dispersal': {
      'display_status': 'Processing External Withdrawal',
      'message': 'An external withdrawal transaction has been initiated and should reflect in your account soon.'
    },
    'completed_external_dispersal': {
      'display_status': 'Completed External Withdrawal',
      'message': 'An external withdrawal transaction has completed and your account balance should update shortly.'
    },
    'complete': {
      'display_status': 'Anchor Withdrawal Completed',
      'message': 'Your withdrawal has been completed and should reflect soon.'
    },
    'failed': {
      'display_status': 'Failed',
      'message': 'An error occured during the processing of your Anchor purchase.'
    },
  }
  
}

export default function TransactionInfo(props) {
  const { state, sep24Args } = props;
  const history = useHistory()
  const classes = useStyles();


  let buttons = [];

  buttons.push({
    label: 'Close',
    variant: 'text',
    onPress: () => history.push('/'),
  });

  const enabled = true;
  const sep24tx = useQuery(
    ['transaction'],
    async () => getSEP24Transaction(sep24Args.transaction_id, state.testnet),
    {
      enabled,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    },
  );

  const transaction = sep24tx?.data?.data

  function renderContent() {
    console.log(transaction)
    let transaction_info = status_messages['deposit'];
    if (transaction !== null) {
      transaction_info = status_messages[transaction?.tx_type]
    }
    console.log(transaction_info)
    if (sep24tx.isLoading || transaction === undefined) {
      return (
        <div className={classes.success}>
            <div className={classes.icon}>
              <LottieImage
                  name='loading'
              />
            </div>
            <PageContent>
              <Text variant={'h6'} align={'center'} color="primary">
                Getting transaction information
              </Text>
            </PageContent>
        </div>
      )
    } else {
      return (
          <div className={classes.success}>
            <div className={classes.icon}>
              <LottieImage
                  name={transaction?.status === 'complete' ? 'success' : transaction?.status === 'failed' ? 'failed' : 'loading'}
              />
            </div>
            <PageContent>
              <Text variant={'h5'} align={'center'} color="primary">
                {transaction_info[transaction?.status]?.display_status}
              </Text>
              <p></p>
              <Text variant={'subtitle2'} align={'center'} color="#222222">
                {transaction_info[transaction?.status]?.message}
              </Text>
            </PageContent>
          {!transaction?.status === 'initiated' && (
            <div className={classes.buttons}>
              <PageButtons layout="vertical" items={buttons} />
            </div>
          )}
        </div>
      )
    }
  }

  return renderContent();
}

const useStyles = makeStyles(theme => ({
    success: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '85%',
      width: '100%',
      alignItems: 'center',
    },
    buttons: {
      width: '100%',
    },
    icon: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  }));

