import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import Text from 'components/outputs/Text';

import { TIMES } from 'util/date';
import DropdownSelector from 'components/inputs/DropdownSelector';

export default function DateRangeFilter(props) {
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
    setEndDate,
    setStartDate,
    startDate,
    endDate,
  } = filters;

  const value = filters?.[id]; // formatValue(filters, id, filterConfig);
  const active =
    Boolean(value) ||
    search === '?' + override ||
    (typeof override === 'string' && override === search);
  const classes = useStyles({ active });

  function handleStartDateChange(value) {
    setStartDate(value);
    setEndDateInterval('custom');
  }
  function handleEndDateIntervalChange(value = '') {
    setEndDateInterval(value);
    if (value.includes('last')) {
      setEndDate(new Date().setHours(0, 0, 0, 0));
      setStartDate(endDate - TIMES[value.replace('last_', '')]);
    } else {
      setStartDate(endDate - TIMES[value]);
    }
  }

  function handleEndDateChange(value) {
    setEndDate(value.valueOf());
    if (endDateInterval !== 'custom') {
      setStartDate(
        value.valueOf() - TIMES[endDateInterval.replace('last_', '')],
      );
      setEndDateInterval(endDateInterval.replace('last_', ''));
    }
  }

  const intervals = [
    { label: 'Yesterday', value: 'day' },
    { label: 'Last 7 days', value: 'last_week' },
    { label: 'Last 4 weeks', value: 'last_week4' },
    { label: 'Last 12 months', value: 'last_year' },
    { label: 'Previous 7 days', value: 'week' },
    { label: 'Previous 4 weeks', value: 'week4' },
    { label: 'Previous 12 months', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className={classes.container}>
      <DropdownSelector
        noCard
        popUp
        transformOriginHorizontal={8}
        paddedItem
        item={endDateInterval}
        data={intervals}
        className={classes.icon}
        onValueChange={handleEndDateIntervalChange}
      />

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          margin="dense"
          classes={{ root: classes.datePicker }}
          format="DD/MM/YYYY"
          placeholder={'DD/MM/YYYY'}
          maxDate={new Date()}
          value={(isNaN(startDate) && new Date()) || startDate}
          showTodayButton
          onChange={handleStartDateChange}
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.datePicker },
          }}
        />

        <Text bold width="auto">
          -
        </Text>
        <DatePicker
          margin="dense"
          classes={{ root: classes.datePicker }}
          format="DD/MM/YYYY"
          placeholder={'DD/MM/YYYY'}
          maxDate={new Date()}
          value={endDate}
          showTodayButton
          onChange={handleEndDateChange}
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.datePicker },
          }}
        />
      </MuiPickersUtilsProvider>

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
    border: '1px solid #EFEFEF',
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    width: '100%',
    // cursor: 'pointer',
    alignItems: 'center',
  },
  datePicker: {
    width: 110,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingBottom: 0,
    paddingTop: 2,
    margin: 0,
  },
  icon: {
    paddingLeft: theme.spacing(1.5),
    display: 'flex',
    flexDirection: 'row',
    whiteSpace: 'nowrap',
    justifyContent: 'center',
    borderRight: '1px solid #EFEFEF',
  },
  value: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(0.5),
    // borderRight: '1px solid #EFEFEF',
  },
}));
