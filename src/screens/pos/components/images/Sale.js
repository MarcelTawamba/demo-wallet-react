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
        <clipPath id="clip-new-sale">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="new-sale" clipPath="url(#clip-new-sale)">
        <path
          id="Path_62230"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M9.317 35.034H34.4l23.639 115.894h99.031"
          data-name="Path 62230"></path>
        <path
          id="Path_62231"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M39.667 60.061h141.756l-9.515 56.471s-1.789 11.011-7.788 16.121-16.208 4.319-16.208 4.319h-92.67z"
          data-name="Path 62231"></path>
        <g
          id="Ellipse_1109"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 1109"
          transform="translate(49 147)">
          <circle cx="17" cy="17" r="17" stroke="none"></circle>
          <circle cx="17" cy="17" r="13"></circle>
        </g>
        <g
          id="Ellipse_1110"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 1110"
          transform="translate(128 147)">
          <circle cx="17" cy="17" r="17" stroke="none"></circle>
          <circle cx="17" cy="17" r="13"></circle>
        </g>
        <path
          id="primary"
          fill={primary}
          d="M1207.649 2887.046l10.087 53.742h86.732l12.776-53.742z"
          opacity="0.35"
          transform="translate(-1151.841 -2815)"></path>
      </g>
    </svg>
  );
}
