import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'components/layout/View';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function Date(props) {
  const { t } = useTranslation(['common']);
  const { name, label, value, onChange, style = {}, ...restProps } = props;

  return (
    <View w={'100%'} style={{ ...style }}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          label={t(label)}
          onChange={date =>
            onChange && onChange(moment(date).format('YYYY-MM-DD'))
          }
          value={value}
          margin="dense"
          inputVariant="outlined"
          fullWidth
          id="date-picker-dialog"
          format={'DD/MM/YYYY'}
          views={['year', 'month', 'date']}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          {...restProps}
        />
      </MuiPickersUtilsProvider>
    </View>
  );
}
