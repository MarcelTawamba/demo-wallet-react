import React, { useState, useEffect } from 'react';
import ButtonList from 'components/lists/ButtonList';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import TextField from 'components/inputs/TextField';
import momentTz from 'moment-timezone';
import {
  createBusinessProfile,
  getBusinesses,
  initWithToken,
  getAccounts,
} from 'util/rehive';
import { getUserGroup, snakeString } from 'util/general';
import Dropdown from 'components/inputs/Dropdown';
import { useQuery } from 'react-query';
import { checkBusinessGroup } from 'util/business';
import { useTranslation } from 'react-i18next';
import { useBusinessSettings } from 'hooks/businessAPI';
import Spinner from 'components/outputs/Spinner';

export default function BusinessCreatePage(props) {
  const { t } = useTranslation(['common']);
  const {
    setLoading: setLoadingMain,
    loading: loadingMain,
    initialUser,
    company,
    authConfig,
    onSuccess,
    onBack,
    tempAuth: { user, token },
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [account, setAccount] = useState();
  const [businessName, setBusinessName] = useState();
  const [invoiceCurrency, setInvoiceCurrency] = useState();

  const userGroup = getUserGroup(initialUser);

  const currencies = account?.currencies?.map(item => ({
    value: item?.currency?.code,
    label: item?.currency?.display_code,
  }));

  const { data: businessSettingsData, isLoading: businessSettingsLoading, error: businessSettingsError } =
    useBusinessSettings(company?.id, !!authConfig.business);

  const { data: businessData, isLoading: businessLoading } = useQuery(
    ['businesses', user?.id],
    () => getBusinesses(true),
    { enabled: !!authConfig.business && !businessSettingsError && (!businessSettingsData || checkBusinessGroup(businessSettingsData, userGroup)) },
  );

  async function fetchAccounts() {
    const accounts = await getAccounts();
    const account =
      accounts?.results?.find(x => x.name === 'sales') ??
      accounts?.results?.find(x => x.primary) ??
      accounts?.results?.[0];
    setAccount(account);
    setLoadingMain(false);
  }

  // CONSOLIDATED LOGIC: Handle all business logic in one useEffect to prevent conflicts
  useEffect(() => {
    // Skip immediately if business is not configured - DON'T call setLoadingMain(false)
    if (!authConfig?.business) {
      onSuccess();
      return;
    }

    // Wait for business settings to load before making any decisions
    if (businessSettingsLoading) {
      return;
    }

    // Skip immediately if business settings failed or user not in business group - DON'T call setLoadingMain(false)
    if (businessSettingsError || !checkBusinessGroup(businessSettingsData, userGroup)) {
      onSuccess();
      return;
    }

    // Now check business data status
    if (!businessLoading) {
      if (businessData?.results?.length) {
        // User already has businesses, skip creation - DON'T call setLoadingMain(false)
        onSuccess();
      } else {
        // ONLY NOW do we know user needs to create a business - safe to call setLoadingMain(false)
        initWithToken(token);
        fetchAccounts();
      }
    }
  }, [
    authConfig?.business,
    businessSettingsLoading,
    businessSettingsError,
    businessSettingsData,
    userGroup,
    businessLoading,
    businessData,
    onSuccess,
    token
  ]);

  async function handleSubmit() {
    setLoading(true);

    const response = await createBusinessProfile({
      name: businessName,
      currency: invoiceCurrency,
      id: snakeString(businessName),
      account: account?.reference ?? user?.account,
      timezone: momentTz.tz.guess(),
    });

    if (response?.status === 'success') return onSuccess();

    setError(response?.message);
    setLoading(false);
  }

  const buttons = [
    {
      onClick: handleSubmit,
      type: 'submit',
      id: 'register_business',
      capitalize: true,
      disabled: !businessName || !invoiceCurrency,
      loading,
    },
    {
      onClick: onBack,
      id: 'cancel',
      variant: 'text',
    },
  ];

  // CRITICAL FIX: Return null for all cases where user shouldn't see the business form
  if (!authConfig?.business || 
      businessSettingsLoading || 
      !businessSettingsData ||
      businessSettingsError || 
      !checkBusinessGroup(businessSettingsData, userGroup) ||
      businessLoading || 
      loadingMain ||
      businessData?.results?.length) {
    return null;
  }

  return (
    <View>
      <Text
        style={{ textAlign: 'center' }}
        id="before_onboarding_register_business"
      />
      <View w={'100%'} mt={1}>
        <TextField
          onChange={e => setBusinessName(e.target.value)}
          label={t('business_name')}
        />
        <Dropdown
          {...{
            label: t('invoice_currency'),
            helperText: t('invoice_currency_helper'),
            options: currencies,
            value: invoiceCurrency,
            onChange: value => setInvoiceCurrency(value),
          }}
        />
      </View>
      {error && (
        <View mt={1} w={'100%'}>
          <Text myColor={'red'} style={{ textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      )}
      <ButtonList
        layout={'vertical'}
        items={buttons}
        noPadding
        buttonPropsOverride={{ style: { marginTop: '9px' } }}
      />
    </View>
  );
}
