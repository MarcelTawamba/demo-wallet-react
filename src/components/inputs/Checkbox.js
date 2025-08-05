import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useI18Language from 'hooks/useI18Language';

const MyCheckbox = props => {
  const { name, value, setValue, label, disabled } = props;

  const { getI18Translation } = useI18Language();

  return (
    <FormControlLabel
      control={
        <div>
          <Checkbox
            disabled={disabled}
            checked={value}
            onChange={e => {
              // e.preventDefault();
              e.stopPropagation();
              setValue(name, !value);
            }}
            value={name}
            color="primary"
          />
        </div>
      }
      label={getI18Translation(label)}
    />
  );
};

export default MyCheckbox;
