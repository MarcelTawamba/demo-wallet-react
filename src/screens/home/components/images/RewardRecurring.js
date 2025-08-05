import * as React from 'react';

export default function RewardRecurring(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-recurring-rewards">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g id="recurring-rewards" clipPath="url(#clip-recurring-rewards)">
        <g
          id="Rectangle_2330"
          data-name="Rectangle 2330"
          transform="translate(25 67)"
          fill="none"
          stroke="#020d88"
          strokeWidth="8">
          <rect width="151" height="37" rx="7" stroke="none" />
          <rect x="4" y="4" width="143" height="29" rx="3" fill="none" />
        </g>
        <g
          id="Rectangle_2331"
          data-name="Rectangle 2331"
          transform="translate(35 96)"
          fill="none"
          stroke="#020d88"
          strokeWidth="8">
          <path
            d="M0,0H131a0,0,0,0,1,0,0V71a10,10,0,0,1-10,10H10A10,10,0,0,1,0,71V0A0,0,0,0,1,0,0Z"
            stroke="none"
          />
          <path
            d="M8,4H123a4,4,0,0,1,4,4V71a6,6,0,0,1-6,6H10a6,6,0,0,1-6-6V8A4,4,0,0,1,8,4Z"
            fill="none"
          />
        </g>
        <path
          id="Path_62243"
          data-name="Path 62243"
          d="M434.5,4007"
          transform="translate(-334 -3940)"
          fill="none"
          stroke="#020d88"
          strokeWidth="1"
        />
        <rect
          id="Rectangle_2332"
          data-name="Rectangle 2332"
          width="29"
          height="37"
          transform="translate(87 67)"
          fill="#fff"
        />
        <rect
          id="primary"
          width="29"
          height="37"
          transform="translate(87 67)"
          fill={primary}
          opacity="0.35"
        />
        <g
          id="Group_1493"
          data-name="Group 1493"
          transform="translate(3.108 -5)">
          <path
            id="Path_62244"
            data-name="Path 62244"
            d="M433.892,4007.017s32.9-62.753,58.489-39.516S467.013,4009.762,433.892,4007.017Z"
            transform="translate(-336 -3935)"
            fill="none"
            stroke="#020d88"
            strokeWidth="8"
          />
          <path
            id="Path_62245"
            data-name="Path 62245"
            d="M499.324,4007.017s-32.9-62.753-58.489-39.516S466.2,4009.762,499.324,4007.017Z"
            transform="translate(-402 -3935)"
            fill="none"
            stroke="#020d88"
            strokeWidth="8"
          />
        </g>
        <g id="Group_1494" data-name="Group 1494" transform="translate(-1 1)">
          <path
            id="Path_62253"
            data-name="Path 62253"
            d="M1774.967,4054s-12.651,7.138-8.676,23.273,22.457,15.342,22.457,15.342"
            transform="translate(-1688 -3936)"
            fill="none"
            stroke="#020d88"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          />
          <path
            id="Path_62254"
            data-name="Path 62254"
            d="M1779.3,4092.621s12.651-7.138,8.676-23.273-22.457-15.342-22.457-15.342"
            transform="translate(-1662.004 -3939.02)"
            fill="none"
            stroke="#020d88"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8"
          />
          <path
            id="Polygon_28"
            data-name="Polygon 28"
            d="M9.168,1.248a1,1,0,0,1,1.664,0l8.131,12.2A1,1,0,0,1,18.131,15H1.869a1,1,0,0,1-.832-1.555Z"
            transform="translate(87.707 102.979) rotate(45)"
            fill="#020d88"
          />
          <path
            id="Polygon_29"
            data-name="Polygon 29"
            d="M9.168,1.248a1,1,0,0,1,1.664,0l8.131,12.2A1,1,0,0,1,18.132,15H1.869a1,1,0,0,1-.832-1.555Z"
            transform="translate(116.554 168.621) rotate(-135)"
            fill="#020d88"
          />
        </g>
      </g>
    </svg>
  );
}
