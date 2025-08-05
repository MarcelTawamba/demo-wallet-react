import React, { useMemo, useState } from 'react';
import { updateOrderItem } from 'screens/orders/util/rehive';
import { SimpleImg } from 'react-simple-img';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from 'components/layout/Modal';
import PageContent from 'components/layout/page/PageContent';
import MuiTextField from '@material-ui/core/TextField';
import ButtonList from 'components/lists/ButtonList';
import { isArray } from 'lodash';

function TrackingUrlModal({
  showModal,
  setShowModal,
  selectedActionItems,
  orderItems,
  orderId,
  sellerId,
  showToast,
  refetchOrderItems,
}) {
  const [trackingUrls, setTrackingUrls] = useState({});
  const [selectedTrackingItems, setSelectedTrackingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTrackingUrls({});
    setSelectedTrackingItems([]);
  };

  const dismissModal = () => {
    setShowModal(false);
    resetForm();
  };

  const selectedOrderItems = useMemo(() => {
    const _selectedOrderItems = orderItems?.filter(item =>
      selectedActionItems.includes(item.id),
    );
    let _trackingUrls = {};
    if (isArray(_selectedOrderItems)) {
      _selectedOrderItems.forEach(
        item => (_trackingUrls[[item.id]] = item.tracking_url),
      );
    }
    setTrackingUrls(_trackingUrls);
    return _selectedOrderItems;
  }, [selectedActionItems, showModal]);

  const handleItemCheck = (e, item) => {
    let _selectedTrackingItems;
    if (e.target.checked) {
      _selectedTrackingItems = [...selectedTrackingItems];
      _selectedTrackingItems.push(item.id);
    } else {
      _selectedTrackingItems = selectedTrackingItems.filter(
        itemId => itemId !== item.id,
      );
    }
    setSelectedTrackingItems(_selectedTrackingItems);
  };

  const handleSetTrackingUrl = (e, item) => {
    setTrackingUrls({ ...trackingUrls, [item.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (selectedTrackingItems.length === 0) return;
    let successUpdate;
    try {
      setLoading(true);
      for (let index = 0; index < selectedTrackingItems.length; index++) {
        const itemId = selectedTrackingItems[index];
        console.log({
          itemId,
          tracking_url: trackingUrls[itemId] ?? '',
        });
        const resp = await updateOrderItem(sellerId, orderId, itemId, {
          tracking_url: trackingUrls[itemId] ?? '',
        });

        if (resp?.status === 'success') {
          showToast({
            text: `Tracking URL updated successfully`,
            variant: 'success',
          });
          successUpdate = true;
        } else {
          showToast({
            text: 'Unable to update',
            variant: 'error',
          });
        }
      }
    } catch (error) {
      showToast({
        text: 'Something went wrong',
        variant: 'error',
      });
      console.log(error);
    }
    if (successUpdate) {
      refetchOrderItems();
    }
    dismissModal();
    setLoading(false);
  };

  return (
    <Modal
      altStyle
      close
      open={showModal}
      disableBackdropClick
      onDismiss={dismissModal}
      title="Manage Tracking URLs"
      titleCentered
      hasPaddingTop
      maxWidth={600}>
      <PageContent horizontal={3}>
        {selectedOrderItems?.map(item => {
          return (
            <View fD="row" gap={2} aI="center" mt={2}>
              <Checkbox
                checked={selectedTrackingItems.includes(item.id)}
                onChange={e => handleItemCheck(e, item)}
                style={{ paddingLeft: 0 }}
              />
              <View w="100%" ml={1}>
                <View fD="row" gap={2} aI="center">
                  <SimpleImg src={item?.image} height={70} width={70} />
                  <View>
                    {item.name}
                    {item.variant && (
                      <Text s={12} style={{ marginTop: 4 }} c="#797979">
                        {item.variant.label}
                      </Text>
                    )}
                  </View>
                </View>
                <View w="100%" mt={1}>
                  <MuiTextField
                    label="Tracking URL"
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    inputProps={{ style: { height: 14, fontSize: 14 } }}
                    InputLabelProps={{ style: { fontSize: 14 } }}
                    onChange={e => handleSetTrackingUrl(e, item)}
                    value={trackingUrls[item.id]}
                  />
                </View>
              </View>
            </View>
          );
        })}
        <View mv={2} />
        <ButtonList
          layout={'horizontal'}
          items={[
            {
              id: 'cancel',
              variant: 'outlined',
              wide: true,
              onPress: dismissModal,
              capitalize: true,
              disabled: loading,
            },
            {
              id: 'Confirm',
              wide: true,
              onPress: handleSubmit,
              loading,
            },
          ]}
        />
      </PageContent>
    </Modal>
  );
}

export default TrackingUrlModal;
