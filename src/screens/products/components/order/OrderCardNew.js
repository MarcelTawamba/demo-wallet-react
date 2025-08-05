import React from 'react';
import moment from 'moment';
import { useTheme as useThemeMui } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import {
  displayFormatDivisibility,
  standardizeString,
  getCurrencyCode,
} from 'util/general';
import { getOrder } from 'util/rehive';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useQuery } from 'react-query';
import Skeleton from '@material-ui/lab/Skeleton';
import Image from 'components/outputs/Image';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import Text from 'components/outputs/Text';

export default function OrderCard(props) {
  const {
    profile,
    item: { id, total_price, currency, placed, created, status } = {},
    onPress,
    loading: fetchingItems,
  } = props;

  const theme = useThemeMui();
  const breakpointXS = useMediaQuery(theme.breakpoints.down(470));

  const queryOrder = useQuery(['orders', profile?.id, id], () => getOrder(id), {
    enabled: !!id,
  });

  const order = queryOrder?.data?.data;

  const priceString =
    (total_price
      ? displayFormatDivisibility(total_price, currency.divisibility)
      : 'N/A'
    ).toString() +
    ' ' +
    getCurrencyCode(currency);

  function renderContent() {
    return (
      <View bC={'#FAFBFC'} w={'100%'} p={1} ph={1.5} grid gap={1}>
        <Text s={14} myColor={'fontLight'}>
          {moment(placed ?? created).format('MMMM DD YYYY HH:mm')}
        </Text>
        <View
          aI={'center'}
          grid
          gap={1}
          columns={breakpointXS ? 4 : 5}
          w={'100%'}>
          {order?.items?.find(x => x.image) ? (
            <Image
              src={order?.items?.find(x => x.image)?.image}
              width={70}
              height={70}
            />
          ) : (
            <PlaceholderImage name="product" height={70} width={70} />
          )}
          <Text s={14} style={{ display: breakpointXS ? 'none' : 'block' }}>
            {order?.items?.length} item{order?.items?.length === 1 ? '' : 's'}
          </Text>
          <Text s={14}>{priceString}</Text>
          <Text s={14} fontWeight={'bold'}>
            {standardizeString(status)}
          </Text>
          <Button
            variant={'link'}
            fontSize={14}
            color={'primary'}
            onPress={() => onPress(order)}
            noHover
            id="order_details"
          />
        </View>
      </View>
    );
  }

  function renderSkeleton() {
    const length = breakpointXS ? 50 : 100;

    return (
      <View
        bC={'#FAFBFC'}
        w={'100%'}
        p={1}
        ph={1.5}
        grid
        gap={1}
        columns={breakpointXS ? 4 : 5}
        aI={'center'}>
        <Skeleton height={70} width={70} variant={'rect'} />
        {!breakpointXS && <Skeleton height={10} width={100} variant={'rect'} />}
        <Skeleton height={10} width={length} variant={'rect'} />
        <Skeleton height={10} width={length} variant={'rect'} />
        <Skeleton height={10} width={length} variant={'rect'} />
      </View>
    );
  }

  return fetchingItems || queryOrder?.isLoading
    ? renderSkeleton()
    : renderContent();
}
