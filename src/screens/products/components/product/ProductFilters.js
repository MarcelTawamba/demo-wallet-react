import React from 'react';
import FilterContainer from 'components/filter/FilterContainer';
import { ProductFilterConfig } from '../../config/filters';

const ProductFilters = props => {
  return <FilterContainer {...props} filterConfig={ProductFilterConfig} />;
};

export default ProductFilters;
