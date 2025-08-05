import React, { useState, useEffect } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { View } from 'components/layout/View';
import CardList from 'components/card/CardList';
import ProductCard from './ProductCard';
import { getProducts } from 'util/rehive';
import { useQuery } from 'react-query';
import { paramsToSearch, parseScreenUrl } from 'util/general';
import { useCart } from 'screens/products/util/contexts/CartContext';
import { useHistory } from 'react-router-dom';
import { uniq } from 'lodash';

export default function ProductList(props) {
  const [item, setItem] = useState(null);
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [currentSearchString, setCurrentSearchString] = useState();
  const [timeoutLoading, setTimeoutLoading] = useState(true);

  const history = useHistory();

  const { itemId, filters } = parseScreenUrl(
    history.location.pathname,
    history?.location?.search,
  );

  const {
    currency,
    cart,
    addToCart,
    clearCart,
    items: cartItems,
    loading: cartLoading,
  } = useCart();

  useEffect(() => {
    if (itemId) {
      const temp = items.find(item => item.id === itemId);
      if (temp) setItem(temp);
      else {
      } // TODO: fetch item by id
    } else setItem(null);
  }, [itemId]);

  let cartFilters = {
    currency: currency?.code ?? currency ?? '',
  };

  if (cart) {
    if (cart?.seller) cartFilters.seller = cart?.seller?.id ?? '';
    else if (cartItems?.length && !filters?.seller)
      cartFilters.seller__isnull = true;
  }

  const searchString = paramsToSearch({ ...filters, ...cartFilters });

  useEffect(() => {
    setCurrentSearchString(searchString);
  }, []);

  useEffect(() => {
    if (searchString !== currentSearchString) {
      setPage(1);
      setCurrentSearchString(searchString);
      setTimeoutLoading(true);
      setTimeout(() => {
        setQueryEnabled(true);
        setTimeoutLoading(false);
      }, 500);
    }
  }, [searchString, currentSearchString]);

  const enabled = cartFilters?.currency && !cartLoading && queryEnabled;

  const query = useQuery(
    ['products', paramsToSearch({ ...filters, ...cartFilters, page })],
    () =>
      getProducts(
        paramsToSearch({ ...filters, ...cartFilters, page }),
        true,
      ),
    {
      staleTime: 60000,
      enabled,
    },
  );

  // const items = query?.data?.results ?? [];
  const loading = query?.isLoading;

  useEffect(() => {
    if (!loading) {
      setQueryEnabled(false);
      setItems(
        uniq(
          [...(page > 1 ? items : []), ...(query?.data?.results ?? [])],
          x => x.id,
        ),
      );
    }
  }, [loading, query?.data?.results]);

  const showModal = id => {
    history.push({
      pathname: '/products/' + id,
      search: history?.location?.search,
    });
  };

  function handleBack() {
    history.push({ pathname: '/products/', search: history.location.search });
  }

  function handlePaginate() {
    setPage(page + 1);
    setQueryEnabled(true);
  }

  const skeleton = (
    <View>
      <Skeleton variant="rect" width={'100%'} height={180} />
      <View mv={1} w={'100%'}>
        <Skeleton
          variant="rect"
          width={'100%'}
          height={15}
          style={{ borderRadius: 5 }}
        />
      </View>
      <Skeleton
        variant="rect"
        width={50}
        height={15}
        style={{ borderRadius: 5 }}
      />
    </View>
  );

  return (
    <div style={{ display: 'flex', flexGrow: 1 }}>
      <CardList
        grid
        type="product"
        emptyListMessage="product_empty"
        data={{
          items,
          loading: loading || timeoutLoading,
          page,
          more: !!query?.data?.next,
        }}
        skeleton={skeleton}
        fetchNext={handlePaginate} //TODO: !!!!!
        renderDetail={
          item
            ? () => (
                <ProductCard
                  item={item}
                  detail
                  handleBack={handleBack}
                  hideModal={handleBack}
                  showModal={showModal}
                  addToCart={addToCart}
                  items={items}
                />
              )
            : null
        }
        renderItem={(item, i) => (
          <ProductCard
            showModal={showModal}
            hideModal={handleBack}
            addToCart={addToCart}
            handleBack={handleBack}
            item={item}
            key={i}
          />
        )}
      />
    </div>
  );
}
