import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import { companiesSelector } from 'redux/auth/selectors';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Text from 'components/outputs/Text';
import OnboardingSectionPanel from './OnboardingSectionPanel';
import OnboardingSectionForm from 'screens/onboarding/business_onboarding/components/OnboardingSectionForm';
export default function SettingsContainer(props) {
  const theme = UI_useTheme();
  const classes = useStyles();
  const { currentCompany } = useSelector(companiesSelector);
  const {
    initialValueMapper,
    handleSubmit,
    sections,
    currentSection,
    setCurrentSection,
    loading,
    error,
    locales,
    context,
  } = props;

  const activeSection = sections?.[currentSection];
  const { location } = props;
  useEffect(() => {
    if (location?.state?.activeBusiness === 'business_banking') {
      setCurrentSection(10);
    }
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  const initialValues = initialValueMapper(activeSection.id);
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      sectionId={activeSection.id}
      onSubmit={handleSubmit}>
      {formikProps => (
        <Form className={classes.form}>
          <div className={classes.root}>
            <div className={classes.leftPanel}>
              <div className={classes.navbar}>
                <Text variant="h6" id="business_settings" />
              </div>

              <div className={classes.leftPanel_Sections}>
                <OnboardingSectionPanel
                  company={currentCompany}
                  sections={sections}
                  activeSection={activeSection}
                  setCurrentStep={setCurrentSection}
                />
              </div>
            </div>
            <Scrollbars style={{ width: '100%' }} rtl={document.dir === 'rtl'}>
              <div className={classes.rightPanel}>
                <div className={classes.rightPanel_container}>
                  <OnboardingSectionForm
                    saveOnly
                    context={context}
                    locales={locales}
                    formikProps={formikProps}
                    loading={loading}
                    activeSection={activeSection}
                    error={error}
                    onPrevious={
                      currentSection > 0
                        ? () => setCurrentSection(currentSection - 1)
                        : null
                    }
                  />
                </div>
              </div>
            </Scrollbars>
          </div>
        </Form>
      )}
    </Formik>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(0),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflow: 'hidden',
    flexDirection: 'row',
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
      paddingLeft: 0,
    },
    [theme.breakpoints.down(670)]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      padding: 0,
    },
  },
  form: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    display: 'flex',
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down(480)]: {
      paddingTop: theme.spacing(1),
    },
  },
  leftPanel: {
    minWidth: '250px',
    overflow: 'hidden',
    [theme.breakpoints.down(950)]: {
      minHeight: 135,
    },
    [theme.breakpoints.down(738)]: {
      minHeight: 'unset',
    },
  },
  leftPanel_Sections: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down(950)]: {
      marginTop: theme.spacing(1),
    },
  },
  rightPanel: {
    [theme.breakpoints.down(738)]: {
      paddingTop: theme.spacing(2),
    },
    [theme.breakpoints.down(480)]: {
      paddingTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  },
  rightPanel_container: {
    maxWidth: '525px',
    margin: 'auto',
  },
  skip: {
    width: '100%',
    [theme.breakpoints.down(950)]: {
      marginTop: 0,
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down(480)]: {
      paddingRight: theme.spacing(1),
    },
  },
  skip_text: {
    [theme.breakpoints.down(480)]: {
      fontSize: '14px',
    },
  },
}));
