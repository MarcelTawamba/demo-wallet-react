import * as React from 'react';

export default function Product(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 250 250">
      <defs>
        <clipPath id="clip-Product-placeholder">
          <rect width="250" height="250" />
        </clipPath>
      </defs>
      <g id="Product-placeholder" clipPath="url(#clip-Product-placeholder)">
        <g
          id="Rectangle_2218"
          data-name="Rectangle 2218"
          transform="translate(49.5 74.642)"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeWidth="8">
          <path
            d="M0,0H109a0,0,0,0,1,0,0V117a19,19,0,0,1-19,19H19A19,19,0,0,1,0,117V0A0,0,0,0,1,0,0Z"
            stroke="none"
          />
          <path
            d="M8,4h93a4,4,0,0,1,4,4V117a15,15,0,0,1-15,15H19A15,15,0,0,1,4,117V8A4,4,0,0,1,8,4Z"
            fill="none"
          />
        </g>
        <path
          id="Path_62212"
          data-name="Path 62212"
          d="M942.03,487.573v-40.6s2-21.789,26.843-22.252,27.081,22.252,27.081,22.252v40.6"
          transform="translate(-864.5 -385.358)"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          id="Rectangle_2219"
          data-name="Rectangle 2219"
          d="M0,0H85a0,0,0,0,1,0,0V72A19,19,0,0,1,66,91H19A19,19,0,0,1,0,72V0A0,0,0,0,1,0,0Z"
          transform="translate(115.5 119.642)"
          fill="#fff"
        />
        <path
          id="primary"
          d="M0,0H85a0,0,0,0,1,0,0V72A19,19,0,0,1,66,91H19A19,19,0,0,1,0,72V0A0,0,0,0,1,0,0Z"
          transform="translate(115.5 119.642)"
          fill={primary}
          opacity="0.35"
        />
        <path
          id="Path_62213"
          data-name="Path 62213"
          d="M977.233,424.715v17.964s-1.3,9.641-17.524,9.846-17.679-9.846-17.679-9.846V424.715"
          transform="translate(-801.642 -291.358)"
          fill="none"
          stroke="#020d88"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        />
      </g>
    </svg>
  );
}
