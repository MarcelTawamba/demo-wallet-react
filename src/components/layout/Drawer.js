import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import ButtonBase from '@material-ui/core/ButtonBase';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import NoSsr from '@material-ui/core/NoSsr';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Toolbar, Typography } from '@material-ui/core';
import { standardizeString } from 'util/general';
import {
  configOnboardingSelector,
  userProfileSelector,
} from 'redux/rehive/selectors';
import CompanyStatusBanner from 'components/app/CompanyStatusBanner';
import Toast from 'components/outputs/Toast';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { intersection } from 'lodash';
// import HideOnScroll from './HideOnScroll';
export const BannerContext = React.createContext({
  displayTestBanner: false,
  displayOnboardingBanner: false,
});

const drawerWidth = 260;
const breakpoint = 'md';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100hh',
  },
  drawer: {
    [theme.breakpoints.up(breakpoint)]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    backgroundColor: '#FFFFFF',
  },
  menuButton: {
    zIndex: 100,
    [theme.breakpoints.up(breakpoint)]: {
      display: 'none',
    },
  },
  menuButtonFixed: {
    position: 'fixed',
    zIndex: 1000,
    backgroundColor: 'white',
    margin: '0.25rem',
    [theme.breakpoints.up(breakpoint)]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    borderRight: '1px solid #EFEFEF',
    [theme.breakpoints.down(560)]: {
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: ({ offWhite }) => (offWhite ? '#F4F4F4' : 'white'),
    minHeight: '100vh',
    position: 'relative',
    [theme.breakpoints.down(736)]: {
      minHeight: ({ displayTestBanner, displayOnboardingBanner }) =>
        `calc(calc(var(--vh, 1vh) * 100) - ${
          48 + (displayTestBanner ? 48 : 0) + (displayOnboardingBanner ? 48 : 0)
        }px)`,
    },
    [theme.breakpoints.down(550)]: {
      minHeight: ({ displayTestBanner, displayOnboardingBanner }) =>
        `calc(calc(var(--vh, 1vh) * 100) - ${
          48 + (displayTestBanner ? 72 : 0) + (displayOnboardingBanner ? 48 : 0)
        }px)`,
    },
  },
  innerContent: {
    maxWidth: ({ fullScreen }) => (fullScreen ? 'unset' : '1367px'),
    margin: 'auto',
    padding: ({ fitScreen }) => (fitScreen ? 0 : theme.spacing(4)),
    paddingBottom: '0 !important',
    paddingTop: ({ displayTestBanner, displayOnboardingBanner, fitScreen }) =>
      fitScreen
        ? 0
        : theme.spacing(displayTestBanner || displayOnboardingBanner ? 4 : 6) +
          (displayTestBanner ? 48 : 0) +
          (displayOnboardingBanner ? 48 : 0),
    minHeight: '100vh',
    display: 'flex',
    [theme.breakpoints.down(736)]: {
      paddingTop: ({ fitScreen }) =>
        fitScreen ? 0 : `${theme.spacing(2)}px !important`,
      paddingBottom: 0,
      padding: theme.spacing(2),
      minHeight: ({ displayTestBanner, displayOnboardingBanner }) =>
        `calc(100vh - ${
          48 + (displayTestBanner ? 48 : 0) + (displayOnboardingBanner ? 48 : 0)
        }px)`,
    },
    [theme.breakpoints.down(550)]: {
      padding: `${theme.spacing(1)}px !important`,
      paddingBottom: 0,
      // paddingBottom: theme.spacing(3),
      minHeight: ({ displayTestBanner, displayOnboardingBanner }) =>
        `calc(calc(var(--vh, 1vh) * 100) - ${
          48 + (displayTestBanner ? 72 : 0) + (displayOnboardingBanner ? 48 : 0)
        }px)`,
    },
  },
  innerContentMargin: {
    // marginBottom: ({ fitScreen }) => (fitScreen ? 0 : theme.spacing(4)),
    display: 'flex',
    flexGrow: 1,
    width: '100%',
  },
  appBar: {
    // color: theme.palette.primary,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    // zIndex: 10000,
    // elevation: 1,
  },
}));

const StyledButtonBase = withStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px',
    '&.mobile': {
      height: '48px',
      width: '48px',
    },
    '&.desktop': {
      height: '40px',
      width: '40px',
    },
  },
}))(ButtonBase);

const MenuButton = forwardRef((props, ref) => {
  const { className, size, ...other } = props;
  return (
    <NoSsr>
      <StyledButtonBase
        ref={ref}
        className={`${className} ${size === 'small' ? 'desktop' : 'mobile'}`}
        aria-label="Menu"
        centerRipple
        {...other}>
        <MenuIcon color="primary" />
      </StyledButtonBase>
    </NoSsr>
  );
});

const StyledToolbar = withStyles({})(Toolbar);
const StyledAppBar = withStyles({})(AppBar);

const MobileHeader = forwardRef((props, ref) => {
  const { company, drawerOpenToggle, classes, title } = props;
  return (
    <div ref={ref}>
      <CompanyStatusBanner company={company} />
      <NoSsr>
        <StyledAppBar elevation={0} position="static" className={classes.appBar}>
          <StyledToolbar disableGutters>
            <MenuButton
              onClick={drawerOpenToggle}
              className={classes.menuButton}
            />
            <Typography variant="h6" className={classes.title} color="primary">
              {standardizeString(title ? title : 'Accounts')}
            </Typography>
          </StyledToolbar>
        </StyledAppBar>
      </NoSsr>
    </div>
  );
});

const DesktopHeader = forwardRef((props, ref) => {
  const { company } = props;
  return (
    <div ref={ref}>
      <CompanyStatusBanner company={company} />
      <Toast />
    </div>
  );
});

const DrawerContent = forwardRef((props, ref) => {
  const { container, variant = "permanent", open, onClose, classes, menu } = props;
  return (
    <NoSsr>
      <Drawer
        container={container}
        variant={variant}
        anchor="left"
        open={open}
        onClose={onClose}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}>
        <Scrollbars
          rtl={false}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}>
          {menu}
        </Scrollbars>
      </Drawer>
    </NoSsr>
  );
});

export default function ResponsiveDrawer(props) {
  const { theme, menu, children, drawerHook, pathname, company } = props;

  const profile = useSelector(userProfileSelector);

  const onboardingConfig = useSelector(configOnboardingSelector);

  const hideOnboardingBanner = Boolean(
    intersection(onboardingConfig?.hideApp ?? [], profile?.items?.groups ?? [])
      ?.length,
  );

  const displayTestBanner = company?.mode?.match(/test|suspended/);
  const [drawerOpen, setDrawerOpen] = drawerHook;
  const drawerOpenToggle = () => setDrawerOpen(!drawerOpen);

  const offWhiteScreens = [
    // '/products/checkout/',
    '/help/',
    '/business/',
    '/profile',
    '/home',
    '/settings',
  ];
  const fullScreens = [];
  const fitScreens = [];

  const paths = pathname.split('/');
  const title = paths[1];

  const classes = useStyles({
    displayTestBanner,
    // displayOnboardingBanner,
    offWhite:
      offWhiteScreens.find(x => pathname.includes(x)) || pathname === '/',
    fullScreen: fullScreens.find(x => pathname.includes(x)),
    fitScreen: fitScreens.find(x => pathname.includes(x)),
  });

  return (
    <React.Fragment>
      <Hidden smUp implementation="css">
        <MobileHeader
          company={company}
          drawerOpenToggle={drawerOpenToggle}
          classes={classes}
          title={title}
        />
      </Hidden>

      <Hidden xsDown implementation="css">
        <NoSsr>
          <MenuButton
            size="small"
            onClick={drawerOpenToggle}
            className={classes.menuButtonFixed}
          />
        </NoSsr>
      </Hidden>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <nav className={classes.drawer}>
          <Hidden mdUp implementation="css">
            <DrawerContent
              container={props.container}
              variant="temporary"
              open={drawerOpen}
              onClose={drawerOpenToggle}
              classes={classes}
              menu={menu}
            />
          </Hidden>

          <Hidden smDown implementation="css">
            <DrawerContent
              classes={classes}
              open
              menu={menu}
            />
          </Hidden>
        </nav>

        <div className={classes.content}>
          <div style={{ position: 'absolute', width: '100%' }}>
            <Hidden xsDown implementation="css">
              <DesktopHeader company={company} />
            </Hidden>
          </div>
          <BannerContext.Provider value={{ displayTestBanner }}>
            <Scrollbars rtl={document.dir === 'rtl'}>
              <div className={classes.innerContent}>
                <div className={classes.innerContentMargin}>{children}</div>
              </div>
            </Scrollbars>
          </BannerContext.Provider>
        </div>
      </div>
    </React.Fragment>
  );
}
