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
        <clipPath id="clip-transport">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-transport)">
        <path
          fill={primary}
          d="M2016.031 198.814h87.834s16.37-25.607 14.078-25.607-31.213-11.97-56.691-5.569-45.221 31.176-45.221 31.176z"
          opacity="0.35"
          transform="translate(-1960 -109)"></path>
        <path
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          d="M9.184 132.553h19.611s1.063-18.2 19.777-18.943 20.1 18.943 20.1 18.943h63.384s.691-19.046 19.373-18.943 19.13 18.943 19.13 18.943h19.3s.7-25.958 0-38.772-3.246-14.021-12.406-20.291-26.1-16.654-58.824-16.946-63.544 29.68-63.544 29.68-22.019 4.72-34.21 9.443-11.691 9.642-11.691 9.642z"
          data-name="Path 62210"></path>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 34"
          transform="translate(27 110)">
          <circle cx="22" cy="22" r="22" stroke="none"></circle>
          <circle cx="22" cy="22" r="18"></circle>
        </g>
        <g
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Ellipse 35"
          transform="translate(129 110)">
          <circle cx="22" cy="22" r="22" stroke="none"></circle>
          <circle cx="22" cy="22" r="18"></circle>
        </g>
      </g>
    </svg>
  );
}
