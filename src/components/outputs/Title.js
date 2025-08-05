import React from 'react';
import PropTypes from 'prop-types';
// import { Text  from 'components/outputs/Text';
import Typography from 'components/outputs/Text';
import { View } from 'components/layout/View';
// import CurrencyBadge from 'screens/wallets/components/CurrencyBadge';
// import { View } from 'components/layout/View';

const Title = props => {
  let {
    title,
    subtitle,
    badgeRight,
    badge,
    titleScale = 'h6',
    subtitleScale = 'subtitle2',
  } = props;

  // if (titleObj.title || titleObj.subtitle) {
  //   ({ title, subtitle, onPress } = titleObj);
  // }

  // if (titleObj.titleScale) {
  //   ({ titleScale } = titleObj);
  // }

  if (!title && !subtitle) {
    return null;
  }
  return (
    <View w={'100%'}>
      <View flex fD={'row'} jC={'space-between'} w={'100%'}>
        {/* {!badgeRight && <Badge text={badge} radius={32} />} */}
        <View flex fD={'column'}>
          {title && (
            <Typography variant={titleScale ? titleScale : 'h5'}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              opacity={0.7}
              variant={subtitleScale ? subtitleScale : 'subtitle2'}>
              {subtitle}
            </Typography>
          )}
        </View>
        {/* {badgeRight && <CurrencyBadge text={badge} radius={32} />} */}
      </View>
    </View>
  );
};

Title.propTypes = {
  titleObj: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
  textStyleTitle: PropTypes.object,
  textStyleSubtitle: PropTypes.object,
  viewStyleContainer: PropTypes.object,
};

Title.defaultProps = {
  titleObj: { title: '', subtitle: '', onPress: () => {} },
  title: '',
  subtitle: '',
  onPress: () => {},
  textStyleTitle: null,
  textStyleSubtitle: null,
  containerStyle: null,
};

export default Title;
