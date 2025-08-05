import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { SimpleImg } from 'react-simple-img';

import { useConfiguration } from 'components/contexts/ConfigurationContext';

export default function Logo(props) {
  let { type = '', image, height = 48, width, noMargin, noBorder } = props;

  const src = image
    ? image
    : type === 'rehive-icon'
    ? '/images/icon.png'
    : '/images/full-logo.png';

  const classes = useStyles();
  let { config: client } = useConfiguration();

  if (!width) width = height;

  // const [dimensions, setDimensions] = useState({ width, height });

  // function onImgLoad({ target: img }) {
  //   setDimensions({
  //     height: img.naturalHeight,
  //     width: img.naturalWidth,
  //     loading: false,
  //   });
  // }

  // const wideImage = dimensions?.width > dimensions?.height;

  return (
    <div
      className={classes.container}
      style={{
        // minHeight: height,
        // minWidth: width,
        maxHeight: height,
        maxWidth: width,
        overflow: 'hidden',
        borderRadius: noBorder ? 0 : height,
        margin: noMargin ? '' : '6px 6px',
      }}>
      <SimpleImg
        key={image}
        style={{
          maxHeight: height,
          maxWidth: width,
          // borderRadius: height,
        }}
        imgStyle={{
          width,
          height,
          maxHeight: height,
          maxWidth: width,
          objectFit: 'contain',
        }}
        alt={(client?.company ?? 'app') + '_logo'}
        src={src}
      />
      {/* <img
        onLoad={onImgLoad}
        style={{
          maxHeight: height,
          maxWidth: width,
          height: '100%',
          width: '100%',
          // margin: wideImage ? 4 : 8,
          objectFit: 'cover',
          ...imgStyle,
        }}
        alt="rehive"
        src={src}
      /> */}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
}));
