import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const Circles = props => {
  const { width, height, colors } = props;

  return (
    <svg
      height={height ? height : width}
      width={width}
      data-name="Layer 1"
      viewBox="0 0 328 328">
      <Circle
        cx={164}
        cy={164}
        r={160.83}
        style={{ isolation: 'isolate' }}
        opacity={0.05}
        fill={colors['authScreenContrast']}
      />
      <Circle
        cx={164}
        cy={164}
        r={123.75}
        style={{ isolation: 'isolate' }}
        opacity={0.17}
        fill={colors['authScreenContrast']}
      />
      <Circle
        cx={164}
        cy={164}
        r={87.5}
        style={{ isolation: 'isolate' }}
        opacity={0.47}
        fill={colors['authScreenContrast']}
      />
      <Circle cx={164} cy={164} r={57} fill="#fff" />
      <Path
        fill={colors['primary']}
        d="M191.23 179.78L164 195.47l-27.23-15.69L164 163.94l27.23 15.84z"
      />
      <Path
        fill={colors['secondary']}
        d="M191.23 148.37L164 164.06l-27.23-15.69L164 132.53l27.23 15.84z"
      />
      <Path
        fill={colors['tertiary']}
        d="M191.23 179.75L164 195.45v-31.39l27.23-15.69v31.38z"
      />
      <Path
        fill={colors['focus']}
        d="M136.77 179.75l27.23 15.7v-31.39l-27.23-15.69v31.38z"
      />
    </svg>
  );
};

export default Circles;
