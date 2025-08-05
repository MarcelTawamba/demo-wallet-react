import React from 'react';

const MfaPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font } = colors;
  const h = 500;
  const w = 500;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 500 500">
      <defs>
        <clipPath id="b">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H338V338H0z"
            data-name="Rectangle 19"
          />
        </clipPath>
        <clipPath id="c">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H106V105H0z"
            data-name="Rectangle 23"
          />
        </clipPath>
        <clipPath id="a">
          <path d="M0 0H500V500H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" data-name="2fa-simple">
        <g data-name="Group 34" transform="translate(-18.713 -15)">
          <g
            clipPath="url(#b)"
            data-name="Mask Group 11"
            transform="translate(99.713 98)">
            <g transform="translate(25.355 -.232)">
              <path
                fill="#d5d5d5"
                d="M272.718 225.584a170.428 170.428 0 01-40.818 63.588c-20.5 20.015-47.333 35.919-79.769 47.264a24.393 24.393 0 01-7.752 1.369h-.291a24.769 24.769 0 01-4.757-.469 25.718 25.718 0 01-3.27-.892c-32.474-11.327-59.345-27.223-79.861-47.238a170.107 170.107 0 01-40.806-63.576C-1.092 180.889-.154 131.6.6 91.995l.013-.608c.152-3.271.25-6.706.3-10.5a35.8 35.8 0 0133.716-35.074c38.837-2.167 68.88-14.835 94.551-39.857l.224-.206a21.637 21.637 0 0129.376 0l.219.206c25.676 25.023 55.719 37.69 94.556 39.857a35.8 35.8 0 0133.711 35.074c.054 3.819.152 7.25.3 10.5l.008.258c.756 39.681 1.689 89.066-14.856 133.939zm0 0"
                transform="translate(-.264)"
              />
              <path
                d="M243.8 225.583a170.428 170.428 0 01-40.816 63.588c-20.5 20.015-47.333 35.919-79.769 47.264a24.4 24.4 0 01-7.752 1.369V0a21.672 21.672 0 0114.4 5.747l.219.206c25.676 25.022 55.719 37.69 94.556 39.857a35.8 35.8 0 0133.711 35.074c.054 3.819.152 7.25.3 10.5l.008.258c.753 39.684 1.686 89.069-14.857 133.941zm0 0"
                data-name="Path 26"
                opacity="0.3"
                transform="translate(28.657)"
              />
              <path
                fill="#fff"
                d="M216.3 151.9a84.291 84.291 0 01-83.887 84.191h-.3a84.19 84.19 0 010-168.379h.3A84.29 84.29 0 01216.3 151.9zm0 0"
                data-name="Path 27"
                transform="translate(11.704 17.004)"
              />
              <path
                d="M199.348 151.9a84.291 84.291 0 01-83.887 84.191V67.71a84.29 84.29 0 0183.887 84.19zm0 0"
                data-name="Path 28"
                opacity="0.3"
                transform="translate(28.657 17.004)"
              />
            </g>
          </g>
          <g
            clipPath="url(#c)"
            data-name="Mask Group 12"
            transform="translate(215.713 207.886)">
            <g transform="translate(13.061 -.005)">
              <g data-name="Group 33">
                <path
                  d="M84.92 39.439h-6.583v-8.765a30.718 30.718 0 00-61.436 0v8.764h-6.582a2.191 2.191 0 00-2.194 2.192v54.775a8.779 8.779 0 008.777 8.764h61.436a8.779 8.779 0 008.776-8.764V41.63a2.191 2.191 0 00-2.194-2.191zM54.189 85.208a2.193 2.193 0 01-2.181 2.433h-8.777a2.193 2.193 0 01-2.181-2.433l1.384-12.429a8.664 8.664 0 01-3.591-7.048 8.777 8.777 0 0117.553 0 8.664 8.664 0 01-3.591 7.048zm10.983-45.77H30.066v-8.764a17.553 17.553 0 0135.106 0z"
                  data-name="Path 29"
                  transform="translate(-8.125)"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default MfaPlaceholder;
