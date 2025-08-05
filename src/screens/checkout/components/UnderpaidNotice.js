import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';
import { hexToRgb, formatAmountString } from 'util/general';
import Output from 'components/outputs/Output';

export default function UnderpaidNotice(props) {
  const { context, matches } = props;
  const classes = useStyles(props);
  const { invoice } = context;
  const { id, payment_processor_quotes } = invoice;

  const quote = payment_processor_quotes.find(item => item.total_paid) ?? {};
  const { total_paid, currency } = quote;
  const underpaidAmount = formatAmountString(total_paid, currency, true);

  return (
    <div className={classes.container}>
      <Text
        variant="body2"
        align={'center'}
        color="error"
        // className={classes.text}
        style={{
          wordBreak: 'break-word',
        }}>
        {`Your invoice is underpaid and the quote has expired. Contact support to request a refund` +
          (underpaidAmount ? ' for the amount of ' + underpaidAmount : '') +
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
    border: '1px solid ' + theme.palette['error']?.main,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    width: '100%',
    backgroundColor: hexToRgb(theme.palette['error']?.main),
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
  // text: {
  //   fontColor: theme.palette['info']?.light,
  //   color: theme.palette['info']?.light,
  // },
}));
