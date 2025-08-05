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
        <clipPath id="clip-phone">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-phone)">
        <g data-name="phone" transform="translate(-310 -177)">
          <g fill="none" data-name="Path 62197">
            <path
              d="M14.517 0h80.329a14.765 14.765 0 0114.517 15v170a14.765 14.765 0 01-14.517 15H14.517A14.765 14.765 0 010 185V15A14.765 14.765 0 0114.517 0z"
              transform="translate(355.636 177)"></path>
            <path
              fill="#020d88"
              d="M14.517 8C10.924 8 8 11.14 8 15v170c0 3.86 2.924 7 6.517 7h80.33c3.593 0 6.517-3.14 6.517-7V15c0-3.86-2.924-7-6.518-7H14.517m0-8h80.33c8.017 0 14.517 6.716 14.517 15v170c0 8.284-6.5 15-14.518 15H14.517C6.5 200 0 193.284 0 185V15C0 6.716 6.5 0 14.517 0z"
              transform="translate(355.636 177)"></path>
          </g>
          <rect
            width="49"
            height="15"
            fill="#020d88"
            data-name="Rectangle 2207"
            rx="7.5"
            transform="translate(386 177)"></rect>
          <rect
            width="83"
            height="78"
            fill={primary}
            opacity="0.35"
            rx="8"
            transform="translate(369 238)"></rect>
          <path
            fill="#020d88"
            d="M49.228 36.695l-6.992-6.978a4.655 4.655 0 00-7.742 1.744A4.76 4.76 0 0129 34.452c-4.995-1.246-11.737-7.725-12.986-12.958a4.515 4.515 0 013-5.482 4.637 4.637 0 001.748-7.725l-6.995-6.979a5 5 0 00-6.743 0L2.28 6.043c-4.745 4.984.5 18.192 12.237 29.9s24.972 17.199 29.966 12.215l4.745-4.735a4.969 4.969 0 000-6.728z"
            data-name="Path 62199"
            transform="translate(384.461 252)"></path>
        </g>
      </g>
    </svg>
  );
}
