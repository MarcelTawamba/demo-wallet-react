import React, { useState, useRef, useLayoutEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import { displayFormatDivisibility, getCurrencyCode } from 'util/general';
import CardLayout from 'components/card/CardLayout';
import moment from 'moment';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import Title from 'components/outputs/Title';
import { claimReward } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import RewardPlaceholderImage from './images';
import Hover from 'components/layout/Hover';
import { TIMES } from 'util/date';
import Markdown from 'components/outputs/Markdown';
import MoreRewards from './MoreRewards';

export default function CampaignCard(props) {
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
    moreRewards = [],
  } = props;
  const [loading, setLoading] = useState(false);

  const {
    start_date,
    end_date,
    currency,
    fixed_amount,
    description,
    image,
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

  const currentDate = new Date().valueOf();

  const expirationTime = end_date - currentDate;
  const showExpiration = expirationTime < TIMES.day;
  const expiresHours =
    showExpiration && Math.floor(expirationTime / TIMES.hour);

  const actionOne = {
    id: claim ? (default_status === 'accepted' ? 'claim' : 'request') : '',
    onClick: handleClaimReward,
    loading,
    disabled: pending || !active,
    wide: true,
    color: 'primary',
    wrapperStyle: { padding: 0 },
    fontSize: 15,
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
      if (hideModal) hideModal();
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

  const amountString = displayFormatDivisibility(
    fixed_amount,
    currency.divisibility,
  );
  const currencyCode = getCurrencyCode(currency);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  const hideAction = end_date < Date.now();

  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { width: height } = dimensions;

  const classes = useStyles({ height });
  const isRtl = document.dir === 'rtl';
  useLayoutEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, []);

  // const theme = useMuiTheme();
  // const matches = useMediaQuery(theme.breakpoints.down(710));

  const amountContent = (
    <View
      w="100%"
      fD="row"
      aI="baseline"
      style={{ paddingTop: detail ? 12 : 0 }}>
      <Text
        variant="h6"
        color="primary"
        style={{ fontWeight: 500, paddingTop: 4, width: 'auto' }}>
        {isPercentage ? percentageString : amountString}
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
        <View f={1} className={classes.detailsContainer}>
          <View className={classes.imageDetailsContainer}>
            <View f={2} className={classes.imageContainer}>
              <RewardPlaceholderImage
                src={image}
                detailsPage
                rewardName={name}
                size={150}
                style={{
                  width: '100%',
                  padding: '40px 50px',
                  backgroundColor: '#F8F8F8',
                  borderRadius: 10,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              />
            </View>
            <View f={3} className={classes.descriptionContainer}>
              <Title {...titleObj} />
              {amountContent}
              {Boolean(description) && (
                <View fD={'column'} pt={0.75} pb={1} pr={1} w="100%">
                  <Markdown style={{ color: '#777777' }}>
                    {description}
                  </Markdown>
                </View>
              )}
              <View p={0.25} />
              {!hideAction && <Button {...actionOne} />}
            </View>
          </View>
          {moreRewards.length > 0 && (
            <View f={3} className={classes.moreRewardsContainer}>
              <MoreRewards rewards={moreRewards} onRefresh={onRefresh} />
            </View>
          )}
        </View>
      </View>
    );
  }

  const contentObj = {
    onClick: () => showModal(index),
    content: (
      <Hover
        render={hover => (
          <div className={classes.container}>
            <View
              w={'100%'}
              fD="column"
              jC="flex-start"
              aI="flex-start"
              ref={ref}>
              <View
                jC="center"
                aI="center"
                bC="#F8F8F8"
                bR={10}
                w="100%"
                style={{ position: 'relative' }}>
                <RewardPlaceholderImage
                  src={image}
                  rewardName={name}
                  height={100}
                  width={100}
                  style={{ padding: '32px 64px' }}
                />
                {(hover || loading) && claim && (
                  <div className={classes.buttonContainer}>
                    <div className={classes.buttonBackground} />
                    <div className={classes.button}>
                      <Button
                        style={
                          loading ? { backgroundColor: 'transparent' } : {}
                        }
                        color="primary"
                        id="claim"
                        capitalize
                        loading={loading}
                        disabled={loading || !claim}
                        onPress={event => {
                          event.stopPropagation();
                          handleClaimReward();
                        }}
                      />
                    </div>
                  </div>
                )}
              </View>
              <View style={{ zIndex: 10 }} f={1} w={'60%'}>
                <Text style={{ paddingTop: 12 }} c="#797979">
                  {name}
                </Text>
                {isPercentage ? (
                  <>
                    <View fD="row" aI="flex-end" pb={0.5}>
                      <Text
                        variant="h6"
                        color="primary"
                        style={{
                          fontWeight: 500,
                          paddingTop: 4,
                          width: 'auto',
                        }}
                        id="earn"
                        context={{ amount: percentageString }}
                      />
                    </View>
                  </>
                ) : (
                  amountContent
                )}
                {expiresHours && (
                  <Text
                    color="error"
                    // align="right"
                    style={{
                      fontSize: 10,
                      fontWeight: '500',
                      position: 'absolute',
                      bottom: 12,
                    }}>
                    {expiresHours + ' hours left!'}
                  </Text>
                )}
              </View>
            </View>
          </div>
        )}
      />
    ),
    // footer: expiresHours && (
    //   <Text
    //     color="error"
    //     align="right"
    //     style={{ fontSize: 10, fontWeight: '500' }}>
    //     {expiresHours + ' hours left!'}
    //   </Text>
    // ),
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
}

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
    width: '100%',
    // height: 140,
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    opacity: 1,
    height: '100%',
  },
  buttonBackground: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100%',
    height: 140,
  },
  button: {
    position: 'absolute',
    zIndex: 1000,
    display: 'flex',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    width: '100%',
    flexDirection: 'row !important',
    [theme.breakpoints.down(1200)]: {
      flexDirection: 'column !important',
    },
  },
  imageDetailsContainer: {
    width: '75%',
    flexDirection: 'row !important',
    [theme.breakpoints.down(1200)]: {
      width: '100%',
    },
    [theme.breakpoints.down(680)]: {
      flexDirection: 'column !important',
    },
  },
  imageContainer: {
    width: '35%',
    paddingRight: '32px !important',
    [theme.breakpoints.down(1400)]: {
      width: '40%',
    },
    [theme.breakpoints.down(1200)]: {
      width: '45%',
    },
    [theme.breakpoints.down(700)]: {
      width: '60%',
    },
    [theme.breakpoints.down(500)]: {
      width: '70%',
    },
    [theme.breakpoints.down(400)]: {
      width: '90%',
    },
  },
  descriptionContainer: {
    width: '65%',
    [theme.breakpoints.down(1400)]: {
      width: '60%',
    },
    [theme.breakpoints.down(1200)]: {
      width: '55%',
    },
    [theme.breakpoints.down(680)]: {
      marginTop: '20px !important',
    },
  },
  moreRewardsContainer: {
    width: '25%',
    paddingLeft: 16,
    alignItems: 'flex-end !important',
    [theme.breakpoints.down(1200)]: {
      width: '100%',
      paddingLeft: 0,
      marginTop: '32px !important',
      alignItems: 'flex-start !important',
    },
  },
}));
