import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery, Box } from '@material-ui/core';
// import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { get } from 'lodash';
import ErrorOutput from 'components/outputs/Error';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import { choosePaymentRequestMethod } from 'screens/checkout/util/rehive';

export default function Layout(props) {
  const {
    invoice,
    children,
    quote,
    history,
    setInvoice,
    paths,
    headerLeft,
    headerRight,
    containerRef,
  } = props;

  const { metadata, id, payer_email } = invoice;

  const classes = useStyles(props);

  const business = get(metadata, ['service_business', 'business'], {});
  const { name, icon } = business;
  const [loading, setSubmitting] = useState(false);

  const logo = icon ? icon : '/images/icon.png';

  async function handleNewQuote() {
    setSubmitting(true);
    const data = {
      payer_email,
      payment_processor_currency: 'TXBT',
      primary_payment_processor: 'native_bitcoin',
    };

    const resp = await choosePaymentRequestMethod(id, data);
    if (resp.status === 'success') {
      setInvoice(resp.data);
    } else {
      console.log('handleSubmit error -> resp', resp);
      // set error
    }
    setSubmitting(false);
  }
  let buttons = [];
  const isBitcoin = paths?.[2] === 'bitcoin';
  if (isBitcoin) {
    buttons.push({
      label: 'CREATE NEW BITCOIN QUOTE',
      onPress: handleNewQuote,
      loading,
      disabled: loading,
    });
  }
  buttons.push({
    variant: isBitcoin ? 'text' : '',
    label: 'Back',
    onPress: () => history.push('/checkout/?request=' + id),
  });

  const hideBack = props.hideBack || paths.length === 3;
  const isPaymentMethod = paths[2] === 'paymentMethod';
  const onBackUrlBase = isPaymentMethod
    ? '/checkout/'
    : '/checkout/paymentMethod/';

  return (
    <div className={classes.container} ref={containerRef}>
      {!hideBack && (
        <div className={classes.button}>
          <IconLabelButton
            label="Back"
            onPress={() => history.push(onBackUrlBase + '?request_id=' + id)}
          />
        </div>
      )}
      <div className={classes.page}>
        {Boolean(logo) && (
          <div className={classes.logo}>
            <img
              style={{
                maxHeight: 140,
                maxWidth: 140,
                // height: ,
                width: '100%',
                objectFit: 'contain',
              }}
              alt="rehive"
              src={logo}
            />
          </div>
        )}
        <div className={classes.header}>
          {headerLeft}
          {headerRight ?? <ExpiredTimer quote={quote} />}
        </div>

        <Text
          className={classes.title}
          variant="h5"
          align="center"
          myColor="#222222">
          {name}
        </Text>
        {Boolean(quote) || headerLeft || isPaymentMethod ? (
          children
        ) : (
          <>
            <PageContent>
              <Box pt={2} p={0.5}>
                <ErrorOutput>
                  Unable to find quote or quote has expired
                </ErrorOutput>
              </Box>
            </PageContent>
            <PageButtons layout="vertical" items={buttons} />
          </>
        )}
      </div>
    </div>
  );
}

function ExpiredTimer(props) {
  const { quote = {} } = props;
  const classes = useStyles();
  const [temp, setSwitch] = useState(false);

  const { status, expiration_date } = quote;
  const hasExpired = Boolean(expiration_date);
  const expirationMoment = hasExpired && moment(expiration_date).local();

  const expiredDuration =
    hasExpired &&
    moment.duration(expirationMoment.diff(moment())).asMilliseconds();

  const isExpired = hasExpired && expiredDuration < 0 && status === 'expired';
  const expiredString = hasExpired
    ? isExpired
      ? 'Expired'
      : moment(expiredDuration).format('mm:ss')
    : '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setSwitch(!temp);
    }, 200);
    return () => clearTimeout(timer);
  }, [temp]);

  return (
    <div className={classes.expired}>
      {status &&
      status.match(/paid|overpaid/) &&
      status !== 'underpaid' ? null : ( //<Status>{standardizeString(status)}</Status>
        <>
          {/* {hasExpired && ( */}
          <Text
            align={'right'}
            color={isExpired ? 'error' : 'primary'}
            variant="h5"
            className={classes.time}>
            {expiredString}
          </Text>
          {/* )} */}
          {isExpired && (
            <Text align={'right'} variant="s2" className={classes.expiredText}>
              {expirationMoment.format('YYYY/MM/DD HH:mm:ss')}
            </Text>
          )}
        </>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 0,
    padding: theme.spacing(4),
  },
  button: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: theme.spacing(2),
  },
  expired: {
    position: 'absolute',
    right: theme.spacing(4),
  },
  logo: {
    borderRadius: 140,
    height: 140,
    overflow: 'hidden',
    // padding: 10,
    backgroundColor: theme.palette.primary.contrastText,
    width: 140,
    minHeight: 140,
    minWidth: 140,
    display: 'flex',
    marginTop: -(70 + theme.spacing(4)),
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    whiteSpace: 'pre-wrap',
  },
  expiredText: {
    whiteSpace: 'pre-wrap',
  },
  container: {
    width: '100%',
    height: ({ height }) => (height ? '90vh' : '100vh'),
    display: 'flex',
    paddingTop: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  page: {
    margin: theme.spacing(3),
    padding: theme.spacing(4),
    marginTop: theme.spacing(6),
    // paddingTop: 70 + theme.spacing(2),
    position: 'relative',
    borderRadius: 30,
    minWidth: 350,
    maxWidth: 550,

    // border: '1px solid #EFEFEF',
    width: '100%',
    // [theme.breakpoints.down(1200)]: {
    //   width: '45%',
    // },
    // [theme.breakpoints.down(968)]: {
    //   width: '90%',
    //   height: 'auto',
    //   padding: theme.spacing(4),
    // },
    // [theme.breakpoints.down(480)]: {
    //   width: '100%',
    //   height: 'auto',
    //   paddingBottom: theme.spacing(4),
    //   padding: theme.spacing(2),
    // },
    height: ({ fullHeight = true }) => 'auto', //fullHeight ? '90%' :
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'center',
  },

  title: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(1),
  },
}));
