import React from 'react';
import { View } from 'components/layout/View';
import Output from 'components/outputs/Output';

const OutputList = props => {
  const { items, layout, vertical, outputProps, ...restProps } = props;

  if (!items || !items.length || items.length === 0) {
    return null;
  }

  return (
    <View
      fD={layout ? layout : 'column'}
      w={'100%'}
      jC={'flex-start'}
      aI={'flex-start'}
      flex
      // pr={2}
      {...restProps}>
      {items.map(
        (item, index) =>
          item && (
            <View
              pv={0.5}
              w={'100%'}
              key={item.id ? item.id : index.toString()}>
              <Output vertical={vertical} {...outputProps} {...item} />
            </View>
          ),
      )}
    </View>
  );
};

export default OutputList;
