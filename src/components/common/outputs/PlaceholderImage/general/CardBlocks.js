import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CardBlocks = props => {
  const { width, colors } = props;
  const w = 477;
  const h = 178;

  return (
    <svg
      height={h * (width / w)}
      width={width}
      data-name="Layer 1"
      viewBox="0 0 477 178">
      <Path
        fill={colors['tertiary']} // needed
        d="M477.25 191.91l-46.21 26.66v-53.23l46.21-26.66v53.23z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.3}
        d="M384.84 191.91l46.2 26.66v-53.23l-46.2-26.66v53.23z"
      />
      <Path
        fill={colors['primary']}
        d="M384.92 165.34l-23.1 13.25-23.1-13.25 23.1-13.49 23.1 13.49z"
      />
      <Path
        fill={colors['tertiary']}
        d="M384.92 191.91l-23.1 13.33v-26.65l23.1-13.25v26.57z"
      />
      <Path
        fill={colors['primary']}
        d="M384.92 165.26l-23.1 13.24v-26.57l23.1-13.33v26.66z"
      />
      <Path
        fill={colors['primary']}
        opacity={0.65}
        d="M477.25 85.45l-46.21 26.58-46.2-26.58 46.2-26.9 46.21 26.9z"
      />
      <Path
        fill={colors['primary']}
        d="M477.25 138.68l-46.21 26.58v-53.23l46.21-26.58v53.23z"
      />
      <Path
        fill={colors['primary']}
        opacity={0.3}
        d="M384.84 138.68l46.2 26.58v-53.23l-46.2-26.58v53.23z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.65}
        d="M315.78 98.7l-46.21 26.57-46.2-26.57 46.2-26.9 46.21 26.9z"
      />
      <Path
        fill={colors['tertiary']}
        d="M315.78 151.93l-46.21 26.57v-53.23l46.21-26.57v53.23z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.3}
        d="M223.89 151.01l46.2 26.58v-53.23l-46.2-26.58v53.23z"
      />
      <Path
        fill={colors['tertiary']}
        d="M384.92 138.93l-23.1 13.32v-26.57l23.1-13.33v26.58z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.65}
        d="M384.92 86.21l-23.1 13.33-23.1-13.33 23.1-13.41 23.1 13.41z"
      />
      <Path
        fill={colors['tertiary']}
        d="M384.92 112.87l-23.1 13.24V99.54l23.1-13.33v26.66z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.3}
        d="M338.72 112.87l23.1 13.24V99.54l-23.1-13.33v26.66z"
      />
      <Path
        fill={colors['primary']}
        opacity={0.65}
        d="M269.98 177.91l-46.2 26.57-46.21-26.57 46.21-26.9 46.2 26.9z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.65}
        d="M361.9 125.36l-23.1 13.32-23.1-13.32 23.1-13.41 23.1 13.41z"
      />
      <Path
        fill={colors['tertiary']}
        d="M361.9 152.01l-23.1 13.33v-26.66l23.1-13.32v26.65z"
      />
      <Path
        fill={colors['tertiary']}
        opacity={0.3}
        d="M315.7 152.01l23.1 13.33v-26.66l-23.1-13.32v26.65z"
      />
      <Path
        fill={colors['primary']}
        opacity={0.65}
        d="M361.82 178.34L315.62 205l-46.12-26.66 46.12-26.89 46.2 26.89zM177.65 152.01l-46.2 26.58-46.2-26.58 46.2-26.9 46.2 26.9z"
      />
      <Path
        fill={colors['primary']}
        d="M177.65 205.24l-46.2 26.58v-53.23l46.2-26.58v53.23z"
      />
      <Path
        fill={colors['primary']}
        opacity={0.3}
        d="M85.25 205.24l46.2 26.58v-53.23l-46.2-26.58v53.23z"
      />
    </svg>
  );
};

export default CardBlocks;
