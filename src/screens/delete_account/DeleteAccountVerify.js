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
  makeDeleteRequestVerify,
} from 'util/rehive';
import AuthForm from 'components/layout/AuthForm';
import { SplashScreen } from 'components/rehive/SplashScreen';
import {
  Checkbox,
  MuiThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core';
import { useTheme, ThemeProvider } from 'components/app/context';
import { useQuery } from 'react-query';
import muiConfig from 'config/config/mui';

import { useConfiguration } from 'components/contexts/ConfigurationContext';

export default function DeleteAccountVerify() {
  const classes = useStyles();
  const location = useLocation();
  const params = paramsToObj(location?.search ?? '');
  const { key } = params;

  let { config: client } = useConfiguration();

  const companyId = client?.company ? client?.company : params?.company ?? '';

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
  // console.log('queryCompany', queryCompany);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setLoading(true);
    try {
      const data = {
        key: key,
      };
      const res = await makeDeleteRequestVerify(data);
      const { status, message } = res;
      if (status === 'error') {
        setError(message);
      } else {
        setError('success');
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const { colors: baseColors, design } = useTheme();
  const { colors = baseColors } = queryCompanyConfig?.data?.config ?? {};
  const { primary } = colors;

  const [checked, setChecked] = React.useState(false);

  const handleChange = event => {
    setChecked(event.target.checked);
  };

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
        {error === 'success' ? (
          <View fD={'column'} gap={1} aI={'start'}>
            <Text
              c="#000000"
              align="left"
              variant={'h4'}
              bold
              style={{
                width: '100%',
              }}
              id="account_deletion_verify_title"
              context={{
                companyName: company?.name ? ' on ' + company?.name : '',
              }}
            />
            <Text
              align="left"
              c="#000000"
              id="account_deletion_verify_success"
              context={{
                companyName: company?.name ? company?.name : '',
              }}
            />

            <Text
              align="left"
              c="#000000"
              id="account_deletion_verify_success_note"></Text>
          </View>
        ) : (
          <div className={classes.innerContainer}>
            <View fD={'column'} gap={1} aI={'start'}>
              <Text
                c="#000000"
                align="left"
                variant={'h4'}
                bold
                style={{
                  width: '100%',
                }}
                id="account_deletion_verify_title"
                context={{
                  companyName: company?.name ? ' on ' + company?.name : '',
                }}
              />
              <Text
                id="account_deletion_verify_approval"
                align="left"
                c="#000000"
                context={{
                  companyName: company?.name ? company?.name : '',
                }}
                style={{ marginTop: 8 }}
              />
              <Text
                id="account_deletion_verify_proceed"
                align="left"
                c="#000000"
              />
              <Text align="left" c="#000000">
                <span
                  style={{
                    fontWeight: 'bold',
                    //   color: '#000000',
                  }}>
                  {' '}
                  Please note:
                </span>{' '}
                the company administrators will process the account deletion and
                will use the company{' '}
                <a
                  href={`${company?.settings?.privacy_policy_url}`}
                  target="_blank"
                  rel="noreferrer">
                  <span className={classes.privacyPolicies}>
                    privacy policy
                  </span>
                </a>{' '}
                as a guide.
              </Text>{' '}
              <View fD={'row'} aI={'center'} ml={1}>
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Text
                  align="left"
                  s={13}
                  id={'account_deletion_verify_acknowledge'}></Text>
              </View>
            </View>
            <Button
              loading={loading}
              color="primary"
              style={{
                padding: '15px',
                width: '250px',
                borderRadius: '5px',
              }}
              onClick={handleSubmit}
              id="submit"
              capitalize
              disabled={!checked}></Button>
            <ErrorOutput>
              {error && error !== 'success' ? error : null}
            </ErrorOutput>
          </div>
        )}
      </div>
      <View pt={0.6}>
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
    height: '100vh', // Ensure the container takes the full viewport height
    backgroundColor: '#FAFAFA',
  },

  innerContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1),
    maxWidth: '700px', // Limit the width if needed
  },
  paper: {
    padding: theme.spacing(3),
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    maxWidth: ({ wide }) => (wide ? 780 : 700),
    [theme.breakpoints.down(700)]: {
      width: '100%',
      margin: 0,
      marginTop: theme.spacing(2),
    },
    border: '1px solid #EFEFEF',
    backgroundColor: 'white',
    // cornerRadius: theme.
  },
  privacyPolicies: {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: `${theme.palette.primary.main}`,
  },
}));
