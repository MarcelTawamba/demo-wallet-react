import React from 'react';
// import './AppHeader.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import { View } from './View';

const styles = theme => ({
  layout: {
    width: '80.5%',
    marginLeft: theme.spacing(10),
    marginRight: theme.spacing(10),
    [theme.breakpoints.up(1100 + theme.spacing(6))]: {
      width: 1100,
      // width: '80.5%',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 10 * theme.spacing(1),
    },
    maxWidth: 10 * theme.spacing(1),
    backgroundColor: 'white',
  },
});

const Header = ({ children, classes }) => {
  return (
    <AppBar position="sticky" color="inherit">
      <div styles={classes.layout}>
        <Toolbar>{children}</Toolbar>
        {/* <View h={24} w={'100%'} aI={'center'}>
          Hello world
        </View> */}
      </div>
    </AppBar>
  );
};

export default withStyles(styles)(Header);

// <div style={{backgroundColor: 'white'}}>
