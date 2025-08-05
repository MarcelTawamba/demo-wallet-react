import React from 'react';
import moment from 'moment';
import makeStyles from '@material-ui/styles/makeStyles';

import Text from 'components/outputs/Text';
import AccessTimeIcon from '@material-ui/icons/AccessTime';

export default function VoucherCard(props) {
  const { voucher, company } = props;
  const { voucher_expiration } = voucher;
  const { voucher_image_id } = company;
  const classes = useStyles();

  return (
    <div className={classes.voucher}>
      <div className={classes.voucherDetails}>
        <Text bold className={classes.voucherRow} align="left">
          Top up voucher
        </Text>
        <div className={classes.voucherRow}>
          <AccessTimeIcon
            color="error"
            // fontSize="small"
            className={classes.voucherIcon}
          />
          <Text color="error" align="left">
            {'Expires on ' +
              moment(voucher_expiration).format('YYYY/MM/DD') +
              ' at ' +
              moment(voucher_expiration).format('hh:ss')}
          </Text>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  voucher: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    paddingTop: theme.spacing(3),
  },
  voucherDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(2),
  },
  voucherIcon: {
    marginRight: theme.spacing(1),
    marginTop: 3,
    justifyContent: 'center',
    fontSize: 16,
  },
  voucherRow: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
  },
}));
