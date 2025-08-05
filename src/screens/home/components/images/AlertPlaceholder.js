import * as React from 'react';

export default function AlertPlaceholder(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Notifications">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g id="Notifications" clipPath="url(#clip-Notifications)">
        <g
          id="Group_1524"
          data-name="Group 1524"
          transform="translate(0.394 1.049)">
          <path
            id="Path_62311"
            data-name="Path 62311"
            d="M1198.423,7053.3h144.249s.206-15.913-18.17-27.271V6977.79s-.367-55.81-53.76-55.79-52.353,55.79-52.353,55.79v48.242C1196.571,7040.151,1198.423,7053.3,1198.423,7053.3Z"
            transform="translate(-1170.922 -6902.402)"
            fill="none"
            stroke="#020d88"
            strokeWidth="8"
          />
          <path
            id="Intersection_21"
            data-name="Intersection 21"
            d="M0,0C.071,15.145,11.684,27.4,26,27.4S51.929,15.145,52,0Z"
            transform="translate(73.606 150.901)"
            fill="none"
            stroke="#020d88"
            strokeWidth="8"
          />
        </g>
        <circle
          id="Ellipse_1114"
          data-name="Ellipse 1114"
          cx="34.5"
          cy="34.5"
          r="34.5"
          transform="translate(122 13)"
          fill="#fff"
        />
        <circle
          id="primary"
          cx="34.5"
          cy="34.5"
          r="34.5"
          transform="translate(122 13)"
          fill={primary}
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
