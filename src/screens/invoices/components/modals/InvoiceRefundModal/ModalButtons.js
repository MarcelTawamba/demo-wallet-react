import React from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';

export default function ModalButtons(props) {
  const { onAccept, acceptLabel, onCancel, isValid, isSubmitting } = props;

  return (
    <View fD="row" w="100%">
      <View w="50%" pr={0.5}>
        <Button
          capitalize
          noPadding
          type="submit"
          color="primary"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          wide
          id={acceptLabel}
          onPress={onAccept}
        />
      </View>

      <View w="50%" pl={0.5}>
        <Button
          capitalize
          noPadding
          color="primary"
          wide
          onPress={onCancel}
          id="cancel"
          variant="outlined"
        />
      </View>
    </View>
  );
}
