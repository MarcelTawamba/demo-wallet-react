import * as React from 'react';

export default function Notifications(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Notifications">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="Notifications" clipPath="url(#clip-Notifications)">
        <g
          id="Group_1524"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Group 1524"
          transform="translate(.394 1.049)">
          <path
            id="Path_62311"
            d="M27.501 150.898H171.75s.206-15.913-18.17-27.271V75.388s-.367-55.81-53.76-55.79-52.353 55.79-52.353 55.79v48.242c-21.818 14.119-19.966 27.268-19.966 27.268z"
            data-name="Path 62311"></path>
          <path
            id="Intersection_21"
            d="M73.606 150.901c.071 15.145 11.684 27.4 26 27.4s25.929-12.255 26-27.4z"
            data-name="Intersection 21"></path>
        </g>
        <circle
          id="Ellipse_1114"
          cx="34.5"
          cy="34.5"
          r="34.5"
          fill="#fff"
          data-name="Ellipse 1114"
          transform="translate(122 13)"></circle>
        <circle
          id="primary"
          cx="34.5"
          cy="34.5"
          r="34.5"
          fill={primary}
          opacity="0.35"
          transform="translate(122 13)"></circle>
      </g>
    </svg>
  );
}
