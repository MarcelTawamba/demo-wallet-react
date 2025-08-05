import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from '@material-ui/icons/ChevronLeft';
import ArrowForwardIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: ({ colorsOveride }) =>
      colorsOveride ? colorsOveride.primary : theme.palette.primary.main,
    width: '100%',
  },
  backIcon: {
    // paddingTop: theme.spacing(0.5),
    // paddingLeft: theme.spacing(0.5),
  },
  title: {
    color: 'white',
    width: '100%',
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
  },
  subtitle: {
    // paddingTop: theme.spacing(0.125),
  },
}));

const DrawerTitle = props => {
  const {
    onBack,
    title,
    children,
    subtitle,
    titleVariant = 'h6',
    subtitleVariant = 'subtitle2',
    colorsOveride,
  } = props;
  const classes = useStyles(props);
  const back = Boolean(onBack);
  let { colors } = useTheme();
  if (colorsOveride) {
    colors = { ...colors, ...colorsOveride };
  }
  const isRtl = document.dir === 'rtl';

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {back && (
          <div className={classes.backIcon}>
            <IconButton onClick={onBack} style={{ padding: 4 }}>
              {isRtl ? (
                <ArrowForwardIcon htmlColor={colors.primaryContrast} />
              ) : (
                <ArrowBackIcon htmlColor={colors.primaryContrast} />
              )}
            </IconButton>
          </div>
        )}
        <div className={classes.title}>
          <Text variant={titleVariant} myColor={'primaryContrast'}>
            {title ? title : children}
          </Text>
          {subtitle && (
            <div className={classes.subtitle} myColor={'primaryContrast'}>
              <Text variant={subtitleVariant}>{subtitle}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DrawerTitle;
