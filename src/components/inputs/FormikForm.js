import React from 'react';
import { Formik, Form } from 'formik';
import Input from './Input';
import * as _inputs from '../../config/inputs';
import ErrorOutput from '../outputs/Error';
import ButtonList from '../lists/ButtonList';
import { makeStyles } from '@material-ui/core';
import { omit } from 'lodash';
import IconLabelButton from './IconLabelButton';
import Group from 'components/form/Group';

const FormikForm = props => {
  let { actions, content, header, footer, onBack, ...otherProps } = props;
  // console.log('🚀 ~ FormikForm ~ props-age:', props);
  const classes = useStyles();

  return (
    <Formik {...otherProps}>
      {formikProps => (
        <Form>
          <div className={classes.container}>
            {Boolean(onBack?.label) && (
              <div style={{ paddingBottom: 8 }}>
                <IconLabelButton
                  label={onBack?.label}
                  icon={onBack?.icon}
                  onPress={onBack?.onPress}
                  show
                  variant="h6"
                />
              </div>
            )}
            {header}
            <FormikFields {...props} formikProps={formikProps} />
            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>
            {content}
            {Boolean(actions) && typeof actions === 'function' && (
              <ButtonList
                buttonPropsOverride={{
                  wrapperStyle: { paddingLeft: 0, paddingRight: 0 },
                }}
                items={actions(formikProps)}
                layout={'vertical'}
              />
            )}
            {footer}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export function FormikFields(props) {
  let {
    fields,
    noPadding,
    formikProps,
    locales,
    setAwaiting,
    inputComponents: InputComponents = Input,
    context,
  } = props;
  // console.log('🚀 ~ FormikFields ~ props:', props);

  fields = fields.filter(item => item);

  if (fields && fields.length > 0) {
    fields[0] = { ...fields[0], autoFocus: true };
  }

  const classes = useStyles();

  return (
    <div className={noPadding ? classes.noPadding : classes.inputs}>
      {fields.map(field => {
        if (typeof field === 'function') {
          field = field(props);
        }
        if (field.component) {
          return (
            <field.component
              formikProps={formikProps}
              context={context}
              {...omit(field, ['component'])}
            />
          );
        }

        return field?.variant === 'group' ? (
          <Group>
            {field?.fields.map(field => (
              <InputComponents
                field={field}
                key={field.name}
                formikProps={formikProps}
                setAwaiting={setAwaiting}
                locales={locales}
                context={context}
              />
            ))}
          </Group>
        ) : (
          <InputComponents
            field={field}
            key={field.name}
            formikProps={formikProps}
            setAwaiting={setAwaiting}
            locales={locales}
            context={context}
          />
        );
      })}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  noPadding: {
    paddingBottom: theme.spacing(0),
  },
  inputs: {
    paddingBottom: theme.spacing(2),
  },
}));

export default FormikForm;
