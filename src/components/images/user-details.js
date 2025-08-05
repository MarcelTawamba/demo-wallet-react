import * as React from 'react';

export default function UserDetails(props) {
  const { width = 150, height = 150, primary, primarycontrast } = props;

  return (
    <svg width={width} height={height} viewBox={`0 0 100 100`} {...props}>
      <defs>
        <clipPath id="clip-path">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H50V50H0z"
            data-name="Rectangle 1199"></path>
        </clipPath>
      </defs>
      <g transform="translate(-113 -86)">
        <path
          fill={primary}
          d="M50 0A50 50 0 110 50 50 50 0 0150 0z"
          transform="translate(113 86)"></path>
        <g data-name="Group 841" transform="translate(138 110.857)">
          <g clipPath="url(#clip-path)" data-name="Mask Group 479">
            <path
              fill={primarycontrast}
              d="M21.849 24.89A12.445 12.445 0 109.364 12.445 12.464 12.464 0 0021.849 24.89zm8.74 3.11H28.96a17.029 17.029 0 01-14.221 0h-1.63A13.092 13.092 0 000 41.068v4.045a4.676 4.676 0 004.682 4.667h34.334a4.676 4.676 0 004.684-4.668v-4.044A13.092 13.092 0 0030.589 28z"
              data-name="user-solid (1)"
              transform="translate(3.181)"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
