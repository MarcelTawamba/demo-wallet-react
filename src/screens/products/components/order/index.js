import React, { useState, useEffect } from 'react';
import { uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import { View } from 'components/layout/View';
import { useQuery } from 'react-query';
import { getOrders } from 'util/rehive';
import { userProfileSelector } from 'redux/rehive/selectors';
import Scrollbars from 'react-custom-scrollbars-better';
import OrderHeader from './OrderHeader';
import OrderList from './OrderList';
import Order from './Order';

const orderStatusOptions = [
  { id: 'all', label: 'orders' },
  { id: 'processing', label: 'processing' },
  { id: 'shipped', label: 'shipped' },
  { id: 'complete', label: 'complete' },
];

export default function OrderPage(props) {
  const [state, setState] = useState('list');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeStatusIndex, setActiveStatusIndex] = useState(0);
  const [activeItem, setActiveItem] = useState();
  const [page, setPage] = useState(1);
  const [filteredPage, setFilteredPage] = useState(1);

  const profile = useSelector(userProfileSelector);

  const queryOrders = useQuery(
    ['orders', profile?.id, page, orderStatusOptions[activeStatusIndex]?.id],
    () =>
      getOrders(
        `page=${activeStatusIndex > 0 ? filteredPage : page}&page_size=5${
          activeStatusIndex > 0
            ? `&items__status=${orderStatusOptions[activeStatusIndex].id}`
            : ''
        }`,
      ),
    {
      enabled: true,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    if (activeStatusIndex === 0)
      setItems(
        uniqBy(
          [
            ...(page > 1 ? items : []),
            ...(queryOrders?.data?.data?.results ?? []),
          ],
          x => x?.id,
        ),
      );
    else
      setFilteredItems(
        uniqBy(
          [
            ...(filteredPage > 1 ? filteredItems : []),
            ...(queryOrders?.data?.data?.results ?? []),
          ],
          x => x?.id,
        ),
      );
  }, [queryOrders?.isLoading, queryOrders?.isFetching]);

  useEffect(() => {
    setState('list');
  }, [activeStatusIndex]);

  const config = {
    list: {
      component: (
        <OrderList
          {...{
            items: activeStatusIndex > 0 ? filteredItems : items,
            loadMore: !!queryOrders?.data?.data?.next,
            loading: queryOrders?.isLoading,
            fetching: queryOrders?.isLoading || queryOrders?.isFetching,
            profile,
            onPress: item => {
              setActiveItem(item);
              setState('order');
            },
            onLoadMore: () =>
              activeStatusIndex > 0
                ? setFilteredPage(filteredPage + 1)
                : setPage(page + 1),
          }}
        />
      ),
    },
    order: {
      component: (
        <Order
          {...{
            item: activeItem,
            setState,
          }}
        />
      ),
    },
  };

  return (
    <View grid gap={1} w={'100%'} h={'fit-content'}>
      <OrderHeader
        {...{
          options: orderStatusOptions,
          activeIndex: activeStatusIndex,
          setActiveIndex: setActiveStatusIndex,
        }}
      />
      {config[state]?.component}
    </View>
  );
}
