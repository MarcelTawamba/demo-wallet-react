import React from 'react';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Table from 'components/layouts/Page/Table';
import FetchTable from './FetchTable';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    width: '100%',
  },
  component: {
    width: '100%',
    height: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 650,
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 300,
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 300,
    overflow: 'scroll',
  },
  section: {
    width: '100%',
    padding: theme.spacing(1.5),
    paddingLeft: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    border: ({ variant }) => (variant ? '' : '1px solid #EFEFEF'),
    backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  columnsVariants: {
    display: 'flex',
    flexDirection: 'columns',
    justifyContent: 'space-between',
    paddingTop: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  footerOutput: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingTop: 0,
  },
}));

export default function OutputTable(props) {
  const { item, section, config, context } = props;
  const { tableConfig = config, value } = config;
  const items = get(item, value);

  if (!tableConfig) {
    return null;
  }
  if (tableConfig.fetchData) {
    return (
      <FetchTable
        {...props}
        tableConfig={tableConfig}
        id={section?.id}
        key={section?.id}
        emptyListMessage="no_payments_available"
      />
    );
  }

  const tableProps = {
    ...props,
    context,
    items,
    size: 'small',
    config: { ...tableConfig, pagination: false },
    id: section?.id,
  };

  return <Table {...tableProps} />;
}
