import React, { useEffect } from 'react';
import { get } from 'lodash';
import makeStyles from '@material-ui/styles/makeStyles';
import { useSelector } from 'react-redux';
import Logo from 'components/rehive/Logo';
import Text from 'components/outputs/Text';
import { formatAmountString } from 'util/rates';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { userProfileSelector } from 'redux/rehive/selectors';
import SaleQR from './SaleQR';
import { configProductSelector } from 'redux/rehive/selectors';

function calculateInvoiceTotal(items) {
  let totalAmount = 0;

  items.forEach(item => {
    totalAmount =
      totalAmount + get(item, ['price'], 0) * get(item, ['quantity'], 1);
  });

  return totalAmount;
}

export default function SaleQRPage(props) {
  const { currency, business, services, rates, item, history } = props;
  const profile = useSelector(userProfileSelector);
  const productConfig = useSelector(configProductSelector);
  const { icon, name } = business;
  useEffect(() => {
    if (!item?.id) history.push('/pos/sales/');
  }, []);
  const { request_amount, request_currency } = item ?? {};
  const totalString = formatAmountString(
    request_amount,
    request_currency,
    true,
  );

  const items = item?.metadata?.service_business?.items ?? [];

  const simpleLayout = items.length < 2 && !get(items, [0, 'name']);
  const pageProps = {
    item,
    profile,
    itemArray: items,
    invoice: items,
    currency,
    amount: request_amount,
    totalString,
    simpleLayout,
    responsive: true,
    business,
    services,
    rates,
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      {!simpleLayout && (
        <div className={classes.formLeft}>
          <div className={classes.invoiceTitle}>
            <Logo
              noMargin
              height={36}
              width={36}
              image={icon}
              type="rehive-icon"
            />
            <Text className={classes.companyName}>{name}</Text>
          </div>
          <InvoicePage {...pageProps} productConfig={productConfig} />
        </div>
      )}
      <div className={simpleLayout ? classes.simpleLayout : classes.formRight}>
        {simpleLayout && (
          <div className={classes.invoiceTitleSimple}>
            <Logo
              height={36}
              width={36}
              image={icon}
              type="rehive-icon"
              noMargin
            />
            <Text className={classes.companyName} width="auto">
              {name}
            </Text>
          </div>
        )}
        <SaleQR {...pageProps} />
      </div>
    </div>
  );
}

function InvoicePage(props) {
  const classes = useStyles();
  const { currency, itemArray, productConfig, totalString } = props;
  if (!itemArray.length) {
    return <EmptyListMessage id="no_items" />;
  }
  const invoiceConfig = get(productConfig, ['sales', 'invoiceConfig'], {});
  const { showTax = false, showDiscount = false } = invoiceConfig;

  const emptyAmountString = formatAmountString(0, currency);

  return (
    <div className={classes.invoice}>
      <div className={classes.invoiceListItem}>
        <Text className={classes.nameTitle} variant="h6" id="name" uppercase />
        <Text
          align="right"
          className={classes.quantityTitle}
          variant="h6"
          id="qty"
          uppercase
        />
        <Text
          align="right"
          className={classes.priceTitle}
          variant="h6"
          id="price"
          uppercase
        />
      </div>
      <div className={classes.invoiceList}>
        {itemArray.map(({ name = '', quantity = 1, price = 0, id }) => (
          <div className={classes.invoiceListItem} key={id}>
            <Text className={classes.name}>{name}</Text>
            <Text align="right" className={classes.quantity}>
              {quantity}
            </Text>
            <Text align="right" className={classes.price}>
              {formatAmountString(quantity * price, currency)}
            </Text>
          </div>
        ))}
      </div>
      <div className={classes.invoiceTotals}>
        {(showDiscount || showTax) && (
          <div className={classes.invoiceTotalRow}>
            <Text
              variant="h6"
              bold
              align="right"
              className={classes.totals}
              id="subtotal"
              uppercase
            />
            <Text align="right" className={classes.price}>
              {totalString}
            </Text>
          </div>
        )}
        {showDiscount && (
          <div className={classes.invoiceTotalRow}>
            <Text
              bold
              align="right"
              className={classes.totals}
              variant="h6"
              id="discount"
              uppercase
            />
            <Text align="right" className={classes.price}>
              {'- ' + emptyAmountString}
            </Text>
          </div>
        )}
        {showTax && (
          <div className={classes.invoiceTotalRow}>
            <Text
              bold
              align="right"
              className={classes.totals}
              variant="h6"
              id="tax"
              uppercase
            />
            <Text align="right" className={classes.price}>
              {emptyAmountString}
            </Text>
          </div>
        )}
        <div className={classes.invoiceTotalRow}>
          <Text
            bold
            align="right"
            className={classes.totals}
            variant="h6"
            id="total"
            uppercase
          />
          <Text bold align="right" className={classes.price}>
            {totalString}
          </Text>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    [theme.breakpoints.down(720)]: {
      flexDirection: 'column',
    },
  },
  companyName: {
    paddingLeft: theme.spacing(2),
    fontSize: 25,
    color: '#222222',
    fontWeight: '600',
  },
  invoiceTitle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  invoiceTitleSimple: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  nameTitle: {
    width: '40%',
    fontWeight: '500',
  },
  quantityTitle: {
    width: '15%',
    fontWeight: '500',
  },
  priceTitle: {
    minWidth: 180,
    fontWeight: '500',
  },
  name: {
    width: '40%',
  },
  quantity: {
    width: '15%',
  },
  price: {
    minWidth: 180,
    maxWidth: 180,
  },
  totals: {
    width: '100%',
  },
  invoiceList: {
    width: '100%',
    // display: 'flex',
    // alignItems: 'center',
    // flexDirection: 'column',
    // padding: theme.spacing(1),
    // paddingTop: theme.spacing(2),
    // justifyContent: 'center',
  },
  simpleLayout: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    maxWidth: 450,
    border: '1px solid #EFEFEF',
    // paddingBottom: theme.spacing(2),
    width: '60%',
    // height: '90%',
    backgroundColor: 'white',
    [theme.breakpoints.down(720)]: {
      width: '100%',
    },
  },
  invoiceListItem: {
    width: '100%',
    display: 'flex',
    // alignItems: 'center',
    flexDirection: 'row',
    // padding: theme.spacing(1),
    paddingTop: theme.spacing(3),
    // justifyContent: 'center',
  },
  invoiceTotalRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    // justifyContent: 'center',
  },
  invoiceTotals: {
    paddingTop: theme.spacing(2),
  },
  invoice: {
    // maxWidth: '80%',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    // paddingTop: theme.spacing(1),
  },
  formLeft: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    border: '1px solid #EFEFEF',
    width: '40%',
    height: '90%',
    minHeight: '100%',
    backgroundColor: 'white',
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down(720)]: {
      width: '100%',
      marginBottom: theme.spacing(1),
    },
  },
  formRight: {
    margin: theme.spacing(3),
    paddingTop: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    border: '1px solid #EFEFEF',
    width: '40%',
    height: '90%',
    backgroundColor: 'white',
    display: 'flex',
    [theme.breakpoints.down(720)]: {
      width: '100%',
      marginTop: theme.spacing(2),
    },
  },
}));
