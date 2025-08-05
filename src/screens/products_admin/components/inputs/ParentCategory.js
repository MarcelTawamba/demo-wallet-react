import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  text: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  edit: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

export default function ParentCategory(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Text id="parent_category" />
    </div>
  );
}
