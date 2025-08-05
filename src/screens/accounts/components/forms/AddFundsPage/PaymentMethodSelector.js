import React from 'react';
import { get } from 'lodash';
import ModalSelector from 'components/inputs/ModalSelector';
import { standardizeString } from 'util/general';
import CardTitle from 'components/card/CardTitle';
import StripePayment from './StripePayment';
import PaymentMethodSkeleton from './PaymentMethodSkeleton';

const PaymentMethodSelector = props => {
  let {
    formikProps,
    hide,
    currency,
    cardPaymentMethods,
    providers,
    loading,
    ...restProps
  } = props;
  if (!formikProps || hide) {
    return null;
  }

  const { values, setFieldValue } = formikProps;
  const { paymentMethod, stripeId } = values;

  function updateValue(item) {
    setFieldValue(
      'paymentMethod',
      item.type === 'card' ? 'stripe_card' : item.type,
    );
    setFieldValue('stripeId', item.type === 'card' ? item.id : '');
  }

  const hasCard = providers.includes('stripe_card');
  const hasBank = providers.includes('bank');
  let data = [];

  if (hasBank) {
    data = [{ id: 'bank', type: 'bank' }];
  }
  if (hasCard) {
    data = data.concat(cardPaymentMethods);
  }

  let value = {
    id: 'bank',
    type: 'bank',
  };
  if (paymentMethod === 'stripe_card') {
    if (!stripeId) {
      value = cardPaymentMethods[0];
    } else {
      value = cardPaymentMethods.find(item => item.id === stripeId);
    }
  }

  return (
    <ModalSelector
      skeletonComp={<PaymentMethodSkeleton />}
      noBorder
      style={{ width: '100%', paddingTop: 8 }}
      title="Select payment method"
      value={value}
      onValueChange={updateValue}
      renderItem={item => <PaymentMethodSelectorCard item={item} />}
      keyExtractor={item => (item && item.id ? item.id : '')}
      footerComp={
        <StripePayment formikProps={formikProps} currency={currency} />
      }
      loading={loading}
      data={data}
      {...restProps}
    />
  );
};

export default PaymentMethodSelector;

const config = {
  stripe_card: {
    title: 'Card',
  },
};

export const PaymentMethodSelectorCard = props => {
  let { item, ...restProps } = props;
  if (!item) {
    return <div stlye={{ padding: 8, width: '100%' }} />;
  }
  const { type = '', card } = item;
  let title = get(config, [item.type, 'title'], standardizeString(item.type));
  let description = '';
  let brand = '';
  let brandIcon = false;

  if (type.match(/stripe_card|card/) && card) {
    brand = get(card, ['brand']);
    brandIcon = brand.match(/visa|amex|mastercard/);
    if (brandIcon) {
      title = title + ' **' + get(card, ['last4']);
    } else {
      description =
        standardizeString(brand ? brand : 'Other') +
        ' **' +
        get(card, ['last4']);
    }
  }

  return (
    <div stlye={{ padding: 8, width: '100%' }} {...restProps}>
      <CardTitle
        containerStyle={{ width: '100%' }}
        title={title}
        subtitle={description}
        badge={brandIcon ? brand : ''}
        icon={item.type}
      />
    </div>
  );
};
