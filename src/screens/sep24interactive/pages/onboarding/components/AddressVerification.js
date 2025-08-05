/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import * as _inputs from 'config/inputs';
import * as _customInputs from '../config/user/inputs';
import { makeStyles } from '@material-ui/styles';
import { findIndex, pick } from 'lodash';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { ListItem } from '@material-ui/core';
import { createDocumentNew as createDocument } from 'util/rehive';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import FileUpload from 'components/inputs/NewFileUpload';
import document_categories from 'screens/profile/config/document_categories.json';
import lang from 'screens/profile/config/profile_en.json';

const options = document_categories.proof_of_address.options.map(op => {
  return {
    id: op.id,
    document_type: op.id,
    // label: lang[op.id],
    label: op.label,
    value: op.id,
    icon: op.icon,
  };
});

export default function AddressVerification(props) {
  const { formikProps, name } = props;

  const { setFieldValue, initialValues } = formikProps;
  const [state, setState] = useState('list');
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [error, setError] = useState();
  const classes = useStyles();

  useEffect(() => {
    setFieldValue(
      name,
      items.map(item => {
        return pick(item, ['id', 'document_type', 'files']);
      }),
    );
  }, [items]);

  useEffect(() => {
    mergeInitialDocuments();
  }, [initialValues]);

  useEffect(() => {
    setError(null);
  }, [state]);

  function mergeInitialDocuments() {
    options.forEach(item => {
      item.files = initialValues[name]?.[item.document_type] ?? [];
    });
    setItems(options);
  }

  function handleItemClick(itemIndex) {
    setActiveItem(itemIndex);
    setState('upload');
  }

  async function handleFileUpload(files) {
    let processed = [];
    await Promise.all(
      files?.map(async file => {
        if (file.type)
          return new Promise(resolve => {
            const doc_type = items[activeItem].document_type;
            createDocument({ file, type: doc_type })
              .then(resp => {
                processed.push(resp);
                resolve();
              })
              .catch(error => {
                setError(
                  error?.file
                    ? `\n${file.name}: ${error?.file[0]}`
                    : error.non_field_errors[0],
                );
                resolve();
              });
          });

        return processed.push(file);
      }),
    );

    let copy = [...items];

    const index = findIndex(copy, {
      document_type: items[activeItem].document_type,
    });

    copy.splice(index, 1, {
      ...items[activeItem],
      files: processed,
    });

    setItems(copy);
  }

  function renderList() {
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
                  style={{ marginRight: '1.5rem' }}
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

  function renderUpload() {
    return (
      <>
        <Button
          id="back"
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
          onPress={() => setState('list')}
        />
        <View mt={1} />
        <FileUpload
          label="select_file_to_upload"
          multiple
          previewImage
          preloadedFiles={items[activeItem]?.files}
          onFileLoad={files => handleFileUpload(files)}
        />
        <Text myColor={'red'} style={{ textAlign: 'center' }}>
          {error}
        </Text>
      </>
    );
  }

  switch (state) {
    default:
      return renderList();
    case 'upload':
      return renderUpload();
  }
}

const useStyles = makeStyles(theme => ({
  backButton: {
    marginLeft: '-0.5rem',
    padding: 0,
    '&:focus': { outline: 'none' },
  },
}));
