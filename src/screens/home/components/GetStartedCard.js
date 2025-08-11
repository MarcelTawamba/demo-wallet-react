import React, { useEffect, useMemo, useState } from 'react';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/Icon';
import { makeStyles } from '@material-ui/styles';
import { Button } from 'components/inputs/Button';
import { IconButton } from '@material-ui/core';
import { useQuery } from 'react-query';
import { getBusinessInvoices, getTransactions } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import { getProducts } from 'screens/products_admin/util/rehive';
import { useDismissed } from 'hooks/general';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core';
import { useGetSellers } from 'hooks/businessAPI';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 8,
    padding: 8,
    width: '100%',
  },
  hideButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    cursor: 'pointer',
    color: '#ffffff',
    borderRadius: 2,
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
}));
const customerFeatures = [
  {
    id: 'deposit',
    completed: false,
    to: 'deposit', // route dynamically created
    icon: 'payouts',
    actionName: 'deposit',
    title: 'add_funds',
    description: 'get_started_deposit_description',
    isAccountRoute: true,
  },
  {
    id: 'send',
    completed: false,
    to: 'send',
    icon: 'sent',
    actionName: 'send',
    title: 'get_started_send_title',
    description: 'get_started_send_description',
    isAccountRoute: true,
  },
  {
    id: 'buy',
    completed: false,
    to: 'exchange',
    icon: 'sync_alt',
    actionName: 'buy',
    title: 'get_started_buy_title',
    description: 'get_started_buy_description',
    isAccountRoute: true,
  },
  {
    id: 'receive',
    completed: false,
    to: 'receive',
    icon: 'qr_code_scanner',
    actionName: 'receive',
    title: 'get_started_receive_title',
    description: 'get_started_receive_description',
    isAccountRoute: true,
  },
];
const businessFeatures = [
  {
    id: 'deposit',
    completed: false,
    to: 'deposit', // route dynamically created
    icon: 'payouts',
    actionName: 'deposit',
    title: 'add_funds',
    description: 'get_started_deposit_description',
    isAccountRoute: true,
  },
  {
    id: 'product',
    completed: false,
    to: '/products_admin/',
    icon: 'shopping_bag',
    actionName: 'add_product',
    title: 'get_started_add_product_title',
    description: 'get_started_add_product_description',
  },
  {
    id: 'invoice',
    completed: false,
    to: '/invoices/',
    icon: 'description',
    actionName: 'add_invoice',
    title: 'get_started_add_invoice_title',
    description: 'get_started_add_invoice_description',
  },
  {
    id: 'pos',
    completed: false,
    to: '/pos/',
    icon: 'qr_code',
    actionName: 'pos',
    title: 'scan_to_pay',
    description: 'get_started_scan_description',
  },
];

export default function GetStartedCard(props) {
  const { userId, company, services, cardsConfig, isBusinessGroup, ...restProps } = props;
  const classes = useStyles();
  const history = useHistory();
  const [sellerId, setSellerId] = useState();
  // const [allCompleted, setAllCompleted] = useState(false);
  const [hideSection, setHideSection] = useState(false);
  const [features, setFeatures] = useState([]);

  const [depositCompleted, setDepositCompleted] = useState(false);
  const [sendCompleted, setSendCompleted] = useState(false);
  const [buyCompleted, setBuyCompleted] = useState(false);
  const [receiveCompleted, setReceiveCompleted] = useState(false);
  const [withdrawCompleted, setWithdrawCompleted] = useState(false);
  const [productCompleted, setProductCompleted] = useState(false);
  const [invoiceCompleted, setInvoiceCompleted] = useState(false);
  const [posCompleted, setPosCompleted] = useState(false);

  useEffect(() => {
    let featuresToUse = isBusinessGroup ? businessFeatures : customerFeatures;
    
    // Apply configuration (text overrides and enable/disable)
    featuresToUse = applyFeatureConfiguration(featuresToUse);
    
    setFeatures(featuresToUse);
  }, [isBusinessGroup, cardsConfig]);

  const { dismiss: dismissSection } = useDismissed('homepage_get_started');

  // Apply configuration to features (text overrides and enable/disable)
  const applyFeatureConfiguration = (baseFeatures) => {
    const getStartedConfig = cardsConfig?.home?.getStarted?.steps || {};
    
    return baseFeatures.map(feature => {
      const stepConfig = getStartedConfig[feature.id];
      if (!stepConfig) return feature;

      // Create configured feature with overrides
      const configuredFeature = { ...feature };
      
      // Override text if provided in config
      if (stepConfig.title) configuredFeature.title = stepConfig.title;
      if (stepConfig.description) configuredFeature.description = stepConfig.description;
      
      // Add enabled flag (defaults to true if not specified)
      configuredFeature.enabled = stepConfig.enabled !== false;
      
      return configuredFeature;
    }).filter(feature => feature.enabled !== false); // Filter out disabled features
  };

  const checkAllCompletion = () => {
    if (features.length === 0) return;
    setTimeout(() => {
      const actionRemains = features?.find(feature => !completed?.[feature.id]);
      if (!actionRemains) {
        // setAllCompleted(true);
        dismissSection();
      }
    }, 500); // using setTimeout for setState delay precaution
  };

  const handleDismiss = () => {
    setHideSection(true);
    dismissSection();
  };

  const { isLoading: isDepositLoading } = useQuery(
    [userId, 'deposits'],
    () =>
      getTransactions({
        subtype__in: 'deposit_fiat,deposit_ach,deposit_crypto,deposit_manual',
        page_size: 1,
      }),
    {
      enabled: features.length > 0,
      onSuccess: deposits => {
        if (deposits?.count > 0) {
          setDepositCompleted(true);
        }
      },
    },
  );

  const { isLoading: isReceiveLoading } = useQuery(
    [userId, 'receives'],
    () =>
      getTransactions({
        subtype__in: 'receive_email,receive_mobile,receive_crypto',
        page_size: 1,
      }),
    {
      enabled: !isBusinessGroup && features.length > 0,
      onSuccess: receives => {
        if (receives?.count > 0) {
          setReceiveCompleted(true);
        }
      },
    },
  );

  const { isLoading: isSendLoading } = useQuery(
    [userId, 'sends'],
    () =>
      getTransactions({
        subtype__in: 'send_email,send_mobile,send_crypto,send_account',
        page_size: 1,
      }),
    {
      enabled: !isBusinessGroup && features.length > 0,
      onSuccess: sends => {
        if (sends?.count > 0) {
          setSendCompleted(true);
        }
      },
    },
  );

  const { isLoading: isBuyLoading } = useQuery(
    [userId, 'buys'],
    () =>
      getTransactions({
        subtype__in: 'buy',
        page_size: 1,
      }),
    {
      enabled: isBusinessGroup && features.length > 0,
      onSuccess: buys => {
        if (buys?.count > 0) {
          setBuyCompleted(true);
        }
      },
    },
  );

  const { isLoading: isWithdrawLoading } = useQuery(
    [userId, 'withdrawals'],
    () =>
      getTransactions({
        subtype__in: 'withdraw_manual,withdraw_ach,withdraw_fiat',
        page_size: 1,
      }),
    {
      enabled: !isBusinessGroup && features.length > 0,
      onSuccess: buys => {
        if (buys?.count > 0) {
          setWithdrawCompleted(true);
        }
      },
    },
  );

  const { data: sellerData, isLoading: isSellerLoading } = useGetSellers(
    userId,
    isBusinessGroup && features.length > 0,
  );

  useEffect(() => {
    if (sellerData?.data?.count > 0) {
      setSellerId(sellerData?.data?.results?.[0]?.id ?? '');
    }
  }, [sellerData]);

  const { isLoading: isProductLoading } = useQuery(
    [userId, 'products'],
    () => getProducts(sellerId),
    {
      enabled: Boolean(isBusinessGroup && sellerId) && features.length > 0,
      onSuccess: ({ data: products }) => {
        if (products?.count > 0) {
          setProductCompleted(true);
        }
      },
    },
  );

  const { isLoading: isInvoiceLoading } = useQuery(
    [userId, 'invoices'],
    () => getBusinessInvoices(sellerId),
    {
      enabled: Boolean(isBusinessGroup && sellerId) && features.length > 0,
      onSuccess: ({ data: invoices }) => {
        if (invoices?.count > 0) {
          setInvoiceCompleted(true);
        }
      },
    },
  );

  const { isLoading: isPosLoading } = useQuery(
    [userId, 'posSales'],
    () =>
      getTransactions({
        subtype__in: 'sale_pos',
        page_size: 1,
      }),
    {
      enabled: isBusinessGroup && features.length > 0,
      onSuccess: posSales => {
        if (posSales?.count > 0) {
          setPosCompleted(true);
        }
      },
    },
  );

  const completed = useMemo(
    () => ({
      deposit: depositCompleted,
      receive: receiveCompleted,
      buy: buyCompleted,
      send: sendCompleted,
      pos: posCompleted,
      product: productCompleted,
      withdraw: withdrawCompleted,
      invoice: invoiceCompleted,
    }),
    [
      depositCompleted,
      receiveCompleted,
      buyCompleted,
      sendCompleted,
      posCompleted,
      productCompleted,
      withdrawCompleted,
      invoiceCompleted,
    ],
  );

  useEffect(() => {
    checkAllCompletion();
  }, [completed]);

  if (hideSection) return null;

  return (
    <div className={classes.container}>
      {features.length === 0 ||
      isDepositLoading ||
      isReceiveLoading ||
      isBuyLoading ||
      isSendLoading ||
      isPosLoading ||
      isSellerLoading ||
      isProductLoading ||
      isWithdrawLoading ||
      isInvoiceLoading ? (
        <Spinner size={24} />
      ) : (
        <View bC="#ffffff" bR={8} w="100%" pv={1} ph={1.5} style={{ position: 'relative' }}>
          <div
            className={classes.hideButton}
            onClick={handleDismiss}
          >
            <Icon icon="close" size={8} color="primary" style={{opacity: 0.5 }} />
          </div>
          <View w="100%" fD="row" jC="space-between">
            <View w="100%">
              <Text fontWeight={500} s={18} id="get_started" />
              <Text
                variant="body2"
                style={{ marginBottom: 8 }}
                id="get_started_follow_step"
                values={{
                  company: { name: company?.name },
                }}
              />
            </View>
          </View>
          {features.map(feature => (
            <FeatureItem
              completed={completed?.[feature?.id]}
              key={feature.id}
              feature={feature}
              history={history}
              {...restProps}
            />
          ))}
        </View>
      )}
    </div>
  );
}

function FeatureItem({ feature, history, wallets, completed }) {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const handleRedirect = () => {
    let routeName = feature.to;
    if (feature.isAccountRoute && wallets?.items?.length) {
      const account = wallets.items[0];
      routeName = `/accounts/${account?.account}/${account?.currency?.code}/${feature.to}/`;
    }
    history.push(routeName);
  };
  return (
    <View fD="row" aI="center" jC="space-between" w="100%" mv={0.4}>
      <View fD="row" aI="center">
        <Icon
          style={{ [isRtl ? 'marginLeft' : 'marginRight']: 14 }}
          size={16}
          icon={completed ? 'Check' : feature.icon}
          color={completed ? 'success' : 'primary'}
          // icon={feature.icon}
          // color={'primary'}
          iconColor="#ffffff"
        />
        <View>
          <Text fontWeight="500" s={14} id={feature.title} />
          <Text
            variant="body2"
            style={{ marginTop: 4 }}
            id={feature.description}
          />
        </View>
      </View>
      <Button
        color="primary"
        variant="outlined"
        thin
        style={{ minWidth: 110 }}
        fontSize="14px"
        onClick={handleRedirect}
        id={feature.actionName}
        capitalize
      />
    </View>
  );
}
