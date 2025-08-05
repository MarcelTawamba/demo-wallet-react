import * as React from 'react';

export default function Tier4(props) {
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
        <clipPath id="clip-Tier1">
          <path d="M0 0H200V200H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Tier4)">
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
          d="M 0 0 L -18 0 L -18 36 L -37.8 36 V 0 L -54.9 0 L -54 54 L -18 54 L -18 90 L 0 90"
          data-name="Path 62299"
          transform="translate(125 55)"></path>
        <path
          fill={primary}
          d="M 0 0 L -18 0 L -18 36 L -37.8 36 V 0 L -54.9 0 L -54 54 L -18 54 L -18 90 L 0 90"
          opacity="0.35"
          transform="translate(125 55)"></path>
      </g>
    </svg>
  );
}
