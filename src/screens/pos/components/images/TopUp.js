import React from 'react';

export default function TopUp(props) {
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
        <clipPath id="clip-top-up">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="top-up" clipPath="url(#clip-top-up)">
        <path
          id="primary"
          fill={primary}
          d="M-721-2983h-105a13.908 13.908 0 01-9.9-4.1 13.909 13.909 0 01-4.1-9.9v-21h76a13.909 13.909 0 009.9-4.1 13.909 13.909 0 004.1-9.9v-40h29a13.908 13.908 0 019.9 4.1 13.908 13.908 0 014.1 9.9v61a13.909 13.909 0 01-4.1 9.9 13.908 13.908 0 01-9.9 4.1z"
          opacity="0.35"
          transform="translate(892 3145)"></path>
        <g
          id="Rectangle_2328"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2328"
          transform="translate(16 38)">
          <rect width="133" height="89" stroke="none" rx="14"></rect>
          <rect width="125" height="81" x="4" y="4" rx="10"></rect>
        </g>
        <path
          id="Path_62236"
          fill="#020288"
          d="M90.511 92.207a3.187 3.187 0 00-4.346-.437 2.869 2.869 0 00-.457 4.157 13.452 13.452 0 007.676 4.192v.067a3.1 3.1 0 006.177.151c5-.729 8.527-3.817 9.087-8.053.637-4.822-2.665-9.451-8.031-11.255l-1.052-.356v-7.562a3.427 3.427 0 011.525 1.046 3.182 3.182 0 004.307.711 2.875 2.875 0 00.744-4.119 10.374 10.374 0 00-6.575-3.755v-.239a3.093 3.093 0 00-6.181 0v.45q-.491.112-.994.256a9.213 9.213 0 00-6.535 8.007c-.282 3.654 1.756 6.826 5.451 8.484.468.21 1.18.494 2.078.83V94a6.4 6.4 0 01-2.872-1.8zm12-.664c-.178 1.346-1.23 2.314-2.951 2.766v-7.292c2.285 1.133 3.149 3.059 2.955 4.526zM92.019 75.9a3.342 3.342 0 011.365-2.4v4.809a2.478 2.478 0 01-1.365-2.409z"
          data-name="Path 62236"
          transform="translate(-14.741 -1.35)"></path>
      </g>
    </svg>
  );
}
