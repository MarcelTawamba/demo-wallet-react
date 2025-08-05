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
        <clipPath id="clip-clothes">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-clothes)">
        <path
          fill={primary}
          d="M1218.011 115.87s19.626 5.234 35.049 4.311 34.947-5.874 34.947-5.874 1.339 23.524-34.947 23.094-35.049-21.531-35.049-21.531z"
          opacity="0.35"
          transform="translate(-1153.04 -109)"></path>
        <path
          fill={primary}
          d="M0 0H110V19H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(45 77)"></path>
        <path
          fill={primary}
          d="M0 0H110V19H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(45 110)"></path>
        <path
          fill={primary}
          d="M0 0H110V19H0z"
          data-name="primary"
          opacity="0.35"
          transform="translate(45 143)"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M69.67 5.226s14.723 5.205 29.946 5.205 30.947-5.205 30.947-5.205l26.848 10.927s10.055 5 15.4 12.179c6.048 8.124 8.759 21.241 8.759 21.241l5.255 37.357a49.187 49.187 0 01-14.014 7.355 64.407 64.407 0 01-17.031 2.322l-2.885 90.929a181.721 181.721 0 01-50.248 7.621c-26.886 0-57.3-7.621-57.3-7.621V96.607s-12.307.1-20.44-2.322a25.657 25.657 0 01-12.091-7.355l6.354-39.217s2.142-13.073 8.508-21.342 17.669-12.275 17.669-12.275z"
          data-name="Path 62202"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M45.7 95.9V68.276l-3.646-15.514"
          data-name="Path 62203"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M156.051 95.9V68.276l3.646-15.514"
          data-name="Path 62204"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M71.618 15.276s9.68 10.181 28.655 10.582 28.159-10.582 28.159-10.582"
          data-name="Path 62205"></path>
      </g>
    </svg>
  );
}
