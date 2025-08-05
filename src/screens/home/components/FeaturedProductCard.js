import React from 'react';
import { useSelector } from 'react-redux';
import Skeleton from '@material-ui/lab/Skeleton';
import Text from 'components/outputs/Text';
import ButtonBase from '@material-ui/core/ButtonBase';
import { View } from 'components/layout/View';
import PlaceholderSvg from 'components/outputs/PlaceholderSvg';
import { displayCurrencySelector } from 'screens/accounts/redux/selectors';
import { formatAmountString } from 'util/general';
import Image from 'components/outputs/Image';

export default function FeaturedProductCard(props) {
  const { id, name, images, prices, options, variants, loading, history } =
    props;

  const displayCurrency = useSelector(displayCurrencySelector);

  const priceObject =
    prices?.find(x => x.currency?.code === displayCurrency?.code) ??
    prices?.[0] ??
    variants?.find(item => item?.prices?.length > 0)?.prices[0];

  const priceString = priceObject?.amount
    ? formatAmountString(priceObject?.amount, priceObject?.currency, true)
    : options?.[0]?.values?.join(' - ');

  const skeleton = (
    <View>
      <Skeleton
        variant="rect"
        width={'100%'}
        height={220}
        style={{ borderRadius: 10 }}
      />
      <View mv={1}>
        <Skeleton
          variant="rect"
          width={150}
          height={15}
          style={{ borderRadius: 5 }}
        />
      </View>
      <Skeleton
        variant="rect"
        width={50}
        height={15}
        style={{ borderRadius: 5 }}
      />
    </View>
  );

  return loading ? (
    skeleton
  ) : (
    <ButtonBase
      onClick={() =>
        history.push(
          `/products/?id=${id}&currency=${priceObject?.currency?.code}`,
        )
      }
      style={{ width: '100%' }}>
      <View w={'100%'} aI={'center'}>
        {images?.length ? (
          <View w={'100%'} bC={'white'} bR={10}>
            <View h={220} w={'100%'}>
              <Image
                src={images?.[0]?.file}
                resizeMode={'cover'}
                width="100%"
                style={{
                  height: 220,
                  width: '100%',
                  borderRadius: 10,
                }}
              />
            </View>
          </View>
        ) : (
          <PlaceholderSvg
            width={242.35}
            name={'productHeader'}
            style={{ borderRadius: 10 }}
          />
        )}
        <View pv={1} style={{ alignSelf: 'self-start' }}>
          <Text tA="left" myColor={'grey4'}>
            {name}
          </Text>
          <Text fontWeight={'500'} myColor={'primary'} tA="left">
            {priceString}
          </Text>
        </View>
      </View>
    </ButtonBase>
  );
}
