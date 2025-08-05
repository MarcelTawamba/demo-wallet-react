import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Selector from 'components/inputs/Selector';
import { Button } from 'components/inputs/Button';

const SortContainer = ({
  field,
  setField,
  direction,
  setDirection,
  setSortActive,
  onClose,
  applySort,
}) => {
  const fields = [
    { value: 'total_amount', label: 'amount' },
    { value: 'created', label: 'date' },
  ];
  const directions = [
    { value: 'desc', label: 'descending' },
    { value: 'asc', label: 'ascending' },
  ];

  return (
    <View p={1} pb={0}>
      <View w={'100%'} fD={'row'} aI={'center'}>
        <View pl={0.75} w={'100%'}>
          <Text variant={'h6'} id="order_by" />
        </View>
        <View fD={'row'} aI={'flex-end'}>
          <Button
            noPadding
            variant={'text'}
            style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
            onPress={() => {
              setField('created');
              setDirection('desc');
            }}>
            <Text style={{ fontSize: 10 }} id="clear" uppercase />
          </Button>
          <Button
            noPadding
            variant={'text'}
            style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
            onPress={() => {
              if (field === 'created' && direction === 'desc') {
                setSortActive(false);
              } else {
                setSortActive(true);
              }
              applySort();
              onClose();
            }}>
            <Text style={{ fontSize: 10 }} id="apply" uppercase />
          </Button>
        </View>
      </View>
      <View p={0.75} pt={0.5} w={'100%'} pb={1.25}>
        <Selector
          label={'field'}
          items={fields}
          value={field}
          onValueChange={setField}
        />
        <Selector
          label={'direction'}
          items={directions}
          value={direction}
          onValueChange={setDirection}
        />
      </View>
    </View>
  );
};

export default SortContainer;
