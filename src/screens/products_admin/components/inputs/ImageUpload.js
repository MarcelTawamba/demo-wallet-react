import React, { useState, useCallback } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { useDropzone } from 'react-dropzone';
import Icon from 'components/outputs/NewIcon';
import { SimpleImg } from 'react-simple-img';
import IconButton from 'components/inputs/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from '@material-ui/lab/Skeleton';

export default function ImageUpload(props) {
  const { imageURL, onFileLoad, multiple, onClear, loading } = props;

  const onDrop = useCallback(acceptedFiles => {
    onFileLoad(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      {loading ? (
        <div style={{ overflow: 'hidden', borderRadius: 5 }}>
          <Skeleton width={100} height={100} variant="rect" />
        </div>
      ) : (
        <div
          className={multiple ? classes.dropAreaMultiple : classes.dropArea}
          {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon
            icon={'image'}
            circled={false}
            color={'#848484'}
            size={multiple ? 50 : 100}
          />
          {isDragActive ? (
            <p>{'Drop image' + (multiple ? 's' : '') + ' here ...'}</p>
          ) : (
            <p>{'Click or drop image' + (multiple ? 's' : '')}</p>
          )}
        </div>
      )}
      {/* ) : imageURL ? (
        <div className={classes.image}>
          <IconButton onPress={onClear} noPadding className={classes.icon}>
            <CloseIcon style={{ color: 'white', fontSize: 18 }} />
          </IconButton>
          <SimpleImg className={classes.dropArea} src={imageURL} alt="img" />
        </div> */}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
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
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  dropArea: {
    position: 'relative',
    maxHeight: 265,
    maxWidth: 265,
    // width: '100%',
    // height: '100%',
    height: 265,
    width: 265,

    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,
    // borderWidth: '2px',
    // borderColor: 'gray',
    // borderStyle: 'dashed',
    // paddingTop: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropAreaMultiple: {
    position: 'relative',
    maxHeight: 150,
    maxWidth: 150,
    // width: '100%',
    // height: '100%',
    height: 150,
    width: 150,

    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,
    // borderWidth: '2px',
    // borderColor: 'gray',
    // borderStyle: 'dashed',
    // paddingTop: 32,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
