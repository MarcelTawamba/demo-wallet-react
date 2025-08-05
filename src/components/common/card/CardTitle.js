import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import CurrencyBadge from './node_modules/screens/accounts/components/currency/CurrencyBadge';
import { IconBadge } from 'components/outputs/IconBadge';
import IconButton from 'components/inputs/IconButton';
import Icon from 'components/outputs/Icon';
import CloseIcon from '@material-ui/icons/Close';

const CardTitle = props => {
  let {
    title,
    icon,
    iconSize = 24,
    subtitle,
    badgeRight,
    badge,
    right,
    close,
    onDismiss,
    titleScale = 'h6',
    color,
    subtitleScale = 'subtitle2',
  } = props;

  if (!title && !subtitle) {
    return null;
  }
  return (
    <View
      flex
      fD={'row'}
      jC={
        right
          ? 'flex-end'
          : badgeRight || close
          ? 'space-between'
          : 'flex-start'
      }
      aI={'center'}
      w={'100%'}>
      {!badgeRight && badge ? (
        <CurrencyBadge text={badge} radius={24} />
      ) : icon ? (
        <IconBadge icon={icon} size={24} />
      ) : null}
      <View fD={'column'} w={'100%'} pl={0.5}>
        {title && (
          <Text
            color={color ? color : 'font'}
            align={'left'}
            variant={titleScale ? titleScale : 'h6'}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            align={'left'}
            color={'initial'}
            variant={subtitleScale ? subtitleScale : 'subtitle2'}>
            {subtitle}
          </Text>
        )}
      </View>
      {badgeRight && badge && <CurrencyBadge text={badge} radius={32} />}
      {close && (
        <IconButton onPress={() => onDismiss()}>
          <CloseIcon />
        </IconButton>
      )}
    </View>
  );
};

CardTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  badge: PropTypes.string,
  icon: PropTypes.string,
  config: PropTypes.object,
};

CardTitle.defaultProps = {
  title: '',
  subtitle: '',
  badge: '',
  icon: '',
  config: {
    titleScale: 'h6',
    subtitleScale: 's1',
    color: 'primary',
    right: false,
  },
};

export default CardTitle;
