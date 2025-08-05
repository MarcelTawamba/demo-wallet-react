import * as React from 'react';

export default function Bitcoin(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Bitcoin">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Bitcoin" clipPath="url(#clip-Bitcoin)">
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
        <path
          id="Path_62224"
          fill="#020d88"
          d="M40-24.388a11.274 11.274 0 006.23-10.318c0-7.3-6.03-12.194-17.755-12.194H5.561V0h24.254c12.328 0 18.76-4.69 18.76-12.8 0-5.893-3.35-9.913-8.575-11.588zM27.135-38.726c5.293 0 8.174 1.809 8.174 5.494s-2.881 5.561-8.174 5.561H16.348v-11.055zm1.876 30.552H16.348v-11.591h12.663c5.628 0 8.643 1.876 8.643 5.829 0 4.02-3.015 5.762-8.643 5.762z"
          data-name="Path 62224"
          transform="translate(73 124)"></path>
        <rect
          id="Rectangle_2243"
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2243"
          rx="4"
          transform="translate(86 69)"></rect>
        <rect
          id="Rectangle_2246"
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2246"
          rx="4"
          transform="translate(86 118)"></rect>
        <rect
          id="Rectangle_2244"
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2244"
          rx="4"
          transform="translate(98 69)"></rect>
        <rect
          id="Rectangle_2245"
          width="8"
          height="13"
          fill="#020d88"
          data-name="Rectangle 2245"
          rx="4"
          transform="translate(98 118)"></rect>
      </g>
    </svg>
  );
}
