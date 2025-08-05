import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Text from 'components/outputs/Text';
import { formatTime, formatAmountString } from 'util/general';
import { updateOrder, updateOrderItem } from 'screens/orders/util/rehive';
import {
  useGetOrder,
  useGetOrderItems,
  useGetOrderPayments,
  useGetOrderRefunds,
} from 'hooks/orderAPI';
import Spinner from 'components/outputs/Spinner';
import { SimpleImg } from 'react-simple-img';
import { Button } from 'components/inputs/Button';
import Tabs from 'components/menu/TabsNew';
import { View } from 'components/layout/View';
import Selector from 'components/inputs/Selector';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { useLocation } from 'react-router-dom';
import RefundModal from './RefundModal';
import TrackingUrlModal from './TrackingUrlModal';
import AddressDetails from './AddressDetails';
import { isArray } from 'lodash';

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: 'none',
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  label: {
    fontWeight: 'bold',
    color: '#393939',
    fontSize: 13,
    marginTop: 16,
  },
  value: {
    color: '#393939',
    fontSize: 13,
    marginTop: 6,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    marginRight: theme.spacing(10),
    [theme.breakpoints.down(760)]: {
      marginRight: theme.spacing(3),
      maxWidth: 'none',
      width: '100%',
    },
    maxWidth: 300,
  },
  columnEnd: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  image: { maxWidth: 70, maxHeight: 70, marginRight: theme.spacing(2) },
  text: { fontSize: 13, color: '#393939', paddingBottom: theme.spacing(1) },
}));

const tabs = [
  {
    label: 'order_info',
    value: 'order_info',
  },
  {
    label: 'payments',
    value: 'payments',
  },
  {
    label: 'refunds',
    value: 'refunds',
  },
];
const statusOptions = [
  { value: 'placed', label: 'Placed' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'complete', label: 'Complete' },
  { value: 'failed', label: 'Failed' },
];

const actionOptions = [
  { value: 'placeholder', label: 'Select an action to run', disabled: true },
  { value: 'refund_selected', label: 'Refund selected items' },
  { value: 'manage_tracking_urls', label: 'Manage tracking URLs' },
];

const itemStatusOptions = [
  { value: 'complete', label: 'Complete' },
  { value: 'failed', label: 'Failed' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
];

export default function OrderDetail(props) {
  const classes = useStyles(props);
  const location = useLocation();
  const orderId = location.pathname?.split('/')?.[3];
  const {
    context,
    helpers: { showToast },
  } = props;

  const [tabId, setTabId] = useState('order_info');
  const [loading, setLoading] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [selectedOrderItemStatuses, setSelectedOrderItemStatuses] = useState(
    {},
  );
  const [selectedAction, setSelectedAction] = useState('placeholder');
  const [selectedActionItems, setSelectedActionItems] = useState([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const sellerId = context?.sellers?.[0]?.id ?? '';
  // get order details
  const {
    data: orderData,
    isLoading: isOrderLoading,
    refetch: refetchOrder,
  } = useGetOrder(sellerId, orderId, Boolean(sellerId, orderId));
  const order = orderData?.data;

  // get order items
  const {
    data: orderItemsData,
    isLoading: isOrderItemsLoading,
    refetch: refetchOrderItems,
  } = useGetOrderItems(sellerId, orderId, Boolean(sellerId, orderId));
  const orderItems = orderItemsData?.data?.results;

  // get order refunds
  const {
    data: orderRefundsData,
    isLoading: isOrderRefundsLoading,
    refetch: refetchOrderRefunds,
  } = useGetOrderRefunds(sellerId, orderId, Boolean(sellerId, orderId));
  const refundItems = orderRefundsData?.data?.results;

  // get order payments
  const { data: orderPaymentData } = useGetOrderPayments(
    sellerId,
    orderId,
    Boolean(sellerId, orderId),
  );
  const paymentItems = orderPaymentData?.data?.results;

  const refundInfo = useMemo(() => {
    // needed for product items table
    let _refundInfo = {};
    if (isArray(refundItems)) {
      refundItems.forEach(refundItem => {
        if (_refundInfo[[refundItem.item]]) {
          _refundInfo[[refundItem.item]].quantity += refundItem.quantity;
          _refundInfo[[refundItem.item]].amount += refundItem.amount;
        } else {
          _refundInfo[[refundItem.item]] = {
            itemId: refundItem.item,
            quantity: refundItem.quantity,
            amount: refundItem.amount,
          };
        }
      });
    }
    return _refundInfo;
  }, [refundItems]);

  const {
    id,
    status,
    total_price,
    currency,
    placed,
    created,
    updated,
    billing_address,
    shipping_address,
  } = order ?? {};

  const orderDetailsOutputs = useMemo(() => {
    let _outputs = [];
    if (order) {
      _outputs.push({ label: 'Order id', value: order.id });
      _outputs.push({
        label: 'Date created',
        value: formatTime(placed ?? created, 'MMMM DD YYYY, h:mm'),
      });
      _outputs.push({
        label: 'Last updated',
        value: formatTime(updated, 'MMMM DD YYYY, h:mm'),
      });
      _outputs.push({
        label: 'Total',
        value: formatAmountString(total_price, currency, true),
      });
    }
    return _outputs;
  }, [order]);

  const handleUpdateOrderStatus = async () => {
    setLoading(true);
    const resp = await updateOrder(sellerId, id, {
      status: selectedOrderStatus,
    });
    if (resp?.status === 'success') {
      showToast({
        text: 'Order status updated: ' + status,
        variant: 'success',
      });
      refetchOrder();

      let timer = setTimeout(() => {
        setLoading(false);
        return () => clearTimeout(timer);
      }, 2000);
    } else {
      showToast({
        text: 'Unable to update order status: ' + resp?.message,
        variant: 'error',
      });
      setLoading(false);
    }
  };

  const handleUpdateOrderItemStatus = async itemId => {
    setLoading(true);
    const resp = await updateOrderItem(sellerId, id, itemId, {
      status: selectedOrderItemStatuses[itemId],
    });
    if (resp?.status === 'success') {
      showToast({
        text: 'Order item status updated: ' + status,
        variant: 'success',
      });
      refetchOrderItems();

      let timer = setTimeout(() => {
        setLoading(false);
        return () => clearTimeout(timer);
      }, 2000);
    } else {
      showToast({
        text: 'Unable to update order item status: ' + resp?.message,
        variant: 'error',
      });
      setLoading(false);
    }
  };

  const handleItemCheck = (e, item) => {
    let _selectedActionItems;
    if (e.target.checked) {
      _selectedActionItems = [...selectedActionItems];
      _selectedActionItems.push(item.id);
    } else {
      _selectedActionItems = selectedActionItems.filter(
        itemId => itemId !== item.id,
      );
    }
    setSelectedActionItems(_selectedActionItems);
  };

  const handleActionStart = () => {
    if (selectedAction === 'refund_selected') {
      setShowRefundModal(true);
    } else if (selectedAction === 'manage_tracking_urls') {
      setShowTrackingModal(true);
    }
  };

  if (!order)
    return (
      <Spinner
        size={32}
        containerStyle={{ position: 'absolute', top: '50%' }}
      />
    );

  return (
    <Grid item xs={12} key={id}>
      <Tabs
        tabs={tabs}
        tabId={tabId}
        onChange={tabId => setTabId(tabId)}
        withUnderlineDecoration={false}
      />
      <div style={{ marginTop: 16 }} />
      {(loading || isOrderLoading || isOrderItemsLoading) && (
        <Spinner
          size={32}
          containerStyle={{ position: 'absolute', top: '50%' }}
        />
      )}
      {tabId === 'order_info' && (
        <>
          <Paper className={classes.paper}>
            <Text id="order_details" className={classes.text} bold s={16} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                {orderDetailsOutputs?.map(output => (
                  <View key={output.label}>
                    <Text className={classes.label}>{output.label}</Text>
                    <Text className={classes.value}>{output.value}</Text>
                  </View>
                ))}
                <View>
                  <Text className={classes.label}>Status</Text>
                  <View fD="row" aI="center" w="100%">
                    <Selector
                      variant="outlined"
                      options={statusOptions}
                      items={statusOptions}
                      value={selectedOrderStatus ?? status}
                      onValueChange={v => setSelectedOrderStatus(v)}
                      style={{ height: 32 }}
                    />
                    <Button
                      id="save"
                      variant="text"
                      color="primary"
                      disabled={
                        !selectedOrderStatus || selectedOrderStatus === status
                      }
                      onClick={handleUpdateOrderStatus}
                    />
                  </View>
                </View>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <View aI="center">
                  <div>
                    <Text className={classes.label}>Shipping address</Text>
                    <AddressDetails address={shipping_address} />
                  </div>
                </View>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <View aI="center">
                  <div>
                    <Text className={classes.label}>Billing address</Text>
                    <AddressDetails address={billing_address} />
                  </div>
                </View>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <View aI="center">
                  <div>
                    <Text className={classes.label}>User information</Text>
                    <View grid gap={0.5} mt={0.75}>
                      <Text className={classes.text}>
                        {order?.contact_email}
                      </Text>
                      <Text className={classes.text}>
                        {order?.contact_mobile}
                      </Text>
                    </View>
                  </div>
                </View>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.paper}>
            <View fD="row" aI="center" w="100%">
              <Text id="product_items" className={classes.text} bold s={16} />
              <View fD="row" aI="center" w="100%">
                <Text
                  id="action"
                  className={classes.text}
                  bold
                  s={16}
                  tA="right"
                  style={{ paddingRight: 16, transform: 'translateY(7px)' }}
                />
                <Selector
                  variant="outlined"
                  options={actionOptions}
                  items={actionOptions}
                  onValueChange={v => setSelectedAction(v)}
                  value={selectedAction}
                  style={{ height: 32 }}
                />
                <Button
                  id="start"
                  variant="text"
                  color="primary"
                  disabled={
                    selectedAction === 'placeholder' ||
                    selectedActionItems.length === 0
                  }
                  tooltip={
                    selectedActionItems.length === 0
                      ? 'Select items below to apply this action to'
                      : ''
                  }
                  onClick={handleActionStart}
                />
              </View>
            </View>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems?.map(item => (
                  <>
                    <TableRow key={item.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ borderBottom: 'none' }}>
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
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ borderBottom: 'none' }}>
                        {item.quantity}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ borderBottom: 'none' }}>
                        {formatAmountString(item.price, currency, true)}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ borderBottom: 'none' }}>
                        {formatAmountString(item.total_price, currency, true)}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ borderBottom: 'none' }}>
                        <View fD="row" aI="center" jC="center">
                          <Selector
                            variant="outlined"
                            options={itemStatusOptions}
                            items={itemStatusOptions}
                            onValueChange={value =>
                              setSelectedOrderItemStatuses({
                                ...selectedOrderItemStatuses,
                                [item.id]: value,
                              })
                            }
                            value={
                              selectedOrderItemStatuses[item.id] ?? item.status
                            }
                            style={{ height: 32 }}
                            width={180}
                          />
                          <Button
                            id="save"
                            variant="text"
                            color="primary"
                            disabled={
                              !selectedOrderItemStatuses[item.id] ||
                              selectedOrderItemStatuses[item.id] === item.status
                            }
                            onClick={() => handleUpdateOrderItemStatus(item.id)}
                          />
                        </View>
                      </TableCell>
                      <TableCell align="left" style={{ borderBottom: 'none' }}>
                        <Checkbox
                          checked={selectedActionItems.includes(item.id)}
                          onChange={e => handleItemCheck(e, item)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} style={{ paddingTop: 0 }}>
                        {item.tracking_url && (
                          <View fD="row" mb={0.5}>
                            <Text s={14} width={100}>
                              Tracking URL:
                            </Text>
                            <a
                              href={item.tracking_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#5336FF' }}>
                              {item.tracking_url}
                            </a>
                          </View>
                        )}
                        {Boolean(refundInfo[[item.id]]) && (
                          <Text className={classes.text} c="#FF0000">
                            {`Qty ${
                              refundInfo[[item.id]].quantity
                            } refunded for ${formatAmountString(
                              refundInfo[[item.id]].amount,
                              currency,
                              true,
                            )}`}
                          </Text>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
      {tabId === 'payments' && (
        <>
          {paymentItems?.map(item => {
            return (
              <Paper key={item.id} className={classes.paper}>
                <Text
                  id="Payment details"
                  className={classes.text}
                  bold
                  s={16}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    <View>
                      <Text className={classes.label}>Payment Id</Text>
                      <Text className={classes.value}>{item.id}</Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Creation Id</Text>
                      <Text className={classes.value}>{item.collection}</Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Amount</Text>
                      <Text className={classes.value}>
                        {formatAmountString(item.amount, currency, true)}
                      </Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Status</Text>
                      <Text
                        className={classes.value}
                        style={{ textTransform: 'capitalize' }}>
                        {item.status}
                      </Text>
                    </View>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <View>
                      <Text className={classes.label}>Date created</Text>
                      <Text className={classes.value}>
                        {formatTime(item.created, 'MMMM DD YYYY, h:mm')}
                      </Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Date updated</Text>
                      <Text className={classes.value}>
                        {formatTime(item.updated, 'MMMM DD YYYY, h:mm')}
                      </Text>
                    </View>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </>
      )}
      {tabId === 'refunds' && (
        <>
          {refundItems?.map(item => {
            const orderItem = orderItems?.find(oi => oi.id === item.item);
            return (
              <Paper key={item.id} className={classes.paper}>
                <Text
                  id="Refund item details"
                  className={classes.text}
                  bold
                  s={16}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <View>
                      <Text className={classes.label}>Item name</Text>
                      <Text className={classes.value}>{orderItem?.name}</Text>
                    </View>
                    <View>
                      <Text className={classes.label}>variant</Text>
                      <Text className={classes.value}>
                        {orderItem?.variant?.label}
                      </Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Quantity refunded</Text>
                      <Text className={classes.value}>{item.quantity}</Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Amount</Text>
                      <Text className={classes.value}>
                        {formatAmountString(item.amount, currency, true)}
                      </Text>
                    </View>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <View>
                      <Text className={classes.label}>Item Id</Text>
                      <Text className={classes.value}>{item.item}</Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Status</Text>
                      <Text
                        className={classes.value}
                        style={{ textTransform: 'capitalize' }}>
                        {item.status}
                      </Text>
                    </View>
                    <View>
                      <Text className={classes.label}>Refund reason</Text>
                      <Text className={classes.value}>
                        {item.reason ?? 'N/A'}
                      </Text>
                    </View>
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </>
      )}
      <RefundModal
        showModal={showRefundModal}
        setShowModal={setShowRefundModal}
        selectedActionItems={selectedActionItems}
        orderItems={orderItems}
        currency={currency}
        orderId={id}
        sellerId={sellerId}
        showToast={showToast}
        refetchOrderItems={refetchOrderItems}
        refetchOrderRefunds={refetchOrderRefunds}
      />
      <TrackingUrlModal
        showModal={showTrackingModal}
        setShowModal={setShowTrackingModal}
        selectedActionItems={selectedActionItems}
        orderItems={orderItems}
        orderId={id}
        sellerId={sellerId}
        showToast={showToast}
        refetchOrderItems={refetchOrderItems}
      />
    </Grid>
  );
}
