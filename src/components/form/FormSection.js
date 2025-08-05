import React, { useMemo } from 'react';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import BaseInputs from 'components/inputs';
import SingleImageUpload from 'components/inputs/SingleImageUpload';
import Group from './Group';
import Box from '@material-ui/core/Box';
import { useFormContext } from 'react-hook-form';

import InfoIcon from '@material-ui/icons/Info';
import Tooltip from 'components/outputs/Tooltip';
import Spinner from 'components/outputs/Spinner';
import { isEmpty } from 'lodash';

export default function FormSection(props) {
  const {
    item,
    index,
    altStyle,
    history,
    hide,
    noStyle,
    loading,
    footer,
    // Remove RHF methods from props destructuring
    // formState, // Removed
    // getValues, // Removed
    // ... and potentially others like errors if they were destructured
    ...restProps // Keep other passed props like data, etc.
  } = props;

  // Get RHF methods from context
  const methods = useFormContext();

  // Check if context exists (safeguard)
  if (!methods) {
    console.error('FormSection must be wrapped in a FormProvider');
    return null;
  }

  // Access RHF state/methods via the methods object
  const { formState, getValues } = methods;

  let { values = {} } = props;
  const isFormEmpty = useMemo(() => isEmpty(values), [values]);
  values = useMemo(() => (isFormEmpty ? getValues() : values), [values, getValues]);

  const {
    id,
    title,
    fields = [],
    fields2,
    props: inputProps,
    condition,
    info,
    actions,
  } = item;

  const hideCondition =
    typeof condition === 'function' && values && !condition(values);

  if (loading) return <Spinner />;
  const isRtl = document.dir === 'rtl';

  const Content = (
    <>
      {title && (
        <Box pb={1} pt={altStyle ? 2 : 0} display="flex" flexDirection="row">
          <Text variant="h6" width="auto" id={title} />
          {Boolean(info) && (
            <Tooltip id={info}>
              <InfoIcon
                color="primary"
                style={{
                  [isRtl ? 'marginRight' : 'marginLeft']: 4,
                  [isRtl ? 'paddingRight' : 'paddingLeft']: 4,
                }}
              />
            </Tooltip>
          )}
          {/* {actions?.length &&
            actions.map(action => (
              <Button
                noPadding
                size="small"
                variant="text"
                color="primary"
                label={action}
                onPress={() => history.push('edit/')}
                // {...action}
              />
            ))} */}
        </Box>
      )}
      <Box flexDirection="row" display="flex" pt={!title && !noStyle ? 2.5 : 0}>
        <Box flexDirection="column" display="flex" flex={1}>
          <InputLayout
            {...props}
            fields={fields}
            inputProps={inputProps}
            values={values}
          />
        </Box>
        {Boolean(fields2) && (
          <Box flexDirection="column" display="flex" flex={1} ml={2}>
            <InputLayout
              {...props}
              fields={fields2}
              inputProps={inputProps}
              values={values}
            />
          </Box>
        )}
      </Box>
      {footer}
    </>
  );

  return noStyle ? (
    Content
  ) : (
    <PageContent
      style={{
        backgroundColor: altStyle ? '#FAFAFA' : '#FFFFFF',
        // borderRadius: altStyle ? 15 : 0,
        marginBottom: altStyle ? 32 : 0,
        display: hide || hideCondition ? 'none' : 'inherit',
      }}
      border={index > 0}
      horizontal={4}>
      {Content}
    </PageContent>
  );
}

export function InputLayout(props) {
  const { fields = [], inputProps, values = {} } = props;

  return fields.map(field => {
    if (typeof field === 'function') {
      field = field(props);
    }
    if (
      (field.condition &&
        typeof field.condition === 'function' &&
        values &&
        field.condition(values)) ||
      typeof field.condition === 'undefined'
    ) {
      return field?.variant === 'group' ? (
        <Group marginTop={0.75}>
          {field?.fields.map((field, index) =>
            (field.condition &&
              typeof field.condition === 'function' &&
              field.condition(values)) ||
            typeof field.condition === 'undefined' ? (
              <InputComponent
                key={field?.name ?? field?.id ?? field ?? index}
                {...props}
                field={field}
                {...inputProps}
              />
            ) : null,
          )}
        </Group>
      ) : (
        <InputComponent
          key={field?.name ?? field?.id ?? field}
          {...props}
          field={field}
          {...inputProps}
        />
      );
    }
    return null;
  });
}

function InputComponent(props) {
  const {
    // Explicitly destructure props specific to InputComponent or Section logic
    field,
    altStyle,
    inputComponents: Inputs = BaseInputs,
    // Also destructure section config props that shouldn't reach TextField
    id,
    icon,
    imageSize,
    services,
    components,
    condition,
    // Collect the remaining props that *should* be passed down
    ...restProps
  } = props;

  const methods = useFormContext();

  if (!methods) {
    console.error('InputComponent must be wrapped in a FormProvider');
    return null;
  }

  const fieldName = field?.name ?? field?.id ?? field;
  const fieldVariant = field?.variant ?? fieldName;

  // Get RHF setValue method
  const { setValue } = methods;
  // Get existing profile URL from context.profile.items.profile
  const existingProfileUrl = restProps?.context?.profile?.items?.profile;

  // Special handling for profile_upload: Use direct import and pass correct props
  if (fieldName === 'profile_upload') {
    // console.log("FormSection/InputComponent: Rendering SingleImageUpload directly.");
    // Log the entire context object to find the correct path
    // console.log("FormSection/InputComponent: Context object:", restProps?.context);
    // console.log("FormSection/InputComponent: Passing existing=", existingProfileUrl);
    // console.log("FormSection/InputComponent: Passing setValue=", typeof setValue);
    return (
      <SingleImageUpload
        field={field} // Keep field for potential internal use by SingleImageUpload
        name={fieldName}
        backgroundColor={altStyle ? '#FAFAFA' : '#FFFFFF'}
        setValue={setValue} // Pass react-hook-form's setValue
        existing={existingProfileUrl} // Pass the correctly derived existing URL
        {...restProps} // Pass other relevant non-RHF props from restProps if needed
                      // Be cautious not to overwrite name, setValue, existing
      />
    );
  }

  // Default: Use the dispatcher, passing the RHF methods object as 'form'
  return (
    <Inputs
      field={field} // Pass the field configuration
      form={methods} // Pass the RHF methods object
      altStyle={altStyle} // Pass styling props
      {...restProps} // Pass any other remaining props
      // Ensure name/variant are correctly passed if not handled by restProps/field
      name={fieldName}
      variant={fieldVariant}
    />
  );
}
