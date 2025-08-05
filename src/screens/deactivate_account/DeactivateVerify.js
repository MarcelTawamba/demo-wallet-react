import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import ErrorOutput from 'components/outputs/Error';
import { paramsToObj } from 'util/general';
import * as _inputs from 'config/inputs';
import Text from 'components/outputs/Text';
import Logo from 'components/rehive/Logo';
import {
  getPublicCompany,
  getCompanyAppConfig,
  makeDeactivateRequestVerify,
} from 'util/rehive';
import { SplashScreen } from 'components/rehive/SplashScreen';
import { Checkbox, makeStyles } from '@material-ui/core';
import { useTheme, ThemeProvider } from 'components/app/context';
import { useQuery } from 'react-query';

import { useConfiguration } from 'components/contexts/ConfigurationContext';

export default function DeactivateAccountVerify() {
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
      const res = await makeDeactivateRequestVerify(data);
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
              id="account_deactivate_request_title"
              context={{
                companyName: company?.name ? ' on ' + company?.name : '',
              }}
            />
            <Text
              align="left"
              c="#000000"
              id="account_deactivation_verify_success"
              context={{
                companyName: company?.name ? company?.name : '',
              }}
            />
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
                id="account_deactivate_request_title"
                context={{
                  companyName: company?.name ? ' on ' + company?.name : '',
                }}
              />
              <Text
                id="account_deactivation_verify_proceed"
                align="left"
                c="#000000"
                context={{
                  companyName: company?.name ? company?.name : '',
                }}
                style={{ marginTop: 8 }}
              />
            </View>
            <Button
              loading={loading}
              color="primary"
              style={{
                marginTop: '15px',
                padding: '15px',
                width: '250px',
                borderRadius: '5px',
              }}
              onClick={handleSubmit}
              capitalize={false}
              id="request_deactivate"
            />
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
