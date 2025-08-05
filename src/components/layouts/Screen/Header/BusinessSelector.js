import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, List, ListItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ToggleIcon from 'material-ui-toggle-icon';
import UserAvatar from './UserAvatar';
import { useBusiness } from 'contexts';
import SimpleButton from 'components/inputs/SimpleButton';

const width = 200;

export default function BusinessSelector(props) {
  const classes = useStyles(props);
  const { handleProfileRedirect } = props ?? {};
  const { business, businesses, loading, setBusinessId } = useBusiness();

  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event, index) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  if (businesses.length === 1) {
    return (
      <div className={classes.row} onClick={handleProfileRedirect}>
        <UserAvatar
          context={{ business }}
          loading={loading}
          imageSize={32}
          marginLeft={'-3px'}
        />
      </div>
    );
  }

  return (
    <div>
      <SimpleButton onClick={handleClick}>
        <div className={classes.row}>
          <UserAvatar context={{ business }} loading={loading} imageSize={32} />
          <ToggleIcon
            on={Boolean(anchorEl)}
            offIcon={<ArrowDropDownIcon fontSize="small" />}
            onIcon={<ArrowDropUpIcon fontSize="small" />}
          />
        </div>
      </SimpleButton>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxWidth: width,
            width: '100%',
            zIndex: 10000,
            backgroundColor: 'white',
          },
        }}>
        <List style={{ width: '100%' }}>
          {businesses?.map(item => (
            <BusinessListItem
              key={item?.id}
              item={item}
              selected={item?.id === business?.id}
              setBusinessId={setBusinessId}
              handleClose={handleClose}
            />
          ))}
        </List>
      </Popover>
    </div>
  );
}

function BusinessListItem(props) {
  const { item, selected, setBusinessId, handleClose } = props;

  function handleClick() {
    setBusinessId(item?.id);
    handleClose();
  }
  return (
    <ListItem selected={selected} button dense onClick={handleClick}>
      <UserAvatar context={{ business: item }} />
    </ListItem>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.primary.main,
      borderRadius: 20,
      transition: 'background-color 0.3s ease, color 0.3s ease',
    },
  },
}));
