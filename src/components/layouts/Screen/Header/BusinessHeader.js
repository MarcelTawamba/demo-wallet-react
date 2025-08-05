import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRehiveContext } from 'contexts';
import UserAvatar from './UserAvatar';
import BusinessSelector from './BusinessSelector';
import { useHistory } from 'react-router-dom';
// import { Button } from 'components/inputs/Button';
import SimpleButton from 'components/inputs/SimpleButton';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingBottom: theme.spacing(1.5),
    // paddingTop: theme.spacing(2),

    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
}));

export default function BusinessHeader(props) {
  const classes = useStyles(props);
  const history = useHistory();
  const { user } = useRehiveContext();

  function handleProfileRedirect() {
    history.push('/profile/');
  }

  return (
    <div className={classes.container}>
      <BusinessSelector handleProfileRedirect={handleProfileRedirect} />
      <SimpleButton onClick={handleProfileRedirect}>
        <UserAvatar context={{ user }} noEmail imageSize={32} />
      </SimpleButton>
    </div>
  );
}
