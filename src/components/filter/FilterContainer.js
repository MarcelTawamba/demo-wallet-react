import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Filter from './Filter';
import Spinner from 'components/outputs/Spinner';

const FilterContainer = ({
  filters,
  filterConfig,
  setFilters,
  applyFilters,
  onClose,
  clearAndApply,
  loading,
}) => {
  return (
    <View p={1} w={350}>
      <View w={'100%'} fD={'row'} aI={'center'}>
        <View pl={0.75} pb={0.3} w={'100%'}>
          <Text variant={'h6'}>Filters</Text>
        </View>
        <View fD={'row'} aI={'flex-end'}>
          <Button
            noPadding
            variant={'text'}
            style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
            onPress={() => {
              clearAndApply('all');
              onClose();
            }}>
            <Text s={10} id="clear" uppercase />
          </Button>
          <Button
            noPadding
            variant={'text'}
            style={{ margin: 2, padding: 8, borderRadius: 3, minWidth: 0 }}
            onPress={() => {
              applyFilters();
              onClose();
            }}>
            <Text s={10} id="apply" uppercase />
          </Button>
        </View>
      </View>
      {loading ? (
        <Spinner />
      ) : (
        <View w={'100%'} pt={0.5} pr={0.5}>
          {Object.keys(filters).map(filter => (
            <Filter
              key={filter}
              id={filter}
              filterConfig={filterConfig[filter]}
              {...filterConfig[filter]}
              {...filters[filter]}
              filters={filters}
              setFilters={setFilters}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default FilterContainer;
