import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { currentCompanySelector } from 'redux/auth/selectors';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@material-ui/icons/Print';

import { useSelector } from 'react-redux';
import Logo from 'components/rehive/Logo';
import Text from 'components/outputs/Text';
import { userProfileSelector } from 'redux/rehive/selectors';
import SaleQR from './NewSalePage/SaleQR';
import IconButton from 'components/inputs/IconButton';
import OutOfAppScreen from 'components/layout/OutOfAppScreen';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useBusiness } from 'contexts';

/* components */
export default function PrintQRPage(props) {
  const { business } = useBusiness();
  const refPrint = useRef(null);

  const company = useSelector(currentCompanySelector);
  const profile = useSelector(userProfileSelector);

  const wallets = useSelector(walletsSelector);

  const { icon, name, account } = business;
  console.log('PrintQRPage -> business', business);
  const hasBanner = (company?.mode ?? '').match(/test|suspended/);
  const classes = useStyles({ hasBanner });

  const pageProps = {
    profile,
    account: wallets.accountsDictionary?.['sales'] ? 'sales' : account,
    simpleLayout: true,
    responsive: true,
    business,
    noCheck: true,
  };

  return (
    <OutOfAppScreen
      onBack={'/pos/'}
      headerRight={
        <div className={classes.print}>
          <ReactToPrint
            trigger={() => (
              <IconButton tooltip={'print'}>
                <PrintIcon style={{ fontSize: 25 }} color="primary" />
              </IconButton>
            )}
            content={() => refPrint.current}
            pageStyle={`        
              @media all {
                body {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }
          `}
          />
        </div>
      }>
      <div className={classes.container}>
        <div className={classes.form} ref={refPrint}>
          <div className={classes.title}>
            {icon && <Logo height={36} image={icon} type="rehive-icon" />}
            <Text
              className={classes.companyName}
              width="auto"
              bold
              myColor="#222222">
              {name}
            </Text>
          </div>
          <SaleQR {...pageProps} />
        </div>
      </div>
    </OutOfAppScreen>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // height: '100vh',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    // justifyContent: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  companyName: {
    paddingLeft: theme.spacing(2),
    fontSize: 30,
  },
  title: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
  print: {
    paddingRight: theme.spacing(1),
    paddingTop: 4,
    // paddingRight: theme.spacing(8),
    // position: 'absolute',
    // top: ({ hasBanner }) => (hasBanner ? 90 : 42),
    // right: 20,
    // [theme.breakpoints.down(550)]: {
    //   top: ({ hasBanner }) => (hasBanner ? 68 : 2),
    // },
  },
  form: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    borderRadius: 30,
    minWidth: 350,
    maxWidth: 450,
    border: '1px solid #EFEFEF',
    width: '50%',
    backgroundColor: 'white',
    [theme.breakpoints.down(720)]: {
      width: '100%',
    },
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
    justifyContent: 'space-around',
  },
}));
