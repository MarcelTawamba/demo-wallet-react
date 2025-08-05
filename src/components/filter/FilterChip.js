import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';

const FilterChip = props => {
  const classes = useStyles();
  const { label, id, onDelete } = props;
  const { t } = useTranslation(['common']);

  return (
    <Chip
      label={t(label ? label.toLowerCase() : id)}
      clickable
      variant={'outlined'}
      className={classes.chip}
      classes={{ deleteIcon: classes.icon, label: classes.label }}
      color="primary"
      onDelete={onDelete}
    />
  );
};

const useStyles = makeStyles(theme => ({
  chip: {
    fontSize: theme.typography.pxToRem(10),
    height: 16,
    margin: theme.spacing(0.25),
    padding: 0,
    justifyContent: 'center',
  },
  label: { lineHeight: 0.8, paddingLeft: 6 },
  icon: { fontSize: 14, marginRight: 2 },
}));

export default FilterChip;
