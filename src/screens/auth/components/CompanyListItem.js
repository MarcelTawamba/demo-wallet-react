import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Image from 'components/outputs/Image';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

const CompanyListItem = props => {
  const isRtl = document.dir === 'rtl';
  const { image, title = '', subtitle, onClick } = props;
  return (
    <ListItem
      button
      // component={this.renderLink}
      dense
      onClick={onClick}>
      {image ? (
        <View
          aI={'center'}
          jC={'center'}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,

            overflow: 'hidden',
          }}>
          <Image src={image} key={image} maxWidth={40} />
        </View>
      ) : (
        <Avatar>{title?.slice(0, 1)}</Avatar>
      )}
      <View w={250} pl={isRtl ? 0 : 1} pr={isRtl ? 1 : 0} pv={0.5}>
        <Text variant="h6" style={{ fontSize: 18 }}>
          {title}
        </Text>
        <Text variant={'body2'} style={{ lineHeight: 1.2 }}>
          {subtitle}
        </Text>
      </View>
    </ListItem>
  );
};

const styles = {
  avatar: {
    margin: 8,
  },
};

export default withStyles(styles)(CompanyListItem);
