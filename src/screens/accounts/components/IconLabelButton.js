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
    id,
    label,
    children,
    onPress,
    size = 20,
    wrapperStyle,
    show,
    color = 'font',
    icon = '',
    variant = 'body2',
    ...restProps
  } = props;
  const classes = useStyles();
  const isUrl = icon.includes('http');

  const onClick = onPress ? onPress : null;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(736));

  const text = children ? children : label ? label : '';
  const isRtl = document.dir === 'rtl';

  return (
    <Hover
      className={classes.container}
      style={wrapperStyle}
      render={hover => (
        <>
          <IconButton style={{ padding: 0 }} onClick={onClick}>
            {isRtl ? (
              <ChevronForwardIcon color={color} style={{ fontSize: size }} />
            ) : (
              <ChevronBackIcon color={color} style={{ fontSize: size }} />
            )}
          </IconButton>
          <button
            rel="noopener noreferrer"
            style={{
              borderWidth: 0,
              paddingLeft: 0,
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
                position: 'relative',
                // top: icon ? 2 : 0,
              }}>
              {Boolean(icon) && (
                <IconBadge style={{ paddingLeft: 0 }} icon={icon} size={12} />
              )}
              <Text
                id={id}
                width="auto"
                variant={variant}
                color={
                  matches || show ? (color ? color : 'font') : 'transparent'
                }
                style={
                  hover
                    ? { textDecorationLine: 'underline' }
                    : {
                        textDecorationLine: 'none',
                      }
                }>
                {text}
              </Text>
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
