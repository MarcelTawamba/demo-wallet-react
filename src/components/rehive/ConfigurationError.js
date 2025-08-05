import React from 'react';
import Image from 'components/images';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import { makeStyles } from '@material-ui/core/styles';

export default function ConfigurationError() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <Image name={'error'} size={180} />
        <Text style={{ fontWeight: 700 }}>Error</Text>
        <View pv={1}>
          <Text>
            This app is temporarily unavailable. Please try again in a few
            minutes.
          </Text>
        </View>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    maxWidth: 350,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: theme.spacing(3),
  },
}));
