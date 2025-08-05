import React, { useMemo, useState } from 'react';
import { createOrderRefund } from 'screens/orders/util/rehive';
import { SimpleImg } from 'react-simple-img';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Checkbox from '@material-ui/core/Checkbox';
import Modal from 'components/layout/Modal';
import PageContent from 'components/layout/page/PageContent';
import { makeStyles } from '@material-ui/core/styles';
import MuiTextField from '@material-ui/core/TextField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import ButtonList from 'components/lists/ButtonList';
import { formatAmountString } from 'util/general';
import { isArray } from 'lodash';

const useStyles = makeStyles(() => ({
  label: {
    fontWeight: 'bold',
    color: '#393939',
    fontSize: 13,
    marginTop: 16,
  },
}));

function RefundModal({
  showModal,
  setShowModal,
  selectedActionItems,
  orderItems,
  currency,
  orderId,
  sellerId,
  showToast,
  refetchOrderItems,
  refetchOrderRefunds,
}) {
  const classes = useStyles();
  const [refundReason, setRefundReason] = useState({});
  const [refundQuantity, setRefundQuantity] = useState({});
  const [selectedRefundItems, setSelectedRefundItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const resetForm = () => {
    setRefundReason({});
    setRefundQuantity({});
    setSelectedRefundItems([]);
    setErrors({});
  };
  const dismissModal = () => {
    setShowModal(false);
    resetForm();
  };
  const selectedOrderItems = useMemo(() => {
    return orderItems?.filter(item => selectedActionItems.includes(item.id));
  }, [selectedActionItems]);

  const totalRefundableAmount = useMemo(() => {
    let _amount = 0;
    if (isArray(selectedOrderItems)) {
      selectedOrderItems.forEach(item => {
        _amount += item.total_price;
      });
    }
    return _amount;
  }, [selectedOrderItems]);

  const handleItemCheck = (e, item) => {
    let _selectedRefundItems;
    if (e.target.checked) {
      _selectedRefundItems = [...selectedRefundItems];
      _selectedRefundItems.push(item.id);
    } else {
      _selectedRefundItems = selectedRefundItems.filter(
        itemId => itemId !== item.id,
      );
    }
    setSelectedRefundItems(_selectedRefundItems);
  };

  const handleSetRefundReason = (e, item) => {
    setRefundReason({ ...refundReason, [item.id]: e.target.value });
  };

  const handleSetRefundQuantity = (value, item) => {
    if (value >= 0 && value <= item.quantity) {
      setRefundQuantity({ ...refundQuantity, [item.id]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedRefundItems.length === 0) {
      newErrors.general = 'select_at_least_one_item';
    }
    
    selectedRefundItems.forEach(itemId => {
      if (!refundReason[itemId] || refundReason[itemId].trim() === '') {
        newErrors[`reason_${itemId}`] = 'refund_reason_required';
      }
      if (!refundQuantity[itemId] || refundQuantity[itemId] <= 0) {
        newErrors[`quantity_${itemId}`] = 'refund_quantity_required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitRefund = async () => {
    if (!validateForm()) {
      return;
    }
    
    let successRefund;
    try {
      const itemsToRefund = [];
      selectedRefundItems.forEach(item => {
        if (refundQuantity[item] && refundQuantity[item] > 0) {
          itemsToRefund.push({
            itemId: item,
            itemName: selectedOrderItems.find(oi => oi.id === item)?.name,
            quantity: refundQuantity[item],
            reason: refundReason[item],
          });
        }
      });
      if (itemsToRefund.length === 0) return;
      if (itemsToRefund.length > 0) {
        setLoading(true);
        for (let index = 0; index < itemsToRefund.length; index++) {
          const item = itemsToRefund[index];
          const resp = await createOrderRefund(sellerId, orderId, {
            type: 'rehive',
            item: item.itemId,
            quantity: item.quantity,
            reason: item.reason,
          });

          if (resp?.status === 'success') {
            showToast({
              text: `Item refunded successfully: ${item.itemName}`,
              variant: 'success',
            });
            successRefund = true;
          } else {
            showToast({
              text: 'Unable to refund',
              variant: 'error',
            });
          }
        }
      }
    } catch (error) {
      showToast({
        text: 'Something went wrong',
        variant: 'error',
      });
      console.log(error);
    }
    if (successRefund) {
      refetchOrderItems();
      refetchOrderRefunds();
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
      title="confirm_refund"
      titleCentered
      hasPaddingTop
      maxWidth={600}>
      <PageContent horizontal={4}>
        <Text
          id="select_items_to_refund"
          s={14}
          className={classes.label}
          style={{ marginBottom: 16 }}
        />
        {errors.general && (
          <Text
            id={errors.general}
            s={12}
            style={{ color: 'red', marginBottom: 8 }}
          />
        )}
        {selectedOrderItems?.map(item => {
          return (
            <View fD="row" gap={2} aI="flex-start" mt={2}>
              <View fD="column" aI="center" style={{ minWidth: 120, flexShrink: 0 }}>
                <Checkbox
                  checked={selectedRefundItems.includes(item.id)}
                  onChange={e => handleItemCheck(e, item)}
                  style={{ paddingLeft: 0 }}
                />
                <Text
                  id="select_item_for_refund"
                  s={10}
                  tA="center"
                  style={{ marginTop: 4, color: '#666' }}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View fD="row" gap={2} aI="center">
                  <SimpleImg src={item?.image} height={70} width={70} />
                  <View>
                    {item.name}
                    {item.variant && (
                      <Text s={12} style={{ marginTop: 4 }} c="#797979">
                        {item.variant.label}
                      </Text>
                    )}
                    <View fD="row" gap={2} aI="center">
                      <Text
                        s={14}
                        className={classes.label}
                        width={220}
                        style={{ marginTop: 8 }}>
                        {formatAmountString(item.total_price, currency, true)}
                      </Text>
                      <Text
                        s={14}
                        className={classes.label}
                        style={{ marginTop: 8 }}>
                        {`Qty ${item.quantity}`}
                      </Text>
                    </View>
                  </View>
                </View>
                <View w="100%" mt={1} style={{ 
                  opacity: selectedRefundItems.includes(item.id) ? 1 : 0.5 
                }}>
                  <MuiTextField
                    label="Reason for refund"
                    fullWidth
                    margin="dense"
                    autoComplete="off"
                    variant="outlined"
                    disabled={!selectedRefundItems.includes(item.id)}
                    inputProps={{ style: { height: 14, fontSize: 14 } }}
                    InputLabelProps={{ style: { fontSize: 14 } }}
                    onChange={e => handleSetRefundReason(e, item)}
                    value={refundReason[item.id] || ''}
                    error={!!errors[`reason_${item.id}`]}
                    helperText={errors[`reason_${item.id}`] && (
                      <Text id={errors[`reason_${item.id}`]} s={12} />
                    )}
                  />
                  <View fD="row" aI="flex-start" gap={1} w="100%">
                    <View style={{ flex: 1 }}>
                      <MuiTextField
                        label="Quantity to refund"
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        variant="outlined"
                        disabled={!selectedRefundItems.includes(item.id)}
                        inputProps={{ 
                          style: { height: 14, fontSize: 14 },
                          min: 1,
                          max: item.quantity
                        }}
                        InputLabelProps={{
                          style: { fontSize: 14 },
                          shrink: Boolean(refundQuantity[item.id]),
                        }}
                        type="number"
                        onKeyDown={e => {
                          if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                            e.preventDefault();
                          }
                        }}
                        onChange={e =>
                          handleSetRefundQuantity(parseInt(e.target.value) || 0, item)
                        }
                        value={refundQuantity[item.id] || ''}
                        error={!!errors[`quantity_${item.id}`]}
                        helperText={errors[`quantity_${item.id}`] ? (
                          <Text id={errors[`quantity_${item.id}`]} s={12} />
                        ) : (
                          `Max: ${item.quantity}`
                        )}
                      />
                    </View>
                    <View fD="row" aI="center" gap={0.5} style={{ paddingTop: 14 }}>
                      <RemoveCircleOutlineIcon
                        style={{ 
                          color: selectedRefundItems.includes(item.id) ? '#666' : '#ccc',
                          cursor: selectedRefundItems.includes(item.id) ? 'pointer' : 'not-allowed',
                          fontSize: 24
                        }}
                        onClick={() =>
                          selectedRefundItems.includes(item.id) && handleSetRefundQuantity(
                            (refundQuantity[item.id] ?? 0) - 1,
                            item,
                          )
                        }
                      />
                      <AddCircleOutlineIcon
                        style={{ 
                          color: selectedRefundItems.includes(item.id) ? '#666' : '#ccc',
                          cursor: selectedRefundItems.includes(item.id) ? 'pointer' : 'not-allowed',
                          fontSize: 24
                        }}
                        onClick={() =>
                          selectedRefundItems.includes(item.id) && handleSetRefundQuantity(
                            (refundQuantity[item.id] ?? 0) + 1,
                            item,
                          )
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        <View mv={2}>
          <Text
            id="total_refundable_amount"
            s={14}
            className={classes.label}
            style={{ marginTop: 8 }}
            tA="right"
          />
          <Text
            s={14}
            className={classes.label}
            style={{ marginTop: 8 }}
            tA="right">
            {formatAmountString(totalRefundableAmount, currency, true)}
          </Text>
        </View>
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
              id: 'confirm_refund',
              wide: true,
              onPress: handleSubmitRefund,
              loading,
              disabled: selectedRefundItems.length === 0,
            },
          ]}
        />
      </PageContent>
    </Modal>
  );
}

export default RefundModal;
