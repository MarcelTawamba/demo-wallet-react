import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import moment from 'moment';

import Form from 'components/layout/Form';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { useHistory } from 'react-router-dom';

import Spinner from 'components/outputs/Spinner';
import Text from 'components/outputs/Text';
import { createManagerRedemption, verifyManagerVoucherCode } from 'util/rehive';
import ErrorOutput from 'components/outputs/Error';
import OutputList from 'components/lists/OutputList';

export default function ReedemVoucherResultPage(props) {
  const { code, setCode, setError, error, context = {} } = props;
  const { seller } = context;
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [voucher, setVoucher] = useState('');

  useEffect(() => {
    async function redeemVoucher() {
      const resp = await verifyManagerVoucherCode(seller?.id, { code });
      if (resp.status === 'purchased') {
        setVoucher(resp);
      } else {
        setError('Unable to redeem voucher');
      }
      setLoading(false);
    }
    if (code) {
      setLoading(true);
      redeemVoucher();
    } else {
      history.push('/pos/redeem_voucher/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleConfirm() {
    setLoading(true);
    const resp = await createManagerRedemption(seller?.id, { code });
    if (resp.status === 'Complete') {
      setSuccess(true);
      setVoucher();
    } else {
      setError('Unable to redeem voucher');
    }
    setLoading(false);
  }

  function handleComplete() {
    setError('');
    setCode('');
    history.push('/pos/redeem_voucher/');
  }

  let actions = [];
  if (voucher) {
    actions.push({
      id: 'confirm',
      capitalize: true,
      loading,
      disabled: loading,
      onClick: handleConfirm,
    });
  }

  actions.push({
    id: success ? 'redeem_another' : 'cancel',
    variant: success ? 'contained' : 'text',
    onClick: handleComplete,
  });

  return (
    <Form center>
      <PageTitle
        handleBack={() => history.push('/pos/redeem_voucher/')}
        back={!loading}
        align="center"
        id="redeem_voucher"
      />
      <PageContent>
        <ErrorOutput>{error}</ErrorOutput>
        {loading ? (
          <>
            <Spinner />
            <Text p={1} align="center" id="processing_" />
          </>
        ) : success ? (
          <Text
            p={1}
            align="center"
            id="voucher_redeem_success_message"
            context={{ code }}
          />
        ) : voucher ? (
          <>
            <Text
              p={1}
              align="center"
              id="redeem_voucher_confirmation"
              context={{ code }}
            />
            <OutputList
              ph={0.5}
              items={[
                {
                  id: 'product',
                  value: get(voucher, ['product', 'name']),
                },
                {
                  id: 'date_purchased',
                  value: moment(get(voucher, ['order', 'placed'])).format(
                    'lll',
                  ),
                },
              ]}
            />
          </>
        ) : null}
      </PageContent>
      <PageButtons layout="vertical" items={actions} />
    </Form>
  );
}
