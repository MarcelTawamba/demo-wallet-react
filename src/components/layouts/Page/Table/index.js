import React, { useState, useContext } from 'react';
import { withStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { isEmpty } from 'lodash';

import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableCell from './TableCell';
import MuiTableCell from '@material-ui/core/TableCell';
import Text from 'components/outputs/Text';
import { useHistory } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Skeleton from '@material-ui/lab/Skeleton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import MyIconButton from 'components/inputs/IconButton';
import { BannerContext } from 'components/layout/Drawer';
import Hover from 'components/layout/Hover';

import Modal from 'components/layout/Modal';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
const extraHeight = ({
  displayTestBanner,
  displayOnboardingBanner,
  filterConfig,
}) =>
  (displayTestBanner ? 48 : 0) +
  (displayOnboardingBanner ? 48 : 0) +
  (!isEmpty(filterConfig) ? 48 : 0);

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  component: {
    width: '100%',
    height: 'auto',
    // overflowX: 'auto',
  },
  tableContainer: {
    height: '100%',
    maxHeight: '75vh',
    [theme.breakpoints.down(550)]: {
      maxHeight: props =>
        `calc(calc(var(--vh, 1vh) * 100) - ${204 + extraHeight(props)}px)`,
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },
  tableContainerNoCellBorder: {
    height: '100%',
    maxHeight: '75vh',
    [theme.breakpoints.down(550)]: {
      maxHeight: props =>
        `calc(calc(var(--vh, 1vh) * 100) - ${204 + extraHeight(props)}px)`,
    },
    '& tr td': {
      borderBottom: 'none',
    },
  },
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: props => (props.tableLeftAlign ? -6 : 0),
  },
  root: {
    width: '100%',
    // padding: theme.spacing(1),
  },
  head: {
    overflow: 'hidden',
    // borderTopRightRadius: theme.shape.borderRadius,
    // borderTopLeftRadius: theme.shape.borderRadius,
    backgroundColor: '#fafafa',
  },
  cell: { borderBottom: 'none' },
  header: {
    backgroundColor: 'white',
    opacity: 1,
    position: 'absolute',
    top: 0,
  },
  row: { width: '100%', flex: 1 },
  deleteIconCell: {
    flex: 1,
    width: '100%',
    minHeight: 55,
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    paddingRight: '12px !important',
  },
}));

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r},${g},${b},0.2)`;
  }

  return null;
}

const StyledTableCell = withStyles(theme => ({
  head: {
    // backgroundColor: hexToRgb(theme.palette.primary.main),
    // color: theme.palette.primary.main,
    overflow: 'hidden',
    borderBottom: 'none',
  },
}))(MuiTableCell);

// const StyledTableRow = withStyles((theme) => ({
//   root: {
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }))(TableRow);

const TableComponent = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.component}>{children}</div>;
};

export default function Table(props) {
  let {
    config,
    items = [],
    page,
    setPage,
    count = 0,
    rowsPerPage = 15,
    onClick,
    next,
    handleChangePage,
    handleChangePageSize,
    loading,
    size,
    context,
    tableLeftAlign,
  } = props;
  items = items.filter(item => item);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(false);
  const [eventNew, setEventNew] = useState({});

  const closeModal = () => {
    setShowModal(false);
  };
  const banners = useContext(BannerContext);

  const {
    columns = [],
    pagination,
    renderFooter,
    renderTableFooter,
    clean = false,
    onDelete,
    emptyListMessage = 'no_items',
    filterConfig,
    noCellBorder,
  } = config;
  const [isDeleting, setDeleting] = useState('');

  async function handleDelete(event, item) {
    setDeleting(item?.token_key ?? item?.id);
    await onDelete(event, item?.token_key ?? item?.id, props);
    setDeleting('');
  }

  const confirmDelete = (event, item) => {
    setSelectedItem(item);
    setEventNew(event);
    setShowModal(true);
  };

  const hasDelete = Boolean(onDelete);

  const history = useHistory();

  const disabled = typeof onClick !== 'function';

  const classes = useStyles({ ...banners, filterConfig, tableLeftAlign });

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <TableContainer
          options={{
            initialPage: 1,
          }}
          className={
            noCellBorder
              ? classes.tableContainerNoCellBorder
              : classes.tableContainer
          }
          //  component={TableComponent}
        >
          <MuiTable
            // stickyHeader
            classes={{ root: classes.head }}
            // className={classes.table}
            size={size}
            aria-label="product table">
            <TableHead>
              <TableRow
                style={{
                  // backgroundColor: 'white',
                  opacity: 1,
                }}>
                {columns?.map(({ label, width = 100, props = {} }) => (
                  <StyledTableCell
                    key={label}
                    {...props}
                    variant={'head'}
                    style={{ colWidth: width, width }}>
                    <Text
                      id={label}
                      c="fontDark"
                      bold
                      style={{
                        width,
                        ...(props.style ? props.style : {}),
                        // overflow,
                        whiteSpace: 'nowrap',
                        textAlign: props?.align ?? '',
                        // maxWidth: width,
                      }}
                    />
                  </StyledTableCell>
                ))}
                {hasDelete && (
                  <StyledTableCell variant={'head'}></StyledTableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow
                  style={{
                    width: '100%',
                    flex: 1,
                  }}>
                  {['1', '2', '3'].map(item => (
                    <div
                      key={item?.id ?? item}
                      // disabled={disabled}
                      // hover={!clean}
                    >
                      {columns?.map(cell => (
                        <TableCell
                          key={cell?.value ?? cell + item}
                          row={item}
                          style={
                            {
                              // flex: 1,
                              // width: '100%',
                              // display: 'flex',
                            }
                          }
                          {...cell}
                          skeleton={
                            <Skeleton
                              height="80"
                              width={cell === '2' ? 80 : 120}
                              style={{ marginRight: cell === '1' ? 180 : 320 }}
                            />
                          }
                        />
                      ))}
                    </div>
                  ))}
                </TableRow>
              ) : items?.length > 0 ? (
                items
                  //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((item, index) => (
                    <TableRow
                      key={index}
                      disabled={disabled}
                      hover={!clean}
                      style={{
                        cursor: Boolean(onClick) ? 'pointer' : '',
                        borderBottom: 'none',
                      }}
                      onClick={event =>
                        disabled ? null : onClick(item, { history })
                      }>
                      {columns?.map((cell, index) => (
                        <TableCell
                          key={index}
                          row={item}
                          context={context}
                          {...cell}
                          style={{
                            cursor: Boolean(onClick) ? 'pointer' : '',
                            borderBottom: 'none',
                          }}
                        />
                      ))}

                      {hasDelete && (
                        <TableCell
                          padding="none"
                          className={classes.deleteIconCell}>
                          <MyIconButton
                            simple
                            icon="delete"
                            inverted
                            color="action"
                            onClick={event => confirmDelete(event, item)}
                            loading={
                              isDeleting === (item?.token_key ?? item?.id)
                            }
                          />
                          {/* ) : null} */}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
              ) : (
                <TableRow colSpan={columns.length}>
                  <TableCell colSpan={columns.length}>
                    <EmptyListMessage id={emptyListMessage} />
                  </TableCell>
                </TableRow>
              )}
              {Boolean(renderTableFooter) ? renderTableFooter(props) : null}
            </TableBody>
          </MuiTable>
        </TableContainer>
        {pagination && (
          <TablePagination
            classes={{ toolbar: classes.pagination }}
            component="div"
            rowsPerPageOptions={[5, 10, 15, 25, 50]}
            colSpan={3}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangePageSize}
            nextIconButtonProps={{ more: Boolean(next) }}
            ActionsComponent={TablePaginationActions}
          />
        )}
        {Boolean(renderFooter) ? renderFooter(props) : null}
        {true && (
          <DeleteConfirmationModal
            showModal={showModal}
            closeModal={closeModal}
            handleDelete={handleDelete}
            item={selectedItem}
            eventNew={eventNew}
            {...props}
          />
        )}
      </div>
    </div>
  );
}

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  pagination: { borderBottom: 0 },
}));

export function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage, nextIconButtonProps } = props;
  const { more } = nextIconButtonProps;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 1);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 2);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage)));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1 && !more}
        aria-label="next page">
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

// TablePaginationActions.propTypes = {
//   count: PropTypes.number.isRequired,
//   onChangePage: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// };

function DeleteConfirmationModal(props) {
  const { showModal, closeModal, item, handleDelete, pageConfig, eventNew } =
    props;

  const [loading, setLoading] = useState(false);

  async function handleDeleteNew() {
    setLoading('delete');
    handleDelete(eventNew, item);
    setLoading(false);
    closeModal();
  }

  const buttons = [
    {
      id: 'cancel',
      onPress: closeModal,
      variant: 'text',
      color: 'primary',
    },
    {
      id: 'confirm',
      capitalize: true,
      color: 'primary',
      onPress: handleDeleteNew,
      disabled: loading,
      loading,
    },
  ];

  return (
    <Modal
      maxWidth={415}
      open={showModal}
      style={{ padding: 0, margin: 0 }}
      onClose={closeModal}>
      <>
        <View pt={1} w="100%">
          <Text
            pv={0.5}
            tA={'center'}
            s={18}
            c="fontLight"
            lang
            id="are_you_sure_to_delete_item"
            context={{
              itemName: `${pageConfig?.id ?? 'Item'} `,
            }}
          />
          {pageConfig?.id || 'item' ? (
            <Text
              color={'primary'}
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 16,
              }}>
              {`${pageConfig?.id ?? 'item'} : ${item?.token_key ?? item?.id}`}
            </Text>
          ) : (
            <Text
              style={{
                wordWrap: 'break-word',
                textAlign: 'center',
                marginTop: 16,
              }}
              id="unable_to_find_type"
              context={'address'}
            />
          )}
        </View>
        <View fD="row" w="100%" ph={1.5} pt={0.7}>
          <Button {...buttons?.[0]} wide />
          <Button {...buttons?.[1]} wide />
        </View>
      </>
    </Modal>
  );
}
