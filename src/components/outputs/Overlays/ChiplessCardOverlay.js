import React from 'react';

export default function ChiplessCardOverlay(props) {
  const { width = 330 } = props;
  const w = 330;
  const h = 182;

  const height = h * (width / w);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 330.599 181.644">
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="0.984"
          x2="0.011"
          y1="0.027"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0.333"></stop>
          <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="0.072"
          x2="1.03"
          y1="1"
          y2="0.5"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0"></stop>
          <stop offset="1" stopColor="#fff" stopOpacity="0.502"></stop>
        </linearGradient>
      </defs>
      <path
        fill="url(#linear-gradient)"
        d="M2219.422 9046v178.522s-163.832 18.209-255.858-33.332-73.043-145.19-73.043-145.19z"
        data-name="Path 452"
        transform="translate(-1888.901 -9046)"></path>
      <path
        fill="url(#linear-gradient-2)"
        d="M2050.178 9154.387v55.7h-165.9s70.263 2.762 110.329-15.08 55.571-40.62 55.571-40.62z"
        data-name="Path 453"
        opacity="0.374"
        transform="translate(-1719.579 -9030.337)"></path>
    </svg>
  );
}
