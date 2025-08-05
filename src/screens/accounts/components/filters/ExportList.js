import React, { useState, useEffect } from 'react';
import { getExports } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import { makeStyles } from '@material-ui/styles';
import ExportListItem from './ExportListItem';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import PaginationControls from 'components/lists/PaginationControls';

const ExportList = ({ field }) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageLast, setPageLast] = useState(1);
  const [exportList, setExportList] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    // Update the document title using the browser API
    setLoading(true);
    async function fetchData() {
      const resp = await getExports('transaction', page);
      setExportList(resp.data);
      if (resp.data?.status === 'success') {
        setPageLast(Math.ceil(resp.data.count / 5));
      }
      setLoading(false);
    }
    fetchData();
  }, [page]);

  const items = exportList?.results;

  return (
    <div className={classes.container}>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes.list}>
          {items && items.length && items.length > 0 ? (
            <React.Fragment>
              {items.map(item => (
                <ExportListItem key={item.id} item={item} />
              ))}
              <PaginationControls
                page={page}
                setPage={setPage}
                pageLast={pageLast}
              />
            </React.Fragment>
          ) : (
            <EmptyListMessage id="export_empty" />
          )}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px 0',
  },
  list: {
    width: '100%',
  },
}));

export default ExportList;
