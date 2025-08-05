import React from 'react';
import CardBase from '@material-ui/core/Card';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

const Card = props => {
  let {
    onPressCard,
    design,
    grid,
    children,
    disabled,
    large,
    noPadding,
    ...restProps
  } = props;

  const classes = useStyles(props);
  if (grid)
    return (
      <Grid item xs={12} sm={6} md={6} lg={large ? 6 : 4} xl={large ? 6 : 4}>
        <CardBase
          className={classes.card}
          elevation={0}
          {...restProps}>
          <div className={classes.inner}>{children}</div>
        </CardBase>
      </Grid>
    );

  return (
    <CardBase
      className={classes.card}
      elevation={0}
      {...restProps}>
      <div className={classes.inner}>{children}</div>
    </CardBase>
  );
};

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    minWidth: 200,
    width: '100%',
    border: ({ noBorder, borderColor = '#EFEFEF' }) =>
      noBorder ? '' : '1px solid ' + borderColor,
    borderRadius: ({ noBorderRadius }) => (noBorderRadius ? 0 : 12),
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: ({ noBorder }) => (noBorder ? '#FFFFFF' : '#EFEFEF'),
    },
  },
  grid: {
    padding: ({ noPadding }) => (noPadding ? 0 : theme.spacing(1)),
    width: '100%',
  },
  inner: { width: '100%', height: '100%' },
}));

export default Card;
