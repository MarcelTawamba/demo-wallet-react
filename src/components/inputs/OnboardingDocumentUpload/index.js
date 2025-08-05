import React, { useMemo, useState, useEffect } from 'react';
import FileUpload from 'components/inputs/NewFileUpload';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useDocumentsFetch } from 'hooks/documentAPI';
import { isEmpty } from 'lodash';
import { ListItem } from '@material-ui/core';
import moment from 'moment';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { Button } from 'components/inputs/Button';
import Image from 'components/outputs/Image';
import UnablePreview from 'screens/profile/components/UnablePreview';
import Modal from 'components/layout/Modal';

export const STATUS_COLORS = {
  verified: '#2BB292',
  pending: '#a2a2a2',
  declined: '#fd5173',
  obsolete: '#fd5173',
  incomplete: '#fd5173',
  verifiedBg: '#D3FFF5',
  pendingBg: '#e7e7e7',
  declinedBg: '#fbd3db',
  obsoleteBg: '#fbd3db',
  incompleteBg: '#fbd3db',
};

export default function OnboardingDocumentUpload(props) {
  const {
    setFieldValue,
    label,
    name,
    description,
    documentType,
    values,
    user,
  } = props;
  const userDocuments = useDocumentsFetch(user?.id)?.data?.results;
  const [previewDocument, setPreviewDocument] = useState();
  const [showModal, setShowModal] = useState();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const documents = useMemo(() => {
    return isEmpty(userDocuments)
      ? []
      : userDocuments?.filter(item => item.type?.id === documentType?.id);
  }, [userDocuments]);

  function handleItem(item) {
    setFieldValue(name, {
      name: item.name,
      file: item,
      // metadata: {},
      type: documentType?.id,
    });
  }

  return (
    <View mb={1.5}>
      <Text bold>{label}</Text>
      <Text s="14" style={{ margin: '10px 4px' }}>
        {description}
      </Text>
      <View mb={1} w={'100%'}>
        {documents?.map((doc, index) => (
          <ListItem
            key={index}
            onClick={() => {
              setPreviewDocument(doc);
            }}
            style={{ paddingLeft: 0 }}>
            <View w={'100%'}>
              <View fD={'row'} jC={'space-between'} aI={'center'} w={'100%'}>
                <View fD={'row'}>
                  <DescriptionOutlinedIcon
                    color="primary"
                    style={{ marginRight: 8, fontSize: 28 }}
                  />
                  <View>
                    <Text id={doc.type.name} />
                    <Text style={{ fontSize: 11 }}>
                      {moment(doc.created).format('MMM DD, yyyy HH:mm')}
                    </Text>
                    <Button
                      variant="link"
                      color="primary"
                      id="Click to view"
                      style={{ marginTop: 8 }}
                      textStyle={{ fontSize: 14 }}
                      onClick={openModal}
                    />
                  </View>
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
              {doc.note && 'verified' !== doc.status && (
                <Text
                  style={{ fontSize: 12, marginTop: 6, paddingLeft: 8 }}
                  myColor={'#E64040'}>
                  {doc.note}
                </Text>
              )}
            </View>
          </ListItem>
        ))}
      </View>
      <FileUpload preloadedFiles={[]} onFileLoad={handleItem} previewImage />
      <DocumentPreviewModal
        document={previewDocument}
        showModal={showModal}
        closeModal={closeModal}
      />
    </View>
  );
}

export const DocumentPreviewModal = ({ document, showModal, closeModal }) => {
  const { file, type, note, status, created } = document || {};

  const isImage = ['.jpg', '.png', '.jpeg', '.gif', '.svg'].some(item =>
    file?.includes(item),
  );

  return (
    <Modal
      maxWidth={800}
      open={showModal}
      close
      onDismiss={closeModal}
      hideTitle
      removePadding>
      <View p={0} m={1} mb={0}>
        <View f={1} aI={'center'} w={'100%'}>
          {isImage ? (
            <a href={file} target="_blank" rel="noopener noreferrer">
              <Image src={file} height={200} style={{ borderRadius: 10 }} />
            </a>
          ) : (
            <UnablePreview message={'cannot_preview'} />
          )}
        </View>
        <View w={'100%'}>
          <Text style={{ fontSize: 11 }} id="type" />
          <Text
            style={{ marginBottom: 10 }}
            id={`${type?.name ?? type}`}></Text>

          <Text style={{ fontSize: 11 }} id="uploaded" />
          <Text style={{ marginBottom: 10 }}>
            {moment(created).format('MMM DD, yyyy HH:mm')}
          </Text>

          {status !== 'verified' && note && (
            <>
              <Text s={11} id="note" />
              <Text s={12} myColor={'#E64040'}>
                {note}
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
