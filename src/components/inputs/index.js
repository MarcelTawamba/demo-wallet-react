import React from 'react';
import TextField from './TextField';
import Checkbox from './CheckboxRHF';
import Switch from './Switch';
import Date from './Date';
import { Box, InputAdornment } from '@material-ui/core';
import * as inputConfigs from 'config/inputs';
import en from 'config/locales/en';
import { standardizeString, mapOptions } from 'util/general';
import RadioSelector from './RadioSelectorNew';
import Password from './Password';
import Selector from './SelectorRHF';
import Info from 'components/outputs/Info';
import { useLanguage } from 'components/contexts/LanguageContext';
import Tooltip from 'components/outputs/Tooltip';
import Output from 'components/common/outputs/Output';
import AddressTypeInput from './AddressTypeInput';
import SingleImageUpload from './SingleImageUpload';
import Country from './Country';
import Timezone from './TimeZone';
import MobileInputRHF from './MobileInputRHF'; // Add missing import
import Autocomplete from './Autocomplete';
import { useTranslation } from 'react-i18next'; // Remove useFormContext from here
import IDNumberInput from './IDNumberInput';
import { Controller, useFormContext } from 'react-hook-form'; // Import useFormContext here

function parseError(error, config = {}) {
  const { type = '', message } = error;
  const amount = config?.[type];
  const errorText = message
    ? message
    : (en[type] ?? type) +
      (amount && typeof amount !== 'boolean' ? ': ' + amount : '');
  return errorText;
}

export default function Input(props) {
  const { t } = useTranslation(['common']);
  let {
    register,
    control,
    errors,
    config,
    touched,
    defaultValue,
    defaultValues,
    inputs,
    disabled,
    endAdornment,
    setValue,
    locales,
    languageContext = {},
    name: nameFromProps, // Rename incoming name prop
    form: formFromProps, // Rename incoming form prop
    ...restProps
  } = props;

  // Use context directly IF form prop wasn't passed
  const contextMethods = useFormContext();
  const form = formFromProps || contextMethods; // Prioritize prop, fallback to context

  // Check if form is still undefined (e.g., outside Provider AND no prop)
  if (!form) {
    console.error(
      'Input component requires form prop or to be wrapped in FormProvider context',
    );
    // Optionally return null or a placeholder to prevent crashing
    return null;
  }

  // Now safely destructure - form is guaranteed to be an object
  const { watch, register: formRegister } = form; // Destructure watch and register from form

  if (!config) {
    config = inputs?.[nameFromProps ?? props?.variant] ?? null; // Use nameFromProps for lookup
    if (!config) {
      config = inputConfigs?.[nameFromProps ?? props?.variant] ?? {}; // Use nameFromProps for lookup
    }
  }

  if (typeof config === 'function') {
    config = config(props);
  }
  const { lang } = useLanguage();
  let {
    variant = props?.variant,
    type,
    validation = {},
    helper,
    label,
    placeholder,
    noPadding,
    message,
    info,
    InputProps: configInputProps, // Define configInputProps
  } = config;

  // **Prioritize the name passed via props**
  const name = nameFromProps;

  if (!variant) {
    variant = type;
  }
  if (type === 'message') {
    return (
      <Info mb={1} mt={1} variant={variant ?? 'info'}>
        {message}
      </Info>
    );
  }

  const languageLabel = t(label ?? name, languageContext);
  const languagePlaceholder = t(placeholder);
  const languageHelper = t(helper);

  const valid =
    typeof validation === 'function' ? validation(props) : validation;

  // Correctly store the whole object returned by register()
  // Use register from props if available, otherwise use register from form context
  const registerFunc = register || formRegister;
  const rhfRegisterProps = registerFunc ? registerFunc(name, valid) : {};

  const error = errors?.[name] ?? '';
  const touch = touched?.[name] ?? false;
  const showError = Boolean(error && touch);
  const errorText = parseError(error, valid) ?? '';
  const helperText = showError
    ? errorText
    : languageHelper
    ? languageHelper
    : '';

  if (!defaultValue && defaultValues)
    defaultValue = defaultValues?.[name] ?? '';

  const commonControlProps = {
    name,
    control: form.control, // Use form.control instead of control prop
    defaultValue: defaultValues?.[name] ?? config?.defaultValue ?? '',
    rules: valid,
  };

  const commonUiProps = {
    label: languageLabel,
    placeholder: languagePlaceholder,
    error: showError,
    helperText: errorText || languageHelper,
    disabled: disabled,
    required: Boolean(validation?.required),
    fullWidth: true,
    margin: 'dense',
    variant: 'outlined',
    autoComplete: 'off',
  };

  const isRequired = Boolean(validation?.required);

  switch (type || variant) {
    case 'password-new':
      return (
        <Controller
          name={name}
          control={form.control}
          defaultValue={defaultValues?.[name] ?? config?.defaultValue ?? ''}
          rules={validation}
          render={({ field, fieldState: { error } }) => {
            return (
              <Password
                {...commonUiProps}
                {...field}
                name={name}
                error={!!error}
                helperText={error ? error.message : commonUiProps.helperText}
                InputProps={configInputProps}
              />
            );
          }}
        />
      );
    case 'password':
      return (
        <Controller
          name={name}
          control={form.control}
          rules={valid}
          render={({ field, fieldState: { error } }) => (
            <Password
              {...field}
              label={languageLabel}
              placeholder={languagePlaceholder}
              error={!!error}
              helperText={error ? error.message : languageHelper}
              disabled={disabled}
              required={isRequired}
              fullWidth
              margin="dense"
              variant="outlined"
              autoComplete="off"
              InputProps={configInputProps}
            />
          )}
        />
      );
    case 'output':
      return <Output {...config} />; // Output doesn't need RHF props
    case 'mobile':
      // Wrap MobileInputRHF with Controller, consistent with other custom inputs
      return (
        <Controller
          {...commonControlProps} // Pass name, control, rules, defaultValue
          render={({ field }) => (
            <MobileInputRHF
              {...commonUiProps} // Pass label, error, helperText, etc.
              field={field} // Pass the field object from Controller
              // Pass any other specific props MobileInputRHF might need from config/restProps if necessary
              // country={...} // Example if country needed to be passed from config
              watch={watch} // Pass watch
              setValue={setValue} // Pass setValue
            />
          )}
        />
      );
    case 'country':
    case 'residency':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <Country
              {...commonUiProps}
              {...field}
              name={name}
              required={isRequired}
              label={languageLabel}
            />
          )}
        />
      );
    case 'timezone':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <Timezone
              {...commonUiProps}
              {...field}
              name={name}
              required={isRequired}
              label={languageLabel}
            />
          )}
        />
      );
    case 'checkbox':
    case 'boolean':
      // Wrap CheckboxRHF with Controller
      return (
        <Controller
          name={name}
          control={form.control}
          rules={valid}
          defaultValue={defaultValues?.[name] ?? config?.defaultValue ?? false}
          render={({ field: { onChange, value, ref } }) => (
            <Checkbox
              checked={Boolean(value)}
              onChange={onChange}
              inputRef={ref}
              label={languageLabel}
              info={info}
              disabled={disabled}
            />
          )}
        />
      );
    case 'switch':
       // Switch is similar to Checkbox
      return (
        <Controller
          {...commonControlProps}
          render={({ field: { onChange, value, ref } }) => (
            <Switch // Use our Switch component
              checked={Boolean(value)}
              onChange={e => onChange(e.target.checked)}
              inputRef={ref}
              disabled={disabled}
              name={name}
            />
          )}
        />
      );
    case 'date':
      // Use Controller with MuiDatePicker or MuiKeyboardDatePicker
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            // Choose Keyboard or standard DatePicker based on preference
            <Date
              {...commonUiProps}
              {...field} // Pass field props (value, onChange, onBlur)
              format="MM/DD/YYYY" // Example format
              label={languageLabel}
              placeholder={languagePlaceholder}
              required={isRequired}
              // Mui pickers handle errors/helpers slightly differently
              error={showError}
              helperText={errorText || languageHelper}
            />
          )}
        />
      );
    case 'addressType':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <AddressTypeInput
              {...commonUiProps}
              {...field}
              name={name}
              required={isRequired}
              label={languageLabel}
            />
          )}
        />
      );
    case 'autocomplete':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <Autocomplete
              {...commonUiProps}
              control={form.control}
              setValue={form.setValue}
              options={config.options}
              name={name}
              required={isRequired}
              label={languageLabel}
              value={field.value}
              getValues={form.getValues}
            />
          )}
        />
      );
    case 'id_number':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <IDNumberInput
              {...commonUiProps}
              {...field}
              name={name}
              required={isRequired}
              label={languageLabel}
            />
          )}
        />
      );
    case 'select':
      return (
        <Controller
          {...commonControlProps}
          render={({ field }) => (
            <RadioSelector
              {...commonUiProps}
              {...field}
              name={name}
              required={isRequired}
              label={languageLabel}
              options={mapOptions(config.options)}
              onChange={(value) => field.onChange(value)}
              getValues={form.getValues}
            />
          )}
        />
      );
    default:
      // Restore Controller for standard TextField inputs for better RHF integration
      return (
        <Controller
          {...commonControlProps} // name, control, rules, defaultValue
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...commonUiProps} // label, placeholder, error, helperText, etc.
              // Connect Controller's field to TextField
              value={field.value ?? ''} // Ensure controlled component has a value
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              inputRef={field.ref}
              // Keep specific TextField props
              type={type} // Pass type ('email', 'text', 'number', etc.)
              required={isRequired}
              error={!!error} // Use error from fieldState
              helperText={error ? error.message : commonUiProps.helperText}
              // Add multiline properties from config
              multiline={config?.multiline}
              rows={config?.rows}
              rowsMax={config?.rowsMax}
              InputProps={{
                ...(endAdornment && { endAdornment: endAdornment }), // Conditionally add endAdornment
                ...(configInputProps && { ...configInputProps }), // Conditionally spread configInputProps
              }}
            />
          )}
        />
      );
  }

  return (
    <Box
      pt={0.5}
      width={'100%'}
      pb={noPadding ? 0 : variant === 'boolean' ? 0.25 : 0.75}>
    </Box>
  );
}
