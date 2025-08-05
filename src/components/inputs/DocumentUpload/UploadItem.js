/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useToast } from 'components/contexts/ToastContext';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Image from 'components/images';
import Text from 'components/outputs/Text';
import TextField from 'components/inputs/TextField';
import PdfOrImage from 'components/outputs/PdfOrImage';

export default function UploadItem(props) {
  const { onItemChange, name, formikProps, setPreview } = props;
  const { setFieldValue, values, handleChange } = formikProps;

  const [numPages, setNumPages] = useState(null);
  const [file, setFile] = useState();
  const [fileConverted, setFileConverted] = useState();
  const { showToast } = useToast();
  useEffect(() => {
    onItemChange({ name, file });
    convertFile();
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

  async function convertFile() {
    if (!file) return setFileConverted(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setFileConverted(reader.result);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const fieldConfig = {
    name,
    value: values[name],
    fullWidth: true,
    onChange: handleChange,
    onBlur: () => onItemChange({ name, file }),
  };

  return (
    <View mb={0.5}>
      <View aI={'center'} flex={1} fD={'row'} w={'100%'}>
        <View mr={1} w={'45px'}>
          {(file && (
            <View ml={-0.75}>
              <Button
                wrap
                tooltip={'Open preview'}
                variant={'text'}
                style={{ paddingBottom: 0, borderRadius: 3 }}
                onPress={() => setPreview(file)}
                noPadding>
                <PdfOrImage
                  src={file}
                  maxWidth={45}
                  displayTextIfEmpty={false}
                />
              </Button>
            </View>
          )) || <Image name={'documents'} size={45} />}
        </View>
        <TextField
          margin="dense"
          autoComplete="off"
          variant={'outlined'}
          label={'Document name'}
          style={{ maxWdith: '375px' }}
          {...fieldConfig}
        />
        {file ? (
          <Button
            variant="text"
            wrapperStyle={{ paddingRight: 0, marginRight: '-0.5rem' }}
            onPress={() => {
              setFieldValue(name, '');
              handleUpload(null);
            }}>
            <Text style={{ fontSize: 14 }}>Remove</Text>
          </Button>
        ) : (
          <Button
            label={'UPLOAD'}
            variant="text"
            component="label"
            wrapperStyle={{ paddingRight: 0, marginRight: '-0.5rem' }}>
            <input
              type="file"
              onChange={e => handleUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <Text style={{ fontSize: 14 }} myColor={'primary'} bold>
              Upload
            </Text>
          </Button>
        )}
      </View>
      {file ? <Text style={{ fontSize: '12px' }}>{file?.name}</Text> : null}
    </View>
  );
}
