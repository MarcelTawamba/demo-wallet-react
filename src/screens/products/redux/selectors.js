import { createSelector } from 'reselect';
import _ from 'lodash';

const productsStateSelector = state => state.products;

const empty = {
  items: [],
  loading: true,
  nextLoading: false,
  more: false,
  error: 'No items',
};

export const ordersSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { orders } = productsState;
    if (!orders) {
      return empty;
    }
    const { ids, byId, error, loading, next } = orders;
    const items = ids.map(id => byId[id]);

    return {
      items: items ? _.orderBy(items, 'placed', 'desc') : [],
      more: Boolean(next),
      loading,
      error,
    };
  },
);

export const productsNextSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { products } = productsState;
    const { next } = products;

    return next;
  },
);

export const productsSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { products } = productsState;
    if (!products) {
      return empty;
    }
    const { ids, byId, error, loading, next, count } = products;

    const items = ids.map(id => byId[id]);

    let available = items;
    let outOfStock = [];
    // if (items && items.length && items.length > 0) {
    //   available = items.filter(product => product.quantity > 0);
    //   outOfStock = _.difference(items, available);
    // }

    return {
      items: available,
      items2: outOfStock,
      more: Boolean(next),
      loading,
      error,
      count,
    };
  },
);

export const ordersNextSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { orders } = productsState;
    const { next } = orders;

    return next;
  },
);

export const vouchersSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { vouchers } = productsState;
    if (!vouchers) {
      return empty;
    }
    const { ids, byId, error, loading, next } = vouchers;
    let items = ids.map(id => byId[id]);
    // items = items.map(x => {
    //   return { ...x, code: formatVoucherCode(x.code) };
    // });

    return {
      items: items ? _.orderBy(items, 'status', 'asc') : [],
      more: Boolean(next),
      loading,
      error,
    };
  },
);

export const vouchersNextSelector = createSelector(
  [productsStateSelector],
  productsState => {
    const { vouchers } = productsState;
    const { next } = vouchers;

    return next;
  },
);
