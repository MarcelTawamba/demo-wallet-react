import React from 'react';
import MuiChip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/styles/makeStyles';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';

export default function Chip(props) {
  const { t } = useTranslation(['common']);
  const { onPress, label, size } = props;
  const classes = useStyles(props);
  let labelLang = typeof label === 'string' ? t(label) : label;
  if (props.uppercase && typeof label === 'string') {
    labelLang = labelLang.toUpperCase();
  }

  return (
    <MuiChip
      classes={[classes.root, classes.colorPrimary, classes.sizeSmall]}
      className={[classes.root, classes.colorPrimary, classes.sizeSmall]}
      {...{ label: labelLang, size, onClick: onPress, color: 'primary' }}
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 5,
  },
  colorPrimary: {
    color: theme.palette.primary.main,
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.1).hex(),
    '&:hover': {
      backgroundColor: chroma(theme.palette.primary.main).alpha(0.3).hex(),
    },
  },
  sizeSmall: {
    fontSize: 12,
    fontWeight: 700,
  },
}));
