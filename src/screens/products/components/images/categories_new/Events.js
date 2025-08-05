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
        <clipPath id="clip-events">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-events)">
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2226"
          transform="translate(20 33)">
          <rect width="160" height="135" stroke="none" rx="19"></rect>
          <rect width="152" height="127" x="4" y="4" rx="15"></rect>
        </g>
        <rect
          width="17"
          height="37"
          fill="#020d88"
          data-name="Rectangle 2227"
          rx="8.5"
          transform="translate(50 20)"></rect>
        <rect
          width="17"
          height="37"
          fill="#020d88"
          data-name="Rectangle 2228"
          rx="8.5"
          transform="translate(133 20)"></rect>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M20 74.578h158.6"
          data-name="Path 62216"></path>
        <path
          fill={primary}
          d="M30 46.2L47.3 57l-4.588-20.35L58 22.958l-20.132-1.766L30 2l-7.868 19.192L2 22.958 17.288 36.65 12.7 57z"
          opacity="0.35"
          transform="translate(70 85)"></path>
      </g>
    </svg>
  );
}
