import * as React from 'react';

export default function ID(props) {
  const { width = 150, height = 150, primarycontrast } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 40 40`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill={primarycontrast}>
      <defs>
        <clipPath id="clipPath">
          <path
            fill="#fff"
            stroke={primarycontrast}
            strokeWidth="1"
            d="M0 0H40V40H0z"
            data-name="Rectangle 1336"
            transform="translate(35 553)"></path>
        </clipPath>
        <clipPath id="clipPath-2">
          <path d="M0 0H40V40H0z" data-name="Rectangle 1335"></path>
        </clipPath>
        <clipPath id="clipPath-3">
          <path
            stroke={primarycontrast}
            strokeWidth="0.65"
            d="M0 0H16V16H0z"
            data-name="Rectangle 1174"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clipPath-2)">
        <g
          clipPath="url(#clipPath)"
          data-name="Mask Group 554"
          transform="translate(-35 -553)">
          <g clipPath="url(#clipPath-2)" transform="translate(35 553)">
            <rect
              width="36"
              height="24"
              fill="none"
              stroke={primarycontrast}
              strokeWidth="1.3"
              data-name="Rectangle 1170"
              rx="1.95"
              transform="translate(2 8)"></rect>
            <rect
              width="13"
              height="2"
              data-name="Rectangle 1171"
              rx="0.65"
              transform="translate(22 14)"></rect>
            <rect
              width="13"
              height="2"
              data-name="Rectangle 1172"
              rx="0.65"
              transform="translate(22 19)"></rect>
            <rect
              width="9"
              height="2"
              data-name="Rectangle 1173"
              rx="0.65"
              transform="translate(22 24)"></rect>
            <g
              clipPath="url(#clipPath-3)"
              data-name="Mask Group 467"
              transform="translate(4 12)">
              <path
                d="M7 8a4 4 0 10-4-4 4 4 0 004 4zm2.8 1h-.522a5.44 5.44 0 01-4.556 0H4.2A4.2 4.2 0 000 13.2v1.3A1.5 1.5 0 001.5 16h11a1.5 1.5 0 001.5-1.5v-1.3A4.2 4.2 0 009.8 9z"
                data-name="user-solid (1)"
                transform="translate(1)"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
