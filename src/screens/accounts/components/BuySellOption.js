import React from 'react';
import { View } from 'components/layout/View';
import { useConversion } from 'util/rates';
import {
  formatDivisibility,
  addCommas,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';
import MuiListItem from '@material-ui/core/ListItem';
import Chip from 'components/inputs/Chip';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';
import Text from 'components/outputs/Text';

export default function BuyOption(props) {
  const {
    history,
    account,
    rates,
    item: { title, description, currency, icon, onPress, disabled, topup },
  } = props;

  const { convAvailable } = useConversion(
    formatDivisibility(
      currency?.available_balance,
      currency?.currency?.divisibility,
    ),
    rates,
    currency?.currency,
  );

  const balance = `${addCommas(
    displayFormatDivisibility(
      currency?.available_balance,
      currency?.currency?.divisibility,
    ),
  )} ${getCurrencyCode(currency?.currency)}`;

  const isRtl = document.dir === 'rtl';

  return (
    <View
      w={'100%'}
      fD={'row'}
      aI={'center'}
      jC={'space-between'}
      data-testid="buy-sell-option-item">
      <MuiListItem button disabled={disabled} onClick={onPress}>
        <View
          fD={'row'}
          aI={'center'}
          jC={'space-between'}
          w={'100%'}
          pv={0.25}
          ph={1}>
          <View fD={'row'} aI={'center'} flexGrow={1}>
            <CurrencyBadge
              text={currency?.currency?.code ?? icon}
              currency={currency?.currency}
              radius={20}
              style={{ padding: 0 }}
            />
            <View jC={'space-between'} ml={isRtl ? 0 : 1} mr={isRtl ? 1 : 0}>
              <div>
                <Text inline bold id={!currency ? title : 'balance'} />
                {': '}
                {currency && (
                  <Text inline bold c={'primary'}>
                    {convAvailable ? convAvailable.replace('~', '') : balance}
                  </Text>
                )}
              </div>
              <Text s={13} c={'grey4'}>
                {currency?.currency?.description ?? description}
              </Text>
            </View>
          </View>
          {topup && !disabled && (
            <Chip
              label={'topup'}
              uppercase
              size={'small'}
              onPress={() =>
                history?.push(
                  `/accounts/${account}/${currency?.currency?.code}/deposit`,
                )
              }
            />
          )}
        </View>
      </MuiListItem>
      {topup && disabled && (
        <View mr={isRtl ? 0 : 2} ml={isRtl ? 2 : 0}>
          <Chip
            label={'topup'}
            uppercase
            size={'small'}
            onPress={() =>
              history?.push(
                `/accounts/${account}/${currency?.currency?.code}/deposit`,
              )
            }
          />
        </View>
      )}
    </View>
  );
}
