import React from 'react';
// import { View, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

// import { MaterialIcons as Icon } from '@expo/vector-icons';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';

const CardActions = props => {
  const { primary, secondary } = props;

  if (!primary.label && !secondary.label) {
    return null;
  }

  const config = { variant: 'text', color: 'primary', layout: '' };
  const { variant, color, layout } = config;

  const buttonProps = {
    variant: variant ? variant : 'contained',
    color: color ? color : 'primary',
  };

  switch (layout) {
    case 'vertical':
      return (
        <View fD={'column'} jC={'flex-end'} aI={'center'}>
          <Button wide {...buttonProps} {...secondary} />
          <Button wide {...buttonProps} {...primary} />
          {/* {cancel} */}
          {/* {IconFooter} */}
        </View>
      );
    default:
      return (
        <View fD={'row'} jC={'flex-end'} aI={'flex-end'} w={'100%'} p={0.5}>
          <Button {...buttonProps} {...secondary} />
          <Button {...buttonProps} {...primary} />
          {/* {IconFooter} */}
        </View>
      );
  }

  // const ButtonOne = actionOne.label ? (
  //   <Button
  //     type={
  //       variant
  //         ? variant
  //         : design.cards.actionButtonType === 'button' || type === 'vertical'
  //         ? 'contained'
  //         : 'text'
  //     }
  //     color={
  //       variant === 'contained' ||
  //       design.cards.actionButtonType === 'button' ||
  //       type === 'vertical'
  //         ? 'primary'
  //         : 'font'
  //     }
  //     label={actionOne.label}
  //     size={type === 'vertical' ? 'small' : ''}
  //     disabled={actionOne.disabled || loading}
  //     loading={actionOne.loading || loading}
  //     onPress={actionOne.onPress}
  //   />
  // ) : null;

  // const ButtonTwo = actionTwo.label ? (
  //   <Button
  //     type={
  //       variant
  //         ? variant
  //         : design.cards.actionButtonType === 'button' || type === 'vertical'
  //         ? 'contained'
  //         : 'text'
  //     }
  //     color={
  //       variant === 'contained' ||
  //       design.cards.actionButtonType === 'button' ||
  //       type === 'vertical'
  //         ? 'secondary'
  //         : 'font'
  //     }
  //     label={actionTwo.label}
  //     size={type === 'vertical' ? 'small' : ''}
  //     disabled={actionTwo.disabled}
  //     onPress={actionTwo.onPress}
  //   />
  // ) : null;

  // const IconFooter =
  //   actionFooter && actionFooter.icon ? (
  //     <Icon
  //       style={iconStyleFooter}
  //       name={actionFooter.icon}
  //       size={28}
  //       onPress={() => actionFooter.onPress()}
  //       color={colors.grey3}
  //     />
  //   ) : (
  //     <View />
  //   );

  // if (type === 'vertical') {
  //   return (
  //     <View fD={'column'} jC={'flex-end'} aI={'center'}>
  //       {ButtonTwo}
  //       {ButtonOne}
  //       {IconFooter}
  //     </View>
  //   );
  // } else if (type === 'center') {
  //   return (
  //     <View fD={'row'} jC={'center'} aI={'center'}>
  //       {ButtonTwo}
  //       {ButtonOne}
  //       {IconFooter}
  //     </View>
  //   );
  // }

  // return (
  //   <View h={52} w={'100%'} fD={'row'} aI={'flex-end'}>
  //     <View w={'100%'}>
  //       <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
  //         {IconFooter}
  //         <View fD={'row'} jC={'flex-end'}>
  //           {ButtonTwo}
  //           {ButtonOne}
  //         </View>
  //       </View>
  //     </View>
  //   </View>
  // );
};

// _CardActions.defaultProps = {
//   actionOne: { label: '', onPress: () => {}, loading: false, disabled: false },
//   actionTwo: { label: '', onPress: () => {}, loading: false, disabled: false },
//   actionFooter: { icon: '', onPress: () => {} },
//   // loading,
//   // colors,
//   // design,
//   // borderRadius,
//   // halfHeight,
// };

// _CardActions.propTypes = {
//   // actionOne: PropTypes.object,
//   // actionTwo: PropTypes.object,
// };

export default CardActions;
