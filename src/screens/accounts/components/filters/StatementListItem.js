import React, { useEffect } from 'react';
import Text from 'components/outputs/Text';
import Spinner from 'components/outputs/Spinner';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import IconButton from 'components/inputs/IconButton';
import DownloadIcon from '@material-ui/icons/SaveAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { Chip } from '@material-ui/core';
import { useStatementFetch, useDeleteStatement } from 'hooks/statementAPI';
import useI18Language from 'hooks/useI18Language';

const StatementListItem = ({ item, wallet }) => {
  const classes = useStyles();
  const { data, isLoading, isFetching } = useStatementFetch(item.id);
  const deleteStatementMutation = useDeleteStatement();
  const { getI18Translation } = useI18Language();

  const statementItem = data?.data;
  const isProcessing = statementItem?.status === 'pending' || statementItem?.status === 'processing';
  
  // Log when a statement is in-progress for debugging
  useEffect(() => {
    if (isProcessing) {
    }
  }, [item.id, isProcessing]);
  
  const handleDelete = async () => {
    try {
      await deleteStatementMutation.mutateAsync(item.id);
    } catch (error) {
      console.error('Failed to delete statement:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'complete':
        return classes.statusSuccess;
      case 'failed':
        return classes.statusError;
      case 'pending':
      case 'processing':
      default:
        return classes.statusProcessing; // Use processing style for pending/processing
    }
  };

  const formatDateRange = (item) => {
    if (!item.start_date && !item.end_date) {
      return getI18Translation('previous_month');
    }

    const start = item.start_date ? moment(item.start_date).format('DD MMM YYYY') : '';
    const end = item.end_date ? moment(item.end_date).format('DD MMM YYYY') : '';

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${getI18Translation('date_from')} ${start}`;
    } else if (end) {
      return `${getI18Translation('date_until')} ${end}`;
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        {isLoading || !statementItem ? (
          <Spinner size={'small'} />
        ) : (
          <>
            <div className={classes.details}>
              <Text variant="body1" className={classes.date}>
                {formatDateRange(statementItem)}
              </Text>
              
              <div className={classes.statusLine}>
                {isProcessing ? (
                  <Chip
                    size="small"
                    icon={<Spinner size={16} className={classes.chipSpinner} />}
                    label=""
                    className={`${classes.statusChip} ${classes.processingChip} ${getStatusClass(statementItem.status)}`}
                  />
                ) : (
                  <Chip
                    size="small"
                    label={statementItem.status}
                    className={`${classes.statusChip} ${getStatusClass(statementItem.status)}`}
                  />
                )}
              </div>
              
              <Text variant="caption" color="textSecondary">
                {getI18Translation('created')}: {moment(statementItem.created).format('DD MMM YYYY HH:mm')}
              </Text>
            </div>

            <div className={classes.actions}>
              {statementItem.status === 'complete' && (
                <IconButton
                  tooltip={getI18Translation('download')}
                  disabled={!statementItem?.file}
                  href={statementItem?.file}
                  style={{ padding: 8 }}>
                  <DownloadIcon style={{ fontSize: 20 }} />
                </IconButton>
              )}
              <IconButton
                tooltip={getI18Translation('delete')}
                onPress={handleDelete}
                style={{ padding: 8 }}>
                <DeleteIcon style={{ fontSize: 20 }} />
              </IconButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    borderBottom: '1px solid #EFEFEF',
  },
  content: {
    width: '100%',
    minHeight: 76, // Ensures consistent height even when loading
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1, // Add this to ensure consistent spacing
  },
  date: {
    fontWeight: 500,
    fontSize: '0.95rem', // Slightly smaller than subtitle1
  },
  statusLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '2px',
    marginBottom: '2px',
  },
  statusChip: {
    textTransform: 'capitalize',
  },
  processingChip: {
    minWidth: '32px',
    '& .MuiChip-label': {
      padding: 0
    }
  },
  statusProcessing: {
    backgroundColor: '#F1F8FE', // Light blue
    color: '#1A73E8', // Blue
  },
  statusSuccess: {
    backgroundColor: '#E6F4EA', // Light green
    color: '#137333', // Dark green
  },
  statusError: {
    backgroundColor: '#FCE8E6', // Light red
    color: '#C5221F', // Dark red
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginLeft: theme.spacing(2), // Add consistent margin
  },
  chipSpinner: {
    margin: '0 8px',
    color: '#1A73E8', // Match the processing color
  }
}));

export default StatementListItem; 