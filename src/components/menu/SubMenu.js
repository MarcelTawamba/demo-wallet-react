import React from 'react';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';

const SubMenu = ({ children, open }) => {
  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {children}
      </List>
    </Collapse>
  );
};

export default SubMenu;
