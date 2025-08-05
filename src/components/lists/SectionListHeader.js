import React from 'react';
import Text from 'components/outputs/Text';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';
import Icon from 'components/outputs/NewIcon';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(1),
  },
  text: {
    fontSize: 14,
  },
  linkContainer: {
    display: 'flex',
    marginBottom: 6,
  },
  linkText: {
    fontSize: 14,
    textDecoration: 'underline',
    fontWeight: 500,
    display: 'inline',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const SectionListHeader = props => {
  const {
    children,
    navigateTo,
    navigationState = {},
    textStyle,
    notShow,
  } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      {navigateTo ? (
        <Link
          className={classes.linkContainer}
          to={{
            pathname: navigateTo,
            state: navigationState,
          }}>
          <Text style={textStyle ?? {}} className={classes.linkText}>
            {children}
          </Text>
          {!notShow && (
            <Icon icon="ArrowRight" circled={false} color="fontLight" />
          )}
        </Link>
      ) : (
        <Text className={classes.text}>{children}</Text>
      )}
    </div>
  );
};

export default SectionListHeader;
