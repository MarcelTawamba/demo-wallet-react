import * as React from 'react';

export default function Mobile(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath>
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H180V180H0z"
            data-name="Rectangle 2308"
            transform="translate(10 10)"></path>
        </clipPath>
        <clipPath id="clip-Mobile">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Mobile)">
        <g transform="translate(-91 -177)">
          <g fill="none" data-name="Path 62197">
            <path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(136.636 177)"></path>
            <path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(136.636 177)"></path>
          </g>
          <rect
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(167 177)"></rect>
          <path
            fill={primary}
            d="M-257-109h64a8 8 0 018 8v55a8 8 0 01-8 8h-64a8 8 0 01-8-8v-55a8 8 0 018-8z"
            opacity="0.35"
            transform="translate(416 351)"></path>
        </g>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M83.639 102.748l13.9 10.818 19.732-26.223"
          data-name="Path 62242"></path>
      </g>
    </svg>
  );
}
