import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import Hover from 'components/layout/Hover';
import ChevronBackIcon from '@material-ui/icons/ChevronLeft';
import ChevronForwardIcon from '@material-ui/icons/ChevronRight';
import { IconBadge } from 'components/outputs/IconBadge';

const IconLabelButton = props => {
  const {
    label,
    children,
    onPress,
    size = 30,
    wrapperStyle,
    show,
    icon = '',
    variant = 'body2',
    color = 'font',
    textProps = {},
    ...restProps
  } = props;
  const classes = useStyles();
  const isUrl = icon.includes('http');

  const onClick = onPress ? onPress : null;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(736));
  const isRtl = theme.direction === 'rtl';

  const text = children ? children : label ? label : '';

  return (
    <Hover
      className={classes.container}
      style={{ ...wrapperStyle, whiteSpace: 'nowrap' }}
      render={hover => (
        <>
          <IconButton
            color={color}
            style={{ padding: 0, top: isUrl ? -7 : -1, left: isUrl ? -5 : -6 }}
            onClick={onClick}>
            {isRtl ? (
              <ChevronForwardIcon style={{ fontSize: size }} />
            ) : (
              <ChevronBackIcon style={{ fontSize: size }} />
            )}
          </IconButton>
          <button
            rel="noopener noreferrer"
            style={{
              borderWidth: 0,
              paddingLeft: 0,
              paddingTop: 0,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              textAlign: 'left',
            }}
            onClick={onClick}
            target="_blank"
            type="button"
            {...restProps}>
            <div
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'center',
                // position: 'relative',
                // top: icon ? -4 : 0,
              }}>
              {Boolean(icon) && (
                <IconBadge
                  style={{ [isRtl ? 'paddingRight' : 'paddingLeft']: 0 }}
                  icon={icon}
                  size={12}
                />
              )}
              <Text
                width="auto"
                color={
                  matches || show ? (color ? color : 'font') : 'transparent'
                }
                {...textProps}
                style={
                  hover
                    ? { textDecorationLine: 'underline' }
                    : { textDecorationLine: 'none' }
                }
                id={text}
              />
            </div>
          </button>
        </>
      )}
    />
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'auto',
    maxWidth: 300,
  },
}));

export default IconLabelButton;
