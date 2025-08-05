import React, { useState } from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Table from './Table';
import Spinner from 'components/outputs/Spinner';
import TablePagination from './Table/TablePagination';
import EmptyListMessage from '../lists/EmptyListMessage';
import OutputTable from './OutputTable';
import FormikForm from 'components/inputs/FormikForm';

const useStyles = makeStyles(theme => ({
  spinner: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  form: {
    // maxWidth: 500,
    width: '100%',
    overflowY: 'scroll',
    height: '100%',
    paddingBottom: 220,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}));

export default function DataTable(props) {
  const {
    loading,
    items = [],
    itemId,
    more,
    emptyListMessage,
    setItem,
    history,
    // item = {},
    renderForm,
    ...restProps
  } = props;

  const { config } = restProps;
  const { fields, sections, title } = config;

  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  const item = itemId ? items.find(item => item.id === itemId) : {};
  console.log('DataTable -> itemId', itemId);
  console.log('DataTable -> item', item);

  const handleChangePage = (event, newPage) => {
    console.log('handleChangePage -> newPage', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginationProps = {
    handleChangePage,
    handleChangeRowsPerPage,
    rows: items,
    page,
    rowsPerPage,
    more,
  };

  const tableProps = {
    renderFooter: props => <TablePagination {...props} {...paginationProps} />,
    items: items,
    page,
    rowsPerPage,
    onClick: setItem,
    ...restProps,
  };

  const pathname = get(history, ['location', 'pathname']);
  let paths = pathname.split('/');
  const isAdd = paths.includes('add');
  const isEdit = paths.includes('edit');

  // let initialValues = {};
  // if (item) {
  //   initialValues = fields.map(field => {
  //     return { [field.id]: item[field.id] };
  //   });
  //   initialValues = Object.assign(...initialValues);
  // }

  return isAdd || isEdit ? (
    renderForm ? (
      renderForm
    ) : (
      <div className={classes.form}>
        <FormikForm fields={fields} initialValues={item} title={title} />
      </div>
    )
  ) : item ? (
    <OutputTable
      item={item}
      sections={sections}
      fields={fields}
      history={history}
    />
  ) : loading ? (
    <div className={classes.spinner}>
      <Spinner />
    </div>
  ) : items.length ? (
    <Table {...tableProps} />
  ) : (
    <div className={classes.spinner}>
      <EmptyListMessage>{emptyListMessage}</EmptyListMessage>
    </div>
  );
}
