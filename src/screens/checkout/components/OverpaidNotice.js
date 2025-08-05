import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { hexToRgb, formatAmountString } from 'util/general';
import Output from 'components/outputs/Output';

export default function OverpaidNotice(props) {
  const { context, matches } = props;
  const classes = useStyles(props);
  const { invoice } = context;
  const { id, payment_processor_quotes } = invoice;

  const quote =
    payment_processor_quotes.find(item => item.status === 'overpaid') ?? {};
  const { amount, total_paid, currency } = quote;
  const overpaidAmount = formatAmountString(
    total_paid - amount,
    currency,
    true,
  );

  return (
    <div className={classes.container}>
      <Text
        variant="body2"
        align={'center'}
        // className={classes.text}
        style={{
          wordBreak: 'break-word',
        }}>
        {`We’ve noticed that you've made a payment(s) that exceeds the requested amount. Your order will still be processed. Please contact support for a refund` +
          (overpaidAmount ? ' of the excess amount of ' + overpaidAmount : '') +
          '.'}
      </Text>
      <div className={classes.output}>
        <Output
          label="Request ID"
          value={id}
          horizontal={!matches}
          copy
          variant="body2"
          variantProps={{ style: { height: 12, width: 12 } }}
        />
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid ' + theme.palette['info']?.main,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: '100%',
    backgroundColor: hexToRgb(theme.palette['info']?.main),
    borderRadius: 30,
    fontColor: theme.palette['info']?.light,
  },
  output: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down(540)]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    display: 'flex',
    alignItems: 'center',
  },
}));
