import * as React from 'react';

export default function UserVerifySuccess(props) {
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
            id="Rectangle_2585"
            data-name="Rectangle 2585"
            width="100"
            height="100"
          />
        </clipPath>
        <clipPath id="clip-path-2">
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
        <clipPath id="clip-path-3">
          <rect
            id="Rectangle_2399"
            data-name="Rectangle 2399"
            width="40"
            height="40"
            transform="translate(203 283)"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
          />
        </clipPath>
        <clipPath id="clip-path-4">
          <rect
            id="Rectangle_2583"
            data-name="Rectangle 2583"
            width="38"
            height="39"
            transform="translate(997 23861)"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
          />
        </clipPath>
      </defs>
      <g id="Verify-success" clipPath="url(#clip-path)">
        <g id="Verify" clipPath="url(#clip-path)">
          <g id="verify-2" data-name="verify" transform="translate(174 9418)">
            <g
              id="Mask_Group_678"
              data-name="Mask Group 678"
              transform="translate(-286 -9703)"
              clipPath="url(#clip-path-2)">
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
            <g
              id="Mask_Group_679"
              data-name="Mask Group 679"
              transform="translate(-318 -9643)"
              clipPath="url(#clip-path-3)">
              <g id="checklist" transform="translate(195.099 275.099)">
                <circle
                  id="Ellipse_1101"
                  data-name="Ellipse 1101"
                  cx="20"
                  cy="20"
                  r="20"
                  transform="translate(7.901 7.901)"
                  fill="#fff"
                />
                <circle
                  id="success"
                  cx="20"
                  cy="20"
                  r="20"
                  transform="translate(7.901 7.901)"
                  fill="#24a070"
                />
                <path
                  id="Path_62340"
                  data-name="Path 62340"
                  d="M25.949,35.507a1.95,1.95,0,0,1-1.4-.593L18.207,28.38a1.951,1.951,0,1,1,2.8-2.718L25.9,30.7l8.85-9.765a1.952,1.952,0,1,1,2.893,2.62L27.4,34.867a1.954,1.954,0,0,1-1.416.64Z"
                  fill="#fff"
                />
              </g>
            </g>
          </g>
        </g>
        <g
          id="Mask_Group_767"
          data-name="Mask Group 767"
          transform="translate(-1004 -23803)"
          clipPath="url(#clip-path-4)">
          <g id="hourglass_full-24px" transform="translate(997 23861.5)">
            <path
              id="Path_62507"
              data-name="Path 62507"
              d="M0,0H38V38H0Z"
              fill="none"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
