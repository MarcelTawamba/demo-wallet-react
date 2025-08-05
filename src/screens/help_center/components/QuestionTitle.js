import React from 'react';
import Text from 'components/outputs/Text';

export default function QuestionTitle(props) {
  const { id } = props;
  return <Text id={id} s={18} fW="700" paragraph />;
}
