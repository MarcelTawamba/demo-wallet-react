import React from 'react';
import Svg, { Path, Polygon } from 'react-native-svg';
import { View } from 'react-native';

const RehiveLogo = props => {
  const { width, height, colors } = props;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}>
      <svg
        height={height ? height : width}
        width={width}
        data-name="Layer 1"
        viewBox="0 0 800 800">
        <Path
          fill={colors.primary}
          // opacity={0.17}
          d="M400,670.51,165.77,535.21V264.79L400,129.49l234.23,135.3V535.4ZM267.3,476.56,400,553.21l132.7-76.65V323.44L400,246.79,267.3,323.44V476.56Z"
        />
        <Path
          fill={colors.primary}
          // opacity={0.17}
          d="M400,670.51,165.77,535.21V264.79L400,129.49l234.23,135.3V535.4ZM267.3,476.56,400,553.21l132.7-76.65V323.44L400,246.79,267.3,323.44V476.56Z"
        />
        <Path
          fill={colors.secondary}
          // opacity={0.17}
          d="M400,670.51,165.77,535.21V264.79L400,129.49l234.23,135.3V535.4ZM267.3,476.56,400,553.21l132.7-76.65V323.44L400,246.79,267.3,323.44V476.56Z"
        />
        <Polygon
          fill={colors.primary}
          opacity={0.5}
          points="400 129.49 634.23 264.79 532.7 323.44 400 246.79 267.3 323.44 165.77 264.79 400 129.49"
        />
        <Polygon
          fill={colors.primary}
          // opacity={0.6}
          points="634.23 264.79 532.7 323.44 532.7 476.56 400 553.21 400 670.51 634.23 535.21 634.23 264.79"
        />
      </svg>
    </View>
  );
};

export default RehiveLogo;
