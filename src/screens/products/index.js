import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { Route, Switch } from 'react-router-dom';
import {
  ordersSelector,
  productsSelector,
  vouchersSelector,
} from './redux/selectors';
import { getProductCategories } from 'util/rehive';
import { currentCompanySelector } from 'redux/auth/selectors';
import {
  // fetchOrders,
  // fetchOrdersNext,
  fetchVouchers,
  fetchVouchersNext,
} from './redux/actions';
import { primaryCurrenciesSelector } from '../accounts/redux/selectors';
import CategoriesFilter from './components/CategoriesFilter';
import GridContainer from 'components/layout/GridContainer';
import IndexContainer from 'components/layout/IndexContainer2';
import ProductScreenHeader from './components/ProductScreenHeader';
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderList from './components/order/OrderList';
import OrderPage from './components/order';
import ProductList from './components/product/ProductList';
import Spinner from 'components/outputs/Spinner';
import VoucherList from './components/voucher/VoucherList';
import { userProfileSelector } from 'redux/rehive/selectors';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import { CartProvider } from './util/contexts/CartContext';
import NewCartModal from './components/cart/NewCartModal';
import { useToast } from 'components/contexts/ToastContext';
import { useAvailableCurrenciesForProducts } from 'hooks/productsAPI';
import { ProductsPopupModal } from './components/product/ProductsPopupModal';
import { useDismissed } from 'hooks/general';

export default function ProductsContainer(props) {
  const { location, history } = props;

  const [state, setState] = useState('');
  const [index, setIndex] = useState(0);
  const [showOrder, setShowOrder] = useState(false);
  const [showNewCartModal, setShowNewCartModal] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState();
  const [currency, setCurrency] = useState({
    available_balance: 0,
    currency: { code: 'USD', divisibility: 2 },
  });
  const [loading, setLoading] = useState(true);
  const [indexLoading, setIndexLoading] = useState(false);
  const [cartAmount, setCartAmount] = useState(0);
  const [categoriesDrawerOpen, setCategoriesDrawerOpen] = useState(false);

  const company = useSelector(currentCompanySelector);
  const profile = useSelector(userProfileSelector);
  const products = useSelector(productsSelector);
  const primaryCurrencies = useSelector(primaryCurrenciesSelector);
  const orders = useSelector(ordersSelector);
  const vouchers = useSelector(vouchersSelector);
  const availableCurrencies = useAvailableCurrenciesForProducts(
    primaryCurrencies,
    Boolean(primaryCurrencies),
  );
  const {
    dismissed,
    dismiss,
    loading: loadingDismissed,
  } = useDismissed('products_popoup_modal');

  const dispatch = useDispatch();

  const { showToast } = useToast();

  const onPopupDismissed = () => {
    setShowPopupModal(false);
    dismiss();
  };

  const filterConfig = {
    type: { variant: 'select', options: ['physical', 'virtual'] },
    countries: { variant: 'countries', label: 'country' },
    seller: {
      variant: 'seller',
      label: 'seller',
      onDelete: () => setShowNewCartModal(true),
    },
  };

  useEffect(() => {
    let paths = location.pathname.split('/');
    if (paths.length > 3) setState(paths[2]);

    // dispatch(fetchOrders());
    dispatch(fetchVouchers());
  }, []);

  useEffect(() => {
    setState(history?.location?.pathname?.split('/')?.[2] ?? '');
  }, [history?.location]);

  useEffect(() => {
    if (dismissed) {
      setShowPopupModal(false);
    }
  }, [dismissed]);

  const categoriesQuery = useQuery(
    ['categories', company?.id],
    () => getProductCategories(true),
    {
      enabled: Boolean(company?.id),
    },
  );

  const categories = categoriesQuery?.data?.results ?? [];

  function handleStateChange(args) {
    let { state, index, showOrder } = args;

    if (!index && index !== 0) {
      index = state?.index;
    }

    setState(state);
    setIndex(index);
    setShowOrder(showOrder);

    history.push('/products/' + (state ? state + '/' : ''));
  }

  function renderVouchersList() {
    return (
      <VoucherList
        {...{
          vouchers,
          fetchData: () => dispatch(fetchVouchers()),
          fetchDataNext: () => dispatch(fetchVouchersNext()),
          index,
          indexLoading,
          filters,
          currency,
          showToast,
          handleStateChange,
        }}
      />
    );
  }

  function renderHeader() {
    return (
      <ProductScreenHeader
        history={history}
        filterConfig={!state && filterConfig}
        profile={profile}
        state={state}
        handleStateChange={handleStateChange}
        cartAmount={cartAmount}
        products={products}
        primaryCurrencies={availableCurrencies}
        currency={currency}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        context={{ categories, categoriesDrawerOpen, setCategoriesDrawerOpen }}
      />
    );
  }


  function renderOrders() {
    // const data = {
    //   ...orders,
    //   items: orders.items.filter(
    //     order => order.status !== 'pending' && order.placed,
    //   ), //TODO: remove and do this filter on api call
    // };

    // if (data.items.length === 0)
    //   return (
    //     <GridContainer
    //       content={
    //         orders.loading ? (
    //           <Spinner />
    //         ) : (
    //           <EmptyListPlaceholderImage name="order" text="No order history" />
    //         )
    //       }
    //       header={renderHeader()}
    //     />
    //   );

    // return (
    //   <IndexContainer
    //     flipContent={!showOrder}
    //     index={renderOrderList(data)}
    //     content={renderOrder(data, index)}
    //     header={renderHeader()}
    //   />
    // );
    return (
      <GridContainer
        content={<OrderPage {...{ history }} />}
        header={renderHeader()}
      />
    );
  }

  function renderProducts(args) {
    const { detail } = args;

    return (
      <GridContainer
        content={<ProductList />}
        header={renderHeader()}
        left={
          categoriesQuery?.isLoading || (!detail && categories?.length) ? (
            <CategoriesFilter
              {...{
                categories,
                loading: categoriesQuery?.isLoading,
                drawerOpen: categoriesDrawerOpen,
                setDrawerOpen: setCategoriesDrawerOpen,
              }}
            />
          ) : null
        }
        leftWidth={220}
      />
    );
  }

  function renderVouchers() {
    return (
      <GridContainer content={renderVouchersList()} header={renderHeader()} />
    );
  }
  const sharedRouteProps = {
    exact: true,
    history,
  };

  return (
    <CartProvider>
      <Switch>
        <Route
          {...sharedRouteProps}
          component={renderOrders}
          path="/products/orders/"
        />
        <Route
          {...sharedRouteProps}
          component={CheckoutPage}
          path="/products/checkout/"
        />
        <Route
          {...sharedRouteProps}
          component={renderVouchers}
          path="/products/vouchers/"
        />
        <Route history={history} path="/products/" exact>
          <GridContainer
            content={<ProductList />}
            header={renderHeader()}
            left={
              categoriesQuery?.isLoading || categories?.length ? (
                <CategoriesFilter
                  {...{
                    categories,
                    loading: categoriesQuery?.isLoading,
                    drawerOpen: categoriesDrawerOpen,
                    setDrawerOpen: setCategoriesDrawerOpen,
                  }}
                />
              ) : null
            }
            leftWidth={220}
          />
        </Route>
        <Route history={history} path="/products/:id" exact>
          <GridContainer content={<ProductList />} header={renderHeader()} />
        </Route>
      </Switch>
      <NewCartModal
        open={showNewCartModal}
        onDismiss={() => setShowNewCartModal(false)}
      />
      <ProductsPopupModal open={showPopupModal} onDismiss={onPopupDismissed} />
    </CartProvider>
  );
}

// function Products(args) {
//   const { detail } = args;

//   return (
//     <GridContainer
//       content={<ProductList />}
//       // header={renderHeader()}
//       // left={
//       //   categoriesQuery?.isLoading || (!detail && categories?.length) ? (
//       //     <CategoriesFilter
//       //       {...{
//       //         categories,
//       //         loading: categoriesQuery?.isLoading,
//       //         drawerOpen: categoriesDrawerOpen,
//       //         setDrawerOpen: setCategoriesDrawerOpen,
//       //       }}
//       //     />
//       //   ) : null
//       // }
//       leftWidth={220}
//     />
//   );
// }
