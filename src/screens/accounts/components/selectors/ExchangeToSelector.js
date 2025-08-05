import React, { useState } from 'react';
import { View } from 'components/layout/View';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import { Button } from 'components/inputs/Button';
import WalletCard from '../currency/CurrencyCard';
import { getCurrencyCode } from 'util/general';
import { conversionRatesSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';
import CurrencyBadge from 'screens/accounts/components/currency/CurrencyBadge';

const ExchangeToSelector = ({ values, value, index, onValueChange, title }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const rates = useSelector(conversionRatesSelector);
  const currencyCode = getCurrencyCode(value.currency);
  return (
    <React.Fragment>
      <Button
        variant={'text'}
        style={{ borderRadius: 3, margin: 0, padding: 0 }}
        wrapperStyle={{ borderRadius: 3, margin: 0, padding: 0 }}
        onPress={() => setModalVisible(true)}>
        <View fD={'row'} aI={'center'}>
          <CurrencyBadge
            text={currencyCode}
            currency={value.currency}
            radius={14}
          />
          <Text style={{ paddingBottom: 2, paddingLeft: 4 }}>
            {currencyCode}
          </Text>
          <ArrowDropDownIcon style={{ margin: '-10px 0 0 4px' }} />
        </View>
      </Button>

      <Modal
        close
        title={title || 'select_buy_account'}
        maxWidth={500}
        open={modalVisible}
        onDismiss={() => setModalVisible(false)}>
        <View pb={1} w={'100%'}>
          {values.map((item, ind) => (
            <View ph={1} pr={2} pv={0.5} w={'100%'} key={item.code}>
              <WalletCard
                showAccount
                item={item}
                index={ind}
                rates={rates}
                currency={value}
                selected={index}
                onPress={() => {
                  onValueChange(ind);
                  setModalVisible(false);
                }}
              />
            </View>
          ))}
        </View>
      </Modal>
    </React.Fragment>
  );
};

export default ExchangeToSelector;
