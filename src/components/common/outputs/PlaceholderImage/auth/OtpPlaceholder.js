import React from 'react';

const OtpPlaceholder = props => {
  const { width, colors } = props;
  const { font, placeholderScreen } = colors;
  const h = 500;
  const w = 500;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 500 500">
      <defs>
        <linearGradient
          id="b"
          x1="0.5"
          x2="0.5"
          y2="1.34"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#80f1fa" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <clipPath id="c">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H128V115H0z"
            data-name="Rectangle 22"
            transform="translate(.107 -.39)"
          />
        </clipPath>
        <clipPath id="a">
          <path d="M0 0H500V500H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <g data-name="Group 45">
          <g data-name="Group 44">
            <rect
              width="202"
              height="368"
              fill="#d5d5d5"
              data-name="Rectangle 29"
              rx="29"
              transform="translate(149 66)"
            />
            <rect
              width="187"
              height="353"
              fill="url(#b)"
              data-name="Rectangle 30"
              rx="22"
              transform="translate(156 74)"
            />
          </g>
          <rect
            width="84"
            height="18"
            fill="#d5d5d5"
            data-name="Rectangle 31"
            rx="9"
            transform="translate(208 66)"
          />
        </g>
        <g
          clipPath="url(#c)"
          data-name="Mask Group 10"
          transform="translate(185.893 182.39)">
          <g transform="translate(18.992 -.244)">
            <g data-name="Group 32">
              <path
                fill="#404040"
                d="M134.66 43.1h-7.524v-9.575C127.136 15.039 111.384 0 92.022 0S56.908 15.039 56.908 33.525V43.1h-7.525a2.452 2.452 0 00-2.508 2.4v59.867a9.823 9.823 0 0010.033 9.578h70.229a9.823 9.823 0 0010.032-9.579V45.5a2.452 2.452 0 00-2.509-2.4zM99.532 93.128a2.331 2.331 0 01-.625 1.862 2.563 2.563 0 01-1.869.8H87.006a2.563 2.563 0 01-1.869-.8 2.329 2.329 0 01-.625-1.862l1.582-13.584a9.345 9.345 0 01-4.105-7.7 10.043 10.043 0 0120.065 0 9.345 9.345 0 01-4.105 7.7zM112.087 43.1h-40.13v-9.575c0-10.563 9-19.157 20.065-19.157s20.065 8.594 20.065 19.157z"
                data-name="Path 24"
                transform="translate(-46.875)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default OtpPlaceholder;
