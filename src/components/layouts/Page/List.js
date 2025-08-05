import React, { useState } from 'react';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Spinner from 'components/outputs/Spinner';
import { Button } from 'components/inputs/Button';
import Grid from 'components/layout/Grid';
import TablePagination from '@material-ui/core/TablePagination';
import { TablePaginationActions } from './Table';
import { paramsToObj, paramsToSearch } from 'util/general';

export function List(props) {
  const {
    config = {},
    context,
    grid,
    emptyListMessage = '',
    type,
    fetchNext,
    smartLoading,
    data: items,
    item,
    itemId,
    loading,
    history,
    more = false,
    screenId,
    showToast,
    pageId,
    pageConfig,
    refreshData,
    gridColumns,
    gridSpacing = 4,
    pagination,
  } = props;
  const emptyMessage = config?.emptyListMessage;

  const { page, setPage } = pagination ?? {};
  const filters = paramsToObj(history?.location?.search);
  const { page_size = 15 } = filters;
  const [rowsPerPage, setRowsPerPage] = useState(page_size);

  let { renderItem, renderDetail: RenderDetails } = config;
  const { id, value, components } = pageConfig;
  if (!renderItem && components?.item) {
    renderItem = components?.item;
  }
  if (!RenderDetails && components?.detail) {
    RenderDetails = components?.detail;
  }
  function setId(item) {
    history.push(
      '/' +
        screenId +
        '/' +
        (pageId ? pageId + '/' : '') +
        (item.id ? item.id + '/' : ''),
    );
  }
  function clearId() {
    history.push('/' + screenId + '/' + (pageId ? pageId + '/' : ''));
  }
  const helpers = { clearId, setId, refreshData, showToast };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    history.push({ search: paramsToSearch({ ...filters, page: newPage }) });
    refreshData();
  };

  const handleChangePageSize = event => {
    const value = parseInt(event.target.value, 10);
    history.push({
      search: paramsToSearch({ ...filters, page_size: value, page: 1 }),
    });
    setRowsPerPage(value);
    setPage(1);
    refreshData();
  };

  function renderFooter() {
    if ((!loading && !more) || (smartLoading && items?.length > 0)) {
      return null;
    }

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}>
        {loading ? (
          <Spinner containerStyle={{ paddingTop: 32 }} />
        ) : more ? (
          <Button
            color={'primary'}
            variant={'text'}
            onPress={() => fetchNext()}>
            LOAD MORE
          </Button>
        ) : (
          <div style={{ height: 100 }} />
        )}
      </div>
    );
  }

  const contentProps = {
    items,
    helpers,
    context,
    type,
    pageConfig,
    emptyListMessage,
    loading,
    renderItem,
    emptyMessage,
  };

  return (
    <div
      style={{
        width: '100%',
        overflowY: 'scroll',
        height: '100%',
        // paddingBottom: renderDetail ? 200 : 20,
      }}>
      {itemId && item ? (
        // renderDetail({ item, helpers, context })
        <RenderDetails item={item} helpers={helpers} context={context} />
      ) : grid ? (
        <Grid
          spacing={gridSpacing}
          footer={renderFooter()}
          columns={gridColumns}>
          <Content {...contentProps} />
          {pagination && !loading && (
            <TablePagination
              // classes={{ toolbar: classes.pagination }}
              component="div"
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              colSpan={3}
              count={context?.data?.count}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangePageSize}
              // nextIconButtonProps={{ more: Boolean(next) }}
              ActionsComponent={TablePaginationActions}
            />
          )}
        </Grid>
      ) : (
        <div style={{ paddingBottom: 125 }}>
          <Content {...contentProps} />
          {renderFooter()}
        </div>
      )}
    </div>
  );
}

function Content(props) {
  const {
    items,
    helpers,
    context,
    type,
    pageConfig,
    emptyListMessage,
    loading,
    emptyMessage,
    renderItem: RenderItem,
  } = props;

  return items?.length > 0 && typeof RenderItem === 'function' ? (
    items.map((item, index) => (
      <RenderItem item={item} helpers={helpers} context={context} />
    ))
  ) : loading ? null : type || pageConfig?.id ? (
    <EmptyListPlaceholderImage
      name={type ?? pageConfig?.id}
      text={emptyMessage ?? emptyListMessage}
    />
  ) : (
    <EmptyListMessage id={emptyMessage ?? emptyListMessage} />
  );
}
