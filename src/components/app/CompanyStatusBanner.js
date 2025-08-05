/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { View } from 'components/layout/View';
import { useHistory } from 'react-router-dom';
import {
  withStyles,
  makeStyles,
  useTheme as useThemeMui,
} from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import Icon from 'components/outputs/NewIcon';
import { useSelector } from 'react-redux';
import { currentCompanySelector } from 'redux/auth/selectors';
import { useMediaQuery } from '@material-ui/core';
import { reservedPages } from 'util/general';

export default function CompanyStatusBanner(props) {
  const companyRedux = useSelector(currentCompanySelector);
  const { company = companyRedux } = props;

  const { mode = '' } = company ?? {};
  const isTestCompany = Boolean(mode.match(/test/));
  const isSuspendedCompany = Boolean(mode.match(/suspended/));
  const showBanner = isTestCompany || isSuspendedCompany;
  
  
  const classes = useStyles();
  const history = useHistory();

  const paths = history?.location?.pathname.split('/');
  const isAuthed = reservedPages.includes(paths?.[1]);

  const theme = useThemeMui();
  const matches = useMediaQuery(theme.breakpoints.down(562));
  const matches2 = useMediaQuery(theme.breakpoints.down(736));

  return (
    showBanner && (
      <View
        w={'100%'}
        // h={matches ? 72 : 48}
        style={{
          position: 'relative',
          zIndex: 100,
          // marginTop: matches2 && isAuthed ? 48 : 0,
        }}>
        <View
          bC={isSuspendedCompany ? 'error' : '#fef3ea'}
          // o={0.1}
          w={'100%'}
          h={matches ? 72 : 48}></View>

        <div className={classes.container}>
          <div className={classes.icon}>
            <Icon
              circled={false}
              icon={isSuspendedCompany ? 'error' : 'warning'}
              size={20}
              color={isSuspendedCompany ? 'error' : 'warning'}
            />
          </div>
          {isSuspendedCompany ? (
            <Text display={'inline'} width="auto" align={'center'}>
              <Text
                display={'inline'}
                bold
                width="auto"
                myColor={'error'}
                id={'alert'}
              />
              <Text
                display={'inline'}
                bold
                width="auto"
                myColor={'error'}>
                :&nbsp;
              </Text>
              <Text
                display={'inline'}
                width="auto"
                myColor={'error'}
                id={'suspended_company_banner'}
              />
            </Text>
          ) : (
            <Text display={'inline'} width="auto" align={'center'}>
              <Text
                display={'inline'}
                bold
                width="auto"
                myColor={'warning'}
                id={'warning'}
              />
              <Text
                display={'inline'}
                bold
                width="auto"
                myColor={'warning'}>
                :&nbsp;
              </Text>
              <Text
                display={'inline'}
                width="auto"
                myColor={'warning'}>
                This is a test project for demonstration purposes only.
              </Text>
            </Text>
          )}
        </div>
      </View>
    )
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: (320 + 24) * 3,
    margin: 'auto',
    left: 0,
    right: 0,
    position: 'absolute',
    // padding: `${1 * 16}px ${1 * 16}px 0px ${0.5 * 16}px`,
    padding: 10,
    [theme.breakpoints.down(735)]: {
      paddingLeft: 1 * 16,
    },
    [theme.breakpoints.down(500)]: {
      width: '100%',
    },
  },
  container_text: {
    fontSize: 12,
    lineHeight: 0,
    display: 'inline',
    [theme.breakpoints.down(550)]: {
      display: 'none',
    },
  },
  icon: {
    paddingTop: 6,
    paddingLeft: ({ dense }) => theme.spacing(dense ? 0.5 : 0),
    marginRight: theme.spacing(1),
  },
}));
