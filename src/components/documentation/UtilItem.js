import React from 'react';

import Text from 'components/outputs/Text';
import makeStyles from '@material-ui/styles/makeStyles';
import PropsList from './PropsList';

export default function UtilItem(props) {
  const { item, id } = props;
  const { description, type, children } = item;
  const classes = useStyles({ noPadding: true });
  return (
    <div className={classes.container}>
      <div className={classes.columns}>
        <Text
          bold
          gutterBottom
          className={classes.variable}
          width={'auto'}
          color="primary">
          {id}
        </Text>
        {Boolean(type) && <Text variant="subtitle2">{type}</Text>}
      </div>
      {Boolean(description) && <Text paragraph>{description}</Text>}
      {Boolean(children) && (
        <PropsList item={children} title={'Params'}></PropsList>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: ({ noPadding }) => (noPadding ? 0 : theme.spacing(4)),
    border: '1px solid #EFEFEF',
    borderRadius: 15,
    padding: theme.spacing(1),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
  },
  variable: {
    paddingRight: theme.spacing(0.5),
  },
  children: {
    border: '1px solid #EFEFEF',
    borderRadius: 15,
    padding: theme.spacing(1),
  },
}));
