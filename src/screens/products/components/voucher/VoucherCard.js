import React, { useState, useCallback } from 'react';
import { formatAmountString } from 'util/general';
import CardLayout from 'components/card/CardLayout';
import { get } from 'lodash';
import moment from 'moment';
import context from 'components/app/context';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import VoucherOutput from './VoucherOutput';
import ButtonList from 'components/lists/ButtonList';
import { updateVoucher } from 'util/rehive';
import StatusOutput from './StatusOutput';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const _VoucherCard = props => {
  const {
    item,
    index,
    detailObj,
    design,
    showModal,
    hideModal,
    noCard,
    showToast,
    // loading,
    onComplete,
  } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(480));

  const [redeeming, setRedeeming] = useState(false);
  const [loading, setLoading] = useState(false);

  const { product, order } = item;
  let voucher = product ?? item.item;

  voucher = { ...voucher, value: item.item.price };

  const redeemReward = useCallback(async () => {
    setLoading(true);
    const resp = await updateVoucher(item.id, 'redeemed');
    if (resp.status === 'success') {
      if (voucher && voucher.virtual_type === 'external') {
        showToast({
          text: 'Voucher successfully marked as redeemed',
          variant: 'success',
        });
      } else {
        showToast({
          text: 'Voucher successfully redeemed',
          variant: 'success',
        });
      }
      onComplete();
    } else {
      showToast({ text: 'Unable to redeem voucher', variant: 'error' });
    }
    setLoading(false);
  }, [item.id, onComplete, showToast, voucher]);

  const status =
    item.status === 'available' || item.status === 'purchased'
      ? 'available'
      : item.status === 'redeemed'
      ? 'redeemed'
      : '';

  const titleObj = {
    title: voucher ? voucher.name : '',
    subtitle:
      'Purchased at ' +
      moment(get(item, ['order', 'placed'])).format('HH:mm - MMM DD, yyyy'),
    onClick: () => detailObj.showDetail(index),
    icon: 'voucher',
  };

  const actionOne = {
    id: redeeming
      ? 'confirm'
      : !noCard
      ? 'view'
      : item.status === 'redeemed'
      ? ''
      : voucher.virtual_type === 'external'
      ? 'mark_as_redeemed'
      : voucher.virtual_redemption === 'user'
      ? 'redeem'
      : '',
    onClick: () => {
      noCard
        ? redeeming
          ? redeemReward()
          : setRedeeming(true)
        : props.showModal(index);
    },
    loading,
    capitalize: true,
    color: 'primary',
  };

  const actionTwo = {
    id: noCard && redeeming ? 'cancel' : '',
    capitalize: true,
    variant: 'text',
    // color: 'default',
    onClick: () => (noCard && redeeming ? setRedeeming(false) : null),
    disabled: false,
  };
  // const actionsObj = { primary: actionTwo, secondary: actionTwo };
  const redeemingMessage =
    voucher && voucher.virtual_type === 'external'
      ? 'external_voucher_redeem_confirmation'
      : 'voucher_redeem_confirmation';

  const contentObj = {
    // values,
    // text: noCard ? item.code : '',
    onClick: () => showModal(index), //handleStateChange('detail', index),
    disabled: false,
    text: (
      <Text
        style={{ textAlign: 'center' }}
        fontWeight="700"
        myColor={'primary'}
        s={24}>
        {formatAmountString(voucher.value, order.currency, true)}
      </Text>
    ),
    noPadding: true,
    content: (
      <View w={'100%'}>
        {noCard && (
          <View w={'100%'} h={matches ? 360 : 320}>
            <VoucherOutput item={item} small={redeeming} />
            {redeeming && (
              <View
                h={matches ? 140 : 80}
                w={'100%'}
                aI={'center'}
                jC={'flex-end'}
                p={2}
                pv={1}>
                <Text align={'center'} id={redeemingMessage} />
              </View>
            )}
          </View>
        )}
        {!noCard && (
          <View
            w={'100%'}
            jC={'space-between'}
            fD={'row'}
            aI={'flex-end'}
            p={0.5}
            // h={85}
            pt={0}>
            <StatusOutput>
              {status +
                (item.status === 'redeemed'
                  ? ' on ' + moment(get(item, ['updated'])).format('ll')
                  : '')}
            </StatusOutput>

            <ButtonList items={[actionTwo, actionOne]} />
            {/* <Button {...actionOne} /> */}
          </View>
        )}
      </View>
    ),
  };

  const cardObj = {
    titleObj,
    // actionsObj,
    contentObj,
    design: design.wallets,
  };

  return (
    <CardLayout
      noCard={noCard}
      onDismiss={hideModal}
      className="card"
      key={index}
      {...cardObj}
    />
  );
};

const VoucherCard = context(_VoucherCard);

export { VoucherCard };
