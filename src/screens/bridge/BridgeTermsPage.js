import React, { useEffect, useState } from 'react';
import AuthForm from 'components/layout/AuthForm';
import Logo from 'components/rehive/Logo';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { Box, Chip, Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { currentCompanySelector, authUserSelector } from 'redux/auth/selectors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { makeStyles } from '@material-ui/core/styles';
import { useKYCLink } from 'hooks/bridgeAPI';
import { useHistory } from 'react-router-dom';
import Spinner from 'components/outputs/Spinner';
import SyncIcon from '@material-ui/icons/Sync';
import ErrorIcon from '@material-ui/icons/Error';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { logoutUser } from 'redux/auth/actions';
import { configOnboardingSelector, configAuthSelector } from 'redux/rehive/selectors';
import { userTierSelector } from 'screens/accounts/redux/selectors';
import { intersection, get } from 'lodash';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Info from 'components/outputs/Info';
import { useFetchActiveTier } from 'hooks/tierRequirementAPI';
import { isAdmin } from 'util/general';

const useStyles = makeStyles(theme => ({
  stepContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  clickableSection: {
    width: '100%',
    cursor: 'pointer',
    padding: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
    },
    '&.disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  stepIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: '1.5rem',
  },
  stepText: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
  },
  continueButton: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1.5, 0),
    fontWeight: 600,
    width: '100%',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  bridgeLogo: {
    height: 60,
    marginTop: theme.spacing(3),
  },
  logoSeparator: {
    width: '100%',
    textAlign: 'center',
    margin: theme.spacing(1, 0),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  statusChip: {
    marginLeft: theme.spacing(1),
    fontWeight: 500,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  syncIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1rem',
    animation: '$spin 2s linear infinite',
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  updateInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
  },
  customInfoBox: {
    marginTop: theme.spacing(3),
    marginBottom: 0,
  },
  sectionContainer: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
  },
  reviewBox: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2.5),
    backgroundColor: theme.palette.info.light,
    borderRadius: theme.shape.borderRadius,
    borderLeft: `4px solid ${theme.palette.info.main}`,
  },
  pageContainer: {
    padding: theme.spacing(2, 0),
  },
  logoutButton: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  logoutIcon: {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
    color: theme.palette.text.secondary,
  },
  logoutText: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

// Helper function to get user-friendly status text and color
const getStatusInfo = (status) => {
  switch (status) {
    case 'approved':
      return { 
        text: 'Approved', 
        color: 'default',
        icon: <CheckCircleIcon fontSize="small" style={{ color: '#4caf50' }} />,
        style: { backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }
      };
    case 'under_review':
      return { 
        text: 'Under Review', 
        color: 'primary',
        icon: <HourglassEmptyIcon fontSize="small" />
      };
    case 'incomplete':
      return { 
        text: 'Under Review', 
        color: 'primary',
        icon: <HourglassEmptyIcon fontSize="small" />
      };
    case 'rejected':
      return { 
        text: 'Rejected', 
        color: 'error',
        icon: <ErrorIcon fontSize="small" />
      };
    case 'not_started':
      return { 
        text: 'Not Started', 
        color: 'default',
        icon: <RadioButtonUncheckedIcon fontSize="small" />
      };
    default:
      return { 
        text: 'Not Started', 
        color: 'default',
        icon: <RadioButtonUncheckedIcon fontSize="small" />
      };
  }
};

export default function BridgeTermsPage() {
  const company = useSelector(currentCompanySelector);
  const user = useSelector(authUserSelector);
  const onboardingConfig = useSelector(configOnboardingSelector);
  const authConfig = useSelector(configAuthSelector);
  const tier = useSelector(userTierSelector);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUrl = window.location.href;
  
  // Get tier verification data
  const userGroup = user?.groups?.[0]?.name;
  const { data: freshActiveTierData } = useFetchActiveTier(userGroup, user?.id);
  
  // Calculate if user is verified (same logic as PrivateRouter)
  const freshTierLevel = get(freshActiveTierData, ['data', 'results', 0, 'level']);
  const reduxTierLevel = get(tier, ['items', 0, 'level']);
  const userTier = freshTierLevel || reduxTierLevel || 0;
  const requiredTier = get(authConfig, 'tier') || 0;
  const adminCheck = Boolean(isAdmin({ userGroup: user?.groups?.[0]?.section })?.length);
  const isUserVerified = userTier >= requiredTier || adminCheck;
  
  const { data: apiResponse, isLoading, refetch, error } = useKYCLink(currentUrl, true, {
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (!user) {
      history.push('/login');
      return;
    }
  }, [user, history]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <AuthForm
        header={
          <div className={classes.headerContainer}>
            <Logo
              noBorder
              height={100}
              type="company"
              width={100}
              image={company?.icon ?? ''}
            />
          </div>
        }
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Text color="error">An error occurred while loading. Please try again.</Text>
        </Box>
      </AuthForm>
    );
  }

  try {
    const kycStatus = apiResponse?.data?.kyc?.status;
    const tosStatus = apiResponse?.data?.tos?.status;
    const kycUrl = apiResponse?.data?.kyc?.url;
    const tosUrl = apiResponse?.data?.tos?.url;

    const canClickKYC = !kycStatus || ['not_started', 'rejected'].includes(kycStatus);
    const isKYCComplete = kycStatus === 'approved';
    const isTOSComplete = tosStatus === 'approved';

    const kycStatusInfo = getStatusInfo(kycStatus);
    const tosStatusInfo = getStatusInfo(tosStatus);

    const handleStepClick = (step) => {
      const url = step === 'kyc' ? kycUrl : tosUrl;
      
      if (url && (step !== 'kyc' || canClickKYC)) {
        window.location.href = url;
      }
    };

    const handleContinue = () => {
      if (isKYCComplete && isTOSComplete) {
        // First check if user is already verified (meets tier requirements)
        // If verified, skip onboarding and go directly to home
        if (isUserVerified) {
          console.log('Bridge terms completed, user is verified, redirecting to home');
          window.location.href = `${window.location.origin}/home/`;
          return;
        }
        
        // Check if user needs to go through onboarding based on config
        const enterOnboarding =
          !intersection(
            onboardingConfig.hideApp,
            user?.groups?.map(x => x.name) ?? [],
          )?.length &&
          !intersection(
            onboardingConfig.hideRegister,
            user?.groups?.map(x => x.name) ?? [],
          )?.length;

        console.log('Bridge terms completed, user not verified, redirecting to', enterOnboarding ? 'onboarding' : 'home');
        
        if (enterOnboarding) {
          window.location.href = `${window.location.origin}/onboarding/`;
        } else {
          window.location.href = `${window.location.origin}/home/`;
        }
      }
    };

    const handleLogout = () => {
      dispatch(logoutUser());
      history.push('/login');
    };

    return (
      <AuthForm
        header={
          <div className={classes.headerContainer}>
            <Logo
              noBorder
              height={100}
              type="company"
              width={100}
              image={company?.icon ?? ''}
            />
            <img 
              src="/images/bridge-logo.svg" 
              alt="Bridge" 
              className={classes.bridgeLogo} 
            />
          </div>
        }
        titleId="Partner Agreement">
        <Box display="flex" alignItems="center" flexDirection="column" className={classes.pageContainer}>
          <Box className={classes.sectionContainer}>
            <Box 
              className={`${classes.clickableSection}`}
              onClick={(e) => {
                e.preventDefault();
                handleStepClick('tos');
              }}
            >
              <Box className={classes.sectionHeader}>
                <Text variant="h6" style={{ fontWeight: 600 }}>Partner Agreement</Text>
                <Chip 
                  size="small" 
                  label={tosStatusInfo.text}
                  color={tosStatusInfo.color}
                  className={classes.statusChip}
                  icon={tosStatusInfo.icon}
                  style={tosStatusInfo.style}
                />
              </Box>
              <Text variant="body1" color="textSecondary" gutterBottom>
                Click to view and sign our partner agreement.
              </Text>
            </Box>
          </Box>

          <Box className={classes.sectionContainer}>
            <Box 
              className={`${classes.clickableSection} ${!canClickKYC && !isKYCComplete ? 'disabled' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleStepClick('kyc');
              }}
            >
              <Box className={classes.sectionHeader}>
                <Text variant="h6" style={{ fontWeight: 600 }}>Identification</Text>
                <Chip 
                  size="small" 
                  label={kycStatusInfo.text}
                  color={kycStatusInfo.color}
                  className={classes.statusChip}
                  icon={kycStatusInfo.icon}
                  style={kycStatusInfo.style}
                />
              </Box>
              <Text variant="body1" color="textSecondary" gutterBottom>
                Clicking will launch Persona, our trusted third-party integration, to assist with verifying your identity.
              </Text>
            </Box>
            
            {(kycStatus === 'under_review' || kycStatus === 'incomplete') && (
              <Box className={classes.customInfoBox}>
                <Info noMargin>
                  Your verification is currently under review. This process typically takes a few minutes but may take longer during peak times. You'll be notified once the review is complete.
                </Info>
              </Box>
            )}
          </Box>

          <Button
            label="Continue"
            color="primary"
            wide
            noPadding
            disabled={!isKYCComplete || !isTOSComplete}
            onPress={handleContinue}
            className={classes.continueButton}
          />
          
          <Box className={classes.updateInfo}>
            <SyncIcon className={classes.syncIcon} />
            <Text variant="caption" color="textSecondary">
              Status updates automatically
            </Text>
          </Box>
          
          <Divider style={{ width: '100%', margin: '16px 0 8px 0' }} />
          
          <Box 
            className={classes.logoutButton}
            onClick={handleLogout}
          >
            <ExitToAppIcon className={classes.logoutIcon} />
            <Text variant="body2" className={classes.logoutText}>
              Log out
            </Text>
          </Box>
        </Box>
      </AuthForm>
    );
  } catch (error) {
    return (
      <AuthForm
        header={
          <div className={classes.headerContainer}>
            <Logo
              noBorder
              height={100}
              type="company"
              width={100}
              image={company?.icon ?? ''}
            />
          </div>
        }
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Text color="error">Something went wrong. Please try refreshing the page.</Text>
        </Box>
      </AuthForm>
    );
  }
} 