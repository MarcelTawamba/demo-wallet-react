import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Spinner from 'components/outputs/Spinner';
import RadioMultiList from 'components/inputs/RadioMultiList';

export default function CategoryFilter(props) {
  const {
    id = 'categories',
    context,
    history,
    initialValue = '',
    value,
    setValue,
    ...restProps
  } = props;
  const { categories = [], loading } = context;

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {loading ? (
        <Spinner size={24} />
      ) : (
        <RadioMultiList
          {...restProps}
          openable
          variant="sections"
          items={categories}
          parent={''}
          values={typeof value !== 'object' ? [] : value}
          setValue={setValue}
        />
      )}
    </div>
  );
}
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingTop: theme.spacing(1),
  },
}));
