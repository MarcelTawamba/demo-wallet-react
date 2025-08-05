import React, { useCallback, useState, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useDropzone } from 'react-dropzone';
import Icon from 'components/outputs/Icon';
import NewIcon from 'components/outputs/NewIcon';
import Input from 'components/inputs';

import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Text from 'components/outputs/Text';
import CloseIcon from '@material-ui/icons/Close';
import Tabs from 'components/menu/TabsNew';
import ErrorOutput from 'components/outputs/Error';

export default function VoucherCodes(props) {
  const { control, register, currencyOptions, defaultValues } = props;
  const classes = useStyles();

  console.log('props', props);
  console.log('control', control);

  // Get the full form methods from context
  const formMethods = useFormContext();
  
  // Use formMethods if available, otherwise fall back to props
  const methods = formMethods || { control, register };
  
  // Safety check - if we don't have the necessary methods, show an error
  if (!methods.control) {
    console.error('VoucherCodes component requires form context or control prop');
    return <ErrorOutput>Form context not available</ErrorOutput>;
  }
  
  const arrayHelpers = useFieldArray({
    control: methods.control || control,
    name: 'voucher_codes',
    keyName: 'rhfId',
  });

  const { setValue, formState, getValues } = methods;
  console.log('formState', formState);
  const { errors } = formState || {};

  const { fields, append, remove } = arrayHelpers;
  useEffect(() => {
    if (fields?.length === 0) {
      append('', true);
    }
  }, [fields]);

  const onDrop = useCallback(acceptedFiles => {
    setValue('vouchers_csv', acceptedFiles?.[0]);
  }, [setValue]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const disableAdd = currencyOptions?.length === fields?.length;

  const file = getValues('vouchers_csv');
  function onClear(e) {
    console.log('onClear -> e', e);
    e && e.preventDefault();
    e && e.stopPropagation();
    setValue('vouchers_csv', null);
  }

  const tabs = [
    {
      label: 'upload_csv',
      value: 'csv',
    },
    {
      label: 'manual_voucher_codes',
      value: 'manual',
    },
  ];

  const [tabId, setTabId] = useState('csv');

  const error =
    errors?.[tabId === 'csv' ? 'vouchers_csv' : 'voucher_codes']?.message ?? '';

  console.log('fields', fields);

  return (
    <>
      <>
        <Tabs
          tabs={tabs}
          tabId={tabId}
          onChange={tabId => setTabId(tabId)}
          defaultTab="csv"
        />
        {tabId === 'csv' ? (
          <div className={classes.container}>
            <Text id="upload_voucher_codes_csv" inline />{' '}
            <a
              href="https://dashboard.rehive.com/assets/files/Voucher%20code%20example.csv"
              target="_blank"
              rel="noopener noreferrer">
              (example.csv)
            </a>
            {file ? (
              <div className={classes.dropArea} {...getRootProps()}>
                <input {...getInputProps()} />
                <IconButton
                  onPress={onClear}
                  noPadding
                  className={classes.icon}>
                  <CloseIcon style={{ color: 'white', fontSize: 18 }} />
                </IconButton>
                {file?.name && <Text align="center" id="file_added" />}
              </div>
            ) : (
              <div className={classes.dropArea} {...getRootProps()}>
                <input {...getInputProps()} />
                <NewIcon
                  icon={'note_add'}
                  circled={false}
                  color={'#848484'}
                  size={30}
                  style={{ margin: 8 }}
                />
                {isDragActive ? (
                  <Text align="center" id="file_dragging" />
                ) : (
                  <Text align="center" id="add_or_drop_csv" />
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {fields && fields.length > 0 ? (
              <ul className={classes.arrayContainer}>
                {fields.map((item, index) => {
                  return (
                    <li className={classes.arrayRow} key={item?.rhfId}>
                      <div className={classes.arrayRow}>
                        <Input
                          register={methods.register || register}
                          control={methods.control || control}
                          config={{
                            name: `voucher_codes[${index}].code`,
                            label: 'Voucher code ' + (index + 1),
                          }}
                          defaultValue={defaultValues?.[index]?.code ?? ''}
                          name={`voucher_codes[${index}].code`}
                        />
                      </div>
                      <div className={classes.remove}>
                        <IconButton
                          noPadding
                          size={16}
                          icon="minus"
                          circled={false}
                          color="error"
                          onClick={() => remove(index)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyListMessage id="no_voucher_codes" />
            )}
            <div className={classes.row}>
              <IconButton
                onClick={() => append('', true)}
                noPadding
                disabled={disableAdd ?? false}>
                <Icon
                  noMi
                  icon="plus"
                  size={16}
                  color={disableAdd ? '#e2e2e2' : 'primary'}
                />
              </IconButton>
            </div>
          </>
        )}
      </>
      <ErrorOutput>{error}</ErrorOutput>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(1),
  },
  remove: {
    marginLeft: theme.spacing(1),
  },
  arrayRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingInlineStart: 0,
    alignItems: 'center',
  },
  arrayContainer: {
    padding: 0,
    margin: 0,
    paddingTop: theme.spacing(1),
  },
  currency: {
    // maxWidth: '40%',
    minWidth: 100,
    paddingRight: theme.spacing(2),
  },

  icon: {
    position: 'absolute',
    right: -5,
    top: -5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    zIndex: 200,
  },
  image: {
    position: 'relative',
    maxHeight: 265,
    maxWidth: 265,
    // width: '100%',
    // height: '100%',
    height: 265,
    width: 265,
  },
  container: {
    // flexDirection: 'column',
    // display: 'flex',
    width: '100%',
    // alignItems: 'center',
    paddingTop: theme.spacing(2),
  },
  dropArea: {
    position: 'relative',
    marginTop: theme.spacing(2),
    // maxHeight: 265,
    maxWidth: 280,
    // width: '100%',
    // height: '100%',
    // height: 265,
    width: '100%',

    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,
    // borderWidth: '2px',
    // borderColor: 'gray',
    // borderStyle: 'dashed',
    padding: theme.spacing(1),
    // paddingRight: theme.spacing(1),
    // paddingTop: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
}));
