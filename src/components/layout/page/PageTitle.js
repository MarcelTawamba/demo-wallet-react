import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIcon from '@material-ui/icons/ChevronLeft';
import ArrowForwardIcon from '@material-ui/icons/ChevronRight';
import Text from 'components/outputs/Text';
import IconButton from 'components/inputs/IconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: ({ mb }) => theme.spacing(mb ? 0 : 1),
    padding: ({ noPadding }) => theme.spacing(noPadding ? 0 : 2),
    paddingBottom: theme.spacing(1),
    marginBottom: ({ footer, mb }) => (footer ? 0 : theme.spacing(mb ? mb : 1)),
    width: '100%',
    [theme.breakpoints.down(500)]: {
      padding: theme.spacing(1),
    },
  },
  backIcon: {
    marginTop: '-2px',
    // marginLeft: theme.spacing(0.5),
    position: 'absolute',
  },
  footer: {
    marginBottom: theme.spacing(2),
  },
  title: ({ back, noPadding, divider }) => ({
    // paddingTop: back ? 3 : 0,
    // paddingBottom: theme.spacing(noPadding ? 0 : back ? 0.2 : 0),
    // paddingLeft: theme.spacing(1),
    // paddingRight: theme.spacing(2) + (back ? 34 : 0),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }),
  subtitle: {
    // paddingTop: theme.spacing(0.125),
  },
  actions: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2.5),
    alignItems: 'center',
    display: 'flex',
    position: 'absolute',
    right: 0,
    // top: 0,

    // float: 'right',
  },
  dividerContainer: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '100%',
  },
  divider: {
    borderTop: '1px solid #EFEFEF',
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(2),
    width: '100%',
  },
}));

const PageTitle = props => {
  const {
    back,
    handleBack,
    title,
    titleId,
    children,
    id,
    subtitle,
    subtitleId,
    divider,
    titleVariant = 'h5',
    subtitleVariant = 'subtitle2',
    actions,
    align = 'center',
    style,
    footer,
  } = props;
  const classes = useStyles(props);
  const isRtl = document.dir === 'rtl';

  return (
    <>
      {divider && (
        <div className={classes.dividerContainer}>
          <div className={classes.divider} />
        </div>
      )}
      <div className={classes.root} style={style}>
        <div className={classes.container}>
          {back && (
            <div className={classes.backIcon}>
              <IconButton noPadding onClick={handleBack}>
                {isRtl ? (
                  <ArrowForwardIcon style={{ fontSize: 30 }} />
                ) : (
                  <ArrowBackIcon style={{ fontSize: 30 }} />
                )}
              </IconButton>
            </div>
          )}
          <div className={classes.title}>
            <Text align={align} variant={titleVariant} id={titleId || id}>
              {title ? title : children}
            </Text>
            {subtitle && (
              <div className={classes.subtitle}>
                <Text variant={subtitleVariant} id={subtitleId || subtitle} />
              </div>
            )}
          </div>
        </div>
        {actions && <div className={classes.actions}>{actions}</div>}
      </div>
      {footer && <div className={classes.footer}>{footer}</div>}
    </>
  );
};
export default PageTitle;
