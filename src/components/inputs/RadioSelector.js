import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import useI18Language from 'hooks/useI18Language';
import Icon from 'components/outputs/Icon';
import { View } from 'components/layout/View';

export default function RadioSelector(props) {
  const {
    name,
    value,
    title = '',
    options = [],
    responsive,
    handleChange,
    icon,
  } = props;

  const { items = options } = props;
  const classes = useStyles(props);
  const { getI18Translation } = useI18Language();

  const label = getI18Translation(title || props?.label);

  return (
    <div className={classes.formControl}>
      {Boolean(label) && (
        <FormLabel component="legend" className={classes.label}>
          {label}
        </FormLabel>
      )}
      <RadioGroup
        value={value}
        aria-label={name}
        className={responsive ? classes.groupResponsive : classes.group}
        onChange={handleChange}>
        {items.map(item => (
          <FormControlLabel
            disabled={item.disabled}
            key={item.label}
            value={item.value ?? item.id}
            className={classes.item}
            control={<Radio color={'primary'} />}
            label={
              icon ? (
                <View fD={'row'} aI={'center'} gap={1} pl={0.6}>
                  <Icon
                    icon={icon}
                    size={20}
                    iconColor={'#FFF'}
                    style={{
                      padding: '0px',
                      minHeight: '35px',
                      maxHeight: '35px',
                      minWidth: '35px',
                      maxWidth: '35px',
                    }}
                  />
                  {getI18Translation(item.label ?? item.name)}
                </View>
              ) : (
                getI18Translation(item.label ?? item.name)
              )
            }
          />
        ))}
      </RadioGroup>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: ({ noPadding, title }) =>
      theme.spacing(noPadding ? 0 : title ? 1.5 : 0),
    width: '100%',
  },
  group: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: '0.1rem',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  label: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
  groupResponsive: {
    marginTop: '10px',
    display: 'flex',
    gap: '0.1rem',
    flexDirection: 'column',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  item: {
    flex: 1,
  },
}));
