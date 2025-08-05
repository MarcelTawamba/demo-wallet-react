import * as React from 'react';

export default function NoProductPlaceholder({
  width = 200,
  height = 200,
  primary,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-No_products">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g
        id="No_products"
        data-name="No products"
        clipPath="url(#clip-No_products)">
        <path
          id="Path_62230"
          data-name="Path 62230"
          d="M1162.317,2852.034H1187.4l23.639,115.894h99.031"
          transform="translate(-1153 -2817)"
          fill="none"
          stroke="#9a9a9a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          id="Path_62231"
          data-name="Path 62231"
          d="M1192.667,2877.061h141.756l-9.515,56.471s-1.789,11.011-7.788,16.121-16.208,4.319-16.208,4.319h-92.67Z"
          transform="translate(-1153 -2817)"
          fill="none"
          stroke="#9a9a9a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <g
          id="Ellipse_1109"
          data-name="Ellipse 1109"
          transform="translate(49 147)"
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8">
          <circle cx="17" cy="17" r="17" stroke="none" />
          <circle cx="17" cy="17" r="13" fill="none" />
        </g>
        <g
          id="Ellipse_1110"
          data-name="Ellipse 1110"
          transform="translate(128 147)"
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8">
          <circle cx="17" cy="17" r="17" stroke="none" />
          <circle cx="17" cy="17" r="13" fill="none" />
        </g>
        <path
          id="primary"
          d="M1207.649,2887.046l10.087,53.742h86.732l12.776-53.742Z"
          transform="translate(-1151.841 -2815)"
          fill={primary}
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
