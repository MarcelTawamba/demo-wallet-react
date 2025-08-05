import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Text from 'components/outputs/Text';
import { formatTime, formatAmountString } from 'util/general';
import { Button } from 'components/inputs/Button';
import { Box } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: 'none',
    backgroundColor: '#FAFAFA',
    borderRadius: 15,
    padding: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(2),
  },
  grid: { paddingTop: 0, marginTop: 0 },
  image: { maxWidth: 70, maxHeight: 70, marginRight: theme.spacing(2) },
}));

export default function OrderListItem(props) {
  const { item, helpers } = props;
  const { id, status, total_price, currency, placed, created } = item;

  const classes = useStyles(props);

  return (
    <Grid item xs={12} key={id} className={classes.grid}>
      <Paper className={classes.paper}>
        <div className={classes.details}>
          <Grid
            container
            spacing={0}
            justifyContent="space-between"
            alignItems="center">
            <Grid item lg={2} md={2} sm={2}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: '#393939',
                }}
                width="auto">
                {`Order ID #${id.slice(0, 4)}...${id.slice(-4)}`}
              </Text>
            </Grid>
            <Grid item lg={3} md={3} sm={3}>
              <Text style={{ fontSize: 13, color: '#777777' }}>
                {formatTime(placed ?? created, 'MMMM DD YYYY, h:mm')}
              </Text>
            </Grid>
            <Grid item lg={3} md={3} sm={3}>
              <Text style={{ fontSize: 13, color: '#777777' }}>
                {formatAmountString(total_price, currency, true)}
              </Text>
            </Grid>
            <Grid item lg={2} md={2} sm={2}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  color: '#393939',
                  textTransform: 'capitalize',
                }}
                width="auto">
                {status}
              </Text>
            </Grid>
            <Grid item lg={2} md={2} sm={2}>
              <Box display="flex" justifyContent="center" width="100%">
                <Button
                  variant="link"
                  onClick={() => helpers?.setId(item)}
                  color="primary">
                  Order details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </Grid>
  );
}
