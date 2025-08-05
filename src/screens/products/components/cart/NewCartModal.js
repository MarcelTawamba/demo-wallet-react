import React, { useState, useEffect } from 'react';
import Modal from 'components/layout/Modal';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import { useTheme } from 'components/app/context';
import { useCart } from 'screens/products/util/contexts/CartContext';
import ProductPlaceholder from 'components/outputs/PlaceholderImage/product/ProductPlaceholder';
import { useHistory } from 'react-router-dom';
import { searchToObj, paramsToSearch } from 'util/general';

export default function NewCartModal(props) {
  const { open, onDismiss } = props;
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();
  const { clearCart, cart } = useCart();

  function clearSellerFilter() {
    let filters = searchToObj(history?.location?.search);
    delete filters.seller;
    const search = paramsToSearch(filters);
    history.push({ search });
  }

  useEffect(() => {
    if (!cart?.id && open) {
      clearSellerFilter();
      onDismiss();
    }
  }, [cart, open]);

  async function onConfirm() {
    setLoading(true);
    await clearCart();
    clearSellerFilter();
    onDismiss();
    setLoading(false);
  }

  return (
    <Modal
      open={open}
      onDismiss={onDismiss}
      close
      maxWidth={415}
      borderRadius={20}>
      <View w={'100%'} jC={'center'} aI={'center'}>
        <ProductPlaceholder
          name="data"
          height={100}
          width={100}
          colors={colors}
        />
      </View>
      <View mb={1}>
        <Text
          style={{ fontSize: 20, textAlign: 'center' }}
          id="clear_cart_title"
        />
      </View>
      <View mb={1}>
        <Text
          style={{ textAlign: 'center' }}
          id="create_a_new_cart_confirmation"
        />
      </View>
      <Button
        id="create_new_cart"
        capitalize
        wide
        color="primary"
        loading={loading}
        onPress={onConfirm}
      />
    </Modal>
  );
}
