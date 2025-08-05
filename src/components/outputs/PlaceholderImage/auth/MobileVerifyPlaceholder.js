import React from 'react';

const MobileVerifyPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font, secondary } = colors;
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
            d="M0 0H120V120H0z"
            data-name="Rectangle 32"
            transform="translate(190 167)"
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
          data-name="Mask Group 17"
          transform="translate(0 23)">
          <g transform="translate(190 167)">
            <g data-name="Group 46">
              <path
                fill="#33e32d"
                d="M60 0a60 60 0 1060 60A60.069 60.069 0 0060 0zm34.267 42.8L51.035 86.035a5 5 0 01-7.07 0L20.733 62.8a2.5 2.5 0 010-3.536l3.535-3.535a2.5 2.5 0 013.536 0l19.7 19.7 39.7-39.7a2.5 2.5 0 013.536 0l3.535 3.535a2.5 2.5 0 01-.008 3.536z"
                data-name="Path 47"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default MobileVerifyPlaceholder;
