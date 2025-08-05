import * as React from 'react';

export default function AboutLight(props) {
  const { width = 150, height = 150, primary } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <defs>
        <clipPath id="a">
          <path
            data-name="Rectangle 3508"
            fill="#fff"
            stroke="#707070"
            d="M0 0h35v35H0z"
          />
        </clipPath>
        <clipPath id="b">
          <path data-name="Rectangle 3510" d="M0 0h35v35H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <g clipPath="url(#b)" data-name="Mask Group 1663">
          <g
            data-name="Ellipse 1120"
            transform="translate(4.725 3.675)"
            fill="none"
            stroke="#fff"
            strokeWidth={1.8}>
            <circle cx={13.825} cy={13.825} r={13.825} stroke="none" />
            <circle cx={13.825} cy={13.825} r={12.925} />
          </g>
          <path
            data-name="Path 62601"
            d="M18.55 13.313a1.711 1.711 0 0 0 1.85-1.718 1.67 1.67 0 0 0-1.85-1.6 1.7 1.7 0 0 0-1.85 1.66 1.7 1.7 0 0 0 1.85 1.658Zm-1.488 11.693h2.975V14.743h-2.975Z"
            fill="#fff"
          />
          <path
            d="M18.55 13.313a1.711 1.711 0 0 0 1.85-1.718 1.67 1.67 0 0 0-1.85-1.6 1.7 1.7 0 0 0-1.85 1.66 1.7 1.7 0 0 0 1.85 1.658Zm-1.488 11.693h2.975V14.743h-2.975Z"
            fill={primary}
            opacity={0.35}
          />
        </g>
      </g>
    </svg>
  );
}
