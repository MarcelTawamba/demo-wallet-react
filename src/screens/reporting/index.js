import React, { useEffect, useReducer, useState } from 'react';
import Layout from 'components/layout/LayoutNew';

import { makeStyles } from '@material-ui/core/styles';

import { getMetrics, getMetricPoints } from 'util/rehive';
import { userProfileSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import { useTheme } from 'components/app/context';
import { formatAmountString, formatConvAmount } from 'util/rates';
import { formatTime } from 'util/general';
import SummaryValue from './components/SummaryValue';
import Graphs from './components/Graphs';
import ReportingHeader from './components/ReportingHeader';
import { TIMES } from 'util/date';
import Graph from './components/Graph';
import Info from 'components/outputs/Info';
import { useBusiness } from 'contexts';
import BusinessHeader from 'components/layouts/Screen/Header/BusinessHeader';

const config = {
  header: {
    // graph: { id: 'Net volume' },
    graph: { id: 'Gross volume' },
    value1: { id: 'Gross sales' },
    value2: { id: 'Service fees' },
  },
  graphs: [
    { id: 'Successful payments', title: 'successful_payments' },
    { id: 'Total payouts', title: 'total_payouts' },
    { id: 'Net volume', title: 'net_volume' },
  ],
};

function parseData(metric, colors, profile) {
  let { points = [], name } = metric;
  let prevValue = points?.[0]?.value;
  let data = [...points].reverse();
  data = data.map(({ value, date }) => {
    // if (prevValue !== null) {
    const y = value - prevValue;
    let newData = { x: formatTime(date, 'DD MMM YYYY', profile), y };
    prevValue = value;
    return newData;
    // } else {
    // prevValue = value;
    // return null;
    // }
  });
  data.shift();

  return [
    {
      id: name,
      color: colors.primary,
      data,
    },
  ];
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    // overflowY: 'scroll',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    marginBottom: theme.spacing(3),
    // padding: theme.spacing(1),
  },
  top: {
    flex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  border: {
    border: '1px solid #EFEFEF',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2) - 2,
    borderRadius: 15,
  },
  topLeft: {
    flex: 2,
    height: '100%',
    marginRight: theme.spacing(2),
    maxHeight: 300,
    minHeight: 260,
    width: '60%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  topRight: {
    flex: 2,
    // height: '100%',
    display: 'flex',
    minWidth: 200,
    maxWidth: 250,
    flexDirection: 'column',
    [theme.breakpoints.down(736)]: {
      marginTop: theme.spacing(2),
      flexDirection: 'row',
      width: '100%',
      maxWidth: 736,
    },
    [theme.breakpoints.down(420)]: {
      flexDirection: 'column',
      width: '100%',
      maxWidth: 736,
    },
    // [theme.breakpoints.down('xs')]: {
    //   flexDirection: 'row',
    // },
  },
}));

const reducer = (state, action) => {
  const { type, payload = {} } = action;
  const { points, metric } = payload;
  const metricId = metric?.name;
  if (type === 'store') {
    return { ...state, [metricId]: { ...metric, loading: false, points } };
  } else if (type === 'refreshing') {
    return { ...state, [metricId]: { ...metric, loading: true } };
  } else if (type === 'stop') {
    return { ...state, [metricId]: { ...metric, loading: false } };
  } else if (type === 'reset') {
    return {};
  }
};

const filterConfig = {
  // startDate: {
  //   type: 'startDate',
  // },
  // endDate: {
  //   type: 'endDate',
  // },
  dateRange: {
    type: 'dateRange',
    //   label: 'Reference',
  },
};

export default function ReportingContainer(props) {
  const classes = useStyles();

  const { business, loading } = useBusiness();
  const { currency = {}, timezone, status } = business;
  const isVerified = status === 'verified';
  const [metrics, dispatch] = useReducer(reducer, {});
  const { colors } = useTheme();
  const profile = useSelector(userProfileSelector);
  // const { search } = window?.location ?? {};

  const [endDateInterval, setEndDateInterval] = useState('last_week4');
  const [endDate, setEndDate] = useState(new Date().setUTCHours(0, 0, 0, 0));
  const [startDate, setStartDate] = useState(
    endDate - TIMES[endDateInterval.replace('last_', '')],
  );

  const initialFilters = {
    endDate,
    startDate,
    endDateInterval,
    setEndDateInterval,
    setStartDate,
    setEndDate,
  };

  useEffect(() => {
    async function fetchData() {
      if (business && isVerified) {
        dispatch({
          type: 'reset',
        });
        const resp = await getMetrics(business?.id);
        if (resp?.status === 'success') {
          const metricsResults = resp?.data?.results;
          metricsResults.forEach(async metric => {
            const { id: metricId = '' } = metric;
            dispatch({
              type: 'refreshing',
              payload: { metric },
            });
            const resp2 = await getMetricPoints(
              business?.id,
              metricId,
              '?page_size=250&date__lte=' + endDate + '&date__gte=' + startDate,
            );
            dispatch({
              type: 'store',
              payload: { metric, points: resp2?.data?.results },
            });
          });
        }
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business, endDate, startDate]);

  const grossVolumeMetric = metrics?.['Gross volume'];
  const paymentsMetric = metrics?.['Successful payments'];

  const graphProps = {
    business,
    metrics,
    colors,
    profile,
    endDate,
    startDate,
    isVerified,
  };

  const { points = [] } = grossVolumeMetric ?? {};

  const start = points?.[0];
  const end = points?.[points.length - 1];

  const grossSalesString = formatAmountString(
    start?.value - ((end?.date >= startDate + TIMES.day ? 0 : end?.value) ?? 0),
    currency,
    true,
  );
  const feesString = formatAmountString(0, currency, true);
  const paymentsString =
    paymentsMetric?.points?.[0]?.value -
    ((paymentsMetric?.points?.[paymentsMetric?.points?.length - 1]?.date >=
    startDate + TIMES.day
      ? 0
      : paymentsMetric?.points?.[paymentsMetric?.points?.length - 1]?.value) ??
      0);

  const salesDateString = start?.x; // formatTime(, 'DD MMM YYYY', profile);

  return (
    <Layout
      content={
        <div className={`${classes.container}`}>
          {!isVerified && (
            <Info variant="warning" id="reporting_warning_message" />
          )}
          <div className={`${classes.top}`}>
            <div className={`${classes.topLeft} ${classes.border}`}>
              <Graph id={'Gross volume'} title="gross_volume" {...graphProps} />
            </div>
            <div className={`${classes.topRight}`}>
              <SummaryValue
                index={0}
                item={{
                  id: 'Gross sales',
                  label: 'gross_sales',
                  date: salesDateString,
                  value: grossSalesString,
                }}
              />
              <SummaryValue
                item={{
                  id: 'Total payments',
                  date: salesDateString,
                  value: isNaN(paymentsString) ? 0 : paymentsString,
                  // value2: '0.00 BTC',
                }}
              />
            </div>
          </div>
          <Graphs {...graphProps} config={config?.graphs} />
        </div>
      }
      header={
        <div className={classes.header}>
          <BusinessHeader />
          <ReportingHeader
            filters={{ filterConfig, initialFilters, filters: initialFilters }}
            context={{ profile }}
          />
        </div>
      }
    />
  );
}
