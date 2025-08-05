import React, { useState, useEffect, useRef } from 'react';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ErrorOutput from 'components/outputs/Error';
import Spinner from 'components/outputs/Spinner';
import { useLocation } from 'react-router-dom';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { safeParams } from 'util/general';
import LottieImage from 'components/outputs/LottieImage';

const PublicStripeRedirectPage = props => {
  const location = useLocation();
  let { search, pathname } = location;

  const params = new URLSearchParams(search);
  const color = safeParams(params, 'color', '777777');
  const sessionId = safeParams(params, 'sessionId');
  const secure3d = safeParams(params, 'secure3d');
  const stripeId = safeParams(params, 'stripeId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  let stripePromise = useRef(null);
  const classes = useStyles(props);
  const isSuccess = pathname.includes('success');
  const isFail = pathname.includes('fail');

  useEffect(() => {
    if (!(isSuccess || isFail)) {
      if (stripeId) {
        stripePromise.current = loadStripe(stripeId);
      } else {
        setError('Unable to connect to Stripe, please try again later');
      }
    }
    setLoading(false);
  }, [isFail, isSuccess, stripeId]);

  return error || isFail ? (
    <>
      <LottieImage
        size={250}
        // colorsOveride={{ primary: '#' + color }}
        name={'error'}
      />

      <ErrorOutput>
        {isFail ? 'Unable to connect to Stripe, please try again later' : error}
      </ErrorOutput>
    </>
  ) : isSuccess ? (
    <>
      <LottieImage
        size={250}
        // colorsOveride={{ primary: '#' + color }}
        name={'success'}
      />

      <Text className={classes.text} align="center">
        {(secure3d ? '3D Secure successful' : 'Card successfully added') +
          ', please close web browser to return to app'}
      </Text>
    </>
  ) : loading ? (
    <div className={classes.container}>
      <Spinner style={{ color }} />
      <Text className={classes.text} align="center">
        Redirecting to Stripe...
      </Text>
    </div>
  ) : (
    <Elements stripe={stripePromise.current}>
      <CardField sessionId={sessionId} />
    </Elements>
  );
};

export default PublicStripeRedirectPage;

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(2),
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    padding: theme.spacing(4),
  },
}));

const CardField = props => {
  const stripe = useStripe();
  const { sessionId } = props;
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleRedirect() {
      try {
        await stripe.redirectToCheckout({ sessionId });
      } catch (e) {
        setError(e.message);
      }
    }
    if (stripe) {
      handleRedirect();
    }
  }, [sessionId, stripe]);

  return error ? <ErrorOutput>{error}</ErrorOutput> : <Spinner />;
};
