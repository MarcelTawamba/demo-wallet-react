import { createSelector } from 'reselect';
import { rehiveStateSelector } from 'redux/rehive/selectors';

export const bankAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.bankAccounts ? rehiveState.bankAccounts : [],
      loading: rehiveState.bankAccountsLoading
        ? rehiveState.bankAccountsLoading
        : false,
      error: rehiveState.bankAccountsError
        ? rehiveState.bankAccountsError
        : false,
    };
  },
);

export const cryptoAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.cryptoAccounts ? rehiveState.cryptoAccounts : [],
      loading: rehiveState.cryptoAccountsLoading
        ? rehiveState.cryptoAccountsLoading
        : false,
      error: rehiveState.cryptoAccountsError
        ? rehiveState.cryptoAccountsError
        : false,
    };
  },
);
