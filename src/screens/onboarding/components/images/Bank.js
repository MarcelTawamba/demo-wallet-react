import * as React from 'react';

export default function Bank(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-bank">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-bank)">
        <path
          fill={primary}
          d="M0 0H25V65H0z"
          opacity="0.35"
          transform="translate(24 83)"></path>
        <path
          fill={primary}
          d="M0 0H25V65H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(88 85)"></path>
        <path
          fill={primary}
          d="M0 0H25V65H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(152 83)"></path>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2234"
          transform="translate(6 161)">
          <rect width="187" height="24" stroke="none" rx="8"></rect>
          <rect width="179" height="16" x="4" y="4" rx="4"></rect>
        </g>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2235"
          transform="translate(13 48)">
          <rect width="172" height="24" stroke="none" rx="8"></rect>
          <rect width="164" height="16" x="4" y="4" rx="4"></rect>
        </g>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2236">
          <path
            stroke="none"
            d="M0 0h153v20a5 5 0 01-5 5H5a5 5 0 01-5-5V0z"
            transform="translate(24 64)"></path>
          <path
            d="M8 4h137a4 4 0 014 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V8a4 4 0 014-4z"
            transform="translate(24 64)"></path>
        </g>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2237">
          <path
            stroke="none"
            d="M5 0h143a5 5 0 015 5v19H0V5a5 5 0 015-5z"
            transform="translate(24 145)"></path>
          <path
            d="M5 4h143a1 1 0 011 1v11a4 4 0 01-4 4H8a4 4 0 01-4-4V5a1 1 0 011-1z"
            transform="translate(24 145)"></path>
        </g>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M19.288 51.908l81.185-39.652 78.208 39.652z"
          data-name="Path 62223"></path>
      </g>
    </svg>
  );
}
