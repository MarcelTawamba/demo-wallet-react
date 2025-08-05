import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

/* components */
import AuthForm from 'components/layout/AuthForm';
import Logo from 'components/rehive/Logo';
import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import Text from 'components/outputs/Text';

/* util */
import {
  verifyEmail,
  getPublicCompany,
  resendEmailVerification,
  getCompanyAppConfig,
} from 'util/rehive';
import { SplashScreen } from 'components/rehive/SplashScreen';
import { Box } from '@material-ui/core';
import colors from 'config/config/defaults/colors.json';
import { useToast } from 'components/contexts/ToastContext';
import { useQuery } from 'react-query';
import muiConfig from 'config/config/mui';
import { useTheme, ThemeProvider } from 'components/app/context';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { paramsToObj } from 'util/general';

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');
  let { config: client } = useConfiguration();

  const location = useLocation();
  const params = paramsToObj(location?.search ?? '');
  const companyId = client?.company ? client?.company : params?.company ?? '';
  const email = params?.email?.replace(' ', '+');
  const key = params?.key;
  const { showToast } = useToast();

  const [loading2, setLoading2] = useState(false);

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

  useEffect(() => {
    async function validateEmail() {
      try {
        await verifyEmail(key);
        setResult('success');
      } catch (e) {
        console.log('TCL: VerifyEmail -> componentDidMount -> e', e);
        setResult(e?.message);
      }
      setLoading(false);
    }
    validateEmail();
  }, [key]);

  const isSuccess = result === 'success';
  const isExpired = result.includes('expired');
  const { colors: baseColors, design } = useTheme();
  const { colors = baseColors } = queryCompanyConfig?.data?.config ?? {};
  const { primary } = colors;
  const newTheme = createTheme({
    ...muiConfig,
    palette: { primary: { main: primary, contrastText: '#FFF' } },
  });

  async function handleResendVerificationEmail() {
    setLoading2(true);
    try {
      await resendEmailVerification(email, companyId);
      showToast({
        text: 'Verification email successfully resent to ' + email,
        variant: 'success',
      });
    } catch (e) {
      showToast({
        text: 'Unable to send verification email',
        variant: 'error',
      });
    }
    setLoading2(false);
  }

  return companyId && !company ? (
    <SplashScreen />
  ) : (
    <MuiThemeProvider theme={newTheme}>
      <ThemeProvider value={{ colors, design }}>
        <>
          <AuthForm
            header={
              <Logo
                noBorder
                height={100}
                type="rehive-icon"
                // width={company.icon ? 100 : 200}
                width={100}
                image={company?.icon ?? ''}
              />
            }
            footer={
              <Link to={'/'}>
                <Button variant="text">
                  <Text variant={'body2'} align={'center'} id="go_to_wallet" />
                </Button>
              </Link>
            }>
            {loading ? (
              <>
                <Spinner style={{ paddingBottom: 24 }} />
                <Text variant="h6" align={'center'} id="verifying_email" />
              </>
            ) : (
              <Box display="flex" alignItems="center" flexDirection="column">
                <Box width="100%" pb={!isSuccess && 3}>
                  <Text variant="h6" align={'center'}>
                    {isSuccess
                      ? 'Email successfully verified'
                      : isExpired
                      ? 'Email verification expired'
                      : 'Error verifying email'}
                  </Text>
                </Box>
                {!isSuccess && (
                  <Button
                    label="Resend verification email"
                    color="primary"
                    loading={loading2}
                    disabled={loading2}
                    onPress={handleResendVerificationEmail}
                  />
                )}
              </Box>
            )}
          </AuthForm>
        </>
      </ThemeProvider>
      {/* <Toast /> */}
    </MuiThemeProvider>
  );
}
