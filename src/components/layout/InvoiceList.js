import React from 'react';
import { get } from 'lodash';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { formatAmountString } from 'util/general';
import { objectToArray } from 'util/general';
import EmptyListMessage from '../lists/EmptyListMessage';

function calculateInvoiceTotal(items) {
  let totalAmount = 0;

  items.forEach(item => {
    totalAmount =
      totalAmount + get(item, ['price'], 0) * get(item, ['quantity'], 1);
  });

  return totalAmount;
}

function priceString(price, currency) {
  return formatAmountString(price, currency, false);
}

export default function InvoiceList(props) {
  const { items, currency } = props;
  const productConfig = {}; //useSelector(configProductSelector);
  const itemArray = objectToArray(items, 'id').filter(item => item);
  const amount = calculateInvoiceTotal(itemArray, currency.divisibility);

  const simpleLayout = itemArray.length < 2 && !get(itemArray, [0, 'name']);

  const classes = useStyles();

  if (!itemArray.length) {
    return <EmptyListMessage>No items</EmptyListMessage>;
  }

  const invoiceConfig = get(productConfig, ['sales', 'invoiceConfig'], {});
  const { showTax = true, showDiscount = true } = invoiceConfig;

  // const discountAmount = 100;
  // const taxAmount = 250;
  const totalAmount = amount; // - discountAmount + taxAmount;
  const subtotalString = priceString(amount, currency);
  const totalString = priceString(totalAmount, currency);
  const emptyAmountString = priceString(0, currency);
  // const discountString = priceString(discountAmount, currency);
  // const taxString = priceString(taxAmount, currency);

  return (
    <div className={classes.invoice}>
      <div className={classes.invoiceListItem}>
        <Text className={classes.nameTitle}>NAME</Text>
        <Text
          align="right"
          className={classes.quantityTitle}
          id="qty"
          uppercase
        />
        <Text
          align="right"
          className={classes.priceTitle}
          id="price"
          uppercase
        />
        <Text
          align="right"
          className={classes.priceTitle}
          id="amount"
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
              {priceString(price, currency)}
            </Text>
            <Text align="right" className={classes.price}>
              {priceString(quantity * price, currency)}
            </Text>
          </div>
        ))}
      </div>
      <div className={classes.invoiceTotals}>
        {/* {(showDiscount || showTax) && (
          <div className={classes.invoiceTotalRow}>
            <Text bold align="right" className={classes.totals}>
              SUBTOTAL
            </Text>
            <Text align="right" className={classes.price}>
              {subtotalString}
            </Text>
          </div>
        )}
        {showDiscount && (
          <div className={classes.invoiceTotalRow}>
            <Text bold align="right" className={classes.totals}>
              DISCOUNT
            </Text>
            <Text align="right" className={classes.price}>
              {'- ' + discountString}
            </Text>
          </div>
        )}
        {showTax && (
          <div className={classes.invoiceTotalRow}>
            <Text bold align="right" className={classes.totals}>
              TAX
            </Text>
            <Text align="right" className={classes.price}>
              {taxString}
            </Text>
          </div>
        )} */}
        <div className={classes.invoiceTotalRow}>
          <Text
            bold
            align="right"
            className={classes.totals}
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
  companyName: {
    paddingLeft: theme.spacing(2),
  },
  nameTitle: {
    width: '35%',
    fontWeight: '500',
  },
  quantityTitle: {
    width: '15%',
    fontWeight: '500',
  },
  priceTitle: {
    width: '25%',
    fontWeight: '500',
  },
  name: {
    width: '30%',
  },
  quantity: {
    width: '15%',
  },
  price: {
    width: '25%',
  },
  totals: {
    width: '100%',
  },
  invoiceList: {
    width: '100%',
  },
  simpleLayout: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    border: '1px solid #EFEFEF',
    width: '60%',
    height: '90%',
    backgroundColor: 'white',
    [theme.breakpoints.down(720)]: {
      width: '100%',
    },
  },
  invoiceListItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  invoiceTotalRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: theme.spacing(1),
  },
  invoiceTotals: {
    paddingTop: theme.spacing(4),
  },
  invoice: {
    width: '100%',
  },
}));
