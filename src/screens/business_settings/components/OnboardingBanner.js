/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';
import { LinearProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  getBusinesses,
  getDocuments,
  getBankAccounts,
} from 'util/rehive';
import { BusinessConfig } from '../config';
import { UserConfig } from '../config';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Icon from 'components/outputs/NewIcon';

export default function OnboardingBanner(props) {
  const { colors } = useTheme();
  const [user] = useState(useSelector(authUserSelector));
  const [display, setDisplay] = useState(true);
  const [business, setBusiness] = useState();
  const [bankAccounts, setBankAccounts] = useState();
  const [documents, setDocuments] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [length, setLength] = useState(0);

  const classes = useStyles();
  const history = useHistory();
  let isBusiness = false;

  const businessFormConfig = BusinessConfig({
    business,
    bankAccounts,
    documents,
    defaults: { colors },
  });
  const userFormConfig = UserConfig({ user, userAddresses, documents });

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleFetch() {
    setLoading(true);

    if (
      user?.groups?.find(group => group.name.match(/admin|merchant|business/))
    ) {
      isBusiness = true;
      await Promise.all([
        new Promise(resolve => {
          getBusinesses().then(resp => {
            setBusiness(resp?.data?.results?.[0] ?? null);
            return resolve();
          });
        }),
        new Promise(resolve => {
          getDocuments().then(resp => {
            setDocuments(resp?.results ?? []);
            return resolve();
          });
        }),
        new Promise(resolve => {
          getBankAccounts().then(resp => {
            setBankAccounts(resp && resp.length && resp[0]);
            return resolve();
          });
        }),
      ]);
    } else {
      await Promise.all([
        new Promise(resolve => {
          getAddresses().then(resp => {
            setUserAddresses(resp ?? []);
            resolve();
          });
        }),
        new Promise(resolve => {
          getDocuments().then(resp => {
            setDocuments(resp?.results ?? []);
            resolve();
          });
        }),
      ]);
    }

    setLoading(false);
  }

  useEffect(() => {
    const { sections = [] } = isBusiness ? businessFormConfig : userFormConfig;
    setLength(sections.length);
    setCompleted(sections.filter(section => section?.completed).length);
  }, [businessFormConfig, userFormConfig]);

  return completed === length || !display || loading ? null : (
    <View w={'100%'} style={{ position: 'relative' }}>
      <View bC={'primary'} o={0.1} w={'100%'} h={'3rem'}></View>

      <div className={classes.container}>
        {loading ? (
          <Skeleton width={350} height={20} />
        ) : (
          <>
            <Text style={{ lineHeight: 0 }}>
              <Text className={classes.container_text}>
                Onboarding progress
              </Text>
              <BorderLinearProgress
                variant="determinate"
                value={(completed / length) * 100}
              />
              <Text
                style={{
                  display: 'inline',
                  cursor: 'pointer',
                  fontSize: 12,
                  lineHeight: 0,
                }}
                myColor={'primary'}
                onClick={() => history.push('/onboarding/')}
                bold>
                &nbsp; Continue onboarding
              </Text>
            </Text>
            <Icon
              icon={'clear'}
              circled={false}
              color={'primary'}
              size={16}
              style={{ lineHeight: 0 }}
              onPress={() => setDisplay(false)}
            />
          </>
        )}
      </div>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    maxWidth: (320 + 24) * 3,
    margin: 'auto',
    left: 0,
    right: 0,
    position: 'absolute',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px ${0.5 * 16}px`,
    [theme.breakpoints.down(980)]: {
      paddingLeft: 5 * 16,
    },
    [theme.breakpoints.down(735)]: {
      paddingLeft: theme.spacing(1),
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
}));
