import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { hexToRgb, standardizeString } from 'util/general';
import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  text: {
    // backgroundColor: ({ color }) =>
    //   hexToRgb(theme.palette[color]?.main ?? theme.palette.font.primary),
    borderRadius: 20,
    // fontColor: ({ color }) => theme.palette[color]?.light,
    padding: theme.spacing(0.4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    maxWidth: 120,
    minWidth: 70,
  },
}));

const valueColors = {
  // defaults to font
  paid: 'success',
  refunded: 'info',
  'Partially refunded': 'info',
  'Overpaid & partially refunded': 'info',
  // Overpaid: 'success',
  complete: 'success',
  accepted: 'success',
  received: 'success',
  underpaid: 'error',
  rejected: 'error',
  failed: 'error',
  overpaid: 'info',
  // Draft: 'font',
  // Processing: 'font', //'primary',
  available: 'success',
  redeemed: 'info',

  pending: 'info',
  placed: 'success',
  pending_settled: 'info',

  enabled: 'success',
  verified: 'success',
  declined: 'error',
};

const colorAndBackground = {
  success: { text: '#5F8F83', background: '#F0F5F4' },
  info: { text: '#5F7F9F', background: '#F0F4F8' },
  error: { text: '#8F5F5F', background: '#F8F0F0' },
};

export default function Status(props) {
  const {
    children,
    noWrap = true,
    style = {},
    className,
    uppercase,
  } = props;

  let value = typeof children === 'string' ? standardizeString(children) : children;
  let color = valueColors[value.toLowerCase()] ?? 'info';
  if (value === 'Initiated') {
    value = 'Sent';
  }
  if (uppercase) value = value.toUpperCase();
  const classes = useStyles();

  return (
    <Text
      className={`${classes.text} ${className || ''}`}
      width="auto"
      noWrap={noWrap}
      variant="body2"
      // myColor={color}
      bold={value !== 'Draft'}
      align="center"
      style={{
        color: colorAndBackground[color]?.text,
        backgroundColor: colorAndBackground[color].background,
        ...style
      }}>
      {value}
    </Text>
  );
}
