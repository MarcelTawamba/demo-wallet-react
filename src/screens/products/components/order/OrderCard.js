import React, { Component } from 'react';
import moment from 'moment';
import { displayFormatDivisibility, getCurrencyCode } from 'util/general';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import context from 'components/app/context';
// import OrderItemList from './OrderItemList';
import CardActionArea from '@material-ui/core/CardActionArea';
import Card from 'components/card/Card';
import { IconBadge } from 'components/outputs/IconBadge';

class _OrderCard extends Component {
  render() {
    const { item, state, handleStateChange, index, containerIndex, colors } =
      this.props;
    const { id, total_price, currency, placed, status } = item;

    const titleObj = {
      title: moment(placed).format('LL'),
      subtitle: '',
    };

    const priceString =
      (total_price
        ? displayFormatDivisibility(total_price, currency.divisibility)
        : 'N/A'
      ).toString() +
      ' ' +
      getCurrencyCode(currency);

    return (
      <Card>
        <CardActionArea onClick={() => handleStateChange(state, index, true)}>
          <View
            p={1}
            style={{
              backgroundColor:
                index === containerIndex ? colors.grey1 : 'transparent',
            }}
            pl={1.5}
            fD={'row'}
            jC={'space-between'}
            aI={'center'}
            w={'100%'}>
            <IconBadge icon={'product'} size={24} />
            <View jC={'flex-end'} p={0.5}>
              <Text variant="h6" color={'primary'} align={'right'}>
                {titleObj.title}
              </Text>
              <View p={0.125} />
              <Text align={'right'} style={{ fontWeight: 500, fontSize: 15 }}>
                {priceString}
              </Text>
            </View>
          </View>
        </CardActionArea>
      </Card>
    );
  }
}

const OrderCard = context(_OrderCard);

export { OrderCard };
