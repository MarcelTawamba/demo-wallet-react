import React from 'react';
import { ProductFilterConfig } from '../../config/filters';
import FilterChipList from 'components/filter/FilterChipList';
import { get } from 'lodash';

const ProductFilterChipList = props => {
  const { filters, clearAndApply, profile } = props;
  let data = filters;
  const country = get(filters, ['countries', 'value', 0]);
  if (!country || country === profile.items.nationality) {
    data = { ...filters, countries: { ...filters.countries, active: false } };
  }

  return (
    <FilterChipList
      filterConfig={ProductFilterConfig}
      filters={data}
      clearAndApply={clearAndApply}
    />
  );
};

export default ProductFilterChipList;
