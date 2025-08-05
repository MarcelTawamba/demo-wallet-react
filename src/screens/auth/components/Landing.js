import React, { useEffect } from 'react';
import ButtonList from 'components/lists/ButtonList';
import { useSelector } from 'react-redux';
import { configSlidesAuthSelector } from 'redux/rehive/selectors';
import { track, trackFlow } from 'util/tracking';
import Slides from 'components/outputs/Slides';
import makeStyles from '@material-ui/styles/makeStyles';

const Landing = props => {
  const {
    onLogin,
    onRegister,
    authConfig,
    loading,
    setLoading,
    onGroup,
  } = props;
  const classes = useStyles(props);

  const slides = useSelector(configSlidesAuthSelector);

  track('LANDING');

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const showSlider = Boolean(slides.length);

  if (loading) {
    return <div />;
  }
  const sharedButtonProps = {
    size: 'large',
    wide: true,
  };

  const primaryButtonProps = {
    onClick: () => {
      trackFlow('login', 'landing', ['login button'], 'clicked');
      onLogin();
    },
    // id: 'primary',
    type: 'submit',
    id: 'log_in',
    capitalize: true,
  };
  const secondaryButtonProps = {
    onClick: () => {
      trackFlow('register', 'landing', ['register button'], 'clicked');
      if (authConfig.group) return onGroup();
      onRegister();
    },
    // id: 'secondary',
    variant: 'text',
    id: 'register',
  };

  const buttons = [{ ...sharedButtonProps, ...primaryButtonProps }];
  if (!authConfig.disableRegister) {
    buttons.push({
      ...sharedButtonProps,
      ...secondaryButtonProps,
    });
  }

  return (
    <div>
      {showSlider && <Slides items={slides} loop />}
      <div className={classes.buttons}>
        <ButtonList layout={'vertical'} items={buttons} />
      </div>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  buttons: {
    paddingLeft: 0,
    paddingRight: 0,
    [theme.breakpoints.down(500)]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
}));

export default Landing;
