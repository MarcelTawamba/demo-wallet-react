import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import { Checkbox, ListItem } from '@material-ui/core';
import Spinner from 'components/outputs/Spinner';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { updateNotification } from 'util/rehive';

const useStyles = makeStyles(theme => ({
  name: {
    width: '100%',
    paddingLeft: theme.spacing(1.5),
    // paddingTop: 2,
    paddingBottom: 2,
  },
}));

const NotificationManageListItem = props => {
  const { item, dataHook, showToast, disabledHook, index } = props;
  const [data, setData] = dataHook;
  const [disabled, setDisabled] = disabledHook;
  const classes = useStyles(props);
  const [loading, setLoading] = useState(false);

  const callUpdateNotification = useCallback(
    async event => {
      if (loading) return;
      event.preventDefault();
      setLoading(true);
      setDisabled(true);
      const resp = await updateNotification(item.id, {
        enabled: !item.enabled,
      });
      if (resp.status === 'success') {
        showToast({
          text: 'Notification preference successfully updated',
          variant: 'success',
        });
      } else {
        showToast({
          text: 'Unable to update notification preference',
          variant: 'error',
        });
      }

      const newData = [...data];
      var foundIndex = newData.findIndex(x => x.id === resp.data.id);
      newData[foundIndex] = resp.data;
      setData(newData);
      setLoading(false);
      setDisabled(false);
    },
    [data, item.enabled, item.id, loading, setData, setDisabled, showToast],
  );

  return (
    <ListItem
      // dense
      key={item.id}
      button
      disableGutters
      disabled={loading || disabled}
      onClick={callUpdateNotification}>
      <div className={classes.name}>
        <Text>{standardizeString(item?.name ?? '' + (index + 1))}</Text>
      </div>
      {loading ? (
        <div style={{ width: 30, padding: 2, marginRight: 6 }}>
          <Spinner color={'primary'} size={20} />
        </div>
      ) : (
        <Checkbox
          style={{ padding: 4, marginRight: 8 }}
          color={'primary'}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          checkedIcon={<CheckBoxIcon fontSize="small" />}
          value={item.enabled}
          checked={item.enabled}
        />
      )}
    </ListItem>
  );
};

NotificationManageListItem.propTypes = {};

NotificationManageListItem.defaultProps = {};

export default NotificationManageListItem;
