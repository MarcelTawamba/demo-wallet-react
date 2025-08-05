/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Image from 'components/outputs/Image';
import Icon from 'components/outputs/NewIcon';
import { Button } from '@material-ui/core';
import { useToast } from 'components/contexts/ToastContext';
import IconButton from './IconButton';

export default function IconUpload(props) {
  const { onFileLoad, label, existing, width = 80, height = 80 } = props;

  const canRemove = existing == null;

  const [file, setFile] = useState(existing);
  const { showToast } = useToast();
  useEffect(() => {
    if (onFileLoad) onFileLoad(file);
  }, [file]);

  function handleUpload(file) {
    if (file?.size / 100000 > 50) {
      return showToast({
        text: 'File too big. Maximum size of 5MB.',
        variant: 'error',
      });
    }
    setFile(file);
  }

  return (
    <View>
      <Text id={label} />
      <View mv={1}>
        {file ? (
          <View flex={1} fD={'row'} aI={'start'}>
            <Image
              src={file.type ? URL.createObjectURL(file) : file}
              maxWidth={width}
              width={width}
              height={height}
              key={file.id}
              style={{ borderRadius: '5px' }}
            />
            <View ml={0.5}>
              <IconButton
                label={'UPLOAD'}
                variant="text"
                component="label"
                style={{ marginBottom: '0.25rem' }}
                noPadding>
                <input
                  type="file"
                  onChange={e => handleUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                <Icon icon={'create'} size={12} />
              </IconButton>
              {canRemove ? (
                <IconButton
                  variant="text"
                  component="span"
                  noPadding
                  onPress={() => handleUpload(null)}>
                  <Icon icon={'clear'} size={12} backgroundColor={'#ea4646'} />
                </IconButton>
              ) : null}
            </View>
          </View>
        ) : (
          <>
            <input
              type="file"
              onChange={e => handleUpload(e.target.files[0])}
              style={{ display: 'none' }}
              accept="image/*"
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button
                label={'UPLOAD'}
                style={{
                  height: '80px',
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: 'gray',
                  borderStyle: 'dashed',
                  width: '80px',
                  backgroundColor: '#F2F2F2',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 2,
                }}
                component="span"></Button>
            </label>
          </>
        )}
      </View>
    </View>
  );
}
