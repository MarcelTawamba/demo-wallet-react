import React, { useState } from 'react';
import Spinner from 'components/outputs/Spinner';
import { makeStyles } from '@material-ui/styles';
import StatementListItem from './StatementListItem';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import PaginationControls from 'components/lists/PaginationControls';
import { useStatementsFetch } from 'hooks/statementAPI';

const StatementList = ({ wallet }) => {
  const [page, setPage] = useState(1);
  const classes = useStyles();
  
  const { data, isLoading } = useStatementsFetch(page);
  
  const items = data?.data?.results || [];
  const pageLast = data?.data?.count ? Math.ceil(data.data.count / 5) : 1;

  return (
    <div className={classes.container}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={classes.list}>
          {items.length > 0 ? (
            <React.Fragment>
              {items.map(item => (
                <StatementListItem key={item.id} item={item} wallet={wallet} />
              ))}
              <PaginationControls
                page={page}
                setPage={setPage}
                pageLast={pageLast}
              />
            </React.Fragment>
          ) : (
            <EmptyListMessage id="statement_empty" />
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

export default StatementList; 