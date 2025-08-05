import React from 'react';

const OtpPlaceholder = props => {
  const { width = 500, height = 500, colors } = props;
  const { primary } = colors;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_2380"
            data-name="Rectangle 2380"
            width="75"
            height="75"
            transform="translate(63 63)"
            fill="#fff"
            stroke="#707070"
            stroke-width="1"
          />
        </clipPath>
        <clipPath id="clip-OTP">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g id="OTP" clipPath="url(#clip-OTP)">
        <g id="data" transform="translate(-91 -177)">
          <g
            id="Path_62197"
            data-name="Path 62197"
            transform="translate(136.636 177)"
            fill="none">
            <path
              d="M14.517,0H94.846a14.765,14.765,0,0,1,14.517,15V185a14.765,14.765,0,0,1-14.517,15H14.517A14.765,14.765,0,0,1,0,185V15A14.765,14.765,0,0,1,14.517,0Z"
              stroke="none"
            />
            <path
              d="M 14.51731109619141 8 C 10.92364501953125 8 8.000015258789062 11.14019775390625 8.000015258789062 15 L 8.000015258789062 185 C 8.000015258789062 188.8598022460938 10.92364501953125 192 14.51731109619141 192 L 94.84648132324219 192 C 98.44014739990234 192 101.3638153076172 188.8598022460938 101.3638153076172 185 L 101.3638153076172 15 C 101.3638153076172 11.14019775390625 98.44014739990234 8 94.84648132324219 8 L 14.51731109619141 8 M 14.51731109619141 0 L 94.84648132324219 0 C 102.8641815185547 0 109.3638076782227 6.715728759765625 109.3638076782227 15 L 109.3638076782227 185 C 109.3638076782227 193.2842712402344 102.8641815185547 200 94.84648132324219 200 L 14.51731109619141 200 C 6.499610900878906 200 1.52587890625e-05 193.2842712402344 1.52587890625e-05 185 L 1.52587890625e-05 15 C 1.52587890625e-05 6.715728759765625 6.499610900878906 0 14.51731109619141 0 Z"
              stroke="none"
              fill="#020d88"
            />
          </g>
          <rect
            id="Rectangle_2207"
            data-name="Rectangle 2207"
            width="49"
            height="15"
            rx="7.5"
            transform="translate(167 177)"
            fill="#020d88"
          />
        </g>
        <g
          id="Mask_Group_611"
          data-name="Mask Group 611"
          clipPath="url(#clip-path)">
          <g id="https-24px" transform="translate(63 63)">
            <path
              id="Path_62277"
              data-name="Path 62277"
              d="M0,0H75V75H0Z"
              fill="none"
            />
          </g>
        </g>
        <path
          id="primary"
          d="M56.25,25H53.125V18.75a15.625,15.625,0,0,0-31.25,0V25H18.75a6.268,6.268,0,0,0-6.25,6.25V62.5a6.268,6.268,0,0,0,6.25,6.25h37.5A6.268,6.268,0,0,0,62.5,62.5V31.25A6.268,6.268,0,0,0,56.25,25Zm-9.062,0H27.812V18.75a9.688,9.688,0,0,1,19.375,0Z"
          transform="translate(62.5 64.063)"
          fill={primary}
          opacity="0.4"
        />
      </g>
    </svg>
  );
};

export default OtpPlaceholder;
