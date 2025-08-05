import React, { useState, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { Formik, Form as HtmlForm } from 'formik';
import { get, set, isEmpty, get as lodashGet } from 'lodash'; // Ensure lodashGet is imported

import * as inputs from 'config/inputs';
import { updateItem } from 'util/rehive';
import Input from 'components/inputs/Input';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
// import context from 'components/app/context'; // Remove context HOC import
import Empty from 'config/empty';
import ButtonList from 'components/lists/ButtonList';
import { getName, getCode } from 'country-list';
// import { isBusiness } from 'util/general';
import { useToast } from 'components/contexts/ToastContext'; // Import useToast

// Helper to flatten nested objects
const flattenObject = (obj, parentKey = '', result = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && Object.keys(obj[key]).length > 0) {
        flattenObject(obj[key], newKey, result);
      } else {
        // Only add if value is not an empty object or explicitly null
         if (!(typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && isEmpty(obj[key])) || obj[key] === null) {
           result[newKey] = obj[key];
         }
      }
    }
  }
  return result;
};
// Helper to reconstruct nested objects
const unflattenObject = (obj) => {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      set(result, key, obj[key]);
    }
  }
  // Remove empty address objects if they were created but have no data
  if (result.address && Object.values(result.address).every(v => !v)) {
      delete result.address;
  }
  return result;
};
// Helper to generate field definitions
const generateFields = (emptyObj, profileConfig, parentKey = '', allFields = inputs) => {
  try {
    let fields = [];
    for (const key in emptyObj) {
      if (Object.prototype.hasOwnProperty.call(emptyObj, key)) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        const fieldConfig = get(allFields, currentKey) || get(allFields, key);
        
        if (typeof emptyObj[key] === 'object' && emptyObj[key] !== null && !Array.isArray(emptyObj[key]) && Object.keys(emptyObj[key]).length > 0) {
          fields = fields.concat(generateFields(emptyObj[key], profileConfig, currentKey, allFields));
        } else if (fieldConfig) {
          const fieldDefinition = { ...fieldConfig, name: currentKey };
          if (profileConfig?.hideID && currentKey === 'id_number') {
            continue;
          }
          if (profileConfig?.labelID && currentKey === 'id_number') {
            fieldDefinition.label = profileConfig.labelID;
          }
          fields.push(fieldDefinition);
        } else if (key !== 'address' && key !== 'currency') {
          fields.push({ 
            name: currentKey, 
            label: currentKey.split('.').pop().replace(/_/g, ' '), 
            placeholder: `Enter ${currentKey.split('.').pop().replace(/_/g, ' ')}` 
          });
        }
      }
    }
    return fields;
  } catch (error) {
    // Return empty array to prevent further errors
    return [];
  }
};


const _ProfileForm = props => {
  const {
    type, // Might still be needed by updateItem?
    noPadding,
    onDetailClose, // May need alternative way to close if provided by context/props
    testnet,
    crypto,
    onSaveSuccess, // May need alternative if provided by context/props
    context: propsContext, // Expect context, contains reduxContext passed down
    onSubmit,
    initProfile,
    customFields,
    customButtons,
    hideCompanyForm,
    hidePersonalForm,
    buttonLabel,
    title,
    description,
    renderDescription,
    buttonStyle,
    buttonLayout,
    buttonIcon,
    showSkip,
    profileConfig,
  } = props;

  const { showToast } = useToast(); // Get showToast function

  const profileData = propsContext?.profile?.items; // Use profile.items
  const effectiveType = type ?? 'profile';

  const fields = useMemo(() => {
    const empty = Empty.EMPTY_PROFILE;
    // Pass profileConfig obtained from context
    return generateFields(empty, profileConfig);
  }, [profileConfig]);

  const initialValues = useMemo(() => {
    // Use profileData (profile.items) if available, otherwise default
    const baseValues = profileData ? { ...profileData } : { ...Empty.EMPTY_PROFILE };

    // Convert country/nationality codes to names for display
    if (baseValues.nationality) {
      try { baseValues.nationality = getName(baseValues.nationality) || baseValues.nationality; } catch (e) {}
    }
    
    // Convert residency code to name
    if (baseValues.residency) {
      try { baseValues.residency = getName(baseValues.residency) || baseValues.residency; } catch (e) {}
    }
    
    // Handle address country or top-level country
    const countryField = fields.find(f => f.name.endsWith('.country'));
    // Correctly find the field name, checking for 'address.country' or just 'country'
    const countryFieldName = countryField ? countryField.name : (fields.find(f => f.name === 'country') ? 'country' : null);

    if (countryFieldName) {
        // Use lodashGet to safely access nested country code
        const countryCode = lodashGet(baseValues, countryFieldName);
        if (countryCode) {
            try {
                const countryName = getName(countryCode) || countryCode;
                // Use lodash.set to handle nested path potentially
                set(baseValues, countryFieldName, countryName);
            } catch (e) {}
        }
    }

    // Flatten the initial values
    const flattened = flattenObject(baseValues);
    return flattened;

  }, [profileData, fields]); // Depend on profileData (profile.items) and generated fields


  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    let submissionValues = { ...values };

    try {
      if (submissionValues.nationality) {
        submissionValues.nationality = getCode(submissionValues.nationality) || submissionValues.nationality;
      }
      
      if (submissionValues.residency) {
        submissionValues.residency = getCode(submissionValues.residency) || submissionValues.residency;
      }
      
      const countryField = fields.find(f => f.name.endsWith('.country'));
      const countryFieldName = countryField ? countryField.name : (fields.find(f => f.name === 'country') ? 'country' : null);
      if (countryFieldName && submissionValues[countryFieldName]) {
        submissionValues[countryFieldName] = getCode(submissionValues[countryFieldName]) || submissionValues[countryFieldName];
      }
      if (submissionValues.birth_date && typeof submissionValues.birth_date?.format === 'function') {
         submissionValues.birth_date = submissionValues.birth_date.format('YYYY-MM-DD');
      }

      const unflattenedValues = unflattenObject(submissionValues);
      setSubmitting(true);
      
      const resp = await updateItem(effectiveType, unflattenedValues);

      // Show success toast
      showToast({ 
        text: 'basic_info_edit_success', // Use translation key
        variant: 'success' 
      });

      // Check if onSaveSuccess is a function before calling
      if (typeof onSaveSuccess === 'function') {
        onSaveSuccess(effectiveType, resp);
      }
    } catch (error) {
      setStatus({ error: error.message });
    } finally {
       setSubmitting(false);
    }
  };

  const formSchema = yup.object().shape({});

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={formSchema}
      onSubmit={handleSubmit}
      enableReinitialize // Important to update form when context changes
    >
      {formikProps => (
         <HtmlForm style={{ width: '100%' }}>
           <View pt={1} ph={noPadding ? 0 : 2} w={'100%'}>
             {fields.map((field) => (
               <Input
                 field={field}
                 key={field.name}
                 formikProps={formikProps}
               />
             ))}
             {formikProps.status?.error && (
               <Text p={1} color={'error'} tA={'center'}>
                 {formikProps.status.error}
               </Text>
             )}
           </View>
           <View pt={2} ph={noPadding ? 0 : 2} pb={1} w={'100%'}>
             <ButtonList
               items={[
                 // Remove Cancel button
                 // { label: 'cancel',
                 //   capitalize: true,
                 //   onPress: onDetailClose,
                 //   variant: 'text'
                 // },
                 { label: 'update',
                   capitalize: true,
                   type: 'submit',
                   disabled: !formikProps.isValid || formikProps.isSubmitting,
                   loading: formikProps.isSubmitting,
                   fullWidth: true
                 },
               ]}
               layout={'vertical'}
             />
           </View>
         </HtmlForm>
       )}
    </Formik>
  );
}

// Use the unwrapped component
const ProfileForm = _ProfileForm;

export { ProfileForm };