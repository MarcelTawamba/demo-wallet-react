import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Text from 'components/outputs/Text';
import ErrorOutput from 'components/outputs/Error';
import { MyCheckbox } from 'components/inputs/Input';
import PageButtons from 'components/layout/page/PageButtons';
import ButtonList from 'components/lists/ButtonList';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import makeStyles from '@material-ui/styles/makeStyles';
import { Button } from 'components/inputs/Button';

const DisclaimerPage = props => {
  const { company, onBack, onSuccess, setLoading, onAbout } = props;
  if (!company) onBack();

  let { config: client } = useConfiguration();

  const classes = useStyles(props);

  const { name, settings } = company;
  const { privacy_policy_url, terms_and_conditions_url } = settings;

  useEffect(() => {
    if (client.company) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, [onSuccess, setLoading]);

  const fields = [
    {
      id: 'check1',
      type: 'terms',
      label: 'disclaimer_checkbox_1',
      languageContext: { name },
    },
    {
      id: 'check2',
      type: 'terms',
      label: 'disclaimer_checkbox_2',
      languageContext: { name },
    },
  ];

  const formSchema = yup.object().shape({
    check1: yup.bool().oneOf([true], 'Please accept terms of service'),
    check2: yup
      .bool()
      .oneOf([true], 'Please accept wallet privacy policy and terms of use'),
  });

  const bullets = [
    'You are using the Rehive App that is administered by ' + name + '.',
    'Rehive is the software application and infrastructure provider for ' +
      name +
      ' and do not manage the underlying funds.',
    'All customer support requests will be forwarded to ' + name + '.',
    'All funds are controlled and managed by ' + name + '.',
    'Rehive is not responsible for the loss of funds.',
  ];

  let buttons = [
    {
      name: 'about',
      id: 'more_about_company',
      languageContext: { company: name },
      onPress: () => onAbout(),
      variant: 'text',
      wide: true,
      color: 'primary',
    },
    // {
    //   name: 'privacy_policy_url',
    //   label: 'Privacy policy',
    //   link: privacy_policy_url ? privacy_policy_url : client.privacy_policy_url,
    //   type: 'text',
    //   color: 'primary',
    // },
    // {
    //   name: 'terms_and_conditions_url',
    //   label: 'Terms of use',
    //   link: terms_and_conditions_url
    //     ? terms_and_conditions_url
    //     : client.terms_and_conditions_url,
    //   type: 'text',
    //   color: 'primary',
    // },
  ];

  // const text = `${name} is powered by the Rehive App. All funds, activities and support queries are administrated by ${name}. Rehive is not responsible for any possible loss of funds that may occur through mismanagement by ${name}.`;

  return (
    <div>
      <div className={classes.text}>
        <Text align="center" id="disclaimer_text" />
        {/* {bullets.map((bullet, index) => (
          <div key={index} className={classes.bulletContainer}>
            <div className={classes.bullet}>
              <Text>{'\u25CF'}</Text>
            </div>
            <div className={classes.bulletText}>
              <Text>{bullet}</Text>
            </div>
          </div>
        ))} */}
      </div>

      <Button {...buttons[0]} />

      <Formik
        initialValues={{
          check1: false,
          check2: false,
        }}
        validationSchema={formSchema}>
        {formikProps => (
          <React.Fragment>
            <div className={classes.checkboxes}>
              {fields.map((field, index) => (
                <MyCheckbox
                  key={field.id}
                  formikProps={formikProps}
                  {...field}
                  setFieldValue={(id, value) =>
                    formikProps.setFieldValue(field.id, value)
                  }
                />
              ))}
            </div>

            <ErrorOutput>
              {formikProps.status && formikProps.status.error}
            </ErrorOutput>

            <ButtonList
              layout={'vertical'}
              items={[
                {
                  label: 'continue',
                  capitalize: true,
                  color: 'primary',
                  onPress: () => onSuccess(formikProps),
                  disabled: !formikProps.isValid || formikProps.isSubmitting,
                  loading: formikProps.isSubmitting,
                },
              ]}
            />
          </React.Fragment>
        )}
      </Formik>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  checkboxes: {
    // paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  text: {
    paddingBottom: theme.spacing(1),
  },
  bullet: {
    paddingLeft: theme.spacing(1),
    minWidth: theme.spacing(4),
  },
  bulletText: {
    display: 'flex',
    // flex: 1,
  },
  bulletContainer: {
    width: '100%',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default DisclaimerPage;
