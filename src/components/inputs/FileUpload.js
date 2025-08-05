import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { View } from 'components/layout/View';
import { useLanguage } from 'components/contexts/LanguageContext';
import { useToast } from 'components/contexts/ToastContext';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';
import UnablePreview from 'screens/profile/components/UnablePreview';

export default function FileUpload(props) {
  const {
    imageURL,
    onFileLoad,
    multiple,
    height = 185,
    preview,
    label = 'click_or_drag_file_title',
  } = props;

  const [file, setFile] = useState();

  const { showToast } = useToast();
  const { lang } = useLanguage();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.[0]?.size / 100000 > 50) {
      return showToast({
        text: 'File too big. Maximum size of 5MB.',
        variant: 'error',
      });
    }
    setFile(acceptedFiles[0]);
    onFileLoad && onFileLoad(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return imageURL ? (
    <img className="container" src={imageURL} alt="img" />
  ) : (
    <div
      {...getRootProps()}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <input {...getInputProps()} />

      {file ? (
        <>
          {file.type.includes('image') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                height: height ? height : 'auto',
                borderRadius: 15,
                cursor: 'pointer',
              }}
            />
          ) : (
            <UnablePreview message={'cannot_preview'} />
          )}
        </>
      ) : (
        <div
          style={{
            height: height ? height : 'auto',
            color: '#848484',
            borderRadius: 15,
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: '#BCBCBC',
            width: '100%',
            backgroundColor: '#F2F2F2',
            padding: 16,
            // paddingTop: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}>
          <Icon
            icon={'CloudUpload'}
            circled={false}
            color={'#848484'}
            size={65}
          />
          <Text
            tA="center"
            style={{ paddingTop: '1rem' }}
            id={isDragActive ? 'file_dragging' : label}
          />
        </div>
      )}
    </div>
  );
}
