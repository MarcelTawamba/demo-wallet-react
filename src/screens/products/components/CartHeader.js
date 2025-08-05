import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { getCurrencyCode, paramsToObj } from 'util/general';
import CurrencySelector from './CurrencySelector';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCartOutlined';
import IconButton from 'components/inputs/IconButton';
import { primaryCurrenciesSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';
import { useCart } from '../util/contexts/CartContext';
import { configProductSelector } from 'redux/rehive/selectors';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // paddingBottom: theme.spacing(1),
  },
  title: {
    display: 'flex',
    // justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  selector: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'flex-end',
    width: '100%',
    // minWidth: 150,
    paddingRight: theme.spacing(1),
    // marginTop: 2,
    marginRight: '1rem',
  },
  badge: {
    position: 'absolute',
    height: 16,
    width: 16,
    right: 0,
    top: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 20,
    fontSize: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
  },
  icon: {
    width: 26,
    height: 26,
    layout: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 0,
    paddingTop: 4,
    paddingBottom: 4,
  },
}));

export default function CartHeader(props) {
  const { history, propPrimaryCurrencies } = props;
  const classes = useStyles();

  const cartContext = useCart();
  const { items, currency = {}, switchCart } = cartContext;
  const itemLength = items?.length ?? 0;
  const primaryCurrenciesFromRedux = useSelector(primaryCurrenciesSelector);
  const productConfig = useSelector(configProductSelector);
  
  // Use props or Redux data, but don't conditionally call hooks
  const primaryCurrencies = propPrimaryCurrencies ?? primaryCurrenciesFromRedux;

  let currencyOptions = primaryCurrencies?.items;

  if (productConfig?.currencies?.length > 0) {
    currencyOptions = currencyOptions.filter(
      item =>
        productConfig?.currencies.findIndex(
          curr => curr === item.currency.code,
        ) !== -1,
    );
  }

  const handleInitialCurrency = () => {
    const isCurrencyAvailable = currencyOptions.reduce((isAvailable, item) => {
      if (item.currency.code === currency.code) {
        return isAvailable | true;
      }

      return isAvailable;
    }, false);

    if (
      !isCurrencyAvailable &&
      currencyOptions.length &&
      currencyOptions[0]?.currency
    ) {
      switchCart(currencyOptions[0].currency);
    }
  };

  useEffect(() => {
    handleInitialCurrency();
  }, [propPrimaryCurrencies]);

  function handleCheckout() {
    const currencyCode = paramsToObj(history?.location?.search ?? '')?.currency;

    history.push(
      `/products/checkout/${currencyCode ? `?currency=${currencyCode}` : ''}`,
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.selector}>
        <CurrencySelector
          data={currencyOptions}
          currency={currency}
          handleChange={switchCart}
          renderDetailValue={item => getCurrencyCode(item?.currency)}
        />
      </div>
      <IconButton
        className={classes.iconButton}
        onClick={handleCheckout}
        disabled={!itemLength > 0}
        color={'primary'}>
        <div className={classes.icon}>
          {itemLength > 0 ? (
            <div className={classes.badge}>{itemLength}</div>
          ) : null}
          <ShoppingCartIcon />
        </div>
      </IconButton>
    </div>
  );
}
