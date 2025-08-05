import React from 'react';
import { useTheme } from 'components/app/context';
import MaterialIcons from './NewIcon/materialIcons';
import makeStyles from '@material-ui/styles/makeStyles';
import CurrencyPlaceholderImage, { images } from './CurrencyPlaceholderImage';
import { validateColor } from 'util/general';

export default function Icon(props) {
  let {
    name = '',
    icon = name,
    size = 24,
    color,
    iconColor,
    inverted,
    transparent,
    noMi,
    ...otherProps
  } = props;
  // console.log('🚀 ~ file: Icon.js ~ line 19 ~ Icon ~ props', props);

  if (icon === 'default') icon = 'operational';
  if (icon === 'locker') icon = 'cold-storage';

  const { colors } = useTheme();
  // console.log('🚀 ~ file: Icon.js ~ line 24 ~ Icon ~ colors', colors);
  const classes = useStyles(props);

  const mIMatch =
    !noMi &&
    MaterialIcons.find(item => {
      return item.id.toLowerCase() === icon.toLowerCase();
    });

  const cssColor =
    colors && color && color !== 'primary'
      ? colors?.[!inverted ? color + 'Contrast' : color] ??
        (!inverted ? '#FFFFFF' : color)
      : inverted && !transparent
      ? colors.primary
      : colors.primaryContrast;
  // console.log('🚀 ~ file: Icon.js ~ line 34 ~ Icon ~ cssColor', cssColor);

  if (mIMatch)
    return (
      <div className={classes.icon} {...otherProps}>
        <mIMatch.icon
          style={{
            fontSize: size,
            color: colors[iconColor] ?? iconColor,
          }}
        />
      </div>
    );

  const cssName = 'icon-' + icon.toLowerCase();

  if (images[icon]) {
    return (
      <CurrencyPlaceholderImage name={icon} radius={size / 2} {...otherProps} />
    );
  }

  return (
    <div className={classes.icon} {...otherProps}>
      <span
        className={cssName}
        style={{
          fontSize: size + (icon.match(/voucher/) ? 8 : 0),
          color: colors[iconColor] ?? iconColor ?? cssColor,
        }}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  icon: {
    boxSizing: 'border-box',
    margin: 0,
    height: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    width: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    maxHeight: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    maxWidth: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    minHeight: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    minWidth: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    borderRadius: ({ size = 24 }) => size,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: ({ simple }) =>
    // //   simple ? 'transparent' : theme.palette.primary.main,
    backgroundColor: ({ color, inverted }) =>
      inverted
        ? 'transparent'
        : color === 'font'
        ? '#BABABA'
        : theme.palette?.[color ? color : 'primary']?.['main'] ??
          validateColor(color) ??
          '',
  },
}));
