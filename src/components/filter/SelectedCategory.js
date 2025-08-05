import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/Icon';

const SelectedCategory = props => {
  const { children, ind } = props;

  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      {ind !== 0 && (
        <div className={classes.arrow}>
          <Icon icon={'subdirectory'} color={'font'} />
        </div>
      )}
      <div className={classes.labelContainer}>
        <Text className={classes.label}>{children}</Text>
      </div>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  labelContainer: {
    borderRadius: 20,
    border: '1px solid lightgray',
    margin: 4,
    padding: theme.spacing(1),
    // height: 40,
    width: '100%',
    // alignItems: 'flex-end',
  },
  arrow: {
    paddingTop: 6,
    paddingLeft: ({ ind }) => (ind ? (ind - 1) * theme.spacing(1) : 0) + 4,
  },
  label: {
    lineHeight: 1,
  },
}));

export default SelectedCategory;
