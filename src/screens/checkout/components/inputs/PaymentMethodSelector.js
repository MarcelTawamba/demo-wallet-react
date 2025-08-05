import React from 'react';
import { SimpleImg } from 'react-simple-img';

import { paymentMethod } from '../../config/inputs';
import { Controller } from 'react-hook-form';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from 'components/outputs/Icon';
import Text from 'components/outputs/Text';
import { Box } from '@material-ui/core';
import { standardizeString } from 'util/general';
import useI18Language from 'hooks/useI18Language';

export function hasProcessorType(invoice, name) {
  const { available_payment_processors: processors = [] } = invoice;

  return processors.findIndex(item => item.unique_string_name === name) !== -1;
}

export function isProcessorType(invoice, type) {
  const { available_payment_processors: processors = [] } = invoice;

  return processors.findIndex(item => item.type === type) !== -1;
}

export function getAllCustomProcessors(invoice) {
  const { available_payment_processors: processors = [] } = invoice;

  let temp_custom_processors = []
  for (let i = 0; i < processors.length; i++) {
    if (!processors[i].unique_string_name.includes('native')) {
      temp_custom_processors.push(processors[i])
    }
  }
  return temp_custom_processors;
}

export default function PaymentMethodSelector(props) {
  const { context = {}, control } = props;
  const { label, name, id } = paymentMethod;
  const { invoice = {} } = context;
  const { getI18Translation } = useI18Language();

  let options = [];

  const hasBitcoin = hasProcessorType(invoice, 'native_bitcoin');
  if (hasBitcoin) {
    options.push({
      id: 'native_bitcoin',
      icon: 'XBT',
      label: 'Pay with Bitcoin',
    });
  }
  const hasBitcoinTestnet = hasProcessorType(invoice, 'native_bitcoin_testnet');
  if (hasBitcoinTestnet) {
    options.push({
      id: 'native_bitcoin_testnet',
      icon: 'XBT',
      label: 'Pay with Bitcoin (testnet)',
    });
  }
  const hasStellar = hasProcessorType(invoice, 'native_stellar');
  if (hasStellar) {
    options.push({
      id: 'native_stellar',
      icon: 'XLM',
      label: 'Pay with Stellar',
    });
  }
  const hasStellarTestnet = hasProcessorType(invoice, 'native_stellar_testnet');
  if (hasStellarTestnet) {
    options.push({
      id: 'native_stellar_testnet',
      icon: 'XLM',
      label: 'Pay with Stellar (testnet)',
    });
  }
  const hasNative = hasProcessorType(invoice, 'native');
  if (hasNative) {
    options.push({
      id: 'native',
      icon: props => props?.context?.company?.icon ?? 'wallet',
      iconVariant: props => (props?.context?.company?.icon ? 'image' : 'icon'),
      label: props =>
        'Pay with ' + (props?.context?.company?.name ?? '') + ' wallet',
    });
  }
  // Handle custom processors
  let custom_processors = getAllCustomProcessors(invoice);
  for (let i = 0; i < custom_processors.length; i++) {
    const processor = custom_processors[i];
    let defaultIcon = 'cash';
    if (processor.type === 'crypto') {
      defaultIcon = 'bitcoin';
    } else if (processor.type === 'bank') {
      defaultIcon = 'bank';
    }
    
    options.push({
      id: processor.unique_string_name,
      icon: processor.logo ?? defaultIcon,
      iconVariant: processor.logo ? 'image' : 'icon',
      label: processor.selector_description,
    });
  }

  const labelText = label
    ? typeof label === 'function'
      ? label(props)
      : getI18Translation(label)
    : standardizeString(id);

  return (
    <Box pb={1}>
      <FormControl id={name} variant="outlined" fullWidth {...paymentMethod}>
        <InputLabel id={name}>{labelText}</InputLabel>
        <Controller
          {...paymentMethod}
          control={control}
          render={({ field }) => (
            <Select
              id={name}
              labelId={name}
              margin="dense"
              fullWidth
              value={field.value}
              onChange={field.onChange}
              {...paymentMethod}>
              {options.map(item => (
                <MenuItem
                  key={item?.id ?? item}
                  value={item?.id ?? item}
                  button>
                  <PaymentMethodOption
                    {...props}
                    id={item?.id ?? item}
                    item={item}
                  />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </Box>
  );
}

function PaymentMethodOption(props) {
  const { item = '' } = props;
  const { id, label, icon, iconVariant } = item;
  // console.log('PaymentMethodOption -> item', item);

  const labelText = label
    ? typeof label === 'function'
      ? label(props)
      : label
    : standardizeString(id);

  const iconSrc = icon ? (typeof icon === 'function' ? icon(props) : icon) : id;

  const iconVariantValue = iconVariant
    ? typeof iconVariant === 'function'
      ? iconVariant(props)
      : iconVariant
    : 'icon';

  return (
    <Box flexDirection="row" alignItems="center" display="flex">
      {iconVariantValue === 'image' ? (
        <SimpleImg
          height={24}
          width={24}
          src={iconSrc}
          style={{
            borderRadius: 100,
            marginRight: 12,
            maxWidth: 24,
            maxHeight: 24,
          }}
          imgStyle={{
            objectFit: 'cover',
            height: '100%',
          }}
        />
      ) : (
        <Icon 
          icon={iconSrc} 
          size={iconSrc === 'XBT' || iconSrc === 'XLM' ? 24 : 12} 
          inverted={iconSrc === 'XBT' || iconSrc === 'XLM'}
          style={{ marginRight: 8 }} 
        />
      )}
      <Text myColor="#222222">{labelText}</Text>
    </Box>
  );
}
