import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from './Layout';
import PageLayout from '../Page';
import { useToast } from 'components/contexts/ToastContext';
import Header from './Header';
import {
  parseScreenUrl,
  calculateInvoiceTotal,
  compareValue,
} from 'util/general';
import { useForm } from 'react-hook-form';
import Modal from 'components/layout/Modal';
import ReceiptPage from 'screens/checkout/pages/ReceiptPage';
import InvoiceDetails from 'screens/checkout/pages/InvoiceDetails';
import IndexMenu from './IndexMenu';
import { LanguageProvider } from 'components/contexts/LanguageContext';
import ApiToken from 'screens/developers/components/modals/ApiToken';
import InvoiceRefundModal from 'screens/invoices/components/modals/InvoiceRefundModal';
import { userTiersSelector } from 'screens/accounts/redux/selectors';
import { useRehive } from 'hooks/rehive';
import { useDispatch } from 'react-redux';

export default function Screen(props) {
  const { screenConfig, history } = props;
  const { pages, variant, defaultPage } = screenConfig;
  const { location } = history;
  const { pathname } = location;
  const tiers = useSelector(userTiersSelector);
  let filteredPages = {};
  const context = { tiers };

  for (const [key, value] of Object.entries(pages)) {
    if (
      typeof pages[key]?.condition === 'function' &&
      pages[key]?.condition(context)
    )
      continue;

    filteredPages[key] = value;
  }

  let { pageId } = parseScreenUrl(pathname, variant);
  if (!pageId) pageId = defaultPage;

  let pageConfig = filteredPages?.[pageId] ?? filteredPages[''] ?? {};
  pageConfig = pageConfig?.config ?? pageConfig;
  const pageProps = { ...props, id: pageId, pageConfig };

  return <Page {...pageProps} />;
}

function Page(props) {
  const {
    screenConfig,
    history,
    onSubmit,
    pageConfig,
    reduxContext = {},
  } = props;
  const { location } = history;
  const { pathname } = location;
  let { pageId, itemId, isEdit, stateId } = parseScreenUrl(pathname);
  const [isSubmitting, setSubmitting] = useState(false);
  const tiers = useSelector(userTiersSelector);

  const {
    pages,
    id: screenId,
    headerVariant,
    variant,
    configs,
    defaultPage,
    renderScreen,
  } = screenConfig;

  const { locales = {} } = configs ?? {};

  const configLocales = reduxContext?.[screenId + 'Config']?.locales ?? {};
  // const dispatch = useDispatch();
  // // console.log('Page -> screenConfig', screenConfig);

  let {
    components = {},
    id,
    type = id,
    services,
    filterConfig: filterConfigOverride,
    fetchItem, // TODO: move to services
    variant: pageVariant,
  } = pageConfig;

  if (!fetchItem && services?.fetchItem) {
    fetchItem = services?.fetchItem;
  }

  const { context, refresh } = useRehive(type ?? id ?? '', true, null);
  let data = context?.items;

  const { list, form, detail } = components;

  const [modal, setModal] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const [item, setItem] = useState(null);
  const detailConfig =
    typeof detail === 'function' ? detail({ item, context }) : detail;

  async function handleFetchItem(refresh) {
    setLoading(refresh);
    const resp = await fetchItem(itemId, props);
    // console.log('handleFetchItem -> resp', resp);
    if (resp?.status === 'success') {
      setItem(resp?.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!list && data?.id) {
      setItem(data);
    } else if (itemId && itemId !== item?.id) {
      const tempItem = data?.find(item => compareValue(item, itemId));
      if (!item) {
        if (tempItem) setItem(tempItem);
        if (typeof fetchItem === 'function')
          handleFetchItem(!Boolean(tempItem));
      } else if (tempItem && tempItem?.updated !== item?.updated) {
        setItem(tempItem);
      }
    } else if (item && !itemId) {
      setItem(null);
    }
  }, [item, itemId, data]);

  function onSuccess(item, type, isUpdate = true) {
    if (type.match(/user|profile/)) {
      // showToast({ variant: 'success', text: 'profile_updated' });
      showToast({
        id: type + '_' + (isUpdate ? 'updated' : 'added'),
        variant: 'success',
      });
      // refreshData();
      // updateUser(item);
      // handleBack();
      // setTempItem(null);
      // setIndex(null);
      // } else if (configs?.verify && state === 'form') {
      //   refresh(id);
      //   setState('verify');
      //   setTempItem(item);
    } else {
      // showToast({
      //   id: type + '_' + (isUpdate ? 'updated' : 'added'),
      //   variant: 'success',
      // });
      // refresh(type ?? id, item);
      // setTempItem(item);
      // handleBack();
      // setIndex(null);
      // refreshData();
    }
  }

  const dispatch = useDispatch();
  const isLoading = loading || context?.loading; //machineState.matches('loading') ||

  const formConfig =
    typeof form === 'function'
      ? form({
          ...props,
          tiers,
          // context: { data, ...reduxContext, ...context },
          onSubmit: onSubmit ? onSubmit : form.onSubmit,
          item,
        })
      : form ?? {};

  const { defaultValues, mapDefaultValues } = formConfig;

  const formMethods = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { handleSubmit, setValue, watch, reset, setError } = formMethods;

  function resetForm(defaultValues) {
    const temp = defaultValues
      ? defaultValues
      : typeof mapDefaultValues === 'function'
      ? mapDefaultValues(item)
      : item;

    reset(temp);
  }

  useEffect(() => {
    if (item && itemId) {
      resetForm();
    } else if (stateId.match(/new|add/)) {
      resetForm(defaultValues);
    } else if (type?.match(/profile/)) {
      resetForm(data);
    }
  }, [item, pageId, mapDefaultValues, defaultValues, itemId, stateId]);

  const listConfig =
    typeof list === 'function'
      ? list({
          // context: { data, ...reduxContext, ...context },
          item,
        })
      : list ?? {};

  const {
    initialFilters,
    variant: contentVariant = variant,
    filterConfig = filterConfigOverride,
  } = listConfig;

  const component =
    stateId === 'view' ? detailConfig : !stateId ? listConfig : formConfig;
  const actions = component?.actions ?? [];

  const contentProps = {
    config: listConfig, //TODO: replace this to listConfig
    pageConfig,
    formConfig,
    detailConfig,
    screenConfig,
    component,
    dispatch,
    screenId,
    itemId,
    pageId,
    stateId,

    onSuccess,
    refreshItem: handleFetchItem,
    showToast,
    setModal,
    // setItem,
    // context,
    refresh,

    isEdit,
    loading: isLoading,
    item,
    contentVariant,
    pageVariant,

    formMethods,
    // values,
    //remove the below and replace with formMethods
    setSubmitting,
    isSubmitting,
    inputPropsControl: formMethods,
    setValue,
    handleSubmit,
    setError,

    history,

    // data,
    // items: data,

    context: { ...reduxContext, ...context },
    // dispatch,
  };

  let headerProps = {
    pageConfig,
    screenConfig,
    formConfig,

    config: listConfig,

    component, // rename to config?

    screenId,
    itemId,
    pageId,
    stateId,

    // refreshData,
    setModal,
    setSubmitting,
    // values,
    setItem,
    isSubmitting,
    showToast,
    filters: {
      filters: {},
      setFilters: '',
      filterConfig,
      initialFilters,
    },
    variant: headerVariant,
    pageVariant,
    isLoading,
    history,
    inputPropsControl: formMethods,
    // onSuccess: refreshData,
    pages,
    item,
    actions,
  };

  //toremove
  if (renderScreen) return renderScreen({ ...props, ...contentProps });
  if (screenConfig?.variant === 'indexMenu') {
    return (
      <LanguageProvider localLocales={locales} configLocales={configLocales}>
        <IndexMenu {...contentProps} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider localLocales={locales} configLocales={configLocales}>
      <Layout
        noHeaderPadding
        content={<PageLayout {...contentProps} />}
        header={
          !variant?.match(/indexMenu|settings/) ? (
            <Header {...headerProps} />
          ) : null
        }
      />
      {/* <Toast /> */}
      <Modal
        onClose={() => {}}
        fullScreen={!modal?.id && modal !== 'refund'}
        title={modal?.title}
        close
        backgroundColor={modal?.id || modal === 'refund' ? 'white' : '#B7B7B7'}
        maxWidth={modal?.id || modal === 'refund' ? 500 : 10000}
        open={Boolean(modal)}
        onDismiss={() => setModal('')}>
        <Modals
          {...contentProps}
          modal={modal}
          // data={data}
          item={item}
          // values={values}
        />
      </Modal>
    </LanguageProvider>
  );
}

function Modals(props) {
  const { data, modal, item, values } = props;
  switch (modal?.id ?? modal) {
    case 'receipt':
      return (
        <ReceiptPage
          context={{
            ...data,
            invoice: item,
            items: item?.metadata?.service_business?.items,
          }}
        />
      );
    case 'preview':
      return (
        <InvoiceDetails
          context={{
            ...data,
            invoice: item
              ? item
              : {
                  ...values,
                  request_currency: data?.business?.currency,
                  request_amount: calculateInvoiceTotal(
                    values?.products,
                    data?.business?.currency?.divisibility,
                  ),
                },
            items: item?.metadata?.service_business?.items ?? values?.products,
          }}
        />
      );
    case 'token':
      return <ApiToken context={{ data }} item={modal?.item} />;
    case 'refund':
      return (
        <InvoiceRefundModal
          {...props}
          context={{
            ...data,
            invoice: item,
          }}
        />
      );
    default:
      return null;
  }
}
