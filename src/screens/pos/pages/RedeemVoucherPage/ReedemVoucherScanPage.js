import React from 'react';

import Form from 'components/layout/FormNew';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { useHistory } from 'react-router-dom';

import QrReader from 'react-qr-reader';

export default function ReedemVoucherScanPage(props) {
  const { setCode, setError } = props;
  const history = useHistory();

  function handleScan(data) {
    if (data) {
      setCode(data);
      setError('');
      history.push('/pos/redeem_voucher/result/');
    }
  }
  function handleError(err) {
    console.log('handleError -> err', err);
    if (err) {
      setError(err);
      // history.push('/pos/redeem_voucher/result/');
    }
  }

  return (
    <Form center>
      <PageTitle
        handleBack={() => history.push('/pos/redeem_voucher/')}
        back
        align="center"
        id="redeem_voucher"
      />
      <PageContent>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </PageContent>
      <PageButtons
        layout="vertical"
        items={[
          {
            id: 'input_code',
            variant: 'text',
            onClick: () => history.push('/pos/redeem_voucher/input/'),
          },
        ]}
      />
    </Form>
  );
}
