/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { map } from 'lodash';
// import { Button } from './Button';
import { View } from '../layout/View';
import { isEqual } from 'lodash';
import { useToast } from 'components/contexts/ToastContext';
import { makeStyles } from '@material-ui/styles';
import Text from '../outputs/Text';
import Icon from '../outputs/NewIcon';
import Image from '../outputs/Image';
import File from '../images/documents.svg';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton';
import lang from 'screens/profile/config/profile_en.json';
import { Button } from './Button';
import {
  DocumentPreviewModal,
  STATUS_COLORS,
} from './OnboardingDocumentUpload';

export default function FileUpload(props) {
  let {
    onFileLoad,
    label = 'click_or_drag_file_title',
    previewImage = false,
    multiple = false,
    preloadedFiles = [],
  } = props;
  const [previewDocument, setPreviewDocument] = useState();
  console.log('previewDocument', previewDocument);
  const [showModal, setShowModal] = useState();
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  if (multiple) label = 'click_or_drag_files_title';

  const [files, setFiles] = useState(preloadedFiles ?? []);

  const classes = useStyles();
  const { showToast } = useToast();
  useEffect(() => {
    if (preloadedFiles.length && !isEqual(preloadedFiles, files))
      setFiles(preloadedFiles);
  }, [preloadedFiles]);

  useEffect(() => {
    if (onFileLoad && !isEqual(preloadedFiles, files))
      onFileLoad(multiple ? files : files[0]);
  }, [files]);

  const onDrop = useCallback(
    acceptedFiles => onFilesSelected(acceptedFiles),
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function onFilesSelected(selected) {
    let additions = [];
    map(selected, file => {
      if (file?.size / 100000 > 50) {
        return showToast({
          text: `${file.name}: File too big. Maximum size of 5MB.`,
          variant: 'error',
        });
      }
      additions.push(file);
    });

    setFiles(multiple ? files.concat(additions) : additions);
  }
  const isRtl = document.dir === 'rtl';

  function renderImagePreview() {
    return files.map((file, fileIndex) => (
      <View
        flex={1}
        fD={'row'}
        aI={'center'}
        jC={'center'}
        bR={10}
        bC={'#F9F9F9'}
        mb={1}
        key={fileIndex}
        w={file.file ? '100%' : 'auto'}
        style={{ flexWrap: 'wrap' }}>
        <View
          mh={1}
          mb={0.3}
          flex={1}
          fD={file.file ? 'row' : 'column'}
          jC={file.file ? 'space-between' : 'center'}
          aI={'center'}
          w={file.file ? '100%' : '200px'}>
          {file.type?.includes('image') ? (
            <>
              <Image
                src={URL.createObjectURL(file)}
                maxWidth={'100%'}
                key={file.id}
                style={{ borderRadius: 5 }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {file.name}
              </Text>
            </>
          ) : file.file ? (
            <>
              <div style={{ width: isRtl ? 'auto' : '40%' }}>
                <View fD={'column'} mt={0.5} gap={0.6}>
                  <View>
                    <Image
                      src={file.file}
                      maxWidth={'100%'}
                      key={file.id}
                      style={{ borderRadius: 5, width: 80, float: 'left' }}
                      alt="Unable to preview"
                    />
                  </View>

                  <View
                    fD={'column'}
                    jC={'flex-start'}
                    aI={'center'}
                    onClick={openModal}
                    style={{ paddingLeft: 3 }}>
                    <Button
                      id="view"
                      variant="link"
                      color="primary"
                      onClick={() => {
                        setPreviewDocument(file);
                      }}></Button>
                  </View>
                </View>
              </div>
              <TablePreviewItem file={file} />
              <DocumentPreviewModal
                document={previewDocument}
                showModal={showModal}
                closeModal={closeModal}
              />
            </>
          ) : (
            <>
              <Image src={File} key={file.id} maxWidth={'50px'} />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                {file.name}
              </Text>
            </>
          )}
        </View>
      </View>
    ));
  }

  function renderTablePreview() {
    return (
      <View mb={1} w={'100%'}>
        {files.map((file, fileIndex) => (
          <TablePreviewItem key={fileIndex} file={file} />
        ))}
      </View>
    );
  }

  return (
    <View aI={'center'} w={'100%'} p={0}>
      {files
        ? previewImage
          ? !multiple
            ? null
            : renderImagePreview()
          : renderTablePreview()
        : null}
      {/* <Button
        label={'UPLOAD'}
        variant="text"
        component="label"
        wide
        className={classes.button}
        noPadding
        style={{ borderRadius: 20, minHeight: '180px' }}> */}
      <div
        {...getRootProps()}
        style={{ width: '100%' }}
        className={classes.button}>
        <input
          type="file"
          onChange={e =>
            e.target.files.length && onFilesSelected(e.target.files)
          }
          style={{ display: 'none' }}
          className={classes.button}
          {...getInputProps()}
          multiple={multiple}
        />
        {files.length && previewImage && !multiple ? (
          renderImagePreview()
        ) : (
          <div
            style={{
              height: '100%',
              minHeight: '180px',
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#BCBCBC',
              borderStyle: 'dashed',
              width: '100%',
              backgroundColor: '#F2F2F2',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              icon={'CloudUpload'}
              circled={false}
              color={'#848484'}
              size={65}
            />
            <Text
              style={{
                color: '#848484',
                fontSize: 14,
                textAlign: 'center',
              }}
              id={isDragActive ? 'file_dragging' : label}
            />
            <Text
              style={{ fontSize: 10, color: '#848484', textAlign: 'center' }}
              id="max_file_size_5mb"
            />
          </div>
        )}
      </div>
      {/* </Button> */}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
    },
  },
}));

function TablePreviewItem({ file }) {
  const date = moment(file?.created)?.format('MMM DD, YYYY hh:mm A');
  const isRtl = document.dir === 'rtl';

  return (
    <>
      {typeof file.file !== 'string' ? (
        <View
          key={file}
          flex={1}
          fD={'row'}
          aI={'center'}
          jC={'space-between'}
          mb={0.75}
          w={'100%'}>
          <View>
            <Skeleton variant="text" width={160} />
            <Skeleton variant="text" width={140} height={10} />
          </View>
          <Skeleton variant="circle" width={35} height={35} />
        </View>
      ) : (
        <View
          key={file}
          flex={1}
          fD={'row'}
          jC={'space-between'}
          aI={'center'}
          mb={0.5}
          w={isRtl ? '70%' : '100%'}>
          <View>
            <Text id={file?.document_type ?? file?.type ?? ''} />
            <Text style={{ fontSize: 12 }} myColor={'#848484'}>
              {date}
            </Text>
          </View>
          {/* <Icon
            icon={
              file?.status?.toLowerCase() === 'pending' ? 'hourglass' : 'check'
            }
            circled={false}
            color={'#BEBEBE'}
          /> */}
          <View>
            <label
              className="MuiButton-root"
              style={{
                color:
                  file?.status === 'pending'
                    ? '#a2a2a2'
                    : `${STATUS_COLORS[file.status]}`,
                padding: 0,
                backgroundColor: STATUS_COLORS[`${file.status}Bg`],
                borderRadius: 100,
                width: 80,
                fontSize: 11,
                textAlign: 'center',
              }}>
              {file.status}
            </label>
          </View>
        </View>
      )}
    </>
  );
}
