import React, { useMemo, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ToggleIcon from 'material-ui-toggle-icon';
import TextField from './TextField';
import { useRehiveContext } from 'contexts';
import { Controller } from 'react-hook-form';
import { validateSSN } from 'util/validation';
import { useTranslation } from 'react-i18next';

export default function IDNumberInput(props) {
  const { t } = useTranslation(['common']);
  const [showSsn, setShowSsn] = useState(false);
  let {
    setFieldValue,
    setValue,
    onChange,
    value,
    name,
    watch,
    setError,
    clearErrors,
    error,
    helperText,
    values,
  } = props;

  if (typeof watch === 'function' && !value) value = watch(name);
  if (typeof watch === 'function') values = watch();

  const { user } = useRehiveContext();
  const isUsNationality =
    (values?.nationality
      ? values?.nationality === 'US' ||
        values?.nationality === 'United States of America'
      : user?.nationality === 'US') ?? false;

  function handleChange(e) {
    let { value: inputValue } = e?.target;
    let newSSN = '';
    const tempValue =
      (value?.[value?.length - 1] === '-'
        ? value?.slice(0, value.length - 1)
        : value) ?? '';
    if (inputValue.length < tempValue?.length) {
      newSSN = tempValue.slice(0, inputValue.length);
    } else {
      const temp = inputValue.slice(tempValue?.length - inputValue.length);
      newSSN = formatSsn(tempValue + temp);
    }
    const error = validateSSN(newSSN);
    if (typeof setError === 'function') {
      if (error) setError(name, { type: 'manual', message: error });
      else clearErrors(name);
    }

    if (typeof onChange === 'function')
      onChange({ ...e, target: { name, value: newSSN } });
    else if (typeof setFieldValue === 'function') setFieldValue(name, newSSN);
    else if (typeof setValue === 'function') setValue(name, newSSN);
  }

  function toggleVisibility() {
    setShowSsn(!showSsn);
  }

  function handleButtonMouseDown(e) {
    e.preventDefault();
  }

  const endAdornment = (
    <InputAdornment position="end">
      <IconButton
        tabIndex="-1"
        onClick={toggleVisibility}
        onMouseDown={handleButtonMouseDown}
        disabled={false}>
        <ToggleIcon
          on={!showSsn}
          onIcon={<Visibility />}
          offIcon={<VisibilityOff />}
        />
      </IconButton>
    </InputAdornment>
  );

  const ssnOverrides = useMemo(
    () =>
      isUsNationality
        ? {
            label: t('ssn_number'),
            placeholder: 'e.g. 123-45-9000',
            value: formatSsn(value, !showSsn),
            onChange: handleChange,
            InputProps: {
              endAdornment,
            },
          }
        : {},
    [value, showSsn, isUsNationality],
  );

  // useEffect(() => { // TODO: rework this to auto format on nationality change
  //   if (value)
  //     if (isUsNationality) handleChange({ target: { value } });
  //     else {
  //       const newSSN = value.replaceAll('-', '');
  //       if (typeof setFieldValue === 'function') setFieldValue(name, newSSN);
  //       else if (typeof setValue === 'function') setValue(name, newSSN);
  //     }
  // }, [isUsNationality]);

  if (props?.control && isUsNationality) {
    return (
      <Controller
        name="id_number"
        control={props.control}
        render={inputProps => (
          <TextField
            error={error}
            helperText={helperText}
            {...inputProps}
            {...ssnOverrides}
          />
        )}
      />
    );
  }

  return <TextField {...props} {...ssnOverrides} />;
}

const formatSsn = (value, hide) => {
  let ssn = (' ' + value).slice(1);
  return !ssn
    ? ''
    : ssn.length > 11
    ? ssn.substr(0, 11)
    : ssn
        .replace(/[^\d*]/g, '')
        .replace(/^\d{1,5}/, x => (hide ? x.replace(/./g, '*') : x)) ///(?=\d{5})\d/
        .replace(
          /^(.{1,3})(.{1,2})?(.{1,4})?.*$/,
          (_, x, y, z) => x + (y ? `-${y}` : '') + (z ? `-${z}` : ''),
        );
};
