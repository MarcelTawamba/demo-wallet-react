import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { SimpleImg } from 'react-simple-img';

import Logo from 'components/rehive/Logo';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { ButtonBase, Popover } from '@material-ui/core';
import Text from 'components/outputs/Text';
import CurrentSessions from 'components/app/CurrentSessions';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { configAuthSelector } from 'redux/rehive/selectors';
import { currentSessionsSelector } from 'redux/auth/selectors';
import PageContent from 'components/layout/page/PageContent';
import Icon from 'components/outputs/NewIcon';

export default function LoginSelector(props) {
  const { company, hideAdd, isAuth } = props;
  const classes = useStyles();
  let { config: client } = useConfiguration();

  const [anchorEl, setAnchorEl] = useState(null);
  const authConfig = useSelector(configAuthSelector);
  const currentSessions = useSelector(currentSessionsSelector);
  if (!company) {
    return null;
  }

  const showCompany = !Boolean(client.company);

  const { name, icon, id, logo, mode = '' } = company;
  const { sessions = true } = authConfig;
  const { items, user } = currentSessions;
  const noSessions = isEmpty(items);
  const hideSessions = Boolean(client.company && !sessions);
  const hideApps = Boolean(client.company);
  function handleClick(event, index) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const disabled = true; // noSessions && isAuth && Boolean(hideAdd || client.company);

  return (
    <PageContent>
      <ButtonBase
        disabled={disabled}
        variant={'text'}
        onClick={handleClick}
        className={classes.button}>
        <div className={classes.container}>
          <div className={classes.profile}>
            {user?.profile ? (
              <SimpleImg
                height={48}
                width={48}
                imgStyle={{
                  borderRadius: 30,
                  objectFit: 'cover',
                }}
                // placeholder={<Icon icon={'profile'} size={20} />}
                src={user?.profile}
              />
            ) : (
              <Icon icon={'profile'} size={24} />
            )}
          </div>
          {/* <Text className={classes.companyName} bold width="auto">
            {showCompany
              ? (name ? name : id ? id : '') + (user ? ': ' : '')
              : ''}
          </Text> */}
          <Text className={classes.companyName} align="left">
            {user?.email}
          </Text>
          {!disabled && <KeyboardArrowDownIcon style={{ fontSize: 12 }} />}
        </div>
      </ButtonBase>
      {/* </Tooltip> */}
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handleClose}
        style={{
          // margin: 8,
          left: -10,
          top: -10,
        }}
        PaperProps={{
          style: {
            maxWidth: 236,
            width: '100%',
          },
        }}>
        <CurrentSessions
          hideSessions={hideSessions}
          hideApps={hideApps}
          companyOveride={client.company ? client.company : company}
          isAuth={isAuth}
          onClose={handleClose}
          hideAdd={hideAdd}
        />
      </Popover>
    </PageContent>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
  },
  profile: {
    borderRadius: 100,
    overflow: 'hidden',
    height: 48,
    maxWidth: 48,
    minWidth: 48,
    width: '100%',
  },
  button: {
    width: '100%',
    border: '1px solid #EFEFEF',
    borderRadius: 15,
  },
  companyName: {
    paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
  },
  test: {
    width: '100%',
    minHeight: 24,
    padding: theme.spacing(0.25),
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}));
