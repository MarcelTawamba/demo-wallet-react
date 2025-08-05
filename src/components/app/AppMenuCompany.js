import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import { ButtonBase, Popover } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ToggleIcon from 'material-ui-toggle-icon';

import Logo from 'components/rehive/Logo';
import Text from 'components/outputs/Text';
import CurrentSessions from 'components/app/CurrentSessions';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { useAuthConfig } from 'hooks/useAppConfig';
import { Button } from 'components/inputs/Button';
import { standardizeString } from 'util/general';

const AppMenuCompany = ({ company }) => {
  const { name, icon, id, logo, mode = '' } = company;
  const classes = useStyles();
  let { config: client } = useConfiguration();

  const [anchorEl, setAnchorEl] = useState(null);
  const { data: authConfig } = useAuthConfig();
  const { sessions = true } = authConfig || {};
  const hideSessions = Boolean(client.company && !sessions);
  const hideApps = Boolean(client.company);

  // const [open, setOpen] = useState(true);
  function handleClick(event, index) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const iconSize = 40;

  const Component = (
    <div className={classes.row}>
      <div className={classes.row2}>
        <Logo
          image={icon ? icon : logo}
          height={iconSize}
          width={iconSize}
          type={'rehive-icon'}
          noMargin
        />
        {!hideSessions && (
          <Text className={classes.companyName} variant={'body1'}>
            {name ? name : standardizeString(company?.id)}
          </Text>
        )}
      </div>
      <ToggleIcon
        on={!Boolean(anchorEl)}
        onIcon={<ArrowDropDownIcon fontSize="small" />}
        offIcon={<ArrowDropUpIcon fontSize="small" />}
      />
    </div>
  );

  return (
    <div className={classes.container}>
      <Button
        disabled={hideSessions}
        variant="text"
        onPress={handleClick}
        wide
        noPadding>
        {Component}
      </Button>
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
          left: -8,
          top: 0,
        }}
        PaperProps={{
          style: {
            maxWidth: 244,
            width: '100%',
          },
        }}>
        <CurrentSessions hideSessions={hideSessions} hideApps={hideApps} />
      </Popover>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  // container: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   width: '100%',
  //   padding: theme.spacing(1),
  // },
  button: {
    height: 50,
    width: '100%',
  },
  companyName: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    whiteSpace: 'normal',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    // width: '222',
    // width: 210,
  },
  row2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    // padding: theme.spacing(1),
    //  paddingLeft: theme.spacing(2)
    width: '100%',
  },
}));

export default AppMenuCompany;
