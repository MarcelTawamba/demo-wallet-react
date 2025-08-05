/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { trackFlow } from 'util/tracking';
import { View } from 'components/layout/View';
import { useTheme } from 'components/app/context';
import {
  getDocuments,
  getBankAccounts,
  getAddresses,
  getBusinessServiceSettings,
  getTiers,
} from 'util/rehive';
import { authUserSelector } from 'redux/auth/selectors';
import { userTierSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';
import { BusinessConfig } from '../config';
import { UserConfig } from '../config';
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import LinearProgress from '@material-ui/core/LinearProgress';
import Skeleton from '@material-ui/lab/Skeleton';
import Icon from 'components/outputs/NewIcon';
import { configOnboardingSelector } from 'redux/rehive/selectors';
import { max } from 'lodash';
import { useBusiness } from 'contexts';

export default function OnboardingBanner(props) {
  const { setDisplayOnboardingBanner } = props;
  const { colors } = useTheme();
  const user = useSelector(authUserSelector);
  const tiers = useSelector(userTierSelector);

  const { business } = useBusiness();

  const [display, setDisplay] = useState(true);
  const [bankAccounts, setBankAccounts] = useState();
  const [documents, setDocuments] = useState([]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  const [length, setLength] = useState(0);
  const [businessServiceSettings, setBusinessServiceSettings] = useState();
  const [companyTiers, setCompanyTiers] = useState();
  // const onboardingConfig = useSelector(configOnboardingSelector);

  // const { locales } = onboardingConfig;

  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getTiers(user?.groups?.[0]?.name).then(resp =>
      setCompanyTiers(resp?.data?.results),
    );
  }, []);

  useEffect(() => {
    if (!display || (!loading && completed === length))
      setDisplayOnboardingBanner(false);
  }, [completed, display, loading]);

  const { sections: businessSections } = BusinessConfig({
    business,
    bankAccounts,
    documents,
    tiers: companyTiers,
    defaults: { colors },
  });
  const { sections: userSections } = UserConfig({
    user,
    userAddresses,
    documents,
    bankAccounts,
    tiers: companyTiers,
  });

  useEffect(() => {
    handleFetch();
  }, [user]);

  useEffect(() => {
    isHighestTierLevel();
  }, [tiers]);

  const userGroup = user?.groups?.[0]?.name ?? 'user';

  const isBusinessGroup =
    (businessServiceSettings?.manager_groups ?? []).includes(userGroup) ??
    false;

  let combinedSections = [...userSections];

  if (isBusinessGroup)
    combinedSections = [
      ...combinedSections,
      ...businessSections?.map(x => {
        return { ...x, businessSection: true };
      }),
    ];

  async function handleFetch() {
    if (await isHighestTierLevel()) return;

    let isBusinessGroup = false;

    const settingsResp = await getBusinessServiceSettings(false);
    if (settingsResp?.status === 'success') {
      setBusinessServiceSettings(settingsResp?.data ?? null);
    }
    isBusinessGroup =
      (settingsResp?.data?.manager_groups ?? []).includes(userGroup) ?? false;

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
      new Promise(resolve => {
        getBankAccounts().then(resp => {
          setBankAccounts(resp && resp.length && resp[0]);
          resolve();
        });
      }),
    ]);

    setLoading(false);
  }

  async function isHighestTierLevel() {
    if (!companyTiers) return false;
    const topTier = max(companyTiers?.map(x => x?.level));
    const currentTier = tiers?.items?.[0]?.level;

    if (currentTier === topTier) setDisplay(false);

    return currentTier === topTier;
  }

  useEffect(() => {
    setLength(combinedSections.length);
    setCompleted(combinedSections.filter(section => section?.completed).length);
  }, [businessSections, userSections]);

  const BorderLinearProgress = withStyles(theme => ({
    root: {
      height: 10,
      borderRadius: 5,
      minWidth: '395px',
      display: 'inline-block',
      marginLeft: '1rem',
      marginRight: '1rem',
      [theme.breakpoints.down(1070)]: {
        minWidth: '300px',
      },
      [theme.breakpoints.down(790)]: {
        minWidth: '200px',
      },
      [theme.breakpoints.down(600)]: {
        minWidth: '170px',
        marginLeft: 0,
      },
    },
    colorPrimary: {
      backgroundColor: 'white',
    },
    bar: {
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
  }))(LinearProgress);

  return completed === length || !display ? null : (
    <View
      w={'100%'}
      style={{ position: 'relative', zIndex: 1 }}
      bC={'white'}
      jC={'center'}>
      <View bC={colors.primary} o={0.1} w={'100%'} h={'3rem'}></View>

      <div className={classes.container}>
        {loading || !combinedSections?.length ? (
          <Skeleton width={350} height={20} />
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <div
                style={{
                  flexGrow: 1,
                }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    id="get_started_title"
                    className={classes.container_text}
                    width={'fit-content'}
                  />
                  <BorderLinearProgress
                    variant="determinate"
                    value={(completed / length) * 100}
                  />
                  <Text
                    id="get_started_subtitle"
                    width={'fit-content'}
                    style={{
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                    myColor={'primary'}
                    onClick={() => {
                      history.push('/onboarding/');
                      trackFlow('onboarding', 'continue', null, 'clicked', {
                        type: isBusinessGroup ? 'business' : 'user',
                      });
                    }}
                    bold
                  />
                </div>
              </div>
              <Icon
                icon={'clear'}
                circled={false}
                color={'primary'}
                size={16}
                style={{ lineHeight: 0 }}
                onPress={() => setDisplay(false)}
              />
            </div>
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
    zIndex: 1,
    // padding: `${1 * 16}px ${1 * 16}px 0px ${0.5 * 16}px`,
    [theme.breakpoints.down(735)]: {
      paddingLeft: 1 * 16,
      paddingRight: 1 * 16,
    },
    [theme.breakpoints.down(500)]: {
      width: '100%',
    },
  },
  container_text: {
    fontSize: 12,
    // lineHeight: 0,
    // display: 'inline',
    [theme.breakpoints.down(550)]: {
      display: 'none',
    },
  },
}));
