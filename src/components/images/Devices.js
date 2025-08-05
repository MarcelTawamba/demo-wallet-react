import * as React from 'react';

export default function Devices(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Devices">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Devices" clipPath="url(#clip-Devices)">
        <g id="phone" transform="translate(-310 -177)">
          <g id="Path_62197" fill="none" data-name="Path 62197">
            <path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(355.636 177)"></path>
            <path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(355.636 177)"></path>
          </g>
          <rect
            id="Rectangle_2207"
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(386 177)"></rect>
          <rect
            id="primary"
            width="80"
            height="158"
            fill={primary}
            opacity="0.35"
            rx="8"
            transform="translate(370 198)"></rect>
        </g>
      </g>
    </svg>
  );
}
