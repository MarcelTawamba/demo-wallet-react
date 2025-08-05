import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import { Drawer, useMediaQuery } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { companiesSelector } from 'redux/auth/selectors';
import { SplashScreen } from 'components/rehive/SplashScreen';
import Logo from 'components/rehive/Logo';
import OnboardingSidebar from './OnboardingSidebar';
import OnboardingSectionForm from './OnboardingSectionForm';
import Toast from 'components/outputs/Toast';
import { useToast } from 'components/contexts/ToastContext';
import MenuItem from 'components/menu/MenuItem';
import { logoutUser, updateUserProfile } from 'redux/auth/actions';
import OnboardingSuccess from './OnboardingSuccess';
import { Button } from 'components/inputs/Button';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ButtonMui from '@material-ui/core/Button';
import {
  createAddress,
  createDocumentWithType,
  getProfile,
  updateProfile,
  updateProfileImage,
} from 'util/rehive';
import { useDocumentsFetch } from 'hooks/documentAPI';
import { useAddressesFetch } from 'hooks/addressAPI';
import useI18Language from 'hooks/useI18Language';
import { hasFormAddressData } from '../config/utils';
import { useFetchActiveTier } from 'hooks/tierRequirementAPI';
import { validateRequiredFieldsCompletion } from '../util';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { validateTierAndReqCompletion } from '../util/tierCompletion';

import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

export default function OnboardingContainer(props) {
  const theme = UI_useTheme();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const classes = useStyles({ horizontal });
  const dispatch = useDispatch();
  const history = useHistory();
  const { showToast } = useToast();
  const { currentCompany } = useSelector(companiesSelector);
  const { getI18Translation } = useI18Language();
  const {
    initialValueMapper,
    handleSubmit,
    isBusinessGroup,
    loading,
    error,
    locales,
    context,
    services,
    state,
    isOnboardingComplete,
    tierConfig,
    documentTypes,
    minimumTierRequirement,
    userGroup,
    setSuccessState,
    successFunction,
    isWidget,
    setIsUserOnboarding,
    combinedSections,
    currentSection,
    setCurrentSection,
  } = props;

  const { refetch: refetchUserDocument, data: userDocumentData } =
    useDocumentsFetch(context?.user?.id);
  const { refetch: refetchUserAddress, data: addresses } = useAddressesFetch(
    context?.user?.id,
  );
  
  const { refetch: refetchActiveTier, data: userActiveTier } =
    useFetchActiveTier(userGroup, context?.user?.id, true, 1500);
  const userActiveTierLevel = userActiveTier?.data?.results?.[0]?.level;
  const userDocuments = userDocumentData?.results ?? [];
  const [activeTier, setActiveTier] = useState();
  const [activeTierRequirement, setActiveTierRequirement] = useState();
  const [activeTierSubRequirement, setActiveTierSubRequirement] = useState();
  const [refreshView, setRefreshView] = useState(false);
  const [isSkipAvailable, setIsSkipAvailable] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const toggleMobileDrawer = () => setIsMobileDrawerOpen(!isMobileDrawerOpen);

  // useEffect(() => {
  //   if (!activeTier && tierConfig?.length > 0) {
  //     setActiveTier(tierConfig[0]);
  //     setActiveTierRequirement(tierConfig[0]?.requirementSets?.[0]);
  //     setActiveTierSubRequirement(
  //       tierConfig[0]?.requirementSets?.[0]?.subRequirementSets?.[0],
  //     );
  //   }
  // }, [tierConfig]);

  useEffect(() => {
    if (!activeTier || activeTier?.level === 1) {
      // the tierLevel state is getting from clicking on profile screen Tier header, to navigate exact step that clicked on
      // otherwise it will set the next tier step that the user currently on
      const tierLevelState = history.location?.state?.tierLevel;
      let currentActiveTier = tierLevelState
        ? tierLevelState - 1
        : userActiveTierLevel + 1;
      let currentActiveTierIndex = tierLevelState
        ? tierLevelState - 1
        : userActiveTierLevel;
      if (!currentActiveTier || isNaN(currentActiveTier)) {
        currentActiveTier = 1;
        currentActiveTierIndex = 0;
      }
      
      // Fix: Handle case where user is already at max tier level
      // If the calculated tier index is beyond available tiers, use the last available tier
      if (currentActiveTierIndex >= tierConfig?.length) {
        currentActiveTierIndex = (tierConfig?.length || 1) - 1;
        currentActiveTier = currentActiveTierIndex + 1;
      }
      
      if (tierConfig?.length >= currentActiveTier) {
        setActiveTier(tierConfig[currentActiveTierIndex]);

        if (!tierConfig[currentActiveTierIndex].requirementSets) {
          currentActiveTierIndex = 0;
          setActiveTier(tierConfig[currentActiveTierIndex]);
        }

        tierConfig[currentActiveTierIndex]?.requirementSets?.[0] &&
          setActiveTierRequirement(
            tierConfig[currentActiveTierIndex]?.requirementSets?.[0],
          );
        // validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
        //   user: context?.user,
        //   addresses,
        //   userDocuments,
        // });
        // if (
        //   tierConfig[currentActiveTierIndex]?.requirementSets?.[0]
        //     ?.subRequirementSets?.[0] &&
        //   isEmpty(
        //     tierConfig[currentActiveTierIndex]?.requirementSets?.[0]?.fields,
        //   )
        // ) {
        //   setActiveTierRequirement(
        //     tierConfig[currentActiveTierIndex]?.requirementSets?.[0],
        //   );
        // }
      }
    }
  }, [userActiveTierLevel, tierConfig]);

  const selectedRequirementSet =
    activeTierSubRequirement ?? activeTierRequirement ?? {};

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (tierConfig && addresses && userDocuments && userActiveTier) {
      const error = validateRequiredFieldsCompletion(
        minimumTierRequirement,
        tierConfig,
        {
          user: context?.user,
          addresses,
          userDocuments,
        },
      );
      validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
        user: context?.user,
        addresses,
        userDocuments,
      });
      if (userActiveTierLevel >= minimumTierRequirement) {
        setIsSkipAvailable(true);
        
        // Check if user has completed all requirements and should see success state
        const isFullyCompleted = tierConfig.every(tier => 
          tier.tierCompletionPercentage === 100
        );
        
        if (isFullyCompleted && !activeTier) {
          setSuccessState();
        }
      } else {
        setIsSkipAvailable(false);
      }
      setRefreshView(!refreshView);
    }
  }, [userActiveTier, tierConfig, addresses, userDocuments]);

  // Handle business group state change on success
  useEffect(() => {
    if (state === 'success' && isSkipAvailable && isBusinessGroup) {
      setIsUserOnboarding(false);
    }
  }, [state, isSkipAvailable, isBusinessGroup]);

  const handleSkip = () => {
    return history.push('/');
  };

  const handleHelpClick = () => {
    return window.open(
      currentCompany?.support_website ??
        'https://rehive.intercom.help/en/articles/4389139-what-are-tier-requirements-and-how-do-they-work-what-is-best-practice',
    );
  };

  function handleLogoutUser() {
    dispatch(logoutUser());
  }

  function onPrevious() {
    // checking document selection step

    const activeRequirementSet =
      activeTierSubRequirement ?? activeTierRequirement ?? {};

    if (activeTierSubRequirement) {
      if (
        activeRequirementSet.isDocumentSelection &&
        activeRequirementSet.isDocumentSelectionCompleted
      ) {
        activeRequirementSet.isDocumentSelectionCompleted = false;
      }

      setActiveTierRequirement(
        tierConfig
          ?.find(item => item.id === activeTier?.id)
          ?.requirementSets?.find(
            item => item.id === activeTierRequirement?.id,
          ),
      );
      setActiveTierSubRequirement(null); // if any sub-requirement is selected and want to go back we are just making it null
      return;
    }

    const activeSection =
      activeTierSubRequirement ?? activeTierRequirement ?? activeTier;
    if (activeSection) {
      let allRequirementSets = [],
        allSubRequirementSets = [];
      tierConfig.forEach(tier => {
        tier.requirementSets.forEach(rSet => {
          allRequirementSets.push(rSet);
          if (rSet.subRequirementSets) {
            allSubRequirementSets = [
              ...allSubRequirementSets,
              ...rSet.subRequirementSets,
            ];
          }
        });
      });
      const prevTier = tierConfig.find(
        item => item.id === activeTier?.prevTier,
      );

      if (
        prevTier?.requirementSets?.length === 0 &&
        !activeRequirementSet?.prevReqSet
      ) {
        // console.log('stay here.../ no previous requirement');
        return;
      }

      console.log('flag 1');
      let skipReqUpdate = false,
        skipTierUpdate = false;
      if (!activeSection.prevSubReqSet) setActiveTierSubRequirement(null);
      console.log(
        'flag 2',
        activeTierRequirement?.id !== activeSection.prevReqSet,
        activeSection.prevReqSet,
      );
      if (
        !skipReqUpdate &&
        activeTierRequirement?.id !== activeSection.prevReqSet &&
        activeSection.prevReqSet
      ) {
        console.log('setting prevReqSet');
        const foundItem = allRequirementSets.find(
          item => item.id === activeSection.prevReqSet,
        );
        if (foundItem.tierId === activeTier.id) {
          skipTierUpdate = true;
        }
        setActiveTierRequirement(foundItem);
      } else if (!activeSection.prevReqSet && !skipReqUpdate) {
        setActiveTierRequirement(null);
      }
      console.log(
        'flag 3',
        activeTier?.id !== activeSection.prevTier,
        activeSection.prevTier,
      );
      if (
        activeTierRequirement?.subRequirementSets &&
        activeSection.id === activeTierRequirement?.subRequirementSets[0].id &&
        !isEmpty(activeTierRequirement?.fields)
      ) {
        skipTierUpdate = true;
        setActiveTierRequirement(activeTierRequirement);
        setActiveTierSubRequirement(null);
      }

      if (
        !skipTierUpdate &&
        activeTier?.id !== activeSection.prevTier &&
        activeSection?.prevTier
      ) {
        const newActiveTier = tierConfig.find(
          item => item.id === activeSection.prevTier,
        );
        if (newActiveTier?.requirementSets?.length > 0) {
          setActiveTier(
            tierConfig.find(item => item.id === activeSection.prevTier),
          );
        } else {
          console.log('active tier has no requirements set');
        }
      }
    }
    validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
      user: context?.user,
      addresses,
      userDocuments,
    });
  }

  async function updateUser(values, area) {
    let response = { status: 'success' };
    try {
      switch (area) {
        case 'profileImage':
          response.data = await updateProfileImage(values.profile);
          break;
        default:
          response.data = await updateProfile(values);
          break;
      }
      dispatch(updateUserProfile(response.data));
    } catch (error) {
      response = error;
      response.status = 'error';
    }

    return response;
  }

  async function refreshUser() {
    try {
      const response = await getProfile();
      dispatch(updateUserProfile(response));
    } catch (error) {
      console.log(error);
    }
  }

  async function onNext(values, formikActions, caller) {
    // caller represent save/next is calling
    validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
      user: context?.user,
      addresses,
      userDocuments,
    });
    const error = validateRequiredFieldsCompletion(
      minimumTierRequirement,
      tierConfig,
      {
        user: context?.user,
        addresses,
        userDocuments,
      },
    );
    if (userActiveTierLevel >= minimumTierRequirement) {
      setIsSkipAvailable(true);
    }

    const { setSubmitting, resetForm } = formikActions;
    if (caller === 'save') {
      setSubmitting(true);
    }

    const activeRequirementSet =
      activeTierSubRequirement ?? activeTierRequirement ?? {};

    let {
      fields = [],
      isDocumentSelectionCompleted,
      min_condition_matches,
      selectedDocuments,
    } = selectedRequirementSet;
    min_condition_matches =
      min_condition_matches ?? selectedRequirementSet?.items?.length ?? 0;
    let { isDocumentSelection } = selectedRequirementSet;

    if (selectedDocuments?.length === 0 && isDocumentSelection) {
      const uploadedFiles = activeRequirementSet?.fields?.filter(
        requirement => {
          const hasUploadedFile = userDocuments?.find(
            document => document.type.name === requirement.documentType.name,
          );

          return hasUploadedFile ? true : false;
        },
      );
      if (uploadedFiles?.length >= min_condition_matches) {
        isDocumentSelection = false;
      }
    }

    // check requirement validation and show message

    if (isDocumentSelection && !isDocumentSelectionCompleted) {
      // no need to submit any data at this point, only render selected documents upload screen
      if (selectedDocuments?.length >= min_condition_matches) {
        activeRequirementSet.isDocumentSelectionCompleted = true;
        setRefreshView(!refreshView);
      } else {
        showToast({
          variant: 'error',
          text: `Please select and provide ${min_condition_matches} options in order to proceed`,
        });
      }
    } else {
      // need to save current step's data to server
      let userResources = {};
      let documentsToUpload = [];
      let addressDataToAdd;
      fields.forEach(field => {
        switch (field.resource_type) {
          case 'user':
            userResources[field.name] = values[field.name];
            break;
          case 'document':
            if (values[field.name]) {
              documentsToUpload.push(values[field.name]);
            }
            break;
          case 'address':
            const addressData = values?.address;
            if (hasFormAddressData(addressData)) {
              addressDataToAdd = addressData;
            }
            break;
          default:
            // console.log('field.resource_type');
            break;
        }
      });

      // console.log('userResources', userResources);
      if (!isEmpty(userResources)) {
        await updateUser(userResources);
      }

      // console.log('userResources', userResources);
      if (addressDataToAdd) {
        await createAddress(addressDataToAdd);
        refetchUserAddress();
        resetForm();
      }

      // checking required documents uploaded or not
      if (isDocumentSelection && isDocumentSelectionCompleted) {
        if (selectedDocuments?.length > documentsToUpload.length) {
          setSubmitting(false);
          return;
        }
      }

      if (!isEmpty(documentsToUpload)) {
        await Promise.all(
          documentsToUpload?.map(async item => {
            return new Promise(resolve => {
              createDocumentWithType({ file: item.file, type: item.type })
                .then(resp => {
                  resolve();
                })
                .catch(error => {
                  console.log('file upload error', error);
                  resolve();
                });
            });
          }),
        );
        selectedRequirementSet.isDocumentSelectionCompleted = false;
        selectedRequirementSet.selectedDocuments = [];
        resetForm();
        refetchUserDocument();
      }
      refetchActiveTier();
      if (caller === 'save') {
        setSubmitting(false);
        return;
      }

      // at this point, either no active sub req available or no next sub req available for current req
      if (
        activeTierSubRequirement?.fields[0]?.type === 'onboarding_address' &&
        !activeTierSubRequirement?.isDocumentSelection
      ) {
        setSubmitting(false);
        validateTierAndReqCompletion(minimumTierRequirement, tierConfig, {
          user: context?.user,
          addresses,
          userDocuments,
        });
        setActiveTierSubRequirement(null);
        setActiveTierRequirement(activeTierRequirement);
        return;
      }
      if (activeTierSubRequirement) {
        let nextSubReqIndex;
        activeTierRequirement.subRequirementSets.forEach((item, index) => {
          if (item.id === activeTierSubRequirement.id) {
            if (activeTierRequirement?.subRequirementSets[index + 1]) {
              nextSubReqIndex = index + 1;
            }
          }
        });
        if (nextSubReqIndex) {
          const newActiveSubReq =
            activeTierRequirement.subRequirementSets[nextSubReqIndex];
          setActiveTierSubRequirement(newActiveSubReq);
          setSubmitting(false);
          return;
        } else {
          setSubmitting(false);
          setActiveTierSubRequirement(null);
        }
      }

      if (activeTierRequirement) {
        let nextReqIndex;
        activeTier.requirementSets.forEach((item, index) => {
          if (item.id === activeTierRequirement.id) {
            if (activeTier.requirementSets[index + 1]) {
              nextReqIndex = index + 1;
            }
          }
        });
        if (nextReqIndex) {
          const newActiveReq = activeTier.requirementSets[nextReqIndex];
          setActiveTierRequirement(newActiveReq);
          setActiveTierRequirement(newActiveReq);
          if (newActiveReq?.fields?.length > 0) {
            setActiveTierSubRequirement(null);
          } else if (
            newActiveReq.subRequirementSets &&
            newActiveReq.subRequirementSets?.length > 0
          ) {
            // setActiveTierSubRequirement(newActiveReq.subRequirementSets[0]);
          } else if (!activeTierSubRequirement) {
            setActiveTierSubRequirement(null);
          }
          setSubmitting(false);
          return; // at this point req and sub req is updated, no need to update tier
        }
      }
      // at this point, either no active req available or no next req is exist
      if (activeTier) {
        let nextTierIndex;
        tierConfig.forEach((item, index) => {
          if (item.id === activeTier.id) {
            if (tierConfig[index + 1]) {
              nextTierIndex = index + 1;
            }
          }
        });
        if (nextTierIndex) {
          const nextActiveTier = tierConfig[nextTierIndex];
          setActiveTier(nextActiveTier);
          if (
            nextActiveTier.requirementSets &&
            nextActiveTier.requirementSets.length
          ) {
            setActiveTierRequirement(nextActiveTier.requirementSets[0]);
          } else if (!activeTierRequirement) {
            setActiveTierRequirement(null);
          }
          setSubmitting(false);
          return;
        }
      }
      // at this point, either no active tier available or no next tier is exist
      setSuccessState();
    }

    setSubmitting(false);
  }

  const initialValues = useMemo(
    () => initialValueMapper(selectedRequirementSet?.fields ?? []),
    [activeTier, activeTierSubRequirement, activeTierRequirement],
  );

  const leftSidebarContent = (
    <>
      <div className={classes.leftPanel_Sections}>
        <Scrollbars autoHide rtl={document.dir === 'rtl'}>
          <OnboardingSidebar
            company={currentCompany}
            isBusinessGroup={isBusinessGroup}
            minimumTierRequirement={minimumTierRequirement}
            tierConfig={tierConfig}
            activeTier={activeTier}
            setActiveTier={setActiveTier}
            activeTierRequirement={activeTierRequirement}
            setActiveTierRequirement={setActiveTierRequirement}
            activeTierSubRequirement={activeTierSubRequirement}
            setActiveTierSubRequirement={setActiveTierSubRequirement}
            userActiveTierLevel={userActiveTierLevel}
            combinedSections={combinedSections}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            setIsUserOnboarding={setIsUserOnboarding}
          />
        </Scrollbars>
      </div>
      {!isWidget && (
        <div className={classes.leftPanel_logout}>
          {/* {isSkipAvailable && (
            <Button
              variant="text"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              style={{
                marginTop: 8,
                color: '#5336FF',
              }}
              onClick={handleSkip}
              id="go_to_wallet"
            />
          )} */}
          {/* <Button
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            style={{
              paddingTop: 0,
              color: '#5336FF',
            }}
            onClick={handleHelpClick}
            id="link_to_help_center_articles"
          /> */}
          <ButtonMui
            variant="text"
            className={classes.linkToHelp}
            endIcon={<ArrowForwardIcon />}
            style={{
              paddingTop: 0,
              color: '#7d83f4',
              fontSize: '14px',
              marginLeft: '4px',
              padding: '8px 20px 8px 20px',
              textTransform: 'initial',
            }}
            onClick={handleHelpClick}>
            {'Link to Help Center articles'}
          </ButtonMui>

          <MenuItem
            item={{ id: 'logout', label: 'logout', icon: 'exit' }}
            to="/"
            onClick={handleLogoutUser}
          />
        </div>
      )}
    </>
  );

  const renderTopRightButton = () => {
    if (!isSkipAvailable || horizontal) {
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
          color="primary"
          style={{
            fontSize: '14px',
            height: '36px',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            minWidth: 'auto',
            padding: '8px 16px'
          }}
          onClick={handleSkip}
          capitalize={true}
        >
          {getI18Translation('go_to_app')}
        </Button>
      </View>
    );
  };

  const renderMinimumTierMessage = () => {
    if (isSkipAvailable || horizontal) {
      return null;
    }
    
    return (
      <View style={{
        position: 'absolute',
        top: '32px',
        right: '32px',
        zIndex: 1000,
      }}>
        <Text
          id={'minimum_tier_to_access_app'}
          capitalize
          color="primary"
          context={{ minimumTierRequirement }}
          style={{
            backgroundColor: `${theme.palette.secondary.light}`,
            color: 'white',
            padding: '7px 15px',
            borderRadius: '17px',
            fontSize: '11.5px',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: '290px'
          }}
        />
      </View>
    );
  };

  if (loading || !activeTier) {
    return <SplashScreen company={currentCompany} noLogo />;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        // validationSchema={activeSection.validationSchema ?? {}}
        // validate={activeSection.validation}
        // sectionId={activeSection.id}
        // onSubmit={handleSubmit}
        onSubmit={onNext}>
        {formikProps => (
          <Form style={{ width: '100%' }}>
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
                  {isSkipAvailable ? (
                    <div style={{ marginLeft: 'auto', marginRight: '16px' }}>
                      <Button
                        variant={'contained'}
                        color="primary"
                        style={{
                          fontSize: '12px',
                          height: '32px',
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          minWidth: 'auto',
                          padding: '6px 12px'
                        }}
                        onClick={handleSkip}
                        capitalize={true}
                      >
                        {getI18Translation('go_to_app')}
                      </Button>
                    </div>
                  ) : (
                    <div style={{ marginLeft: 'auto', marginRight: '16px' }}>
                      <Text
                        id={'minimum_tier_to_access_app'}
                        capitalize
                        color="primary"
                        context={{ minimumTierRequirement }}
                        style={{
                          backgroundColor: `${theme.palette.secondary.light}`,
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '9px',
                          fontWeight: '500',
                          textAlign: 'center',
                          maxWidth: '100px'
                        }}
                      />
                    </div>
                  )}
                </div>
                

                <Drawer
                  anchor="left"
                  open={isMobileDrawerOpen}
                  onClose={toggleMobileDrawer}>
                  <div className={classes.leftPanel}>{leftSidebarContent}</div>
                </Drawer>
              </div>
              
              
              <Scrollbars
                style={{ 
                  width: '100%', 
                  height: '100vh'
                }}
                rtl={document.dir === 'rtl'}>
                <div className={classes.rightPanel}>
                  {renderTopRightButton()}
                  {renderMinimumTierMessage()}
                  <div className={classes.rightPanel_container}>
                    {state === 'success' && isSkipAvailable ? (
                      <OnboardingSuccess successFunction={successFunction} />
                    
                    ) : (
                      <>
                        <OnboardingSectionForm
                          onNext={onNext}
                          onSuccess={handleSubmit}
                          formikProps={formikProps}
                          context={{ ...context, refreshUser }}
                          locales={locales}
                          loading={loading}
                          error={error}
                          onPrevious={onPrevious}
                          isOnboardingComplete={isOnboardingComplete}
                          showToast={showToast}
                          activeTier={activeTier}
                          setActiveTier={setActiveTier}
                          activeTierRequirement={activeTierRequirement}
                          activeTierSubRequirement={activeTierSubRequirement}
                          selectedRequirementSet={selectedRequirementSet}
                          setActiveTierRequirement={setActiveTierRequirement}
                          setActiveTierSubRequirement={
                            setActiveTierSubRequirement
                          }
                          minimumTierRequirement={minimumTierRequirement}
                          tierConfig={tierConfig}
                          addresses={addresses}
                          userDocuments={userDocuments}
                          userActiveTierLevel={userActiveTierLevel}
                        />
                      </>
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
    </>
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
  navbarMobile: {
    paddingTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
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
    marginTop: '70px',
    maxWidth: '525px',
    margin: 'auto',
    [theme.breakpoints.down(950)]: {
      marginTop: '24px',
    },
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
  linkToHelp: {
    backgroundColor: 'transparent',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#fafafa',
      // color: '#7D83F4 !important',
      borderRadius: 20,
      padding: '8px 20px 8px 20px',
    },
  },
}));
