import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Text from 'components/outputs/Text';
import Image from 'components/outputs/Image';

const ReceivePaymentDisplayHeader = props => {
  const { profile } = props;
  const classes = useStyles();

  if (!profile) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.image}>
        <Image
          src={profile.profile}
          key={profile.profile}
          height={150}
          width={150}
          backgroundColor={'secondary'}
          // loading={profilePictureLoading}
        />
      </div>
      <Text className={classes.title} variant={'h4'} align={'center'}>
        {profile.first_name + ' ' + profile.last_name}
      </Text>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: theme.spacing(2),
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 300,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    fontWeight: '600',
  },
}));

export default ReceivePaymentDisplayHeader;
