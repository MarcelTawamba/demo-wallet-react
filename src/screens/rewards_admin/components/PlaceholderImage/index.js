import React from 'react';

import BirthdayEarned from './earned/birthday-earned.svg';
import EmailEarned from './earned/email-earned.svg';
import GeneralEarned from './earned/general-earned.svg';
import MobileEarned from './earned/mobile-earned.svg';
import Tier1 from './earned/tier1.svg';
import Tier2 from './earned/tier2.svg';
import Tier3 from './earned/tier3.svg';

import Birthday from './rewards/birthday.svg';
import Earned from './rewards/earned.svg';
import general1 from './rewards/general.svg';
import general2 from './rewards/general-2.svg';
import general3 from './rewards/general-3.svg';
import ReferFriend from './rewards/refer-friend.svg';
import Transactions1 from './rewards/transactions-1.svg';
import Transactions2 from './rewards/transactions-2.svg';
import VerifyEmail from './rewards/verify-email.svg';
import VerifyMobile from './rewards/verify-mobile.svg';
import { useTheme } from 'components/app/context';
import { makeStyles } from '@material-ui/core/styles';

const PlaceholderImage = props => {
  const { colors } = useTheme();

  let {
    width,
    height,
    card,
    rem,
    padded,
    name,
    rewardName,
    ...restProps
  } = props;

  const w = padded ? width - 2 * rem * padded : width;
  const h = height ? height : card ? w / 2.5 : w;

  const imageProps = { width: w, height: h, colors };
  const classes = useStyles(imageProps);

  if (!name) {
    if (rewardName.includes('irthday')) {
      name = 'birthday';
    } else if (rewardName.includes('mobile number')) {
      name = 'verify-mobile';
    } else if (rewardName.includes('email')) {
      name = 'verify-email';
    } else if (rewardName.includes('friend')) {
      name = 'refer-friend';
    } else if (rewardName.includes('transactions')) {
      name = 'transactions';
    } else if (rewardName.includes('joining')) {
      name = 'general3';
    } else if (rewardName.includes('users')) {
      name = 'general2';
    } else {
      name = 'general1'; // + Math.ceil(Math.random() * 3);
    }
  }
  const images = {
    'birthday-earned': BirthdayEarned,
    'email-earned': EmailEarned,
    'general-earned': GeneralEarned,
    'mobile-earned': MobileEarned,
    tier1: Tier1,
    tier2: Tier2,
    tier3: Tier3,
    birthday: Birthday,
    earned: Earned,
    general1,
    general2,
    general3,
    'refer-friend': ReferFriend,
    transactions: Transactions1,
    transactions2: Transactions2,
    'verify-email': VerifyEmail,
    'verify-mobile': VerifyMobile,
  };
  // return ;
  return (
    <div className={classes.container} {...restProps}>
      <img className={classes.image} alt={'no ' + name} src={images[name]} />
    </div>
  );
  // {
  // );
  // }
};

// _CustomImage.propTypes = {
//   backgroundColor: PropTypes.string,
//   width: PropTypes.number,
//   height: PropTypes.number,
//   padding: PropTypes.number,
//   colors: PropTypes.object,
// };

// _CustomImage.defaultProps = {
//   backgroundColor: 'white',
//   width: SCREEN_WIDTH,
//   height: 120,
//   padding: 0,
//   colors: {},
// };

export default PlaceholderImage;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  image: {
    width: ({ width }) => (width ? width : 200),
    height: ({ height }) => (height ? height : 200),
  },
}));
