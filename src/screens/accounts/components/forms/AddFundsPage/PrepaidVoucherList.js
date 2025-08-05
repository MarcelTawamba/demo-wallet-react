import React from 'react';
import { get } from 'lodash';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/styles/makeStyles';

import { objectToArray } from 'util/general';
import Text from 'components/outputs/Text';
import ErrorOutput from 'components/outputs/Error';
import { formatAmountString } from 'util/general';

const PrepaidVoucherList = props => {
  let { items, formikProps, config, currency, children } = props;

  const classes = useStyles(props);
  if (!formikProps) {
    return null;
  }
  const { values, setFieldValue } = formikProps;
  let { amount: value } = values;
  ({ currency } = currency);

  if (!currency) {
    return <ErrorOutput>No currency selected</ErrorOutput>;
  }
  if (!items) {
    items = objectToArray(get(config, ['fixed', 'options']), 'id');
  }

  function updateValue(item) {
    setFieldValue('amount', item.id);
  }

  return (
    <>
      <Grid container spacing={2} className={classes.viewStyleContainer}>
        {items.map(item => (
          <PrepaidVoucherCard
            key={item.id}
            currency={currency}
            rate={0}
            config={config.config}
            selected={value === item.id}
            onPress={() => updateValue(item)}
            {...item}
          />
        ))}
      </Grid>
      {children}
    </>
  );
};

export default PrepaidVoucherList;

const PrepaidVoucherCard = props => {
  const {
    id,
    amount,
    currency,
    points,
    cashBack,
    rate,
    selected,
    onPress,
    config,
  } = props;
  const classes = useStyles(props);

  const amountString = formatAmountString(amount, currency, true);

  return (
    <Grid item xs={5} className={classes.viewStyleCard} onClick={onPress}>
      {/* {Boolean(points && config.points) && (
        <React.Fragment>
          <div className={classes.viewStylePoints}>
            <Text
            // color="white" bold variant="b2"
            >
              {'+' + points + ' pts'}
            </Text>
          </div>
          <div className={classes.viewStylePointsTail} />
        </React.Fragment>
      )} */}
      {/* <div className={classes.amount} > */}
      <Text
        myColor={selected ? 'primaryContrast' : 'primary'}
        // opacity={selected ? 0.7 : 1}
        variant="h6"
        bold
        align={'center'}
        p={0.125}>
        {amountString}
      </Text>
      {/* {Boolean(rate) && (
        <Text
          variant="s2"
          align={'center'}
          color={selected ? 'primaryContrast' : 'font'}>
          {'~' +
            formatDivisibility(
              (amount * rate) / 10 ** currency.divisibility,
              2,
            ) +
            ' EUR'}
        </Text>
      )} */}
      {/* {Boolean(cashBack) && (
          <Text t="s2" c={selected ? 'primaryContrast' : 'font'}>
            {cashBack + ' ' + currency + ' cash back'}
          </Text>
        )} */}
      {/* </div> */}
    </Grid>
  );
};

const TAIL_WIDTH = 6;
const GRID_MARGIN = 12;

const useStyles = makeStyles(theme => ({
  viewStyleContainer: {
    layout: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
  },
  viewStyleCard: {
    backgroundColor: props =>
      props.selected ? theme.palette.primary.main : '#E6E6E6',
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    position: 'relative',
    padding: 8,
    margin: GRID_MARGIN,
    marginLeft: 8 + TAIL_WIDTH,
    display: 'flex',

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 84,
    cursor: 'pointer',
  },
  viewStylePoints: {
    position: 'absolute',
    top: 4,
    left: -TAIL_WIDTH,
    padding: 4,
    paddingRight: 8,
    height: 25,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: '#00B715',
  },
  viewStylePointsTail: {
    position: 'absolute',
    top: 29,
    left: -TAIL_WIDTH,
    borderTopColor: '#068D16',
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_WIDTH,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: TAIL_WIDTH * 2,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
}));
