import React from 'react';

export default function CardOverlay(props) {
  const { w = 330, h = 182 } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 241.326 105.002">
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="0.984"
          y1="0.027"
          x2="0.011"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0.333" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        id="card-overlay-web"
        d="M2130.227,9046v103.2s-119.62,10.525-186.811-19.266S1890.083,9046,1890.083,9046Z"
        transform="translate(-1888.901 -9045.998)"
        fill="url(#linear-gradient)"
      />
    </svg>
  );
}
