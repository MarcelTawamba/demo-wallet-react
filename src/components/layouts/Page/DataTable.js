import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Table from './Table';
import { View } from 'components/layout/View';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Form from '../../form';
import { FormProvider } from 'react-hook-form';
import Detail from '../Detail';
import { paramsToObj, paramsToSearch } from 'util/general';

const useStyles = makeStyles(theme => ({
  spinner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  form: {
    width: '100%',
  },
}));

export default function DataTable(props) {
  const {
    id,
    screenId,
    pageId,
    loading,
    items = [],
    next,
    itemId,
    // setItem,
    showToast,
    formConfig,
    detailConfig = {},
    onSuccess,
    history,
    stateId,
    refreshData,
    refreshItem,
    config = {},
    data,
    item,
    pagination,
    context,
    ...restProps
  } = props;
  const { page, setPage } = pagination;

  const { renderForm = Form } = config;
  const { renderDetail: RenderDetail = Detail } = detailConfig;
  // const { mapDefaultValues } = formConfig;

  const classes = useStyles();

  const filters = paramsToObj(history?.location?.search);
  const { page_size = 15 } = filters;
  const [rowsPerPage, setRowsPerPage] = useState(page_size);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setFilter('page', newPage);
    refreshData();
  };

  const handleChangePageSize = event => {
    const value = parseInt(event.target.value, 10);
    setFilter('page_size', value);
    setRowsPerPage(value);
    setPage(1);
    refreshData();
  };

  function setFilter(id, value) {
    if (value === 0) {
      delete filters[id];
      history.push({ search: paramsToSearch(filters) });
    } else {
      history.push({ search: paramsToSearch({ ...filters, [id]: value }) });
    }
  }

  function handleSuccess(item) {
    onSuccess(item);
    if (detailConfig?.id) setItem(item);
  }

  function setItem(item) {
    history.push(
      '/' +
        screenId +
        (pageId ? '/' + pageId + '/' : '/') +
        (item?.id ?? item) +
        '/',
    );
  }

  const isAdd = Boolean(stateId.match(/add|new/));
  const tableProps = {
    items: !items?.length && data?.length ? data : items,
    count: context?.data?.count,
    next,
    filters,
    page,
    setPage,
    rowsPerPage,
    config,
    loading,
    handleChangePage,
    handleChangePageSize,
    onClick: detailConfig?.id ? setItem : null,
    data,
    onSuccess,
    showToast,
    context,
    ...restProps,
  };

  const formProps = {
    ...props,
    item: isAdd ? null : item,
    values: isAdd ? null : item,
    refreshItem,
    onSuccess: handleSuccess,
  };

  return stateId && stateId !== 'view' && stateId !== 'delete' ? (
    renderForm(formProps)
  ) : itemId ? (
    <div className={classes.form}>
      {Boolean(RenderDetail) && <RenderDetail {...props} />}
    </div>
  ) : (
    <View mb={2} w={'100%'}>
      <Table {...tableProps} />
    </View>
  );
}
