import React from 'react';

export default function Cash(props) {
  const { size, colors } = props;
  const { primary } = colors;
  const w = 200;
  const h = 200;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (size / w)}
      width={size}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-credit">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="credit" clipPath="url(#clip-credit)">
        <g
          id="Rectangle_2239"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2239"
          transform="translate(16 47)">
          <rect width="168" height="107" stroke="none" rx="14"></rect>
          <rect width="160" height="99" x="4" y="4" rx="10"></rect>
        </g>
        <path
          id="Rectangle_2240"
          fill="#020d88"
          d="M0 0H165V19H0z"
          data-name="Rectangle 2240"
          transform="translate(18 71)"></path>
        <rect
          id="Rectangle_2241"
          width="74"
          height="11"
          fill="#020d88"
          data-name="Rectangle 2241"
          rx="5.5"
          transform="translate(29 108)"></rect>
        <rect
          id="Rectangle_2242"
          width="37"
          height="11"
          fill="#020d88"
          data-name="Rectangle 2242"
          rx="5.5"
          transform="translate(29 126)"></rect>
        <circle
          id="primary"
          cx="10"
          cy="10"
          r="10"
          fill={primary}
          opacity="0.35"
          transform="translate(132 116)"></circle>
        <circle
          id="primary-2"
          cx="10"
          cy="10"
          r="10"
          fill={primary}
          data-name="primary"
          opacity="0.6"
          transform="translate(148 116)"></circle>
      </g>
    </svg>
  );
}
