import React from 'react';
import PropTypes from 'prop-types';

import { CardActionArea } from '@material-ui/core';
import Title from 'components/outputs/Title';
import Text from 'components/outputs/Text';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import OutputList from 'components/lists/OutputList';
import ButtonList from 'components/lists/ButtonList';
import context from 'components/app/context';

const _CardLayout = props => {
  const {
    titleObj,
    cardText,
    actionOne,
    actionTwo,
    actionFooter,
    items,
    values,
    children,
    canEdit,
    type,
    design,
    item,
    index,
    onPressCard,
    detailObj,
  } = props;

  const cardDesign = design[type === 'accounts' ? 'wallets' : type]
    ? design[type === 'accounts' ? 'wallets' : type]
    : design.cards;

  const { badge, title, subtitle } = titleObj;

  let TitleComponent = (
    <Title
      {...design.title}
      {...titleObj}
      badgeRight
      badge={badge}
      title={title}
      subtitle={subtitle}
    />
  );

  let TextComponent = <Text align={'left'}>{cardText.description}</Text>;

  return (
    <Card>
      <CardActionArea onClick={() => onPressCard(index)}>
        <View p={1}>
          <View p={0.5} w={'100%'}>
            {TitleComponent}
            {TextComponent}
          </View>
          <View w={'100%'}>
            <OutputList items={values} m={0.5} />
          </View>
        </View>
      </CardActionArea>
      {items[0].label && (
        <ButtonList
          variant={cardDesign.actionButtonsType}
          items={items}
          type={'text'}
          color={'primary'}
        />
      )}
    </Card>
  );

  // console.log('design.layout', design.layout);
  switch (cardDesign.layout) {
    // case 'mini':
    // case 'rightAction':
    //   return (
    //     <View p={1} fD="row">
    //       <View w={'100%'}>
    //         {Title}
    //         <View w={'100%'}>
    //           {canEdit ? (
    //             <View
    //               style={{
    //                 position: 'absolute',
    //                 right: 8,
    //                 top: 8,
    //                 padding: 8,
    //                 zIndex: 10,
    //               }}>
    //               {/* <Icon
    //                 name={'edit'}
    //                 size={22}
    //                 color={colorIcon ? colorIcon : colors.grey2}
    //               /> */}
    //             </View>
    //           ) : null}
    //           {children}
    //         </View>
    //       </View>
    //       <ButtonList
    //         type={'vertical'}
    //         variant={design.actionButtonsType}
    //         {...actions}
    //       />
    //     </View>
    //   );

    case 'material':
      return (
        <View p={0.5}>
          <View p={0.5} w={'100%'}>
            {TitleComponent}
            {TextComponent}
          </View>
          <View
            // fD={'row'}
            w={'100%'}
            // f={1}
            // jC={'space-between'}
            // aI={'flex-start'}
          >
            {/* <View f={1}>{children}</View> */}
            <OutputList items={values(item)} m={0.5} />
            <ButtonList
              variant={cardDesign.actionButtonsType}
              actions={actions(item)}
              type={'text'}
              color={'primary'}
            />
          </View>
        </View>
      );
    // case 'centerAction':
    //   return (
    //     <View>
    //       <View p={1}>
    //         {Title}
    //         {children}
    //       </View>

    //       <View p={0.5}>
    //         <ButtonList
    //           type={'center'}
    //           variant={design.actionButtonsType}
    //           actions={actions}
    //         />
    //       </View>
    //     </View>
    //   );

    // case 'title':
    //   return (
    //     <View>
    //       {Title}

    //       <ButtonList
    //         variant={design.actionButtonsType}
    //         actionOne={actionOne}
    //         actionTwo={actionTwo}
    //         actionFooter={actionFooter}
    //       />
    //     </View>
    //   );

    default:
      return (
        <View w={'100%'} fD={'column'} p={0.5}>
          <View p={0.5} w={'100%'}>
            {TitleComponent}
            {TextComponent}
          </View>
          <View
            fD={'row'}
            w={'100%'}
            f={1}
            jC={'space-between'}
            aI={'flex-start'}>
            <OutputList items={values(item)} m={0.5} />
            {/* <View f={1}>{children}</View> */}
            <ButtonList
              variant={cardDesign.actionButtonsType}
              layout={'vertical'}
              actions={actions(item)}
            />
          </View>
        </View>
      );
  }
};

// CardLayout.propTypes = {
//   titleObj: PropTypes.object,
//   actionOne: PropTypes.object,
//   actionTwo: PropTypes.object,
// };

// CardLayout.defaultProps = {
//   titleObj: { title: '', subtitle: '', onPress: () => {}, icon: '', badge: '' },
//   actionOne: { label: '', onPress: () => {}, loading: false, disabled: false },
//   actionTwo: { label: '', onPress: () => {}, loading: false, disabled: false },
// };

const CardLayout = context(_CardLayout);

export default CardLayout;
