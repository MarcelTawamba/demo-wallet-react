import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import PageLayout from '../Page';
import { useToast } from 'components/contexts/ToastContext';
import Header from './Header';
import { parseScreenUrl, calculateInvoiceTotal } from 'util/general';
import { useForm } from 'react-hook-form';
import Modal from 'components/layout/Modal';
import ReceiptPage from 'screens/checkout/pages/ReceiptPage';
import InvoiceDetails from 'screens/checkout/pages/InvoiceDetails';
import { useDispatch, useSelector } from 'react-redux';
import IndexMenu from './IndexMenu';
import { LanguageProvider } from 'components/contexts/LanguageContext';
import ApiToken from 'screens/developers/components/modals/ApiToken';
import InvoiceRefundModal from 'screens/invoices/components/modals/InvoiceRefundModal';
import { useQuery } from 'react-query';
import { authUserSelector } from 'redux/auth/selectors';

import DeleteProductModal from 'screens/products_admin/components/modals/DeleteProductModal';

export default function Screen(props) {
  const { screenConfig, history, onSubmit, reduxContext } = props;
  const { location, push } = history;
  const { search, pathname } = location;
  const {
    pages,
    id: screenId,
    headerVariant,
    variant,
    configs,
    defaultPage,
    renderScreen,
  } = screenConfig;
  let { pageId, itemId, isEdit, stateId } = parseScreenUrl(pathname, variant);
  if (!pageId) pageId = defaultPage;
  const [isSubmitting, setSubmitting] = useState(false);
  const { locales = {} } = configs ?? {};
  const dispatch = useDispatch();

  const pageConfig = pages?.[pageId] ?? pages[''] ?? {};
  let {
    components = {},
    id,
    services,
    filterConfig: filterConfigOverride,
    fetchItem, // TODO: move to services
    redux,
    variant: pageVariant,
  } = pageConfig;

  if (!fetchItem && services?.fetchItem) {
    fetchItem = services?.fetchItem;
  }

  const user = useSelector(authUserSelector);

  const { list, form, detail } = components;
  const [page, setPage] = React.useState(1);

  const {
    data: context = {},
    isLoading,
    refetch,
  } = useQuery(
    [user?.id, screenId, id],
    () => services?.fetchData(props, page),
    {
      enabled: Boolean(services?.fetchData && user?.id),
      refetchInterval: list?.refetch ? 5000 : false,
      staleTime: 2500,
    },
  );

  const results = context?.results ?? (context?.length ? context : []);

  const data = reduxContext?.[redux]?.items ?? results;

  const [modal, setModal] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (stateId === 'delete') setModal('delete');
  }, [stateId, modal]);

  const {
    data: dataItem = {},
    isLoading: isLoadingItem,
    refetch: refetchItem,
  } = useQuery(
    [user?.id, screenId, itemId],
    () => services?.fetchItem(itemId, props),
    {
      enabled: Boolean(itemId && services?.fetchItem && user?.id),
      refetchInterval: detail?.refetch ? 5000 : false,
      staleTime: 2500,
    },
  );

  const item = itemId
    ? data.find(item => (item?.id).toString() === itemId)
    : null;

  const detailConfig =
    typeof detail === 'function'
      ? detail({
          item,
          context: { ...reduxContext, ...context, data: context },
        })
      : detail;

  // helper functions
  function refreshData() {
    // send('FETCH');
    refetch();
  }

  function onSuccess(item, type = '', isUpdate = true) {
    if (type?.match(/user|profile/)) {
      // showToast({ variant: 'success', text: 'profile_updated' });
      showToast({
        id: type + '_' + (isUpdate ? 'updated' : 'added'),
        variant: 'success',
      });
      refreshData();
      // updateUser(item);
      // handleBack();
      // setTempItem(null);
      // setIndex(null);
      // } else if (configs?.verify && state === 'form') {
      //   refresh(id);
      //   setState('verify');
      //   setTempItem(item);
    } else if (type === 'delete') {
      refreshData();
      showToast({
        id: `${item?.name} deleted successfully`,
        variant: 'success',
      });
      history.push('/products_admin/products/');
      setModal('');
    } else {
      // showToast({
      //   id: type + '_' + (isUpdate ? 'updated' : 'added'),
      //   variant: 'success',
      // });
      // refresh(type ?? id, item);
      // setTempItem(item);
      // handleBack();
      // setIndex(null);
      refreshData();
    }
  }

  const formConfig =
    typeof form === 'function'
      ? form({
          ...props,
          ...data,
          context: { data, ...reduxContext, ...context },
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
    } else if (redux?.match(/profile/)) {
      resetForm(data);
    }
  }, [item, pageId, mapDefaultValues, defaultValues, itemId, stateId]);

  const values = watch();
  const inputPropsControl = { ...formMethods, values }; // ...inputPropsfor

  const listConfig =
    typeof list === 'function'
      ? list({
          context: { data, ...reduxContext, ...context },
          item,
        })
      : list ?? {};

  const {
    initialFilters,
    variant: contentVariant = variant,
    gridColumns = 3, // applicable when variant='grid'
    gridSpacing = 4, // applicable when variant='grid'
    filterConfig = filterConfigOverride,
    pagination,
  } = listConfig;

  const component =
    stateId === 'view' || stateId === 'delete'
      ? detailConfig
      : !stateId
      ? listConfig
      : formConfig;
  const actions = component?.actions ?? [];

  const contentProps = {
    config: listConfig, //TODO: replace this to listConfig
    pageConfig,
    formConfig,
    detailConfig,
    screenConfig,
    component,

    screenId,
    itemId,
    pageId,
    stateId,

    pagination: pagination ? { page, setPage } : pagination,

    onSuccess,
    refreshData,
    refreshItem: refetchItem,
    showToast,
    setModal,
    setItem: item => {},

    isEdit,
    loading: isLoading,
    item,
    contentVariant,
    gridColumns,
    gridSpacing,
    pageVariant,

    formMethods,
    values,
    //remove the below and replace with formMethods
    setSubmitting,
    isSubmitting,
    inputPropsControl,
    setValue,
    handleSubmit,
    setError,

    history,

    data,
    items: data,

    context: { ...reduxContext, ...context, data: context },
    dispatch,
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

    refreshData,
    setModal,
    setSubmitting,
    values,
    setItem: item => {},
    isSubmitting,
    showToast,
    filters: {
      filters: {},
      setFilters: '',
      filterConfig,
      initialFilters,
    },
    variant: headerVariant,
    // state: machineState,
    pageVariant,
    // send,
    isLoading: isLoading && isLoadingItem,
    history,
    inputPropsControl,
    onSuccess: refreshData,
    pages,
    item,
    data,
    actions,
    context: { ...reduxContext, ...context },
  };

  //toremove
  if (renderScreen) return renderScreen({ ...props, ...contentProps });
  if (screenConfig?.variant === 'indexMenu') {
    return <IndexMenu {...contentProps} />;
  }

  function dismissModal() {
    setModal('');
    history.push(pathname.replace('/delete', ''));
  }

  return (
    <LanguageProvider localLocales={locales} configLocales={{}}>
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
        fullScreen={!modal?.id && modal !== 'refund' && modal !== 'delete'}
        title={modal?.title}
        close={modal?.id !== 'token'}
        backgroundColor={
          modal?.id || modal === 'refund' || modal === 'delete'
            ? 'white'
            : '#B7B7B7'
        }
        maxWidth={
          modal?.id || modal === 'delete'
            ? 400
            : modal === 'refund'
            ? 800
            : 10000
        }
        open={Boolean(modal)}
        onDismiss={modal?.id !== 'token' ? dismissModal : () => null}>
        <Modals
          {...contentProps}
          onDismiss={dismissModal}
          modal={modal}
          data={data}
          item={item}
          values={values}
        />
      </Modal>
    </LanguageProvider>
  );
}

function Modals(props) {
  const {
    data,
    modal,
    item,
    values,
    context,
    onDismiss,
    setModal,
    history,
    onSuccess,
    showToast,
  } = props;
  switch (modal?.id ?? modal) {
    case 'delete':
      return <DeleteProductModal {...props} />;
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
    case 'verified_token':
      return (
        <ApiToken
          context={{ data }}
          item={modal?.item}
          history={history}
          setModal={setModal}
          showToast={showToast}
          onSuccess={onSuccess}
        />
      );
    case 'refund':
      return (
        <InvoiceRefundModal
          {...props}
          context={{
            ...context,
            ...data,
            invoice: item,
          }}
        />
      );
    default:
      return null;
  }
}
