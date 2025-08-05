import React, { useContext, useState } from 'react';
import { useCart } from './CartContext';

const ProductFiltersContext = React.createContext();

function ProductFiltersProvider({ children }) {
  // const { currency } = useCart();
  const [filters, setFilters] = useState({});
  return (
    <ProductFiltersContext.Provider value={{}}>
      {children}
    </ProductFiltersContext.Provider>
  );
}

function useProductFilters() {
  const context = useContext(ProductFiltersContext);

  if (context === undefined) {
    throw new Error(
      'useProductFilters must be used within a ProductFiltersProvider',
    );
  }
  return context;
}

export { ProductFiltersContext, ProductFiltersProvider, useProductFilters };
