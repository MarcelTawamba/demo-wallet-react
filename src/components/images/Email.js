import * as React from 'react';

export default function Email(props) {
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
        <clipPath id="clip-Email">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Email)">
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="bevel"
          data-name="Union 13">
          <path
            d="M-315-3366a11 11 0 01-11-11v-89a11 11 0 016.353-9.973l69.418-55.069a6 6 0 017.457 0l69.418 55.069A11 11 0 01-167-3466v89a11 11 0 01-11 11z"
            transform="translate(347 3549)"></path>
          <path
            fill="#020d88"
            d="M-178-3374c1.654 0 3-1.346 3-3v-89c0-1.412-.936-2.35-1.737-2.724l-1.589-.982-68.174-54.082-68.175 54.082-1.588.982c-.801.374-1.737 1.312-1.737 2.724v89c0 1.654 1.346 3 3 3h137m0 8h-137c-6.075 0-11-4.925-11-11v-89c0-4.415 2.6-8.222 6.353-9.973l69.418-55.069a5.991 5.991 0 013.73-1.3c1.318 0 2.636.434 3.728 1.3l69.417 55.069A11.001 11.001 0 01-167-3466v89c0 6.075-4.925 11-11 11z"
            transform="translate(347 3549)"></path>
        </g>
        <path
          fill="#fff"
          d="M8 0h95a8 8 0 018 8v49.289L67.784 91.973 56.143 80.4 43.374 90.406C38.956 90.406 0 58.461 0 54.043V8a8 8 0 018-8z"
          data-name="Path 62239"
          transform="translate(45 34)"></path>
        <path
          fill={primary}
          d="M8 0h95a8 8 0 018 8v49.289L67.784 91.973 56.143 80.4 43.374 90.406C38.956 90.406 0 58.461 0 54.043V8a8 8 0 018-8z"
          opacity="0.35"
          transform="translate(45 34)"></path>
        <g fill="none" strokeLinecap="round" data-name="Path 62295">
          <path
            d="M75 0l71.475 60.811-8.039 7.081-125.25.079-10.157-4.88z"
            transform="translate(25 115)"></path>
          <path
            fill="#020d88"
            d="M75.078 10.57L18.73 59.966l114.322-.072L75.078 10.57M75 0l71.475 60.81-8.04 7.081-125.25.079L3.03 63.09 75 0z"
            transform="translate(25 115)"></path>
        </g>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M26.5 79.5l64.138 44.672"
          data-name="Path 62240"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M175.638 79.5L111.5 124.172"
          data-name="Path 62241"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M83.639 81.748l13.9 10.818 19.732-26.223"
          data-name="Path 62242"></path>
      </g>
    </svg>
  );
}
