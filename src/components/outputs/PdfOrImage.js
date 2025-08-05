import React from 'react';
import { get } from 'lodash';
import Image from './Image';
import EmptyListMessage from '../lists/EmptyListMessage';
import PlaceholderImage from 'components/images';
import { typeOf } from 'react-lottie-player';

const PdfOrImage = props => {
  const { src, maxWidth = 320, displayTextIfEmpty = true, style } = props;
  const type = get(src, 'type', src);

  if (type.match(/pdf/)) {
    return displayTextIfEmpty ? (
      <EmptyListMessage>Unable to display preview of PDF file</EmptyListMessage>
    ) : (
      <PlaceholderImage name={'documents'} size={maxWidth} />
    );
  }

  return (
    <div
      style={{
        minHeight: `${maxWidth}px`,
        minWidth: `${maxWidth}px`,
        ...style,
      }}>
      <Image
        src={src.type ? URL.createObjectURL(src) : src}
        maxWidth={maxWidth}
      />
    </div>
  );
};

export default PdfOrImage;
