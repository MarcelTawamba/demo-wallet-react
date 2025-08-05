/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { FormikFields } from 'components/inputs/FormikForm';
import { Box } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Card from '@material-ui/core/Card';
import Image from 'screens/onboarding/components/images';
import Inputs from 'screens/onboarding/components/inputs';
import PageContent from 'components/layout/page/PageContent';
import ErrorOutput from 'components/outputs/Error';
import { isEqual } from 'lodash';

export default function OnboardingSectionForm(props) {
  const {
    activeSection,
    activeSectionIndex,
    error,
    onPrevious,
    formikProps,
    locales,
    context,
    saveOnly,
    isOnboardingComplete,
    showToast,
    onSuccess,
  } = props;
  const classes = useStyles();
  const {
    fields,
    validate,
    mappedFields,
    config = {},
    hideSaveButton,
  } = activeSection;
  const { isSubmitting, values, setErrors, errors: formikErrors } = formikProps;
  const errors =
    typeof validate === 'function' ? validate(values, mappedFields) : false;
  useEffect(() => {
    if (errors && !isEqual(errors, formikErrors)) setErrors(errors);
    else if (!errors && Object.keys(formikErrors).length) setErrors({});
  }, [errors, formikErrors]);

  const [awaiting, setAwaiting] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const continuePlaidRef = useRef(null);
  const [plaidSuccess, setPlaidSuccess] = useState(false);
  const [hideLayout, setHideLayout] = useState(false);

  useEffect(() => {
    setHideButtons(false);
    hideLayout && setHideLayout(false);
  }, [activeSectionIndex]);

  function handlePlaidClick() {
    if (continuePlaidRef.current) {
      continuePlaidRef.current.click();
    }
  }

  const hideFormLayout = () => {
    setHideLayout(true);
  };
  const isRtl = document.dir === 'rtl';

  return (
    <React.Fragment>
      {!hideLayout && (
        <View mb={2} flex={1} fD={'row'} aI={'center'}>
          <View mr={isRtl ? 0 : 2} ml={isRtl ? 2 : 0}>
            <Image name={activeSection.image} />
          </View>
          <View>
            <Text
              style={{ fontSize: 20, marginBottom: '1rem' }}
              id={`${activeSection.id}_title`}
            />
            <Text
              style={{ fontSize: 15, color: '#797979' }}
              id={`${activeSection.id}_subtitle`}
            />
          </View>
        </View>
      )}
      <Card className={classes.card}>
        <PageContent
          horizontal={config?.noPadding ? 0 : 3}
          pb={config?.noPadding ? 0 : 3}>
          <Box pt={config?.noPadding ? 0 : 2}>
            <FormikFields
              context={{
                ...context,
                onSuccess,
                setHideButtons,
                continuePlaidRef,
                isOnboardingComplete,
                showToast,
                setPlaidSuccess,
                setAwaiting,
                hideFormLayout,
              }}
              noPadding={config?.noPadding}
              locales={locales}
              fields={fields}
              formikProps={formikProps}
              setAwaiting={setAwaiting}
              inputComponents={Inputs}
            />
          </Box>
          {typeof error === 'string' && (
            <ErrorOutput pt={0} pb={2}>
              {error}
            </ErrorOutput>
          )}
          {!hideLayout && (
            <View flex={1} fD={'row'} aI={'center'} jC={'space-between'}>
              {!(hideButtons || (saveOnly && hideSaveButton)) &&
                (saveOnly ? (
                  <View mt={1} w={'100%'}>
                    <Button
                      id="save"
                      type="submit"
                      loading={isSubmitting}
                      color={'primary'}
                      noPadding
                      wide
                      capitalize
                    />
                  </View>
                ) : (
                  <>
                    <Button
                      id={'previous_step'}
                      onPress={onPrevious}
                      variant={'text'}
                      color={'primary'}
                      disabled={activeSectionIndex === 0}
                      noPadding
                    />
                    <View w={'50%'}>
                      <Button
                        id={'next'}
                        type="submit"
                        noPadding
                        variant={'contained'}
                        loading={isSubmitting}
                        disabled={awaiting || isSubmitting || errors}
                        color={'primary'}
                        wide
                        capitalize
                      />
                    </View>
                  </>
                ))}
            </View>
          )}
        </PageContent>
      </Card>
    </React.Fragment>
  );
}

const useStyles = makeStyles(() => ({
  card: {
    boxShadow: 'none',
    overflow: 'unset',
  },
}));
