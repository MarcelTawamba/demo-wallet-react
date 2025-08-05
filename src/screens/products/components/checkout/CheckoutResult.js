import React, { useMemo, Component } from 'react';
import Modal from 'components/layout/Modal';
import { useSelector } from 'react-redux';
import { sum } from 'lodash';
import { View } from 'components/layout/View';
import { useConversion } from 'util/rates';
import ButtonList from 'components/lists/ButtonList';
import { formatAmountString } from 'util/general';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import Image from 'components/outputs/Image';
import LottieImage from 'components/outputs/LottieImage';
import Text from 'components/outputs/Text';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import moment from 'moment';

function CheckoutResult(props) {
  const { open, onDismiss, onSuccess, handleBack, result } = props;

  const rates = useSelector(conversionRatesSelector);

  const { status, created, amount, currency = {}, items } = result ?? {};

  const numberItemsToDisplay = 5;
  const itemCount = sum(items?.map(x => x.quantity));

  const { convAvailable } = useConversion(amount, rates, currency, true);

  const icon = useMemo(() => (status === 'complete' ? 'success' : 'error'), [
    status,
  ]);

  let buttons = [
    {
      id: 'back_to_cart',
      capitalize: true,
      onPress: handleBack,
    },
  ];

  if (status === 'complete')
    buttons = [
      {
        id: 'view_order',
        capitalize: true,
        onPress: () => onSuccess({ path: '/products/orders/' }),
      },
      {
        id: 'continue_shopping',
        variant: 'text',
        onPress: () => onSuccess({ path: '/products/' }),
      },
    ];

  return (
    <Modal open={open} onDismiss={onDismiss} maxWidth={500} borderRadius={20}>
      <View mt={1.5}>
        <CheckoutIcon icon={icon} />
      </View>
      <View mv={1}>
        <Text
          id={status === 'complete' ? 'success' : 'unsuccessful'}
          fontWeight={'700'}
          style={{ fontSize: 25, textAlign: 'center' }}
        />
        <Text style={{ fontSize: 14, textAlign: 'center' }}>
          {moment(created)?.format('HH:mm, DD MMMM YYYY')}
        </Text>
      </View>

      {(status === 'complete' || true) && (
        <>
          <View>
            <Text
              fontWeight={'700'}
              myColor={'primary'}
              id="order_total"
              uppercase
            />
            <Text fontWeight={'700'} style={{ fontSize: 35 }}>
              {formatAmountString(amount, currency, true)}
            </Text>
            {convAvailable && (
              <Text style={{ fontSize: 14 }}>{convAvailable}</Text>
            )}
          </View>

          <View w={'100%'} mt={1.5} mb={2}>
            <View fD={'row'} aI={'center'}>
              {items?.map(item => {
                return [...new Array(item.quantity)]?.map(x => (
                  <View bC={'#f6f6f6'} mr={1} key={item?.id ?? item?.image}>
                    {item?.image ? (
                      <Image
                        src={item?.image}
                        alt={item?.id}
                        height={70}
                        width={70}
                      />
                    ) : (
                      <PlaceholderImage name="product" height={70} width={70} />
                    )}
                  </View>
                ));
              })}
            </View>
            <View fD={'row'} jC={'space-between'} w={'100%'} mt={0.5}>
              <Text style={{ fontSize: 14 }}>
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </Text>
              {itemCount > numberItemsToDisplay && (
                <Text style={{ textAlign: 'right', fontSize: 14 }}>
                  + {itemCount - numberItemsToDisplay} more
                </Text>
              )}
            </View>
          </View>
        </>
      )}
      <ButtonList layout="vertical" items={buttons} />
    </Modal>
  );
}
export default React.memo(CheckoutResult);

const CheckoutIcon = React.memo(_CheckoutIcon);
function _CheckoutIcon(props) {
  const { icon } = props;

  return (
    <View
      w={'100%'}
      aI={'center'}
      style={{ marginTop: '-30px', marginBottom: '-30px' }}>
      <LottieImage name={icon} size={200} />
    </View>
  );
}

// class CheckoutIcon extends Component {
//   shouldComponentUpdate(nextProps, nextState) {
//     return false;
//   }

//   render() {
//     const { icon } = this.props;

//     return (
//       <View
//         w={'100%'}
//         aI={'center'}
//         style={{ marginTop: '-30px', marginBottom: '-30px' }}>
//         <LottieImage name={icon} size={200} loop={false} />
//       </View>
//     );
//   }
// }
