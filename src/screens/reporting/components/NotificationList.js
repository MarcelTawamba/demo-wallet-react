import React, { Component } from 'react';

import CardList from 'components/card/CardList';
import NotificationCard from './NotificationCard';

class NotificationList extends Component {
  render() {
    const { notifications, cardDismiss, onRefresh } = this.props;
    const { dismissedCards } = notifications;
    let cards = [];
    let i = 0;
    if (notifications) {
      let customCards = notifications.custom;
      if (customCards) {
        for (let j = 0; j < customCards.length; j++) {
          if (!dismissedCards || !dismissedCards.includes(customCards[j].id)) {
            cards[i++] = customCards[j];
          }
        }
      }
    }

    return (
      <CardList
        data={{ items: cards }}
        header={{
          label: 'NOTIFICATIONS',
          action:
            dismissedCards && dismissedCards.length > 0 ? 'RESTORE ALL' : '',
          onPress: this.props.cardRestoreAll,
          showRefresh: true,
          onRefresh: () => onRefresh(),
        }}
        onRefresh={onRefresh}
        renderItem={item => (
          <NotificationCard
            item={item}
            // navigation={this.props.navigation}
            cardDismiss={cardDismiss}
          />
        )}
        emptyListMessage={'No new notifications'}
      />
    );
  }
}

export default NotificationList;
