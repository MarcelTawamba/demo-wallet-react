import React from 'react';
import { displayFormatDivisibility, standardizeString } from 'util/general';
import CardLayout from 'components/card/CardLayout';
import moment from 'moment';
import { View } from 'components/layout/View';
import Output from 'components/outputs/Output';
import Text from 'components/outputs/Text';
import IconLabelButton from 'components/inputs/IconLabelButton';
import PlaceholderImage from './PlaceholderImage';
import Markdown from 'components/outputs/Markdown';

function RewardCard(props) {
  const { item, showModal, hideModal, noCard, index, detail } = props;
  if (!item) {
    return <IconLabelButton label="Back" onPress={hideModal} />;
  }
  const { campaign = {}, amount, currency, created, status } = item;
  const { name = '', description = '' } = campaign ? campaign : {};
  const amountString =
    currency.symbol + displayFormatDivisibility(amount, currency.divisibility);
  let text = '';
  const color = status.match(/accept|accepted/)
    ? 'positive'
    : status.match(/reject|rejected/)
    ? 'negative'
    : 'font';

  if (detail) {
    return (
      <View fD="column">
        <IconLabelButton label="Back" onPress={hideModal} />
        <View fD="row" w="100%" f={1}>
          <View f={2} w="40%">
            <PlaceholderImage rewardName={name} height={200} width={200} />
          </View>
          <View f={3} w="60%">
            <View fD={'column'} pb={1}>
              <Text variant="h5">{name}</Text>
            </View>
            <View
              fD={'column'}
              pb={1}
              w="100%"
              style={{ borderBottom: '2px solid #F8F8F8' }}>
              <Text
                variant="h6"
                color="primary"
                style={{ fontWeight: 500, paddingTop: 4 }}>
                {amountString}
              </Text>
            </View>
            <View
              fD={'column'}
              pv={1}
              w="100%"
              style={{ borderBottom: '2px solid #F8F8F8' }}>
              {description[0] !== '#' && (
                <View pb={0.75}>
                  <Text bold>Description</Text>
                </View>
              )}
              <Markdown>{description}</Markdown>
            </View>
            <View pv={0.5} fD={'column'} jC={'space-between'}>
              <View pv={0.5} pb={1}>
                <Output
                  label="Date claimed"
                  value={moment(created).format('lll')}
                />
              </View>
              <View>
                <Text myColor={color}>{standardizeString(status)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const contentObj = {
    text: text ? text : ' ',
    onClick: () => showModal(index),
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

export default RewardCard;
