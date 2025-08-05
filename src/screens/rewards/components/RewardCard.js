import React from 'react';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import {
  displayFormatDivisibility,
  getCurrencyCode,
  standardizeString,
} from 'util/general';
import CardLayout from 'components/card/CardLayout';
import moment from 'moment';
import { View } from 'components/layout/View';
import Output from 'components/outputs/Output';
import Text from 'components/outputs/Text';

import PlaceholderImage from './PlaceholderImage';
import Markdown from 'components/outputs/Markdown';
import RewardPlaceholderImage from './images';

function RewardCard(props) {
  const { item, showModal, hideModal, noCard, index, image, detail } = props;
  const theme = useMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down(600));

  if (!item) {
    return null;
  }
  const { campaign = {}, amount, currency, created, status } = item;
  const { name = '', description = '' } = campaign ? campaign : {};
  const amountString = displayFormatDivisibility(amount, currency.divisibility);
  const currencyCode = getCurrencyCode(currency);
  let text = '';
  const color = status.match(/accept|accepted/)
    ? 'positive'
    : status.match(/reject|rejected/)
    ? 'negative'
    : 'font';
  const isRtl = document.dir === 'rtl';

  const amountContent = (
    <View w="100%" fD="row" aI="baseline">
      <Text
        variant="h6"
        color="primary"
        style={{ fontWeight: 500, paddingTop: 4, width: 'auto' }}>
        {amountString}
      </Text>
      <Text
        color="primary"
        style={{
          fontWeight: 500,
          paddingTop: 4,
          fontSize: 14,
          [isRtl ? 'marginRight' : 'marginLeft']: 6,
        }}>
        {currencyCode}
      </Text>
    </View>
  );

  if (detail) {
    return (
      <View fD="column">
        <View fD={matches ? 'column' : 'row'} w="100%" f={1}>
          <View
            f={2}
            style={{ [isRtl ? 'paddingLeft' : 'paddingRight']: '5%' }}
            pb={0.75}>
            <RewardPlaceholderImage
              src={image}
              detailsPage
              rewardName={name}
              size={150}
              style={{
                padding: '40px 50px',
                backgroundColor: '#F8F8F8',
                borderRadius: 10,
              }}
            />
          </View>
          <View f={3} w={matches ? '100%' : '60%'} p={matches ? 0.5 : 0}>
            <View fD={'column'} pb={1}>
              <Text variant="h6">{name}</Text>
            </View>
            {amountContent}
            <View fD={'column'} pv={1} w="100%">
              {/* {description[0] !== '#' && (
                <View pb={0.75}>
                  <Text bold>Description</Text>
                </View>
              )} */}
              <Markdown style={{ color: '#777777' }}>{description}</Markdown>
            </View>
            <View pv={0.5} fD={'column'} jC={'space-between'}>
              <View pv={0.5} pb={1}>
                <Output
                  id="date_claimed"
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
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <View w={'100%'} fD="column" jC="flex-start" aI="flex-start">
          <View
            jC="center"
            aI="center"
            bC="#F8F8F8"
            bR={10}
            ph={4}
            pv={2}
            w="100%">
            <RewardPlaceholderImage
              src={image}
              rewardName={name}
              height={100}
              width={100}
              // style={{ padding: '32px 64px' }}
            />
          </View>
          <View style={{ zIndex: 10 }} f={1} w={'60%'}>
            <Text style={{ paddingTop: 12 }} c="#797979">
              {name}
            </Text>
            {amountContent}
          </View>
          {/* <RewardPlaceholderImage rewardName={name} height={100} width={100} /> */}
        </View>
      </div>
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
