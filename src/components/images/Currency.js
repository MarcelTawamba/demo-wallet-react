import * as React from 'react';

export default function Currency(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Currency">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Currency" clipPath="url(#clip-Currency)">
        <g
          id="Rectangle_2311"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2311"
          transform="translate(16 47)">
          <rect width="168" height="107" stroke="none" rx="14"></rect>
          <rect width="160" height="99" x="4" y="4" rx="10"></rect>
        </g>
        <path
          id="Path_62229"
          fill="#020288"
          d="M90.511 92.207a3.187 3.187 0 00-4.346-.437 2.869 2.869 0 00-.457 4.157 13.452 13.452 0 007.676 4.192v.067a3.1 3.1 0 006.177.151c5-.729 8.527-3.817 9.087-8.053.637-4.822-2.665-9.451-8.031-11.255l-1.052-.356v-7.562a3.427 3.427 0 011.525 1.046 3.182 3.182 0 004.307.711 2.875 2.875 0 00.744-4.119 10.374 10.374 0 00-6.575-3.755v-.239a3.093 3.093 0 00-6.181 0v.45q-.491.112-.994.256a9.213 9.213 0 00-6.535 8.007c-.282 3.654 1.756 6.826 5.451 8.484.468.21 1.18.494 2.078.83V94a6.4 6.4 0 01-2.872-1.8zm12-.664c-.178 1.346-1.23 2.314-2.951 2.766v-7.292c2.285 1.133 3.149 3.059 2.955 4.526zM92.019 75.9a3.342 3.342 0 011.365-2.4v4.809a2.478 2.478 0 01-1.365-2.409z"
          data-name="Path 62229"
          transform="translate(3.259 16.65)"></path>
        <path
          id="Subtraction_13"
          fill={primary}
          d="M-222-2747h-58.97a34.781 34.781 0 0013.594-2.75 34.884 34.884 0 0011.125-7.5 34.885 34.885 0 007.5-11.125A34.781 34.781 0 00-246-2782a34.781 34.781 0 00-2.75-13.624 34.879 34.879 0 00-7.5-11.125 34.884 34.884 0 00-11.125-7.5A34.778 34.778 0 00-281-2817h59a3 3 0 013 3v64a3 3 0 01-3 3zm-59.38 0H-339a3 3 0 01-3-3v-64a3 3 0 013-3h57.971a34.781 34.781 0 00-13.594 2.75 34.884 34.884 0 00-11.125 7.5 34.881 34.881 0 00-7.5 11.125A34.781 34.781 0 00-316-2782a34.781 34.781 0 002.75 13.624 34.886 34.886 0 007.5 11.125 34.884 34.884 0 0011.125 7.5A34.769 34.769 0 00-281.38-2747z"
          data-name="Subtraction 13"
          opacity="0.35"
          transform="translate(381 2882)"></path>
        <g
          id="Ellipse_1106"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 1106"
          transform="translate(65 65)">
          <circle cx="35" cy="35" r="35" stroke="none"></circle>
          <circle cx="35" cy="35" r="31"></circle>
        </g>
      </g>
    </svg>
  );
}
