import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
import LottieImage from 'components/outputs/LottieImage';

export function SplashScreen({ noLogo = false } = {}) {
  const classes = useStyles();
  let { loading, config, companyDataLoading } = useConfiguration();

  const src =
    config?.logo ??
    config?.icon ??
    (!config?.id ? '/images/full-logo.png' : null);

  // Show loading animation while config is loading OR company data is loading
  const isLoading = loading || companyDataLoading;

  return (
    <div className={classes.container}>
      {isLoading ? (
        <LottieImage name={'splashLoading'} size={250} loop />
      ) : (
        <>
          <div className={classes.progress}>
            <LinearProgress />
          </div>
          {!noLogo && !!src && (
            <img
              style={{
                maxHeight: '40%',
                maxWidth: '30%',
                objectFit: 'contain',
              }}
              alt="splash screen logo"
              src={src}
            />
          )}
        </>
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

const useStylesNoCompany = makeStyles(theme => ({
  colorPrimary: { backgroundColor: '#DDD' },
  barColorPrimary: { backgroundColor: '#AAA' },
}));
