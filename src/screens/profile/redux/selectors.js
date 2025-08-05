import { rehiveStateSelector } from 'redux/rehive/selectors';
import { createSelector } from 'reselect';

export const userAddressesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.addresses ? rehiveState.addresses : [],
      loading: rehiveState.addressesLoading
        ? rehiveState.addressesLoading
        : false,
      error: rehiveState.addressesError ? rehiveState.addressesError : '',
    };
  },
);

export const userEmailsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.emails ? rehiveState.emails : [],
      loading: rehiveState.emailsLoading ? rehiveState.emailsLoading : false,
      error: rehiveState.emailsError ? rehiveState.emailsError : '',
    };
  },
);

export const userMobilesSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.mobiles ? rehiveState.mobiles : [],
      loading: rehiveState.mobilesLoading ? rehiveState.mobilesLoading : false,
      error: rehiveState.mobilesError ? rehiveState.mobilesError : '',
    };
  },
);

export const userBankAccountsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.bankAccounts ? rehiveState.bankAccounts : [],
      loading: rehiveState.bankAccountsLoading
        ? rehiveState.bankAccountsLoading
        : false,
      error: rehiveState.bankAccountsError ? rehiveState.bankAccountsError : '',
    };
  },
);

export const userDocumentsSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.documents ? rehiveState.documents : [],
      loading: rehiveState.documentsLoading
        ? rehiveState.documentsLoading
        : false,
      error: rehiveState.documentsError ? rehiveState.documentsError : '',
    };
  },
);

export const userProfileSelector = createSelector(
  rehiveStateSelector,
  rehiveState => {
    return {
      items: rehiveState.profile ? rehiveState.profile : {},
      loading: rehiveState.profileLoading ? rehiveState.profileLoading : false,
      error: rehiveState.profileError ? rehiveState.profileError : '',
    };
  },
);
