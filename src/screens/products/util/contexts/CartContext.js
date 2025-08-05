import React, { useContext, useEffect, useState } from 'react';
import {
  createOrder,
  createOrderItemNew,
  updateOrderItem,
  deleteOrderItem,
  getOrdersNew as getOrders,
  getOrderItemsNew as getOrderItems,
  deleteOrder,
} from 'util/rehive';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { primaryCurrenciesSelector } from 'screens/accounts/redux/selectors';
import { configProductSelector } from 'redux/rehive/selectors';
import { useToast } from 'components/contexts/ToastContext';
import { useHistory } from 'react-router-dom';
import { paramsToObj } from 'util/general';

const CartContext = React.createContext({
  cart: null,
  items: [],
  error: '',
  loading: false,
});

function CartProvider({ children, navigation }) {
  const productConfig = useSelector(configProductSelector);
  const primaryCurrencies = useSelector(primaryCurrenciesSelector);
  const history = useHistory();

  const { showToast } = useToast();

  const { defaultCurrency } = productConfig;

  const currencyCode = paramsToObj(history?.location?.search ?? '')?.currency;
  const initialCurrency = () =>
    primaryCurrencies?.items?.find(
      currency =>
        currency?.currency?.code === (currencyCode ?? defaultCurrency),
    )?.currency ?? primaryCurrencies?.primary?.currency;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingItem, setLoadingItem] = useState('');
  const [currency, setCurrency] = useState(initialCurrency());

  const queryClient = useQueryClient();
  const enabled = !!currency?.code;
  const query = useQuery(
    ['cart', currency?.code],
    () => getOrders('currency=' + currency?.code + '&status=pending'),
    {
      enabled,
      staleTime: 1500,
    },
  );

  const cartTemp = query?.data?.results?.[0] ?? { currency };
  const cart =
    cartTemp?.currency?.code === currency?.code ? cartTemp : { currency };

  const cartID = cart?.id ?? '';
  const itemsEnabled = enabled && Boolean(cartID);
  const queryItems = useQuery(
    ['cartItems', cartID],
    () => getOrderItems(cartID),
    {
      enabled: itemsEnabled,
      staleTime: 1500,
    },
  );

  const isLoading = query?.isLoading || queryItems?.isLoading;

  useEffect(() => {
    if (!queryItems?.isFetching) {
      setLoadingItem(false);
    }
  }, [queryItems?.isFetching]);
  const items = cartID ? queryItems?.data?.results ?? [] : [];

  function refresh() {
    queryClient.invalidateQueries('cart');
    query.refetch();
    if (itemsEnabled) {
      queryItems.refetch();
    }
  }

  useEffect(() => {
    // setLoading(true);
    refresh();
  }, [cartID, currency?.code]);

  async function resetCart() {
    setLoading(true);
    try {
      refresh();
    } catch (e) {
      setError(e?.message);
    }
    setLoading(false);
  }

  async function clearCart() {
    setLoadingCart(true);
    try {
      const resp = await deleteOrder(cart?.id);
      if (resp?.status === 'success') {
        queryClient.setQueryData(['cart', currency?.code], null);
        queryClient.setQueryData(['cart', cart?.id], []);
        refresh(); // mutation
      }
    } catch (e) {
      setError(e?.message);
    }
    setLoadingCart(false);
    return true;
  }

  function handleCurrencyChange(currency) {
    history.push({ search: '?currency=' + currency?.code });
    setCurrency(currency);
  }

  async function addToCart({ product, variantId, quantity = 1, event }) {
    if (event) event.stopPropagation();

    if (items?.length && product?.seller?.id !== cart?.seller?.id)
      return { newCartRequired: true };

    let resp = null;

    const productId = product?.id;
    setLoading(productId);
    setLoadingItem(productId);

    let data = {
      quantity,
      product: productId ? productId : product.id,
    };
    if (variantId) {
      data.variant = variantId;
    }

    try {
      if (!cartID) {
        resp = await createOrder(currency?.code);
        queryClient.setQueryData(['cart', currency?.code], { results: [resp] });
        if (resp.status === 'success') {
          resp = await createOrderItemNew(resp?.data?.id, data);
          queryClient.setQueryData(['cart', resp?.data?.id], {
            results: [resp],
          });
        } else {
          setError(resp?.message);
        }
      } else {
        const cartItem = items.find(
          item =>
            item.product === productId &&
            (variantId ? item?.variant?.id === variantId : true),
        );
        if (cartItem) {
          resp = await updateCartItemQuantity(
            cartItem.id,
            cartItem.quantity + quantity,
          );
        } else {
          resp = await createOrderItemNew(cartID, data);
        }
      }
      refresh();
      if (resp?.status === 'success') {
        showToast({
          actionLabel: 'View cart',
          text: 'product_added_to_cart',
          languageContext: { product: product.name ?? 'Product' },
          actionOnPress: () => navigation.navigate('Checkout', { cart }),
          duration: 3000,
        });
      } else {
        setError(resp?.message);
        showToast({
          text: 'unable_to_add_to_cart_reason',
          languageContext: { reason: resp?.message ?? '' },
          variant: 'error',
        });
      }
    } catch (error) {
      setError(error.message);
      showToast({
        text: 'unable_to_add_to_cart_reason',
        languageContext: { reason: resp?.message ?? '' },
        variant: 'error',
      });
    }
    setLoadingItem('');

    return resp;
  }

  async function updateCartItemQuantity(
    itemID,
    quantity,
    isQuantityEdit = false, // if quantity is coming from input filed then show toast based on this
  ) {
    // items is given when there is no product name available or sent to this function
    setLoadingItem(itemID);
    setError('');
    try {
      const resp = await updateOrderItem(cartID, itemID, quantity);
      if (resp.status === 'error') {
        setError(resp?.message);

        showToast({
          text: 'unable_to_add_to_cart_reason',
          languageContext: { reason: resp?.message ?? '' },
          variant: 'error',
        });
      } else {
        refresh();
        if (isQuantityEdit) {
          showToast({
            actionLabel: 'View cart',
            text: 'product_added_to_cart',
            languageContext: { product: 'Product' },
            actionOnPress: () => navigation.navigate('Checkout', { cart }),
            duration: 3000,
          });
        }
        return resp;
      }
    } catch (e) {
      console.log('updateCartItemQuantity -> e', e);
      setError(e?.message);
    }
    setLoadingItem('');
    setLoading(false);
  }

  async function removeFromCart(cartID, itemID) {
    setLoadingItem(itemID);
    try {
      if (items.length === 1) {
        const resp = await clearCart();
        if (resp) {
          showToast({
            text: 'Product item successfully removed from cart',
            duration: 3000,
          });
        }
      } else {
        const resp = await deleteOrderItem(cartID, itemID);
        if (resp.status === 'error') {
          setError(resp?.message);
          setLoadingItem('');
        } else {
          showToast({
            text: 'Product item successfully removed from cart',
            duration: 3000,
          });
          refresh();
        }
      }
    } catch (e) {}
    setLoadingItem('');
  }

  const functions = {
    setCurrency: handleCurrencyChange,
    switchCart: handleCurrencyChange,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    resetCart,
  };

  return (
    <CartContext.Provider
      value={{
        currency,
        cart,
        items,
        error,
        resettingCart: loading,
        loading: isLoading,
        loadingCart,
        loadingItem,
        loadingItems: queryItems?.isLoading,
        ...functions,
      }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);

  if (context === undefined)
    throw new Error('useCart must be used within a CartProvider');

  return context;
}

export { CartContext, CartProvider, useCart };
