import React from 'react';

import Layout from 'screens/checkout/components/Layout';
import CryptoCheckoutWarningModal from './CryptoCheckoutWarningModal';
import ExpiredTimer from 'screens/checkout/components/ExpiredTimer';
import CryptoPending from './CryptoPending';
import CryptoMonitoring from './CryptoMonitoring';
import PageContent from 'components/layout/page/PageContent';
import CryptoProcessing from './CryptoProcessing';
import CryptoExpired from './CryptoExpired';

export default function CryptoCheckoutPage(props) {
  const { state } = props;
  const cryptoState = state?.value?.running?.crypto;

  return (
    <Layout {...props} headerRight={<ExpiredTimer {...props} />}>
      <PageContent>
        {cryptoState === 'processing' ? (
          <CryptoProcessing {...props} />
        ) : cryptoState === 'monitoring' ? (
          <CryptoMonitoring {...props} />
        ) : cryptoState === 'expired' ? (
          <CryptoExpired {...props} />
        ) : (
          <CryptoPending {...props} />
        )}
      </PageContent>
      <CryptoCheckoutWarningModal />
    </Layout>
  );
}
