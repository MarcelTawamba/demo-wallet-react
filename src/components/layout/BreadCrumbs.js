import React from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Hover from 'components/layout/Hover';
import ArrowBackIcon from '@material-ui/icons/ChevronLeft';
import ArrowForwardIcon from '@material-ui/icons/ChevronRight';

export default function BreadCrumbs(props) {
  const { routes } = props;
  const isRtl = document.dir === 'rtl';

  return (
    <View fD={'row'} aI={'center'} w={'100%'} gap={0.5}>
      <View fD={'row'} aI={'center'} w={'100%'}>
        {routes?.map((route, index) => (
          <View fD={'row'} aI={'center'}>
            <button
              rel="noopener noreferrer"
              style={{
                borderWidth: 0,
                paddingLeft: 0,
                paddingTop: 0,
                cursor: index !== routes?.length - 1 ? 'pointer' : null,
                backgroundColor: 'transparent',
                textAlign: 'left',
              }}
              onClick={index !== routes?.length - 1 ? route.onPress : null}
              target="_blank"
              type="button">
              <View fD={'row'} aI={'center'}>
                {index === 0 &&
                  (isRtl ? (
                    <ArrowForwardIcon
                      style={{
                        marginRight: -6,
                        marginTop: 1,
                        height: 20,
                        color: '#393939',
                      }}
                    />
                  ) : (
                    <ArrowBackIcon
                      style={{
                        marginLeft: -6,
                        marginTop: -2,
                        height: 20,
                        color: '#393939',
                      }}
                    />
                  ))}
                <Hover
                  render={hover => (
                    <Text
                      myColor={'primary'}
                      width={'fit-content'}
                      style={{
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        ...(hover && index !== routes?.length - 1
                          ? { textDecorationLine: 'underline' }
                          : { textDecorationLine: 'none' }),
                      }}
                      id={route.name}
                    />
                  )}
                />
              </View>
            </button>
            <Text myColor={'primary'}>
              &nbsp; {index !== routes?.length - 1 ? ' / ' : ''} &nbsp;
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
