import React, { Component, useState } from 'react';
import { displayFormatDivisibility } from 'util/general';
import CardLayout from 'components/card/CardLayout';
import moment from 'moment';
import Output from 'components/outputs/Output';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import PlaceholderImage from './PlaceholderImage';
import Text from 'components/outputs/Text';
import IconLabelButton from 'components/inputs/IconLabelButton';
import Title from 'components/outputs/Title';
import { claimReward } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';

function CampaignCard(props) {
  const {
    item,
    index,
    hideModal,
    pendingRewards = [],
    showModal,
    noCard,
    detail,
    returnContent,
    onRefresh,
  } = props;
  const [loading, setLoading] = useState(false);

  const {
    start_date,
    end_date,
    currency,
    fixed_amount,
    description,
    name,
    claim,
    percentage,
    type,
    default_status,
    active,
  } = item;

  const pending = pendingRewards.includes(item.id);
  const { showToast } = useToast();

  const titleObj = {
    title: name,
    subtitle:
      (moment(end_date).isBefore(new Date()) ? 'Expired ' : 'Expires ') +
      moment(end_date).fromNow(),
  };

  const actionOne = {
    label: claim ? (default_status === 'accepted' ? 'CLAIM' : 'REQUEST') : '',
    onClick: handleClaimReward,
    loading,
    disabled: pending || !active,
    wide: true,
    color: 'primary',
  };

  async function handleClaimReward() {
    setLoading(true);
    let response;
    try {
      response = await claimReward({
        campaign: item.id,
      });

      let text = '';
      if (response.status === 'success') {
        text =
          item.default_status === 'accepted'
            ? 'Reward successfully claimed'
            : 'Your reward has been requested and it will reflect in your wallet balance upon admin approval';

        onRefresh();
      } else {
        if (
          response.message.includes('transaction') &&
          response.message.includes('amount')
        ) {
          if (response.message.includes(' 0')) {
            text = `You're unable to request this reward, required tier not met.`;
          } else {
            text = `You've reached your request limit for rewards, required tier not met.`;
          }
        } else {
          text =
            'Unable to request reward' +
            (response.message
              ? ': ' +
                (response.message.includes('transactions') &&
                response.message.includes('error')
                  ? 'please verify your account'
                  : response.message)
              : '');
        }
      }
      hideModal();
      showToast({
        text,
      });
    } catch (e) {
      showToast({
        text: 'Unable to request reward' + (e.message ? ': ' + e.message : ''),
        variant: 'error',
      });
      console.log(e);
    }
    setLoading(false);
  }

  const amountString =
    currency.symbol +
    displayFormatDivisibility(fixed_amount, currency.divisibility);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  const hideAction = end_date < Date.now();

  if (detail) {
    return (
      <View fD="column">
        <IconLabelButton label="Back" onPress={hideModal} />
        <View fD="row" w="100%" f={1}>
          <View f={2} w="40%">
            <PlaceholderImage rewardName={name} height={200} width={200} />
          </View>
          <View f={3} w="60%">
            <Title {...titleObj} />
            <View pv={1} w="100%" style={{ borderBottom: '2px solid #F8F8F8' }}>
              <Text variant="h6" color="primary" bold>
                {isPercentage ? percentageString : amountString}
              </Text>
            </View>
            <View
              fD={'column'}
              pv={1}
              w="100%"
              style={{ borderBottom: '2px solid #F8F8F8' }}>
              <Text>{description}</Text>
            </View>
            <View p={0.25} />
            {!hideAction && <Button {...actionOne} />}
          </View>
        </View>
      </View>
    );
  }
  const amountVariant =
    amountString.length > 12 ? 'h6' : amountString.length > 8 ? 'h5' : 'h4';

  // type === 'percentage'
  // ? percentage + '%'
  // :

  const contentObj = {
    onClick: () => showModal(index),
    content: (
      <View
        h={140}
        w={'100%'}
        fD="row"
        jC="space-between"
        aI="center"
        bC={'#F8F8F8'}>
        <View style={{ zIndex: 10 }} p={1} f={1} w={'60%'}>
          {isPercentage ? (
            <>
              <View fD="row" aI="flex-end" pb={0.5}>
                <Text bold>Earn</Text>
                <Text
                  variant="h5"
                  color="primary"
                  bold
                  style={{ paddingLeft: 4 }}>
                  {percentageString}
                </Text>
              </View>

              <Text bold>{name}</Text>
            </>
          ) : (
            <>
              <Text bold>{name}</Text>
              <View h={8} />
              <Text variant={amountVariant} color="primary" bold>
                {amountString}
              </Text>
            </>
          )}
        </View>
        <View ph={1}>
          <PlaceholderImage rewardName={name} height={100} width={100} />
        </View>
      </View>
    ),
  };

  if (returnContent) {
    return contentObj.content;
  }
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

  // const contentObj = {
  //   text,
  //   onClick: () => showModal(index), //handleStateChange('detail', index),
  //   content: (
  //     <View w={'100%'}>
  //       <View
  //         fD={'row'}
  //         w={'100%'}
  //         p={1}
  //         aI={'flex-end'}
  //         jC={'space-between'}>
  //         <Output
  //           label={'Amount'}
  //           valueBold
  //           value={amount + ' ' + currency.code}
  //         />

  //         {!hideAction && (
  //           <Button
  //             color={'primary'}
  //             size={'small'}
  //             wrapperStyle={{
  //               paddingBottom: 0,
  //               paddingLeft: 0,
  //               paddingRight: 0,
  //             }}
  //             {...actionOne}
  //           />
  //         )}
  //       </View>
  //     </View>
  //   ),
  // };

  // const cardObj = {
  //   titleObj,
  //   actionsObj,
  //   contentObj,
  //   // design: design.wallets,
  // };

  // return (
  //   <CardLayout noCard={noCard} className="card" key={index} {...cardObj} />
  // );
}

export default CampaignCard;
