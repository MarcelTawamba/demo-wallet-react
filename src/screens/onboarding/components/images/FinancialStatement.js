import * as React from 'react';

export default function FinancialStatement(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath>
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H180V180H0z"
            data-name="Rectangle 2308"
            transform="translate(10 10)"></path>
        </clipPath>
        <clipPath id="clip-Financial_statement">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g
        clipPath="url(#clip-Financial_statement)"
        data-name="Financial statement">
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2461"
          transform="translate(22 8)">
          <rect width="160" height="185" stroke="none" rx="13"></rect>
          <rect width="152" height="177" x="4" y="4" rx="9"></rect>
        </g>
        <g fill="#fff" data-name="Group 1516" transform="translate(0 53)">
          <rect
            width="126"
            height="20"
            data-name="Rectangle 2390"
            rx="4"
            transform="translate(37 60)"></rect>
          <rect
            width="103"
            height="20"
            data-name="Rectangle 2391"
            rx="4"
            transform="translate(37 93)"></rect>
        </g>
        <g fill={primary} opacity="0.35" transform="translate(0 53)">
          <rect
            width="126"
            height="20"
            data-name="Rectangle 2390"
            rx="4"
            transform="translate(37 60)"></rect>
          <rect
            width="103"
            height="20"
            data-name="Rectangle 2391"
            rx="4"
            transform="translate(37 93)"></rect>
        </g>
        <path
          fill="#020288"
          d="M90.511 92.207a3.187 3.187 0 00-4.346-.437 2.869 2.869 0 00-.457 4.157 13.452 13.452 0 007.676 4.192v.067a3.1 3.1 0 006.177.151c5-.729 8.527-3.817 9.087-8.053.637-4.822-2.665-9.451-8.031-11.255l-1.052-.356v-7.562a3.427 3.427 0 011.525 1.046 3.182 3.182 0 004.307.711 2.875 2.875 0 00.744-4.119 10.374 10.374 0 00-6.575-3.755v-.239a3.093 3.093 0 00-6.181 0v.45q-.491.112-.994.256a9.213 9.213 0 00-6.535 8.007c-.282 3.654 1.756 6.826 5.451 8.484.468.21 1.18.494 2.078.83V94a6.4 6.4 0 01-2.872-1.8zm12-.664c-.178 1.346-1.23 2.314-2.951 2.766v-7.292c2.285 1.133 3.149 3.059 2.955 4.526zM92.019 75.9a3.342 3.342 0 011.365-2.4v4.809a2.478 2.478 0 01-1.365-2.409z"
          data-name="Path 62229"
          transform="translate(3.259 -18.35)"></path>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 1106"
          transform="translate(65 30)">
          <circle cx="35" cy="35" r="35" stroke="none"></circle>
          <circle cx="35" cy="35" r="31"></circle>
        </g>
      </g>
    </svg>
  );
}
