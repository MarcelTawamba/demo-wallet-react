import * as React from 'react';

export default function Branding(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Branding">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Branding)">
        <g fill="none" data-name="Polygon 31">
          <path d="M73 0l73 128H0z" transform="translate(5 36)"></path>
          <path
            fill="#020d88"
            d="M73 16.148L13.772 120h118.456L73 16.148M73 0l73 128H0L73 0z"
            transform="translate(5 36)"></path>
        </g>
        <path
          fill="#fff"
          d="M48.5 0L97 78H0z"
          data-name="Polygon 32"
          transform="translate(100 86)"></path>
        <path
          fill={primary}
          d="M48.5 0L97 78H0z"
          opacity="0.35"
          transform="translate(100 86)"></path>
      </g>
    </svg>
  );
}
