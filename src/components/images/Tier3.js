import * as React from 'react';

export default function Tier3(props) {
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
        <clipPath id="clip-Tier3">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Tier3)">
        <g fill="none" data-name="Polygon 30">
          <path
            d="M127.073 0a14 14 0 0112 6.8l36.6 61a14 14 0 010 14.406l-36.6 61a14 14 0 01-12 6.8H52.927a14 14 0 01-12-6.8l-36.6-61a14 14 0 010-14.406l36.6-61a14 14 0 0112-6.8z"
            transform="rotate(90 82.5 92.5)"></path>
          <path
            fill="#020d88"
            d="M52.927 8a6.03 6.03 0 00-5.145 2.913l-36.6 61a5.99 5.99 0 000 6.174l36.6 61A6.03 6.03 0 0052.927 142h74.146a6.03 6.03 0 005.145-2.913l36.6-61a5.989 5.989 0 000-6.174l-36.6-61A6.03 6.03 0 00127.073 8H52.927m0-8h74.146a14 14 0 0112.005 6.797l36.6 61a14 14 0 010 14.406l-36.6 61A14 14 0 01127.073 150H52.927a14 14 0 01-12.005-6.797l-36.6-61a14 14 0 010-14.406l36.6-61A14 14 0 0152.927 0z"
            transform="rotate(90 82.5 92.5)"></path>
        </g>
        <path
          fill="#fff"
          d="M35.5-40.255l15.326-17.46V-67.9H3.3v12.61h28.9L18.236-39.479V-29.1h7.178c8.924 0 12.707 3.2 12.707 8.342 0 5.529-4.85 8.73-12.707 8.73a32.977 32.977 0 01-19.4-6.111L-.1-6.111c6.6 4.656 16.4 7.275 25.9 7.275 19.3 0 28.13-10.476 28.13-21.922.002-9.991-6.206-17.557-18.43-19.497z"
          data-name="Path 62301"
          transform="translate(72 135)"></path>
        <path
          fill={primary}
          d="M35.5-40.255l15.326-17.46V-67.9H3.3v12.61h28.9L18.236-39.479V-29.1h7.178c8.924 0 12.707 3.2 12.707 8.342 0 5.529-4.85 8.73-12.707 8.73a32.977 32.977 0 01-19.4-6.111L-.1-6.111c6.6 4.656 16.4 7.275 25.9 7.275 19.3 0 28.13-10.476 28.13-21.922.002-9.991-6.206-17.557-18.43-19.497z"
          opacity="0.35"
          transform="translate(72 135)"></path>
      </g>
    </svg>
  );
}
