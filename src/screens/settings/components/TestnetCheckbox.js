import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { View } from 'components/layout/View';

const styles = theme => ({
  formControl: {
    // padding: theme.spacing(2),
    width: '100%',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
  },
});

const TestnetCheckbox = props => {
  const { classes, handleChange, value } = props;

  return (
    <View pt={1} ph={0.5}>
      <FormControlLabel
        control={
          <Checkbox checked={value} onChange={handleChange} value={value} />
        }
        label="Secondary"
      />
    </View>
  );
};

export default withStyles(styles)(TestnetCheckbox);
