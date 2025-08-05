import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import ButtonBase from '@material-ui/core/ButtonBase';
import { View } from 'components/layout/View';
import Image from 'components/outputs/Image';

export default function PostCard(props) {
  const { title, description, image, redirectURL } = props;

  let style = {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
  };

  if (image)
    style = {
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#E0E0E0',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
    };

  const classes = useStyles();

  function openLink() {
    window.open(redirectURL);
  }

  const content = (
    <View bC={'white'} bR={15}>
      <ButtonBase
        onClick={openLink}
        disabled={!Boolean(redirectURL)}
        className={classes.root}>
        <View w={'100%'}>
          {image && (
            <View h={170} w={'100%'}>
              <Image
                src={image}
                resizeMode={'cover'}
                width="100%"
                style={{
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  height: 170,
                  width: '100%',
                }}
              />
            </View>
          )}
          <View p={1} pb={1.5} style={style}>
            <Text fontWeight={'700'}>{title}</Text>
            {Boolean(description) && (
              <View mt={0.75}>
                <Text
                  style={{
                    fontSize: 13,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                  }}
                  myColor={'grey4'}>
                  {description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ButtonBase>
    </View>
  );

  return content;
}

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
    borderRadius: 10,
    width: '100%',
  },
}));
