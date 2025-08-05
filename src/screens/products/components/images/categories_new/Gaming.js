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
        <clipPath id="clip-gaming">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-gaming)">
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M99.559 46.9c24.137.394 37.584-14.051 60.741-5.869s48.982 103.448 24.958 117.169-45.216-33.729-85.7-34.094S35.921 172.1 16.084 158.2s-3.1-103.477 19.553-116.017S75.422 46.51 99.559 46.9z"
          data-name="Path 62215"></path>
        <path
          fill="#020d88"
          d="M-594-370v-7h-7a9 9 0 01-9-9 9 9 0 019-9h7v-7a9 9 0 019-9 9 9 0 019 9v7h7a9 9 0 019 9 9 9 0 01-9 9h-7v7a9 9 0 01-9 9 9 9 0 01-9-9z"
          data-name="Union 9"
          transform="translate(636 470)"></path>
        <circle
          cx="9"
          cy="9"
          r="9"
          fill="#020d88"
          data-name="Ellipse 36"
          transform="translate(116 75)"></circle>
        <circle
          cx="9"
          cy="9"
          r="9"
          fill="#020d88"
          data-name="Ellipse 37"
          transform="translate(134 59)"></circle>
        <circle
          cx="9"
          cy="9"
          r="9"
          fill="#020d88"
          data-name="Ellipse 38"
          transform="translate(152 75)"></circle>
        <circle
          cx="9"
          cy="9"
          r="9"
          fill="#020d88"
          data-name="Ellipse 39"
          transform="translate(134 91)"></circle>
        <circle
          cx="15"
          cy="15"
          r="15"
          fill="#fff"
          data-name="Ellipse 40"
          transform="translate(58 105)"></circle>
        <circle
          cx="15"
          cy="15"
          r="15"
          fill={primary}
          opacity="0.35"
          transform="translate(58 105)"></circle>
        <circle
          cx="15"
          cy="15"
          r="15"
          fill="#fff"
          data-name="Ellipse 41"
          transform="translate(113 105)"></circle>
        <circle
          cx="15"
          cy="15"
          r="15"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          transform="translate(113 105)"></circle>
      </g>
    </svg>
  );
}
