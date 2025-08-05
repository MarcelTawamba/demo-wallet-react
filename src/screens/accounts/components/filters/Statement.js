import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

import { View } from 'components/layout/View';
import ButtonList from 'components/lists/ButtonList';
import PageTitle from 'components/layout/page/PageTitle';
import StatementList from './StatementList';
import { searchToObj } from 'util/general';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useCreateStatement } from 'hooks/statementAPI';
import DatePickerWrapper from 'components/pickers/DatePickerWrapper';
import Text from 'components/outputs/Text';
import Selector from 'components/inputs/Selector';

const DATE_RANGES = {
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth',
  LAST_90_DAYS: 'last90Days',
  CUSTOM: 'custom'
};

const Statement = ({ search, currency: wallet, clearAndApply, onClose }) => {
  const [state, setState] = useState('');
  const [startDate, setStartDate] = useState(moment().startOf('month').toDate());
  const [endDate, setEndDate] = useState(new Date());
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(DATE_RANGES.CUSTOM);
  const classes = useStyles();
  
  // Get account info directly from the Redux store
  const activeAccount = useSelector(state => state.accounts?.active);
  const activeCurrencyCode = useSelector(state => state.accounts?.currencies?.active);
  
  // Clear error when inputs change
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [startDate, endDate, email, wallet]);
  
  // Check if wallet is missing account reference
  useEffect(() => {
    if (wallet && !wallet.account && !wallet.reference && !wallet.id && 
        !(wallet.currency && wallet.currency.account)) {
      console.warn('Statement: wallet missing account reference properties');
    }
  }, [wallet]);
  
  const createStatementMutation = useCreateStatement();

  const createNewStatement = async () => {
    try {
      setError('');
      
      // Simplified account reference detection
      // The wallet prop should already have a valid account reference from StatementWithAccount
      const accountReference = wallet?.account || wallet?.reference;
      
      // Ensure we have an account reference
      if (!accountReference) {
        const errorMsg = 'Could not determine account reference. Please try again later.';
        console.error('Missing account reference for statement creation', { 
          wallet: wallet ? JSON.stringify({ 
            hasAccount: !!wallet.account,
            hasReference: !!wallet.reference
          }) : 'null'
        });
        setError(errorMsg);
        return;
      }
            
      const data = {
        account: accountReference,
        timezone,
        start_date: startDate ? moment(startDate).valueOf() : null,
        end_date: endDate ? moment(endDate).valueOf() : null,
        email: email,
      };

      await createStatementMutation.mutateAsync(data);
      setState('');
    } catch (error) {
      console.error('Failed to create statement:', error);
      setError(error.message || 'Failed to create statement. Please try again.');
    }
  };

  // Get list of all timezones
  const timezones = moment.tz.names();

  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    // Apply date range based on selection
    switch(range) {
      case DATE_RANGES.THIS_MONTH:
        setStartDate(moment().startOf('month').toDate());
        setEndDate(new Date());
        break;
      case DATE_RANGES.LAST_MONTH:
        setStartDate(moment().subtract(1, 'month').startOf('month').toDate());
        setEndDate(moment().subtract(1, 'month').endOf('month').toDate());
        break;
      case DATE_RANGES.LAST_90_DAYS:
        setStartDate(moment().subtract(90, 'days').toDate());
        setEndDate(new Date());
        break;
      case DATE_RANGES.CUSTOM:
        // Keep current dates
        break;
      default:
        break;
    }
  };

  // Handle date changes and update to custom range
  const handleDateChange = (setter) => (date) => {
    setter(date);
    setDateRange(DATE_RANGES.CUSTOM);
  };

  return (
    <View>
      <PageTitle titleVariant={'h6'} titleId="statements" />
      {state === 'new' ? (
        <View w={'100%'}>
          <View ph={1.5} w={'100%'} className={classes.formContainer}>
            <Selector
              label="date_range"
              items={[
                { value: DATE_RANGES.CUSTOM, label: 'custom_range' },
                { value: DATE_RANGES.THIS_MONTH, label: 'this_month' },
                { value: DATE_RANGES.LAST_MONTH, label: 'last_month' },
                { value: DATE_RANGES.LAST_90_DAYS, label: 'last_90_days' },
              ]}
              value={dateRange}
              onValueChange={handleDateRangeChange}
              variant="outlined"
            />
            
            <View className={classes.datePickersContainer}>
              <DatePickerWrapper
                label="Start Date"
                value={startDate}
                onChange={handleDateChange(setStartDate)}
                format="DD/MM/YYYY"
                inputVariant="outlined"
                fullWidth
                margin="dense"
                maxDate={endDate || new Date()}
                disabled={dateRange !== DATE_RANGES.CUSTOM}
              />
              <DatePickerWrapper
                label="End Date"
                value={endDate}
                onChange={handleDateChange(setEndDate)}
                format="DD/MM/YYYY"
                inputVariant="outlined"
                fullWidth
                margin="dense"
                minDate={startDate}
                maxDate={new Date()}
                disabled={dateRange !== DATE_RANGES.CUSTOM}
              />
            </View>

            <TextField
              select
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              SelectProps={{
                native: true,
              }}>
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </TextField>
            
            {error && (
              <View mt={1}>
                <Text color="error" variant="caption">
                  {error}
                </Text>
              </View>
            )}
          </View>
          <View w={'100%'} aI={'flex-end'}>
            <ButtonList
              items={[
                {
                  id: 'cancel',
                  capitalize: true,
                  variant: 'text',
                  onPress: () => setState(''),
                },
                {
                  id: 'create_statement',
                  capitalize: true,
                  color: 'primary',
                  loading: createStatementMutation.isLoading,
                  variant: 'text',
                  onPress: createNewStatement,
                },
              ]}
              layout={'material'}
            />
          </View>
        </View>
      ) : (
        <React.Fragment>
          <StatementList wallet={wallet} />
          <View w={'100%'} aI={'flex-end'}>
            <ButtonList
              items={[
                {
                  id: 'new_statement',
                  capitalize: true,
                  color: 'primary',
                  variant: 'text',
                  onPress: () => setState('new'),
                },
              ]}
              layout={'material'}
            />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  datePickersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default Statement; 