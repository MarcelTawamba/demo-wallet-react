import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { useLanguage } from 'components/contexts/LanguageContext';
import { ListItem } from '@material-ui/core';
import { createDocumentWithType } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import Skeleton from '@material-ui/lab/Skeleton';
import moment from 'moment';
import Image from 'components/outputs/Image';
import FileUpload from 'components/inputs/FileUpload';
import Text from 'components/outputs/Text';
import IconButtonList from 'components/inputs/IconButtonList';
// import DatePicker from 'components/inputs/DateNew';
import BackButton from 'components/inputs/BackButton';
import UnablePreview from './UnablePreview';
import { useDocumentsFetch, useFetchDocumentTypes } from 'hooks/documentAPI';
import { useRehiveContext } from 'contexts';

const STATUS_COLORS = {
  verified: '#2BB292',
  pending: '#a2a2a2',
  declined: '#fd5173',
  obsolete: '#fd5173',
  incomplete: '#fd5173',
};

export default function Documents(props) {
  const {
    section: {
      componentProps: { categories, id },
    },
  } = props;

  const [stateIndex, setStateIndex] = useState(0);
  const [type, setType] = useState();
  const [documentFront, setDocumentFront] = useState();
  const [documentBack, setDocumentBack] = useState();
  // const [issueDate, setIssueDate] = useState();
  // const [expiryDate, setExpiryDate] = useState();
  const [previewDocument, setPreviewDocument] = useState();
  const [loading, setLoading] = useState(false);
  const { user, company } = useRehiveContext();

  const { lang } = useLanguage();
  const { showToast } = useToast();
  const states = ['list', 'type', 'upload', 'preview'];
  // const isRtl = document.dir === 'rtl';

  useEffect(() => {
    setStateIndex(0);
  }, [id]);

  const {
    data: { results: documents = [] } = {},
    isLoading: loadingDocuments,
    refetch: refresh,
  } = useDocumentsFetch(user?.id, Boolean(user?.id));

  const documentTypesData = useFetchDocumentTypes(
    company?.id,
    Boolean(company?.id),
  )?.data?.results;

  const documentTypes = useMemo(
    () =>
      documentTypesData?.map(dt => ({
        ...dt,
        label: dt.name,
        icon: 'insert-drive-file',
        requireBack: false,
      })),
    [documentTypesData],
  );

  function renderList() {
    return (
      <>
        {loadingDocuments ? (
          <>
            <View mb={1}>
              <Skeleton width={300} height={30} />
              <Skeleton width={100} height={20} />
            </View>
            <View>
              <Skeleton width={300} height={30} />
              <Skeleton width={100} height={20} />
            </View>
          </>
        ) : (
          <>
            {!documents.length ? (
              <EmptyListPlaceholderImage name="document" id="document_empty" />
            ) : (
              <>
                <View mb={1} w={'100%'}>
                  {documents
                    // ?.filter(doc => categories.includes(doc?.document_category))
                    ?.map((doc, index) => (
                      <ListItem
                        key={index}
                        onClick={() => {
                          setPreviewDocument(doc);
                          setStateIndex(3);
                        }}
                        button>
                        <View
                          fD={'row'}
                          jC={'space-between'}
                          aI={'center'}
                          w={'100%'}>
                          <View>
                            {doc.type ? (
                              <Text>{doc.type?.name}</Text>
                            ) : (
                              <Text>
                                <Text
                                  id={doc.document_type ?? doc?.metadata?.type}
                                />{' '}
                                <Text
                                  id={
                                    doc.metadata?.side
                                      ? `(${doc.metadata?.side})`
                                      : ''
                                  }
                                />
                              </Text>
                            )}
                            <Text style={{ fontSize: 11 }}>
                              {moment(doc.created).format('MMM DD, yyyy HH:mm')}
                            </Text>
                            {!['pending', 'verified'].includes(doc.status) &&
                              doc.note && (
                                <Text
                                  style={{ fontSize: 11 }}
                                  myColor={'#CC2538'}>
                                  {doc.note}
                                </Text>
                              )}
                          </View>
                          <label
                            className="MuiButton-root"
                            style={{
                              color: STATUS_COLORS[doc.status],
                              border: `2px solid ${STATUS_COLORS[doc.status]}`,
                              padding: '4px 14px',
                              borderRadius: 100,
                              width: 124,
                              fontSize: 12,
                              textAlign: 'center',
                            }}>
                            {doc.status}
                          </label>
                        </View>
                      </ListItem>
                    ))}
                </View>
              </>
            )}
            <Button
              id={'upload_document'}
              wide
              color={'primary'}
              onPress={() => setStateIndex(1)}
            />
          </>
        )}
      </>
    );
  }

  function renderTypes() {
    return (
      <IconButtonList
        items={documentTypes}
        onClick={item => {
          setType(item);
          setStateIndex(2);
        }}
      />
    );
  }

  function renderUpload() {
    const requiresBack = type?.requireBack;

    return (
      <View w={'100%'}>
        {/* {category === 'proof_of_identity' && (
          <View mb={1} ph={0.5} fD={'row'} aI={'center'} w={'100%'}>
            <DatePicker
              label="issuance_date"
              style={{ [isRtl ? 'marginLeft' : 'marginRight']: 10 }}
              value={issueDate}
              onChange={value => setIssueDate(value)}
              maxDate={new Date()}
            />
            <DatePicker
              label={'expiry_date'}
              style={{ [isRtl ? 'marginRight' : 'marginLeft']: 10 }}
              value={expiryDate}
              onChange={value => setExpiryDate(value)}
              minDate={new Date()}
            />
          </View>
        )} */}
        <View mb={1} w={'100%'} fD={'row'} aI={'center'}>
          <View mh={0.5} w={'100%'} style={{ overflowX: 'hidden' }}>
            <FileUpload onFileLoad={files => setDocumentFront(files[0])} />
            {requiresBack && (
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: 12,
                }}
                id="front_of_document"
              />
            )}
          </View>
          {requiresBack && (
            <View mh={0.5} w={'100%'} style={{ overflowX: 'hidden' }}>
              <FileUpload onFileLoad={files => setDocumentBack(files[0])} />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: 12,
                }}
                id="back_of_document"
              />
            </View>
          )}
        </View>
        <Button
          id={'submit_documents'}
          wide
          capitalize
          color={'primary'}
          loading={loading}
          disabled={
            !documentFront ||
            (requiresBack && (!documentFront || !documentBack))
          }
          onPress={handleUpload}
        />
      </View>
    );
  }

  function renderPreview() {
    const {
      file,
      document_category,
      document_type,
      note,
      status,
      created,
      type: typeObject,
    } = previewDocument ?? {};

    const errorState = !['pending', 'verified'].includes(status);
    const isImage = ['.jpg', '.png', '.jpeg', '.gif', '.svg'].some(item =>
      file.includes(item),
    );

    return (
      <View w={'100%'}>
        <View f={1} aI={'center'} w={'100%'} mb={1}>
          {isImage ? (
            <a href={file} target="_blank" rel="noopener noreferrer">
              <Image src={file} height={200} style={{ borderRadius: 10 }} />
            </a>
          ) : (
            <UnablePreview message={'cannot_preview'} />
          )}
        </View>
        <View mb={1} w={'100%'}>
          {!typeObject && (
            <>
              <Text style={{ fontSize: 11 }} id="category" />
              <Text style={{ marginBottom: 10 }}>
                {lang[document_category]}
              </Text>
            </>
          )}
          <Text style={{ fontSize: 11 }} id="type" />
          <Text style={{ marginBottom: 10 }}>
            {typeObject ? typeObject.name : lang[document_type]}
          </Text>

          <Text style={{ fontSize: 11 }} id="uploaded" />
          <Text style={{ marginBottom: 10 }}>
            {moment(created).format('MMM DD, yyyy HH:mm')}
          </Text>

          {note && (
            <>
              <Text style={{ fontSize: 11 }} id="note" />
              <Text myColor={errorState && '#CC2538'}>{note}</Text>
            </>
          )}
        </View>
        {errorState && (
          <Button
            id={'upload_new_document'}
            wide
            capitalize
            color={'primary'}
            onPress={() => {
              setType(typeObject);
              setStateIndex(2);
            }}
          />
        )}
      </View>
    );
  }

  async function handleUpload() {
    setLoading(true);

    let metaData = {};

    // if (category === 'proof_of_identity')
    //   metaData = { issue_date: issueDate, expiry_date: expiryDate };

    try {
      let uploads = [
        new Promise(resolve =>
          createDocumentWithType({
            file: documentFront,
            type: type.id,
            metadata: documentBack ? { ...metaData, side: 'front' } : metaData,
          })
            .then(() => resolve())
            .catch(error => {
              showToast({
                text:
                  error?.non_field_errors?.[0] ?? 'Issue uploading document',
                variant: 'error',
              });
              setLoading(false);
            }),
        ),
      ];

      if (documentBack)
        uploads.push(
          new Promise(resolve =>
            createDocumentWithType({
              file: documentBack,
              type: type.id,
              metadata: { ...metaData, side: 'back' },
            })
              .then(() => resolve())
              .catch(error => {
                showToast({
                  text:
                    error?.non_field_errors?.[0] ?? 'Issue uploading document',
                  variant: 'error',
                });
                setLoading(false);
              }),
          ),
        );

      await Promise.all(uploads);

      refresh();
      setStateIndex(0);
      setDocumentFront(null);
      setDocumentBack(null);
      setLoading(false);

      //TODO: show toast and reload docs
    } catch (e) {
      setLoading(false);
      console.log('doc upload error', e);
    }
  }

  function render() {
    switch (states[stateIndex]) {
      case 'list':
        return renderList();
      case 'type':
        return renderTypes();
      case 'upload':
        return renderUpload();
      case 'preview':
        return renderPreview();
      default:
        return null;
    }
  }

  return (
    <div id={id}>
      <View ph={1} pv={1}>
        {states[stateIndex] !== 'list' && (
          <View mb={1}>
            <BackButton
              label={states[stateIndex] === 'upload' ? lang[type] : 'back'}
              onPress={() => {
                setStateIndex(
                  states[stateIndex] === 'preview' ? 0 : stateIndex - 1,
                );
                setDocumentFront(null);
                setDocumentBack(null);
              }}
            />
          </View>
        )}
        {render()}
      </View>
    </div>
  );
}
