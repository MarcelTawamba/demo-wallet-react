import React from 'react';
import { Box } from '@material-ui/core';
import { Button } from 'components/inputs/Button';

export default function FormActions(props) {
  let {
    pageId,
    history,
    isValid,
    screenId,
    itemId,
    onSubmit,
    inputPropsControl,
    formConfig,
    formMethods,
    color = 'primary',
  } = props;
  const isRtl = document.dir === 'rtl';
  const { saveLabel = 'save', validation, description } = formConfig;

  const isSubmitting = inputPropsControl?.formState?.isSubmitting ?? false;

  function handleBack() {
    history.push(
      '/' +
        screenId +
        '/' +
        (pageId ? pageId + '/' : '') +
        (itemId ? itemId + '/' : ''),
    );
  }

  let actions = [
    // { label: 'Preview', variant: 'text' },
    {
      id: 'cancel',
      capitalize: true,
      variant: 'outlined',
      onPress: handleBack,
      color: 'secondary',
    },
  ];
  if (formConfig?.actions?.length) {
    // Process each action in formConfig.actions
    const processedActions = formConfig.actions.map(action => {
      // If action is a function, call it with inputPropsControl and props
      return typeof action === 'function' ? action(inputPropsControl, props) : action;
    });
    actions = actions.concat(processedActions);
  }
  let isValidation = true;
  if (typeof validation === 'function') {
    const values = formMethods.getValues();
    isValidation = validation({ values });
  }
  actions.push({
    id: saveLabel,
    type: 'submit',
    onPress: onSubmit,
    disabled: !isValid || !isValidation,
    loading: isSubmitting,
  });

  return (
    <Box
      // pt={0.5}
      pb={1.5}
      flexDirection="row"
      display="flex"
      alignItems="flex-end">
      {actions.map((item, actionIndex) => {
        item =
          typeof item === 'function' ? item(inputPropsControl, props) : item;
        
        
        return (
          <Button
            key={item?.id ?? item?.label ?? actionIndex}
            color={color}
            noPadding
            size="small"
            style={{
              [isRtl ? 'marginLeft' : 'marginRight']:
                actionIndex === actions.length - 1 ? 0 : 16,
              maxHeight: 26,
            }}
            // zeroPadding
            thin
            {...item}
          />
        );
      })}
    </Box>
  );
}
