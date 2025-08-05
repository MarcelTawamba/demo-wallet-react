import * as React from 'react';

export default function Document(props) {
  const { width = 150, height = 150, primary } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_2308"
            data-name="Rectangle 2308"
            width="180"
            height="180"
            transform="translate(10 10)"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
          />
        </clipPath>
        <clipPath id="clip-Documents">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g id="Documents" clipPath="url(#clip-Documents)">
        <g
          id="Path_62298"
          data-name="Path 62298"
          transform="translate(22 8)"
          fill="none">
          <path
            d="M13,0H123.5L160,26.581V172a13,13,0,0,1-13,13H13A13,13,0,0,1,0,172V13A13,13,0,0,1,13,0Z"
            stroke="none"
          />
          <path
            d="M 13 8 C 10.24299621582031 8 8 10.24299621582031 8 13 L 8 172 C 8 174.7570037841797 10.24299621582031 177 13 177 L 147 177 C 149.7570037841797 177 152 174.7570037841797 152 172 L 152 30.65167236328125 L 120.8953552246094 8 L 13 8 M 13 0 L 123.499626159668 0 L 160 26.58106994628906 L 160 172 C 160 179.1796875 154.1796875 185 147 185 L 13 185 C 5.820281982421875 185 0 179.1796875 0 172 L 0 13 C 0 5.820281982421875 5.820281982421875 0 13 0 Z"
            stroke="none"
            fill="#020d88"
          />
        </g>
        <path
          id="Path_62297"
          data-name="Path 62297"
          d="M1537.588,4774.606v36.881h40.2v-11.97l-33.623-24.911Z"
          transform="translate(-1399.581 -4761.686)"
          fill="none"
          stroke="#020d88"
          strokeWidth="8"
        />
        <g id="Group_1516" data-name="Group 1516" transform="translate(0 11)">
          <rect
            id="Rectangle_2389"
            data-name="Rectangle 2389"
            width="66"
            height="20"
            rx="4"
            transform="translate(37 27)"
            fill="#fff"
          />
          <rect
            id="Rectangle_2390"
            data-name="Rectangle 2390"
            width="126"
            height="20"
            rx="4"
            transform="translate(37 60)"
            fill="#fff"
          />
          <rect
            id="Rectangle_2391"
            data-name="Rectangle 2391"
            width="103"
            height="20"
            rx="4"
            transform="translate(37 93)"
            fill="#fff"
          />
        </g>
        <g id="primary" transform="translate(0 11)" opacity="0.35">
          <rect
            id="Rectangle_2389-2"
            data-name="Rectangle 2389"
            width="66"
            height="20"
            rx="4"
            transform="translate(37 27)"
            fill={primary}
          />
          <rect
            id="Rectangle_2390-2"
            data-name="Rectangle 2390"
            width="126"
            height="20"
            rx="4"
            transform="translate(37 60)"
            fill={primary}
          />
          <rect
            id="Rectangle_2391-2"
            data-name="Rectangle 2391"
            width="103"
            height="20"
            rx="4"
            transform="translate(37 93)"
            fill={primary}
          />
        </g>
      </g>
    </svg>
  );
}
