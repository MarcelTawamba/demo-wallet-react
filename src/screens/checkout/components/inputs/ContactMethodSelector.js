import React, { useState } from 'react';
import { Box, Button, ButtonGroup, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MobileInputRHF from 'components/inputs/MobileInputRHF';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  button: {
    flex: 1,
    textTransform: 'none',
  },
  activeButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function ContactMethodSelector(props) {
  const { t } = useTranslation(['common']);
  const classes = useStyles();
  const { setValue, watch } = useFormContext();
  
  const [contactType, setContactType] = useState('email');
  const contactValue = watch('contact_method');

  const handleContactTypeChange = (newType) => {
    setContactType(newType);
    setValue('contact_method', ''); // Clear the field when switching
  };

  const handleInputChange = (value) => {
    setValue('contact_method', value);
  };

  return (
    <Box className={classes.container}>
      <ButtonGroup 
        className={classes.buttonGroup}
        variant="outlined"
        fullWidth
      >
        <Button
          className={`${classes.button} ${contactType === 'email' ? classes.activeButton : ''}`}
          onClick={() => handleContactTypeChange('email')}
        >
          {t('email')}
        </Button>
        <Button
          className={`${classes.button} ${contactType === 'mobile' ? classes.activeButton : ''}`}
          onClick={() => handleContactTypeChange('mobile')}
        >
          {t('mobile')}
        </Button>
      </ButtonGroup>

      {contactType === 'email' ? (
        <TextField
          fullWidth
          type="email"
          label={t('email')}
          placeholder="e.g. hello@gmail.com"
          value={contactValue || ''}
          onChange={(e) => handleInputChange(e.target.value)}
          variant="outlined"
          margin="dense"
          required
        />
      ) : (
        <MobileInputRHF
          field={{
            value: contactValue || '',
            onChange: handleInputChange,
            onBlur: () => {},
            name: 'contact_method'
          }}
          label={t('mobile')}
          placeholder="e.g. +1821234567"
          required
          fullWidth
          margin="dense"
          variant="outlined"
        />
      )}
    </Box>
  );
}