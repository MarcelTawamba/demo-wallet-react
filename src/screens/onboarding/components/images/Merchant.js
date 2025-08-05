import * as React from 'react';

export default function Merchant(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Merchant">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Merchant)">
        <g data-name="Group 1522" transform="translate(0 -4)">
          <g
            fill="none"
            stroke="#020d88"
            strokeWidth="7"
            data-name="Rectangle 2395"
            transform="translate(24 77)">
            <path stroke="none" d="M0 0H152V101H0z"></path>
            <path d="M3.5 3.5H148.5V97.5H3.5z"></path>
          </g>
          <g fill="#fff" data-name="Group 1521" transform="translate(0 -10)">
            <path
              d="M4.184 0h154.538l9.75 51.757-174.117.272z"
              data-name="Path 61883"
              transform="translate(18.586 40.001)"></path>
            <path
              d="M-200.705-5147.016V-5151h34.822v3.984c0 7.858-7.8 14.229-17.411 14.229s-17.411-6.371-17.411-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.412-6.371-17.412-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.412-6.371-17.412-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.411-6.371-17.411-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229S-340-5139.158-340-5147.016z"
              data-name="Union 21"
              transform="translate(352.941 5241.895)"></path>
          </g>
          <g fill={primary} opacity="0.35" transform="translate(0 -10)">
            <path
              d="M4.184 0h154.538l9.75 51.757-174.117.272z"
              data-name="Path 61883"
              transform="translate(18.586 40.001)"></path>
            <path
              d="M-200.705-5147.016V-5151h34.822v3.984c0 7.858-7.8 14.229-17.411 14.229s-17.411-6.371-17.411-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.412-6.371-17.412-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.412-6.371-17.412-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229s-17.411-6.371-17.411-14.229zm-34.824 0V-5151h34.824v3.984c0 7.858-7.8 14.229-17.412 14.229S-340-5139.158-340-5147.016z"
              data-name="Union 21"
              transform="translate(352.941 5241.895)"></path>
          </g>
          <g
            fill="none"
            stroke="#020d88"
            strokeWidth="7"
            data-name="Rectangle 2396"
            transform="translate(40 109)">
            <path stroke="none" d="M0 0H47V69H0z"></path>
            <path d="M3.5 3.5H43.5V65.5H3.5z"></path>
          </g>
          <path
            fill="#fff"
            d="M0 0H60V41H0z"
            data-name="Rectangle 2397"
            transform="translate(100 109)"></path>
          <path
            fill={primary}
            d="M0 0H60V41H0z"
            data-name="primary"
            opacity="0.6"
            transform="translate(100 109)"></path>
          <circle
            cx="4.5"
            cy="4.5"
            r="4.5"
            fill="#020d88"
            data-name="Ellipse 1112"
            transform="translate(69 139)"></circle>
        </g>
      </g>
    </svg>
  );
}
