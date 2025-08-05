import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SimpleSelect from '@material-ui/core/Select';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import {
  formatDivisibility,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';
import AccountIcon from 'screens/accounts/components/account/AccountIcon';
import { useTranslation } from 'react-i18next';
import { useConversion } from 'util/rates';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // height: 64,
    width: ({ width }) => (width ? width : '100%'),
  },
  formControl: {
    marginTop: ({ dense }) => theme.spacing(dense ? 0 : 1),
    marginBottom: ({ dense }) => theme.spacing(dense ? 0 : 1),
    minWidth: ({ minWidth }) => (minWidth ? minWidth : 0),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2.5),
  },
  select: {
    marginTop: theme.spacing(0.5),
  },
  label: {
    backgroundColor: 'white',
    textTransform: 'capitalize',
    zIndex: 100,
    paddingLeft: ({ variant }) =>
      variant === 'outlined' ? theme.spacing(0.5) : 0,
    paddingRight: theme.spacing(0),
    top: ({ variant }) => (variant === 'outlined' ? -theme.spacing(0.5) : 0),
    left: ({ variant }) => (variant === 'outlined' ? theme.spacing(1) : 0),
    transform: 'translate(0, 0)',
    fontSize: 17,
  },
  accountTitle: { textTransform: 'uppercase', marginLeft: 8 },
}));

const AccountSelector = props => {
  const {
    label,
    items,
    selectedCurrency,
    onValueChange,
    helper,
    emptyListMessage = 'no_options',
    variant,
    style,
    valueBold,
    align = 'left',
    disabled,
    rates,
    conversionRate,
  } = props;
  const { t } = useTranslation(['common']);

  const availableBalance = formatDivisibility(
    selectedCurrency.available_balance,
    selectedCurrency.currency.divisibility,
  );
  const { convAvailableString } = useConversion(
    availableBalance,
    rates,
    selectedCurrency.currency,
  );

  const classes = useStyles(props);
  if (!selectedCurrency) {
    // TODO: remove this with better error handling
    return null;
  }

  return (
    <div className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        {label && (
          <InputLabel htmlFor="age-simple" shrink className={classes.label}>
            {t(label)}
          </InputLabel>
        )}
        {items && items.length > 0 ? (
          <SimpleSelect
            style={{
              border: '1px solid #efefef',
              borderRadius: 12,
              marginTop: 24,
              ...style,
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: 'center',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }}
            className={variant === 'outlined' ? classes.select : ''}
            margin={variant === 'outlined' ? 'dense' : 'none'}
            variant={variant}
            disabled={items.length === 1 || disabled}
            disableUnderline
            value={selectedCurrency.account}
            renderValue={value => {
              if (selectedCurrency) {
                return (
                  <View style={{ padding: '6px 16px' }}>
                    <View fD="row" aI="center">
                      <AccountIcon
                        icon={selectedCurrency?.account_name}
                        size={14}
                      />
                      <Text className={classes.accountTitle}>
                        {selectedCurrency?.account_name}
                      </Text>
                    </View>
                    <Text s={18} bold style={{ margin: '6px 0' }} c="primary">
                      {convAvailableString}
                    </Text>
                    <Text s={14} c="#a9a9a9">
                      {`${availableBalance} ${getCurrencyCode(
                        selectedCurrency.currency,
                      )}`}
                    </Text>
                  </View>
                );
              } else if (value && !value.code) {
                return (
                  <Text align={align} bold={valueBold} id="not_selected" />
                );
              }
              return '';
            }}
            onChange={event => onValueChange(event.target.value)}>
            {items.map(
              item =>
                item && (
                  <MenuItem key={item.account} value={item.account}>
                    <CardItem item={item} rates={rates} classes={classes} />
                  </MenuItem>
                ),
            )}
          </SimpleSelect>
        ) : (
          <Text
            id={emptyListMessage}
            opacity={0.67}
            className={classes.selectEmpty}
          />
        )}
        {helper && <FormHelperText>{helper}</FormHelperText>}
      </FormControl>
    </div>
  );
};

function CardItem({ item, rates, classes }) {
  const availableBalance = formatDivisibility(
    item.available_balance,
    item.currency.divisibility,
  );
  const { convAvailableString } = useConversion(
    availableBalance,
    rates,
    item.currency,
  );

  return (
    <>
      {/* {item?.label ?? standardizeString(item.value)} */}
      <View fD="row" aI="center" jC="space-between" w="100%" pv={0.25}>
        <View fD="row" aI="center">
          <AccountIcon icon={item?.account_name} size={14} />
          <Text className={classes.accountTitle} bold>
            {item?.account_name}
          </Text>
        </View>
        <Text tA="right" bold>
          {item.currency.code === 'USD'
            ? `${displayFormatDivisibility(
                item.available_balance,
                item.currency.divisibility,
              )} ${getCurrencyCode(item.currency)}`
            : convAvailableString}
        </Text>
      </View>
    </>
  );
}

export default AccountSelector;
