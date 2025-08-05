import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { makeStyles } from '@material-ui/styles';
import PrintIcon from '@material-ui/icons/Print';

import ReceivePaymentDisplayHeader from './ReceivePaymentDisplayHeader';
import ReceivePaymentQR from './ReceivePaymentQR';
import IconButton from 'components/inputs/IconButton';

const ReceivePaymentDisplayModal = props => {
  const { profile, currency, showToast, rates, services, formikProps } = props;
  const refPrint = useRef(null);
  const classes = useStyles();

  const qrProps = {
    currency,
    showToast,
    rates,
    services,
    formikProps,
  };
  return (
    <div className={classes.container}>
      <div className={classes.print}>
        <ReactToPrint
          trigger={() => (
            <IconButton tooltip={'print'}>
              <PrintIcon />
            </IconButton>
          )}
          content={() => refPrint.current}
        />
      </div>
      <div ref={refPrint} className={classes.printArea}>
        <ReceivePaymentDisplayHeader profile={profile} />
        <ReceivePaymentQR {...qrProps} showAmount />
      </div>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  print: {
    padding: theme.spacing(1),
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  printArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flexDirection: 'column',
  },
}));

export default ReceivePaymentDisplayModal;
