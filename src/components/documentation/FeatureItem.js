import React from 'react';
import { Typography } from '@material-ui/core';

export default function Feature(props) {
  const { title, description, featureVariant: variant } = props;

  return (
    <div>
      <Typography variant={variant}>{title}</Typography>
      {Boolean(description) && <Typography paragraph>{description}</Typography>}
    </div>
  );
}
