import React from 'react';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';

export default function InvoiceModal(props) {
  const { variant } = props;

  return (
    <PageContent border>
      <Text>{variant}</Text>
    </PageContent>
  );
}
