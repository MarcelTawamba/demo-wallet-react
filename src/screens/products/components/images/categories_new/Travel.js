import React from 'react';

export default function Cash(props) {
  const { size, colors } = props;
  const { primary } = colors;
  const w = 200;
  const h = 200;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (size / w)}
      width={size}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-travel">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-travel)">
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-name="Path 62200">
          <path
            d="M882.976 206.346l17.8-8.631 15.149 13.726 106.227-35.416a54.825 54.825 0 0118.2-2.812c5.22.14 20.137 2.223 24.046 9.295s-13.528 16.421-13.528 16.421l-45.419 15.437-16.708 36.564-30.457 6.364 11.375-32.354-39.27 13.119s-19.763 5.47-27.845-4.3-19.57-27.413-19.57-27.413z"
            transform="translate(-873.47 -104)"></path>
          <path
            fill="#020d88"
            d="M1039.151 173.197c-9.274 0-16.995 2.828-16.995 2.828L915.93 211.441l-15.149-13.725-17.804 8.63s11.488 17.644 19.57 27.413c3.813 4.61 10.225 5.826 15.936 5.826 6.394 0 11.91-1.526 11.91-1.526l39.27-13.118-11.375 32.354 30.456-6.365 16.71-36.564 45.418-15.437s17.437-9.35 13.528-16.421c-3.909-7.072-18.825-9.155-24.045-9.295-.404-.01-.804-.016-1.203-.016m0-8l1.418.019c.97.026 23.846.784 30.832 13.422 1.672 3.025 2.02 6.438 1.008 9.87-2.585 8.763-14.245 15.588-17.757 17.471-.387.208-.79.383-1.206.524l-42.152 14.327-15.274 33.425a8 8 0 01-5.64 4.506l-30.457 6.364a8 8 0 01-9.184-10.484l5.954-16.934-23.767 7.94c-1.073.308-7.174 1.938-14.444 1.938-12.299 0-18.807-4.745-22.1-8.726-8.278-10.007-19.63-27.412-20.11-28.148a8 8 0 013.214-11.563l17.805-8.631a7.996 7.996 0 018.861 1.27l11.683 10.586 101.791-33.937c.148-.058 8.953-3.239 19.525-3.239z"
            transform="translate(-873.47 -104)"></path>
        </g>
        <path
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M124.577 74.792L78.76 50.939 50.945 62.727 87.9 87.28z"
          data-name="Path 62201"></path>
        <rect
          width="19"
          height="10"
          fill={primary}
          opacity="0.35"
          rx="5"
          transform="rotate(-18 354.33 -212.842)"></rect>
        <rect
          width="19"
          height="10"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          rx="5"
          transform="rotate(-18 321.85 -395.97)"></rect>
        <rect
          width="19"
          height="10"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          rx="5"
          transform="rotate(-18 370.265 -119.158)"></rect>
        <rect
          width="19"
          height="10"
          fill={primary}
          data-name="primary"
          opacity="0.35"
          rx="5"
          transform="rotate(-18 337.784 -302.287)"></rect>
      </g>
    </svg>
  );
}
