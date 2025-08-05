import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { View } from 'components/layout/View';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import en from 'config/locales/en';
import { standardizeString } from 'util/general';
import { useToast } from 'components/contexts/ToastContext';
import { useLanguage } from 'components/contexts/LanguageContext';

let openSnackbarFn = () => {};

export default function Toast2(props) {
  let {
    config: { active, variant, duration, text, id },
    methods: { deactivate },
  } = useToast();

  const { lang } = useLanguage();

  if (id) {
    text = lang?.[id] ?? standardizeString(id);
  }

  const classes = useStyles();

  const [closeTimeout, setCloseTimeout] = useState();

  useEffect(() => {
    if (!active) return;
    setCloseTimeout(setTimeout(() => close(), duration));
  }, [active]);

  function close() {
    deactivate();
    clearTimeout(closeTimeout);
  }

  return active ? (
    <View ph={0.5} mt={0.5} w={'100%'}>
      <MuiAlert
        severity={variant}
        variant="filled"
        classes={{
          root: classes.root,
          filledInfo: classes.filledInfo,
          filledSuccess: classes.filledSuccess,
          filledWarning: classes.filledWarning,
          filledError: classes.filledError,
        }}
        style={{ width: '100%' }}
        {...props}>
        {text}
      </MuiAlert>
    </View>
  ) : null;
}

const useStyles = makeStyles({
  root: {
    wordBreak: 'break-all',
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 9,
  },
  filledInfo: {
    color: '#3279ae',
    border: '1px solid #3279ae',
    backgroundColor: '#d7eafd',
  },
  filledSuccess: {
    color: '#24A070',
    border: '1px solid #24A070',
    backgroundColor: '#DEF5EC',
  },
  filledWarning: {
    color: '#F47A00',
    border: '1px solid #F47A00',
    backgroundColor: '#FEF1E5',
  },
  filledError: {
    color: '#CC2538',
    border: '1px solid #CC2538',
    backgroundColor: '#f9e3e6',
  },
});

export function showToast(props) {
  openSnackbarFn(props);
}
