import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Status from 'components/outputs/Status';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 8,
    paddingLeft: 16,
  },
}));

export default function StatusCell(props) {
  const { value } = props;
  const classes = useStyles();
  if (value === 'Overpaid & partially refunded') {
    return (
      <TableCell key={value} className={classes.container}>
        <Status>{'overpaid'}</Status>
        <div style={{ paddingTop: 8 }}>
          <Status noWrap={false}>{'refunded'}</Status>
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell key={value} className={classes.container}>
      <Status noWrap={false}>{value}</Status>
    </TableCell>
  );
}
