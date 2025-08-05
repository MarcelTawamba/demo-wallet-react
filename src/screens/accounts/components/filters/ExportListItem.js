import React, { useState, useEffect } from 'react';
import Text from 'components/outputs/Text';
import { getExport } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import IconButton from 'components/inputs/IconButton';
import ExportIcon from '@material-ui/icons/SaveAltOutlined';
import { Chip } from '@material-ui/core';

const ExportListItem = ({ item }) => {
  const [loading, setLoading] = useState(true);
  const [exportItem, setExportItem] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const resp = await getExport(item.id);
      setExportItem(resp.data);

      if (resp.data?.progress < 100) {
        const timer = setTimeout(() => {
          fetchData();
        }, 1000);
        return () => clearTimeout(timer);
      }
      setLoading(false);
    }
    fetchData();
  }, [item.id]);

  const getStatusColor = (progress) => {
    if (progress === 100) return 'success';
    if (progress > 0) return 'warning';
    return 'default';
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        {loading || !exportItem ? (
          <Spinner size={'small'} />
        ) : (
          <>
            <div className={classes.details}>
              <Text variant="body1" className={classes.format}>
                {exportItem.file_format.toUpperCase()}
              </Text>
              
              <div className={classes.statusLine}>
                <Chip
                  size="small"
                  label={exportItem.progress === 100 ? 'Complete' : `${exportItem.progress}%`}
                  color={getStatusColor(exportItem.progress)}
                  className={classes.statusChip}
                />
              </div>
              
              <Text variant="caption" color="textSecondary">
                Created: {moment(exportItem.created).format('DD MMM YYYY HH:mm')}
              </Text>
            </div>

            <div className={classes.actions}>
              {exportItem.progress === 100 && (
                <IconButton
                  tooltip={exportItem?.pages?.[0]?.file ? 'download' : 'empty_export'}
                  disabled={!exportItem?.pages?.[0]?.file}
                  href={exportItem?.pages[0]?.file}
                  style={{ padding: 8 }}>
                  <ExportIcon style={{ fontSize: 20 }} />
                </IconButton>
              )}
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
    minHeight: 76,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  format: {
    fontWeight: 500,
    fontSize: '0.95rem',
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
  actions: {
    display: 'flex',
    gap: '8px',
    marginLeft: theme.spacing(2),
  },
}));

export default ExportListItem;
