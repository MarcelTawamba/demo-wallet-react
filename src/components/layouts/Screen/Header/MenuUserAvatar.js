import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Popover, List } from '@material-ui/core';
import { authUserSelector } from 'redux/auth/selectors';
import { Button } from 'components/inputs/Button';
import MenuItem from 'components/menu/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ToggleIcon from 'material-ui-toggle-icon';
import { configAppSelector } from 'redux/rehive/selectors';
import UserAvatar from './UserAvatar';

export default function MenuUserAvatar(props) {
  const classes = useStyles(props);
  let { menuProps = {}, logoutUser } = props;
  const user = useSelector(authUserSelector);
  const [anchorEl, setAnchorEl] = useState(null);
  const appConfig = useSelector(configAppSelector);
  const hide = appConfig?.menu?.hide ?? [];
  const hideGroup = hide?.includes('group');

  function handleClick(event, index) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  menuProps.closeDrawer = () => setAnchorEl(null);

  const Component = (
    <div className={classes.row}>
      <UserAvatar context={{ user, business: menuProps?.business }} />
      <ToggleIcon
        on={Boolean(anchorEl)}
        onIcon={<ArrowDropDownIcon fontSize="small" />}
        offIcon={<ArrowDropUpIcon fontSize="small" />}
      />
    </div>
  );

  return (
    <div>
      <Button variant="text" onPress={handleClick} noPadding>
        {Component}
      </Button>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClose={handleClose}
        style={{
          left: -8,
          top: -8,
        }}
        PaperProps={{
          style: {
            maxWidth: 246,
            width: '100%',
          },
        }}>
        <List component="nav" style={{ width: '100%' }}>
          <MenuItem simple item={{ id: 'profile' }} {...menuProps} />
          <MenuItem simple item={{ id: 'settings' }} {...menuProps} />
          <MenuItem
            simple
            item={{ id: 'logout', icon: 'exit' }}
            to="/"
            onClick={logoutUser}
          />
        </List>
      </Popover>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 210,
  },
  row2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 148,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
}));
