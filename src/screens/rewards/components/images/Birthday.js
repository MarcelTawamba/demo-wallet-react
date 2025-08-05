import React from 'react';

export default function Cash(props) {
  const { size, colors, ...restProps } = props;
  const { primary } = colors;
  const w = 200;
  const h = 200;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (size / w)}
      width={size}
      viewBox="0 0 200 200"
      {...restProps}>
      <defs>
        <clipPath id="clip-birthday">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="birthday" clipPath="url(#clip-birthday)">
        <path
          id="primary"
          fill={primary}
          d="M644.942 4046.878s4.811-3.677 19.973-4.884c14.417 3.769 10.776 7.8 22.087 7.422s12.658-8.99 23.155-8.94c19.62.094 14.268 8.114 29.479 8.94 6.556.356 9.609-6.862 14.315-8.94 5.544-2.445 11.752 0 11.752 0s-11.573-43.441-60.846-43.416-59.915 49.818-59.915 49.818z"
          opacity="0.35"
          transform="translate(-606 -3935)"></path>
        <path
          id="Path_62246"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          d="M43.148 135.345l20.665 50.757h73.635l20.48-50.757z"
          data-name="Path 62246"></path>
        <g id="Path_62247" fill="none" data-name="Path 62247">
          <path
            d="M67 0c37 0 67.888 32.689 67.888 64.5 0 16.066-33.632 16.011-67.888 15.849C33.983 80.2.328 80.251.328 64.5.328 32.689 30 0 67 0z"
            transform="translate(33 59)"></path>
          <path
            fill="#020d88"
            d="M67 8C33.42 8 8.328 37.83 8.328 64.503c0 7.576 40.222 7.763 57.398 7.842l1.312.006 9.594.03c41.537 0 50.256-4.284 50.256-7.878C126.888 38.373 100.728 8 67 8m0-8c37.003 0 67.888 32.689 67.888 64.503 0 14.553-27.598 15.878-58.256 15.878-3.188 0-6.406-.014-9.632-.03-33.017-.156-66.672-.1-66.672-15.848C.328 32.689 29.997 0 67 0z"
            transform="translate(33 59)"></path>
        </g>
        <g
          id="Rectangle_2333"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2333"
          transform="translate(90 32)">
          <path stroke="none" d="M0 0H21V34H0z"></path>
          <path d="M4 4H17V30H4z"></path>
        </g>
        <path
          id="Path_62248"
          fill="#fff"
          d="M706.765 3969.066c-7.219 1.231-24.369-4.2-8.618-17.049s3.767-15.386 8.618-13.759 11.271 12.767 10.785 20.268-3.566 9.309-10.785 10.54z"
          data-name="Path 62248"
          transform="translate(-604.413 -3929)"></path>
        <path
          id="primary-2"
          fill={primary}
          d="M706.765 3969.066c-7.219 1.231-24.369-4.2-8.618-17.049s3.767-15.386 8.618-13.759 11.271 12.767 10.785 20.268-3.566 9.309-10.785 10.54z"
          data-name="primary"
          opacity="0.35"
          transform="translate(-604.413 -3929)"></path>
      </g>
    </svg>
  );
}
