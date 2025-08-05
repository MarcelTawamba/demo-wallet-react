import React from 'react';
import { useTheme } from 'components/app/context';
import { makeStyles } from '@material-ui/core';
import MaterialIcons from './materialIcons';
import CustomIcons from './customIcons';
import Typography from '@material-ui/core/Typography';

const rehiveIcons = [
  'close',
  'merchant',
  'supplier',
  'user',
  'customer',
  'cold-storage',
  'locker',
  'default',
  'hot-wallet',
  'investments',
  'lending',
  'operational',
  'rewards',
  'sales',
  'savings',
  'shared',
  'spending',
  'warm-storage',
  'withdraw',
  'transfer',
  'send',
  'sent',
  'deposit',
  'exchange',
  'general',
  'history',
  'mass-send',
  'more',
  'receive-payment',
  'receive',
  'received',
  'scan_to_pay',
  'scan',
  'settings',
  'wallet',
  'wallet-filled',
  'home',
  'home-filled',
  'reward',
  'reward-filled',
  'product',
  'product-filled',
  'profile',
  'profile-filled',
  'rewards-birthday',
  'rewards-recurring',
  'sale',
  'failed',
  'fund',
  'pending',
  'purchase',
  'add',
  'exit',
  'test',
  'burger',
  'back',
  'bank',
  'card',
  'prepaid',
  'apple',
  'ios',
  'android',
  'laptop',
  'desktop',
  'voucher',
  'redeem_voucher',
  'topup',
  'limit',
  'sell_credit',
  'pin',
  'customers',
  'delete',
  'developers',
  'export',
  'invoices',
  'payments',
  'search',
  'membership',
  'request',
  'support',
  'chat',
  'information',
  'help',
  'trophy',
  'stellar',
  'bitcoin',
];

const useStyles = makeStyles(theme => ({
  icon: {
    height: ({ size = 24 }) => size * 2,
    width: ({ size = 24 }) => size * 2,
    maxHeight: ({ size = 24 }) => size * 2,
    maxWidth: ({ size = 24 }) => size * 2,
    borderRadius: ({ size = 24 }) => size,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ({ backgroundColor }) =>
      backgroundColor && backgroundColor !== 'font'
        ? backgroundColor
        : backgroundColor === 'font'
        ? '#BABABA'
        : theme.palette.primary.main,
  },
  outline: {
    border: ({ color, colors }) =>
      `1px solid ${color ? colors[color] : theme.palette.primary.main}`,
    borderRadius: '100%',
  },
}));

export default function Icon(props) {
  let {
    name = '',
    icon = name,

    size = 24,
    color,
    circled = true,
    outlined,
    style,
    onPress,
    fallbackIcon,
  } = props;

  if (icon === 'default') icon = 'operational';
  if (icon === 'locker') icon = 'cold-storage';

  const { colors } = useTheme();
  const classes = useStyles({ ...props, colors });

  const mIMatch = MaterialIcons.find(item => {
    return item.id.toLowerCase() === icon.toLowerCase();
  });

  const customMatch = CustomIcons.find(item => {
    return item.id.toLowerCase() === icon.toLowerCase();
  });

  const rehiveMatch = rehiveIcons.find(
    item => item.toLowerCase() === icon.toLowerCase(),
  );

  const innerStyles = {
    fontSize: size + (icon.match(/voucher/) ? 8 : 0),
    color:
      color && !colors[color]
        ? color
        : color
        ? colors[color]
        : colors.primaryContrast,
  };

  if (onPress) style = { cursor: 'pointer', ...style };

  return (
    <span
      className={circled ? classes.icon : outlined ? classes.outline : ''}
      style={{ lineHeight: 0, flexShrink: 0, ...style }}
      onClick={onPress}>
      {mIMatch ? (
        <mIMatch.icon style={innerStyles} />
      ) : customMatch ? (
        <customMatch.icon
          style={innerStyles}
          width={size}
          height={size}
          primarycontrast={colors.primaryContrast}
        />
      ) : rehiveMatch ? (
        <span className={'icon-' + icon.toLowerCase()} style={innerStyles} />
      ) : fallbackIcon ? (
        <Typography
          className="badge-child"
          style={{
            fontSize: 12,
            color: colors[color + 'Contrast']
              ? colors[color + 'Contrast']
              : colors.primaryContrast,
            fontWeight: 'bold',
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center',
            margin: 8,
          }}>
          {icon ? icon.substr(0, 3).toUpperCase() : ''}
        </Typography>
      ) : (
        <span
          class={`material-icons${outlined ? '-outlined' : ''}`}
          style={innerStyles}>
          {icon}
        </span>
      )}
    </span>
  );
}
