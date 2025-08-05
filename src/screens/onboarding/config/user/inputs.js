import IdentityVerification from '../../components/IdentityVerification';
import AddressVerification from '../../components/AddressVerification';
import IncomeVerification from '../../components/IncomeVerification';
import moment from 'moment';

export const first_name = {
  name: 'first_name',
  label: 'First name',
};

export const last_name = {
  name: 'last_name',
  label: 'last_name',
};

export const id_number = {
  name: 'id_number',
  placeholder: 'e.g. 4001023456789',
  label: 'identification_number',
};

export const birthday = {
  name: 'birth_date',
  label: 'birthday',
  type: 'date',
  disableFuture: true,
  initialFocusedDate: moment().set({ year: 1989, month: 0, date: 1 }),
};

export const central_bank_number = {
  name: 'central_bank_number',
  placeholder: 'e.g. 4001023456789',
  label: 'central_bank_number',
};

export const display_currency = options => {
  return {
    name: 'display_currency',
    label: 'displayCurrency',
    type: 'autocomplete',
    options,
  };
};

export const nationality = options => {
  return {
    name: 'nationality',
    label: 'nationality',
    type: 'country',
    options,
  };
};

export const country = options => {
  return {
    name: 'country',
    label: 'country',
    type: 'country',
    options,
  };
};

export const profile_pic = existing => {
  return {
    name: 'profile',
    type: 'profile_upload',
    existing,
  };
};

export const phone_number = existing => {
  return {
    name: 'mobile',
    label: 'mobile_number',
    type: 'phone',
    existing,
  };
};

export const verify_mobile = props => {
  const { existing, state } = props;
  return {
    name: 'verify_mobile',
    label: 'mobile_number',
    type: 'verify_mobile',
    existing,
    state,
  };
};

export const location = props => {
  const { label, name, existing } = props;
  return {
    name,
    label,
    type: 'location',
    existing,
  };
};

export const verify_location = categories => {
  return {
    name: 'location_documents',
    label: 'document_type',
    type: 'dropdown',
    items: categories,
  };
};

export const identity = {
  name: 'documents',
  component: IdentityVerification,
};

export const address_verification = {
  name: 'documents',
  component: AddressVerification,
};

export const finance_verification = {
  name: 'documents',
  component: IncomeVerification,
};
