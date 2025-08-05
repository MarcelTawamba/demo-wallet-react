import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Logo from 'components/rehive/Logo';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ButtonBase, Popover } from '@material-ui/core';
import Text from 'components/outputs/Text';
import CurrentSessions from 'components/app/CurrentSessions';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { configAuthSelector } from 'redux/rehive/selectors';
import { currentSessionsSelector } from 'redux/auth/selectors';

const CurrentSessionsSelector = props => {
  const { company, hideAdd, isAuth } = props;
  const classes = useStyles();
  let { config: client } = useConfiguration();

  const [anchorEl, setAnchorEl] = useState(null);
  const authConfig = useSelector(configAuthSelector);
  const currentSessions = useSelector(currentSessionsSelector);
  if (!company) {
    return null;
  }

  const { name, icon, id, logo, mode = '' } = company;
  const { sessions = true } = authConfig;
  const { items } = currentSessions;
  const noSessions = isEmpty(items);
  const hideSessions = Boolean(client.company && !sessions);
  const hideApps = Boolean(client.company);
  function handleClick(event, index) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const disabled = noSessions && isAuth && Boolean(hideAdd || client.company);

  return (
    <React.Fragment>
      <ButtonBase
        disabled={disabled}
        variant={'text'}
        onClick={handleClick}
        className={classes.button}>
        <div className={classes.container}>
          <Logo
            image={icon ? icon : logo}
            height={40}
            width={40}
            type={'rehive-icon'}
          />
          <Text
            id={name || id ? '' : 'switch_session'}
            width="auto"
            className={classes.companyName}
            variant={'body1'}>
            {name ? name : id ? id : ''}
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
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(1),

    // marginBottom: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
  },
  button: {
    height: 56,
    width: '100%',
  },
  companyName: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
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

export default CurrentSessionsSelector;
