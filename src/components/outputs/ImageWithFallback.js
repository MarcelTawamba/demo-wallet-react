import React from 'react';
import { SimpleImg } from 'react-simple-img';
import PlaceholderImage from './PlaceholderImage';
import Skeleton from '@material-ui/lab/Skeleton';

export default function ImageWithFallback(props) {
  const { src, name, size = 70, loading } = props;
  if (loading) {
    return (
      <div style={{ overflow: 'hidden', borderRadius: 5 }}>
        <Skeleton width={size} height={size} variant="rect" />
      </div>
    );
  }
  if (src) {
    return <SimpleImg src={src} height={size} width={size} />;
  }
  return <PlaceholderImage width={size} name={name} />;
}
