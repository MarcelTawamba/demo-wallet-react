import React from 'react';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import FilterChip from './FilterChip';
import { getName } from 'country-list';
import { makeStyles } from '@material-ui/styles';

const FilterChipList = props => {
  const classes = useStyles();
  const { filters, filterConfig, clearAndApply } = props;

  const active = Object.keys(filters)
    .map(filter => filters[filter].active)
    .includes(true);

  if (active) {
    return (
      <div className={classes.container}>
        {Object.keys(filters).map(
          filter =>
            filters[filter].active && (
              <FilterChip
                key={filter}
                label={
                  filterConfig[filter].label +
                  ': ' +
                  formatValue(filters, filter)
                }
                onDelete={() => clearAndApply(filter)}
              />
            ),
        )}
      </div>
    );
  }
  return null;
};

const useStyles = makeStyles(theme => ({
  container: {
    height: 30,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

export default FilterChipList;

const formatValue = (filters, filter) => {
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
    case 'category':
      return value.map((item, index) => (index > 0 ? ' ' : '') + item.name);
    case 'countries':
      return value.map((item, index) => getName(item));

    default:
      return value;
  }
};
