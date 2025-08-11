import React from 'react';
import { useLanguage } from 'components/contexts/LanguageContext';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 70,
    height: 32,
    background: '#fff',
    borderRadius: 4,
    fontSize: 13,
    fontWeight: 500,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    padding: '0 6px',
    margin: '0 8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    '& .MuiSelect-select': {
      padding: '6px 24px 6px 8px',
      fontFamily: 'inherit',
      minHeight: 'unset',
      display: 'flex',
      alignItems: 'center',
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
  icon: {
    color: theme.palette.primary.main,
    top: 'calc(50% - 12px)',
  },
  container: {
    background: 'transparent',
    boxShadow: 'none',
    padding: 0,
    height: 32,
    display: 'flex',
    alignItems: 'center',
  },
}));

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        input={<InputBase />}
        classes={{ root: classes.root, icon: classes.icon }}
        disableUnderline
        variant="standard"
        MenuProps={{
          PaperProps: {
            style: {
              fontFamily: 'inherit',
              fontSize: 13,
            },
          },
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
