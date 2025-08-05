import { useSelector } from 'react-redux';

import { UserConfig } from 'screens/onboarding/config';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';

import {
  configAuthSelector,
  userAddressesSelector,
  userDocumentsSelector,
  configOnboardingSelector,
} from 'redux/rehive/selectors';
import { userTiersSelector } from 'screens/accounts/redux/selectors';

function useOnboarding({ user: userOverride }) {
  const services = useSelector(currentCompanyServicesSelector);

  const authConfig = useSelector(configAuthSelector);
  const userAddresses = useSelector(userAddressesSelector);
  const documents = useSelector(userDocumentsSelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const userRedux = useSelector(configOnboardingSelector);
  const user = userOverride ?? userRedux;

  const tiers = useSelector(userTiersSelector);

  const isLoading =
    documents?.loading || userAddresses?.loading || tiers?.loading; //
  const config = UserConfig({
    user,
    userAddresses: userAddresses?.items,
    documents: documents?.items,
    tiers: tiers?.items,
    onboardingConfig,
    services,
  });

  return { ...config, isLoading };
}
