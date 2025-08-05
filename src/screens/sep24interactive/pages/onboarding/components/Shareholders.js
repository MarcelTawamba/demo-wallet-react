import React, { useState, useEffect } from 'react';
import { omitBy, isNull } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { View } from 'components/layout/View';
import { Formik, Form } from 'formik';
import { FormikFields } from 'components/inputs/FormikForm';
import { Button } from 'components/inputs/Button';
import { createBusinessDocument } from 'util/rehive';
import Skeleton from '@material-ui/lab/Skeleton';
import lang from 'screens/profile/config/profile_en.json';
import moment from 'moment';
import documentCategories from 'screens/profile/config/document_categories.json';
import * as yup from 'yup';
import Icon from 'components/outputs/NewIcon';
import IconButton from 'components/inputs/IconButton';
import * as inputs from 'config/inputs';
import Inputs from './inputs';
import FileUpload from 'components/inputs/NewFileUpload';
import Text from 'components/outputs/Text';

export default function Shareholders(props) {
  const {
    value,
    context: { setHideButtons },
    formikProps: {
      values: { business, documents, onFileLoad },
    },
  } = props;

  const [state, setState] = useState('list');
  const [documentFront, setDocumentFront] = useState();
  const [documentBack, setDocumentBack] = useState();
  const [submitting, setSubmitting] = useState(false);
  const classes = useStyles();
  const isRtl = document.dir === 'rtl';

  useEffect(() => {
    if (typeof setHideButtons === 'function') setHideButtons(state === 'form');
    return () => {
      if (typeof setHideButtons === 'function') setHideButtons(false);
    };
  }, [state]);

  const fields = [
    inputs.first_name,
    inputs.last_name,
    inputs.role,
    inputs.identificationDocuments,
    inputs.id_number,
  ];

  async function handleSubmit(formikProps) {
    setSubmitting(true);

    const {
      values: {
        identificationDocuments,
        first_name,
        last_name,
        role,
        id_number,
      },
    } = formikProps;

    const requireDocumentBack =
      documentCategories?.proof_of_identity?.options?.find(
        x => x.id === identificationDocuments,
      )?.requireBack;

    const uploadedDocs = [];

    const docFront = await handleUpload({
      file: documentFront,
      metadata: omitBy(
        {
          first_name,
          last_name,
          role,
          id_number,
          side: requireDocumentBack ? 'front' : null,
        },
        isNull,
      ),
    });

    uploadedDocs.push(docFront?.data);

    if (requireDocumentBack) {
      const docBack = await handleUpload({
        file: documentBack,
        metadata: { sibling: docFront?.data?.id, side: 'back' },
      });
      uploadedDocs.push(docBack?.data);
    }

    setSubmitting(false);
    onFileLoad && onFileLoad(uploadedDocs);
    setState('list');
  }

  function handleUpload({ file, metadata }) {
    return new Promise((resolve, reject) => {
      createBusinessDocument({
        businessId: business?.id,
        file,
        type: 'shareholder_identification',
        metadata,
      })
        .then(resp => resolve(resp))
        .catch(error => reject(error));
    });
  }

  function renderList() {
    return (
      <View>
        {!documents?.length ? (
          <View p={0.5}>
            <Text id="add_shareholder_title" c={'grey3'} s={14} />
          </View>
        ) : (
          <View mb={1} w={'100%'}>
            {documents
              ?.filter(x => !x.metadata?.sibling)
              ?.map(document => {
                const date = moment(document?.created)?.format(
                  'MMM DD, YYYY hh:mm A',
                );
                return (
                  <>
                    {typeof document.file !== 'string' ? (
                      <View
                        key={document}
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
                        key={document}
                        flex={1}
                        fD={'row'}
                        jC={'space-between'}
                        aI={'center'}
                        mb={0.5}
                        w={'100%'}>
                        <View>
                          <Text>
                            {`${document?.metadata?.first_name} ${document?.metadata?.last_name}` ??
                              (document?.document_type
                                ? lang[document?.document_type]
                                : document?.type
                                ? lang[document?.type]
                                : '')}
                          </Text>
                          <Text style={{ fontSize: 12 }} myColor={'#848484'}>
                            {date}
                          </Text>
                        </View>
                        <Icon
                          icon={
                            document?.status?.toLowerCase() === 'pending'
                              ? 'hourglass'
                              : 'check'
                          }
                          circled={false}
                          color={'#BEBEBE'}
                        />
                      </View>
                    )}
                  </>
                );
              })}
          </View>
        )}
        <IconButton
          noMi
          size={14}
          icon="plus"
          style={{ [isRtl ? 'marginRight' : 'marginLeft']: 'auto', padding: 0 }}
          onPress={() => setState('form')}
        />
      </View>
    );
  }

  function renderShareholder() {
    const validationSchema = yup.object().shape({
      first_name: yup.string().required('First name is required'),
      last_name: yup.string().required('Last name is required'),
      role: yup.string().required('Role is required'),
      identificationDocuments: yup.string().required('ID type is required'),
      id_number: yup.string().required('ID number is required'),
    });

    return (
      <View>
        <Button
          label={'Back'}
          variant={'link'}
          className={classes.backButton}
          children={
            <View flex={1} fD={'row'} aI={'center'}>
              <Icon
                icon={isRtl ? 'arrowright' : 'arrowleft'}
                circled={false}
                color={'#707070'}
              />
              <Text
                id="shareholders"
                style={{
                  lineHeight: 0,
                  paddingRight: '0.5rem',
                  marginLeft: '0.5rem',
                }}
              />
            </View>
          }
          onPress={() => setState('list')}
        />
        <Formik validationSchema={validationSchema}>
          {formikProps => {
            const requireDocumentBack =
              documentCategories?.proof_of_identity?.options?.find(
                x => x.id === formikProps.values?.identificationDocuments,
              )?.requireBack;

            return (
              <Form style={{ width: '100%' }}>
                <FormikFields
                  fields={fields}
                  formikProps={formikProps}
                  inputComponents={Inputs}
                />
                <Text id="shareholder_id" />
                <View fD={'row'} aI={'center'} w={'100%'} mt={0.5} mb={1.5}>
                  <View w={'100%'}>
                    <FileUpload
                      onFileLoad={file => setDocumentFront(file)}
                      previewImage
                    />
                    {requireDocumentBack && (
                      <View w={'100%'} mt={0.5}>
                        <Text s={12} tA={'center'} id="front_of_document" />
                      </View>
                    )}
                  </View>
                  {requireDocumentBack && (
                    <>
                      <View mh={1} />
                      <View w={'100%'}>
                        <FileUpload
                          onFileLoad={file => setDocumentBack(file)}
                          previewImage
                        />
                        <View w={'100%'} mt={0.5}>
                          <Text s={12} tA={'center'} id="back_of_document" />
                        </View>
                      </View>
                    </>
                  )}
                </View>
                <Button
                  label="save"
                  capitalize
                  noPadding
                  variant={'contained'}
                  onPress={() => handleSubmit(formikProps)}
                  loading={submitting}
                  disabled={
                    !formikProps.isValid ||
                    !documentFront ||
                    (requireDocumentBack && !documentBack) ||
                    submitting
                  }
                  color={'primary'}
                  wide
                />
              </Form>
            );
          }}
        </Formik>
      </View>
    );
  }

  return state === 'list' ? renderList() : renderShareholder();
}

const useStyles = makeStyles(theme => ({
  backButton: {
    marginLeft: '-0.5rem',
    marginBottom: '1rem',
    padding: 0,
    '&:focus': { outline: 'none' },
  },
}));
