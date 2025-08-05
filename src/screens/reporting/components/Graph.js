import React, { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { ResponsiveLine } from '@nivo/line';
import { Defs, linearGradientDef } from '@nivo/core';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import { formatAmountString, formatConvAmount } from 'util/rates';
import { formatTime, objectToArray } from 'util/general';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { range, unionBy, orderBy } from 'lodash';
import { TIMES } from 'util/date';

// function parseData(metric, { colors, profile, endDate, startDate }) {
//   // console.log('parseData -> colors', colors);
//   let { points = [], name } = metric;
//   console.log('parseData -> metric', metric);
//   let prevValue = points?.[0]?.value;

//   const offset = points.length ? (points[0].date - endDate) % TIMES.day : 0;
//   console.log('parseData -> offset', offset);
//   const emptyRange = range(
//     startDate + offset,
//     endDate + offset + TIMES.day,
//     TIMES.day,
//   ).map(item => ({
//     date: item,
//     value: 0,
//   }));
//   console.log('parseData -> emptyRange', emptyRange);

//   let temp = orderBy(unionBy(points, emptyRange, 'date'), 'date', 'asc');
//   console.log('parseData -> temp', temp);
//   // temp = ;
//   console.log('parseData -> temp', temp);
//   // console.log('parseData -> temp', temp);
//   //
//   let data = temp.map(({ value, date }) => {
//     // if (prevValue !== null) {
//     // const y = value - prevValue;
//     let newData = {
//       x: formatTime(date, 'DD MMM YYYY', profile),
//       date,
//       y: value,
//       color: colors.error,
//     };
//     prevValue = value;
//     return newData;
//   });
//   console.log('parseData -> data', data);
//   // if (data.length && data[0].date > startDate) {
//   //   data.unshift({
//   //     x: formatTime(startDate, 'DD MMM YYYY', profile),
//   //     date: startDate,
//   //     y: 0,
//   //   });
//   // }
//   // if (data.length && data[data.length - 1].date < endDate) {
//   //   data.push({
//   //     x: formatTime(endDate, 'DD MMM YYYY', profile),
//   //     date: endDate,
//   //     y: 0,
//   //   });
//   // }
//   // data.shift();
//   console.log('parseData -> data', data);

//   return [
//     {
//       id: name,
//       color: colors.primary,
//       data,
//     },
//   ];
// }

function parseData(metric, { colors, profile, endDate, startDate }) {
  let { points = [], name } = metric;
  const isStartZero =
    points?.[points?.length - 1]?.value === null ||
    points?.[points?.length - 1]?.date >= startDate + TIMES.day;
  const newPoints = points.filter(point => point.value !== null);
  let firstPoint = newPoints?.[0];
  let lastPoint = newPoints?.[newPoints.length - 2];

  const offset = points.length ? (points[0].date - endDate) % TIMES.day : 0;

  const emptyStartRange = (
    isStartZero ? range(startDate + offset, lastPoint?.date, TIMES.day) : []
  ).map(item => ({
    date: item,
    value: 0,
  }));

  let data = orderBy(
    unionBy(newPoints, emptyStartRange, 'date'),
    'date',
    'asc',
  ).map(({ value, date }) => {
    let newData = {
      x: formatTime(date, 'DD MMM YYYY', profile),
      y: name !== 'Net volume' ? Math.abs(value) : value,
    };
    return newData;
  });
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
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
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
  tooltip: {
    // borderBottom: '1px solid #EFEFEF',
    // flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 15,
    padding: theme.spacing(1),
  },
}));

export default function Graph(props) {
  const {
    id,
    title,
    metrics,
    colors,
    business = {},
    profile,
    endDate,
    startDate,
    isVerified,
  } = props;
  const { currency } = business;
  // const metricIds = objectToArray(metrics, id).map(item => item.name);
  const [metricId, setMetricId] = useState(id);
  const metric = metrics?.[metricId];
  const { loading } = metric ?? {};
  const classes = useStyles();
  const data = parseData(metric ?? {}, { colors, profile, endDate, startDate });
  const data2 = data?.[0] ?? {};
  const { data: points } = data2;

  const max = Math.max.apply(
    Math,
    points.map(function (o) {
      return o.y;
    }),
  );

  const start = points?.[0];
  const end = points?.[points.length - 1];
  const noData = points?.length === 0;

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
      {/* <div>
        <DropdownSelector
          noCard
          valueProps={{ bold: true }}
          item={metricId}
          data={metricIds}
          onValueChange={setMetricId}
          // listItem
          // renderFooter={
          //   <ListItem
          //     button
          //     // onClick={() => handleNewAuth()}
          //     title={'Add metric'}
          //     icon="plus"
          //     color="primary"
          //   />
          // }
        />
      </div> */}
      <Text bold id={title}></Text>
      {(!metric || loading) && isVerified ? (
        <Spinner />
      ) : noData ? (
        <EmptyListMessage id="no_data" />
      ) : (
        <>
          <div className={classes.row}>
            <Text variant="h6" valueBold>
              {startValueString}
            </Text>
            <Text
              variant="h6"
              opacity={0.87}
              align="right"
              color="primary"
              valueBold>
              {endValueString}
            </Text>
          </div>
          <div className={classes.graphBottom}>
            <MyResponsiveLine data={data} currency={currency} max={max} />
          </div>
          <div className={classes.rowDates}>
            <Text variant="body2">{startDateString}</Text>
            <Text variant="body2" align="right">
              {endDateString}
            </Text>
          </div>
        </>
      )}
    </div>
  );
}

function formatTooltip(value, variant, props) {
  const { currency } = props;

  if (variant.match(/Gross volume|Total payouts|Net volume/)) {
    return formatAmountString(value, currency, true);
  } else {
    return value + ' ' + variant;
  }
  // if (variant.match(/payments/)) {
  // }
  // if (variant.match(/customers/)) {
  //   return value + ' customers';
  // }
  // return value;
}

function GraphTooltip(props) {
  const { point } = props;
  const { data, serieId } = point;
  const classes = useStyles();

  return (
    <div className={classes.tooltip}>
      <Text variant="body2">{data?.x}</Text>
      <Text color="primary">{formatTooltip(data?.y, serieId, props)}</Text>
    </div>
  );
}

const MyResponsiveLine = ({ data, currency, max }) => {
  return (
    <ResponsiveLine
      data={data}
      // margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: -0.5,
        max: max ? max * 1.05 : 10,
        stacked: false,
        reverse: false,
      }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      tooltip={props => <GraphTooltip {...props} currency={currency} />}
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
      // colors={{ scheme: 'category10' }}

      colors={data.map(d => d.color)}
      // colorBy={d => {
      //   return d.color;
      // }}
      enablePoints={false}
      // pointSize={10}
      // pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="Date"
      pointLabelYOffset={-12}
      enableArea={true}
      areaOpacity={0.5}
      enableGridX={false}
      enableGridY={false}
      useMesh={true}
      // layers={[
      //   'grid',
      //   'markers',
      //   'areas',
      //   Line,
      //   'slices',
      //   'points',
      //   'axes',
      //   'legends',
      // ]}
      // curve={select('curve', curveOptions, 'linear')}
      // defs={[
      //   linearGradientDef('gradientA', [
      //     { offset: 0, color: 'inherit' },
      //     { offset: 100, color: 'inherit', opacity: 0 },
      //   ]),
      // ]}
      // fill={[{ match: '*', id: 'gradientA' }]}
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
};

const styleById = {
  cognac: {
    strokeDasharray: '12, 6',
    strokeWidth: 2,
  },
  vodka: {
    strokeDasharray: '1, 16',
    strokeWidth: 8,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  },
  rhum: {
    strokeDasharray: '6, 6',
    strokeWidth: 4,
  },
  default: {
    strokeWidth: 0,
  },
};

const Line = ({ series, lineGenerator, xScale, yScale }) => {
  return series.map(({ id, data, color }) => (
    <path
      key={id}
      d={lineGenerator(
        data.map(d => ({
          x: xScale(d.data.x),
          y: yScale(d.data.y),
        })),
      )}
      fill="none"
      stroke={color}
      style={styleById[id] || styleById.default}
    />
  ));
};
