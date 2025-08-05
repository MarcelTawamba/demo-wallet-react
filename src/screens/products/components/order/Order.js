import React, { useState } from 'react';
import { useTheme as useThemeMui } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Pipe from 'components/outputs/Pipe';
import IconLabelButton from 'components/inputs/IconLabelButton';
import Image from 'components/outputs/Image';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import moment from 'moment';
import { standardizeString, formatAmountString } from 'util/general';
import OrderItems from './OrderItems';

export default function Order(props) {
  const {
    item: {
      id,
      status,
      items,
      requires_shipping_address,
      requires_billing_address,
      shipping_address,
      billing_address,
      total_price,
      currency,
      created,
    },
    setState,
  } = props;

  const [orderState, setOrderState] = useState('order');

  const theme = useThemeMui();
  const breakpointMD = useMediaQuery(theme.breakpoints.down(768));

  function renderOrder() {
    const columns = [
      {
        label: 'order_summary',
        value: true,
        component: () => (
          <View grid gap={0.75} w={'100%'}>
            <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
              <Text
                s={14}
                id="orderCount_items"
                context={{ orderCount: items?.length }}
              />
              <Button
                variant={'link'}
                fontSize={14}
                color={'primary'}
                textStyle={{ fontWeight: 700 }}
                onPress={() => setOrderState('items')}
                id="view_details"
              />
            </View>
            <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
              <Text s={14} id="subtotal" />
              <Text s={14} tA={'right'}>
                0.00
              </Text>
            </View>
            {requires_shipping_address && (
              <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
                <Text s={14} id="shipping_fee" />
                <Text s={14} tA={'right'}>
                  0.00
                </Text>
              </View>
            )}
            <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
              <Text s={14} id="discount" />
              <Text s={14} tA={'right'}>
                0.00
              </Text>
            </View>
            <View fD={'row'} aI={'center'} jC={'space-between'} w={'100%'}>
              <Text s={14} fontWeight={700} id="total" />
              <Text s={14} tA={'right'} fontWeight={700}>
                {formatAmountString(total_price, currency, true)}
              </Text>
            </View>
          </View>
        ),
      },
      {
        label: 'shipping_address',
        value:
          requires_shipping_address && typeof shipping_address === 'string',
        component: () => (
          <View grid gap={0.75}>
            {shipping_address?.split(',')?.map(x => (
              <Text s={14}>{x}</Text>
            ))}
          </View>
        ),
      },
      {
        label: 'billing_address',
        value: requires_billing_address && typeof billing_address === 'string',
        component: () => (
          <View grid gap={0.75}>
            {billing_address?.split(',')?.map(x => (
              <Text s={14}>{x}</Text>
            ))}
          </View>
        ),
      },
    ];

    return (
      <View w={'100%'} grid gap={1.5}>
        {breakpointMD && (
          <View>
            <Text s={14}>{moment(created).format('MMMM DD YYYY, HH:mm')}</Text>
            <Text s={14} bold id="order_with_id" context={{ id }} />
          </View>
        )}
        <View fD={'row'} aI={'center'}>
          {items?.map(x => (
            <View mr={1}>
              {x.image ? (
                <Image src={x.image} width={70} height={70} />
              ) : (
                <PlaceholderImage name="product" height={70} width={70} />
              )}
            </View>
          ))}
        </View>
        <View grid={!breakpointMD} columns={columns?.length} gap={4} w={'100%'}>
          {columns
            ?.filter(x => x.value)
            ?.map(column => (
              <View w={'100%'} grid gap={0.5}>
                <Text s={14} fontWeight={700} id={column.label} />
                {column.component()}
              </View>
            ))}
        </View>
      </View>
    );
  }

  function renderOrderItems() {
    return <OrderItems {...{ items, currency }} />;
  }

  return (
    <View bC={'#FAFBFC'} w={'100%'} p={1} ph={2} grid gap={1}>
      <View fD={'row'} jC={'space-between'} aI={'center'} w={'100%'}>
        <Pipe>
          <IconLabelButton
            size={20}
            label={!breakpointMD && `Order # ${id}`}
            color="primary"
            textProps={{ fontWeight: 500, s: 14 }}
            onPress={() =>
              orderState === 'order' ? setState('list') : setOrderState('order')
            }
          />
          {!breakpointMD && (
            <Text s={14}>{moment(created).format('MMMM DD YYYY, HH:mm')}</Text>
          )}
        </Pipe>
        <Text
          s={14}
          tA={'right'}
          fontWeight={700}
          myColor={'primary'}
          width={'fit-content'}>
          {standardizeString(status)}
        </Text>
      </View>
      {orderState === 'order' ? renderOrder() : renderOrderItems()}
    </View>
  );
}
