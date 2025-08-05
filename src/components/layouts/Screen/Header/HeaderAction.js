import React from 'react';
import Icon from 'components/outputs/Icon';

import { Button } from 'components/inputs/Button';

function handleNew({ history, setItem = () => {} }) {
  setItem('');
  history.push('new/');
}

const actions = props => {
  return {
    add: { onPress: () => handleNew(props) },
    new: { onPress: () => handleNew(props) },
    edit: { onPress: () => props?.history.push('edit/') },
  };
};

export default function HeaderAction(props) {
  const { actionItem, handleAction = () => {} } = props;
  const action =
    typeof actionItem === 'function'
      ? actionItem(props)
      : typeof actionItem === 'object'
      ? actionItem
      : actions(props)?.[actionItem?.id ?? actionItem] ?? { id: actionItem };

  if (!action) return null;
  const id = action?.id ?? actionItem;

  const {
    icon = id,
    onPress = handleAction,
    loading,
    disabled,
    label,
  } = typeof action === 'object' ? action : {};
  const isRtl = document.dir === 'rtl';

  return (
    <Button
      variant="contained"
      size="small"
      thin
      noPadding
      disabled={disabled || loading}
      loading={loading}
      color="primary"
      onClick={onPress}
      style={{ [isRtl ? 'marginRight' : 'marginLeft']: 16, maxHeight: 26 }}
      id={label ? label : id}
      endIcon={
        loading ? null : (
          <Icon
            icon={icon}
            inverted
            size={icon?.match(/new|add/) ? 10 : 14}
            color="#FFFFFF"
          />
        )
      }
    />
  );
}
