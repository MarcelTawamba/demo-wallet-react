import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../inputs/TextField';
import { View } from 'components/layout/View';
import NewIcon from 'components/outputs/NewIcon';
import { copyToClipboard } from 'util/general';
import { useToast } from 'components/contexts/ToastContext';

export default function CopyInput(props) {
  const { containerStyle, value } = props;
  const { showToast } = useToast();

  return (
    <View pt={0.25} w={'100%'} style={containerStyle}>
      <TextField
        margin="dense"
        inputProps={{ autoComplete: 'new-password' }}
        variant={'outlined'}
        InputProps={{
          readonly: true,
          autocorrect: 'off',
          spellcheck: 'false',
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => copyToClipboard(value, showToast)}>
                <NewIcon
                  icon={'copy'}
                  color={'primary'}
                  size={20}
                  inverted
                  circled={false}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </View>
  );
}
