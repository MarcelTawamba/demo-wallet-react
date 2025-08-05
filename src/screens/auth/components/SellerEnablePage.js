import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { View } from 'components/layout/View';
import { getBusinessServiceSettings, getBusinesses } from 'util/rehive';
import { getUserGroup } from 'util/general';
import { checkBusinessGroup } from 'util/business';
import { createSeller } from 'screens/products_admin/util/rehive';
import ButtonList from 'components/lists/ButtonList';
import Text from 'components/outputs/Text';
import { useBusinessSettings } from 'hooks/businessAPI';
import Spinner from 'components/outputs/Spinner';

export default function SellerEnablePage(props) {
  const {
    setLoading: setLoadingMain,
    loading: loadingMain,
    authConfig,
    onSuccess,
    company,
    initialUser,
    tempAuth,
  } = props;

  const [loading, setLoading] = useState(false);

  const { data: businessSettingsData, isLoading: businessSettingsLoading } =
    useBusinessSettings(company?.id);

  const { data: businessData, isLoading: businessLoading } = useQuery(
    ['businesses', tempAuth?.user?.id],
    getBusinesses,
    { enabled: !!authConfig.business },
  );

  const userGroup = getUserGroup(initialUser);

  useEffect(() => {
    // Skip immediately if not register flow or no business config - DON'T call setLoadingMain(false)
    if (!tempAuth.register || !authConfig.business) {
      onSuccess();
      return;
    }
    
    // Wait for business settings to load before making any business group decisions
    if (businessSettingsLoading) {
      return;
    }
    
    // Skip immediately if user not in business group - DON'T call setLoadingMain(false)
    if (!businessSettingsData || !checkBusinessGroup(businessSettingsData, userGroup)) {
      onSuccess();
      return;
    }
    
    // Wait for business data to load
    if (businessLoading) {
      return;
    }
    
    // ONLY NOW do we know user should see seller form - safe to call setLoadingMain(false)
    setLoadingMain(false);
  }, [businessSettingsLoading, businessLoading, businessSettingsData, userGroup, tempAuth.register, authConfig.business, onSuccess]);
  
  const business = businessData?.results?.[0];

  async function handleSubmit() {
    setLoading(true);
    const data = {
      id: business?.id,
      name: business?.name,
      description: business?.description,
      account: business?.account,
    };
    await createSeller(data);
    onSuccess();
  }

  const buttons = [
    {
      onClick: handleSubmit,
      type: 'submit',
      id: 'enable_seller_features',
      capitalize: true,
      loading: loading || businessLoading || !business?.id,
      disabled: loading || businessLoading || !business?.id,
    },
    {
      onClick: () => onSuccess(),
      variant: 'text',
      id: 'skip',
    },
  ];

  // CRITICAL FIX: Return null for all cases where user shouldn't see the seller form
  if (loadingMain || 
      businessSettingsLoading || 
      businessLoading ||
      !tempAuth.register || 
      !authConfig.business || 
      !checkBusinessGroup(businessSettingsData, userGroup)) {
    return null;
  }

  return (
    <View>
      <Text
        tA="center"
        s={15}
        style={{ marginTop: 4, marginBottom: 10 }}
        id="business_seller_features_subtitle"
      />
      <ButtonList
        layout={'vertical'}
        items={buttons}
        noPadding
        buttonPropsOverride={{ style: { marginTop: '9px' } }}
      />
    </View>
  );
}
