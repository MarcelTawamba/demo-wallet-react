import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import MuiIconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/Icon';
import useI18Language from 'hooks/useI18Language';

export default function IconButton(props) {
  let {
    children,
    loading,
    onPress,
    onClick,
    tooltip,
    color = 'primary',
    inverted,
    href,
    icon,
    disabled,
    size = 16,
    noPadding,
    simple,
    ...restProps
  } = props;
  if (color === 'font') color = 'default';
  const classes = useStyles(props);
  const { getI18Translation } = useI18Language();

  let onPressProps = { onClick: onPress ?? onClick };
  if (href) {
    onPressProps = {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  if (icon && !children) {
    children = (
      <Icon
        color={disabled ? '#DDD' : color}
        backgroundColor="transparent"
        icon={icon}
        size={size}
        inverted={inverted}
        {...restProps}
      />
    );
  }

  const component = loading ? (
    <View w={size} h={size} pr={2}>
      <CircularProgress size={size} className={classes.buttonProgress} />
    </View>
  ) : (
    children
  );
  if (simple) {
    return (
      <div
        style={{ cursor: 'pointer', position: 'relative' }}
        {...onPressProps}>
        {component}
      </div>
    );
  }

  const Button = (
    <MuiIconButton
      className={classes.button}
      color={color}
      style={{ backgroundColor: 'transparent' }}
      {...onPressProps}
      {...restProps}>
      {component}
    </MuiIconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={getI18Translation(tooltip)}>
        <div>{Button}</div>
      </Tooltip>
    );
  }
  return Button;
}

const useStyles = makeStyles(theme => ({
  label: {
    textTransform: 'none',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  button: {
    margin: 0,

    padding: ({ noPadding }) => theme.spacing(noPadding ? 0 : 1),
    minWidth: ({ size }) => size * 2,
    minHeight: ({ size }) => size * 2,
  },
}));
