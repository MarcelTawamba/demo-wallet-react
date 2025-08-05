import React from 'react';
import ListItem from 'components/outputs/ListItem';

const CurrentSessionsListItem = props => {
  const { item, navigateAuth, companyID } = props;
  const { user } = item;
  if (user) {
    const { first_name, last_name, email, id, profile, mobile } = user;

    const title = first_name ? `${first_name} ${last_name || ''}`.trim() : '';
    const subtitle = email ? email : mobile;

    return (
      <ListItem
        button
        key={item.id}
        onClick={() => navigateAuth(companyID, id)}
        title={title}
        subtitle={subtitle}
        image={profile}
      />
    );
  }
  return null;
};

export default CurrentSessionsListItem;
