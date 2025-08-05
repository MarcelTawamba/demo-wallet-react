import React from 'react';

const LocalAuthPlaceholder = props => {
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
            d="M0 0H363.262V354.649H0z"
            data-name="Rectangle 25"
          />
        </clipPath>
        <clipPath id="a">
          <path d="M0 0H500V500H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" data-name="pin-fingerprint-simple – 1">
        <g data-name="Group 41" transform="translate(3 -77)">
          <g
            clipPath="url(#b)"
            data-name="Mask Group 13"
            transform="translate(65 150)">
            <g transform="translate(15.122)">
              <g>
                <g fill={primary} data-name="Group 36">
                  <path
                    d="M216.818 221.04c-56.387 0-105.861-41.426-105.861-88.652a7.564 7.564 0 00-15.123 0c0 55.1 56.535 103.427 120.984 103.427a7.39 7.39 0 100-14.775z"
                    data-name="Path 31"
                    transform="translate(62.959 96.63)"
                  />
                  <path
                    d="M40.894 45.914a7.73 7.73 0 003.929-1.068C108.8 6.912 191.755 5.534 256.515 40.5a7.641 7.641 0 0010.279-2.893 7.3 7.3 0 00-2.953-10.036 230.572 230.572 0 00-226.875 4.635 7.313 7.313 0 00-2.54 10.151 7.6 7.6 0 006.468 3.557z"
                    data-name="Path 32"
                    transform="translate(12.037)"
                  />
                  <path
                    d="M340.094 110.074C310.809 58.4 245.886 25 174.687 25S38.565 58.4 9.279 110.074a7.305 7.305 0 002.954 10.043 7.663 7.663 0 0010.279-2.886c26.657-47.053 86.4-77.455 152.175-77.455s125.518 30.4 152.175 77.455a7.588 7.588 0 006.617 3.809 7.708 7.708 0 003.663-.923 7.3 7.3 0 002.952-10.043z"
                    data-name="Path 33"
                    transform="translate(-8.333 19.326)"
                  />
                  <path
                    d="M56.79 178.428c0-51.368 38.162-88.652 90.738-88.652 55.116 0 90.738 31.9 90.738 81.264a7.564 7.564 0 0015.123 0c0-57.44-42.548-96.04-105.861-96.04-60.345 0-105.861 44.463-105.861 103.427 0 43.171 15.743 78.905 51.07 115.858a7.673 7.673 0 0010.678.353 7.262 7.262 0 00.369-10.439C71.278 250.19 56.79 217.574 56.79 178.428z"
                    data-name="Path 34"
                    transform="translate(18.826 57.978)"
                  />
                  <path
                    d="M167.9 50C80.278 50 16.67 109.03 16.67 190.366c0 21.932 7.547 42.725 15.7 61.93a7.643 7.643 0 009.881 4 7.337 7.337 0 004.091-9.653c-7.562-17.8-14.548-36.924-14.548-56.273 0-73.949 55.973-125.59 136.107-125.59C245.49 64.776 304 121.944 304 197.754c0 20.366-16.955 36.938-37.807 36.938s-37.807-16.572-37.807-36.938c0-34.8-24.871-59.1-60.492-59.1s-60.492 24.306-60.492 59.1c0 48.207 27.913 88.76 80.71 117.279a7.707 7.707 0 003.663.923 7.577 7.577 0 006.616-3.816 7.3 7.3 0 00-2.951-10.04c-48.382-26.13-72.912-61.236-72.912-104.35 0-30.618 22.788-44.326 45.369-44.326s45.369 13.708 45.369 44.326c0 28.511 23.748 51.713 52.931 51.713s52.931-23.2 52.931-51.714C319.127 113.517 254.115 50 167.9 50z"
                    data-name="Path 35"
                    transform="translate(-1.543 38.652)"
                  />
                </g>
              </g>
            </g>
          </g>
          <g
            fill="none"
            stroke="#707070"
            strokeWidth="10"
            data-name="Group 40"
            transform="translate(54.396 135)">
            <g data-name="Group 38">
              <path d="M46.051 0H.004v44.733" data-name="Path 36" />
              <path d="M0 338.949V385h44.392" data-name="Path 37" />
            </g>
            <g data-name="Group 39" transform="translate(338.949)">
              <path d="M.004 0h46.051v44.733" data-name="Path 36" />
              <path d="M46.051 338.949V385H1.659" data-name="Path 37" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default LocalAuthPlaceholder;
