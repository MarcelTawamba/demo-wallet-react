import React, { useState } from 'react';
import { SimpleImg } from 'react-simple-img';

import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import QRCode from 'qrcode';

export default function WalletCheckoutScan(props) {
  const { context, quote } = props;
  const { invoice, business } = context;
  const [imageSrc, setImageSrc] = useState();

  const { request_currency: currency, id, user, request_reference } = invoice;

  const paymentQRString = 'rehive:' + user?.id + '?request_id=' + id;
  QRCode.toDataURL(paymentQRString)
    .then(res => {
      setImageSrc(res);
    })
    .catch(err => {
      console.error(err);
    });
  return (
    <PageContent>
      <SimpleImg height={300} width={300} src={imageSrc} />
      <Spinner pb={3} />
      <Text color="primary" variant={'h5'} align={'center'}>
        Awaiting payment
      </Text>
    </PageContent>
  );
}
