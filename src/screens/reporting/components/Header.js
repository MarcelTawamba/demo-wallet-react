import React, { useEffect, useReducer } from 'react';
import GridContainer from 'components/layout/GridContainer';

import { makeStyles } from '@material-ui/core/styles';

import { ResponsiveLine } from '@nivo/line';
import Text from 'components/outputs/Text';
import { getMetrics, getMetricPoints } from 'util/rehive';
import { userProfileSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';
import Spinner from 'components/outputs/Spinner';
import { useTheme } from 'components/app/context';
import { formatAmountString, formatConvAmount } from 'util/rates';
import { formatTime } from 'util/general';
import { useBusiness } from 'contexts';
// import Header from 'components/layouts/Screen/Header';

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
    overflowX: 'scroll',
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingBottom: 64,
    padding: theme.spacing(2),
  },
  top: {
    flex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  bottom: {
    flex: 3,
    width: '100%',
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
  },
  border: {
    border: '1px solid #EFEFEF',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2) - 2,
    borderRadius: 15,
  },
  topLeft: {
    flex: 3,
    height: '100%',
    marginRight: theme.spacing(2),
    maxHeight: 300,
  },
  topRight: {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topRightSection: {
    marginBottom: theme.spacing(2),
    width: '100%',
    flex: 1,
  },
  topRightSection2: {
    width: '100%',
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rowDates: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 4,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '90%',
  },
  graph: { height: 200 },
  graphBottom: { height: 150 },
  bottomLeft: {
    borderRight: '1px solid #EFEFEF',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
  },
  bottomRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
  },
  bottomTop: {
    borderBottom: '1px solid #EFEFEF',
    flex: 1,
    paddingBottom: theme.spacing(2),
  },
  bottomBottom: { flex: 1, paddingTop: theme.spacing(2) },
}));

const reducer = (state, action) => {
  const { type, payload } = action;
  const { points, metric } = payload;
  const metricId = metric?.name;
  if (type === 'store') {
    return { ...state, [metricId]: { ...metric, points } };
  }
};

export default function HomeContainer(props) {
  const classes = useStyles();

  const { business } = useBusiness();
  const { currency = {} } = business;
  const [metrics, dispatch] = useReducer(reducer, {});
  const { colors } = useTheme();
  const profile = useSelector(userProfileSelector);

  useEffect(() => {
    async function fetchData() {
      if (business) {
        const resp = await getMetrics(business?.id);
        if (resp?.status === 'success') {
          const metricsResults = resp?.data?.results;
          metricsResults.forEach(async metric => {
            const { id: metricId = '' } = metric;
            const resp2 = await getMetricPoints(business?.id, metricId);
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
  }, [business]);

  const grossVolumeMetric = metrics?.['Gross volume'];
  const grossVolumeData = parseData(grossVolumeMetric ?? {}, colors, profile);

  const graphProps = { business, metrics, colors, profile };

  const { data: points } = grossVolumeData?.[0] ?? {};

  const start = points?.[0];
  const end = points?.[points.length - 1];

  const startValueString = formatAmountString(start?.y, currency, true);
  const endValueString = formatAmountString(end?.y, currency, true);

  const startDateString = start?.x; // formatTime(, 'DD MMM YYYY', profile);
  const endDateString = end?.x; //formatTime(end?.date, 'DD MMM YYYY', profile);

  return (
    <GridContainer
      content={
        <div className={`${classes.container}`}>
          <div className={`${classes.top}`}>
            <div className={`${classes.topLeft} ${classes.border}`}>
              <Text variant="h6" bold id="gross_volume" />
              {grossVolumeMetric ? (
                <>
                  <div className={classes.row}>
                    <Text variant="h6" color="primary">
                      {startValueString}
                    </Text>
                    <Text variant="h6" opacity={0.87} align="right">
                      {endValueString}
                    </Text>
                  </div>
                  <div className={classes.graph}>
                    <MyResponsiveLine data={grossVolumeData} />
                  </div>

                  <div className={classes.rowDates}>
                    <Text variant="h6">{startDateString}</Text>
                    <Text variant="h6" align="right">
                      {endDateString}
                    </Text>
                  </div>
                </>
              ) : (
                <Spinner />
              )}
            </div>

            <div className={`${classes.topRight}`}>
              <div className={`${classes.topRightSection} ${classes.border}`}>
                <div className={classes.row}>
                  <Text variant="h6" bold id="gross_sales" />
                  <Text align="right">{endDateString}</Text>
                </div>
                <div className={classes.center}>
                  <Text variant="h4" color="primary" bold>
                    {endValueString}
                  </Text>
                  {/* <Text color="primary">1.0340 BTC</Text> */}
                </div>
              </div>
              <div className={`${classes.topRightSection2} ${classes.border}`}>
                <div className={classes.row}>
                  <Text variant="h6" bold id="service_fees" />
                  <Text align="right">{endDateString}</Text>
                </div>
                <div className={classes.center}>
                  <Text variant="h4" color="primary" bold>
                    130.00 USD
                  </Text>
                  <Text color="primary">0.340 BTC</Text>
                </div>
              </div>
            </div>
          </div>
          <div className={`${classes.bottom} ${classes.border}`}>
            <div className={classes.bottomLeft}>
              <div className={classes.bottomTop}>
                <BottomGraph id="Successful payments" {...graphProps} />
              </div>

              <div className={classes.bottomBottom}>
                <BottomGraph id="Net volume" {...graphProps} />
              </div>
            </div>

            <div className={classes.bottomRight}>
              <div className={classes.bottomTop}>
                <BottomGraph id="Total payouts" {...graphProps} />
              </div>

              <div className={classes.bottomBottom}>
                <BottomGraph id="New customers" {...graphProps} />
              </div>
            </div>
          </div>
        </div>
      }
      // header={<Header history={history} />}
    />
  );
}
const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
    data={data}
    // margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{
      type: 'linear',
      min: 'auto',
      max: 'auto',
      stacked: true,
      reverse: false,
    }}
    curve="cardinal"
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      // legend: 'transportation',
      legendOffset: 36,
      legendPosition: 'middle',
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      // legend: 'count',
      legendOffset: -40,
      legendPosition: 'middle',
    }}
    colors={{ scheme: 'category10' }}
    enablePoints={false}
    pointSize={10}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
    enableArea={true}
    useMesh={true}
    // legends={[
    //   {
    //     anchor: 'bottom-right',
    //     direction: 'column',
    //     justify: false,
    //     translateX: 100,
    //     translateY: 0,
    //     itemsSpacing: 0,
    //     itemDirection: 'left-to-right',
    //     itemWidth: 80,
    //     itemHeight: 20,
    //     itemOpacity: 0.75,
    //     symbolSize: 12,
    //     symbolShape: 'circle',
    //     symbolBorderColor: 'rgba(0, 0, 0, .5)',
    //     effects: [
    //       {
    //         on: 'hover',
    //         style: {
    //           itemBackground: 'rgba(0, 0, 0, .03)',
    //           itemOpacity: 1,
    //         },
    //       },
    //     ],
    //   },
    // ]}
  />
);

function BottomGraph(props) {
  const { id, metrics, colors, business = {}, profile } = props;
  const { currency } = business;
  const metric = metrics?.[id] ?? null;
  const classes = useStyles();
  const data = parseData(metric ?? {}, colors, profile);
  // console.log('BottomGraph -> data', data);
  const data2 = data?.[0] ?? {};
  // console.log('BottomGraph -> data2', data2);
  const { data: points } = data2;

  const start = points?.[0];
  const end = points?.[points.length - 1];

  const startValueString =
    data2?.id === 'Successful payments'
      ? start?.y
      : formatAmountString(start?.y, currency, true);
  const endValueString =
    data2?.id === 'Successful payments'
      ? end?.y
      : formatAmountString(end?.y, currency, true);

  const startDateString = start?.x; // formatTime(, 'DD MMM YYYY', profile);
  const endDateString = end?.x; //formatTime(end?.date, 'DD MMM YYYY', profile);

  return (
    <div>
      <Text bold>{id}</Text>
      {metric ? (
        <>
          <div className={classes.row}>
            <Text variant="h6" color="primary" valueBold>
              {startValueString}
            </Text>
            <Text variant="h6" opacity={0.87} align="right" valueBold>
              {endValueString}
            </Text>
          </div>
          <div className={classes.graphBottom}>
            <MyResponsiveLine data={data} />
          </div>
          <div className={classes.rowDates}>
            <Text variant="h6">{startDateString}</Text>
            <Text variant="h6" align="right">
              {endDateString}
            </Text>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
