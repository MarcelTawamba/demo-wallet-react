import React from 'react';

import CardActionArea from '@material-ui/core/CardActionArea';
import { View } from 'components/layout/View';

import Hover from 'components/layout/Hover';
import ProductPlaceholderImage from '../images/categories_new';
import Text from 'components/outputs/Text';
import { useHistory } from 'react-router-dom';
import Card from 'components/card/Card';

export default function CategoryCard(props) {
  const { item, helpers } = props;
  const { refreshData } = helpers;
  const history = useHistory();
  if (!item) return null;
  const { name } = item;

  function setCategory() {
    history.push({ search: 'categories=' + item?.id });
    refreshData();
  }

  // const contentObj = {
  //   onClick: () => showModal(index), //handleStateChange('detail', index),
  //   disabled: false,
  //   content: (
  //     <Hover
  //       style={{ width: '100%' }}
  //       render={hover => (
  //         <View w={'100%'} bC="#F4F4F4" fD="row" aI="center" p={1} pl={1.5}>
  //           <Text variant="h6">{name}</Text>
  //           <ProductPlaceholderImage size={100} name={name.toLowerCase()} />
  //         </View>
  //       )}
  //     />
  //   ),
  // };

  // const cardObj = {
  //   contentObj,
  // };
  return (
    <Card grid>
      <CardActionArea
        disableRipple
        disableTouchRipple
        // classes={{
        //   root: classes.action,
        //   focusHighlight: classes.focusHighlight,
        // }}
        onClick={setCategory}>
        <View
          h={160}
          jC={'space-between'}
          w="100%"
          bC="#F4F4F4"
          fD="row"
          aI="center"
          p={1}
          ph={1.5}>
          <Text variant="h6">{name}</Text>
          <ProductPlaceholderImage size={100} name={name.toLowerCase()} />
        </View>
      </CardActionArea>
    </Card>
  );
  // return (
  //   <CardLayout
  //     noBorder
  //     onDismiss={hideModal}
  //     noContent
  //     className="card"
  //     key={index}
  //     {...cardObj}
  //   />
  // );
}
