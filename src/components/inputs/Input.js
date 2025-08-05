import React, { useState } from 'react';
import momentTz from 'moment-timezone';
import { getNames, getName, getCode } from 'country-list';
import Flag from 'react-world-flags';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ToggleIcon from 'material-ui-toggle-icon';
import TextField from './TextField';
import { View } from 'components/layout/View';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import FileUpload from './NewFileUpload';
import DualIconUpload from './DualIconUpload';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DualColorSelector from './DualColorSelector';
import DocumentUpload from './DocumentUpload/index';
import LocationInput from './LocationInput';
import SingleImageUpload from './SingleImageUpload';
import Dropdown from './Dropdown';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import makeStyles from '@material-ui/styles/makeStyles';
import ErrorOutput from 'components/outputs/Error';
import RadioSelector from './RadioSelector';
import { standardizeString } from 'util/general';
import Icon from 'components/outputs/Icon';
import MobileInput from './PhoneInput';
import MobileVerification from './MobileVerification';
import { orderBy } from 'lodash';
import Output from 'components/outputs/Output';
import Group from 'components/form/Group';
import { useTranslation } from 'react-i18next';
import IDNumberInput from './IDNumberInput';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';
import useCapsLock from 'hooks/capsLock';
import useCapsLockField from 'hooks/useCapsLockField';
import useI18Language from 'hooks/useI18Language';
import EmailVerify from './EmailVerify';
import OnboardingDocumentUpload from './OnboardingDocumentUpload';
import MobileVerify from './MobileVerify';
import AddressOnboarding from './AddressOnboarding';
import OnboardingUserStatus from './OnboardingUserStatus';
import Selector from './Selector';

const Input = props => {
  return <FormikInput {...props} />;
};

const FormikInput = ({
  field,
  formikProps,
  onChange,
  endAdornment,
  startAdornment,
  setAwaiting,
  locales,
  containerStyle = {},
  FormHelperTextProps,
  languageContext = {},
  ...restProps
}) => {
  const { t } = useTranslation(['common']);
  const classes = inputUseStyles();
  if (!field) {
    return null;
  }
  const {
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleBlur,
  } = formikProps;

  let { type, name, helper, id, label, disabled, placeholder } = field;
  const { onFileLoad } = values;

  if (!name && id) {
    name = id;
  }
  
  // For nested fields, extract the value directly from values
  let value;
  if (name && name.includes('.')) {
    // Handle nested fields by traversing the object path
    const parts = name.split('.');
    let current = values;
    for (const part of parts) {
      current = current?.[part];
      if (current === undefined) {
        current = '';
        break;
      }
    }
    value = current;
  } else {
    // For regular fields, use the standard approach
    value = values?.[name] ?? '';
  }
  
  // Similarly handle errors and touched state for nested fields
  let error;
  let touch;
  if (name && name.includes('.')) {
    // For nested fields, check if there's an error with this exact path
    error = errors?.[name] ?? '';
    touch = touched?.[name] ?? false;
  } else {
    error = errors?.[name] ?? '';
    touch = touched?.[name] ?? false;
  }
  
  const showError = error && touch;

  const languageLabel =
    typeof (label ?? name) === 'string'
      ? t(name ?? label, languageContext)
      : label ?? name;
  const languagePlaceholder = t(placeholder);
  const languageHelper = t(helper);

  const fieldConfig = {
    ...field,
    name,
    label: languageLabel,
    placeholder: languagePlaceholder,
    id: name,
    value,
    type,
    fullWidth: true,
    required: field?.validation?.required === true,
    onChange: e => {
      // For nested fields, use setFieldValue directly
      if (name.includes('.')) {
        setFieldValue(name, e.target.value);
        setFieldTouched(name, true, false);
      } else if (onChange) {
        onChange(e);
      } else if (handleChange) {
        handleChange(e);
      }
    },
    onBlur: e => {
      // For nested fields, ensure touched state is updated
      if (name && name.includes('.')) {
        setFieldTouched(name, true, false);
      }
      if (handleBlur) {
        handleBlur(e);
      }
    },
    error: Boolean(showError),
    helperText: showError ? error : languageHelper ? languageHelper : '',
    disabled: isSubmitting || disabled,
    InputProps: { endAdornment, startAdornment, autoComplete: 'new-password' },
    inputProps: { autoComplete: 'new-password' },
    FormHelperTextProps,
    InputLabelProps: {
      classes: {
        asterisk: classes.asterisk,
      },
    },
  };
  if (onFileLoad) fieldConfig['onFileLoad'] = onFileLoad;

  if (type === 'date') {
    delete fieldConfig.type;
    fieldConfig.value = value ? moment(value) : null;
  }

  if (type === 'birth_date' && !formikProps.initialValues?.birth_date) {
    formikProps.initialValues.birth_date = moment(new Date()).format(
      'YYYY-MM-DD',
    );
  }

  switch (type) {
    case 'output':
      return (
        <View mb={1.5} pt={0.5} w="100%">
          <Group>
            <View pb={0.5} pt={0.5} w="100%">
              <Output {...field} />
            </View>
          </Group>
        </View>
      );
    case 'password':
      return <Password {...fieldConfig} />;
    case 'select':
    case 'selector':
      let items =
        field?.options?.map(item => {
          const value = item?.value ?? item;
          return { value, label: item?.label ?? standardizeString(value) };
        }) ?? [];
      if (items.length > 4 || type === 'selector') {
        return <Selector {...restProps} {...fieldConfig} options={items} />;
      } else {
        return (
          <RadioSelector {...restProps} {...fieldConfig} options={items} />
        );
      }
    case 'dropdown':
      return (
        <View pt={0.25} w={'100%'} pb={0.75}>
          <Dropdown
            {...fieldConfig}
            onChange={value => setFieldValue(name, value)}
            {...restProps}
          />
        </View>
      );
    case 'country':
    case 'nationality':
    case 'residency':
      return (
        <Country
          {...fieldConfig}
          setFieldValue={setFieldValue}
            {...restProps}
          />
      );
    case 'timezone':
      return <Timezone {...restProps} {...fieldConfig} />;
    case 'checkbox':
    case 'boolean':
      return <MyCheckbox {...fieldConfig} setFieldValue={setFieldValue} />;
    case 'switch':
      return <MySwitch {...fieldConfig} setFieldValue={setFieldValue} />;
    case 'date':
    case 'birth_date':
      return (
        <View mv={0.25} w={'100%'}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              margin="dense"
              inputVariant="outlined"
              format="DD/MM/YYYY"
              openTo="year"
              views={['year', 'month', 'date']}
              {...fieldConfig}
              onChange={value =>
                setFieldValue(name, moment(value).format('YYYY-MM-DD'))
              }
            />
          </MuiPickersUtilsProvider>
        </View>
      );
    case 'mobile':
      return <MobileInput {...restProps} {...fieldConfig} />;
    case 'verify_mobile':
      return (
        <MobileVerification
          {...fieldConfig}
          onChange={value => setFieldValue(name, value)}
          formikProps={formikProps}
        />
      );
    case 'upload':
      return (
        <FileUpload
          {...fieldConfig}
          onFileLoad={files => setFieldValue(name, files)}
        />
      );
    case 'document_upload':
      return (
        <DocumentUpload
          {...fieldConfig}
          // onFileLoad={files => setFieldValue(name, files)}
        />
      );
    case 'profile_upload':
      const existingProfileUrl = restProps?.context?.profile?.profile;
      return (
        <SingleImageUpload
          {...fieldConfig}
          setValue={setFieldValue}
          existing={existingProfileUrl}
        />
      );
    case 'dual_color_select':
      return (
        <DualColorSelector
          {...fieldConfig}
          onChange={value => setFieldValue(name, value)}
        />
      );
    case 'dual_icon_upload':
      return (
        <DualIconUpload
          {...fieldConfig}
          onChange={value => setFieldValue(name, value)}
        />
      );
    case 'location':
      return (
        <View pt={0.25} w={'100%'} pb={0.75}>
          <LocationInput
            {...fieldConfig}
            onChange={value => setFieldValue(name, value)}
            setAwaiting={value => setAwaiting && setAwaiting(value)}
          />
        </View>
      );
    case 'autocomplete':
      return (
        <View mv={0.25} w={'100%'}>
          <Autocomplete
            {...fieldConfig}
            {...restProps}
            autoComplete
            getOptionLabel={option =>
              typeof option === 'string'
                ? fieldConfig.options.find(x => x.value === option)?.label
                : option.label
            }
            getOptionSelected={(option, value) =>
              Boolean(option.value === value)
            }
            onChange={(event, option) => {
              setFieldValue(name, option?.value ?? '');
            }}
            renderInput={params => (
              <TextField
                {...params}
                error={fieldConfig.error}
                helperText={fieldConfig.helperText}
                label={fieldConfig?.label}
                variant="outlined"
                required={fieldConfig.required}
                InputLabelProps={fieldConfig.InputLabelProps}
              />
            )}
          />
        </View>
      );
    case 'id_number':
      return (
        <View mv={0.25} w={'100%'}>
          <IDNumberInput {...fieldConfig} {...restProps} values={values} />
        </View>
      );
    case 'onboarding_email':
      return (
        <EmailVerify
          {...fieldConfig}
          {...restProps}
          values={values}
          setFieldValue={setFieldValue}
        />
      );
    case 'onboarding_mobile':
      return (
        <MobileVerify
          {...fieldConfig}
          {...restProps}
          values={values}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
        />
      );
    case 'onboarding_document':
      return (
        <OnboardingDocumentUpload
          {...fieldConfig}
          setFieldValue={setFieldValue}
          values={values}
          user={restProps?.context?.user}
        />
      );
    case 'onboarding_address':
      return (
        <AddressOnboarding
          {...fieldConfig}
          setFieldValue={setFieldValue}
          values={values}
          user={restProps?.context?.user}
          context={restProps?.context}
        />
      );
    case 'onboarding_user_status':
      return (
        <OnboardingUserStatus
          {...fieldConfig}
          setFieldValue={setFieldValue}
          values={values}
          user={restProps?.context?.user}
        />
      );
    default:
      return (
        <View style={{ paddingBottom: 0, width: '100%' }}>
          <Basic {...fieldConfig} containerStyle={containerStyle} />
        </View>
      );
  }
};

const inputUseStyles = makeStyles(theme => ({
  asterisk: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
}));

export default Input;

const Basic = ({ containerStyle, ...restProps }) => {
  if (restProps?.hasOwnProperty('endAdornment')) delete restProps.endAdornment;

  // Extract necessary props for direct handling
  const { name, value, formikProps, onChange } = restProps;
  
  // Create a direct change handler
  const handleDirectChange = (e) => {
    // Check if name is defined
    if (!name) {
      console.log('Warning: Field name is undefined in handleDirectChange');
      // Still call the original onChange if provided
      if (onChange) {
        onChange(e);
      }
      return;
    }
    
    
    // If formikProps is available, use it to update the field value
    if (formikProps && formikProps.setFieldValue) {
      formikProps.setFieldValue(name, e.target.value);
      if (formikProps.setFieldTouched) {
        formikProps.setFieldTouched(name, true, false);
      }
    }
    
    // Call the original onChange if provided
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <View mv={0.25} w={'100%'} style={containerStyle}>
      <TextField
        margin="dense"
        inputProps={{ autoComplete: 'new-password' }}
        variant={'outlined'}
        {...restProps}
        onChange={handleDirectChange}
      />
    </View>
  );
};

export { Basic };

const Timezone = props => {
  const timezones = momentTz.tz.names();
  const items = timezones
    ? timezones.map(item => {
        return {
          label: item,
          value: item,
          key: item,
        };
      })
    : [];
  const tempValue = items.find(item => item.value === props.value);
  return (
    <div style={{ paddingBottom: 0, width: '100%' }}>
      <Autocomplete
        {...props}
        value={tempValue}
        autoComplete
        options={items}
        getOptionLabel={option =>
          typeof option === 'string'
            ? items.find(x => x.value === option)?.label
            : option.label
        }
        getOptionSelected={(option, value) => Boolean(option.value === value)}
        onChange={(event, option) =>
          props.setFieldValue(
            props.name,
            option && option.value ? option.value : option ? option : '',
          )
        }
        renderInput={params => (
          <TextField
            {...params}
            error={props.error}
            label={'Timezone'}
            variant="outlined"
            required={props?.required}
          />
        )}
      />
    </div>
  );
};

export const Country = props => {
  const countries = getNames();
  const returnCode = props?.value?.length === 2;
  const value = returnCode ? getName(props.value) : props.value;
  const company = useSelector(currentCompanySelector);
  const { t } = useTranslation(['common']);
  const classes = inputUseStyles();

  const nationalities = (company?.settings?.nationalities ?? []).map(item =>
    getName(item),
  );
  
  const residencies = (company?.settings?.residencies ?? []).map(item =>
    getName(item),
  );

  const items = orderBy(
    countries
      ? (
          (nationalities?.length && props.name === 'nationality' ? nationalities : 
          (residencies?.length && props.name === 'residency' ? residencies : 
          countries))
        ).map(item => {
          const code = getCode(item);
          return {
            label: item,
            value: item,
            key: item,
            code: code?.toLowerCase(),
          };
        })
      : [],
    'value',
  );

  return (
    <View mv={0.25} w={'100%'} style={{ width: '100%' }}>
      <Autocomplete
        {...props}
        id={'field1'}
        value={value}
        options={items}
        fullWidth
        style={{ width: '100%' }}
        getOptionLabel={option =>
          typeof option === 'string'
            ? items.find(x => x.value === option)?.label
            : option.label
        }
        getOptionSelected={(option, value) => Boolean(option.value === value)}
        onChange={(event, option) =>
          props.setFieldValue(
            props.name,
            option && option.value
              ? returnCode
                ? getCode(option.value)
                : option.value
              : option
              ? option
              : '',
          )
        }
        renderOption={option => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Flag
              code={option.code}
              style={{ marginRight: 10, width: 20, height: 15 }}
            />
            {option.label}
          </div>
        )}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            style={{ width: '100%' }}
            label={t(props.label ?? 'residency')}
            placeholder={t('select_country')}
            required={props?.required}
            error={props?.error}
            helperText={props?.helperText ? t(props?.helperText) : ''}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'off',
              form: {
                autocomplete: 'off',
              },
            }}
            variant="outlined"
            InputLabelProps={{
              classes: {
                asterisk: classes.asterisk,
              },
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: value && (
                <Flag
                  code={getCode(value).toLowerCase()}
                  style={{
                    marginRight: 5,
                    width: 25,
                    height: 25,
                    marginLeft: 10,
                  }}
                />
              ),
            }}
          />
        )}
      />
    </View>
  );
};

function Password(props) {
  const { warningContent } = useCapsLock(document);
  const [showPassword, setShowPassword] = useState(false);
  const { focused, handleFocus, handleBlur } = useCapsLockField({
    onBlur: props.onBlur,
  });

  const toggleVisibility = () => setShowPassword(!showPassword);

  const handleButtonMouseDown = e => e.preventDefault();

  const type = showPassword ? 'text' : 'password';
  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex="-1"
        onClick={toggleVisibility}
        onMouseDown={handleButtonMouseDown}
        disabled={false}>
        <ToggleIcon
          on={!showPassword}
          onIcon={<Visibility />}
          offIcon={<VisibilityOff />}
        />
      </IconButton>
    </InputAdornment>
  );
  return (
    <View>
      <Basic
        {...props}
        type={type}
        InputProps={{ endAdornment }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {focused && warningContent}
    </View>
  );
}

const MyCheckbox = props => {
  const { getI18Translation } = useI18Language();
  const {
    name,
    value,
    icon,
    label = '',
    setFieldValue,
    error,
    languageContext = {},
    alignCenter,
  } = props;
  const translatedLabel = getI18Translation(label, languageContext);

  const classes = useStyles(props);
  return (
    <div key={name} className={classes.container}>
      <FormControlLabel
        variant="outlined"
        control={
          <div className={classes.checkbox}>
            <Checkbox
              checked={value}
              onChange={() => setFieldValue(name, !value)}
              value={name}
              color="primary"
              checkedIcon={<CheckBoxOutlinedIcon />}
            />
          </div>
        }
        classes={{
          label:
            translatedLabel.length > 30 ? classes.labelLong : classes.label,
          root: classes.root,
        }}
        label={
          icon ? (
            <div className={classes.icon}>
              <Icon
                icon={icon}
                size={24}
                inverted
                style={{ marginRight: 12, marginLeft: 4 }}
              />
              {translatedLabel}
            </div>
          ) : (
            translatedLabel
          )
        }
      />

      {error ? <ErrorOutput>{error}</ErrorOutput> : null}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  label: {
    paddingTop: ({ icon, alignCenter }) => {
      if (icon) return 0;
      return alignCenter ? 0 : 10;
    },
    fontSize: 16,
    display: ({ alignCenter }) => alignCenter ? 'flex' : 'block',
    alignItems: ({ alignCenter }) => alignCenter ? 'center' : 'flex-start',
  },
  icon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelLong: {
    paddingTop: ({ icon, alignCenter }) => {
      if (icon) return 0;
      return alignCenter ? 0 : 7;
    },
    fontSize: 14,
  },
  container: {
    paddingTop: ({ noPadding }) => (noPadding ? 0 : theme.spacing(0.5)),
    paddingBottom: ({ noPadding }) => (noPadding ? 0 : theme.spacing(0.5)),
    flexDirection: 'row',
    alignItems: ({ alignCenter }) => alignCenter ? 'center' : 'flex-start',
  },
  checkbox: { paddingLeft: theme.spacing(0), marginTop: 0 }, //2
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: ({ alignCenter }) => alignCenter ? 'center' : 'flex-start',
  },
}));

export { MyCheckbox };

const MySwitch = props => {
  const { name, value, label, setFieldValue, error } = props;
  return (
    <View p={0.25}>
      <FormControlLabel
        labelPlacement="end"
        control={
          <Switch
            color="primary"
            // label={label}
            value={value}
            onChange={() => setFieldValue(!value)}
          />
        }
        label={label}
      />
    </View>
  );
};
