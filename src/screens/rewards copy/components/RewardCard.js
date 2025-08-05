import React from 'react';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { displayFormatDivisibility } from 'util/general';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import PlaceholderImage from 'screens/rewards/components/PlaceholderImage';
import CardLayout from 'components/card/CardLayout';

export default function RewardCard(props) {
  const { item, noCard, index, helpers } = props;
  const { clearId, setId } = helpers;
  if (!item) {
    return <IconLabelButton label="Back" onPress={clearId} />;
  }
  const { campaign = {}, amount, currency } = item;
  const { name = '' } = campaign ? campaign : {};
  const amountString =
    currency.symbol + displayFormatDivisibility(amount, currency.divisibility);
  let text = '';

  const contentObj = {
    text: text ? text : ' ',
    onClick: () => setId(index),
    content: (
      <View
        h={140}
        w={'100%'}
        fD="row"
        jC="space-between"
        aI="center"
        bC={'#F8F8F8'}>
        <View style={{ zIndex: 10 }} p={1} w="80%">
          <Text bold>{name}</Text>
          <View h={16} />
          <Text variant="h4" color="primary" bold>
            {amountString}
          </Text>
        </View>
        <PlaceholderImage rewardName={name} height={100} width={100} />
      </View>
    ),
  };

  const cardObj = {
    // titleObj,
    contentObj,
  };

  return (
    <CardLayout
      noCard={noCard}
      noContent
      noBorder
      className="card"
      key={index}
      {...cardObj}
    />
  );
}
