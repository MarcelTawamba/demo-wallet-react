import React, { useEffect } from 'react';
import FormLayout from 'components/layout/Form';
import PageTitle from 'components/layout/page/PageTitle';
import FormSection from './FormSection';
import { Button } from 'components/inputs/Button';
import { FormProvider } from 'react-hook-form';

import Spinner from 'components/outputs/Spinner';
import ErrorOutput from 'components/outputs/Error';
import PageButtons from 'components/layout/page/PageButtons';
import Info from 'components/outputs/Info';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

export default function Basic(props) {
  const {
    header,
    layoutProps,
    inputPropsControl,
    handleSubmit,
    noLayout,
    formConfig,
    noPageButtonPadding = true,
    footer,
    padded,
    data,
    screenConfig,
    context,
    reduxContext,
    showToast,
    setItem,
    formError,
    onCancel,
    onSuccess,
    isSubmitting,
    isAdd,
    noStyle,
  } = props;

  const {
    fields,
    sections,
    title,
    titleAction,
    submitLabel,
    submitLabelCapitalize,
    loading,
    onSubmit = data => console.log(data),
    inputComponents,
    actions,
    warning,
    isInvalid,
    locales,
    subtitle,
  } = formConfig;

  const { formState = {}, errors, reset } = inputPropsControl;
  const { isValid } = formState;
  const inputs = screenConfig?.configs?.inputs ?? {};

  const error = errors?.form ?? props?.error ?? '';
  const isLoading =
    (typeof loading === 'function' && loading(props)) || props?.loading;
  if (isLoading) return <Spinner />;

  let buttons = [
    {
      type: 'submit',
      id: submitLabel,
      capitalize: submitLabelCapitalize,
      loading: isSubmitting || formState?.isSubmitting,
      disabled:
        isInvalid ||
        !isValid ||
        isSubmitting ||
        formState?.isSubmitting ||
        formError,
    },
  ];
  if (onCancel && typeof onCancel === 'function') {
    buttons.push({
      id: 'cancel',
      onClick: onCancel,
      variant: 'text',
    });
  }

  const Content = (
    <div style={{ width: '100%' }}>
      {Boolean(header) && header}
      {Boolean(title) && (
        <PageTitle
          align="center"
          actions={
            Boolean(typeof titleAction?.onPress === 'function') && (
              <Button
                color="primary"
                variant="text"
                {...titleAction}
                onPress={() => titleAction.onPress(inputPropsControl, props)}
                loading={
                  typeof titleAction?.loading === 'function'
                    ? titleAction.loading(props)
                    : false
                }
              />
            )
          }>
          {title}
        </PageTitle>
      )}
      {subtitle && (
        <div>
          <Text id={subtitle} />
        </div>
      )}
      <ErrorOutput>{error}</ErrorOutput>
      <form
        onSubmit={handleSubmit(values => {
          const transformedValues = { ...values };
          if (transformedValues.hasOwnProperty('mobile_number')) {
            transformedValues.number = transformedValues.mobile_number;
            delete transformedValues.mobile_number;
          }
          onSubmit(transformedValues, inputPropsControl, props);
        })}
      >
        <FormProvider {...inputPropsControl}>
          {sections && sections.length ? (
            sections.map((section, index) => (
              <FormSection
                noStyle={noStyle}
                isAdd={isAdd}
                key={section?.id ?? section}
                item={section}
                index={index}
                context={{ ...reduxContext, ...context }}
                {...data}
                inputs={inputs}
                inputComponents={inputComponents}
                showToast={showToast}
                locales={locales}
                setItem={setItem}
                onCancel={onCancel}
                onSuccess={onSuccess}
              />
            ))
          ) : fields ? (
            <FormSection
              isAdd={isAdd}
              item={{ fields }}
              context={{ ...reduxContext, ...context }}
              {...data}
              inputs={inputs}
              inputComponents={inputComponents}
              showToast={showToast}
              locales={locales}
              setItem={setItem}
              noStyle={noStyle}
            />
          ) : null}
        </FormProvider>
        <ErrorOutput>{formError}</ErrorOutput>

        {Boolean(submitLabel) && (
          <View ph={padded ? 0.5 : 0} pt={noStyle ? 0.5 : 0}>
            <PageButtons
              layout="vertical"
              noPadding={Boolean(noPageButtonPadding && footer) || noStyle}
              items={buttons}
            />
          </View>
        )}
        {Boolean(footer) && footer}
      </form>
    </div>
  );

  if (noLayout) {
    return Content;
  }

  return (
    <FormLayout
      header={Boolean(warning) && <Info>{warning}</Info>}
      noPadding
      maxWidth={600}
      {...layoutProps}>
      {Content}
    </FormLayout>
  );
}
