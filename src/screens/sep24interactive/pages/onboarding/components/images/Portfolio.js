import * as React from 'react';

export default function Portfolio(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-Payout">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Payout)">
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M188.87 94.14h-77.111a5.526 5.526 0 01-3.9-1.6 5.442 5.442 0 01-1.612-3.867V11.78a5.442 5.442 0 011.615-3.867 5.526 5.526 0 013.9-1.6c45.681.222 82.6 37.026 82.62 82.362a5.442 5.442 0 01-1.613 3.866 5.526 5.526 0 01-3.9 1.6z"
          data-name="Path 61986"></path>
        <path
          fill="#fff"
          d="M123 186.876l-28.468-76.212V29.688a5.8 5.8 0 00-5.86-5.86C40.156 23.828 0 63.2 0 111.718S40.156 200 88.672 200c2 0 3.868-.118 5.86-.234a83.469 83.469 0 0024.96-5.4 5.87 5.87 0 003.508-7.49z"
          data-name="Path 61987"></path>
        <path
          fill={primary}
          d="M123 186.876l-28.468-76.212V29.688a5.8 5.8 0 00-5.86-5.86C40.156 23.828 0 63.2 0 111.718S40.156 200 88.672 200c2 0 3.868-.118 5.86-.234a83.469 83.469 0 0024.96-5.4 5.87 5.87 0 003.508-7.49z"
          opacity="0.35"></path>
        <path
          fill={primary}
          d="M140.914 194.782a5.88 5.88 0 01-5.488-3.8l-28.8-77.2a5.86 5.86 0 015.488-7.92h82.026a5.856 5.856 0 015.86 5.86 88.9 88.9 0 01-57.02 82.678 5.865 5.865 0 01-2.066.382z"
          data-name="primary"></path>
      </g>
    </svg>
  );
}
