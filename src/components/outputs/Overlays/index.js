import React from 'react';
import ChiplessCardOverlay from './ChiplessCardOverlay';
import CardOverlay from './CardOverlay';

// Use window.innerWidth instead of Dimensions from react-native
const SCREEN_WIDTH = window.innerWidth;

export default function Overlays(props) {
  const { variant } = props;

  function renderSvg() {
    switch (variant) {
      case 'card':
        return <CardOverlay {...props} />;
      case 'chiplessCard':
        return <ChiplessCardOverlay {...props} />;
      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'absolute', width: '100%', zIndex: 5 }}>
      {renderSvg()}
    </div>
  );
}
