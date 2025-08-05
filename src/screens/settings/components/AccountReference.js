import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import IconButton from 'components/inputs/IconButton';
import { useToast } from 'components/contexts/ToastContext';

const styles = theme => ({
  formControl: {
    // padding: theme.spacing(2),
    width: '100%',
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
  },
});

const AccountReference = props => {
  const { children } = props;
  const { showToast } = useToast();

  return (
    <View fD={'row'} pt={1} w={'100%'} jC={'space-between'} aI={'center'}>
      <View w={40} />
      <View w={'100%'}>
        <Text align={'center'} id="account_reference" />
        <Text align={'center'} color={'primary'} variant={'h6'}>
          {children}
        </Text>
      </View>
      <IconButton
        tooltip="copy"
        onClick={() => copyToClipboard(showToast, children)}>
        <CopyIcon />
      </IconButton>
    </View>
  );
};

export default withStyles(styles)(AccountReference);

const copyToClipboard = (showToast, text) => {
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = text;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = { position: 'absolute', left: '-9999px' };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
  showToast({ text: 'Copied to clipboard: ' + text });
};
