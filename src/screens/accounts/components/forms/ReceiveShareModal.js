import React, { useState } from 'react';

import Modal from 'components/layout/Modal';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { MyCheckbox } from 'components/inputs/Input';
import ButtonList from 'components/lists/ButtonList';
import { copyToClipboard } from 'util/general';
import PageContent from 'components/layout/page/PageContent';
import { useToast } from 'components/contexts/ToastContext';

const ReceiveShareModal = props => {
  const { open, onDismiss, shareUrl, formikProps, size } = props;
  // const { values } = formikProps;
  const classes = useStyles();
  const [name, setName] = useState(false);
  const { showToast } = useToast();

  const checkboxProps = {
    id: 'include_name',
    value: name,
    setValue: value => setName(value),
  };

  const buttons = [
    {
      id: 'copied_to_clipboard',
      onPress: () => copyToClipboard(shareUrl, showToast),
    },
  ];

  return (
    <React.Fragment>
      <Modal
        close
        title={'share_qr'}
        maxWidth={500}
        open={open}
        onDismiss={() => onDismiss()}>
        <div className={classes.container}>
          <div className={classes.text}>
            <Text id="share_qr_message" />
            <MyCheckbox {...checkboxProps} />
          </div>
          <ButtonList layout={'vertical'} items={buttons} />
        </div>
      </Modal>
      {/* <Toast /> */}
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    padding: theme.spacing(1),
  },
  text: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default ReceiveShareModal;
