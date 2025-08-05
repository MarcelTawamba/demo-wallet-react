import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import { displayFormatDivisibility } from 'util/general';
import RewardPlaceholderImage from 'screens/rewards/components/images';
import ButtonBase from '@material-ui/core/ButtonBase';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

export default function FeaturedRewardCard(props) {
  // const { campaign, amount, currency, loading, history } = props;
  const {
    id,
    name,
    image,
    amount,
    percentage,
    fixed_amount,
    currency,
    type,
    loading,
    history,
  } = props;

  const classes = useStyles();

  const amountString =
    currency?.symbol +
    displayFormatDivisibility(fixed_amount, currency?.divisibility);
  const percentageString = parseFloat(percentage).toString() + '%';

  const isPercentage = type === 'percentage';

  const skeleton = (
    <View>
      <Skeleton
        variant="rect"
        width={'100%'}
        height={200}
        style={{ borderRadius: 15 }}
      />
    </View>
  );

  return loading ? (
    skeleton
  ) : (
    <ButtonBase
      className={classes.root}
      onClick={() => history.push(`/rewards/?id=${id}`)}>
      <View p={1} pb={1.5} bC={'white'} bR={15} w={'100%'} h={'100%'}>
        <View aI={'center'} w={'100%'} pb={1}>
          <RewardPlaceholderImage
            rewardName={name}
            size={90}
            src={image}
            featuredCard
          />
        </View>
        <Text style={{ fontSize: 12 }}>{name}</Text>
        <Text
          myColor={'primary'}
          fontWeight={'700'}
          inline
          style={{ fontSize: 20 }}>
          {isPercentage ? `Earn ${percentageString}` : amountString}
        </Text>
      </View>
    </ButtonBase>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
    borderRadius: 10,
    width: '100%',
    height: '100%',
  },
}));
