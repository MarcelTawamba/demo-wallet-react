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
        <clipPath id="clip-pin">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g id="pin" clipPath="url(#clip-pin)">
        <g
          id="Rectangle_2317"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
          data-name="Rectangle 2317"
          transform="translate(4 54)">
          <rect width="193" height="93" stroke="none" rx="46.5"></rect>
          <rect width="185" height="85" x="4" y="4" rx="42.5"></rect>
        </g>
        <path
          id="primary"
          fill={primary}
          d="M-39.591-50.132l-4.067-6.806-9.13 5.478.166-10.126h-7.8l.083 10.126-9.13-5.478-3.984 6.806 9.047 4.98-9.047 4.9 3.984 6.806 9.13-5.478-.085 10.124h7.8l-.166-10.043 9.13 5.395 4.067-6.806-9.047-4.9zm37.682 0l-4.067-6.806-9.13 5.478.166-10.126h-7.8l.083 10.126-9.13-5.478-3.984 6.806 9.047 4.98-9.047 4.9 3.984 6.806 9.13-5.478-.085 10.124h7.8l-.166-10.043 9.13 5.395 4.067-6.806-9.047-4.9zm37.682 0l-4.067-6.806-9.13 5.478.166-10.126h-7.8l.083 10.126-9.13-5.478-3.986 6.806 9.047 4.98-9.047 4.9 3.984 6.806 9.13-5.478L14.94-28.8h7.8l-.166-10.043 9.13 5.395 4.067-6.806-9.047-4.9zm37.682 0l-4.067-6.806-9.13 5.478.166-10.126h-7.8l.083 10.126-9.13-5.478-3.984 6.806 9.047 4.98-9.047 4.9 3.984 6.806 9.13-5.478-.085 10.124h7.8l-.166-10.043 9.13 5.395 4.067-6.806-9.047-4.9z"
          opacity="0.4"
          transform="translate(100 145)"></path>
      </g>
    </svg>
  );
}
