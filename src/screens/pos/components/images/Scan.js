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
        <clipPath id="clip-path">
          <path
            id="Rectangle_2215"
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.36"
            d="M0 0H60V60H0z"
            data-name="Rectangle 2215"
            transform="translate(30.6 182.52)"></path>
        </clipPath>
        <clipPath id="clip-scan">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="scan" clipPath="url(#clip-scan)">
        <g id="data" transform="translate(-91 -177)">
          <g id="Path_62197" fill="none" data-name="Path 62197">
            <path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(136.636 177)"></path>
            <path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(136.636 177)"></path>
          </g>
          <rect
            id="Rectangle_2207"
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(167 177)"></rect>
        </g>
        <g id="primary" opacity="0.45" transform="translate(70.2 70.2)">
          <g id="Group_10567" fill={primary} data-name="Group 10567">
            <path
              id="Path_62056"
              d="M0 34.145h27.273V6.873H0zm5.455-21.817h16.364v16.321H5.455z"
              data-name="Path 62056"
              transform="translate(0 25.855)"></path>
            <path
              id="Rectangle_2216"
              d="M0 0H5.455V5.455H0z"
              data-name="Rectangle 2216"
              transform="translate(10.91 43.635)"></path>
            <path
              id="Rectangle_2217"
              d="M0 0H5.457V5.455H0z"
              data-name="Rectangle 2217"
              transform="translate(43.635 54.545)"></path>
            <path
              id="Rectangle_2218"
              d="M0 0H5.455V5.455H0z"
              data-name="Rectangle 2218"
              transform="translate(54.545 54.545)"></path>
            <path
              id="Path_62057"
              d="M28.69 12.328h-5.454V6.873H6.873v27.272h5.455V17.781h5.453v5.455h16.364V6.873H28.69z"
              data-name="Path 62057"
              transform="translate(25.855 25.855)"></path>
            <path
              id="Path_62058"
              d="M0 27.273h27.273V0H0zM5.455 5.455h16.364v16.364H5.455z"
              data-name="Path 62058"></path>
            <path
              id="Rectangle_2219"
              d="M0 0H5.455V5.455H0z"
              data-name="Rectangle 2219"
              transform="translate(10.91 10.91)"></path>
            <path
              id="Path_62059"
              d="M6.873 0v27.273h27.272V0zM28.69 21.818H12.328V5.455H28.69z"
              data-name="Path 62059"
              transform="translate(25.855)"></path>
            <path
              id="Rectangle_2220"
              d="M0 0H5.457V5.455H0z"
              data-name="Rectangle 2220"
              transform="translate(43.635 10.91)"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
