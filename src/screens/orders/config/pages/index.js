import allOrders from './allOrders';

const exportConfigs = companyCurrencies => {
  return { allOrders: allOrders(companyCurrencies) };
};

export default exportConfigs;
