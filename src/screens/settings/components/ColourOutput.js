import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';

export default function ColorOutput(props) {
  const { label } = props;
  const classes = useStyles(props);
  return (
    <div className={classes.container}>
      <Text>{label}</Text>
      <div className={classes.color}></div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    // display: 'flex',
    // flexDirection: 'column',
    padding: theme.spacing(2),
  },
  color: {
    backgroundColor: ({ color }) => color,
    height: 120,
    width: 120,
    borderRadius: 10,
    marginTop: theme.spacing(2),
  },
}));
