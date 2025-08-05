import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Button } from 'components/inputs/Button';
import IconButton from 'components/inputs/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Text from 'components/outputs/Text';
import { useLanguage } from 'components/contexts/LanguageContext';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    backgroundColor: props => props?.backgroundColor ?? 'white',
    maxWidth: props => (props.maxWidth ? props.maxWidth : 800),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      // margin: theme.spacing(2),
      maxWidth: 500,
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      maxWidth: 650,
    },
    borderRadius: ({ borderRadius = 11 }) => borderRadius,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    position: 'relative',
    marginTop: theme.spacing(2),
  },
  close: {
    position: 'absolute',
    right: 0,
    top: 3,
  },
  container: {
    paddingTop: ({ hasPaddingTop }) => theme.spacing(hasPaddingTop ? 3 : 0),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

const Modal = props => {
  let {
    title,
    titleCentered,
    altStyle,
    contentText,
    children,
    actionOne,
    actionTwo,
    content,
    loading,
    onDismiss,
    close,
    contentId,
    disableBackdropClick,
    hasPaddingTop,
    hideTitle,
    removePadding,
    ...other
  } = props;

  function handleClose(event, reason) {
    if (disableBackdropClick && reason === 'backdropClick') return;
    (props.onClose ?? onDismiss ?? (() => {}))();
  }

  const classes = useStyles(props);
  const { lang } = useLanguage();
  if (contentId && !contentText) {
    contentText = lang?.[contentId] ?? '';
  }

  return other.open ? (
    <Dialog
      onClose={handleClose}
      classes={{ paper: classes.paper }}
      // aria-labelledby="simple-dialog-title"
      {...other}>
      <div className={removePadding ? '' : classes.container}>
        {(title || close) && (
          <div className={hideTitle ? '' : classes.title}>
            <Text
              id={title}
              style={{ fontSize: 18, fontWeight: altStyle ? '500' : 'auto' }}
              myColor="#222222"
              align={titleCentered ? 'center' : 'left'}
            />

            {close && (
              <div className={classes.close}>
                <IconButton onPress={() => onDismiss()} noPadding>
                  <CloseIcon style={{ color: '#222', fontSize: 22 }} />
                </IconButton>
              </div>
            )}
          </div>
        )}

        <div>
          {(contentText || content) && (
            <DialogContent>
              {contentText && (
                <Text align="center" style={{ fontSize: 14 }}>
                  {contentText}
                </Text>
              )}
              {content}
            </DialogContent>
          )}
          {children}
        </div>

        {((actionOne && actionOne.label) || (actionTwo && actionTwo.label)) && (
          <DialogActions style={{ padding: 0 }}>
            {actionTwo && actionTwo.label && (
              <Button
                onClick={actionTwo.action}
                color="secondary"
                variant={'text'}>
                {actionTwo.label}
              </Button>
            )}
            {actionOne && actionOne.label && (
              <Button
                loading={loading}
                disabled={loading}
                onClick={actionOne.action}
                color="primary"
                autoFocus
                variant={'text'}>
                {actionOne.label}
              </Button>
            )}
          </DialogActions>
        )}
      </div>
    </Dialog>
  ) : null;
};

Modal.propTypes = {
  onClose: PropTypes.func,
  contextText: PropTypes.string,
};

export default Modal;
