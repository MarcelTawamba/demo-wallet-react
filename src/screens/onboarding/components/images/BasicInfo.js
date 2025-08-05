import * as React from 'react';

export default function BasicInfo(props) {
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
        <clipPath id="clip-basic-info">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-basic-info)">
        <g opacity="0.35" transform="translate(10 10)">
          <g data-name="Group 1487">
            <g data-name="Group 1486">
              <path
                fill={primary}
                d="M90.012 0a46.735 46.735 0 1046.735 46.735A46.859 46.859 0 0090.012 0z"
                data-name="Path 62226"></path>
            </g>
          </g>
          <g data-name="Group 1489">
            <g data-name="Group 1488">
              <path
                fill={primary}
                d="M170.217 130.816a43.569 43.569 0 00-4.694-8.571 58.091 58.091 0 00-40.2-25.306 8.6 8.6 0 00-5.918 1.429 49.816 49.816 0 01-58.776 0 7.657 7.657 0 00-5.918-1.429 57.669 57.669 0 00-40.2 25.306 50.234 50.234 0 00-4.694 8.571 4.34 4.34 0 00.2 3.878 81.419 81.419 0 005.51 8.163 77.558 77.558 0 009.388 10.612 122.328 122.328 0 009.388 8.163 93.066 93.066 0 00111.02 0 89.731 89.731 0 009.388-8.163 94.239 94.239 0 009.388-10.612 71.549 71.549 0 005.51-8.163 3.483 3.483 0 00.608-3.878z"
                data-name="Path 62227"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
