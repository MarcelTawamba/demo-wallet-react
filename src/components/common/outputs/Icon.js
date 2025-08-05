import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import CurrencyPlaceholderImage, {
  images,
} from 'components/outputs/CurrencyPlaceholderImage';
import { useTheme } from 'components/app/context';

const useStyles = makeStyles(theme => ({
  icon: {
    boxSizing: 'border-box',
    margin: 0,
    height: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    width: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    maxHeight: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    maxWidth: ({ size = 24, inverted }) => size * (inverted ? 1 : 2),
    borderRadius: ({ size = 24 }) => size,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: ({ simple }) =>
    //   simple ? 'transparent' : theme.palette.primary.main,
    backgroundColor: ({ color, inverted }) =>
      inverted
        ? 'transparent'
        : color === 'font'
        ? '#BABABA'
        : theme.palette[color ? color : 'primary']['main'],
  },
}));

const Icon = props => {
  let {
    icon = '',
    size = 24,
    color,
    inverted,
    transparent,
    ...otherProps
  } = props;
  if (icon === 'default') icon = 'operational';
  if (icon === 'locker') icon = 'cold-storage';

  const { colors } = useTheme();
  const classes = useStyles(props);

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
          color:
            colors && (color === 'font' || color === 'positive')
              ? colors[color]
              : inverted && !transparent
              ? colors.primary
              : colors.primaryContrast,
        }}
      />
    </div>
  );
};

export default Icon;
