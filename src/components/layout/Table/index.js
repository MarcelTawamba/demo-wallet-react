import React from 'react';
import { get } from 'lodash';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { formatOutputValue } from 'util/general';
import Text from 'components/outputs/Text';
import Scrollbars from 'react-custom-scrollbars-better';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    overflow: 'hidden',
  },
  component: {
    width: '100%',
    height: 'auto',
    overflowX: 'auto',
  },
  container: {
    width: '100%',
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
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
    backgroundColor: hexToRgb(theme.palette.primary.main),
    color: theme.palette.primary.main,
  },
}))(TableCell);

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
  const {
    config,
    items,
    renderFooter = () => {},
    page,
    rowsPerPage,
    onClick,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <TableContainer
        // component={TableComponent}
        >
          <Scrollbars autoHide rtl={document.dir === 'rtl'}>
            <MuiTable
              className={classes.table}
              size="small"
              aria-label="product table">
              <TableHead>
                <TableRow>
                  {config.columns.map(({ label, width, props = {} }) => (
                    <StyledTableCell
                      key={label}
                      {...props}
                      style={{
                        width,
                        ...(props.style ? props.style : {}),
                      }}
                      variant={'head'}>
                      {label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {items
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(row => (
                    <TableRow
                      key={row.name}
                      hover
                      style={{
                        cursor: Boolean(onClick) ? 'pointer' : '',
                      }}
                      onClick={event => onClick(row)}>
                      {config.columns.map(
                        ({ value, type, getValue, width }) => (
                          <TableCell key={value}>
                            <div
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width,
                                alignItems: 'center',
                                display: 'flex',
                                minHeight: 30,
                              }}>
                              <Text noWrap variant="body2">
                                {formatOutputValue(
                                  getValue ? getValue(row) : get(row, value),
                                  type ? type : '',
                                )}
                              </Text>
                            </div>
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </MuiTable>
          </Scrollbars>
        </TableContainer>
        {/* {renderFooter ? renderFooter(props) : null} */}
      </div>
    </div>
  );
}
