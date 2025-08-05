import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const CardCircles = props => {
  const { width, height, colors } = props;
  const w = 477;
  const h = 178;

  return (
    <svg
      height={h * (width / w)}
      width={width}
      data-name="Layer 1"
      viewBox="0 0 477 178">
      <Circle
        cx={238.5}
        cy={89}
        r={160.8}
        opacity={0.07}
        fill={colors['secondary']}
      />
      <Circle
        cx={238.5}
        cy={89}
        r={123.8}
        opacity={0.37}
        fill={colors['secondary']}
      />
      <Circle
        cx={238.5}
        cy={89}
        r={87.5}
        style={{ isolation: 'isolate' }}
        opacity={0.47}
        fill={colors['secondary']}
      />
      <Circle cx={238.5} cy={89} r={57} fill="#fff" />
      <Path
        fill={colors['primary']}
        d="M265.7 73.4l-27.2 15.7-27.2-15.7 27.2-15.9 27.2 15.9z"
      />
      <Path
        fill={colors['secondary']}
        d="M265.7 104.8l-27.2 15.6V89.1l27.2-15.7v31.4z"
      />
      <Path
        fill={colors['tertiary']}
        d="M211.3 104.8l27.2 15.6V89.1l-27.2-15.7v31.4z"
      />
    </svg>
  );
};

export default CardCircles;
