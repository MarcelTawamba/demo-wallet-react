import React from 'react';

import Layout from 'screens/checkout/components/Layout';
import ExpiredTimer from 'screens/checkout/components/ExpiredTimer';
import PageContent from 'components/layout/page/PageContent';
import CustomProcessorPending from './CustomProcessorPending';
import CustomProcessorMonitoring from './CustomProcessorMonitoring';

export default function CustomProcessorCheckoutPage(props) {
  const { state } = props;
  const customProcessorState = state?.value?.running?.custom;

  return (
    <Layout {...props} headerRight={<ExpiredTimer {...props} />}>
      <PageContent>
        {customProcessorState === 'monitoring' ? (
        //   <CustomPending {...props} />
            <CustomProcessorMonitoring {...props} />
        ) : (
          <CustomProcessorPending {...props} />
        )}
      </PageContent>
    </Layout>
  );
}
