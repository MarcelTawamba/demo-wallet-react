import React from 'react';
import Layout from 'screens/checkout/components/Layout';
import PaymentSuccess from '../components/PaymentSuccess';

export default function SuccessPage(props) {
  return (
    <Layout {...props}>
      <PaymentSuccess {...props} />
    </Layout>
  );
}
