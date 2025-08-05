import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // width,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    // minHeight: 46,
    // height: '100%',
  },
  amount: {
    paddingRight: theme.spacing(1),
    minWidth: 100,
  },
}));

export default function TextCell(props) {
  const { value, row } = props;
  const classes = useStyles();

  return (
    <TableCell key={value}>
      <div className={classes.container} style={props?.props?.cellStyle}>
        <Text c="fontDark" s={14} noWrap>
          {value}
        </Text>
      </div>
    </TableCell>
  );
}
