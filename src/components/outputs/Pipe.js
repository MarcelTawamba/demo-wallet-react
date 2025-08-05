import React from 'react';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

export default function Pipe(props) {
  let { children } = props;
  children = children?.filter(x => x);

  return (
    <View flex fD={'row'} aI={'center'} w={'100%'}>
      {children?.map((item, index) => (
        <>
          {item}
          {index < children?.length - 1 && children?.length > 1 ? (
            <View mh={1}>
              <Text s={25}>|</Text>
            </View>
          ) : null}
        </>
      ))}
    </View>
  );
}
