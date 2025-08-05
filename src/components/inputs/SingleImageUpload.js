/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import { useToast } from 'components/contexts/ToastContext';
import Image from 'components/outputs/Image';
import Icon from 'components/outputs/NewIcon';
import CustomImage from 'components/images';
import IconButton from 'components/inputs/IconButton';

export default function SingleImageUpload(props) {
  let { onFileLoad, setValue, name, existing } = props;
  const isRtl = document.dir === 'rtl';

  const [file, setFile] = useState(existing);

  const { showToast } = useToast();
  useEffect(() => {
    if (existing && (!file || typeof file === 'string')) {
      setFile(existing);
    }
  }, [existing]);

  useEffect(() => {
    if (setValue) {
      setValue(name, file);
    }
  }, [file]);

  function handleUpload(newFile) {
    if (newFile?.size / 100000 > 50) {
      return showToast({
        text: 'File too big. Maximum size of 5MB.',
        variant: 'error',
      });
    }
    setFile(newFile);
  }

  return (
    <View style={{ position: 'relative', margin: 'auto' }} pt={0.5}>
      {file ? (
        <Image
          src={file.type ? URL.createObjectURL(file) : file}
          maxWidth={200}
          width={200}
          height={200}
          key={file.id}
          style={{ borderRadius: '100%' }}
        />
      ) : (
        <CustomImage
          name={'userdetails'}
          primary={'#E6E6E6'}
          primaryContrast={'#B9B9B9'}
          size={200}
        />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          [isRtl ? 'left' : 'right']: 0,
        }}>
        <IconButton label={'UPLOAD'} variant="text" component="label" noPadding>
          <input
            type="file"
            onChange={e => handleUpload(e.target.files[0])}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <Icon icon={'plus'} size={26} />
        </IconButton>
      </View>
    </View>
  );
}
