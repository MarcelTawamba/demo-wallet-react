import React from 'react';
import FileUpload from 'components/inputs/NewFileUpload';

export default function DocumentUpload(props) {
  const { onFileLoad, value, docCategory, docType, metadata, context } = props;
  function handleItem(items) {
    onFileLoad &&
      onFileLoad(
        items
          ?.filter(x => x.size)
          ?.map(x => {
            return {
              name: x.name,
              file: x,
              metadata,
              type: docType,
            };
          }),
      );
  }

  return (
    <FileUpload
      multiple
      preloadedFiles={value?.[docType]}
      onFileLoad={items => handleItem(items)}
      previewImage
    />
  );
}
