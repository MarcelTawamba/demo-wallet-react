import * as React from 'react';

export default function UserVerifyPending(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 100 100">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_2398"
            data-name="Rectangle 2398"
            width="90"
            height="100"
            transform="translate(113 283)"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
          />
        </clipPath>
        <clipPath id="clip-Verify-pending">
          <rect width="100" height="100" />
        </clipPath>
      </defs>
      <g id="Verify-pending" clipPath="url(#clip-Verify-pending)">
        <g
          id="Mask_Group_678"
          data-name="Mask Group 678"
          transform="translate(-108 -283)"
          clipPath="url(#clip-path)">
          <path
            id="user-solid_1_"
            data-name="user-solid (1)"
            d="M39.375,45a22.5,22.5,0,1,0-22.5-22.5A22.5,22.5,0,0,0,39.375,45Zm15.75,5.625H52.189a30.6,30.6,0,0,1-25.629,0H23.625A23.631,23.631,0,0,0,0,74.25v7.313A8.44,8.44,0,0,0,8.438,90H70.313a8.44,8.44,0,0,0,8.438-8.435V74.25A23.631,23.631,0,0,0,55.125,50.625Z"
            transform="translate(118.625 290)"
            fill="none"
            stroke="#020d88"
            strokeWidth="5"
          />
        </g>
        <path
          id="Path_62509"
          data-name="Path 62509"
          d="M9.5,3.167V16.273h.02l-.02.022,8.19,8.716L9.5,33.748l.02.022H9.5V46.854H34.069V33.77h-.02l.02-.022-8.19-8.738,8.19-8.716-.02-.022h.02V3.167Z"
          transform="translate(62.431 53.146)"
          fill="#fff"
        />
        <path
          id="primary"
          d="M9.5,3.167V16.273h.02l-.02.022,8.19,8.716L9.5,33.748l.02.022H9.5V46.854H34.069V33.77h-.02l.02-.022-8.19-8.738,8.19-8.716-.02-.022h.02V3.167Z"
          transform="translate(62.431 53.146)"
          fill={primary}
          opacity="0.35"
        />
      </g>
    </svg>
  );
}
