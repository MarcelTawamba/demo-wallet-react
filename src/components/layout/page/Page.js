import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const Page = props => {
  const { children, ...restProps } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container} {...restProps}>
      {children}
    </div>
  );
};

export default Page;
