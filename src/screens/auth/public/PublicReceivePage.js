import React from 'react';
import { makeStyles } from '@material-ui/styles';

import Logo from 'components/rehive/Logo';
import AuthForm from 'components/layout/AuthForm';
import QR from 'components/outputs/QR';
import OutputList from 'components/lists/OutputList';
import { useToast } from 'components/contexts/ToastContext';
import { generateUrl } from 'util/general';
import Text from 'components/outputs/Text';

const PublicReceivePage = props => {
  const classes = useStyles();
  const { location } = props;
  let { pathname, search } = location;

  const params = new URLSearchParams(search);
  const currency = params.get('currency');
  const scheme = params.get('scheme');
  const amount = params.get('amount');
  const address = params.get('address');
  let options = {};
  if (amount) options.amount = amount;
  if (currency) options.currency = currency;
  const { showToast } = useToast();

  const receiveQRString = generateUrl(scheme, address, options);
  const outputItems = [];

  outputItems.push({
    label: 'Address',
    value: address,
    copy: true,
  });

  return (
    <AuthForm header={<Logo height={100} width={200} type={'rehive-logo'} />}>
      <div className={classes.container}>
        <Text>
          {'You have been requested to pay '}
          <b>{(amount ? amount + ' ' : '') + (currency ? currency : '')}</b>
        </Text>
        <div className={classes.qr}>
          <QR showToast={showToast}>{receiveQRString}</QR>
        </div>
        <OutputList items={outputItems} />
      </div>
      {/* <Toast /> */}
    </AuthForm>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // padding: theme.spacing(2),
  },
  qr: {
    width: '100%',
    height: 250,
    display: 'flex',
    justifyContent: 'center',
  },

  details: {
    padding: theme.spacing(2),
  },
}));

export default PublicReceivePage;
