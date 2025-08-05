import React, { useMemo, useRef } from 'react';
import Lottie from 'react-lottie-player';

import images from './images';
import { replaceColor } from 'lottie-colorify';
import { useTheme } from 'components/app/context';
import { validateColor } from 'util/general';

function LottieImage(props) {
  const {
    name,
    size = 150,
    loop,
    newColor = name === 'success' ? '#2BB292' : 'primary',
    oldColor = name === 'success' ? '#F8E71C' : null, // replacing color for new success lottie json
    oldColor2 = name === 'success' ? [44, 218, 148] : null, // replacing color for new success lottie json
    ...restProps
  } = props;

  const { colors } = useTheme();
  const toColor = newColor.startsWith('#')
    ? newColor
    : colors?.[newColor].toString().toUpperCase();

  const tempAnimationData = useMemo(
    () =>
      oldColor && images?.[name]
        ? replaceColor(
            validateColor(oldColor),
            validateColor(toColor),
            images[name],
          )
        : images?.[name],
    [name, toColor],
  );

  const animationData = useMemo(
    () =>
      oldColor2
        ? replaceColor(
            validateColor(oldColor2),
            validateColor(toColor),
            tempAnimationData,
          )
        : tempAnimationData,
    [name, toColor],
  );

  // const lottieRef = useRef();
  if (!animationData) {
    return null;
  }

  return (
    <div>
      <Lottie
        animationData={animationData}
        // ref={lottieRef}
        play
        loop={loop || name === 'loading'}
        style={{ width: size, height: size }}
        {...restProps}
      />
    </div>
  );
}

export default React.memo(LottieImage);
