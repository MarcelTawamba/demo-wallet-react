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
        <clipPath id="clip-products">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="products" clipPath="url(#clip-products)">
        <g
          id="Rectangle_2218"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          data-name="Rectangle 2218">
          <path
            stroke="none"
            d="M0 0h109v117a19 19 0 01-19 19H19a19 19 0 01-19-19V0z"
            transform="translate(34 49)"></path>
          <path
            d="M8 4h93a4 4 0 014 4v109a15 15 0 01-15 15H19a15 15 0 01-15-15V8a4 4 0 014-4z"
            transform="translate(34 49)"></path>
        </g>
        <path
          id="Path_62212"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M62.03 76.573v-40.6s2-21.789 26.843-22.252 27.081 22.252 27.081 22.252v40.6"
          data-name="Path 62212"></path>
        <path
          id="Rectangle_2219"
          fill="#fff"
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          data-name="Rectangle 2219"
          transform="translate(100 94)"></path>
        <path
          id="primary"
          fill={primary}
          d="M0 0h85v72a19 19 0 01-19 19H19A19 19 0 010 72V0z"
          opacity="0.35"
          transform="translate(100 94)"></path>
        <path
          id="Path_62213"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M160.091 107.715v17.964s-1.3 9.641-17.524 9.846-17.679-9.846-17.679-9.846v-17.964"
          data-name="Path 62213"></path>
      </g>
    </svg>
  );
}
