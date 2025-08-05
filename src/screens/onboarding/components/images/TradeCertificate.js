import * as React from 'react';

export default function TradeCertificate(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Trade_certificate">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Trade_certificate)" data-name="Trade certificate">
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
        <g
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          data-name="Group 10580"
          transform="translate(2.426 -73)">
          <path
            d="M93.093 116.94l-9.1 10.37h34.159"
            data-name="Path 62249"></path>
          <path
            d="M106.055 155.311l9.1-10.37H80.996"
            data-name="Path 62250"></path>
        </g>
      </g>
    </svg>
  );
}
