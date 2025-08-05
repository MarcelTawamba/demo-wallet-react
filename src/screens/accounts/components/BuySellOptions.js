import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import MuiList from '@material-ui/core/List';
import BuyOption from './BuySellOption';

export default function BuyOptions(props) {
  const { options, history, account, rates } = props;

  return !options?.length ? (
    <Text id="no_options_available" tA={'center'} s={14} c={'grey4'} />
  ) : (
    <MuiList style={{ width: '100%' }}>
      <View w={'100%'} grid>
        {options?.map(option => (
          <BuyOption {...{ item: option, history, account, rates }} />
        ))}
      </View>
    </MuiList>
  );
}
