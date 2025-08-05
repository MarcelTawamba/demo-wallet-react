import React from 'react';
import moment from 'moment';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import { getName } from 'country-list';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { TIMES } from 'util/date';

export default function EndDateFilterBarOption(props) {
  const {
    label,
    override,
    initialFilters: filters,
    onClick,
    id,
    search,
  } = props;
  const { setEndDate, endDateInterval, setStartDate } = filters;
  const value = filters?.[id]; // formatValue(filters, id, filterConfig);
  const active =
    Boolean(value) ||
    search === '?' + override ||
    (typeof override === 'string' && override === search);
  const classes = useStyles({ active });
  const chipProps = active ? { color: 'primary' } : {};

  function handleNewStartDate(value) {
    setEndDate(value.valueOf());
    setStartDate(value.valueOf() - TIMES[endDateInterval]);
  }

  return (
    <div className={classes.container}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          margin="dense"
          classes={{ root: classes.datePicker }}
          format="DD/MM/YYYY"
          placeholder={'DD/MM/YYYY'}
          maxDate={new Date()}
          value={value}
          showTodayButton
          onChange={handleNewStartDate}
          InputProps={{
            disableUnderline: true,
            classes: { root: classes.datePicker },
          }}
        />
      </MuiPickersUtilsProvider>
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
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    whiteSpace: 'nowrap',
    marginLeft: theme.spacing(1),
    // cursor: 'pointer',
    // padding: 0,
    // marginLeft: 0,
    // justifyContent: 'center',
  },
  datePicker: {
    width: 100,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  icon: {
    marginLeft: theme.spacing(2),
    paddingRight: theme.spacing(0.5),
    // borderRight: '1px solid #EFEFEF',
  },
  value: {
    marginLeft: theme.spacing(2),
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
