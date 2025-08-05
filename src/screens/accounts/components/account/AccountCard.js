import React from 'react';

import CardActionArea from '@material-ui/core/CardActionArea';
import Card from 'components/card/Card';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import AccountIcon from './AccountIcon';
import { addCommas, getCurrencyCode } from 'util/general';
import { useSelector } from 'react-redux';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { calculateAccountTotal } from 'screens/accounts/util/accounts';
import Skeleton from '@material-ui/lab/Skeleton';

const AccountDefinitionCard = props => {
  const { item, onPress } = props;
  const rates = useSelector(conversionRatesSelector);
  const { empty, hasConversion } = rates;

  const title =
    item.metadata && item.metadata.name
      ? item.metadata.name
      : item.label
      ? item.label
      : item.name;

  const totalBalance = calculateAccountTotal(item, rates);

  return (
    <Card data-testid="account-card">
      <CardActionArea onClick={onPress}>
        <View
          p={1}
          style={{ backgroundColor: 'transparent' }}
          fD={'row'}
          jC={'space-between'}
          aI={'center'}
          w={'100%'}>
          <View p={0.5}>
            <AccountIcon icon={title} radius={24} />
          </View>
          <View
            w={'100%'}
            jC={'flex-end'}
            p={0.5}
            style={{
              wordBreak: 'break-word',
            }}>
            {title && (
              <Text align={'right'} style={{ fontWeight: 400, fontSize: 12 }}>
                {title.toUpperCase()}
              </Text>
            )}
            {hasConversion && <View p={0.125} />}
            {hasConversion ? (
              empty ? (
                <View w={'100%'} fD={'row'} jC="flex-end">
                  <Skeleton height={18} width={60} />
                </View>
              ) : totalBalance ? (
                <Text align={'right'} color={'primary'} bold>
                  {addCommas(totalBalance) +
                    ' ' +
                    getCurrencyCode(rates.displayCurrency)}
                </Text>
              ) : null
            ) : null}
          </View>
        </View>
      </CardActionArea>
    </Card>
  );
};

export default AccountDefinitionCard;
