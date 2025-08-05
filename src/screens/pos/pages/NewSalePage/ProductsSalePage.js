import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { get } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';

import { productsSelector } from 'screens/products/redux/selectors';
import {
  fetchProducts,
  fetchProductsNext,
} from 'screens/products/redux/actions';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import ProductList from 'screens/products/components/product/ProductList';
import Selector from 'components/inputs/Selector';
import Text from 'components/outputs/Text';
import SaleItem from './SaleItem';
import { Button } from 'components/inputs/Button';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import {
  objectToArray,
  calculateInvoiceTotal,
  displayFormatDivisibility,
} from 'util/general';
import PageTitle from 'components/layout/page/PageTitle';
import { View } from 'components/layout/View';

const ProductsSalePage = props => {
  const { setCurrency, setItems, currency, items = {} } = props;
  const wallets = useSelector(walletsSelector);
  const currencyCode = get(currency, ['currency', 'code']);
  const currencySymbol = get(currency, ['currency', 'symbol']);

  const classes = useStyles();

  // Tabs
  // const { pathname } = useLocation();
  const history = useHistory();
  // const tabs = [
  //   { label: 'Available', value: '' },
  //   { label: 'Vouchers', value: 'vouchers' },
  // ];
  // const paths = pathname.split('/');
  // const tab = get(paths, [3], '');
  // function onTabChange(value) {
  //   history.push('/sales/products/' + (value ? value + '/' : ''));
  // }

  // Products
  const products = useSelector(productsSelector);
  // const vouchers = useSelector(vouchersSelector);
  const dispatch = useDispatch();
  function handleFetchProducts() {
    dispatch(fetchProducts({ currency: currencyCode }));
  }
  function handleFetchProductsNext() {
    dispatch(fetchProductsNext());
  }
  // function handleFetchVouchers() {
  //   dispatch(fetchVouchers());
  // }
  // function handleFetchVouchersNext() {
  //   dispatch(fetchVouchersNext());
  // }
  useEffect(() => {
    handleFetchProducts();
    // handleFetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyCode]);
  // const sharedRouteProps = {
  //   exact: true,
  //   history,
  // };

  // console.log('currency', currency);
  const [index, setIndex] = useState(0);
  const [indexLoading, setIndexLoading] = useState(false);

  function handleUpdateCart(item = {}, { quantity = 0, event }) {
    if (event) {
      event.stopPropagation();
    }
    const { name, prices = [], id } = item;

    const newItems = {
      ...items,
    };
    newItems[id] = {
      name,
      quantity: quantity ? quantity : get(newItems, [id, 'quantity'], 0) + 1,
      price: get(
        prices.find(price => price.currency.code === currencyCode),
        ['amount'],
      ),
    };

    setItems(newItems);
  }

  const productListProps = {
    products,
    fetchProducts: handleFetchProducts,
    fetchProductsNext: handleFetchProductsNext,
    index,
    indexLoading,
    currency,
    // handleStateChange: this.handleStateChange,
    addToCart,
  };
  const salesAccountRef = get(wallets, ['accountsDictionary', 'sales']);
  const currencies = get(wallets, ['accounts', salesAccountRef, 'currencies']);
  if (!currencies) {
    return null;
  }
  const currencyKeys = Object.keys(currencies);
  const currencyOptions = currencyKeys.map(item => {
    return { value: item, label: item, id: item };
  });

  function handleCurrencyChange(code) {
    const currency = get(currencies, [code]);
    setCurrency(currency);
    setItems([]);
  }

  function addToCart(id, { quantity, event }) {
    if (event) {
      event.stopPropagation();
    }
    const product = get(products, ['items', id]);
    if (product) {
      handleUpdateCart(product, { quantity });
    }
  }
  function updateCartItemQuantity(itemId, quantity) {
    const item = get(items[itemId]);
    handleUpdateCart(item, { quantity });
  }

  function removeFromCart(id) {
    let newItems = { ...items };
    delete newItems[id];

    setItems(newItems);
  }

  function handleClear() {
    setItems({});
  }

  const itemArray = objectToArray(items, 'id');
  const total = calculateInvoiceTotal(itemArray);
  const totalString = displayFormatDivisibility(
    total,
    currency.currency.divisibility,
  );

  return (
    <div className={classes.container}>
      <div className={classes.pageLeft}>
        <div className={classes.tabs}>
          <PageTitle
            titleId="new_product_sale"
            // back
            handleBack={() => {
              setItems({});
              history.push('/sales/');
            }}
          />
          <Selector
            // label="Currency"
            // dense
            width="auto"
            value={currencyCode}
            items={currencyOptions}
            onValueChange={handleCurrencyChange}
          />
          {/* <Tabs tabs={tabs} state={tab} onChange={onTabChange} /> */}
        </div>
        {/* <Switch>
          <Route {...sharedRouteProps} path="/sales/products/vouchers/">
            <div>vouchers</div>
          </Route>
          <Route {...sharedRouteProps} path="/sales/products/"> */}
        <div className={classes.grid}>
          <ProductList {...productListProps} />
        </div>
        {/* </Route>
        </Switch> */}
        {/* <Toast /> */}
      </div>
      <div className={classes.pageRight}>
        <View fD="row" jC="space-between">
          <View p={0.5}>
            <Text myColor="primary" variant="h5" bold id="checkout" uppercase />
          </View>
          {itemArray.length > 0 && (
            <Button
              noPadding
              variant={'text'}
              style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
              onPress={handleClear}>
              <Text
                myColor={'primary'}
                style={{ fontSize: 12 }}
                id="clear"
                uppercase
              />
            </Button>
          )}
        </View>
        <div className={classes.invoice}>
          <div>
            {itemArray.length ? (
              itemArray.map((item, index) => (
                <SaleItem
                  key={get(itemArray, 'id', index)}
                  item={item}
                  index={index}
                  currency={currency.currency}
                  removeFromCart={removeFromCart}
                  updateCartItemQuantity={updateCartItemQuantity}
                />
              ))
            ) : (
              <EmptyListMessage id="no_products_in_checkout" />
            )}
          </div>

          <div>
            <div className={classes.invoiceTotalRow}>
              <Text bold className={classes.totals} id="total" />
              <Text
                align="right"
                className={classes.price}
                bold
                color="primary">
                {currencySymbol + totalString}
              </Text>
            </div>
            <Button
              id="checkout"
              capitalize
              wide
              color="primary"
              onClick={() => history.push('/pos/sales/qr/')}
              disabled={!itemArray.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsSalePage;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pageLeft: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    overflow: 'hidden',
    minWidth: 350,
    // border: '1px solid #EFEFEF',
    width: '65%',
    height: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    padding: theme.spacing(1),
  },
  pageRight: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    // border: '1px solid #EFEFEF',
    width: '25%',
    height: '90%',
    backgroundColor: 'white',
    padding: theme.spacing(2),
    // paddingLeft: theme.spacing(3),
    // paddingRight: theme.spacing(3),
  },
  invoice: {
    padding: theme.spacing(1),
    flex: 1,
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  tabs: {
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    height: '100%',
    width: '100%',
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: '180px',
  },
  price: {
    minWidth: 180,
    maxWidth: 180,
  },
  totals: {
    width: '100%',
  },
  invoiceTotalRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: theme.spacing(1),
    borderTop: '1px solid lightgray',
  },
}));
