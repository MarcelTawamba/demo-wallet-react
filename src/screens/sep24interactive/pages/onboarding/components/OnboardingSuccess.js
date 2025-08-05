/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import PageContent from 'components/layout/page/PageContent';
import { View } from 'components/layout/View';
import LottieImage from 'components/outputs/LottieImage';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import { useHistory } from 'react-router-dom';

export default function OnboardingSuccess() {
  const classes = useStyles();
  const history = useHistory();

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleContinue();
  //   }, 3000);
  // });

  function handleContinue() {
    window.location.reload();
  }

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <PageContent horizontal={3}>
          <View fD="row" h={200} w={'100%'} jC={'center'}>
            <LottieImage name="success" size={200} />
          </View>
          <View mb={1}>
            <Text s={25} fontWeight={'700'} tA={'center'}>
              Success!
            </Text>
          </View>
          <Text
            variant="body2"
            tA={'center'}
            lH={25}
            c="#797979"
            s={15}
            style={{ padding: '0 32px' }}
            id="onboarding_success"
          />

          <View pt={1.5}>
            <Button
              wide
              id="continue_anchor_flow"
              color="primary"
              onPress={handleContinue}
            />
          </View>
        </PageContent>
      </Card>
    </React.Fragment>
  );
}

const useStyles = makeStyles(() => ({
  card: {
    boxShadow: 'none',
    overflow: 'unset',
  },
}));
