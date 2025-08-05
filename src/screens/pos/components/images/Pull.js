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
        <clipPath id="clip-pull">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="pull" clipPath="url(#clip-pull)">
        <g id="Union_11" fill="none" data-name="Union 11">
          <path
            d="M-477.927-2266.042l-56.8-56.8A49.763 49.763 0 01-560-2316a50 50 0 01-50-50 50 50 0 0150-50 50 50 0 0150 50 49.775 49.775 0 01-8.651 28.121l56.281 56.28a11 11 0 010 15.557 10.966 10.966 0 01-7.778 3.222 10.966 10.966 0 01-7.779-3.222z"
            transform="translate(632 2437)"></path>
          <path
            fill="#020d88"
            d="M-470.149-2270.82a3.004 3.004 0 002.121-5.121l-56.28-56.281-4.686-4.686 3.731-5.476c4.751-6.973 7.263-15.14 7.263-23.616 0-23.159-18.841-42-42-42s-42 18.841-42 42 18.841 42 42 42a41.95 41.95 0 0021.22-5.746l5.334-3.13 4.372 4.373 56.804 56.804a2.988 2.988 0 002.121.878m0 8c-2.815 0-5.63-1.074-7.778-3.221l-56.803-56.804c-7.416 4.352-16.05 6.846-25.27 6.846-27.615 0-50-22.385-50-50 0-27.614 22.385-50 50-50 27.614 0 50 22.386 50 50a49.775 49.775 0 01-8.651 28.12l56.28 56.28c4.296 4.298 4.296 11.262 0 15.558a10.966 10.966 0 01-7.778 3.221z"
            transform="translate(632 2437)"></path>
        </g>
        <circle
          id="Ellipse_1104"
          cx="35"
          cy="35"
          r="35"
          fill={primary}
          data-name="Ellipse 1104"
          opacity="0.35"
          transform="translate(37 36)"></circle>
      </g>
    </svg>
  );
}
