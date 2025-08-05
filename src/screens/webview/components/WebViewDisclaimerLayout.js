import Image from 'components/images';
import { Button } from 'components/inputs/Button';
import Form from 'components/layout/Form';
import { View } from 'components/layout/View';
import ErrorOutput from 'components/outputs/Error';
import Text from 'components/outputs/Text';
import React from 'react';

export default function WebViewDisclaimerLayout(props) {
  const { config = {}, onPress, loading } = props;

  const { description, name, image } = config;

  return (
    <Form>
      <View pv={1} aI="center" ph={1.5}>
        {image && <Image name={image} height={100} width={200} />}
        <View pv={1}>
          {description}
          {/* <Text
            options={{ boldColor: 'primary' }}
            tA="center"
            id={description}
          /> */}
        </View>
        {typeof onPress === 'function' ? (
          <Button
            // id="continue_to_redirect"
            label={'Continue to ' + name}
            context={{ provider: name }}
            wide
            color="primary"
            onPress={onPress}
            loading={loading}
          />
        ) : (
          <ErrorOutput id="something_went_wrong" />
        )}
      </View>
    </Form>
  );
}
