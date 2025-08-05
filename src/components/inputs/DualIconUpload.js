/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import IconUpload from './IconUpload';
import { useToast } from 'components/contexts/ToastContext';
import { get } from 'lodash';

export default function DualIconUpload(props) {
  const { itemNames, labels, preloadedFiles, onChange } = props;

  const [first, setFirst] = useState(
    preloadedFiles && preloadedFiles.length && preloadedFiles[0],
  );
  const [second, setSecond] = useState(
    preloadedFiles && preloadedFiles.length && preloadedFiles[1],
  );
  const { showToast } = useToast();
  useEffect(() => {
    onChange({
      [get(itemNames, ['0'], 'first')]: first,
      [get(itemNames, ['1'], 'second')]: second,
    });
  }, [first, second]);

  function handleUpload(file, callback) {
    if (file?.size / 100000 > 50) {
      return showToast({
        text: 'File too big. Maximum size of 5MB.',
        variant: 'error',
      });
    }
    callback();
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <IconUpload
          label={labels && labels.length && labels[0]}
          existing={
            preloadedFiles && preloadedFiles.length && preloadedFiles[0]
          }
          onFileLoad={value => handleUpload(value, () => setFirst(value))}
        />
      </Grid>
      <Grid item xs={6}>
        <IconUpload
          label={labels && labels.length && labels[1]}
          existing={
            preloadedFiles && preloadedFiles.length && preloadedFiles[1]
          }
          onFileLoad={value => handleUpload(value, () => setSecond(value))}
        />
      </Grid>
    </Grid>
  );
}
