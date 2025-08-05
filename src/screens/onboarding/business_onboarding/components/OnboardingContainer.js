import React, { useMemo, useState } from 'react';
import { findIndex } from 'lodash';
import { trackFlow } from 'util/tracking';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import { Drawer, useMediaQuery } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { companiesSelector } from 'redux/auth/selectors';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Text from 'components/outputs/Text';
import Logo from 'components/rehive/Logo';
import OnboardingSectionPanel from './OnboardingSectionPanel';
import OnboardingSectionForm from './OnboardingSectionForm';
import Toast from 'components/outputs/Toast';
import { useToast } from 'components/contexts/ToastContext';
import MenuItem from 'components/menu/MenuItem';
import { logoutUser } from 'redux/auth/actions';
import OnboardingSuccess from 'screens/onboarding/components/OnboardingSuccess';
import { Button } from 'components/inputs/ButtonNew';
import { View } from 'components/layout/View';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from 'components/outputs/NewIcon';
import useI18Language from 'hooks/useI18Language';
export default function OnboardingContainer(props) {
  const theme = UI_useTheme();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const mobile = useMediaQuery(theme.breakpoints.down(670));
  const classes = useStyles({ horizontal });
  const dispatch = useDispatch();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const toggleMobileDrawer = () => setIsMobileDrawerOpen(!isMobileDrawerOpen);
  const history = useHistory();
  const { showToast } = useToast();
  const { currentCompany } = useSelector(companiesSelector);
  const { getI18Translation } = useI18Language();
  const {
    type,
    initialValueMapper,
    handleSubmit,
    combinedSections,
    currentSection,
    setCurrentSection,
    isBusinessGroup,
    loading,
    error,
    lockNavigation,
    locales,
    context,
    services,
    state,
    isOnboardingComplete,
    onboardingRequired,
    setIsUserOnboarding,
  } = props;

  const activeSection = combinedSections?.[currentSection];

  const leftSidebarContent = (
    <>
      <div className={classes.leftPanel_Sections}>
        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <OnboardingSectionPanel
            setIsUserOnboarding={setIsUserOnboarding}
            company={currentCompany}
            combinedSections={combinedSections}
            activeSection={activeSection}
            setCurrentStep={setCurrentSection}
            lockNavigation={lockNavigation}
            isBusinessGroup={isBusinessGroup}
          />
        </Scrollbars>
      </div>
      <div className={classes.leftPanel_logout}>
        <MenuItem
          item={{ id: 'logout', label: 'logout', icon: 'exit' }}
          to="/"
          onClick={handleLogoutUser}
        />
      </div>
    </>
  );

  const drawerContent = (
    <>
      <div className={classes.leftPanel_Sections}>
        <div style={{ padding: '16px' }}>
          <Button
            startIcon={
              <Icon
                icon="back"
                color={'primary'}
                size={20}
                style={{ background: 'transparent' }}
              />
            }
            variant="text"
            color="primary"
            capitalize={false}
            style={{ 
              marginBottom: '16px', 
              justifyContent: 'flex-start',
              fontSize: '14px'
            }}
            onClick={() => {
              setIsUserOnboarding(true);
              setIsMobileDrawerOpen(false);
            }}>
            {getI18Translation('user_onboarding')}
          </Button>
          {combinedSections
            ?.filter(x => x.businessSection && !x.hidden)
            ?.map((section, index) => {
              const sectionIndex = combinedSections.findIndex(s => s.id === section.id);
              const isActive = section.id === activeSection.id;
              return (
                <div
                  key={section.id}
                  style={{
                    padding: '8px 0',
                    borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
                    paddingLeft: '12px',
                    cursor: 'pointer',
                    color: isActive ? theme.palette.primary.main : 'inherit'
                  }}
                  onClick={() => {
                    setCurrentSection(sectionIndex);
                    setIsMobileDrawerOpen(false);
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon
                      icon={section.completed && !isActive ? 'Check' : section.icon}
                      backgroundColor={isActive ? theme.palette.primary.main : section.completed ? '#2BB292' : '#EFEFEF'}
                      color={!section.completed && !isActive ? '#999' : 'white'}
                      size={24}
                      style={{ marginRight: '12px' }}
                    />
                    <Text style={{ 
                      fontWeight: isActive ? 'bold' : 'normal',
                      fontSize: '14px'
                    }}>
                      {getI18Translation(section.title)}
                    </Text>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={classes.leftPanel_logout}>
        <MenuItem
          item={{ id: 'logout', label: 'logout', icon: 'exit' }}
          to="/"
          onClick={handleLogoutUser}
        />
      </div>
    </>
  );

  function handleOnboardingIncomplete() {
    showToast({
      variant: 'error',
      text: 'Please complete the required fields',
    });
  }
  const handleSkip = () => {
    return history.push('/');
  };

  function renderTopRightButton() {
    if (!(isOnboardingComplete || !onboardingRequired) || horizontal) {
      return null;
    }
    
    return (
      <View style={{
        position: 'absolute',
        top: '32px',
        right: '32px',
        zIndex: 1000,
      }}>
        <Button
          variant={'contained'}
          color="secondary"
          style={{
            fontSize: '14px',
            height: '36px',
            backgroundColor: theme.palette.secondary.main,
            color: 'white',
            minWidth: 'auto',
            padding: '8px 16px'
          }}
          onClick={handleSkip}
          capitalize={false}
        >
          {getI18Translation('go_to_app')}
        </Button>
      </View>
    );
  }

  function renderMinimumTierMessage() {
    if (isOnboardingComplete || !onboardingRequired) {
      return null;
    }
    
    return (
      <View style={{
        display: 'flex',
        justifyContent: 'center',
        padding: horizontal ? '12px 16px' : '16px',
        marginTop: horizontal ? '16px' : '80px'
      }}>
        <Text
          id={'minimum_tier_to_access_app'}
          capitalize
          color="primary"
          style={{
            backgroundColor: `${theme.palette.secondary.light}`,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '25px',
            fontSize: '13px',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: '400px'
          }}
        />
      </View>
    );
  }

  function handleLogoutUser() {
    dispatch(logoutUser());
  }

  function onPrevious() {
    if (currentSection === 0) return;

    if (combinedSections?.[currentSection - 1].parent)
      return setCurrentSection(currentSection - 2);

    setCurrentSection(currentSection - 1);
  }

  if (loading || !combinedSections?.length)
    return <SplashScreen company={currentCompany} noLogo />;

  return (
    <Formik
      initialValues={initialValueMapper(activeSection?.id)}
      enableReinitialize
      validationSchema={activeSection.validationSchema ?? {}}
      validate={activeSection.validation}
      sectionId={activeSection.id}
      onSubmit={handleSubmit}>
      {formikProps => (
        <Form>
          <div className={classes.root}>
            <div className={classes.onboarding_desktop_content}>
              <div className={classes.leftPanel}>
                <div className={classes.navbar}>
                  <div>
                    <Logo
                      image={currentCompany?.logo}
                      height={40}
                      width="auto"
                      imgStyle={{ padding: 0 }}
                      noBorder
                      noMargin
                    />
                  </div>
                </div>
                {leftSidebarContent}
              </div>
            </div>
            <div className={classes.onboarding_mobile_content}>
              <div className={classes.navbarMobile}>
                <Toolbar>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    onClick={toggleMobileDrawer}
                    aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                </Toolbar>
                <div>
                  <Logo
                    image={currentCompany?.logo}
                    height={40}
                    width="auto"
                    imgStyle={{ padding: 0 }}
                    noBorder
                    noMargin
                  />
                </div>
                {(isOnboardingComplete || !onboardingRequired) && (
                  <div style={{ marginLeft: 'auto', marginRight: '16px' }}>
                    <Button
                      variant={'contained'}
                      color="secondary"
                      style={{
                        fontSize: '12px',
                        height: '32px',
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white',
                        minWidth: 'auto',
                        padding: '6px 12px'
                      }}
                      onClick={handleSkip}
                      capitalize={false}
                    >
                      {getI18Translation('go_to_app')}
                    </Button>
                  </div>
                )}
              </div>
              
              <Drawer
                anchor="left"
                open={isMobileDrawerOpen}
                onClose={toggleMobileDrawer}
                PaperProps={{
                  style: {
                    width: 300,
                    maxWidth: '80vw',
                  }
                }}>
                <div className={classes.leftPanel}>{drawerContent}</div>
              </Drawer>
            </div>
            <Scrollbars
              style={{ width: '100%', height: '100vh' }}
              rtl={document.dir === 'rtl'}>
              <div className={classes.rightPanel}>
                {renderTopRightButton()}
                {renderMinimumTierMessage()}
                <div className={classes.rightPanel_container}>
                  {state === 'success' ? (
                    <OnboardingSuccess />
                  ) : (
                    <OnboardingSectionForm
                      onSuccess={handleSubmit}
                      formikProps={formikProps}
                      context={context}
                      locales={locales}
                      loading={loading}
                      activeSection={activeSection}
                      activeSectionIndex={currentSection}
                      error={error}
                      onPrevious={onPrevious}
                      isOnboardingComplete={isOnboardingComplete}
                      showToast={showToast}
                    />
                  )}
                </div>
              </div>
            </Scrollbars>
            <div style={{ position: 'absolute', bottom: 15, right: 10 }}>
              <Toast />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
    },
  },
  navbar: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down(670)]: {
      paddingLeft: theme.spacing(5),
    },
    [theme.breakpoints.down(480)]: {
      paddingTop: theme.spacing(3),
    },
  },
  leftPanel: {
    backgroundColor: 'white',
    minWidth: '300px',
    maxWidth: ({ horizontal }) => (horizontal ? 'unset' : '400px'),
    minHeight: '100vh',
    [theme.breakpoints.down(950)]: {
      minHeight: 'unset',
    },
  },
  leftPanel_Sections: {
    width: '100%',
    overflow: 'unset',
    marginTop: theme.spacing(6),
    [theme.breakpoints.down(950)]: {
      marginTop: 1 * 16,
    },
    height: '83vh',
    paddingBottom: 40,
    '@media (max-height: 870px)': {
      paddingBottom: 60,
    },
    '@media (max-height: 750px)': {
      paddingBottom: 70,
    },
    '@media (max-height: 650px)': {
      paddingBottom: 80,
    },
  },
  leftPanel_logout: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingBottom: 12,
    paddingLeft: 24,
    width: 284,
    backgroundColor: 'white',
  },
  rightPanel: {
    flexGrow: 1,
    minHeight: '100vh',
    padding: 2 * 16,
    [theme.breakpoints.down(950)]: {
      minHeight: 'unset',
    },
    [theme.breakpoints.down(480)]: {
      padding: 1 * 16,
    },
  },
  rightPanel_container: {
    marginTop: '10%',
    maxWidth: '525px',
    margin: 'auto',
  },
  skip: {
    width: '100%',
    textAlign: 'right',
    [theme.breakpoints.down(950)]: {
      marginTop: 0,
      paddingRight: 2 * 16,
    },
    [theme.breakpoints.down(480)]: {
      paddingRight: 1 * 16,
    },
  },
  skip_text: {
    [theme.breakpoints.down(480)]: {
      fontSize: '14px',
    },
  },
  onboarding_desktop_content: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  onboarding_mobile_content: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  navbarMobile: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));
