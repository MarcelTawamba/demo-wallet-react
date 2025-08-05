import React, { useState } from 'react';
import moment from 'moment';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Chip from '@material-ui/core/Chip';

import { getName } from 'country-list';
import { standardizeString, formatTime, objectToArray } from 'util/general';
import Text from 'components/outputs/Text';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { TIMES } from 'util/date';
import DropdownSelector from 'components/inputs/DropdownSelector';

export default function StartDateFilterBarOption(props) {
  const {
    label,
    override,
    initial,
    onClick,
    id,
    search,
    initialFilters: filters,
    context = {},
  } = props;
  const { profile } = context;
  const {
    endDateInterval,
    setEndDateInterval,
    setStartDate,
    endDate,
  } = filters;
  const value = filters?.[id]; // formatValue(filters, id, filterConfig);
  const active =
    Boolean(value) ||
    search === '?' + override ||
    (typeof override === 'string' && override === search);
  const classes = useStyles({ active });
  const chipProps = active ? { color: 'primary' } : {};

  const [currentDate, setCurrentDate] = useState(new Date().getTime());
  // let label = '';
  // if

  function handleStartDateChange(value) {
    setStartDate(value);
    setEndDateInterval('');
  }
  function handleEndDateIntervalChange(value) {
    setEndDateInterval(value);
    setStartDate(endDate - TIMES[value]);
  }

  return (
    <div className={classes.container}>
      <Text bold width="auto">
        From
      </Text>
      {/* <DropdownSelector
        noCard
        item={filters?.endDateInterval}
        data={['day', 'week', 'month', 'year']}
        className={classes.icon}
      /> */}

      {/* <KeyboardArrowDownIcon className={classes.icon} /> */}
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          margin="dense"
          classes={{ root: classes.datePicker }}
          format="DD/MM/YYYY"
          placeholder={'DD/MM/YYYY'}
          maxDate={new Date()}
          value={value}
          showTodayButton
          onChange={handleStartDateChange}
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.datePicker },
          }}
        />
      </MuiPickersUtilsProvider>

      <Text bold width="auto">
        to
      </Text>
      <DropdownSelector
        noCard
        popUp
        paddedItem
        item={endDateInterval}
        data={[
          { label: 'yesterday', value: 'day' },
          { label: 'Last 7 days', value: 'week' },
          { label: 'Last 4 weeks', value: 'month' },
          { label: 'Last 12 months', value: 'year' },
        ]}
        className={classes.icon}
        onValueChange={handleEndDateIntervalChange}
      />
      {/* <Text className={classes.value}>
        {formatTime(value, 'DD MMM YYYY', profile)}
      </Text> */}
    </div>
  );

  // return (
  //   <Chip
  //     label={
  //       (label ? label : standardizeString(id)) + (value ? ': ' + value : '')
  //     }
  //     clickable
  //     variant={'outlined'}
  //     className={classes.chip}
  //     classes={{ outlined: classes.outlined }}
  //     {...chipProps}
  //     // icon={<ChevronDownIcon />}
  //     onClick={onClick}
  //     onDelete={value ? onDelete : null}
  //   />
  // );
}

const useStyles = makeStyles(theme => ({
  container: {
    // fontSize: theme.typography.pxToRem(10),
    // margin: theme.spacing(0.5),
    // marginRight: theme.spacing(1),
    // marginLeft: theme.spacing(1),
    // padding: 0,
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    // marginLeft: 0,
    // justifyContent: 'center',
    // fontSize: 12,
    width: '100%',
    // cursor: 'pointer',

    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    alignItems: 'center',
  },
  datePicker: {
    width: 110,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    // borderRight: '1px solid #EFEFEF',
  },
  icon: {
    paddingLeft: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
  },
  value: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    // borderRight: '1px solid #EFEFEF',
  },
  // label: { lineHeight: 0.8, paddingLeft: 6 },
  // icon: { fontSize: 14, marginRight: 2 },
}));

const formatValue = (filters, filter, filterConfig) => {
  if (!filters[filter]) {
    return '';
  }
  const { value } = filters[filter];

  switch (filter) {
    case 'date':
      switch (value.type) {
        case 'more':
          return 'after ' + moment(value.value).format('YYYY/MM/DD');
        case 'less':
          return 'before ' + moment(value.value).format('YYYY/MM/DD');
        case 'between':
          return (
            moment(value.value).format('YYYY/MM/DD') +
            ' - ' +
            moment(value.value2).format('YYYY/MM/DD')
          );
        default:
          return moment(value.value).format('YYYY/MM/DD');
      }
    case 'quantity':
    case 'total_price':
    case 'amount':
      switch (value.type) {
        case 'more':
          return 'more than ' + value.value;
        case 'less':
          return 'less than ' + value.value;
        case 'between':
          return value.value + ' - ' + value.value2;
        default:
          return value.value;
      }
    case 'categories':
      return value.map((item, index) => (index > 0 ? ' ' : '') + item.name);
    case 'countries':
      return value.map((item, index) => getName(item));
    case 'enabled':
      const config = get(filterConfig, [filter, 'config'], {
        trueLabel: 'Yes',
        falseLabel: 'No',
      });
      const { trueLabel, falseLabel } = config;
      return value ? trueLabel : falseLabel;

    default:
      return value;
  }
};
