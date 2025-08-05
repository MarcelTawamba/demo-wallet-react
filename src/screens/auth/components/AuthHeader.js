import React from 'react';
import { isEmpty } from 'lodash';
import makeStyles from '@material-ui/styles/makeStyles';

import IconColor from 'components/rehive/IconColor';
import Logo from 'components/rehive/Logo';
import {
  COMPANY,
  PRE_AUTH_SLIDES,
  POST_AUTH_SLIDES,
  AUTH_SUCCESS,
  EMAIL_VERIFY,
  MOBILE_VERIFY,
  MFA_VERIFY,
  MFA_SET,
  DISCLAIMER,
} from '../config/authMachine';
import CurrentSessionsSelector from 'components/app/CurrentSessionsSelector';
import IconButton from 'components/inputs/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useSelector } from 'react-redux';
import { currentSessionsSelector } from 'redux/auth/selectors';

export default function AuthHeader(props) {
  let { formState, loading, onAbout, company = {} } = props;

  const classes = useStyles();
  const height = 70;
  const width = 70;
  const imageProps = { height, width, onAbout };
  const { items: currentSessions } = useSelector(currentSessionsSelector);
  const noSessions = isEmpty(currentSessions) && formState === COMPANY;

  if (loading) return null;
  if (!company) company = {};

  const { website, icon, logo } = company;

  if ([PRE_AUTH_SLIDES, POST_AUTH_SLIDES, AUTH_SUCCESS].includes(formState)) {
    return null;
  }

  const isPostAuth = [
    EMAIL_VERIFY,
    MOBILE_VERIFY,
    MFA_VERIFY,
    MFA_SET,
    DISCLAIMER,
  ].includes(formState);

  return (
    <React.Fragment>
      {!(isPostAuth || noSessions) && (
        <div className={classes.sessionWrapper}>
          <CurrentSessionsSelector
            isAuth
            onAbout={onAbout}
            company={company}
            hideAdd={formState === COMPANY}
          />
          {onAbout && (
            <IconButton onClick={onAbout}>
              <InfoOutlinedIcon />
            </IconButton>
          )}
        </div>
      )}

      {formState === COMPANY ? (
        <IconColor {...imageProps} type={'rehive-icon'} />
      ) : formState !== COMPANY && (icon || logo) ? (
        <Logo {...imageProps} link={website} image={icon ? icon : logo} />
      ) : (
        <Logo {...imageProps} type={'rehive-icon'} />
      )}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  text: {
    fontSize: 14,
  },
  sessionWrapper: {
    border: '1px solid #EFEFEF',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    position: 'absolute',
    backgroundColor: 'white',
    top: 8,
    left: theme.direction === 'rtl' ? 24 : 8,
    // right: theme.direction === 'rtl' ? 24 : 'unset',
    paddingRight: 8,
  },
}));
