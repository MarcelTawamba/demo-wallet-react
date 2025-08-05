import React from 'react';

import makeStyles from '@material-ui/styles/makeStyles';
import { useTheme } from 'components/app/context';
import SaveIcon from '@material-ui/icons/Save';
import TimelineIcon from '@material-ui/icons/Timeline';

const useStyles = makeStyles(theme => ({
  icon: {
    borderRadius: ({ size = 24 }) => size,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Icon = props => {
  let { icon, size = 24, color, inverted } = props;

  const { colors } = useTheme();
  const classes = useStyles(props);

  let tempColor = colors[color + (!inverted ? 'Contrast' : '')];
  if (!tempColor) {
    if (!inverted) {
      tempColor = '#FFFFFF';
    } else {
      tempColor = color ? color : colors.primaryContrast;
    }
  }

  const backgroundColor = 'transparent';
  const cssName = 'icon-' + icon.toLowerCase();

  if (icon.match(/save/)) {
    return <SaveIcon />;
    // } else if (icon.match(/help/)) {
    //   return <HelpOutlineIcon style={{ color: tempColor, fontSize: size }} />;
  } else if (icon.match(/reporting/)) {
    return (
      <div className={classes.icon} style={{ backgroundColor }}>
        <TimelineIcon style={{ color: tempColor, fontSize: size }} />
      </div>
    );
  }

  return (
    <div>
      <div className={classes.icon} style={{ backgroundColor }}>
        <span
          className={cssName}
          style={{
            fontSize: size,
            color: tempColor,
          }}
        />
      </div>
    </div>
  );
};

export default Icon;
