import React from 'react';
import moment from 'moment';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { displayFormatDivisibility, standardizeString } from 'util/general';
import { View } from 'components/layout/View';
import PlaceholderImage from 'screens/rewards/components/PlaceholderImage';
import Text from 'components/outputs/Text';
import Output from 'components/outputs/Output';

export default function RewardDetail(props) {
  const { item, hideModal } = props;
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
            <Text>{description}</Text>
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
