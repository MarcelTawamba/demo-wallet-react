import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import FilterChip from 'components/filter/FilterChip';

const RewardFilterChipList = props => {
  const { setFilters, filters } = props;
  const classes = useStyles(props);
  if (filters.expired) {
    return (
      <div className={classes.container} pl={0.5} pt={0.25}>
        <FilterChip
          label="Unavailable rewards"
          onDelete={() => setFilters({ expired: false })}
        />
      </div>
    );
  }
  return null;
};

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
  },
}));

export default RewardFilterChipList;
