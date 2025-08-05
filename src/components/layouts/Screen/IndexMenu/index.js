import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { makeStyles, useTheme as UI_useTheme } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import IconButton from 'components/inputs/IconButton';
import Menu from './Menu';
import Content from './Content';
import { objectToArray } from 'util/general';
import ProfileHelpModal from 'components/outputs/ProfileHelpModal';

export default function IndexMenu(props) {
  const { screenConfig, history, screenId, context } = props;
  const { titleId, title, pages, defaultPage, menu, banner } = screenConfig;

  const [helpModalVisible, setHelpModalVisible] = useState(false);

  const theme = UI_useTheme();
  const isRtl = theme.direction === 'rtl';
  const classes = useStyles();

  const sections = menu?.sections ?? objectToArray(pages, 'id'); // TODO: this can be replaced with one config
  const pageId = props?.pageId ?? defaultPage ?? '';
  const section = pages?.[pageId];

  function setPage(page) {
    if (page === defaultPage) {
      page = '';
    }
    history.push('/' + screenId + '/' + (page ? page + '/' : ''));
  }

  const menuProps = {
    pages,
    sections,
    pageId,
    setPage,
    context,
    config: menu,
    banner,
  };
  const contentProps = { pages, section, context, ...props };

  const showHelp = Boolean(section?.components?.verify);

  return (
    <div className={classes.form}>
      <div className={classes.root}>
        <div className={classes.leftPanel}>
          {title && (
            <div className={classes.navbar}>
              <Text
                variant="h6"
                style={{ fontSize: 20 }}
                id={titleId || title}
              />
            </div>
          )}

          <div className={classes.leftPanel_Sections}>
            <Menu {...menuProps} />
          </div>
        </div>
        <Scrollbars style={{ width: '100%' }} autoHide rtl={isRtl}>
          <div className={classes.rightPanel}>
            <div className={classes.rightPanel_container}>
              {showHelp && (
                <div
                  style={{
                    position: 'absolute',
                    [isRtl ? 'left' : 'right']: 0,
                  }}>
                  <IconButton
                    icon={'help-outline'}
                    inverted
                    color={'black'}
                    onPress={() => setHelpModalVisible(true)}
                  />
                </div>
              )}
              <Content
                {...contentProps}
                noStyle={section?.variant !== 'form'}
              />
            </div>
          </div>
        </Scrollbars>
      </div>
      <Modal
        close
        title="profile_help"
        maxWidth={415}
        open={helpModalVisible}
        onDismiss={() => setHelpModalVisible(false)}>
        <ProfileHelpModal id={pageId} />
      </Modal>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(0),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflow: 'hidden',
    flexDirection: 'row',
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
      paddingLeft: 0,
    },
    [theme.breakpoints.down(670)]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      padding: 0,
    },
  },
  form: {
    width: '100%',
    backgroundColor: '#F4F4F4',
    display: 'flex',
  },
  navbar: {
    display: 'flex',
    flexDirection: 'row',
    // [theme.breakpoints.down(480)]: {
    //   paddingTop: theme.spacing(1),
    // },
  },
  leftPanel: {
    minWidth: '250px',
    overflow: 'hidden',
    [theme.breakpoints.down(950)]: {
      minHeight: 135,
      marginBottom: theme.spacing(4),
    },
    [theme.breakpoints.down(738)]: {
      minHeight: 'unset',
    },
    [theme.breakpoints.down(670)]: {
      marginBottom: theme.spacing(1),
    },
  },
  leftPanel_Sections: {
    width: '100%',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down(950)]: {
      marginTop: theme.spacing(1),
    },
  },
  rightPanel: {
    [theme.breakpoints.down(738)]: {
      paddingTop: theme.spacing(2),
    },
    [theme.breakpoints.down(480)]: {
      paddingTop: theme.spacing(2),
      padding: theme.spacing(1),
    },
  },
  rightPanel_container: {
    maxWidth: '525px',
    margin: 'auto',
  },
  skip: {
    width: '100%',
    [theme.breakpoints.down(950)]: {
      marginTop: 0,
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down(480)]: {
      paddingRight: theme.spacing(1),
    },
  },
  skip_text: {
    [theme.breakpoints.down(480)]: {
      fontSize: '14px',
    },
  },
}));
