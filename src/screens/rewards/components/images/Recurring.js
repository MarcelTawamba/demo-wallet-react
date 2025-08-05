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
        <clipPath id="clip-recurring-rewards">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="recurring-rewards" clipPath="url(#clip-recurring-rewards)">
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
        <g id="Group_1494" data-name="Group 1494" transform="translate(-1 1)">
          <path
            id="Path_62253"
            fill="none"
            stroke="#020d88"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
            d="M86.967 118s-12.651 7.138-8.676 23.273 22.457 15.342 22.457 15.342"
            data-name="Path 62253"></path>
          <path
            id="Path_62254"
            fill="none"
            stroke="#020d88"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
            d="M117.296 153.601s12.651-7.138 8.676-23.273-22.457-15.342-22.457-15.342"
            data-name="Path 62254"></path>
          <path
            id="Polygon_28"
            fill="#020d88"
            d="M9.168 1.248a1 1 0 011.664 0l8.131 12.2A1 1 0 0118.131 15H1.869a1 1 0 01-.832-1.555z"
            data-name="Polygon 28"
            transform="rotate(45 -80.453 157.361)"></path>
          <path
            id="Polygon_29"
            fill="#020d88"
            d="M9.168 1.248a1 1 0 011.664 0l8.131 12.2A1 1 0 0118.132 15H1.869a1 1 0 01-.832-1.555z"
            data-name="Polygon 29"
            transform="rotate(-135 93.2 60.171)"></path>
        </g>
      </g>
    </svg>
  );
}
