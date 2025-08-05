import React from 'react';

import { View } from 'components/layout/View';
import IconButton from 'components/inputs/IconButton';
import MyHidden from 'components/layout/Hidden';
import SimplePageListIcon from './SimplePageListIcon';
import { useMediaQuery } from '@material-ui/core';

const tooltip = (id, value) => {
  switch (id) {
    case 'delete':
      return 'Delete';
    case 'verify':
      if (value) {
        return 'Verified';
      }
      return 'Resend verification';
    case 'primary':
      if (value) {
        return 'Primary';
      }
      return 'Set as primary';
    case 'edit':
      return 'Edit';
    case 'confirm':
      return 'Confirm';
    case 'cancel':
      return 'Cancel';
    default:
      return null;
  }
};

export default function SimplePageListActions(props) {
  const {
    actions = [],
    loading,
    state,
    containerIndex,
    listIndex,
    item,
    hover,
  } = props;

  return (
    <View fD={'row'}>
      {actions.map((i, index) => {
        let { id, action, value, disabled, type } = i;
        if (typeof value === 'function') {
          value = value(item);
        }
        if (typeof disabled === 'function') {
          disabled = disabled(item);
        }

        return (
          <ResponsiveToggle
            key={id}
            small={
              disabled ? (
                <SimplePageListIcon
                  type={id}
                  value={value}
                  item={item}
                  hover={hover}
                />
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
                  <SimplePageListIcon
                    type={id}
                    value={value}
                    item={item}
                    hover={hover}
                  />
                </IconButton>
              )
            }
            large={
              disabled ? (
                <SimplePageListIcon
                  type={id}
                  value={value}
                  item={item}
                  hover={hover}
                />
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
                  <SimplePageListIcon
                    type={id}
                    value={value}
                    item={item}
                    hover={hover}
                  />
                </IconButton>
              )
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

function ResponsiveToggle({ small, large }) {
  return (
    <React.Fragment>
      <MyHidden size={480}>{small}</MyHidden>
      <MyHidden up size={480}>
        {large}
      </MyHidden>
      {/* <Hidden xsDown>{}</Hidden> */}
    </React.Fragment>
  );
}

// ProfileList.propTypes = {
//   // classes: PropTypes.object.isRequired,
// };

// export default ProfileActionIcon;
