import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: ({ index }) => (index === 0 ? 0 : theme.spacing(2)),
    width: '100%',
    flex: 1,
    border: '1px solid #EFEFEF',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2) - 2,
    borderRadius: 15,
    [theme.breakpoints.down(736)]: {
      // marginTop: 0,
      marginTop: ({ index }) => (index === 0 ? 0 : 0),
      marginRight: ({ index }) => (index === 0 ? theme.spacing(2) : 0),
    },
    [theme.breakpoints.down(420)]: {
      marginTop: ({ index }) => (index === 0 ? 0 : theme.spacing(2)),
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '80%',
  },
}));

export default function SummaryValue(props) {
  const { item } = props;
  const { id, label, value, value2, date } = item;
  const classes = useStyles(props);
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Text variant="h6" bold id={label ?? id} />
        {Boolean(date) && <Text align="right">{date}</Text>}
      </div>
      <div className={classes.content}>
        <Text variant="h4" color="primary" bold>
          {value}
        </Text>
        {Boolean(value2) && <Text color="primary">{value2}</Text>}
      </div>
    </div>
  );
}
