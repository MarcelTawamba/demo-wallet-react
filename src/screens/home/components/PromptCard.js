import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Image from './images';

export default function PromptCard(props) {
  let {
    colorVariant,
    title,
    description,
    actionText,
    image,
    rightSlot,
    onPress,
    backgroundColor,
  } = props;

  const colorConfig = {
    success: {
      backgroundColor: '#DEF5EC',
      actionTextColor: '#24a070',
    },
    error: {
      backgroundColor: '#F5DEDE',
      actionTextColor: '#cc2538',
    },
    default: {
      backgroundColor: 'white',
      actionTextColor: 'primary',
    },
  };

  const classes = useStyles();

  const content = (
    <View
      p={1}
      bC={
        backgroundColor ??
        colorConfig?.[colorVariant ?? 'default']?.backgroundColor
      }
      bR={10}
      fD={'row'}
      aI={'center'}
      w={'100%'}
      jC={'space-between'}>
      <View style={{ flexShrink: 1 }}>
        <Text s={17} fontWeight={'700'} id={title} />
        {description && (
          <View mt={0.25}>
            <Text
              style={{ fontSize: 13 }}
              myColor={'#848484'}
              lH={18}
              id={description}
            />
          </View>
        )}
        {actionText && (
          <View mt={0.25}>
            <Text
              s={13}
              myColor={colorConfig[colorVariant ?? 'default'].actionTextColor}
              id={actionText}
            />
          </View>
        )}
      </View>
      {image && (
        <View ml={0.5}>
          <Image name={image} size={55} />
        </View>
      )}
      {rightSlot}
    </View>
  );

  return onPress ? (
    <ButtonBase onClick={onPress} className={classes.root}>
      {content}
    </ButtonBase>
  ) : (
    content
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
    borderRadius: 10,
    width: '100%',
  },
}));
