/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React, { Component } from 'react';
// import { CardLayout } from '../common/card/CardLayout';
// import { Card } from '@material-ui/core';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import CardLayout from 'components/card/CardLayout';

class NotificationCard extends Component {
  render() {
    const { item, index } = this.props;
    const titleObj = {
      title: item.title,
      subtitle: '',
      onPress: () => {},
    };

    const actionOne = {
      label: item.actionLabel
        ? item.actionLabel
        : item.dismiss
        ? 'DISMISS'
        : '',
      onPress: () =>
        item.navigate
          ? this.props.navigation.navigate(item.navigate)
          : item.dismiss
          ? this.props.cardDismiss(item.id)
          : null,
      disabled: false,
    };

    const actionTwo = {
      label: '',
      onPress: () => {},
      disabled: false,
    };
    const actionsObj = { primary: actionOne, secondary: actionTwo };

    const contentObj = {
      values: [],
      text: item.description,
      onClick: () => {},
    };

    const cardObj = {
      titleObj,
      actionsObj,
      contentObj,
      // design: design.wallets,
    };

    return <CardLayout className="card" key={index} {...cardObj} />;

    return (
      <div>
        {' '}
        {item.description ? <Text>{item.description} </Text> : <View />}
        {item.title ? <Text>{item.title} </Text> : <View />}
      </div>
    );

    // return (
    //   <Card
    //     design={design.notifications}
    //     onPressContentDisabled
    //     renderHeader={
    //       item.image ? (
    //         <CustomImage
    //           name={item.image}
    //           backgroundColor={'header'}
    //           padding={8}
    //         />
    //       ) : null
    //     }>
    //     <CardLayout
    //       design={design.notifications}
    //       actionOne={actionOne}
    //       actionTwo={actionTwo}
    //       titleObj={title}>
    //       {item.description ? <Content text={item.description} /> : <View />}
    //     </CardLayout>
    //   </Card>
    // );
  }
}

export default NotificationCard;
