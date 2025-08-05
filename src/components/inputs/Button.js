import React from 'react';

import context from '../common/context';
import ButtonBase from '@material-ui/core/Button';
import { View } from 'components/layout/View';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import Hover from 'components/layout/Hover';
import Icon from 'components/outputs/Icon';
import { standardizeString } from 'util/general';
import en from '../../config/locales/en';
import { Tooltip } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const _Button = props => {
  let {
    label,
    children,
    type = 'button',
    loading,
    variant = 'contained',
    wide,
    onPress,
    tooltip,
    tooltipId,
    noPadding,
    newTab,
    wrapperStyle,
    wrap,
    customIcon,
    customIconColor,
    icon,
    align,
    link,
    id,
    history,
    thin,
    refPrint,
    fontSize = '1rem',
    style,
    textStyle = {},
    capitalize = variant !== 'text' && variant !== 'link',
    noHover,
    textProps = {},
    languageContext = {},
    ...restProps
  } = props;

  const classes = useStyles(props);
  const { t } = useTranslation(['common']);

  if (!children && !label && !id) {
    return <View h={52} />;
  }

  const onClick =
    link && history ? () => history.push(link) : onPress ? onPress : null;

  let wrapperProps = {
    style: { width: wide ? '100%' : 'auto', ...wrapperStyle },
  };
  const buttonClasses = {
    label: wrap
      ? classes.labelWrap
      : loading
      ? variant && variant.match(/text|outlined/)
        ? classes.labelLoadingText
        : classes.labelLoading
      : classes.label,
  };

  if (noPadding) {
    wrapperProps.style.padding = 0;
    wrapperProps.style.cornerRadius = 5;
  }
  let otherProps = {};
  if (newTab) {
    otherProps = { rel: 'noopener noreferrer', target: '_blank' };
  }

  const labelId = id || label;
  const i18nString = labelId
    ? t(labelId, { defaultValue: null, ...languageContext })
    : '';
  let text = children
    ? children
    : i18nString
    ? i18nString
    : standardizeString(labelId) ?? '';

  if (capitalize && typeof text === 'string') text = text.toUpperCase();

  if (tooltipId) {
    tooltip =
      t(tooltipId, { defaultValue: tooltip }) || standardizeString(tooltipId);
  }

  if (loading) {
    restProps.disabled = true;
  }

  let Button = null;
  if (variant === 'link') {
    Button = (
      <a
        rel="noopener noreferrer"
        target="_blank"
        className={classes.buttonLink}
        style={{
          padding: 0,
          borderWidth: 0,
          cursor: 'pointer',
          backgroundColor: 'transparent',
          textAlign: 'left',
          ...style,
        }}
        onClick={onClick}
        {...otherProps}
        {...restProps}>
        <Hover
          render={hover => (
            <div className={classes.row}>
              <Text
                myColor={props.color ? props.color : 'font'}
                style={{
                  textDecorationLine: !noHover && hover ? 'underline' : 'none',
                  fontSize,
                  ...textProps,
                  ...textStyle,
                }}>
                {text}
              </Text>
              {Boolean(customIcon) && align === 'right' && (
                <Icon
                  icon={customIcon}
                  size={16}
                  inverted
                  className={classes.btnIcon1}
                  iconColor={customIconColor}
                />
              )}
            </div>
          )}
        />
      </a>
    );
  } else if (customIcon) {
    Button = (
      <ButtonBase
        fullWidth={wide}
        onClick={onClick}
        style={style}
        {...restProps}>
        <View w="100%" fD="row" aI="center" jC="flex-start">
          {align !== 'right' && <Icon icon={customIcon} size={24} />}
          <View pl={1} w="100%">
            <Text variant="h5" align="left" className={classes.label} id={id}>
              {label}
            </Text>
          </View>
          {align === 'right' && <Icon icon={customIcon} size={24} />}
        </View>
      </ButtonBase>
    );
  } else {
    Button = (
      <div className={classes.wrapper} {...wrapperProps}>
        <ButtonBase
          variant={variant}
          fullWidth={wide}
          type={type}
          onClick={onClick}
          rel="noopener noreferrer"
          className={classes.button}
          classes={buttonClasses}
          style={style}
          {...otherProps}
          {...restProps}>
          {icon && align !== 'right' && (
            <div>
              <Icon
                icon={icon}
                size={12}
                inverted
                color={props.color}
                transparent
              />
            </div>
          )}
          {text}
          {icon && align === 'right' && (
            <div style={{ padding: 8, paddingTop: 0 }}>
              <Icon
                icon={icon}
                size={12}
                inverted
                color={props.color}
                transparent
              />
            </div>
          )}
        </ButtonBase>

        {loading && (
          <CircularProgress
            size={props?.size === 'small' ? 16 : 24}
            className={classes.buttonProgress}
          />
        )}
      </div>
    );
  }

  if (tooltip) {
    return <Tooltip title={tooltip}>{Button}</Tooltip>;
  }
  return Button;
};

const useStyles = makeStyles(theme => ({
  label: {
    textTransform: 'initial',
    whiteSpace: 'nowrap',
    color: ({ icon }) => (icon ? theme.palette.primary.contrastText : ''),
  },
  labelLoading: {
    whiteSpace: 'nowrap',
    color: 'transparent',
  },
  labelLoadingText: {
    color: 'transparent',
    whiteSpace: 'nowrap',
  },
  buttonLink: {
    whiteSpace: 'nowrap',
    '&:focus': {
      outline: 'none',
    },
  },
  labelWrap: {},
  buttonProgress: {
    position: 'absolute',
    inset: 0,
    margin: 'auto',
  },
  wrapper: {
    padding: theme.spacing(1),
    position: 'relative',
  },
  button: props => ({
    borderRadius: 100,
    minWidth: 0,
    paddingLeft: props?.zeroPadding ? 8 : props?.noPadding ? 12 : 16,
    paddingRight: props?.zeroPadding
      ? 8
      : props?.icon || props?.noPadding
      ? 12
      : 16,
    padding: props.thin ? '.2rem 1rem' : '6px 16px',
    width: props.width ?? 'inherit',
    fontSize: props.fontSize ?? 'inherit',
  }),
  row: { display: 'flex', flexDirection: 'row' },
  noPadding: { padding: 0, borderRadius: 0 },
  btnIcon1: { marginLeft: 4, marginTop: 3 },
}));

const Button = context(_Button);

export { Button };
