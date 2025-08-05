import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/styles';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from 'components/outputs/Tooltip';

const MyCheckbox = props => {
  const { label, info, checked, onChange, inputRef, disabled } = props;

  const classes = useStyles();
  return (
    <div className={classes.row}>
      <FormControlLabel
        control={
          <div className={classes.checkbox}>
            <Checkbox
              onChange={e => onChange(e.target.checked)}
              checked={checked}
              inputRef={inputRef}
              disabled={disabled}
              color="primary"
            />
          </div>
        }
        label={label}
      />
      {Boolean(info) && (
        <Tooltip id={info}>
          <InfoIcon color="primary" style={{ paddingLeft: 4 }} />
        </Tooltip>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default MyCheckbox;
