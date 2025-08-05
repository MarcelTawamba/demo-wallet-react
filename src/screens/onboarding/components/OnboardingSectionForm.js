/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { FormikFields } from 'components/inputs/FormikForm';
import { Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Card from '@material-ui/core/Card';
import PageContent from 'components/layout/page/PageContent';
import ErrorOutput from 'components/outputs/Error';
import Inputs from './inputs';
import * as _inputs from 'config/inputs';
import { isEqual } from 'lodash';
import DocumentOptionSelection from './DocumentOptionSelection';
import { validateRequiredFieldsNew } from '../config/utils';
import { useAddressesFetch } from 'hooks/addressAPI';
import { IconButton } from '@material-ui/core';
import { ArrowForwardIos, Done } from '@material-ui/icons';

import { validateTierAndReqCompletion } from '../util/tierCompletion';
import Image from 'components/outputs/Image';
export default function OnboardingSectionForm(props) {
  const {
    onNext,
    error,
    onPrevious,
    formikProps,
    locales,
    context,
    saveOnly,
    isOnboardingComplete,
    showToast,
    onSuccess,
    activeTier,
    setActiveTier,
    activeTierRequirement,
    activeTierSubRequirement,
    selectedRequirementSet,
    setActiveTierRequirement,
    setActiveTierSubRequirement,
    minimumTierRequirement,
    tierConfig,
    addresses,
    userDocuments,
    userActiveTierLevel,
  } = props;

  const [refreshView, setRefreshView] = useState(false);

  const theme = UI_useTheme();
  const classes = useStyles(theme);
  const config = {}; // only one business section has config value
  const {
    fields = [],
    isDocumentSelection,
    isDocumentSelectionCompleted,
  } = selectedRequirementSet || {};

  const { isSubmitting, values, setErrors, errors: formikErrors } = formikProps;

  const userAddresses = useAddressesFetch(context?.user?.id)?.data;
  const errors = useMemo(
    () => validateRequiredFieldsNew(values, fields, userAddresses),
    [values, activeTierRequirement, activeTierSubRequirement, userAddresses],
  );

  useEffect(() => {
    if (errors && !isEqual(errors, formikErrors)) setErrors(errors);
    else if (!errors && Object.keys(formikErrors).length) setErrors({});
  }, [errors, formikErrors]);

  const [awaiting, setAwaiting] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const continuePlaidRef = useRef(null);
  const [hideLayout, setHideLayout] = useState(false);

  // Update fields with type and options from inputs.js
  const updated_fields = fields.map(field => {
    if (field.type in _inputs) {
      return {
        ...field,
        type: _inputs[field.type].type || field.type,
        options: _inputs[field.type].options || field.options
      };
    }
    return field;
  });


  const handleTierSubRequirementClick = (requirementSet, subRequirementSet) => {
    if (subRequirementSet.id === activeTierSubRequirement?.id) return;
    if (requirementSet?.id !== activeTierRequirement?.id)
      setActiveTierRequirement(requirementSet);
    setActiveTierSubRequirement(subRequirementSet);
  };

  // useEffect(() => {
  //   setHideButtons(false);
  //   hideLayout && setHideLayout(false);
  // }, [activeSectionIndex]);

  const isDisableNext = useMemo(() => {
    // Special case: if user is fully verified and no fields exist, enable next button
    if (userActiveTierLevel >= minimumTierRequirement && fields.length === 0) {
      return false;
    }

    // console.log('active->req', activeTierRequirement);
    // console.log('active->subreq', activeTierSubRequirement);
    // console.log('errors', errors);
    validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
      user: context?.user,
      addresses,
      userDocuments,
    });

    let _isDisableNext =
      isSubmitting ||
      errors ||
      (!activeTierRequirement?.isCompleted && !activeTierSubRequirement);

    if (
      selectedRequirementSet?.isDocumentSelection &&
      !selectedRequirementSet?.isDocumentSelectionCompleted
    ) {
      if (
        !selectedRequirementSet ||
        !selectedRequirementSet?.isDocumentSelectionCompleted
      )
        _isDisableNext = true;
      if (selectedRequirementSet?.isCompleted === true) {
        _isDisableNext = false;
      }
      if (
        selectedRequirementSet?.selectedDocuments?.length >=
        selectedRequirementSet?.min_condition_matches
      ) {
        _isDisableNext = false;
      }
    } else if (
      selectedRequirementSet?.isDocumentSelection &&
      selectedRequirementSet?.isDocumentSelectionCompleted
    ) {
      _isDisableNext = false;
    }

    if (
      !selectedRequirementSet?.isCompleted &&
      _isDisableNext === true &&
      !error &&
      selectedRequirementSet?.isDocumentSelection === false
    ) {
      _isDisableNext = false;
    }
    if (
      (activeTierRequirement?.min_condition_matches ??
        activeTierRequirement?.subRequirementSets?.length) <=
      activeTierRequirement?.subRequirementSets?.filter(
        item => item.isCompleted === true,
      ).length
    ) {
      _isDisableNext = false;
    }
    return _isDisableNext;
  }, [
    isSubmitting,
    errors,
    selectedRequirementSet,
    refreshView,
    values,
    userDocuments,
    selectedRequirementSet?.selectedDocuments,
    userActiveTierLevel,
    minimumTierRequirement,
    fields.length,
  ]);

  const hideFormLayout = () => {
    setHideLayout(true);
  };
  const isRtl = document.dir === 'rtl';
  const isPreviousDisabled = useMemo(
    () =>
      !(
        activeTier?.prevTier ||
        activeTierSubRequirement?.prevTier ||
        selectedRequirementSet?.prevTier
      ),
    [activeTier, activeTierSubRequirement, selectedRequirementSet],
  );

  return (
    <React.Fragment>
      {!hideLayout && (
        <View mb={1} flex={1} fD={'row'} aI={'center'}>
          <View mr={isRtl ? 0 : 2} ml={isRtl ? 2 : 0}>
            {/* <Image name={activeSection.image} /> */}
            {/* <IconButton
              disabled
              style={{
                padding: '25px',
                width: '100px',
                height: '100px',
              }}> */}
            {/* <Icon
                circled={true}
                icon={'customer'}
                style={{
                  borderRadius: 70,
                  minHeight: 0,
                  maxHeight: 0,
                }}
                color={`${theme.palette.secondary.light}`}
                size={100}
                transparent
              /> */}
            <Image src={'basic_info'} width={80} height={80} />
            {/* </IconButton> */}
          </View>
          <View>
            <Text
              style={{ fontSize: 20, marginBottom: '1rem' }}
              id={userActiveTierLevel >= minimumTierRequirement && fields.length === 0 ? 
                'verification_complete_title' : 
                undefined
              }
            >
              {userActiveTierLevel >= minimumTierRequirement && fields.length === 0 ? 
                undefined : 
                (selectedRequirementSet?.name ?? 'No requirements')
              }
            </Text>
            <Text
              style={{ fontSize: 15, color: '#797979' }}
            >
              {userActiveTierLevel >= minimumTierRequirement && fields.length === 0 ? 
                '' : 
                selectedRequirementSet?.description
              }
            </Text>
          </View>
        </View>
      )}

      <Card className={classes.card}>
        <PageContent
          horizontal={config?.noPadding ? 0 : 3}
          pb={config?.noPadding ? 0 : 3}>
          <Box pt={config?.noPadding ? 0 : 2}>
            {!activeTierRequirement?.fields?.length &&
            activeTierRequirement?.subRequirementSets?.length &&
            !activeTierSubRequirement ? null : isDocumentSelection &&
              !isDocumentSelectionCompleted ? (
              <DocumentOptionSelection
                refreshView={refreshView}
                setRefreshView={setRefreshView}
                selectedRequirementSet={selectedRequirementSet}
                user={context?.user}
              />
            ) : fields.length === 0 ? (
              <View style={{ padding: '16px 0 32px 0', textAlign: 'center' }}>
                {userActiveTierLevel >= minimumTierRequirement ? (
                  <Text
                    c="#797979"
                    tA="center"
                    s={14}
                    id="verification_complete_description"
                  />
                ) : (
                  <Text
                    c="#797979"
                    tA="center"
                    s={14}
                    id="no_requirements_for_tier"
                  />
                )}
              </View>
            ) : (
              <FormikFields
                context={{
                  ...context,
                  onSuccess,
                  setHideButtons,
                  continuePlaidRef,
                  isOnboardingComplete,
                  showToast,
                  setAwaiting,
                  hideFormLayout,
                  activeTierSubRequirement,
                  onPrevious,
                }}
                noPadding={config?.noPadding}
                locales={locales}
                fields={
                  isDocumentSelection
                    ? updated_fields.filter(field =>
                        selectedRequirementSet?.selectedDocuments?.includes(
                          field.itemId.toString(),
                        ),
                      )
                    : updated_fields
                }
                formikProps={formikProps}
                setAwaiting={setAwaiting}
                inputComponents={Inputs}
              />
            )}
          </Box>
          {typeof error === 'string' && (
            <ErrorOutput pt={0} pb={2}>
              {error}
            </ErrorOutput>
          )}

          {activeTierRequirement?.fields &&
          activeTierRequirement?.subRequirementSets &&
          !activeTierSubRequirement ? (
            <View flex={1} fD={'row'} aI={'center'} jC={'space-between'}>
              <View></View>
              <View w={'50%'} mb={0.3}>
                <Button
                  id={'save'}
                  type="submit"
                  noPadding
                  variant={'contained'}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  color="primary"
                  wide
                  capitalize
                  onClick={e => {
                    e.preventDefault();
                    onNext(values, formikProps, 'save'); //only save data and to prevent default next page loading,
                  }}
                />
              </View>
            </View>
          ) : null}

          {(!activeTierSubRequirement &&
            !activeTierRequirement?.fields &&
            activeTierRequirement?.subRequirementSets?.length > 0) ||
          (activeTierRequirement?.fields &&
            activeTierRequirement?.subRequirementSets &&
            !activeTierSubRequirement) ? (
            <View>
              <Text
                tA="right"
                style={{
                  margin:
                    activeTierRequirement?.fields &&
                    activeTierRequirement?.subRequirementSets &&
                    !activeTierSubRequirement
                      ? '12px 0 14px 0'
                      : '0px 0 16px 0',
                }}
                context={{
                  needToComplete: activeTierRequirement?.min_condition_matches
                    ? activeTierRequirement.min_condition_matches
                    : 'ALL',
                }}
                id={'please_complete_all_sections_below'}
              />

              <View fD={'column'} w={'100%'} mb={2} gap={0.75}>
                {activeTierRequirement?.subRequirementSets &&
                  activeTierRequirement.subRequirementSets?.map(
                    subRequirementSet => (
                      <View
                        fD={'row'}
                        aI={'center'}
                        jC={'space-between'}
                        w={'100%'}
                        bC={'white'}
                        pl={1}
                        pr={0.5}
                        pt={0.15}
                        pb={0.15}
                        bR={12}
                        mb={0.5}
                        style={{
                          cursor: 'pointer',
                          boxShadow: '0px 0px 4px 0px #BEBEBE',
                        }}
                        onClick={() =>
                          handleTierSubRequirementClick(
                            activeTierRequirement,
                            subRequirementSet,
                          )
                        }>
                        <View button>
                          <Text color="primary">{subRequirementSet.name}</Text>
                        </View>
                        <View>
                          <IconButton>
                            {subRequirementSet.isCompleted ? (
                              <Done
                                style={{
                                  color: '#fff',
                                  background: '#2CB392',
                                  borderRadius: '50%',
                                  padding: '6px',
                                  fontSize: '1.8rem',
                                }}
                              />
                            ) : (
                              <ArrowForwardIos
                                style={{
                                  color: 'gray',
                                  // background: '#2CB392',
                                  borderRadius: '50%',
                                  padding: '5px',
                                  paddingRight: 0,
                                  fontSize: '1.8rem',
                                }}
                              />
                            )}
                          </IconButton>
                        </View>
                      </View>
                    ),
                  )}
              </View>
            </View>
          ) : null}

          <View flex={1} fD={'row'} aI={'center'} jC={'space-between'}>
            <Button
              id={isPreviousDisabled ? '' : 'previous_step'}
              onPress={onPrevious}
              variant={'text'}
              color="primary"
              disabled={isSubmitting || isPreviousDisabled}
              noPadding
              style={{
                display:
                  (activeTierSubRequirement?.fields[0]?.type ===
                    'onboarding_address' &&
                    !activeTierSubRequirement?.isCompleted) ||
                  !(
                    selectedRequirementSet?.prevReqSet ||
                    selectedRequirementSet?.prevSubReqSet
                  )
                    ? 'none'
                    : '',
              }}
            />
            <View w={'50%'}>
              <Button
                id={userActiveTierLevel >= minimumTierRequirement && fields.length === 0 ? 'done' : 'next'}
                type="submit"
                noPadding
                variant={'contained'}
                loading={isSubmitting}
                disabled={isDisableNext}
                color="primary"
                wide
                capitalize
                onClick={userActiveTierLevel >= minimumTierRequirement && fields.length === 0 ? 
                  (e) => {
                    e.preventDefault();
                    window.location.href = '/';
                  } : 
                  undefined
                }
              />
            </View>
          </View>
        </PageContent>
      </Card>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    overflow: 'unset',
  },
}));
