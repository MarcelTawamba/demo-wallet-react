import React from 'react';
import Text from 'components/outputs/Text';
import ButtonBase from '@material-ui/core/ButtonBase';
import { View } from 'components/layout/View';

export default function AnnouncementCard(props) {
  const { title, description, image, dismissible, handleDismiss } = props;

  return (
    <View bC={'white'} bR={15}>
      {image && (
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            height: 180,
            width: '100%',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}></div>
      )}
      <View p={2} pt={1} w={'100%'}>
        <Text fontWeight={'700'} style={{ textAlign: 'center', fontSize: 16 }}>
          {title}
        </Text>
        {Boolean(description) && (
          <View ph={2} pt={1} w={'100%'}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 13,
              }}
              myColor={'grey4'}>
              {description}
            </Text>
          </View>
        )}
        {dismissible && (
          <View mt={1} w={'100%'} aI={'center'}>
            <ButtonBase onClick={handleDismiss} disableTouchRipple>
              <Text
                id="tap_to_close"
                style={{ fontSize: 14, textAlign: 'center' }}
                myColor={'primary'}
                fontWeight={'500'}
                s={14}
              />
            </ButtonBase>
          </View>
        )}
      </View>
    </View>
  );
}
