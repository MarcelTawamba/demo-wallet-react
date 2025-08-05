import React from 'react';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';

import Graph from './Graph';

const useStyles = makeStyles(theme => ({
  container: {
    flex: 3,
    width: '100%',
    marginTop: 16,
    border: '1px solid #EFEFEF',
    padding: theme.spacing(2),
    borderRadius: 15,
  },
  grid: {
    padding: theme.spacing(2),
  },
  borderRight: {
    borderRight: '1px solid #EFEFEF',
    paddingRight: theme.spacing(3),
    minHeight: 240,
    [theme.breakpoints.down('lg')]: {
      paddingRight: 0,
      // borderRight: 'none',
      borderRight: '1px solid #EFEFEF',
    },
    [theme.breakpoints.down('xl')]: {
      paddingRight: theme.spacing(3),
      borderRight: '1px solid #EFEFEF',
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: 0,
      borderRight: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      paddingRight: theme.spacing(3),
    },
  },
  paddingLeft: {
    paddingLeft: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('xl')]: {
      paddingLeft: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
    },
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
    },
  },
  paddingTop: {
    // paddingTop: theme.spacing(4),
  },
  borderBottom: {
    borderBottom: '1px solid #EFEFEF',
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minHeight: 240,
    [theme.breakpoints.down('lg')]: {
      // borderBottom: 'none',
    },
    [theme.breakpoints.down('xl')]: {
      // borderBottom: '1px solid #EFEFEF',
    },
    [theme.breakpoints.down('md')]: {
      // borderBottom: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      // borderBottom: '1px solid #EFEFEF',
    },
  },
}));

export default function Graphs(props) {
  const { metrics, config } = props;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container className={classes.grid} spacing={0}>
        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          lg={6}
          className={`${classes.borderRight} ${classes.borderBottom}`}>
          <Graph
            id={config?.[0]?.id ?? 'Successful payments'}
            title={config?.[0]?.title}
            {...props}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          lg={6}
          className={`${classes.paddingLeft} ${classes.borderBottom}`}>
          <Graph
            id={config?.[1]?.id ?? 'Net volume'}
            title={config?.[1]?.title}
            {...props}
          />
        </Grid>
        <Grid
          item
          xs={12}
          // sm={6}
          md={12}
          // lg={6}
          className={`${classes.paddingTop}`}>
          <Graph
            id={config?.[2]?.id ?? 'Total payouts'}
            title={config?.[2]?.title}
            {...props}
          />
        </Grid>
        {/* <Grid
          item
          xs={12}
          sm={6}
          md={12}
          lg={6}
          className={`${classes.paddingTop} ${classes.paddingLeft}`}>
          <Graph id={config?.[3] ?? ''} {...props} />
        </Grid> */}
      </Grid>
    </div>
  );
}
