import React from 'react';

import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DocumentationSection from './DocumentationSection';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';
import { Button } from 'components/inputs/Button';

export default function DocumentSectionIcon(props) {
  const { item } = props;
  const { items } = item;
  if (!items) return null;

  return (
    <Box
      flexDirection="row"
      display="flex"
      justifyContent="space-between"
      // alignItems="flex-end"
      pt={1}
      width="100%">
      {items.map(item => (
        <DocumentSectionIconItem {...props} item={item} />
      ))}
    </Box>
  );
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r},${g},${b},0.2)`;
  }

  return null;
}
const useStyles = makeStyles(theme => ({
  icon: {
    width: 100,
    padding: theme.spacing(2),
    height: 100,
    borderRadius: 10,
    backgroundColor: hexToRgb(theme.palette.primary.main),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function DocumentSectionIconItem(props) {
  const { item, setItem } = props;
  const classes = useStyles();
  if (!item) return null;
  const { amount, title, icon, id } = item;

  return (
    <Box
      flexDirection="column"
      display="flex"
      // justifyContent="center"
      onClick={() => setItem(item)}
      width={120}
      // height={120}
      alignItems="center"
      // pt={2}
    >
      <Box className={classes.icon} mb={2}>
        <Icon icon={icon} circled={false} size={50} color="primary" />
      </Box>
      <Text width="auto" align="center" bold id={title ?? id} />
    </Box>
  );
}
