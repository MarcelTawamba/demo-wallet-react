import React, { useMemo } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';
import Icon from 'components/outputs/Icon';
import NoSsr from '@material-ui/core/NoSsr';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
import AppMenuHeader from './AppMenuHeader';
import Text from 'components/outputs/Text';
import { useSelector } from 'react-redux';
import {
  configProductSelector,
  configAppSelector,
  configDevelopersSelector,
  configMenuSelector,
} from 'redux/rehive/selectors';
import { isBusiness, parseScreenUrl, isAdmin } from 'util/general';
import UserAvatar from 'components/layouts/Screen/Header/MenuUserAvatar';
import AppMenuSkeleton from './AppMenuSkeleton';
import { useMediaQuery, useTheme } from '@material-ui/core';
import Scrollbars from 'react-custom-scrollbars-better';
import { checkBusinessGroup } from 'util/business';
import { useBusiness } from 'contexts';

function hasBusiness(props) {
  return (
    props?.isBusinessGroup &&
    props?.services?.business_service &&
    props?.services?.payment_requests_service
  );
}
function hasBusinessProduct(props) {
  return (
    props?.isProductGroup &&
    props?.isBusinessGroup &&
    props?.services?.business_service &&
    props?.services?.product_service
  );
}

function appMenuConfig({ developersConfig: { docsUrl }, menuConfig, client }) {
  const isHidden = section =>
    Boolean(menuConfig?.items?.find(x => x.name === section)?.hide);

  return [
    // {
    //   id: 'get_started',
    //   condition: props => isBusiness(props) && props?.services?.business_service,
    // },
    {
      id: 'home',
    },
    {
      id: 'accounts',
      icon: 'wallet',
    },
    {
      id: 'payments',
      condition: props => hasBusiness(props) && !isHidden('payments'),
    },
    {
      id: 'customers',
      condition: props => hasBusiness(props) && !isHidden('customers'),
    },
    // {
    //   id: 'marketplace',
    //   icon: 'wallet',
    //   condition: props => !isHidden('marketplace'),
    //   children: [
    //     {
    //       id: 'products',

    //       icon: 'product',
    //       condition: ({ services }) =>
    //         services.product_service && !isHidden('products'),
    //     },
    //     {
    //       id: 'orders',
    //       icon: 'receipt',
    //       condition: props =>
    //         hasBusiness(props) &&
    //         props?.services?.product_service &&
    //         !isHidden('orders'),
    //     },
    //   ],
    // },
    {
      id: 'products',
      icon: 'product',
      condition: ({ services }) =>
        services.product_service && !isHidden('products'),
      children: [
        {
          id: 'admin',
          label: 'manage',
          icon: 'settings',
          condition: hasBusinessProduct,
        },
      ],
    },
    {
      id: 'orders',
      icon: 'receipt',
      condition: props =>
        hasBusiness(props) &&
        props?.services?.product_service &&
        !isHidden('orders'),
    },
    {
      id: 'invoices',
      condition: props => hasBusiness(props) && !isHidden('invoices'),
    },
    {
      id: 'payouts',
      condition: props => hasBusiness(props) && !isHidden('payouts'),
    },
    {
      id: 'reporting',
      condition: props => hasBusiness(props) && !isHidden('reporting'),
    },
    {
      id: 'team',
      condition: props => props?.isBusinessGroup,
      icon: 'groups',
      label: 'team',
    },
    {
      id: 'rewards',
      condition: ({ services }) =>
        services.rewards_service && !isHidden('rewards'),
      // children: [
      //   {
      //     id: 'admin',
      //     icon: 'settings',
      //     condition: isBusiness,
      //     // condition: isBusiness,
      //   },
      // ],
    },
    {
      id: 'developers',
      condition: props => hasBusiness(props) && !isHidden('developers'),
      children: [
        { id: 'webhooks' },
        { id: 'api_tokens' },
        {
          id: 'docs',
          url: docsUrl,
        },
      ],
    },
    {
      id: 'pos',
      condition: props => props?.isBusinessGroup && !isHidden('pos'),
      icon: 'spending',
    },
    {
      id: 'business',
      condition: props => props?.isBusinessGroup,
      icon: 'settings',
      label: 'business_settings',
    },
    {
      id: 'profile',
      condition: props => !props?.isBusinessGroup,
      icon: 'profile',
    },
    {
      id: 'settings',
      condition: props => !props?.isBusinessGroup,
      icon: 'settings',
    },
  ];
}

// const extraItems = [
//   {
//     id: 'pos',
//     condition: props => isBusiness(props),
//     label: 'Point of Sale',
//   },
// ];

export default function AppMenu(props) {
  const {
    logoutUser,
    company,
    user,
    drawerHook,
    pathname,
    isVerified,
    authConfig,
    businessServiceSettings,
    productServiceSettings,
    loading,
  } = props;

  let services = {};
  let { config: client } = useConfiguration();

  const [drawerState, setDrawerState] = drawerHook;

  company.services.map(service => {
    services[service.slug] = true;
    return { [service.slug]: true };
  });

  const classes = useStyles();

  const userGroup = user?.groups?.[0]?.name ?? 'user';
  const appConfig = useSelector(configAppSelector);
  const hide = appConfig?.menu?.hide ?? [];
  const hideGroup = hide?.includes('group');

  const productConfig = useSelector(configProductSelector);

  const { business } = useBusiness();
  const menuConfig = useSelector(configMenuSelector);

  const parsedUrl = parseScreenUrl(pathname);

  const developersConfig = useSelector(configDevelopersSelector);

  const isBusinessGroup = useMemo(
    () => checkBusinessGroup(businessServiceSettings, userGroup),
    [businessServiceSettings, userGroup],
  );
  const isProductGroup = useMemo(
    () => checkBusinessGroup(productServiceSettings, userGroup),
    [productServiceSettings, userGroup],
  );
  const config = appMenuConfig({ developersConfig, menuConfig, client });
  const filteredConfig = config
    .filter(item => hide.findIndex(hidden => hidden === item.id) === -1)
    ?.filter(
      item =>
        !(
          typeof item?.condition === 'function' &&
          !item.condition({
            services,
            userGroup,
            business,
            isBusinessGroup,
            isProductGroup,
          })
        ),
    );

  const context = { isBusinessGroup, business, services };
  const menuProps = {
    pathname,
    closeDrawer: () => setDrawerState(false),
    parsedUrl,
    services,
    userGroup,
    business,
    isBusinessGroup,
    isProductGroup,
    context,
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(980));

  const { name = '', label = '' } = get(user, ['groups', 0], {
    name: '',
    label: '',
  });
  const isAdmin = Boolean(userGroup.match(/admin/));

  return (
    <NoSsr>
      <div className={classes.container}>
        {isAdmin && (
          <Tooltip
            title={`You're logged in as an admin to this wallet. Note that the configuration for other user groups might be different. If you're testing the end-user experience it is recommended to create a new user account by registering as a user.`}>
            <div className={classes.group}>
              <Icon icon={'admin'} size={14} color="primary" />
              <Text
                align={'center'}
                width="auto"
                myColor="primaryContrast"
                style={{ fontWeight: 400, fontSize: 12 }}
                variant={'subtitle1'}>
                {label ? label.toUpperCase() : name.toUpperCase()}
              </Text>
            </div>
          </Tooltip>
        )}
        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <div className={classes.innerContainer}>
            <div
              w={'100%'}
              style={{ width: '100%' }}
              // f={1}
            >
              <AppMenuHeader
                company={company}
                user={user}
                isBusinessGroup={isBusinessGroup}
                loading={loading}
                hideGroup={hideGroup}
              />
              {loading ? (
                <AppMenuSkeleton />
              ) : isVerified ? (
                <Menu>
                  {filteredConfig.map(item => (
                    <MenuItem key={item.id} item={item} {...menuProps} />
                  ))}
                </Menu>
              ) : (
                <>
                  <div className={classes.error}>
                    <Text
                      align={'center'}
                      myColor="primary"
                      style={{ fontWeight: 600 }}
                      variant={'body2'}
                      id="app_tier_requirement"
                      context={{ tier: get(authConfig, 'tier', 0) }}
                    />
                  </div>
                </>
              )}
            </div>
            <Menu>
              <MenuItem
                item={{ id: 'help', label: 'help', icon: 'help' }}
                {...menuProps}
              />
              {(client.apple_app_store_url ||
                client.android_play_store_url) && (
                <MenuItem
                  item={{
                    id: 'mobile',
                    label: 'get_mobile_app',
                    icon: 'download',
                  }}
                  {...menuProps}
                />
              )}
              {isBusinessGroup ? (
                <UserAvatar menuProps={menuProps} logoutUser={logoutUser} />
              ) : (
                <MenuItem
                  item={{ id: 'logout', label: 'log_out', icon: 'exit' }}
                  to="/"
                  onClick={logoutUser}
                />
              )}
            </Menu>
          </div>
        </Scrollbars>
      </div>
    </NoSsr>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#F4F4f4',
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100vh',
    // overflowY: 'scroll',
    overflowX: 'hidden',
    justifyContent: 'space-between',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: theme.spacing(2),
  },
  error: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  group: {
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    maxHeight: 22,
    padding: theme.spacing(0.125),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}));
