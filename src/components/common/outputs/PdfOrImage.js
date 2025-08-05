import React from 'react';
import { get } from 'lodash';
import Image from './Image';
import EmptyListMessage from '../lists/EmptyListMessage';

const PdfOrImage = props => {
  const { src, maxWidth = 320 } = props;
  const type = get(src, 'type', src);

  if (type.match(/pdf/)) {
    return (
      <EmptyListMessage>Unable to display preview of PDF file</EmptyListMessage>
    );
  }

  return (
    <Image
      src={src.type ? URL.createObjectURL(src) : src}
      maxWidth={maxWidth}
    />
  );
};

export default PdfOrImage;
