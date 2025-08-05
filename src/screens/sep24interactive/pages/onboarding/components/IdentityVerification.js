/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DatePicker from 'components/inputs/DateNew';
import { findIndex, omit } from 'lodash';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { makeStyles } from '@material-ui/styles';
// import { createDocumentNew as createDocument } from 'util/rehive';
import { ListItem } from '@material-ui/core';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import TextField from 'components/inputs/TextField';
import FileUpload from 'components/inputs/NewFileUpload';
import document_categories from 'screens/profile/config/document_categories.json';
import { useTranslation } from 'react-i18next';
import lang from 'screens/profile/config/profile_en.json';
import IDNumberInput from 'components/inputs/IDNumberInput';
import { validateSSN } from 'util/validation';

const options = document_categories.proof_of_identity.options.map(op => {
  return {
    id: op.id,
    document_type: op.id,
    // label: lang[op.id],
    label: op.label,
    value: op.id,
    icon: op.icon,
  };
});

export default function IdentityVerification(props) {
  const { t } = useTranslation(['common']);
  const { formikProps, name } = props;
  const { setFieldValue, initialValues, values } = formikProps;

  const [state, setState] = useState('list');
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [idNumber, setIdNumber] = useState(values?.id_number);
  const [idNumberHelperText, setIdNumberHelperText] = useState();
  const [documentFront, setDocumentFront] = useState();
  const [documentBack, setDocumentBack] = useState();
  const [issueDate, setIssueDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [error, setError] = useState();
  const classes = useStyles();
  const isRtl = document.dir === 'rtl';

  useEffect(() => {
    setFieldValue(
      name,
      items.map(item => {
        return omit(item, ['label', 'icon']);
      }),
    );
  }, [items]);

  useEffect(() => {
    mergeInitialDocuments();
  }, [initialValues]);

  useEffect(() => {
    setError(null);
  }, [state]);

  const requiresBack =
    document_categories?.proof_of_identity?.options?.[activeItem]?.requireBack;

  useEffect(() => {
    setFieldValue(
      'uploadedDocuments',
      [documentFront, documentBack]
        .filter(x => x)
        ?.map(x => {
          return {
            name: x.name,
            file: x,
            metadata: {
              issue_date: issueDate,
              expiry_date: expiryDate,
              // side: x.front ? 'front' : 'back',
            },
            type: items[activeItem].document_type,
          };
        }),
    );
  }, [documentFront, documentBack, issueDate, expiryDate]);

  function mergeInitialDocuments() {
    options.forEach(item => {
      item.files = initialValues[name]?.[item.document_type] ?? [];
    });
    setItems(options);
  }

  const onIdNumberChange = event => {
    const inputValue = event.target.value;
    setIdNumber(inputValue);
    setFieldValue('id_number', inputValue);
    setIdNumberHelperText(validateSSN(inputValue));
  };

  function handleItemClick(itemIndex) {
    setActiveItem(itemIndex);
    setState('upload');
  }

  function renderList() {
    if (items.length === 0) return null;
    return (
      <View ml={-0.5}>
        {items.map((item, index) => (
          <ListItem
            key={item.label}
            onClick={() => handleItemClick(index)}
            disabled={item.files?.length}
            button>
            <View flex={1} fD={'row'} aI={'center'} w={'100%'}>
              <div>
                <Icon
                  icon={item.files?.length ? 'check' : item.icon}
                  size={20}
                  style={{ [isRtl ? 'marginLeft' : 'marginRight']: '1.5rem' }}
                  backgroundColor={item.files?.length ? '#2BB292' : null}
                />
              </div>
              <Text id={item.label} />
            </View>
          </ListItem>
        ))}
      </View>
    );
  }

  const InputLabelProps = {
    classes: {
      asterisk: classes.asterisk,
    },
  };

  function renderUpload() {
    return (
      <View w={'100%'}>
        <Button
          id={'back'}
          variant={'link'}
          className={classes.backButton}
          children={
            <View flex={1} fD={'row'} aI={'center'}>
              <Icon icon={'arrowleft'} circled={false} color={'#707070'} />
              <Text
                style={{
                  lineHeight: 0,
                  paddingRight: '0.5rem',
                  marginLeft: '0.5rem',
                }}
                id={items[activeItem].label}
              />
            </View>
          }
          onPress={() => {
            setState('list');
            setIssueDate(null);
            setExpiryDate(null);
          }}
        />
        <View mt={1} />
        <View mb={0.5} w={'100%'}>
          <IDNumberInput
            margin="dense"
            variant={'outlined'}
            value={values?.id_number}
            InputLabelProps={InputLabelProps}
            helperText={idNumberHelperText}
            onChange={onIdNumberChange}
            error={!!idNumberHelperText}
          />
        </View>
        <View mb={0.5} fD={'row'} aI={'center'} w={'100%'}>
          <DatePicker
            label={t('issuance_date')}
            style={{ marginRight: 10 }}
            value={issueDate}
            onChange={value => setIssueDate(value)}
            maxDate={new Date()}
          />
          <DatePicker
            label={t('expiry_date')}
            style={{ marginLeft: 10 }}
            value={expiryDate}
            onChange={value => setExpiryDate(value)}
            minDate={new Date()}
          />
        </View>
        <View mb={1} w={'100%'} fD={'row'} aI={'center'}>
          <View mh={0.5} w={'100%'}>
            <FileUpload
              onFileLoad={file => setDocumentFront(file)}
              previewImage
            />
            {requiresBack && (
              <Text
                id="front_of_document"
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: 12,
                }}
              />
            )}
          </View>
          {requiresBack && (
            <View mh={0.5} w={'100%'}>
              <FileUpload
                onFileLoad={file => setDocumentBack(file)}
                previewImage
              />
              <Text
                id="back_of_document"
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: 12,
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  return state === 'list' ? renderList() : renderUpload();
}

const useStyles = makeStyles(theme => ({
  backButton: {
    marginLeft: '-0.5rem',
    padding: 0,
    '&:focus': { outline: 'none' },
  },
  asterisk: {
    color: '#FF4C6F',
  },
}));
