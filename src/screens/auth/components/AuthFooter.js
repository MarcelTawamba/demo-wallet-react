import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import {
  COMPANY,
  LANDING,
  LOGIN,
  REGISTER,
  FORGOT,
  MFA_VERIFY,
  EMAIL_VERIFY,
  MOBILE_VERIFY,
  DISCLAIMER,
  ABOUT,
  GROUP,
  PRE_AUTH_SLIDES,
  POST_AUTH_SLIDES,
  SELLER,
  BACK,
} from '../config/authMachine';
import { removeTempCompany } from 'redux/auth/actions';
import { useDispatch, useSelector } from 'react-redux';
import { currentSessionsSelector } from 'redux/auth/selectors';

const AuthFooter = props => {
  const {
    companies,
    formState,
    loading,
    send,
    onAbout,
    onBack,
    setCompanyID,
  } = props;
  const dispatch = useDispatch();
  const currentSessions = useSelector(currentSessionsSelector);
  const {
    currentCompany,
    currentCompanyID,
    tempCompany,
    tempCompanyID,
  } = companies;
  let { config: client } = useConfiguration();

  if (loading) {
    return null;
  }

  const tempCompanyName =
    tempCompany && tempCompany.name ? tempCompany.name : tempCompanyID;

  const currentCompanyName = 
    currentCompany && currentCompany.name ? currentCompany.name : currentCompanyID;

  function handleCompany() {
    dispatch(removeTempCompany());
    // setCompanyID('');
    send(COMPANY);
  }

  switch (formState) {
    case COMPANY:
      return (
        <View p={1} aI={'center'}>
          <Text variant={'body2'} align={'center'} id="project_start_message" />
          <Button
            rel="noopener noreferrer"
            target="_blank"
            href={'https://dashboard.rehive.com/#/register'}
            p={0.25}
            variant={'text'}>
            <Text variant={'body2'} align={'center'} id="create_new_wallet" />
          </Button>
        </View>
      );
    case LANDING:
    case ABOUT:
    case PRE_AUTH_SLIDES:
    case DISCLAIMER:
    case LOGIN:
    case GROUP:
    case REGISTER:
    case FORGOT:
    case SELLER:
      if (client.company) {
        return null;
      }
      return (
        <View pt={1} aI={'center'}>
          <View pb={0.5} jC={'center'} fD="row">
            <div style={{ marginTop: -1 }}>
              <Text variant="body2" align="center" id="using_subtitle" />
            </div>
            {formState !== ABOUT && (
              <Button
                noPadding
                onClick={() => onAbout()}
                variant={'link'}
                wrapperStyle={{ margin: 0, padding: 0 }}>
                <Text
                  id="about_link"
                  variant={'body2'}
                  color="primary"
                  style={{ marginLeft: 8, whiteSpace: 'nowrap' }}
                />
              </Button>
            )}
          </View>
          {currentCompanyName && tempCompanyName && currentSessions.user && currentSessions.token && (
            <View pv={0.5} aI={'center'}>
              <Text
                id="logged_in_note"
                context={{ companyName: currentCompanyName }}
                variant={'body2'}
                inline
              />
              <Button
                p={0.25}
                onClick={() => props.history.push('/')}
                variant={'link'}>
                <div>
                  <Text
                    id="return_to"
                    variant={'body2'}
                    align={'center'}
                    inline
                  />{' '}
                  <Text variant={'body2'} align={'center'} inline>
                    <b>{currentCompanyName}</b>
                  </Text>
                </div>
              </Button>
            </View>
          )}
          <Button noPadding onClick={handleCompany} variant={'link'}>
            <Text
              id={
                tempCompanyName && currentCompanyName
                  ? 'switch_app'
                  : 'switch_app'
              }
              variant={'body2'}
              align={'center'}
              color="primary"
            />
          </Button>
        </View>
      );
    case MFA_VERIFY:
    case EMAIL_VERIFY:
    case MOBILE_VERIFY:
    case POST_AUTH_SLIDES:
      return (
        <View aI={'center'}>
          <Button noPadding onClick={() => send(BACK)} variant={'link'}>
            <Text id="switch_account" variant={'body2'} align={'center'} />
          </Button>
        </View>
      );

    default:
      return <div />;
  }
};

export default AuthFooter;
