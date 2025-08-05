import React from 'react';

const SendToEmailPlaceholder = props => {
  const { width, colors } = props;
  const { primary } = colors;
  const h = 300;
  const w = 300;

  return (
    <svg
      xmlns="http://www.w3.org/2000/Svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 300 300">
      <defs>
        <clipPath id="clip-path">
          <circle
            cx="150"
            cy="150"
            r="150"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            data-name="Ellipse 189"
            transform="translate(-2194 -10496)"></circle>
        </clipPath>
        <clipPath id="clip-path-2">
          <path d="M0 0H300V300H0z" data-name="Rectangle 1394"></path>
        </clipPath>
      </defs>
      <g
        clipPath="url(#clip-path)"
        data-name="Mask Group 558"
        transform="translate(2194 10496)">
        <g
          clipPath="url(#clip-path-2)"
          data-name="Checkout placeholder"
          transform="translate(-2194 -10496)">
          <path
            fill="#ddebfe"
            d="M0 0H300V300H0z"
            data-name="Rectangle 1393"></path>
          <g data-name="Path 62013" transform="translate(101.786 30)">
            <path
              fill="none"
              d="M48.214 0a48.214 48.214 0 0148.215 48.214v25.715a48.214 48.214 0 11-96.429 0V48.214A48.214 48.214 0 0148.214 0z"
              data-name="Path 62014"></path>
            <path
              fill="#9ab8d1"
              d="M48.214 11.786a36.47 36.47 0 00-36.428 36.428v25.715a36.429 36.429 0 1072.857 0V48.214a36.47 36.47 0 00-36.429-36.428m0-11.786a48.214 48.214 0 0148.215 48.214v25.715a48.214 48.214 0 11-96.429 0V48.214A48.214 48.214 0 0148.214 0z"
              data-name="Path 62015"></path>
          </g>
          <path
            fill={primary}
            d="M0 0h152.143v143.571a19.286 19.286 0 01-19.286 19.286H19.286A19.286 19.286 0 010 143.571z"
            transform="translate(73.929 91.071)"></path>
          <path
            fill="rgba(0,0,0,0.2)"
            d="M2836.071 11409.643v-162.857h76.072v143.571a19.286 19.286 0 01-19.286 19.287z"
            data-name="Intersection 6"
            transform="translate(-2686.072 -11155.714)"></path>
          <path
            fill="#9ab8d1"
            d="M0 0H11.786V24.643H0z"
            data-name="Rectangle 1391"
            transform="translate(101.786 88.929)"></path>
          <path
            fill="#9ab8d1"
            d="M0 0H11.786V24.643H0z"
            data-name="Rectangle 1392"
            transform="translate(186.429 88.929)"></path>
        </g>
      </g>
    </svg>
  );
};

export default SendToEmailPlaceholder;
