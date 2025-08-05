import React from 'react';

const EmailVerifyPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font } = colors;
  const h = 500;
  const w = 500;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 500 500">
      <defs>
        <clipPath id="b">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H273V273H0z"
            data-name="Rectangle 9"
            transform="translate(159.32 59)"
          />
        </clipPath>
        <clipPath id="a">
          <path d="M0 0H500V500H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <g
          clipPath="url(#b)"
          data-name="Mask Group 4"
          transform="translate(-45.32 55)">
          <g transform="translate(160.216 59)">
            <path
              fill="#d5d5d5"
              d="M272.108 264.147a11.587 11.587 0 01-3.4 8.526 12.258 12.258 0 01-7.932 2.842H11.477a13.515 13.515 0 01-7.932-2.842 11.586 11.586 0 01-3.4-8.526V97.607h271.963z"
              data-name="Path 10"
              transform="translate(-.146 -2.401)"
            />
            <path
              fill="#959595"
              d="M268.806 274.206a12.258 12.258 0 01-7.932 2.842h-249.3a13.515 13.515 0 01-7.932-2.842l132.581-114.247z"
              data-name="Path 11"
              transform="translate(-.242 -3.934)"
            />
            <path
              fill="#3c3b41"
              d="M272.108 95.206l-38.528 27.852-90.088 64.8a12.716 12.716 0 01-15.3 0l-89.521-64.8L.146 95.206l38.528-27.851L122.529 7.1l6.233-4.547a12.716 12.716 0 0115.3 0l6.23 4.547 40.228 28.993L210.35 50.3l23.23 17.052z"
              data-name="Path 12"
              transform="translate(-.146)"
            />
            <path
              fill="#f2f2f2"
              d="M234.678 42.525v80.712l-90.088 64.8a12.716 12.716 0 01-15.3 0l-89.521-64.8V18.652A11.383 11.383 0 0151.1 7.284h147.88z"
              data-name="Path 13"
              transform="translate(-1.243 -.179)"
            />
            <path
              fill="#cdd6e0"
              d="M204.1 33.431a8.963 8.963 0 009.065 9.094h26.063L204.1 7.284v26.147z"
              data-name="Path 14"
              transform="translate(-5.794 -.179)"
            />
          </g>
        </g>
        <path
          fill="none"
          stroke="#5de058"
          strokeWidth="16.27"
          d="M223.083 223.597l26.335 26.367 50.514-50.982"
          data-name="Path 1"
        />
      </g>
    </svg>
  );
};

export default EmailVerifyPlaceholder;
