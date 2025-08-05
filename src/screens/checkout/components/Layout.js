import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { SimpleImg } from 'react-simple-img';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import CompanyStatusBanner from 'components/app/CompanyStatusBanner';
import Head from 'components/app/Head';

export default function Layout(props) {
  const {
    children,
    headerLeft,
    headerRight,
    containerRef,
    onBack,
    state,
    context = {},
    noLogo,
    hideBack,
    company,
  } = props;

  const { business = {} } = context;

  const hasBanner = (company?.mode ?? '').match(/test|suspended/);

  const classes = useStyles({ ...props, hasBanner });
  const { name, icon } = business;

  const isProcessing = state?.matches('running.crypto.processing') ?? false;
  const showBack =
    !hideBack && (state?.nextEvents.includes('BACK') ?? false) && !isProcessing;

  return (
    <>
      <Head company={company} />
      <CompanyStatusBanner company={company} />
      <div className={classes.container} ref={containerRef}>
        {showBack && (
          <div className={classes.button}>
            <IconLabelButton label="Back" onPress={onBack} />
          </div>
        )}
        <div className={classes.page}>
          {!noLogo && (
            <div className={classes.logo}>
              {Boolean(icon) ? (
                <SimpleImg
                  style={{
                    maxHeight: 140,
                    maxWidth: 140,
                    borderRadius: 200,
                  }}
                  imgStyle={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                  }}
                  alt="rehive"
                  src={icon}
                />
              ) : (
                <PlaceholderImage name="businessIcon" width={140} />
              )}
            </div>
          )}

          {Boolean(headerLeft || headerRight) && (
            <div className={classes.header}>
              {headerLeft}
              {headerRight}
            </div>
          )}
          {Boolean(name) ? (
            <Text
              className={classes.title}
              variant="h5"
              align="center"
              myColor="#222222">
              {name}
            </Text>
          ) : (
            <div className={classes.noTitle} />
          )}
          {children}
        </div>
      </div>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 0,
    padding: theme.spacing(4),
    [theme.breakpoints.down(560)]: {
      padding: theme.spacing(2),
    },
  },
  button: {
    position: 'absolute',
    left: 0,
    top: ({ hasBanner }) => (hasBanner ? 48 : 0),
    [theme.breakpoints.down(560)]: {
      top: ({ hasBanner }) => (hasBanner ? 72 : 0),
    },
    padding: theme.spacing(2),
  },
  expired: {
    position: 'absolute',
    right: theme.spacing(4),
  },
  logo: {
    borderRadius: 140,
    height: 140,
    overflow: 'hidden',
    // padding: 10,
    backgroundColor: theme.palette.primary.contrastText,
    width: 140,
    minHeight: 140,
    minWidth: 140,
    display: 'flex',
    marginTop: -70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    whiteSpace: 'pre-wrap',
  },
  expiredText: {
    whiteSpace: 'pre-wrap',
  },
  container: {
    width: '100%',
    // height: ({ noPadding }) => (height ? '90vh' : '100vh'),
    display: 'flex',
    paddingTop: ({ noLogo }) => theme.spacing(noLogo ? 0 : 6),
    // alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  page: {
    margin: theme.spacing(3),
    marginTop: theme.spacing(6),
    // paddingTop: 70 + theme.spacing(2),
    position: 'relative',
    borderRadius: 30,
    minWidth: 350,
    maxWidth: 550,
    width: '100%',
    [theme.breakpoints.down(600)]: {
      minWidth: 0,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      // paddingLeft: theme.spacing(1),
      // paddingRight: theme.spacing(1),
    },
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  title: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  noTitle: {
    paddingBottom: theme.spacing(2),
  },
}));
