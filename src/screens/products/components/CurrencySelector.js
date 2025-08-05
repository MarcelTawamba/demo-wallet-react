import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTheme } from 'components/app/context';
import { getCurrencyCode } from 'util/general';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import Text from 'components/outputs/Text';

export default function CurrencySelector(props) {
  const { data, currency, handleChange, renderDetailValue } = props;

  const { colors } = useTheme();
  return (
    <FormControl>
      <Select
        disableUnderline
        value={currency}
        style={{
          fontSize: 16,
          fontWeight: '500',
          color: colors.font,
          width: '100%',
          margin: 0,
          padding: 0,
        }}
        onChange={e => handleChange(e.target.value)}
        displayEmpty
        renderValue={val => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <CurrencyBadge
              text={getCurrencyCode(val)}
              radius={10}
              maxLength={1}
            />
            {getCurrencyCode(val)}
          </div>
        )}
        name="currency">
        {data.map((curr, ind) => (
          <MenuItem key={ind} value={curr.currency}>
            {renderDetailValue
              ? renderDetailValue(curr)
              : getCurrencyCode(curr.currency) +
                ' (' +
                curr.account_name +
                ') ' +
                curr.balance}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
