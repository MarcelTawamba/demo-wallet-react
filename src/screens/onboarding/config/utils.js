import * as inputs from 'config/inputs';
import * as customInputs from './inputs';
import { getData } from 'country-list';
import { intersection, flatten, uniq, isEmpty, isObject } from 'lodash';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { isSSN } from 'util/validation';

export function completedRequiredFields(item, fields, props = {}) {
  let complete = true;
  let { type = 'user' } = props;

  fields.forEach(field => {
    switch (field) {
      case 'mobile_number':
        complete = item?.verification?.mobile;
        break;
      case 'address':
        complete = !Boolean(
          [
            `${type === 'business' ? 'address_' : ''}line_1`,
            `${type === 'business' ? 'address_' : ''}city`,
            `${type === 'business' ? 'address_' : ''}state_province`,
            `${type === 'business' ? 'address_' : ''}country`,
            `${type === 'business' ? 'address_' : ''}postal_code`,
          ].find(x => !item?.[x]),
        );
        break;
      case 'proof_of_address':
      case 'proof_of_identity':
      case 'proof_of_income':
        complete = Boolean(item?.find(x => x.document_category === field));
        break;
      default:
        if (!item?.[field]) complete = false;
        break;
    }
  });

  return complete;
}

export function intersectTierRequirements({ section, tiers, applyOverrides }) {
  const mappedRequirements =
    (tiers &&
      flatten(
        tiers?.map(x => 
          // Try both requirements and requirementSets structures
          (x.requirements?.map(y => y.requirement) ?? []).concat(
            x.requirementSets?.map(rs => rs.items?.map(item => item.rule?.resource) ?? []).flat() ?? []
          )
        ),
      )) ??
    [];

  let set = [];
  let overrides = [];

  switch (section) {
    case 'user_basic_info':
      set = [
        'first_name',
        'last_name',
        'birth_date',
        'nationality',
        'residency',
        'id_number',
        'gender',
        'title',
        'marital_status',
        'fathers_name',
        'mothers_name',
        'grandfathers_name',
        'grandmothers_name',
      ];
      overrides = [
        'first_name',
        'last_name',
        'birth_date',
        'nationality',
        'residency',
        'id_number',
      ];
      break;
    case 'user_central_bank_number':
      set = ['central_bank_number'];
      break;
    case 'user_verify_mobile':
      set = ['mobile_number'];
      break;
    case 'user_address_verification':
    case 'business_location':
      set = ['address'];
      break;
    case 'user_address_verification_document':
      set = ['proof_of_address'];
      break;
    case 'user_identity':
      set = ['proof_of_identity'];
      break;
    case 'user_finance':
      set = ['proof_of_income'];
      break;
    default:
      return set;
  }

  const matches = section.includes('business')
    ? set
    : intersection(set, uniq(mappedRequirements));

  return uniq([...(applyOverrides ? overrides : []), ...flatten(matches)]);
}

export function mapFieldsToInputs({ fields, user }) {
  const countryData = getData().map(item => {
    return {
      label: item.name,
      value: item.code,
      key: item.code,
    };
  });

  const functionInputs = {
    nationality: customInputs.nationality(countryData),
    mobile_number: customInputs.verify_mobile({
      existing: user?.mobile,
    }),
    address: [
      inputs.line_1,
      inputs.line_2,
      inputs.city,
      inputs.state_province,
      inputs.postal_code,
      customInputs.country(countryData),
    ],
  };

  return flatten(
    fields?.map(x => functionInputs[x] ?? customInputs[x] ?? inputs[x]) ?? [],
  ).map(item => ({
    ...item,
    required: !['line_2'].includes(item.name),
  }));
}

export function calculateOnboardingComplete(sections) {
  let allCompleted = !sections.some(section => !section.completed);
  return allCompleted;
}

export function validateRequiredFields(item, fields, props = {}) {
  let errors = {};
  let { type = 'user' } = props;

  fields.forEach(field => {
    switch (field) {
      case 'mobile_number':
        if (!item?.verification?.mobile) errors.mobile_number = 'required';
        break;
      case 'address':
        [
          `${type === 'business' ? 'address_' : ''}line_1`,
          `${type === 'business' ? 'address_' : ''}city`,
          `${type === 'business' ? 'address_' : ''}state_province`,
          `${type === 'business' ? 'address_' : ''}country`,
          `${type === 'business' ? 'address_' : ''}postal_code`,
        ].forEach(x => {
          if (!item?.[x]) {
            errors.x = 'required';
          }
        });

        break;
      default: // Force US - error message wasn't working reliably
        if (
          field === 'id_number' &&
          (item?.nationality === 'US' ||
            item?.nationality === 'United States of America' ||
            item?.nationality?.cca2 === 'US') &&
          !isSSN(item?.id_number)
        )
          errors[field] = 'Please enter a valid Social Security Number';
        if (!item?.[field]) errors[field] = 'Required';
        break;
    }
  });

  return isEmpty(errors) ? false : errors;
}

export function validateRequiredFieldsNew(values, fields, userAddresses = []) {
  let errors = {};

  fields.forEach(field => {
    const fieldName = field.name;
    switch (field.resource_type) {
      case 'user':
        if (!values[fieldName] && field.required)
          errors[fieldName] = 'Required';
        break;
      case 'email':
        if (field.verified && !values.email_verification)
          errors[fieldName] = 'Required';
        break;
      case 'mobile':
        if (field.verified && !values.mobile_verification)
          errors[fieldName] = '';
        break;
      case 'address':
        let _hasFormAddressData = hasFormAddressData(values?.address ?? {});
        const isValidAddressInput = addressData => {
          return (
            addressData.line_1 &&
            addressData.city &&
            addressData.state_province &&
            addressData.country &&
            addressData.postal_code
          );
        };
        if (
          field.verified &&
          userAddresses?.length < 1 &&
          !isValidAddressInput(_hasFormAddressData)
        ) {
          errors['address'] = 'Required';
        }
        break;
      default:
        break;
    }
  });
  return isEmpty(errors) ? false : errors;
}

export const validateMobile = mobile => {
  try {
    if (mobile.charAt(0) !== '+') return 'Please include a country code';

    const phoneUtil = PhoneNumberUtil.getInstance();
    const number = phoneUtil.parse(mobile, '');
    const type = phoneUtil.getNumberType(number);
    let resp = phoneUtil.isValidNumber(number);
    if (!resp || type === 0) {
      return 'Please enter a valid mobile number';
    }
  } catch (e) {
    if (e.message === 'Invalid country calling code') {
      return 'Please include a country code';
    }
    return 'Please enter a valid mobile number';
  }

  return '';
};

export const hasFormAddressData = addressData => {
  let addressDataToAdd = false;
  if (isObject(addressData) && !isEmpty(addressData)) {
    for (const key in addressData) {
      if (addressData[key]) {
        addressDataToAdd = addressData;
        break;
      }
    }
  }
  return addressDataToAdd;
};
