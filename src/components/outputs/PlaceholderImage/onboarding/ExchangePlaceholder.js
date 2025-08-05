import React from 'react';

const ExchangePlaceholder = props => {
  const { width, colors } = props;
  const { primary, font, secondary } = colors;
  const h = 900;
  const w = 900;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 900 900">
      <defs>
        <linearGradient
          id="b"
          x1="0.832"
          x2="0.5"
          y1="0.18"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="c">
          <ellipse
            cx="35.237"
            cy="24.662"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="35.237"
            ry="24.662"
            transform="translate(759.847 219.031)"
          />
        </clipPath>
        <clipPath id="d">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H274V359H0z"
            data-name="Rectangle 121"
            transform="translate(183 330)"
          />
        </clipPath>
        <clipPath id="e">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H590V454H0z"
            data-name="Rectangle 122"
            transform="translate(214 113)"
          />
        </clipPath>
        <clipPath id="f">
          <ellipse
            cx="40.354"
            cy="39.217"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="40.354"
            ry="39.217"
            transform="translate(759.847 219.031)"
          />
        </clipPath>
        <linearGradient
          id="g"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="h"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#80f1fa" />
          <stop offset="1" stopColor="#80f1fa" stopOpacity="0" />
        </linearGradient>
        <clipPath id="a">
          <path d="M0 0H900V900H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.196"
          transform="rotate(-60 1157.33 1681.797)"
        />
        <path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          data-name="primary"
          transform="rotate(-60 1110.43 1657.03)"
        />
        <path
          fill="url(#b)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"
        />
        <g data-name="Group 22">
          <g data-name="Group 21" transform="translate(-18 -151)">
            <path
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 12"
              opacity="0.05"
              transform="rotate(6.02 -5338.434 4127.601)"
            />
            <g data-name="Group 12" transform="translate(-94 71)">
              <g
                data-name="Group 10"
                transform="rotate(6.02 -2772.608 -393.474)">
                <path
                  fill="#fdbb25"
                  d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                  data-name="Path 10"
                  transform="translate(564.486 161.268)"
                />
                <ellipse
                  cx="40.23"
                  cy="23.974"
                  fill="#ffd474"
                  data-name="Ellipse 2"
                  rx="40.23"
                  ry="23.974"
                  transform="translate(562 159)"
                />
              </g>
              <g
                data-name="Group 11"
                transform="rotate(6.02 -2620.114 -397.116)">
                <path
                  fill="#fdbb25"
                  d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                  data-name="Path 10"
                  transform="translate(564.486 161.268)"
                />
                <ellipse
                  cx="40.23"
                  cy="23.974"
                  fill="#ffd474"
                  data-name="Ellipse 2"
                  rx="40.23"
                  ry="23.974"
                  transform="translate(562 159)"
                />
              </g>
            </g>
            <g data-name="Group 13" transform="translate(-94 71)">
              <g
                data-name="Group 11"
                transform="rotate(6.02 -2620.114 -397.116)">
                <path
                  fill="#fdbb25"
                  d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                  data-name="Path 10"
                  transform="translate(564.486 161.268)"
                />
                <ellipse
                  cx="40.23"
                  cy="23.974"
                  fill="#ffd474"
                  data-name="Ellipse 2"
                  rx="40.23"
                  ry="23.974"
                  transform="translate(562 159)"
                />
              </g>
            </g>
          </g>
          <g data-name="Group 20" transform="translate(-28 -151)">
            <path
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 13"
              opacity="0.05"
              transform="rotate(14.98 -2433.023 2971.119)"
            />
            <g data-name="Group 9" transform="rotate(14 -1676.57 910.952)">
              <path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"
              />
              <ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"
              />
            </g>
            <g
              clipPath="url(#c)"
              data-name="Mask Group 4"
              transform="rotate(30 -202.997 341.993)">
              <g data-name="bitcoin (2)" transform="translate(781.208 229.054)">
                <g data-name="Group 19">
                  <g data-name="Group 18">
                    <path
                      fill="#fdbb25"
                      d="M23.351 13.19c2.29-.93 3.528-2.791 3.1-4.657-.53-2.882-5.3-3.97-9.065-4.2V0h-3.709v4.295h-2.492V0h-3.71v4.295H0v2.768h2.783c1.246 0 1.855.267 1.855.993v11.891c0 .993-.689 1.3-1.431 1.3H.371v2.823H7.58v4.39h3.737v-4.39h2.491v4.39h3.632v-4.39h.8c7.633 0 10.178-2.691 10.178-6.356-.066-2.161-2.146-4.02-5.067-4.524zM11.185 7.234h2.65c1.855 0 5.513.229 5.513 2.405.127 1.42-1.3 2.665-3.26 2.844h-4.9l-.003-5.249zm4.108 13.743v-.019h-4.108v-5.726h4.771c1.113 0 5.3.267 5.3 2.405s-1.987 3.341-5.963 3.341z"
                      data-name="Path 18"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
          <g data-name="Group 27" transform="translate(24)">
            <ellipse
              cx="43.23"
              cy="24.974"
              data-name="Ellipse 3"
              opacity="0.09"
              rx="43.23"
              ry="24.974"
              transform="rotate(2.98 -10677.802 4214.078)"
            />
            <g
              clipPath="url(#d)"
              data-name="Mask Group 1"
              transform="translate(-83 -82)">
              <g data-name="Group 603" transform="translate(129.969 298.136)">
                <g data-name="Group 604">
                  <g
                    data-name="Group 146"
                    transform="rotate(-150 164.338 172.334)">
                    <path
                      fill="#5a2c1f"
                      d="M8.977 43.211c-17.294 24.473.747 56.551-4.991 75.179s-7.211 35.444 8.924 45.731c10.552 6.728 20.369 7.358 36.043-3.757s15.42-47.921 35.82-69.073S117.935 9.672 90.219 2.66 45.122 5.209 20.582 1 26.27 18.737 8.977 43.211z"
                      data-name="Path 367"
                      transform="rotate(-36.011 315.477 -15.513)"
                    />
                    <path
                      fill="#e3a976"
                      d="M31.523 79.727a46.163 46.163 0 01-15.233 2.734C8.055 82.443 0 77.249 0 77.249l3.247-63.214L20.788 0z"
                      data-name="Path 126"
                      transform="rotate(-31 187.182 -25.771)"
                    />
                    <path
                      fill="#e3a976"
                      d="M19.507 63.258a134.7 134.7 0 0010.9-26.233c4.1-14.289 5.966-22.845 6.058-26.012.429-14.668-6-10.451-6-10.451l-3.19 4.019S-2.233 63.187.136 73.838c2.838 12.772 19.371-10.58 19.371-10.58z"
                      data-name="Path 127"
                      transform="rotate(-45.972 69.7 26.674)"
                    />
                    <path
                      fill="#e3a976"
                      d="M0 10.968v47.546c0 4.311 2.905 7.806 6.488 7.806l4.075-1.162c3.584 0 5.98-7.15 7.145-20.752s-1.245-33.7-1.245-33.7c0-4.311-5.109-10.96-7.7-10.694l-2.275 3.15C2.905 3.161 0 6.656 0 10.968z"
                      data-name="Path 132"
                      transform="rotate(131 16.416 154.528)"
                    />
                    <path
                      fill="#e3a976"
                      d="M0 8.257l.891 55.249c0 2.7 4.243 7.315 7.676 6.182s4.567-8.262 6.052-10.716C17.6 54.07 13.1 40.94 15.47 32.49a49.142 49.142 0 00.478-23.445c0-3.23 5.821-8.9 1.685-8.9C.312-1.272 0 8.257 0 8.257z"
                      data-name="Path 135"
                      transform="rotate(169 80.697 122.514)"
                    />
                    <path
                      fill="#e3a976"
                      d="M15.112 32.887L0 34.734l8.3-11.915S-1.628 2.788 1.845.392C3.6-.818 7.033.846 11.1 4.444c3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2z"
                      data-name="Path 130"
                      transform="rotate(-59 32.52 18.352)"
                    />
                    <path
                      fill="#e3a976"
                      d="M54.308 124.166a79.366 79.366 0 01-38.55 3.384c-12.544-2.069-2.291 2.008-13.17-26.82C-.426 92.744 15.073 75.293 14.7 64.445 13.744 36.574 0 15.423 0 15.423s64.445-33.066 66.379-2.366a72.2 72.2 0 01-.488 15.633C63.6 43.856 44.211 47.12 54.555 84.249c3.583 45.501 12.616 35.551-.247 39.917z"
                      data-name="Path 125"
                      transform="rotate(-27 332.762 -75.58)"
                    />
                    <path
                      fill="#e3a976"
                      d="M34.769 76.363C33.141 94.708 33.7 72.029 25.8 72.01S0 65.648 0 65.648L13.369 0l17.7 2.233s5.331 55.786 3.7 74.13z"
                      data-name="Path 128"
                      transform="rotate(-31 185.815 -77.222)"
                    />
                    <path
                      fill="#e3a976"
                      d="M17.762 64.473C24.377 47.635 24.454.793 24.454.793L16.909 0S-3 46.268.389 66.134s10.754 15.178 17.373-1.661z"
                      data-name="Path 129"
                      transform="rotate(-36.011 69.31 -50.143)"
                    />
                    <path
                      fill="#e3a976"
                      d="M6.748 19.9L0 14.7 3.116 1.561S10.353-1.621 14.7 1.1c1.759 1.1 3.611 5.2 3.611 5.2s.888 3.707 1 4.847c.028.27.039.561.039.561l-1.407.973s-1.154.8-4.714 3.257A66.716 66.716 0 016.748 19.9z"
                      data-name="Path 131"
                      transform="rotate(-62.025 36.444 -28.433)"
                    />
                    <path
                      fill="#e3a976"
                      d="M28.741 22.721s-7.016-5.439-7.714-10.759C21.021 11.914 19.1 0 19.1 0L0 8.106s1.864 3.818 3.57 7.139a27.154 27.154 0 012.32 6.731z"
                      data-name="Path 361"
                      transform="rotate(-7 1994.807 -1073.79)"
                    />
                    <path
                      d="M0 4.381L.375.593a7.062 7.062 0 017.512 1.19 80.721 80.721 0 018.277 9.222l.041 5.1z"
                      data-name="Path 362"
                      opacity="0.089"
                      transform="rotate(-39 424.444 -86.683)"
                    />
                    <path
                      fill="#e3a976"
                      d="M21.4 57.126c13.269 0 23.431-9.1 23.431-24.582S24.11-5.488 14.277 1.212 3.287 13.608.463 30.3 8.129 57.126 21.4 57.126z"
                      data-name="Path 360"
                      transform="matrix(.92 -.391 .391 .92 138.39 254.191)"
                    />
                    <path
                      fill={primary}
                      d="M76.645 126.863a32.8 32.8 0 01-5.095 1.381c-1.2-5.768-5.734-9.821-12.862-15.169-8.058-6.045-11.5-3.364-17.02-3.917-10.884-1.089-1.771 20.481-4.8 23.343a10.717 10.717 0 01-3.4-.338c-1.71-.928.364-2.935-8.965-27.654-3.015-7.989 7.745-23.281 7.372-34.133C28.345 60.2 0 22.682 0 22.682S22.308 8.521 37.321 5.72C53.982 2.611 65.433-4.86 75.3 4.707c2.978 2.888 18.622 4 18.622 4s-6.824 7.839-8.834 17.52c-1.8 8.693-13.568 34.248-14.05 39.34 6.29 24.228 2.225 28.652.234 42.045a35.731 35.731 0 005.371 19.25z"
                      data-name="primary"
                      transform="rotate(-23.02 377.26 -65.805)"
                    />
                    <path
                      fill="#393939"
                      d="M.094 10.608S-.48 5.532 2.142 8.745a63.876 63.876 0 018.442 14.718c2.18 5.458.279 7.114.279 7.114a6.742 6.742 0 004.965-6.42c.123-5.252-.933-8.155-4.635-14.872S4.886-.305 2.112.026.094 10.608.094 10.608z"
                      data-name="Path 364"
                      transform="rotate(-74.991 24.097 18.487)"
                    />
                    <path
                      fill="#e3a976"
                      d="M31.647 17.06l-20.3-4.674C-2.662 10.451 1.673 10.591.033 2.809c-.619-2.94 7.719-1.483 7.719-1.483L26.32.06c2.393-.514 9.814 2.256 11.45 10.04.623 2.939-3.73 6.447-6.123 6.96z"
                      data-name="Path 133"
                      transform="rotate(-175.988 65.967 108.911)"
                    />
                    <path
                      fill="#e3a976"
                      d="M23.864 3.633l-5.388-1.9S11.191-1.1 8.792.48-1.415-1.294.224 1.113C1.031 2.3 9.032 6.42 10.977 6.569c1.791.138-3.186 2.91-1.427 3.31a51.011 51.011 0 0011.35.821z"
                      data-name="Path 134"
                      transform="rotate(-160 87.557 105.516)"
                    />
                    <path
                      fill="#fafafa"
                      d="M2.129 33.257l13.425-.987c1.176 0 1.655-1.215 1.655-2.39L16.661 3.9c0-1.176-1.978-3.9-3.153-3.9L2.129 1.327A2.129 2.129 0 000 3.456v27.672a2.129 2.129 0 002.129 2.129z"
                      data-name="Path 407"
                      transform="rotate(-12.007 1030.857 -450.197)"
                    />
                    <path
                      fill="#e3a976"
                      d="M49.346 14.47c-7.192 5.322-22.4 6.742-22.4 6.742L3.193 24.7s-5.709-7.033-1.856-7.83c0 0 34.067-16.24 46.07-16.838s9.131 9.118 1.939 14.438z"
                      data-name="Path 136"
                      transform="rotate(-32.005 386.614 -112.48)"
                    />
                    <path
                      fill="#e3a976"
                      d="M25.957 9.476l-4.3 5.051s-4.156 2.1-5.034 1.36 1.524-4.329 1.524-4.329a31.707 31.707 0 01-9.367 1.5c-4.146-.2-5.405-.323-7.207-2.3s-2.377-2.973 0-5.618 4.491-4.1 9.511-4.955S21.656 1.71 21.656 1.71z"
                      data-name="Path 137"
                      transform="rotate(-42 335.89 -37.579)"
                    />
                  </g>
                  <path
                    fill="#5a2c1f"
                    d="M268.783 158.889c3.544 6.387-33.873 10.113-43.217 33.077-7.245 10.383-6.862 4.562-6.734 0 .234-8.36 7.715-31.754 14.94-36.926 10.979-7.86 31.467-2.54 35.011 3.849z"
                    data-name="Path 366"
                    transform="translate(-40.896 -97.861)"
                  />
                  <path
                    fill="#393939"
                    d="M0 11.807S2.981 3.22 11.529 9.465s-2.6 11.269-2.6 11.269 11.8-1.673 11.926-6.926-4.5-9.162-4.5-9.162S9.835-.315 7.061.016 0 11.807 0 11.807z"
                    data-name="Path 408"
                    transform="rotate(135 20.275 223.215)"
                  />
                </g>
              </g>
            </g>
          </g>
          <g
            clipPath="url(#e)"
            data-name="Mask Group 2"
            transform="translate(96 -92)">
            <g data-name="Group 13" transform="translate(-442.353 -68.4)">
              <path
                fill={primary}
                stroke={primary}
                strokeWidth="1.352"
                d="M868.95 233.382s-13.516-2.1-18.189 1.829-3.706 6.937-3.706 6.937l197.865 330.989 12.372 6.961s11.429 5.67 21.641 4.151 16.273-11.112 16.273-11.112l2.7-170.654c.193-5.009.134-35.361 0-35.889-2.238-8.247-7.133-12.254-7.133-12.254z"
                data-name="primary"
              />
              <path
                stroke={primary}
                strokeWidth="4"
                d="M868.95 233.382s-13.516-2.1-18.189 1.829-3.706 6.937-3.706 6.937l197.865 330.989 12.372 6.961s11.429 5.67 21.641 4.151 15.907-14.9 15.907-14.9l3.065-166.864c.193-5.009.134-35.361 0-35.889-2.238-8.247-7.133-12.254-7.133-12.254z"
                opacity="0.226"
              />
              <g data-name="Group 2" transform="rotate(10 -908.526 1916.188)">
                <path
                  fill="#fdbb25"
                  d="M38.179 0C59.065 0 76 17.86 76 39.893S59.069 79.787 38.181 79.787-1.487 58.93-1.487 36.9 17.295 0 38.179 0z"
                  data-name="Path 10"
                  transform="translate(769.601 216.04)"
                />
                <path
                  fill="#ffd474"
                  d="M40.354 0c22.287 0 40.355 17.558 40.355 39.217s-14.941 37.44-37.228 37.44S5.194 57.22 5.194 35.561 18.067 0 40.354 0z"
                  data-name="Ellipse 2"
                  transform="translate(759.847 219.031)"
                />
                <g clipPath="url(#f)" data-name="Mask Group 3">
                  <g
                    data-name="bitcoin (2)"
                    transform="translate(760.984 219.031)">
                    <g data-name="Group 17">
                      <g data-name="Group 16">
                        <path
                          fill="#fdbb25"
                          d="M49.781 37.3a7.166 7.166 0 003.551-7.4c-.607-4.583-6.071-6.314-10.381-6.678V16.33H38.7v6.83h-2.852v-6.83H31.6v6.83h-8.56v4.4h3.187c1.427 0 2.125.425 2.125 1.578V48.05c0 1.578-.789 2.064-1.639 2.064h-3.249v4.492h8.256v6.981H36v-6.98h2.853v6.981h4.159v-6.981h.911c8.742 0 11.656-4.28 11.656-10.108a7.558 7.558 0 00-5.798-7.199zm-13.933-9.47h3.035c2.125 0 6.314.364 6.314 3.825a4.281 4.281 0 01-3.734 4.523h-5.615v-8.343zm4.7 21.855v-.03h-4.7v-9.102h5.464c1.275 0 6.071.425 6.071 3.825s-2.277 5.311-6.83 5.311z"
                          data-name="Path 17"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g data-name="Group 2" transform="rotate(10 533.021 1542.442)">
                <path
                  fill="#fdbb25"
                  d="M38.179 0C59.065 0 76 17.86 76 39.893S59.069 79.787 38.181 79.787-1.487 58.93-1.487 36.9 17.295 0 38.179 0z"
                  data-name="Path 10"
                  transform="translate(769.601 216.04)"
                />
                <path
                  fill="#ffd474"
                  d="M40.354 0c22.287 0 40.355 17.558 40.355 39.217s-14.941 37.44-37.228 37.44S5.194 57.22 5.194 35.561 18.067 0 40.354 0z"
                  data-name="Ellipse 2"
                  transform="translate(759.847 219.031)"
                />
                <g clipPath="url(#f)" data-name="Mask Group 3">
                  <g
                    data-name="bitcoin (2)"
                    transform="translate(760.984 219.031)">
                    <g data-name="Group 17">
                      <g data-name="Group 16">
                        <path
                          fill="#fdbb25"
                          d="M49.781 37.3a7.166 7.166 0 003.551-7.4c-.607-4.583-6.071-6.314-10.381-6.678V16.33H38.7v6.83h-2.852v-6.83H31.6v6.83h-8.56v4.4h3.187c1.427 0 2.125.425 2.125 1.578V48.05c0 1.578-.789 2.064-1.639 2.064h-3.249v4.492h8.256v6.981H36v-6.98h2.853v6.981h4.159v-6.981h.911c8.742 0 11.656-4.28 11.656-10.108a7.558 7.558 0 00-5.798-7.199zm-13.933-9.47h3.035c2.125 0 6.314.364 6.314 3.825a4.281 4.281 0 01-3.734 4.523h-5.615v-8.343zm4.7 21.855v-.03h-4.7v-9.102h5.464c1.275 0 6.071.425 6.071 3.825s-2.277 5.311-6.83 5.311z"
                          data-name="Path 17"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g data-name="Group 2" transform="rotate(-10 1471.408 141.568)">
                <path
                  fill="#fdbb25"
                  d="M41.285 0c22.521 0 40.777 17.86 40.777 39.893S63.81 79.787 41.286 79.787-1.487 58.93-1.487 36.9 18.765 0 41.285 0z"
                  data-name="Path 10"
                  transform="translate(763.536 216.04)"
                />
                <ellipse
                  cx="40.354"
                  cy="39.217"
                  fill="#ffd474"
                  data-name="Ellipse 2"
                  rx="40.354"
                  ry="39.217"
                  transform="translate(759.847 219.031)"
                />
                <g clipPath="url(#f)" data-name="Mask Group 3">
                  <g
                    data-name="bitcoin (2)"
                    transform="translate(760.984 219.031)">
                    <g data-name="Group 17">
                      <g data-name="Group 16">
                        <path
                          fill="#fdbb25"
                          d="M49.781 37.3a7.166 7.166 0 003.551-7.4c-.607-4.583-6.071-6.314-10.381-6.678V16.33H38.7v6.83h-2.852v-6.83H31.6v6.83h-8.56v4.4h3.187c1.427 0 2.125.425 2.125 1.578V48.05c0 1.578-.789 2.064-1.639 2.064h-3.249v4.492h8.256v6.981H36v-6.98h2.853v6.981h4.159v-6.981h.911c8.742 0 11.656-4.28 11.656-10.108a7.558 7.558 0 00-5.798-7.199zm-13.933-9.47h3.035c2.125 0 6.314.364 6.314 3.825a4.281 4.281 0 01-3.734 4.523h-5.615v-8.343zm4.7 21.855v-.03h-4.7v-9.102h5.464c1.275 0 6.071.425 6.071 3.825s-2.277 5.311-6.83 5.311z"
                          data-name="Path 17"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <path
                fill="#fff"
                d="M1630.063 417.28l209.524 79.811s12.3 2.993 18.949 9.407c3.651 3.518 2.664 8.194 3.275 14.708 1.627 17.326.769 9.4.769 9.4L1597.447 452.7z"
                data-name="Path 11"
                transform="rotate(7 2580.922 -5894.77)"
              />
              <path
                d="M1630.063 417.28l209.524 79.811s12.3 2.993 18.949 9.407c3.651 3.518 2.664 8.194 3.275 14.708 1.627 17.326.769 9.4.769 9.4l-239.78-68.029z"
                data-name="Path 11"
                transform="rotate(7 2343.85 -5880.27)"
              />
              <path
                fill={primary}
                d="M1532.469 249.681L1738.9 360.795s8.626 3.691 9.38 10.851 0 23.34 0 23.34v163.48a40.469 40.469 0 01-4.531 23.728c-6.463 11.492-19.906 0-19.906 0l-172.667-101.87c-2.939-2.772-8.871-5.2-13.5-11.1a26.162 26.162 0 01-5.2-12.551z"
                data-name="primary"
                transform="translate(-686.425 -8.631)"
              />
              <g data-name="Group 5" transform="translate(-52.729 -100.051)">
                <path
                  fill={primary}
                  d="M1817.119 564.891l37.092-18.089v43.986l-34.429 18.022z"
                  data-name="primary"
                  transform="translate(-704.411 -5.408)"
                />
              </g>
              <g data-name="Group 26" transform="translate(-6 10)">
                <path
                  fill="#fff"
                  d="M1787.7 566.1c1.717-18.808 17.6-17.178 17.6-17.178l33.842 7.271v44.866l-36.894-12.993s-16.269-3.154-14.548-21.966z"
                  opacity="0.169"
                  transform="translate(-771.327 -107.476)"
                />
              </g>
              <circle
                cx="11.499"
                cy="11.499"
                r="11.499"
                fill="#fff"
                data-name="Ellipse 1"
                transform="rotate(-53.98 971.323 -758.577)"
              />
            </g>
          </g>
        </g>
        <path
          d="M1003.139 623.091s-11.6-13.844 1.77-25.761 29.635-5.879 29.635-5.879l237.715 107.658s13.226 11.011 3.606 23.8-32.072 9.875-32.072 9.875z"
          data-name="Path 11"
          opacity="0.05"
          transform="rotate(6.02 2312.613 -4232.084)"
        />
        <g data-name="Group 29" transform="rotate(-12.04 775.812 610.37)">
          <path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 15"
            opacity="0.05"
            transform="rotate(14.98 -1977.23 2502.019)"
          />
          <g data-name="Group 8" transform="rotate(14 -1176.754 403.157)">
            <path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"
            />
            <ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"
            />
          </g>
        </g>
        <g data-name="Group 30">
          <ellipse
            cx="65.5"
            cy="68"
            fill="url(#g)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(25 161)"
          />
          <g
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(368 334)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <circle cx="17.5" cy="17.5" r="12.5" />
          </g>
        </g>
        <g>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 9"
            opacity="0.544"
            transform="translate(102 732)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <ellipse
            cx="26"
            cy="27"
            fill="url(#h)"
            data-name="Ellipse 7"
            rx="26"
            ry="27"
            transform="rotate(68 40.374 801.98)"
          />
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(213 108)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <circle cx="17.5" cy="17.5" r="12.5" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default ExchangePlaceholder;
