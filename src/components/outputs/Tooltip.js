import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useLanguage } from 'components/contexts/LanguageContext';
import Text from './Text';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
    maxWidth: 320,
    width: '100%',
  },
  paper: {
    padding: theme.spacing(1.5),
    maxWidth: 320,
    width: '100%',
  },
}));

export default function Tooltip(props) {
  const { id, children } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { lang } = useLanguage();
  const text = lang?.[id] ?? id ?? '';

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}>
        {children ?? <InfoIcon color="primary" />}
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus>
        <Text>{text}</Text>
      </Popover>
    </div>
  );
}
