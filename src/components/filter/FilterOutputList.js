import React from 'react';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import OutputList from '../lists/OutputList';
import Text from 'components/outputs/Text';

const FilterOutputList = props => {
  const { filters, classes, filterConfig } = props;
  let items = Object.keys(filters).map(
    filter =>
      filters[filter].active && {
        id: filterConfig[filter].label,
        label: filterConfig[filter].label + ': ',
        value: formatValue(filters, filter),
        horizontal: true,
        variant: 'caption',
      },
  );
  items = items.filter(item => item);

  return (
    <div className={classes.container}>
      <Text className={classes.title}>Filters</Text>
      {items.length === 0 ? (
        <Text variant={'caption'}>None</Text>
      ) : (
        <OutputList items={items} />
      )}
    </div>
  );
};

const styles = theme => ({
  container: {
    width: '100%',
    paddingTop: theme.spacing(0.5),
    // paddingRight: theme.spacing(3.5),
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
});

export default withStyles(styles)(FilterOutputList);

const formatValue = (filters, filter) => {
  const { value } = filters[filter];

  switch (filter) {
    case 'tx_type':
    case 'subtype':
    case 'status':
      return value;
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

    default:
      return 'Unknown filter type';
  }
};
