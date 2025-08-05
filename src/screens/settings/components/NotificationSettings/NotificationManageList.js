import React, { useState } from 'react';
import { SectionList } from 'react-native-web';
import { standardizeString } from 'util/general';
import SectionListHeader from 'components/lists/SectionListHeader';

import NotificationManageListItem from './NotificationManageListItem';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';

const NotificationManageList = props => {
  const { items, dataHook, showToast } = props;
  const disabledHook = useState(false);

  return items.length > 0 ? (
    <SectionList
      style={{ paddingBottom: 8 }}
      renderItem={({ item, index, section }) => (
        <NotificationManageListItem
          index={index}
          key={item.id}
          item={item}
          dataHook={dataHook}
          showToast={showToast}
          disabledHook={disabledHook}
        />
      )}
      renderSectionHeader={({ section: { type } }) => (
        <SectionListHeader>{standardizeString(type)}</SectionListHeader>
      )}
      sections={items}
      keyExtractor={(item, index) => item.id}
    />
  ) : (
    <EmptyListPlaceholderImage
      name="notification"
      text="no_notification_preferences"
    />
  );
};

NotificationManageList.propTypes = {};

NotificationManageList.defaultProps = {};

export default NotificationManageList;
