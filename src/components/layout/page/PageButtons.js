import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ButtonList from 'components/lists/ButtonList';

export default function PageButtons(props) {
  const classes = useStyles(props);

  if (!props?.items?.length) return null;

  return (
    <div className={`${classes.container} ${classes[props.layout]}`}>
      <ButtonList {...props} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  vertical: {
    paddingBottom: ({ noPadding }) => theme.spacing(noPadding ? 0 : 3),
    paddingLeft: ({ noPadding }) => theme.spacing(noPadding ? 0 : 3),
    paddingRight: ({ noPadding }) => theme.spacing(noPadding ? 0 : 3),
    [theme.breakpoints.down(540)]: {
      paddingLeft: ({ noPadding }) => theme.spacing(noPadding ? 0 : 1.5),
      paddingRight: ({ noPadding }) => theme.spacing(noPadding ? 0 : 1.5),
    },
  },
  material: {
    paddingBottom: ({ noPadding }) => theme.spacing(noPadding ? 0 : 2),
    [theme.direction === 'rtl' ? 'paddingLeft' : 'paddingRight']: ({
      noPadding,
    }) => theme.spacing(noPadding ? 0 : 2),
  },
}));
