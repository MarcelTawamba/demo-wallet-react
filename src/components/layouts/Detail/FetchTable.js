import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { standardizeString } from 'util/general';
import { useState } from 'react';
import Table from 'components/layouts/Page/Table';
import Spinner from 'components/outputs/Spinner';
import EmptyListMessage from 'components/lists/EmptyListMessage';

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

export default function FetchTable(props) {
  const { tableConfig, customer, item, id, context, data } = props;
  const business = props?.business ?? data?.business ?? context?.business;

  const {
    fetchData,
    handleSelection,
    emptyListMessage = 'No ' + standardizeString(id, false),
    requires,
  } = tableConfig;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function handleFetch() {
      setRunning(true);
      const resp = await fetchData({ customer, item, business, context });
      setItems(resp);
      setLoading(false);
    }

    if (
      item &&
      fetchData &&
      (business?.id || context?.business?.id) &&
      !running
    ) {
      if (typeof requires === 'function' ? requires(props) : true) {
        handleFetch();
      } else {
        setLoading(false);
      }
    }
  }, [item, customer, business]);

  const tableProps = {
    items,
    size: 'small',
    config: { ...tableConfig, pagination: false },
    onClick: handleSelection,
  };

  return loading ? (
    <Spinner />
  ) : items && (items?.length ?? 0) > 0 ? (
    <Table {...tableProps} tableLeftAlign />
  ) : (
    <EmptyListMessage>{emptyListMessage}</EmptyListMessage>
  );
}
