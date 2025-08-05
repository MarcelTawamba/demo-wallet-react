import React, { useMemo } from 'react';
import { findIndex } from 'lodash';
import { trackFlow } from 'util/tracking';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
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
import OnboardingSuccess from './OnboardingSuccess';

export default function OnboardingContainer(props) {
  const theme = UI_useTheme();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const mobile = useMediaQuery(theme.breakpoints.down(670));
  const classes = useStyles({ horizontal });
  const dispatch = useDispatch();
  const history = useHistory();
  const { showToast } = useToast();
  const { currentCompany } = useSelector(companiesSelector);
  const {
    type,
    initialValueMapper,
    handleSubmit,
    combinedSections,
    currentSection,
    setCurrentSection,
    isBusinessGroup,
    loading,
    // setLoading,
    error,
    lockNavigation,
    locales,
    context,
    services,
    state,
    isOnboardingComplete,
    onboardingRequired,
  } = props;

  const activeSection = combinedSections?.[currentSection];

  function handleOnboardingIncomplete() {
    showToast({
      variant: 'error',
      text: 'Please complete the required fields',
    });
  }

  function renderSkip() {
    return (
      <div className={classes.skip}>
        <Text
          id="setup_later_title"
          className={classes.skip_text}
          style={{ textAlign: 'right' }}
          myColor={'#707070'}
          inline
        />
        &nbsp;
        <Text
          id="skip"
          component={'span'}
          className={classes.skip_text}
          style={{ display: 'inline', cursor: 'pointer' }}
          color={'primary'}
          onClick={() => {
            if (isOnboardingComplete || !onboardingRequired) {
              trackFlow('onboarding', 'skip', null, 'clicked', {
                type,
                currentSection: activeSection.title,
              });

              if (activeSection.businessSection || !isBusinessGroup)
                return history.push('/');

              setCurrentSection(
                findIndex(
                  combinedSections,
                  x =>
                    x.id === combinedSections.find(y => y.businessSection)?.id,
                ),
              );
            } else {
              handleOnboardingIncomplete();
            }
          }}
          bold
          inline
        />
      </div>
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
      style={{'width': '100%'}}
      enableReinitialize
      validationSchema={activeSection.validationSchema ?? {}}
      validate={activeSection.validation}
      sectionId={activeSection.id}
      onSubmit={handleSubmit}>
      {formikProps => (
        <Form style={{width: '100%', height: '100vh', backgroundColor: 'white', position: 'fixed', top: 0, left: 0, zIndex: 200}}>
          <div className={classes.root}>
            {/* <div className={classes.leftPanel}>
              <div className={classes.navbar}>
                <div>
                  <Logo
                    image={currentCompany?.logo}
                    height={40}
                    // width={mobile ? 200 : 265}
                    width="auto"
                    imgStyle={{ padding: 0 }}
                    noBorder
                    noMargin
                  />
                </div>
              </div>

              <div className={classes.leftPanel_Sections}>
                <Scrollbars autoHide rtl={document.dir === 'rtl'}>
                  <OnboardingSectionPanel
                    company={currentCompany}
                    combinedSections={combinedSections}
                    activeSection={activeSection}
                    setCurrentStep={setCurrentSection}
                    lockNavigation={lockNavigation}
                    isBusinessGroup={isBusinessGroup}
                  />
                </Scrollbars>
              </div>
            </div> */}
            <Scrollbars
              style={{ width: '100%', height: '100vh', backgroundColor: 'white'}}
              rtl={document.dir === 'rtl'}>
              <div className={classes.rightPanel}>
                <div className={classes.rightPanel_container}>
                  {state === 'success' ? (
                    <OnboardingSuccess />
                  ) : (
                    <OnboardingSectionForm
                      onSuccess={handleSubmit}
                      formikProps={formikProps}
                      context={context}
                      // setLoading={setLoading}
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
      // paddingLeft: 1 * 16,
      paddingTop: theme.spacing(3),
    },
  },
  leftPanel: {
    backgroundColor: 'white',
    minWidth: '300px',
    maxWidth: ({ horizontal }) => (horizontal ? 'unset' : '400px'),
    minHeight: '0',
    [theme.breakpoints.down(950)]: {
      minHeight: 'unset',
    },
    height: '100vh'
  },
  leftPanel_Sections: {
    width: '100%',
    // overflowX: ({ horizontal }) => (horizontal ? 'scroll' : 'unset'),
    // overflowY: 'scroll',
    overflow: 'unset',
    // marginTop: theme.spacing(6),
    // [theme.breakpoints.down(950)]: {
    //   marginTop: 1 * 16,
    // },
    // paddingBottom: 100,
    height: '100vh',
    paddingBottom: 0,
    '@media (max-height: 870px)': {
      paddingBottom: 0,
    },
    '@media (max-height: 750px)': {
      paddingBottom: 0,
    },
    '@media (max-height: 650px)': {
      paddingBottom: 0,
    },
  },
  leftPanel_logout: {
    position: 'relative',
    left: 0,
    bottom: 0,
    paddingBottom: 12,
    paddingLeft: 24,
    width: 284,
    backgroundColor: 'white',
  },
  rightPanel: {
    flexGrow: 1,
    position: 'relative',
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
}));
