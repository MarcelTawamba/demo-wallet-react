import React from 'react';
import { useForm } from 'react-hook-form';
import { formConfig as bitcoinConfig } from 'screens/settings/config/pages/bitcoin';
import Form from 'components/form';
import { useSelector } from 'react-redux';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import {
  bankAccountsSelector,
  cryptoAccountsSelector,
} from 'redux/rehive/selectors';

export default function AccountForm(props) {
  // const { screenConfig, history, onSubmit, pageConfig, reduxContext } = props;
  // const { location, push } = history;
  // const { search, pathname } = location;
  // let { pageId, itemId, isEdit, stateId } = parseScreenUrl(pathname);
  // const [isSubmitting, setSubmitting] = useState(false);
  // const {
  //   pages,
  //   id: screenId,
  //   headerVariant,
  //   renderScreen,
  //   variant,
  //   defaultPage,
  // } = screenConfig;
  // // // console.log('Page -> screenConfig', screenConfig);

  const services = useSelector(currentCompanyServicesSelector);
  // const accounts = useSelector(walletsSelector);
  // const authConfig = useSelector(configAuthSelector);
  // const profile = useSelector(userProfileSelector);
  const bankAccounts = useSelector(bankAccountsSelector);
  // const displayCurrency = useSelector(displayCurrencySelector);
  const cryptoAccounts = useSelector(cryptoAccountsSelector);
  // const primaryCurrency = useSelector(primaryCurrenciesSelector);
  // const rates = useSelector(ratesStateSelector);

  // useRedux();

  const data = {
    // accounts,
    // authConfig,
    // profile,
    // settingsConfig,
    services,
    bankAccounts,
    // rates,
    // displayCurrency,
    cryptoAccounts,
    // primaryCurrency,
  };

  const form = bitcoinConfig;

  const formConfig =
    typeof form === 'function'
      ? form({
          ...props,
          ...data,
          reduxContext: data,
          onSubmit: form.onSubmit,
        })
      : form ?? {};
  const { defaultValues, mapDefaultValues } = formConfig;
  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { handleSubmit, setValue, watch, reset, setError } = formMethods;

  const values = watch();
  // console.log('Page -> values', values);
  const inputPropsControl = { ...formMethods, values }; // ...inputPropsfor

  const contentProps = {
    // config, // listConfig
    // pageConfig,
    formConfig,
    // detailConfig,
    // screenConfig,

    // screenId,
    // itemId,
    // pageId,
    // stateId,

    // onSuccess: refreshData,
    // refreshData,
    // showToast,
    // setModal,
    // setItem,

    // isEdit,
    // loading: isLoading,
    // item,
    // contentVariant,
    // pageVariant,

    formMethods,
    values,
    //remove the below and replace with formMethods
    // setSubmitting,
    // isSubmitting,
    inputPropsControl,
    setValue,
    handleSubmit,
    setError,

    // history,

    data,
    items: data,

    context: { ...data },
  };

  return (
    <Form
      noLayout
      inputPropsControl={formMethods}
      handleSubmit={handleSubmit}
      formConfig={formConfig}
      // {...props}
      item={null}
      values={null}
    />
  );
}
