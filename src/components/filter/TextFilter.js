import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Basic } from 'components/inputs/Input';

const TextFilter = props => {
  const { value, setValue, onSubmit } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit}>
        <Basic
          onChange={event => setValue(event.target.value)}
          value={value}
          fullWidth={true}
        />
      </form>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  inputs: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
  },
}));

export default TextFilter;
