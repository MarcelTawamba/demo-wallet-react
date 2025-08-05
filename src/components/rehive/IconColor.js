import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { SimpleImg } from 'react-simple-img';

import { useConfiguration } from 'components/contexts/ConfigurationContext';

export default function IconColor(props) {
  let { type = '', image, height = 48, width, noMargin, noBorder } = props;

  const src = '/images/icon-color.png';

  const classes = useStyles();
  let { config: client } = useConfiguration();

  if (!width) width = height;

  return (
    <div
      className={classes.container}
      style={{
        maxHeight: height,
        maxWidth: width,
        overflow: 'hidden',
        borderRadius: noBorder ? 0 : height,
        margin: noMargin ? '' : '6px 6px',
      }}>
      <SimpleImg
        style={{
          maxHeight: height,
          maxWidth: width,
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
