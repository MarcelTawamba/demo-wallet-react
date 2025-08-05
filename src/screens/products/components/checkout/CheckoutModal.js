import React, { useState } from 'react';
import Modal from 'components/layout/Modal';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { SimpleImg } from 'react-simple-img';
import { View } from 'components/layout/View';
import { formatAmountString, objectToArray } from 'util/general';
import { useConversion } from 'util/rates';
import { currentCompanySelector } from 'redux/auth/selectors';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import Text from 'components/outputs/Text';
import ErrorOutput from 'components/common/outputs/Error';
import { Button } from 'components/inputs/Button';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import CurrencyCard from 'screens/accounts/components/currency/CurrencyCard';
import CardTitle from 'components/card/CardTitle';

export default function CheckoutModal(props) {
  const {
    open,
    onDismiss,
    onConfirm,
    cartContext: {
      currency,
      cart: { total_price, seller },
    },
  } = props;

  const wallets = useSelector(walletsSelector);
  const company = useSelector(currentCompanySelector);
  const rates = useSelector(conversionRatesSelector);

  const [loading, setLoading] = useState(false);

  const primaryAccount = objectToArray(wallets?.accounts ?? {})?.find(
    x => x.primary,
  );

  const insufficientFunds =
    total_price >
    (primaryAccount?.currencies?.[currency?.code]?.available_balance ?? 0);

  const { convAvailable } = useConversion(total_price, rates, currency, true);

  function handleSubmit() {
    if (!onConfirm) return;

    setLoading(true);

    onConfirm().finally(() => setLoading(false));
  }

  const classes = useStyles({ ...props });
  const icon = null;

  return (
    <Modal
      open={open}
      onDismiss={onDismiss}
      maxWidth={500}
      borderRadius={20}
      disableBackdropClick={loading}>
      <div className={classes.logo}>
        {Boolean(icon) ? (
          <SimpleImg
            style={{
              maxHeight: 140,
              maxWidth: 140,
              borderRadius: 200,
            }}
            imgStyle={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
            }}
            alt="rehive"
            src={icon}
          />
        ) : (
          <PlaceholderImage name="businessIcon" width={140} />
        )}
      </div>
      <View mt={1} mb={0.5}>
        <Text fontWeight={'700'} style={{ fontSize: 25, textAlign: 'center' }}>
          {seller?.name ?? company?.name}
        </Text>
      </View>
      <Text
        fontWeight={'700'}
        myColor={'primary'}
        style={{ fontSize: 35, textAlign: 'center' }}>
        {formatAmountString(total_price, currency, true)}
      </Text>
      {convAvailable && (
        <Text style={{ fontSize: 14, textAlign: 'center' }}>
          {convAvailable}
        </Text>
      )}

      {wallets?.multipleAccounts && (
        <div className={classes.accountCard}>
          <CardTitle
            {...{
              title: primaryAccount?.label,
              icon: 'general',
              subtitle: '',
              onPress: () => {},
              titleScale: 'h6',
              textStyleTitle: { fontWeight: '500' },
            }}
          />
        </div>
      )}

      <View mv={1}>
        <CurrencyCard
          onPress={() => {}}
          item={
            wallets?.accounts?.[wallets?.primaryAccount]?.currencies?.[
              currency?.code
            ]
          }
          containerCurrency={currency}
          align={'left'}
          disabled
          // rates={rates}
        />
      </View>
      {insufficientFunds && <ErrorOutput id="insufficient_funds" />}
      <Button
        id="confirm_payment"
        capitalize
        wide
        color="primary"
        loading={loading}
        onPress={handleSubmit}
        disabled={insufficientFunds}
      />
    </Modal>
  );
}

const useStyles = makeStyles(theme => ({
  logo: {
    borderRadius: 140,
    height: 140,
    overflow: 'hidden',
    marginTop: theme.spacing(3),
    margin: 'auto',
    backgroundColor: theme.palette.primary.contrastText,
    width: 140,
    minHeight: 140,
    minWidth: 140,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountCard: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
    border: '1px solid #efefef',
    borderRadius: 12,
  },
}));
