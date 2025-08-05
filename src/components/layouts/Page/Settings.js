import React, { useState } from 'react';

import { useToast } from 'components/contexts/ToastContext';
import Layout from 'components/layout/Form';
import PageTitle from 'components/layout/page/PageTitle';
import ErrorBoundary from 'components/error/ErrorBoundary';
import IconButton from 'components/inputs/IconButton';
import { useDispatch } from 'react-redux';
import { fetchData } from 'redux/rehive/actions';
import Form from 'components/form';

export default function Settings(props) {
  const {
    context,
    pageId,
    screenId,
    itemId,
    stateId,
    pageConfig,
    screenConfig = {},
    history,
    item,
  } = props;

  const dispatch = useDispatch();
  const isEdit = stateId === 'edit';
  const isNew = stateId === 'new';
  const { showToast } = useToast();
  const { pages } = screenConfig;
  const { renderDetail: RenderDetail, variant, redux } = pageConfig;

  function handleStateChange(item, type) {
    let newPath =
      '/settings/' + (item !== 'back' || stateId || itemId ? pageId + '/' : '');
    if (item?.id) {
      newPath = newPath + item?.id + '/';
    }
    newPath = newPath + (type ? type + '/' : '');
    history.push(newPath);
  }

  function handleSuccess(id) {
    if (redux) {
      dispatch(fetchData(redux));
    }
    history.push('/settings/' + (id === 'password' ? '' : pageId + '/'));
  }

  const pageProps = {
    ...props,
    reduxData: context,
    context,
    handleStateChange,
    onSuccess: handleSuccess,
    handleSuccess,
    showToast,
    history,
    stateId,
    pageConfig,
  };

  const config = pages[pageId];
  const hasActions = Boolean(config?.actions);

  const titleId =
    (isEdit ? 'edit_' : isNew ? 'add_' : '') +
    (isEdit || isNew
      ? pageConfig?.title?.slice(0, -1).toLowerCase()
      : pageConfig?.title);

  return (
    <React.Fragment>
      <Layout stretch noPadding noTitle>
        <React.Fragment>
          <PageTitle
            align="center"
            back={Boolean(pageId)}
            handleBack={() => handleStateChange('back')}
            id={titleId}
            actions={
              hasActions &&
              config?.actions?.map(
                item =>
                  item?.icon && (
                    <IconButton
                      key={item?.icon}
                      icon={item?.icon}
                      size={24}
                      inverted
                      onClick={() => history.push(item.path)}
                    />
                  ),
              )
            }
          />
          <ErrorBoundary>
            {variant === 'form' ? (
              <Form
                noLayout
                {...props}
                item={isNew ? null : item}
                values={isNew ? null : item}
              />
            ) : (
              <RenderDetail {...pageProps} />
            )}
          </ErrorBoundary>
        </React.Fragment>
      </Layout>
      {/* <Toast /> */}
    </React.Fragment>
  );
}
