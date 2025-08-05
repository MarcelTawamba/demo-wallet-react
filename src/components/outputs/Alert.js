import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';

export default function Alert(props) {
  const { variant, description, children, onPress } = props;

  const colorMap = () => {
    switch (variant) {
      case 'success':
        return {
          background: '#DEF5EC',
          fill: '#24A070',
          icon: 'check-circle',
          title: 'Success',
        };
      case 'warning':
        return {
          background: '#fff0e3',
          fill: '#fe7000',
          icon: 'warning',
          title: 'Warning',
        };
      case 'error':
        return {
          background: '#f9e3e6',
          fill: '#CC2538',
          icon: 'error',
          title: 'Error',
        };
      case 'info':
      default:
        return {
          background: '#e1f6ff',
          fill: '#0078b1',
          icon: 'info',
          title: 'Info',
        };
    }
  };

  const config = colorMap();
  const classes = useStyles();

  const content = (
    <View
      bR={10}
      bC={config.background}
      p={1}
      f={1}
      fD={'row'}
      aI={'flex-start'}
      w={'100%'}
      style={{
        border: `1px solid ${config.fill}`,
      }}>
      <Icon
        icon={config.icon}
        set={'MaterialIcons'}
        color={config.fill}
        size={25}
        circled={false}
      />
      <View ml={0.5} pr={1.5}>
        <Text lH={25}>
          <Text
            inline
            style={{ fontSize: 17 }}
            fontWeight={'700'}
            myColor={config.fill}>
            {`${config.title}: `}
          </Text>
          {children ?? (
            <Text inline style={{ fontSize: 17 }} myColor={config.fill}>
              {description}
            </Text>
          )}
        </Text>
      </View>
    </View>
  );

  return onPress ? (
    <ButtonBase onClick={onPress} className={classes.root} disableTouchRipple>
      {content}
    </ButtonBase>
  ) : (
    content
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    textAlign: 'left',
    borderRadius: 10,
  },
}));
