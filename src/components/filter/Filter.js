import React from 'react';
// import Checkbox from '@material-ui/core/Checkbox';
import AmountFilter from './AmountFilter';
import DateFilter from './DateFilter';
import { View } from 'components/layout/View';
import SelectFilter from './SelectFilter';
// import Text from 'components/outputs/Text';
import CategoriesFilter from './CategoriesFilter';
import CountriesFilter from './CountriesFilter';
import BooleanFilter from './BooleanFilter';
import TextFilter from './TextFilter';
import SellerFilter from './SellerFilter';

const Filter = props => {
  const { variant, ...restProps } = props;

  return (
    <View w={'100%'} fD={'row'}>
      <React.Fragment>
        {variant === 'select' ? (
          <SelectFilter {...restProps} />
        ) : variant === 'number' ? (
          <AmountFilter {...restProps} />
        ) : variant === 'date' ? (
          <DateFilter {...restProps} />
        ) : variant === 'categories' ? (
          <CategoriesFilter {...restProps} />
        ) : variant === 'boolean' ? (
          <BooleanFilter {...restProps} />
        ) : variant === 'countries' ? (
          <CountriesFilter {...restProps} />
        ) : variant === 'seller' ? (
          <SellerFilter {...restProps} />
        ) : (
          <TextFilter {...restProps} />
        )}
      </React.Fragment>
    </View>
  );
};

export default Filter;
