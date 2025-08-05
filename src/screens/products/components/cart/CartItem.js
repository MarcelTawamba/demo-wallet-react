import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { formatAmountString } from 'util/general';
import { formatVariantsString } from 'util/products';
import Image from 'components/common/outputs/Image';
import Skeleton from '@material-ui/lab/Skeleton';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import { Button } from 'components/inputs/Button';
import QuantityEdit from './QuantityEdit';
import { makeStyles } from '@material-ui/styles';

export default function CartItem(props) {
  const { item, currency, removeFromCart, noEdit, loadingItem } = props;
  const { name, total_price, price, id, variant, image } = item;

  const priceString = formatAmountString(price ?? total_price, currency, true);
  const isLoading = loadingItem === id;

  const size = 120;

  const classes = useStyles();

  function handleRemove() {
    removeFromCart(item?.id, item?.id);
  }

  return (
    <View fD="row" w={'100%'} h={'100%'} aI={'center'}>
      <View style={{ position: 'relative' }} fD={'row'} flexGrow={1} h={size}>
        <Skeleton variant="square" width={size} height={size} />
        <View style={{ position: 'absolute' }}>
          {image ? (
            <Image
              src={image}
              style={{
                minHeight: size,
                objectFit: 'cover',
              }}
              imageClassName={classes.imageStyle}
            />
          ) : (
            <View bC="white" className={classes.imageStyle}>
              <PlaceholderImage name="product" height={size} width={size} />
            </View>
          )}
        </View>

        <View h={'100%'} mh={1}>
          <View style={{ flex: 1, display: 'flex' }}>
            <Text style={{ fontSize: 18 }}>{name}</Text>
            {Boolean(variant) && (
              <View mt={0.25}>
                <Text myColor={'grey4'} style={{ fontSize: 14 }}>
                  {variant.label
                    ? variant.label
                    : formatVariantsString(variant.options)}
                </Text>
              </View>
            )}
            <View mt={0.25}>
              <Text style={{ fontSize: 18 }} fontWeight={'700'}>
                {priceString}
              </Text>
            </View>
          </View>
          {!noEdit && (
            <Button
              variant="link"
              id="remove"
              color="primary"
              fontSize={14}
              style={{ fontWeight: 400 }}
              onPress={handleRemove}
            />
          )}
        </View>
      </View>
      {!noEdit && <QuantityEdit {...props} loading={isLoading} />}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  imageStyle: {
    height: '120px !important',
    width: '120px !important',
    [theme.breakpoints.down(666)]: {
      width: '104px !important',
    },
    [theme.breakpoints.down(680)]: {
      width: '110px !important',
    },
  },
}));
