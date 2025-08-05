import * as React from 'react';

export default function Stellar(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      {' '}
      <defs>
        <clipPath id="clip-path">
          <path
            id="Rectangle_1405"
            fill="#020d88"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H60V60H0z"
            data-name="Rectangle 1405"
            transform="translate(476 496)"></path>
        </clipPath>
        <clipPath id="clip-Stellar">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Stellar" clipPath="url(#clip-Stellar)">
        <g
          id="Ellipse_42"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 42"
          transform="translate(5 5)">
          <circle cx="95" cy="95" r="95" stroke="none"></circle>
          <circle cx="95" cy="95" r="91"></circle>
        </g>
        <circle
          id="primary"
          cx="75"
          cy="75"
          r="75"
          fill={primary}
          opacity="0.35"
          transform="translate(25 25)"></circle>
        <g
          id="Mask_Group_2"
          clipPath="url(#clip-path)"
          data-name="Mask Group 2"
          transform="translate(-406 -426)">
          <g
            id="Layer_2"
            data-name="Layer 2"
            transform="translate(476 500.618)">
            <g id="Layer_1" fill="#020d88" data-name="Layer 1">
              <path
                id="Path_61792"
                d="M51.532 6.642l-7.225 3.681L9.42 28.092A20.78 20.78 0 0140.159 7.261l4.135-2.107.617-.315a25.385 25.385 0 00-40.3 20.547q0 .97.074 1.932a4.618 4.618 0 01-2.504 4.462L0 32.892v5.186l6.42-3.272 2.08-1.061 2.047-1.045 36.778-18.737 4.133-2.1L60 7.5V2.321z"
                data-name="Path 61792"
                transform="translate(0 .002)"></path>
              <path
                id="Path_61793"
                d="M60 8.462L12.637 32.577 8.5 34.687 0 39.02v5.18l8.446-4.3 7.225-3.681 34.921-17.796a21.183 21.183 0 01.178 2.731 20.783 20.783 0 01-30.947 18.115l-.254.135-4.483 2.285a25.385 25.385 0 0040.3-20.534c0-.652-.025-1.3-.074-1.95a4.62 4.62 0 012.506-4.463L60 13.63z"
                data-name="Path 61793"
                transform="translate(0 4.234)"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
