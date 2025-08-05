import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import Text from 'components/outputs/Text';
import Skeleton from '@material-ui/lab/Skeleton';
import { concatAddress } from 'util/general';
import Modal from 'components/layout/Modal';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import PageButtons from 'components/layout/page/PageButtons';
import { AddressForm } from 'components/rehive/AddressForm';
import { RehiveForm } from 'components/rehive/RehiveForm';
import { useRehive } from 'hooks/rehive';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'redux/rehive/selectors';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';

const modalConfig = {
  contact_mobile: {
    title: 'mobile_number',
    value: item => (item.number ? item.number : item),
    setValue: item => item.number,
  },
  contact_email: {
    title: 'email_address',
    value: item => (item.email ? item.email : item),
    setValue: item => item.email,
  },
  shipping_address: {
    title: 'shipping_address',
    value: item => concatAddress(item),
    setValue: item => concatAddress(item),
  },
  billing_address: {
    title: 'billing_address',
    value: item => concatAddress(item),
    setValue: item => concatAddress(item),
  },
};

export default function CheckoutRequired(props) {
  const { cart, orderData, setOrderData } = props;

  const classes = useStyles(props);
  const [modal, setModal] = useState('');
  const [state, setState] = useState('');
  const [customEmails, setCustomEmails] = useState([]);
  const [customMobiles, setCustomMobiles] = useState([]);

  const {
    requires_billing_address,
    requires_contact_email,
    requires_contact_mobile,
    requires_shipping_address,
  } = cart;

  let dataTypes = [];
  let sections = [];
  if (requires_shipping_address || requires_billing_address)
    dataTypes.push('address');
  if (requires_shipping_address) sections.push('shippingAddress');
  if (requires_billing_address) sections.push('billingAddress');
  if (requires_contact_email) {
    sections.push('emails');
    dataTypes.push('emails');
  }
  if (requires_contact_mobile) {
    sections.push('mobiles');
    dataTypes.push('mobiles');
  }

  const profile = useSelector(userProfileSelector);
  const user = profile?.items?.[0];

  const { context, refresh, loading } = useRehive(dataTypes, true, { user });

  const { emails, mobiles, address } = context;

  const emailItems = [...(emails?.items ?? []), ...customEmails];
  const emailItem =
    emailItems?.find(item => item?.primary) ?? emails?.items?.[0];
  const mobileItems = [...(mobiles?.items ?? []), ...customMobiles];
  const mobileItem =
    mobileItems?.find(item => item?.primary) ?? mobiles?.items?.[0];
  let billingAddresses = [];
  let billingAddress = null;

  billingAddresses =
    address?.items?.filter(item => item?.type === 'billing') ?? [];
  if (billingAddresses.length > 0) billingAddress = billingAddresses[0];

  let shippingAddresses = [];
  let shippingAddress = null;

  shippingAddresses =
    address?.items?.filter(item => item?.type === 'shipping') ?? [];
  if (shippingAddresses.length > 0) shippingAddress = shippingAddresses[0];

  function updateOrderData(id, value) {
    setOrderData({ ...orderData, [id]: value });
  }

  useEffect(() => {
    if (emailItem && !orderData?.contact_email) {
      updateOrderData('contact_email', emailItem?.email);
    }
  }, [emailItem]);

  useEffect(() => {
    if (mobileItem && !orderData?.contact_mobile) {
      updateOrderData('contact_mobile', mobileItem?.number);
    }
  }, [mobileItem]);

  useEffect(() => {
    if (address?.items?.length > 0) {
      if (!orderData?.shipping_address && shippingAddress) {
        updateOrderData(
          'shipping_address',
          concatAddress(shippingAddress, true),
        );
      }
      if (!orderData?.billing_address && billingAddress) {
        updateOrderData('billing_address', concatAddress(billingAddress, true));
      }
    }
  }, [address]);

  function addDetails(type, data) {
    switch (type) {
      case 'emails':
        setCustomEmails([...customEmails, data]);
        break;
      case 'mobiles':
        setCustomMobiles([...customMobiles, data]);
        break;
      default:
        break;
    }
    setState('');
  }

  const configs = {
    billingAddress: {
      title: 'billingAddress',
      type: 'billing_address',
      value: orderData?.billing_address,
      loading: address?.loading,
    },
    shippingAddress: {
      title: 'shippingAddress',
      type: 'shipping_address',
      value: orderData?.shipping_address,
      loading: address?.loading,
    },
    emails: {
      title: 'email',
      type: 'contact_email',
      value: orderData?.contact_email,
      loading: emails?.loading,
    },
    mobiles: {
      title: 'mobile',
      type: 'contact_mobile',
      value: orderData?.contact_mobile,
      loading: mobiles?.loading,
    },
  };

  // const priceString = formatAmountString(total_price, currency, true);

  let formType = '';

  let data = [];
  if (modal) {
    switch (modal) {
      case 'contact_email':
        data = emailItems;
        formType = 'emails';
        break;
      case 'contact_mobile':
        data = mobileItems;
        formType = 'mobiles';
        break;
      case 'shipping_address':
        data = shippingAddresses;
        formType = 'address';
        break;
      case 'billing_address':
        data = billingAddresses;
        formType = 'address';
        break;
      default:
    }
  }
  if (!cart) {
    return null;
  }

  const getEmptyListMessage = () => {
    switch (modal) {
      case 'contact_email':
        return 'email_empty';
      case 'contact_mobile':
        return 'mobile_empty';
      case 'shipping_address':
        return 'shipping_address_empty';
      case 'billing_address':
        return 'billing_address_empty';
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <div className={classes.container}>
        {/* <Text align="center" style={{ fontWeight: 600, paddingBottom: 12 }}>
          Required information for checkout
        </Text> */}
        {sections.map(item => (
          <RequiredContent
            key={item}
            id={item}
            {...configs[item]}
            setModal={setModal}
          />
        ))}
      </div>
      <Modal
        close
        title={
          (state === 'add' ? 'add_' : 'select_') +
          get(modalConfig, [modal, 'title'])
        }
        maxWidth={500}
        open={Boolean(modal)}
        onDismiss={() => {
          setModal('');
          setState('');
        }}>
        {state === 'add' ? (
          <div>
            {formType === 'address' ? (
              <AddressForm
                type={modal === 'billing_address' ? 'billing' : 'shipping'}
                onDetailClose={() => setState('')}
                noPadding
                onSaveSuccess={() => {
                  refresh();
                  setState('');
                }}
              />
            ) : (
              <RehiveForm
                type={formType}
                onDetailClose={() => setState('')}
                noPadding
                onSave={addDetails}
              />
            )}
          </div>
        ) : (
          <div className={classes.modal}>
            {data.length > 0 ? (
              <div style={{ marginLeft: -20, marginRight: -20 }}>
                {data.map((item, ind) => {
                  const valueFunction = get(
                    modalConfig,
                    [modal, 'value'],
                    () => '',
                  );
                  const setValueFunction = get(
                    modalConfig,
                    [modal, 'setValue'],
                    () => '',
                  );
                  const value = valueFunction(item);

                  return (
                    <ListItem
                      key={value}
                      button
                      onClick={() => {
                        setOrderData({
                          ...orderData,
                          [modal]: setValueFunction(item),
                        });
                        setModal('');
                      }}>
                      <Text className={classes.listItem}>{value}</Text>
                    </ListItem>
                  );
                })}
              </div>
            ) : (
              <EmptyListMessage id={getEmptyListMessage()} />
            )}
            <PageButtons
              items={[
                {
                  id: 'add',
                  capitalize: true,
                  noPadding: true,
                  onPress: () => setState('add'),
                },
              ]}
              variant={'text'}
            />
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
}

function RequiredContent(props) {
  let { title, id, value, children, type, setModal, loading } = props;

  return (
    <View>
      <View pb={0.5}>
        <Text style={{ fontSize: 18 }} fontWeight="500" id={title ?? id} />
      </View>
      {loading && !value ? (
        <View pv={0.2}>
          <Skeleton width={300} height={20} />
        </View>
      ) : children ? (
        children
      ) : (
        <Text
          c={value ? 'font' : 'fontLight'}
          style={{ fontSize: 14 }}
          id={value ? value : 'not_yet_provided'}
        />
      )}
      {!loading && (
        <Button
          id={value ? 'change' : `add_${title}`}
          variant="link"
          color={'primary'}
          disabled={typeof setModal !== 'function'}
          style={{ alignSelf: 'flex-end' }}
          onPress={() =>
            typeof setModal === 'function' ? setModal(type ? type : id) : {}
          }
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(3),
    width: '100%',
  },
  listItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  edit: {
    height: 100,
    backgroundColor: 'orange',
  },
}));
