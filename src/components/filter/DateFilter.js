import React, { useState, useEffect } from 'react';
import Selector from 'components/inputs/Selector';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';

import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { dateFilterMap, parseFilters } from 'util/filters';
import { useHistory } from 'react-router-dom';
import { searchToObj } from 'util/general';

const DateFilter = props => {
  const { label, options, id, profile } = props;

  const history = useHistory();
  const search = history?.location?.search;
  const filters = searchToObj(search);

  // const urlValues = parseFilters(filters, 'date');
  const urlValues = parseFilters(filters, id);

  const [type, setType] = useState(urlValues?.type ?? options?.[0]?.value);
  const [value, setValue] = useState(
    urlValues?.value ? parseInt(urlValues?.value) : new Date(),
  );
  const [value2, setValue2] = useState(
    urlValues?.value2 ? parseInt(urlValues?.value2) : new Date(),
  );

  useEffect(() => {
    const filterBy = id?.includes('update')
      ? 'updated'
      : id?.includes('placed')
      ? 'placed'
      : 'created';
    props.setValue(
      dateFilterMap({
        type,
        value,
        value2,
        profile,
        filterBy,
      }),
    );
  }, [type, value, value2]);

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Selector
        label={label}
        items={options}
        value={type}
        onValueChange={value => setType(value)}
      />
      <div className={classes.inputs}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            margin="dense"
            classes={{ root: classes.datePicker }}
            format="DD/MM/YYYY"
            placeholder={'DD/MM/YYYY'}
            value={value}
            onChange={value => setValue(value.valueOf())}
          />
          {type === 'between' && (
            <React.Fragment>
              <Text
                width={'auto'}
                style={{ paddingLeft: 8, paddingRight: 8, paddingBottom: 8 }}>
                to
              </Text>
              <DatePicker
                margin="dense"
                classes={{ root: classes.datePicker }}
                format="DD/MM/YYYY"
                value={value2}
                placeholder={'DD/MM/YYYY'}
                onChange={value => setValue2(value.valueOf())}
              />
            </React.Fragment>
          )}
        </MuiPickersUtilsProvider>
      </div>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // textTransform: 'none',
    paddingTop: 0,
    padding: theme.spacing(1),
  },
  inputs: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
  },
  datePicker: {
    width: '100%',
    marginTop: 0,
  },
}));

export default DateFilter;
