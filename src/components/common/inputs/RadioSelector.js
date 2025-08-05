import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import useI18Language from 'hooks/useI18Language';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: ({ noPadding, title }) =>
      theme.spacing(noPadding ? 0 : title ? 2 : 0),
    width: '100%',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  groupResponsive: {
    display: 'flex',
    // flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    // [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
    // },
  },
  item: {
    flex: 1,
  },
}));

const RadioSelector = props => {
  const { handleChange, value, title = '', items, responsive } = props;
  const { label = title } = props;
  const classes = useStyles(props);
  const { getI18Translation } = useI18Language();

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      {Boolean(label) && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup
        aria-label={label}
        name={label}
        className={responsive ? classes.groupResponsive : classes.group}
        value={value}
        onChange={handleChange}>
        {items.map(item => (
          <FormControlLabel
            key={item.label}
            value={item.value}
            className={classes.item}
            control={<Radio color={'primary'} />}
            label={getI18Translation(item.label)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioSelector;
