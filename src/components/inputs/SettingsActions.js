import React from 'react';

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import IconButton from 'components/inputs/IconButton';
import MyHidden from 'components/layout/Hidden';

const tooltip = (id, value) => {
  switch (id) {
    case 'delete':
      return 'delete';
    case 'verify':
      if (value) {
        return 'verified';
      }
      return 'resend_verification';
    case 'primary':
      if (value) {
        return 'primary';
      }
      return 'set_as_primary';
    case 'edit':
      return 'edit';
    case 'confirm':
      return 'confirm';
    case 'cancel':
      return 'cancel';
    default:
      return null;
  }
};

export default function SettingsActions(props) {
  const { actions, loading, state, containerIndex, listIndex } = props;

  return (
    <View fD={'row'} aI={'center'}>
      {actions.map(({ id, action, value, disabled, type }, index) =>
        id === 'confirm' ? (
          <Button
            key={id}
            onClick={action}
            variant={'text'}
            wide
            loading={loading}
            size={'small'}>
            <Text
              color={type === 'delete' ? 'error' : 'primary'}
              style={{ wordBreak: 'none' }}
              id={
                type === 'delete'
                  ? 'delete'
                  : type === 'primary'
                  ? 'make_primary'
                  : ''
              }
              uppercase
            />
          </Button>
        ) : (
          <ResponsiveToggle
            key={id}
            small={
              id.match(/primary|verify/) ? (
                <ProfileSmallButtons type={id} value={value} />
              ) : (
                <IconButton
                  tooltip={tooltip(id, value)}
                  key={id}
                  aria-label={id}
                  disabled={disabled}
                  loading={
                    loading && id === state && listIndex === containerIndex
                  }
                  onClick={action}>
                  <ProfileActionIcon type={id} value={value} />
                </IconButton>
              )
            }
            large={
              <IconButton
                tooltip={tooltip(id, value)}
                key={id}
                aria-label={id}
                disabled={disabled}
                loading={
                  loading && id === state && listIndex === containerIndex
                }
                onClick={action}>
                <ProfileActionIcon type={id} value={value} />
              </IconButton>
            }
          />
        ),
      )}
    </View>
  );
}

const ProfileSmallButtons = props => {
  const { type, value, onClick } = props;

  const TextOutput = text => (
    <View ph={1} h={52} jC={'center'}>
      <Text bold variant={'b2'} color={'primary'}>
        {text}
      </Text>
    </View>
  );
  switch (type) {
    case 'delete':
      return <DeleteIcon />;
    case 'verify':
      if (value) {
        return TextOutput('VERIFIED');
      }
      return (
        <Button variant={'text'} noPadding>
          VERIFY
        </Button>
      );
    case 'primary':
      if (value) {
        return TextOutput('PRIMARY');
      }
      return <Button variant={'text'} noPadding id="make_primary" capitalize />;
    case 'edit':
      return <EditIcon />;
    case 'confirm':
      return <DoneIcon />;
    case 'cancel':
      return <ClearIcon />;
    default:
      return null;
  }
};

const ProfileActionIcon = props => {
  const { type, value, onClick } = props;
  switch (type) {
    case 'delete':
      return <DeleteIcon />;
    case 'verify':
      if (value) {
        return <VerifiedUserIcon color={'primary'} />;
      }
      return <VerifiedUserOutlinedIcon />;
    case 'primary':
      if (value) {
        return <StarIcon color={'primary'} />;
      }
      return <StarBorderIcon onClick={onClick} />;
    case 'edit':
      return <EditIcon onClick={onClick} />;
    case 'confirm':
      return <DoneIcon onClick={onClick} />;
    case 'cancel':
      return <ClearIcon onClick={onClick} />;
    default:
      return null;
  }
};

const ResponsiveToggle = ({ small, large }) => {
  return (
    <React.Fragment>
      <MyHidden size={480}>{small}</MyHidden>
      <MyHidden up size={480}>
        {large}
      </MyHidden>
      {/* <Hidden xsDown>{}</Hidden> */}
    </React.Fragment>
  );
};

// ProfileList.propTypes = {
//   // classes: PropTypes.object.isRequired,
// };

// export default ProfileActionIcon;
