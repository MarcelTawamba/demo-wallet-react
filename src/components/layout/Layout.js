import React from 'react';
import './Layout.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import ResponsiveDrawer from './Drawer';
import Hidden from '@material-ui/core/Hidden';
import { View } from './View';

const styles = theme => ({
  container: {
    width: '100%',
    maxWidth: 'xl',
    // margin: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // height: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  center: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    // flex: 1,
    height: '100%',
    // flexGrow: 1,
  },
  children: {
    display: 'flex', // Fix IE 11 issue.
    height: '100%',
  },
  left: {
    marginTop: theme.spacing(1),
    width: 180,
  },
  detail: {
    marginTop: theme.spacing(1),
    width: 350,
    // height: 200,
  },
  right: {
    minWidth: 200,
    maxWidth: 250,
  },
  paper: {
    marginTop: theme.spacing(2),
    // margin:
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 3, 3),
    width: '100%', // Fix IE 11 issue.
  },
  menu: {
    // padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme
    //   .spacing.unit * 3}px`,
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
});

const Layout = props => {
  const {
    type,
    children,
    menu,
    center,
    right,
    centerWidth,
    drawer,
    content,
    header,
    detail,
    classes,
  } = props;

  if (drawer) {
    return (
      <ResponsiveDrawer menu={menu}>
        {content ? content : children}
      </ResponsiveDrawer>
    );
  }

  if (detail) {
    return (
      <View fD={'row'}>
        <Hidden mdDown>
          {detail && <div className={classes.detail}>{detail}</div>}
        </Hidden>

        <div className={classes.center}>{content}</div>
        {right && <div className={classes.right}>{right}</div>}
      </View>
    );
  }

  if (children) {
    return (
      <div className={classes.children}>
        <Paper className={classes.paper}>{children}</Paper>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {/* {menu && <div className={classes.left}>{menu}</div>} */}
      <div className={classes.center}>{content}</div>
      {right && <div className={classes.right}>{right}</div>}
    </div>
  );
};

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Layout);
