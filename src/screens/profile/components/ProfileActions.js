import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@material-ui/core/Tooltip';
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
import Hidden from '@material-ui/core/Hidden';
import { useTheme } from 'components/app/context';

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
  const {
    actions = [],
    loading,
    state,
    containerIndex,
    listIndex,
    item,
  } = props;

  return (
    <View fD={'row'} aI={'center'}>
      {actions.map((i, index) => {
        let { id, action, value, disabled, type } = i;
        if (typeof value === 'function') {
          value = value(item);
        }

        return id === 'confirm' ? (
          <Button
            noPadding
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
                  simple
                  tooltip={tooltip(id, value)}
                  key={id}
                  aria-label={id}
                  disabled={disabled}
                  loading={
                    loading && id === state && listIndex === containerIndex
                  }
                  onClick={() => action(item)}>
                  <ProfileActionIcon type={id} value={value} />
                </IconButton>
              )
            }
            large={
              <IconButton
                simple
                tooltip={tooltip(id, value)}
                key={id}
                aria-label={id}
                disabled={disabled}
                loading={
                  loading && id === state && listIndex === containerIndex
                }
                onClick={() => action(item)}>
                <ProfileActionIcon type={id} value={value} />
              </IconButton>
            }
          />
        );
      })}
    </View>
  );
}

// ProfileList.propTypes = {
//   // classes: PropTypes.object.isRequired,
// };

const ProfileSmallButtons = props => {
  const { type, value, onClick } = props;

  const TextOutput = (text, uppercase) => (
    <View ph={1} h={52} jC={'center'}>
      <Text
        bold
        variant={'b2'}
        color={'primary'}
        id={text}
        uppercase={uppercase}
      />
    </View>
  );
  switch (type) {
    case 'delete':
      return <DeleteIcon />;
    case 'verify':
      if (value) {
        return TextOutput('verified', true);
      }
      return <Button variant={'text'} noPadding id="verify" uppercase />;
    case 'primary':
      if (value) {
        return TextOutput('primary', true);
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
  const { colors } = useTheme();
  switch (type) {
    case 'delete':
      return <DeleteIcon />;
    case 'verify':
      if (value) {
        // return <VerifiedUserIcon color={'primary'} />;
        return <ClearIcon color="error" />;
      }
      return <DoneIcon style={{ color: colors?.success }} />;
    // return <VerifiedUserOutlinedIcon />;
    case 'primary':
      if (value) {
        return <StarIcon color={'primary'} />;
      }
      return <StarBorderIcon onClick={onClick} color="primary" />;
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
