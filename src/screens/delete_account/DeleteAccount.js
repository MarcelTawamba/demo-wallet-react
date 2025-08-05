import React, { useState } from 'react';
import * as yup from 'yup';
import { Link, useLocation } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Input from 'components/inputs/Input';
import ErrorOutput from 'components/outputs/Error';
import { paramsToObj } from 'util/general';
import * as _inputs from 'config/inputs';
import Text from 'components/outputs/Text';
import Logo from 'components/rehive/Logo';
import {
  resetPasswordConfirm,
  getPublicCompany,
  getCompanyAppConfig,
  makeDeleteRequest,
} from 'util/rehive';
import AuthForm from 'components/layout/AuthForm';
import { SplashScreen } from 'components/rehive/SplashScreen';
import { MuiThemeProvider, createTheme, makeStyles } from '@material-ui/core';
import { useTheme, ThemeProvider } from 'components/app/context';
import { useQuery } from 'react-query';
import muiConfig from 'config/config/mui';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import Spinner from 'components/outputs/Spinner';

export default function DeleteAccount() {
  const classes = useStyles();
  const location = useLocation();
  const params = paramsToObj(location?.search ?? '');

  let { config: client } = useConfiguration();

  const companyId = client?.company;

  const queryCompany = useQuery(
    ['company', companyId],
    () => getPublicCompany(companyId, true),
    {
      enabled: Boolean(companyId),
    },
  );
  const queryCompanyConfig = useQuery(
    ['companyConfig', companyId],
    () => getCompanyAppConfig(companyId),
    { enabled: Boolean(companyId) },
  );

  const company = queryCompany?.data;
  // console.log(client?.company, 'queryCompany', queryCompany);

  const handleSubmit = async (values, props) => {
    const { email, company } = values;
    const { setStatus, setFieldTouched, setFieldValue, setSubmitting } = props;
    try {
      setStatus({ error: '' });
      const data = {
        user: email,
        company: company,
      };
      const newData = await makeDeleteRequest(data);
      const { status, message } = newData;
      setStatus({
        success: status === 'error' ? false : true,
        error: status === 'error' ? message : '',
      });
    } catch (error) {
      setStatus({ error: error.message, success: false });
    }

    // Reset form fields and submission state
    // setFieldValue('email', '');
    // setFieldValue('company', '');
    setFieldTouched('email', false);
    setFieldTouched('company', false);
    setSubmitting(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    company: yup
      .string()
      .min(2, 'Must be a minimum of 2 characters')
      .required('Company name is required'),
  });

  const { colors: baseColors, design } = useTheme();
  const { colors = baseColors } = queryCompanyConfig?.data?.config ?? {};
  const { primary } = colors;
  const newTheme = createTheme({
    ...muiConfig,
    palette: { primary: { main: primary, contrastText: '#FFF' } },
  });

  return companyId && !company ? (
    <SplashScreen />
  ) : (
    <div className={classes.container}>
      <View>
        <Logo
          noBorder
          type="rehive-icon"
          height={100}
          width={100}
          image={company?.icon ?? ''}
        />
      </View>
      <div
        className={classes.paper}
        style={{
          backgroundColor: '#FFFFFF',
        }}>
        <div className={classes.innerContainer}>
          <Formik
            initialValues={{
              company: companyId ? companyId : '',
            }}
            style={{
              minWidth: '700px',
            }}
            // isInitialValid={type === 'forgot' && email}
            validationSchema={schema}
            onSubmit={(values, formikBag) => handleSubmit(values, formikBag)}>
            {formikProps => (
              <MuiThemeProvider theme={newTheme}>
                <ThemeProvider value={{ colors, design }}>
                  {!formikProps?.status?.success ? (
                    <React.Fragment>
                      <View fD={'column'} gap={1} aI={'start'}>
                        <Text
                          id={'account_deletion_request_title'}
                          c="#000000"
                          align="left"
                          variant={'h4'}
                          bold
                          style={{
                            width: '100%',
                          }}
                          context={{
                            companyName: company?.name
                              ? ' on ' + company?.name
                              : '',
                          }}
                        />
                        <Text
                          align="left"
                          c="#000000"
                          style={{ margin: '16px 0 4px' }}
                          id={'account_deletion_request_notify_msg'}
                        />
                        <Text
                          align="left"
                          c="#000000"
                          id="account_deletion_request_recieve_email"
                        />
                      </View>
                    </React.Fragment>
                  ) : null}

                  <Form>
                    <View aI={'center'} jC={'space-around'} ph={0.5} w={'100%'}>
                      {formikProps.status && formikProps.status.success ? (
                        <React.Fragment>
                          <Text
                            align="center"
                            id={'request_delete_success'}></Text>
                        </React.Fragment>
                      ) : (
                        <View>
                          <View w={'350px'} gap={0.5} pt={1}>
                            {!companyId && (
                              <Input
                                field={_inputs.companyName}
                                formikProps={formikProps}
                              />
                            )}
                            <Input
                              field={_inputs.deleteAccountEmail}
                              formikProps={formikProps}
                            />
                            <ErrorOutput>
                              {formikProps.status && formikProps.status.error}
                            </ErrorOutput>

                            <View ph={2} pt={1} aI={'center'} w={'100%'}>
                              <Button
                                id="request_delete"
                                type="submit"
                                color="primary"
                                capitalize
                                variant={'contained'}
                                size="large"
                                wide
                                disabled={
                                  !formikProps.isValid ||
                                  formikProps.isSubmitting
                                }
                                loading={formikProps.isSubmitting}
                                wrapperStyle={{
                                  width: 200,
                                }}
                                style={{
                                  height: 46,
                                  borderRadius: 4,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  </Form>
                </ThemeProvider>
              </MuiThemeProvider>
            )}
          </Formik>
          <View />
        </div>
      </div>
      <View>
        <Text variant={'body2'} align={'center'} bold>
          {company?.name}
        </Text>
      </View>
    </div>
  );
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#FAFAFA',
  },

  innerContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1),
    maxWidth: '700px',
  },
  paper: {
    margin: theme.spacing(2),
    padding: theme.spacing(5),
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: ({ wide }) => (wide ? 780 : 700),
    [theme.breakpoints.down(440)]: {
      width: '100%',
      margin: 0,
      marginTop: theme.spacing(2),
    },
    border: '1px solid #EFEFEF',
    backgroundColor: 'white',
  },
}));
