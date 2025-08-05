import * as React from 'react';

export default function Documents(props) {
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
        <clipPath id="clip-Documents">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Documents)">
        <g fill="none" data-name="Path 62298">
          <path
            d="M13 0h110.5L160 26.581V172a13 13 0 01-13 13H13a13 13 0 01-13-13V13A13 13 0 0113 0z"
            transform="translate(22 8)"></path>
          <path
            fill="#020d88"
            d="M13 8c-2.757 0-5 2.243-5 5v159c0 2.757 2.243 5 5 5h134c2.757 0 5-2.243 5-5V30.652L120.895 8H13m0-8h110.5L160 26.581V172c0 7.18-5.82 13-13 13H13c-7.18 0-13-5.82-13-13V13C0 5.82 5.82 0 13 0z"
            transform="translate(22 8)"></path>
        </g>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M138.007 12.92v36.881h40.2v-11.97L144.584 12.92z"
          data-name="Path 62297"></path>
        <g fill="#fff" data-name="Group 1516" transform="translate(0 11)">
          <rect
            width="66"
            height="20"
            data-name="Rectangle 2389"
            rx="4"
            transform="translate(37 27)"></rect>
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
        <g fill={primary} opacity="0.35" transform="translate(0 11)">
          <rect
            width="66"
            height="20"
            data-name="Rectangle 2389"
            rx="4"
            transform="translate(37 27)"></rect>
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
      </g>
    </svg>
  );
}
