import React, { useState } from 'react';
import FormSection from './FormSection';
import ErrorOutput from 'components/outputs/Error';
import { FormProvider } from 'react-hook-form';

import TabHeader from './TabHeader';
import { Scrollbars } from 'react-custom-scrollbars-better';
import Info from 'components/outputs/Info';
import DetailSkeleton from 'components/layouts/Detail/DetailSkeleton';
import FormActions from './FormActions';
import { View } from 'components/layout/View';

export default function TabbedForm(props) {
  const {
    header,
    inputPropsControl,
    handleSubmit,
    formConfig,
    data,
    screenConfig,
    context,
    reduxContext,
    refreshItem,
    showToast,
    item,
    itemId,
  } = props;

  let {
    sections,
    title,
    tabs,
    isNumberedTab,
    loading,
    onSubmit = data => console.log(data),
    inputComponents,
    locales,
    defaultValues,
    warning,
    isInvalid,
    skeleton,
    fields,
  } = formConfig;

  if (!tabs && !sections && fields) {
    tabs = [''];
    sections = [
      {
        id: 'product_details',
        tab: '',
        fields,
      },
    ];
  }

  const isSingleInput =
    fields?.length === 1 ||
    (sections?.length === 1 && sections?.[0]?.fields?.length === 1);

  if (!tabs && sections) {
    tabs = [''];
    sections = sections.map(item => ({ ...item, tab: '' }));
  }

  const { formState = {}, errors, reset, watch } = inputPropsControl;
  const values = watch();
  const { isSubmitting, isValid } = formState;
  const inputs = screenConfig?.configs?.inputs ?? {};
  const [tabId, setTabId] = useState(tabs?.[0]);

  const error = errors?.form?.message ?? props?.error ?? '';
  const isLoading =
    (typeof loading === 'function' && loading(props)) || loading;

  // Check custom validation if available
  let customIsValid = true;
  if (typeof formConfig?.validation === 'function') {
    customIsValid = formConfig.validation({ values });
  }

  // Use custom validation if React Hook Form isValid is false but we have custom validation
  const finalIsValid = isValid || (customIsValid && !isValid);

  if (isLoading || (itemId && !item)) {
    return skeleton ? <DetailSkeleton variant skeleton={skeleton} /> : null;
  }

  const headerProps = {
    ...props,
    hideActions: isSingleInput,
    tabs,
    isNumberedTab,
    tabId,
    setTabId,
    title,
    isValid: finalIsValid && !isInvalid,
    onSubmit: typeof formConfig?.validation === 'function' 
      ? () => {
          // For forms with custom validation, bypass React Hook Form validation
          const values = watch();
          return onSubmit(values, inputPropsControl, props);
        }
      : handleSubmit(values =>
          onSubmit(values, inputPropsControl, props),
        ),
  };

  const Content = (
    <Scrollbars
      autoHide
      rtl={document.dir === 'rtl'}
      style={{
        width: '100%',
        height: '100%',
        // minHeight: 200,
      }}>
      <div style={{ width: '100%', overflow: 'hidden', paddingBottom: 100 }}>
        <form
          onSubmit={handleSubmit(values =>
            onSubmit(values, inputPropsControl, props),
          )}>
          <FormProvider {...inputPropsControl}>
            {sections?.length
              ? sections.map(section => (
                  <FormSection
                    hide={section?.tab !== tabId}
                    altStyle
                    defaultValues={{ ...defaultValues, ...(item ?? {}) }}
                    key={section?.id ?? section}
                    item={{ ...section }}
                    context={{ ...reduxContext, ...context, item }}
                    formState={formState}
                    {...inputPropsControl}
                    // {...data}
                    inputs={inputs}
                    inputComponents={inputComponents}
                    showToast={showToast}
                    locales={locales}
                    refreshItem={refreshItem}
                    footer={
                      isSingleInput && (
                        <View pt={0.5} flex={1} aI="flex-end" w="100%">
                          <FormActions {...headerProps} color="primary" />
                        </View>
                      )
                    }
                  />
                ))
              : null}
            <ErrorOutput>{error}</ErrorOutput>
          </FormProvider>
        </form>
      </div>
    </Scrollbars>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
      <TabHeader {...headerProps} />

      {Boolean(warning) && <Info mt={1} id={warning} />}
      {Content}
    </div>
  );
}
