import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';
import Text from 'components/outputs/Text';

import SectionList from './SectionList';
import { standardizeString } from 'util/general';
import { Box } from '@material-ui/core';
import Output from 'components/outputs/Output';

export default function PagesList(props) {
  return <SectionList {...props} component={Page} />;
}

function Page(props) {
  const { item } = props;
  const {
    title,
    component = {},
    filterConfig,
    formConfig,
    description,
    variant,
  } = item;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Box
        pb={1}
        width="100%"
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box pr={0.5} width="100%">
          <Text variant="h6" bold id={title ?? 'Default'} />
        </Box>
        <Text variant="subtitle2" style={{ fontWeight: '400' }}>
          {variant}
        </Text>
      </Box>
      {Boolean(description) && <Text paragraph>{description}</Text>}
      {Boolean(component) && <PageContent item={component} />}
      {Boolean(formConfig) && typeof formConfig === 'function' && (
        <FormContent item={formConfig({})} />
      )}
      {Boolean(filterConfig) && <FilterContent item={filterConfig} />}
    </div>
  );
}

function PageContent(props) {
  const { item = {} } = props;
  const { variant, config = {} } = item;
  const classes = useStyles();
  const { add, columns, actions } = config;

  return (
    <div className={classes.container}>
      {Boolean(variant) && <Text bold>{'Component: ' + variant}</Text>}
      <Text paragraph>{'Can add: ' + Boolean(add)}</Text>
      {Boolean(columns) && (
        <Box pt={2}>
          <Text paragraph>{'Columns'}</Text>
          {columns.map(column => (
            <div className={classes.row}>
              <Text id={column.label} />
              <Text>{column.value}</Text>
            </div>
          ))}
        </Box>
      )}
      {Boolean(actions) && (
        <Box pt={2}>
          <Text paragraph>{'Actions'}</Text>
          {Object.keys(actions).map(key => {
            const action = actions[key];
            return (
              <div className={classes.row}>
                <Text>{standardizeString(key ? key : 'default')}</Text>
                {(action ?? [action]).map(item => (
                  <Text id={item?.id ?? item} />
                ))}
              </div>
            );
          })}
        </Box>
      )}
    </div>
  );
}

function FormContent(props) {
  const { item } = props;
  const { defaultValues, sections, title, titleAction } = item;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Text bold>{'Form' + (Boolean(title) && ': ') + title}</Text>

      {Boolean(defaultValues) && (
        <Output label="Default values" value={defaultValues} type="json" />
      )}
      {Boolean(sections) && (
        <Box pt={2}>
          <Text paragraph>{'Inputs'}</Text>
          {sections.map(section => {
            const { fields, id } = section;
            return (
              <Box pb={1}>
                <Text>{standardizeString(id)}</Text>
                <div className={classes.row}>
                  <Text>Fields</Text>
                  {fields.map(item => (
                    <Text>{item?.id ?? item}</Text>
                  ))}
                </div>
              </Box>
            );
          })}
        </Box>
      )}

      {Boolean(titleAction) && (
        <Output label="Title actions" value={titleAction?.label} />
      )}
    </div>
  );
}

function FilterContent(props) {
  const { item } = props;

  const keys = Object.keys(item);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Text variant="h6" gutterBottom>
        {'Filters'}
      </Text>
      {keys.map(key => {
        const filter = item?.[key] ?? {};
        const { label, override, type } = filter;
        return (
          <div className={classes.container}>
            <Text bold id={label ?? key}></Text>

            <Output
              horizontal
              label={'Variant'}
              value={override ? 'Override' : type}
            />
            {Boolean(override) && (
              <Output horizontal label={'Override'} value={override} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid #EFEFEF',
    borderRadius: 15,
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));
