import React from 'react';
import { isEmpty } from 'lodash';

import Text from 'components/outputs/Text';
import makeStyles from '@material-ui/styles/makeStyles';
import Output from 'components/outputs/Output';
import { types } from 'config/enums';

export default function ConfigList(props) {
  const { item, variant } = props;
  const classes = useStyles();
  if (!item) return null;
  const { descriptions = [], defaultValues = {} } = item;
  if (descriptions.length === 0) return null;

  const Descriptions = (
    <div className={classes.descriptions}>
      {descriptions.map(definition => (
        <ConfigItem
          key={definition?.id ?? definition}
          item={definition}
          defaultValue={defaultValues?.[definition?.id ?? '']}
        />
      ))}
    </div>
  );
  if (variant === 'child') {
    return Descriptions;
  }

  return (
    <div className={classes.columns}>
      {Descriptions}

      <div className={classes.code}>
        {!isEmpty(defaultValues) && (
          <Output
            label="Default values"
            value={defaultValues}
            type="json"
            variantProps={{ collapsed: 5 }}
          />
        )}
      </div>
    </div>
  );
}

function ConfigItem(props) {
  const { item } = props;
  const { id, description, type, children } = item;
  const classes = useStyles({ noPadding: true });
  return (
    <div className={classes.container}>
      <div className={classes.columns}>
        <Text bold gutterBottom className={classes.variable} width={'auto'}>
          {id}
        </Text>
        {Boolean(type) && <Text variant="subtitle2">{type}</Text>}
      </div>
      {Boolean(description) && <Text paragraph>{description}</Text>}
      {Boolean(children) && type === types.OBJECT && (
        <div className={classes.children}>
          <ConfigList
            item={{ descriptions: children }}
            variant="child"></ConfigList>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    paddingBottom: ({ noPadding }) => (noPadding ? 0 : theme.spacing(4)),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
  },
  variable: {
    paddingRight: theme.spacing(0.5),
  },
  code: { maxWidth: 300 },
  descriptions: { flex: 2 },
  children: {
    paddingLeft: theme.spacing(2),
  },
}));
