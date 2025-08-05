import React from 'react';
import PropTypes from 'prop-types';
import { TablePagination as MuiTablePagination } from '@material-ui/core';
import TablePaginationActions from './TablePaginationActions';

function TablePagination(props) {
  const {
    page,
    rows,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    more,
    count,
  } = props;

  return (
    <MuiTablePagination
      rowsPerPageOptions={[3, 6, 10, { label: 'All', value: -1 }]}
      colSpan={3}
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
      component={'div'}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
      nextIconButtonProps={{ more }}
    />
  );
}

TablePagination.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default TablePagination;
