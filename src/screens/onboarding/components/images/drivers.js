import * as React from 'react';

export default function Drivers(props) {
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
        <clipPath id="clip-path">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H40V40H0z"
            data-name="Rectangle 1334"
            transform="translate(35 488)"></path>
        </clipPath>
        <clipPath id="clip-path-2">
          <path d="M0 0H40V40H0z" data-name="Rectangle 1333"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-path-2)">
        <g
          clipPath="url(#clip-path)"
          data-name="Mask Group 553"
          transform="translate(-35 -488)">
          <g
            clipPath="url(#clip-path-2)"
            data-name="drivers"
            transform="translate(35 488)">
            <path
              d="M2010.3-93.65h-30a3 3 0 01-3-3v-18a3 3 0 013-3h30a3 3 0 013 3v18a3 3 0 01-3 3zm-25.8-11a4.2 4.2 0 00-4.2 4.2v1.3a1.5 1.5 0 001.5 1.5h11a1.5 1.5 0 001.5-1.5v-1.3a4.205 4.205 0 00-4.2-4.2h-.521a5.429 5.429 0 01-2.279.5 5.441 5.441 0 01-2.277-.5zm14.756 2.348a.958.958 0 00-.957.957.958.958 0 00.957.957h8.086a.958.958 0 00.957-.957.958.958 0 00-.957-.957zm0-4.783a.958.958 0 00-.957.957.958.958 0 00.957.957h11.087a.957.957 0 00.956-.957.958.958 0 00-.956-.957zm-11.956-6.565a4 4 0 00-4 4 4 4 0 004 4 4 4 0 004-4 4.005 4.005 0 00-4-4zm11.957 1.783a.958.958 0 00-.957.957.958.958 0 00.957.957h11.087a.957.957 0 00.956-.957.957.957 0 00-.956-.957z"
              data-name="Subtraction 2"
              transform="translate(-1975.3 125.65)"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
