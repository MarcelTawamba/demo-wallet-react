import React, { useMemo, useEffect } from 'react';
import * as yup from 'yup';
import { difference, isArray } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getNames, getName, getCode } from 'country-list';
import { orderBy } from 'lodash';
import Flag from 'react-world-flags';
// Remove the ISO31662 import
// import ISO31662 from 'iso-3166-2';
// Import the country subdivisions data
import countrySubdivisions from 'util/countries/country-subdivisions.json';

import AccountCurrencyList from './inputs/AccountCurrencyList';
import { EMPTY_BANK_ACCOUNT } from 'config/empty';
import * as Inputs from 'config/inputs';
import {
  updateItem,
  addBankAccountCurrency,
  deleteBankAccountCurrency,
} from 'util/rehive';
import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';
import ErrorOutput from 'components/outputs/Error';
import context from 'components/app/context';
import PageButtons from 'components/layout/page/PageButtons';
import { useSelector } from 'react-redux';
import { configSettingsSelector } from 'redux/rehive/selectors';

// Custom component for owner address fields
const OwnerAddressFields = ({ formikProps, hideFields = [], explicitFields = [] }) => {
  const { t } = useTranslation(['settings']);
  const [localFields, setLocalFields] = React.useState({
    line_1: '',
    line_2: '',
    city: '',
    state_province: '',
    country: '',
    postal_code: '',
    state_code: ''
  });
  
  // State for storing available states/provinces for the selected country
  const [stateOptions, setStateOptions] = React.useState([]);
  
  // Get ordered list of countries
  const countries = useMemo(() => {
    const countryNames = orderBy(getNames());
    return countryNames.map(country => ({
      label: country,
      code: getCode(country)
    }));
  }, []);
  
  // Initialize local state when the component mounts
  React.useEffect(() => {
    if (formikProps.values) {
      setLocalFields({
        line_1: formikProps.values['owner.address.line_1'] || '',
        line_2: formikProps.values['owner.address.line_2'] || '',
        city: formikProps.values['owner.address.city'] || '',
        state_province: formikProps.values['owner.address.state_province'] || '',
        country: formikProps.values['owner.address.country'] || '',
        postal_code: formikProps.values['owner.address.postal_code'] || '',
        state_code: formikProps.values['owner.address.state_code'] || '',
      });
    }
  }, []); // Empty dependency array means this runs once on mount
  
  // Update local state when formikProps.values change
  React.useEffect(() => {
    if (formikProps.values) {
      setLocalFields(prev => ({
        ...prev,
        line_1: formikProps.values['owner.address.line_1'] || prev.line_1,
        line_2: formikProps.values['owner.address.line_2'] || prev.line_2,
        city: formikProps.values['owner.address.city'] || prev.city,
        state_province: formikProps.values['owner.address.state_province'] || prev.state_province,
        country: formikProps.values['owner.address.country'] || prev.country,
        postal_code: formikProps.values['owner.address.postal_code'] || prev.postal_code,
        state_code: formikProps.values['owner.address.state_code'] || prev.state_code,
      }));
    }
  }, [formikProps.values]);
  
  // Update state options when country changes
  useEffect(() => {
    if (localFields.country) {
      // Use the same country matching logic as getCountryValue()
      let countryObj = countries.find(c => c.label === localFields.country);
      
      // If not found and the field might be a country code (2 characters), convert code to name and search again
      if (!countryObj && localFields.country.length === 2) {
        try {
          const countryName = getName(localFields.country);
          if (countryName) {
            countryObj = countries.find(c => c.label === countryName);
          }
        } catch (error) {
          // Ignore error if country code is invalid
        }
      }
      
      // If still not found, try to find by code
      if (!countryObj) {
        countryObj = countries.find(c => c.code === localFields.country);
      }
      
      if (countryObj && countryObj.code) {
        try {
          // Get the country code
          const countryCode = countryObj.code;
          
          // Filter subdivisions for the selected country
          const subdivisions = countrySubdivisions.filter(
            subdivision => subdivision.country === countryCode
          );
          
          if (subdivisions && subdivisions.length > 0) {
            // Convert the subdivisions to the format we need
            const options = subdivisions.map(subdivision => {
              // Extract the state code part properly
              let stateCode = '';
              if (subdivision.code && subdivision.code.includes('-')) {
                stateCode = subdivision.code.split('-')[1];
              } else {
                stateCode = subdivision.code;
              }
              
              return {
                label: subdivision.name,
                code: stateCode // Use just the state code part (e.g., "NY" instead of "US-NY")
              };
            });
            
            setStateOptions(orderBy(options, 'label'));
          } else {
            setStateOptions([]);
          }
        } catch (error) {
          console.error('Error getting subdivisions:', error);
          setStateOptions([]);
        }
      } else {
        setStateOptions([]);
      }
    } else {
      setStateOptions([]);
    }
  }, [localFields.country, countries]);
  
  // Load initial state options when the component mounts and there's a country value
  useEffect(() => {
    if (formikProps.values && formikProps.values['owner.address.country']) {
      // Set the country in local state to trigger the state options loading
      setLocalFields(prev => ({
        ...prev,
        country: formikProps.values['owner.address.country']
      }));
    }
  }, []);
  
  // Direct change handler that only updates local state
  const handleLocalChange = (field) => (e) => {
    const value = e.target.value;    
    // Only update local state
    setLocalFields(prev => {
      const newState = {
        ...prev,
        [field]: value
      };
      return newState;
    });
  };
  
  // Handle country change
  const handleCountryChange = (event, newValue) => {
    // Update local state
    setLocalFields(prev => {
      const newState = {
        ...prev,
        country: newValue ? newValue.label : '',
        // Reset state_province when country changes
        state_province: '',
      };
      return newState;
    });
  };
  
  // Handle state/province change
  const handleStateProvinceChange = (event, newValue) => {
    // Update local state with state_province as the code
    setLocalFields(prev => {
      const newState = {
        ...prev,
        state_province: newValue ? newValue.code : '', // Store the code (e.g., "CA")
        // Don't update state_code as it's independent
      };
      return newState;
    });
  };
  
  // Blur handler that updates formik state
  const handleBlur = (field) => () => {    
    // Update formik state on blur
    const fieldName = `owner.address.${field}`;
    
    // First update the formik values
    const newValues = {
      ...formikProps.values,
      [fieldName]: localFields[field]
    };
    
    // Use setValues to update the entire form state
    formikProps.setValues(newValues);
    
    // Then mark the field as touched
    formikProps.setFieldTouched(fieldName, true, false);
  };
  
  // Handle state/province blur - updates state_province in formik
  const handleStateProvinceBlur = () => {
    // Update formik state for state_province only
    const newValues = {
      ...formikProps.values,
      'owner.address.state_province': localFields.state_province
    };
    
    // Use setValues to update the entire form state
    formikProps.setValues(newValues);
    
    // Mark the field as touched
    formikProps.setFieldTouched('owner.address.state_province', true, false);
  };
  
  // Handle country blur
  const handleCountryBlur = () => {
    // Update formik state on blur
    const fieldName = 'owner.address.country';
    
    // First update the formik values
    const newValues = {
      ...formikProps.values,
      [fieldName]: localFields.country
    };
    
    // Use setValues to update the entire form state
    formikProps.setValues(newValues);
    
    // Then mark the field as touched
    formikProps.setFieldTouched(fieldName, true, false); 
  };
  
  // Find the country object based on the country name or code
  const getCountryValue = () => {
    if (!localFields.country) return null;
    
    // First try to find by label (full country name)
    let countryMatch = countries.find(country => country.label === localFields.country);
    
    // If not found and the field might be a country code (2 characters), convert code to name and search again
    if (!countryMatch && localFields.country.length === 2) {
      try {
        const countryName = getName(localFields.country);
        if (countryName) {
          countryMatch = countries.find(country => country.label === countryName);
        }
      } catch (error) {
        // Ignore error if country code is invalid
      }
    }
    
    // If still not found, try to find by code
    if (!countryMatch) {
      countryMatch = countries.find(country => country.code === localFields.country);
    }
    
    return countryMatch || null;
  };
  
  // Find the state/province object based on the state code or name
  const getStateProvinceValue = () => {
    if (!localFields.state_province) return null;
    
    // First try to find by code (e.g., "NY")
    let stateMatch = stateOptions.find(state => state.code === localFields.state_province);
    
    // If not found, try to find by label (full state name)
    if (!stateMatch) {
      stateMatch = stateOptions.find(state => state.label === localFields.state_province);
    }
    
    // If not found and the value might be a full code (e.g., "US-NY"), try extracting the state part
    if (!stateMatch && localFields.state_province.includes('-')) {
      const statePart = localFields.state_province.split('-')[1];
      if (statePart) {
        stateMatch = stateOptions.find(state => state.code === statePart);
      }
    }
    
    return stateMatch || null;
  };
  
  // Check if a field should be hidden
  const isFieldHidden = (fieldName) => {
    // Convert the field name to the format used in the configuration
    // e.g., 'line_1' -> 'owner_address_line_1'
    const configFieldName = `owner_address_${fieldName}`;
    const fieldPath = `owner.address.${fieldName}`;
        
    // If using explicit fields, check if the field is included
    if (explicitFields.length > 0) {
      // Check if the field is in the explicitFields list (using the config format)
      const isExplicit = explicitFields.includes(configFieldName);
      
      // Check if the field is in the hideFields list (using either format)
      const isHidden = hideFields.includes(fieldPath) || 
                       hideFields.includes(configFieldName) || 
                       hideFields.includes('owner.address') || 
                       hideFields.includes('owner');      
      // If using explicit fields, the field should be hidden if it's not in the list or if it's explicitly hidden
      return !isExplicit || isHidden;
    }
    
    // Otherwise, just check if it's in hideFields
    return hideFields.includes(fieldPath) || 
           hideFields.includes(configFieldName) || 
           hideFields.includes('owner.address') || 
           hideFields.includes('owner');
  };
  
  return (
    <>
      <h3>{t('owner_address_title', 'Account Holder Address')}</h3>
      
      {!isFieldHidden('country') && (
        <Autocomplete
          id="owner.address.country"
          options={countries}
          value={getCountryValue()}
          onChange={handleCountryChange}
          onBlur={handleCountryBlur}
          fullWidth
          getOptionLabel={(option) => option.label}
          renderOption={(option) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Flag
                code={option.code}
                style={{ marginRight: 10, width: 20, height: 15 }}
              />
              {option.label}
            </div>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="dense"
              variant="outlined"
              label="Country"
              placeholder="e.g. United States"
              InputProps={{
                ...params.InputProps,
                autoComplete: 'off',
                startAdornment: localFields.country && getCountryValue() && (
                  <Flag
                    code={getCountryValue().code.toLowerCase()}
                    style={{
                      marginRight: 5,
                      width: 25,
                      height: 15,
                      marginLeft: 8
                    }}
                  />
                )
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off',
                spellCheck: 'false'
              }}
            />
          )}
        />
      )}
      
      {!isFieldHidden('line_1') && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          id="owner.address.line_1"
          name="owner.address.line_1"
          label="Address Line 1"
          value={localFields.line_1}
          onChange={handleLocalChange('line_1')}
          onBlur={handleBlur('line_1')}
          placeholder="e.g. 123 Main St"
          InputProps={{
            autoComplete: 'off'
          }}
          inputProps={{
            autoComplete: 'off',
            spellCheck: 'false'
          }}
        />
      )}
      
      {!isFieldHidden('line_2') && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          id="owner.address.line_2"
          name="owner.address.line_2"
          label="Address Line 2"
          value={localFields.line_2}
          onChange={handleLocalChange('line_2')}
          onBlur={handleBlur('line_2')}
          placeholder="e.g. Apt 4B"
          InputProps={{
            autoComplete: 'off'
          }}
          inputProps={{
            autoComplete: 'off',
            spellCheck: 'false'
          }}
        />
      )}
      
      {!isFieldHidden('city') && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          id="owner.address.city"
          name="owner.address.city"
          label="City"
          value={localFields.city}
          onChange={handleLocalChange('city')}
          onBlur={handleBlur('city')}
          placeholder="e.g. New York"
          InputProps={{
            autoComplete: 'off'
          }}
          inputProps={{
            autoComplete: 'off',
            spellCheck: 'false'
          }}
        />
      )}
      
      {!isFieldHidden('state_province') && (
        <Autocomplete
          id="owner.address.state_province"
          options={stateOptions}
          value={getStateProvinceValue()}
          onChange={handleStateProvinceChange}
          onBlur={handleStateProvinceBlur}
          fullWidth
          getOptionLabel={(option) => option.label}
          disabled={!localFields.country}
          noOptionsText={!localFields.country ? "Please select a country first" : "No states/provinces available"}
          renderOption={(option) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {option.label}
            </div>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="dense"
              variant="outlined"
              label="State/Province"
              placeholder={!localFields.country ? "Select a country first" : "e.g. New York"}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'off'
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'off',
                spellCheck: 'false'
              }}
            />
          )}
        />
      )}
      
      {!isFieldHidden('postal_code') && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          id="owner.address.postal_code"
          name="owner.address.postal_code"
          label="Postal Code"
          value={localFields.postal_code}
          onChange={handleLocalChange('postal_code')}
          onBlur={handleBlur('postal_code')}
          placeholder="e.g. 10001"
          InputProps={{
            autoComplete: 'off'
          }}
          inputProps={{
            autoComplete: 'off',
            spellCheck: 'false'
          }}
        />
      )}
      
      {!isFieldHidden('state_code') && (
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          id="owner.address.state_code"
          name="owner.address.state_code"
          label="State Code"
          value={localFields.state_code}
          onChange={handleLocalChange('state_code')}
          onBlur={handleBlur('state_code')}
          placeholder="e.g. NY"
          InputProps={{
            autoComplete: 'off'
          }}
          inputProps={{
            autoComplete: 'off',
            spellCheck: 'false'
          }}
        />
      )}
    </>
  );
};

function _BankAccountForm(props) {
  const { t } = useTranslation(['settings']);
  const { showComplexFields } = props;
  
  // Always call useSelector unconditionally
  const reduxSettingsConfig = useSelector(configSettingsSelector);
  // Then use props.settingsConfig if available, otherwise use the redux value
  const settingsConfig = props.settingsConfig || reduxSettingsConfig;
  
  const fields = useMemo(() => {
    const empty = EMPTY_BANK_ACCOUNT;
    
    // Get hideFields configuration
    const hideFields = isArray(settingsConfig?.bank?.hideFields)
      ? settingsConfig?.bank?.hideFields
      : [];
      
    // Get explicit fields configuration
    const explicitFields = isArray(settingsConfig?.bank?.fields)
      ? settingsConfig?.bank?.fields
      : [];

    const _fields = [];
    
    // If explicit fields are specified, only use those fields
    if (explicitFields.length > 0) {
      
      // Process explicit fields
      explicitFields.forEach(fieldName => {
        // Skip if in hideFields
        if (hideFields.includes(fieldName)) {
          return;
        }
        
        // Handle complex fields
        if (fieldName === 'owner' && showComplexFields) {
          if (!hideFields?.includes('owner.full_name')) {
            _fields.push(Inputs.owner_full_name);
          }
          if (!hideFields?.includes('owner.first_name')) {
            _fields.push(Inputs.owner_first_name); 
          }
          if (!hideFields?.includes('owner.last_name')) {
            _fields.push(Inputs.owner_last_name);
          }
          if (!hideFields?.includes('owner.email_address')) {
            _fields.push(Inputs.owner_email);
          }
          if (!hideFields?.includes('owner.phone_number')) {
            _fields.push(Inputs.owner_phone);
          }
          if (!hideFields?.includes('owner.company_name')) {
            _fields.push(Inputs.owner_company_name);
          }
          if (!hideFields?.includes('owner.ein_tin')) {
            _fields.push(Inputs.owner_ein_tin);
          }
          if (!hideFields?.includes('owner.cpf_cpnj')) {
            _fields.push(Inputs.owner_cpf_cpnj);
          }
        } else if (fieldName === 'branch_address' && showComplexFields) {
          _fields.push({
            name: 'branch_address.line_1',
            label: t('branch_address_line_1'),
            placeholder: 'e.g. 123 Main St',
          });
          _fields.push({
            name: 'branch_address.city',
            label: t('branch_address_city'),
            placeholder: 'e.g. New York',
          });
          _fields.push({
            name: 'branch_address.country',
            label: t('branch_address_country'),
            type: 'country',
            placeholder: 'e.g. United States',
          });
        } else if (fieldName !== 'metadata') {
          // Regular field
          const field = { ...Inputs?.[fieldName] };
          
          if (!field) {
            return;
          }
          
          // Override specific field labels with translations
          if (fieldName === 'number') {
            field.label = t('account_number');
          } else if (fieldName === 'name') {
            field.label = t('account_name');
          } else {
            field.label = t(fieldName);
          }
          
          _fields.push(field);
        }
      });
    } else {
      // No explicit fields specified, use all fields from EMPTY_BANK_ACCOUNT
      
      Object.keys(empty).forEach(key => {
        // Skip metadata as it's not for user input
        if (key === 'metadata') {
          return;
        } else if (showComplexFields && key === 'owner') {
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.full_name')) {
            const ownerFullNameField = {
              name: 'owner.full_name',
              label: 'account_holder_name',
              placeholder: 'e.g. John Smith',
              title: 'Account holder name'
            };
            _fields.push(ownerFullNameField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.first_name')) {
            const ownerFirstNameField = {
              name: 'owner.first_name',
              label: 'account_holder_name',
              placeholder: 'e.g. John',
              title: 'Account holder name'
            };
            _fields.push(ownerFirstNameField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.last_name')) {
            const ownerLastNameField = {
              name: 'owner.last_name',
              label: 'account_holder_name',
              placeholder: 'e.g. Smith',
              title: 'Account holder name'
            };
            _fields.push(ownerLastNameField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.email_address')) {
            const ownerEmailField = {
              name: 'owner.email_address',
              label: 'owner_email',
              type: 'email',
              placeholder: 'e.g. john@example.com',
              title: 'Owner email'
            };
            _fields.push(ownerEmailField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.phone_number')) {
            const ownerPhoneField = {
              name: 'owner.phone_number',
              label: 'owner_phone',
              type: 'mobile',
              placeholder: 'e.g. +1234567890',
              title: 'Owner phone'
            };
            _fields.push(ownerPhoneField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.company_name')) {
            const ownerCompanyField = {
              name: 'owner.company_name',
              label: 'company_name',
              placeholder: 'e.g. Acme Corp',
              title: 'Company name'
            };
            _fields.push(ownerCompanyField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.ein_tin')) {
            const ownerEinField = {
              name: 'owner.ein_tin',
              label: 'ein_tin',
              placeholder: 'e.g. 12-3456789',
              title: 'EIN/TIN'
            };
            _fields.push(ownerEinField);
          }
          if (!hideFields?.includes('owner') && !hideFields?.includes('owner.cpf_cpnj')) {
            const ownerCpfField = {
              name: 'owner.cpf_cpnj',
              label: 'cpf_cpnj',
              placeholder: 'e.g. 123.456.789-00',
              title: 'CPF/CPNJ'
            };
            _fields.push(ownerCpfField);
          }
          
          // Owner address fields are NOT included by default
          // They should only be included when explicitly specified in the configuration
          // Nothing to add here
        } else if (showComplexFields && key === 'branch_address') {
          if (!hideFields?.includes('branch_address') && !hideFields?.includes('branch_address.line_1')) {
            const branchLine1Field = {
              name: 'branch_address.line_1',
              label: t('branch_address_line_1'),
              placeholder: 'e.g. 123 Main St',
            };
            _fields.push(branchLine1Field);
          }
          if (!hideFields?.includes('branch_address') && !hideFields?.includes('branch_address.city')) {
            const branchCityField = {
              name: 'branch_address.city',
              label: t('branch_address_city'),
              placeholder: 'e.g. New York',
            };
            _fields.push(branchCityField);
          }
          if (!hideFields?.includes('branch_address') && !hideFields?.includes('branch_address.country')) {
            const branchCountryField = {
              name: 'branch_address.country',
              label: t('branch_address_country'),
              type: 'country',
              placeholder: 'e.g. United States',
            };
            _fields.push(branchCountryField);
          }
        } else if (key !== 'owner' && key !== 'branch_address' && !hideFields?.includes(key)) {
          const field = { ...Inputs?.[key] };
          
          if (!field) {
            return;
          }
          
          // Override specific field labels with translations
          if (key === 'number') {
            field.label = t('account_number');
          } else if (key === 'name') {
            field.label = t('account_name');
          } else {
            field.label = t(key);
          }
          
          _fields.push(field);
        } else {
        }
      });
    }

    
    // Filter out any undefined fields
    return _fields.filter(field => field && field.name);
  }, [settingsConfig, t, showComplexFields]);

  const handleSubmit = async formikProps => {
    const { type, onSaveSuccess } = props;

    const { values, setSubmitting, setStatus } = formikProps;
    const newCurrencies = values.currencies;
    setSubmitting(true);
    try {
      // Filter out read-only fields and only include editable fields
      const editableFields = {
        name: values.name,
        number: values.number,
        type: values.type,
        bank_name: values.bank_name,
        bank_code: values.bank_code,
        branch_code: values.branch_code,
        swift: values.swift,
        iban: values.iban,
        // Include routing_number if it exists in the form values
        ...(values.routing_number && { routing_number: values.routing_number }),
        // Include branch_address if it exists
        ...(values.branch_address && { branch_address: values.branch_address }),
        // Include owner if it exists
        ...(values.owner && { owner: values.owner })
      };

      // Include any nested owner fields if they exist
      Object.keys(values).forEach(key => {
        if (key.startsWith('owner.') || key.startsWith('branch_address.')) {
          editableFields[key] = values[key];
        }
      });

      const resp = await updateItem('bankAccounts', editableFields, values.id);
      const oldCurrencies = resp.currencies.map(item => item.code);
      const toAdd = difference(newCurrencies, oldCurrencies);
      let i = 0;
      for (i = 0; i < toAdd.length; i++) {
        await addBankAccountCurrency(resp.id, toAdd[i]);
      }
      const toRemove = difference(oldCurrencies, newCurrencies);
      for (i = 0; i < toRemove.length; i++) {
        await deleteBankAccountCurrency(resp.id, toRemove[i]);
      }
      onSaveSuccess(type, resp);
    } catch (error) {
      console.log('TCL: error', error);
      setStatus({ error: error.message });
    }
    setSubmitting(false);
  };

  const contentRender = () => {
    const { item, onDetailClose, initialCurrency, noPadding } = props;

    // Get hideFields and explicitFields configuration
    const hideFields = isArray(settingsConfig?.bank?.hideFields)
      ? settingsConfig?.bank?.hideFields
      : [];
      
    const explicitFields = isArray(settingsConfig?.bank?.fields)
      ? settingsConfig?.bank?.fields
      : [];
    

    // Create a properly structured initialValues object with nested fields
    let initialValues = {};
    
    if (item) {
      // If editing an existing item
      initialValues = { 
        ...item, 
        currencies: item.currencies.map(item => item.code),
        // Ensure nested fields are properly initialized
        'owner.full_name': item.owner?.full_name || '',
        'owner.first_name': item.owner?.first_name || '',
        'owner.last_name': item.owner?.last_name || '',
        'owner.email_address': item.owner?.email_address || '',
        'owner.phone_number': item.owner?.phone_number || '',
        'owner.company_name': item.owner?.company_name || '',
        'owner.ein_tin': item.owner?.ein_tin || '',
        'owner.cpf_cpnj': item.owner?.cpf_cpnj || '',
        'owner.address.line_1': item.owner?.address?.line_1 || '',
        'owner.address.line_2': item.owner?.address?.line_2 || '',
        'owner.address.city': item.owner?.address?.city || '',
        'owner.address.state_province': item.owner?.address?.state_province || '',
        'owner.address.country': item.owner?.address?.country || '',
        'owner.address.postal_code': item.owner?.address?.postal_code || '',
        'owner.address.state_code': item.owner?.address?.state_code || '',
        'branch_address.line_1': item.branch_address?.line_1 || '',
        'branch_address.city': item.branch_address?.city || '',
        'branch_address.country': item.branch_address?.country || '',
        // Also initialize the field format used in inputs (for owner_full_name)
        'owner_full_name': item.owner?.full_name || '',
      };
      
    } else {
      // If creating a new item
      initialValues = {
        ...EMPTY_BANK_ACCOUNT,
        currencies: initialCurrency ? [initialCurrency] : [],
        // Initialize nested fields with empty strings
        'owner.full_name': '',
        'owner.first_name': '',
        'owner.last_name': '',
        'owner.email_address': '',
        'owner.phone_number': '',
        'owner.company_name': '',
        'owner.ein_tin': '',
        'owner.cpf_cpnj': '',
        'owner.address.line_1': '',
        'owner.address.line_2': '',
        'owner.address.city': '',
        'owner.address.state_province': '',
        'owner.address.country': '',
        'owner.address.postal_code': '',
        'owner.address.state_code': '',
        'branch_address.line_1': '',
        'branch_address.city': '',
        'branch_address.country': '',
      };
      
    }

    let schema = {};
    
    // Only validate currencies since that's what the submit handler already checks
    schema.currencies = yup.array().min(1, 'At least one currency is required');
    
    const formSchema = yup.object().shape(schema);

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={formSchema}
        enableReinitialize={true}
        validateOnMount={true}
        onSubmit={(values, formikBag) => {
          const processedValues = { ...values };
          
          // Process owner fields - check for both nested fields and config-style fields
          if (values['owner.full_name'] || values['owner.first_name'] || values['owner.last_name'] || 
              values['owner.email_address'] || values['owner.phone_number'] || values['owner.company_name'] ||
              values['owner.ein_tin'] || values['owner.cpf_cpnj'] ||
              values['owner.address.line_1'] || values['owner.address.line_2'] || 
              values['owner.address.city'] || values['owner.address.state_province'] || 
              values['owner.address.country'] || values['owner.address.postal_code'] || 
              values['owner.address.state_code'] ||
              values['owner_full_name']) {
            
            // Initialize owner object if it doesn't exist
            processedValues.owner = processedValues.owner || {};
            
            // Add basic owner fields - map config-style fields to API structure
            processedValues.owner = {
              ...processedValues.owner,
              // Map owner_full_name (from config) to owner.full_name (API structure)
              full_name: values['owner_full_name'] || values['owner.full_name'] || '',
              first_name: values['owner.first_name'] || '',
              last_name: values['owner.last_name'] || '',
              email_address: values['owner.email_address'] || '',
              phone_number: values['owner.phone_number'] || '',
              company_name: values['owner.company_name'] || '',
              ein_tin: values['owner.ein_tin'] || '',
              cpf_cpnj: values['owner.cpf_cpnj'] || '',
            };
            
            // Process owner address fields - check for both nested fields and config-style fields
            if (values['owner.address.line_1'] || values['owner.address.line_2'] || 
                values['owner.address.city'] || values['owner.address.state_province'] || 
                values['owner.address.country'] || values['owner.address.postal_code'] || 
                values['owner.address.state_code'] ||
                values['owner_address_line_1'] || values['owner_address_line_2'] ||
                values['owner_address_city'] || values['owner_address_state_province'] ||
                values['owner_address_country'] || values['owner_address_postal_code'] ||
                values['owner_address_state_code']) {
              
              // Initialize address object if it doesn't exist
              processedValues.owner.address = processedValues.owner.address || {};
              
              // Map config-style fields to API structure
              processedValues.owner.address = {
                ...processedValues.owner.address,
                line_1: values['owner_address_line_1'] || values['owner.address.line_1'] || '',
                line_2: values['owner_address_line_2'] || values['owner.address.line_2'] || '',
                city: values['owner_address_city'] || values['owner.address.city'] || '',
                state_province: values['owner_address_state_province'] || values['owner.address.state_province'] || '',
                country: values['owner_address_country'] || values['owner.address.country'] || '',
                postal_code: values['owner_address_postal_code'] || values['owner.address.postal_code'] || '',
                state_code: values['owner_address_state_code'] || values['owner.address.state_code'] || '',
              };
            }
          }
          
          // Process branch address fields
          if (values['branch_address.line_1'] || values['branch_address.city'] || 
              values['branch_address.country']) {
            processedValues.branch_address = {
              ...(processedValues.branch_address || {}),
              line_1: values['branch_address.line_1'] || '',
              city: values['branch_address.city'] || '',
              country: values['branch_address.country'] || '',
            };
          }
          
          // Clean up flattened fields
          delete processedValues['owner.full_name'];
          delete processedValues['owner.first_name'];
          delete processedValues['owner.last_name'];
          delete processedValues['owner.email_address'];
          delete processedValues['owner.phone_number'];
          delete processedValues['owner.company_name'];
          delete processedValues['owner.ein_tin'];
          delete processedValues['owner.cpf_cpnj'];
          delete processedValues['owner.address.line_1'];
          delete processedValues['owner.address.line_2'];
          delete processedValues['owner.address.city'];
          delete processedValues['owner.address.state_province'];
          delete processedValues['owner.address.country'];
          delete processedValues['owner.address.postal_code'];
          delete processedValues['owner.address.state_code'];
          delete processedValues['branch_address.line_1'];
          delete processedValues['branch_address.city'];
          delete processedValues['branch_address.country'];
          
          // Also remove config-style fields after processing
          delete processedValues['owner_full_name'];
          delete processedValues['owner_address_line_1'];
          delete processedValues['owner_address_line_2'];
          delete processedValues['owner_address_city'];
          delete processedValues['owner_address_state_province'];
          delete processedValues['owner_address_country'];
          delete processedValues['owner_address_postal_code'];
          delete processedValues['owner_address_state_code'];
          
          handleSubmit({ values: processedValues, ...formikBag });
        }}>
        {formikProps => {
          const nestedValues = {
            ...formikProps.values,
            'owner.full_name': formikProps.values.owner?.full_name || '',
            'owner.first_name': formikProps.values.owner?.first_name || '',
            'owner.last_name': formikProps.values.owner?.last_name || '',
            'owner.email_address': formikProps.values.owner?.email_address || '',
            'owner.phone_number': formikProps.values.owner?.phone_number || '',
            'owner.company_name': formikProps.values.owner?.company_name || '',
            'owner.ein_tin': formikProps.values.owner?.ein_tin || '',
            'owner.cpf_cpnj': formikProps.values.owner?.cpf_cpnj || '',
            'owner.address.line_1': formikProps.values.owner?.address?.line_1 || '',
            'owner.address.line_2': formikProps.values.owner?.address?.line_2 || '',
            'owner.address.city': formikProps.values.owner?.address?.city || '',
            'owner.address.state_province': formikProps.values.owner?.address?.state_province || '',
            'owner.address.country': formikProps.values.owner?.address?.country || '',
            'owner.address.postal_code': formikProps.values.owner?.address?.postal_code || '',
            'owner.address.state_code': formikProps.values.owner?.address?.state_code || '',
            'branch_address.line_1': formikProps.values.branch_address?.line_1 || '',
            'branch_address.city': formikProps.values.branch_address?.city || '',
            'branch_address.country': formikProps.values.branch_address?.country || '',
          };
          
          return (
            <Form style={{ width: '100%' }}>
              <View ph={noPadding ? 0 : 2} w={'100%'}>
                
                {/* Regular fields */}
                {fields.map(
                  field =>
                    field?.name !== 'currencies' && 
                    !field?.name?.startsWith('owner.address.') && (
                      <Input
                        field={field}
                        key={field?.name}
                        formikProps={{
                          ...formikProps,
                          values: nestedValues,
                          // Custom handleChange for nested fields
                          handleChange: e => {
                            const { name, value } = e.target;
                            
                            // For nested fields, use setFieldValue directly
                            if (name && name.includes('.')) {
                              formikProps.setFieldValue(name, value);
                              formikProps.setFieldTouched(name, true, false);
                            } else {
                              formikProps.handleChange(e);
                            }
                          },
                          // Custom setFieldValue for nested fields
                          setFieldValue: (name, value) => {
                            formikProps.setFieldValue(name, value);
                          },
                          // Custom setFieldTouched for nested fields
                          setFieldTouched: (name, touched = true, shouldValidate = true) => {
                            formikProps.setFieldTouched(name, touched, shouldValidate);
                          }
                        }}
                      />
                    ),
                )}

                {/* Direct owner address fields - only render when explicitly included in config */}
                {explicitFields.some(field => field.startsWith('owner_address_') || field === 'owner_address') && (
                  <OwnerAddressFields 
                    formikProps={formikProps} 
                    hideFields={hideFields} 
                    explicitFields={explicitFields} 
                  />
                )}

                <AccountCurrencyList
                  formik
                  setValue={value =>
                    formikProps.setFieldValue('currencies', value)
                  }
                  values={formikProps.values.currencies}
                  item={item}
                />

                <ErrorOutput>
                  {formikProps.status && formikProps.status.error}
                </ErrorOutput>
              </View>
              <PageButtons
                items={[
                  {
                    id: 'cancel',
                    capitalize: true,
                    onPress: onDetailClose,
                    variant: 'text',
                  },
                  {
                    label: 'save',
                    capitalize: true,
                    type: 'submit',
                    disabled: !formikProps.isValid || formikProps.isSubmitting || !formikProps.dirty,
                    loading: formikProps.isSubmitting,
                  },
                ]}
                layout={'material'}
              />
            </Form>
          );
        }}
      </Formik>
    );
  };

  return contentRender();
}

const BankAccountForm = context(_BankAccountForm);

export { BankAccountForm };
