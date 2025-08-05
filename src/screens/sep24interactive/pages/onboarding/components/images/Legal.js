import * as React from 'react';

export default function Legal(props) {
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
        <clipPath id="clip-Legal">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Legal)">
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
        <g
          fill="#020d88"
          data-name="Group 1520"
          opacity="0.35"
          transform="translate(0 11)">
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
        <g fill="#fff" data-name="Group 1519">
          <path
            d="M1045.5 5280.991l-21.356 42.331h10.869l6.239 6.728 22.457-46.12z"
            data-name="Path 62306"
            transform="translate(-889.712 -5155.491)"></path>
          <path
            d="M1042.356 5280.991l21.356 42.331h-10.869l-6.239 6.728-22.457-46.12z"
            data-name="Path 62307"
            transform="translate(-869.93 -5155.491)"></path>
          <circle
            cx="25.5"
            cy="25.5"
            r="25.5"
            data-name="Ellipse 1111"
            transform="translate(139 100)"></circle>
        </g>
        <g fill={primary} opacity="0.35">
          <path
            d="M1045.5 5280.991l-21.356 42.331h10.869l6.239 6.728 22.457-46.12z"
            data-name="Path 62306"
            transform="translate(-889.712 -5155.491)"></path>
          <path
            d="M1042.356 5280.991l21.356 42.331h-10.869l-6.239 6.728-22.457-46.12z"
            data-name="Path 62307"
            transform="translate(-869.93 -5155.491)"></path>
          <circle
            cx="25.5"
            cy="25.5"
            r="25.5"
            data-name="Ellipse 1111"
            transform="translate(139 100)"></circle>
        </g>
        <g
          fill="none"
          stroke={primary}
          strokeWidth="3"
          data-name="primary"
          transform="translate(146 107)">
          <circle cx="18.5" cy="18.5" r="18.5" stroke="none"></circle>
          <circle cx="18.5" cy="18.5" r="17"></circle>
        </g>
      </g>
    </svg>
  );
}
