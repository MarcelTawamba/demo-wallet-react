/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import RadioSelector from 'components/inputs/RadioSelector';
import CheckboxList from 'components/inputs/CheckboxList';
import { useDocumentsFetch } from 'hooks/documentAPI';
import {
  DocumentPreviewModal,
  STATUS_COLORS,
} from 'components/inputs/OnboardingDocumentUpload';
import { isEmpty } from 'lodash';
import { ListItem } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import moment from 'moment';
import { Button } from 'components/inputs/Button';

export default function DocumentOptionSelection({
  selectedRequirementSet,
  user,
  refreshView,
  setRefreshView,
}) {
  const userDocuments = useDocumentsFetch(user.id)?.data?.results;
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [validUploadedDocuments, setValidUploadedDocuments] = useState({});
  const [previewDocument, setPreviewDocument] = useState();
  const [showModal, setShowModal] = useState();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const documents = useMemo(() => {
    return isEmpty(userDocuments)
      ? []
      : userDocuments?.filter(item => uploadedDocuments[item.type?.name]);
  }, [uploadedDocuments]);

  useEffect(() => {
    const updatedUploadedDocuments = {};
    const updatedValidUploadedDocuments = {};
    if (userDocuments) {
      for (const document of userDocuments) {
        const hasDocument = selectedRequirementSet?.fields?.find(
          requirement => requirement.documentType?.name === document.type.name,
        );
        if (hasDocument) {
          updatedUploadedDocuments[document.type.name] = document.status;
        }
        if (
          hasDocument &&
          (document.status === 'pending' || document.status === 'verified')
        ) {
          updatedValidUploadedDocuments[document.type.name] = document.status;
        }
      }
      setUploadedDocuments(updatedUploadedDocuments);
      setValidUploadedDocuments(updatedValidUploadedDocuments);
    }
  }, [userDocuments, selectedRequirementSet]);

  const isRequirementFulfilled =
    Object.keys(validUploadedDocuments).length >=
    (selectedRequirementSet.min_condition_matches ??
      selectedRequirementSet?.items?.length ??
      0);

  return (
    <View mb={1}>
      {Object.keys(uploadedDocuments).length > 0 ? (
        <>
          <View mb={1} w={'100%'}>
            {documents?.map((doc, index) => (
              <ListItem
                key={index}
                onClick={() => {
                  setPreviewDocument(doc);
                }}
                style={{ paddingLeft: 0, paddingRight: 0 }}>
                <View
                  w={'100%'}
                  bC={'#f9f9f9'}
                  pt={0.5}
                  pb={0.5}
                  pr={1}
                  bR={6}
                  pl={1}>
                  <View
                    fD={'row'}
                    jC={'space-between'}
                    aI={'center'}
                    w={'100%'}>
                    <View fD={'row'}>
                      {/* <DescriptionOutlinedIcon
                        color="primary"
                        style={{ marginRight: 8, fontSize: 28 }}
                      /> */}
                      <View>
                        <Text id={doc.type.name} />
                        {/* <Text style={{ fontSize: 11 }}>
                          {moment(doc.created).format('MMM DD, yyyy HH:mm')}
                        </Text> */}
                        {/* {doc.status === 'pending' && ( */}
                        <View fD={'row'} aI={'center'} gap={1}>
                          <Button
                            variant="link"
                            color="primary"
                            id="view"
                            style={{ marginTop: 8 }}
                            textStyle={{ fontSize: 14 }}
                            onClick={openModal}
                          />
                          {/* <Button
                            variant="link"
                            color="primary"
                            id="remove"
                            style={{ marginTop: 8 }}
                            textStyle={{ fontSize: 14 }}
                            onClick={openModal}
                          /> */}
                        </View>

                        {/* )} */}
                      </View>
                    </View>
                    <label
                      className="MuiButton-root"
                      style={{
                        color: STATUS_COLORS[doc.status],
                        // border: `2px solid ${STATUS_COLORS[doc.status]}`,
                        padding: 0,
                        borderRadius: 100,
                        width: 80,
                        fontSize: 11,
                        textAlign: 'center',
                        backgroundColor: STATUS_COLORS[`${doc.status}Bg`],
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
          <DocumentPreviewModal
            document={previewDocument}
            showModal={showModal}
            closeModal={closeModal}
          />
        </>
      ) : null}

      {!isRequirementFulfilled ? (
        <>
          {selectedRequirementSet.condition === 'any' ? (
            <Text style={{ fontWeight: 400 }}>
              Please select and provide{' '}
              <span style={{ fontWeight: 700, fontSize: 17 }}>
                any {selectedRequirementSet.min_condition_matches}
              </span>{' '}
              of the following options
            </Text>
          ) : null}
          {selectedRequirementSet.condition === 'all' ? (
            <Text style={{ fontWeight: 400 }}>
              Please select and provide{' '}
              <span style={{ fontWeight: 700, fontSize: 17 }}>all</span> of the
              following options
            </Text>
          ) : null}
          {selectedRequirementSet.min_condition_matches > 1 ||
          !selectedRequirementSet.min_condition_matches ? (
            <CheckboxList
              items={selectedRequirementSet.fields.map(field => ({
                disabled: isRequirementFulfilled,
                label: field.label,
                value: field.itemId.toString(),
                checked: selectedRequirementSet.selectedDocuments.includes(
                  field.itemId.toString(),
                ),
              }))}
              setValue={(value, checked) => {
                if (selectedRequirementSet.selectedDocuments.includes(value)) {
                  selectedRequirementSet.selectedDocuments =
                    selectedRequirementSet.selectedDocuments.filter(
                      id => id !== value,
                    );
                } else {
                  selectedRequirementSet.selectedDocuments.push(value);
                }
                setRefreshView(!refreshView);
                // console.log('refreshViewCheck', refreshView);
              }}
            />
          ) : (
            <RadioSelector
              responsive
              icon="Description"
              items={selectedRequirementSet.fields.map(field => ({
                disabled: isRequirementFulfilled,
                label: field.label,
                value: field.itemId.toString(),
              }))}
              value={selectedRequirementSet?.selectedDocuments?.[0]}
              noPadding
              handleChange={e => {
                selectedRequirementSet.selectedDocuments = [e?.target?.value];
                setRefreshView(!refreshView);
                // console.log('refreshView', refreshView);
              }}
            />
          )}
        </>
      ) : null}
    </View>
  );
}
