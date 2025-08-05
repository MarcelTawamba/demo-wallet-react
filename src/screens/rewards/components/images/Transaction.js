import React from 'react';

export default function Cash(props) {
  const { size, colors, ...restProps } = props;
  const { primary } = colors;
  const w = 200;
  const h = 200;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (size / w)}
      width={size}
      viewBox="0 0 200 200"
      {...restProps}>
      <defs>
        <clipPath id="clip-transaction-rewards">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="transaction-rewards" clipPath="url(#clip-transaction-rewards)">
        <g
          id="Rectangle_2330"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2330"
          transform="translate(25 67)">
          <rect width="151" height="37" stroke="none" rx="7"></rect>
          <rect width="143" height="29" x="4" y="4" rx="3"></rect>
        </g>
        <g
          id="Rectangle_2331"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2331">
          <path
            stroke="none"
            d="M0 0h131v71a10 10 0 01-10 10H10A10 10 0 010 71V0z"
            transform="translate(35 96)"></path>
          <path
            d="M8 4h115a4 4 0 014 4v63a6 6 0 01-6 6H10a6 6 0 01-6-6V8a4 4 0 014-4z"
            transform="translate(35 96)"></path>
        </g>
        <path
          id="Rectangle_2332"
          fill="#fff"
          d="M0 0H29V37H0z"
          data-name="Rectangle 2332"
          transform="translate(87 67)"></path>
        <path
          id="primary"
          fill={primary}
          d="M0 0H29V37H0z"
          opacity="0.35"
          transform="translate(87 67)"></path>
        <g
          id="Group_1493"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Group 1493"
          transform="translate(3.108 -5)">
          <path
            id="Path_62244"
            d="M97.892 72.017s32.9-62.753 58.489-39.516-25.368 42.261-58.489 39.516z"
            data-name="Path 62244"></path>
          <path
            id="Path_62245"
            d="M97.324 72.017s-32.9-62.753-58.489-39.516S64.2 74.762 97.324 72.017z"
            data-name="Path 62245"></path>
        </g>
        <path
          id="Path_62249"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M93.093 116.94l-9.1 10.37h34.159"
          data-name="Path 62249"></path>
        <path
          id="Path_62250"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8"
          d="M106.055 155.311l9.1-10.37H80.996"
          data-name="Path 62250"></path>
      </g>
    </svg>
  );
}
