import React, { useState } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Filter from './Filter';
import Spinner from 'components/outputs/Spinner';
import { standardizeString } from 'util/general';

export default function FilterLayout(props) {
  let { id, applyFilter, loading, initialValue = '', label, onDelete } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <View p={1} w={350}>
      <View w={'100%'} fD={'row'} aI={'center'}>
        <View pl={0.5} w={'100%'}>
          <Text variant={'h6'} id={label ?? id} />
        </View>
        {Boolean(id) && (
          <View fD={'row'} aI={'flex-end'}>
            <Button
              noPadding
              variant={'text'}
              style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
              onPress={() => (onDelete ? onDelete() : setValue(initialValue))}>
              <Text s={10} id="clear" uppercase />
            </Button>
            <Button
              noPadding
              variant={'text'}
              style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
              onPress={() => {
                typeof value === 'object'
                  ? applyFilter('merge', value)
                  : applyFilter(id, value);
              }}>
              <Text s={10} id="apply" uppercase />
            </Button>
          </View>
        )}
      </View>
      {loading ? (
        <Spinner />
      ) : id ? (
        <View w={'100%'} pt={0.5}>
          <Filter
            key={id}
            {...props}
            // onSubmit={() => applyFilter(id, value)}
            onSubmit={() => {
              typeof value === 'object'
                ? applyFilter('merge', value)
                : applyFilter(id, value);
            }}
            value={value}
            setValue={setValue}
          />
        </View>
      ) : null}
    </View>
  );
}
