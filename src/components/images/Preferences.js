import * as React from 'react';

export default function Preferences(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      {' '}
      <defs>
        <clipPath id="clip-Preferences">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Preferences" clipPath="url(#clip-Preferences)">
        <path
          id="Path_62511"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M28.919 28.433v143.131"
          data-name="Path 62511"></path>
        <path
          id="Path_62512"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M100 28.433v143.131"
          data-name="Path 62512"></path>
        <path
          id="Path_62513"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M171.082 28.433v143.131"
          data-name="Path 62513"></path>
        <rect
          id="Rectangle_2435"
          width="40"
          height="40"
          fill="#fff"
          data-name="Rectangle 2435"
          rx="10"
          transform="translate(9 48)"></rect>
        <rect
          id="primary"
          width="40"
          height="40"
          fill={primary}
          opacity="0.35"
          rx="10"
          transform="translate(9 48)"></rect>
        <rect
          id="Rectangle_2436"
          width="40"
          height="40"
          fill="#fff"
          data-name="Rectangle 2436"
          rx="10"
          transform="translate(80 114)"></rect>
        <rect
          id="Rectangle_2437"
          width="40"
          height="40"
          fill="#fff"
          data-name="Rectangle 2437"
          rx="10"
          transform="translate(151 68)"></rect>
        <rect
          id="primary-2"
          width="40"
          height="40"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          rx="10"
          transform="translate(80 114)"></rect>
        <rect
          id="primary-3"
          width="40"
          height="40"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          rx="10"
          transform="translate(151 68)"></rect>
      </g>
    </svg>
  );
}
