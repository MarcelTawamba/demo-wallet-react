/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { findIndex, omit } from 'lodash';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { makeStyles } from '@material-ui/styles';
import { createDocumentNew as createDocument } from 'util/rehive';
import { ListItem } from '@material-ui/core';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import FileUpload from 'components/inputs/NewFileUpload';

const defaultItems = [
  {
    document_type: 'passport',
    label: 'Passport',
    icon: 'passport',
  },
  {
    document_type: 'drivers_license',
    label: "Driver's license",
    icon: 'drivers',
  },
  {
    document_type: 'government_id',
    label: 'National identity card',
    icon: 'id',
  },
];

export default function IdentityVerification(props) {
  const { formikProps, name } = props;
  const { setFieldValue, initialValues } = formikProps;
  const [state, setState] = useState('list');
  const [items, setItems] = useState(defaultItems);
  const [activeItem, setActiveItem] = useState(0);
  const [error, setError] = useState();
  const classes = useStyles();

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

  function mergeInitialDocuments() {
    defaultItems.forEach(item => {
      item.files = initialValues[name]?.[item.document_type] ?? [];
    });
    setItems(defaultItems);
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
            createDocument({ file, type: items[activeItem].document_type })
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
              <Text>{item.label}</Text>
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
          label={'Back'}
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
                }}>
                {items[activeItem].label}
              </Text>
            </View>
          }
          onPress={() => setState('list')}
        />
        <View mt={1} />
        <FileUpload
          label={'Select file to upload'}
          multiple
          preloadedFiles={items[activeItem].files}
          onFileLoad={files => handleFileUpload(files)}
        />
        <Text myColor={'red'} style={{ textAlign: 'center' }}>
          {error}
        </Text>
      </>
    );
  }

  return <>{state === 'list' ? renderList() : renderUpload()}</>;
}

const useStyles = makeStyles(theme => ({
  backButton: {
    marginLeft: '-0.5rem',
    padding: 0,
    '&:focus': { outline: 'none' },
  },
}));
