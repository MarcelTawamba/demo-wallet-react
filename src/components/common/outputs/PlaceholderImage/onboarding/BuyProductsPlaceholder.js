import React from 'react';

const BuyProductsPlaceholder = props => {
  const { width, colors } = props;
  const { primary } = colors;
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
          id="linear-gradient"
          x1="0.832"
          x2="0.5"
          y1="0.18"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff"></stop>
          <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={primary}></stop>
          <stop offset="1" stopColor={primary} stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="linear-gradient-3"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#80f1fa"></stop>
          <stop offset="1" stopColor="#80f1fa" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient
          id="linear-gradient-4"
          x1="0.5"
          x2="0.448"
          y2="1.206"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0"></stop>
          <stop offset="1" stopColor="#fff"></stop>
        </linearGradient>
        <clipPath id="clip-path">
          <ellipse
            cx="35.237"
            cy="24.662"
            fill="#ffd474"
            data-name="Ellipse 2"
            rx="35.237"
            ry="24.662"
            transform="translate(759.847 219.031)"></ellipse>
        </clipPath>
        <clipPath id="clip-path-2">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H29V31H0z"
            data-name="Rectangle 19"
            transform="translate(24 330)"></path>
        </clipPath>
        <clipPath id="clip-Buy_products">
          <path d="M0 0H900V900H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Buy_products)" data-name="Buy products">
        <path
          fill="#cdd2d8"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.362-3.729 9.793-2.352 5.268 2.352 5.268 2.352l-2.439 291.837a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.4 75.2a36.742 36.742 0 01-6.781-3.953c-2.785-2.2-2.263-7.543-2.263-7.543l.351-276.722s-.392-7.131 1.737-11.968z"
          data-name="Path 22"
          transform="translate(-2103 -2515)"></path>
        <path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.196"
          transform="rotate(-60 1157.33 1681.797)"></path>
        <path
          fill={primary}
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          data-name="primary"
          transform="rotate(-60 1110.43 1657.03)"></path>
        <path
          fill="url(#linear-gradient)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"></path>
        <path
          d="M1001.354 609.251s-7.164-8.068 1.093-15.013 18.3-3.426 18.3-3.426l146.829 62.74s8.169 6.417 2.227 13.867-19.81 5.755-19.81 5.755z"
          data-name="Path 11"
          opacity="0.05"
          transform="rotate(-53.98 553.269 1414.266)"></path>
        <g data-name="Group 30" transform="translate(8 -4)">
          <ellipse
            cx="65.5"
            cy="68"
            fill="url(#linear-gradient-2)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(707 126)"></ellipse>
          <g
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(368 334)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none"></circle>
            <circle cx="17.5" cy="17.5" r="12.5"></circle>
          </g>
          <g
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(78 176)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none"></circle>
            <circle cx="17.5" cy="17.5" r="12.5"></circle>
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
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none"></circle>
            <circle cx="22.5" cy="22.5" r="17.5"></circle>
          </g>
          <ellipse
            cx="26"
            cy="27"
            fill="url(#linear-gradient-3)"
            data-name="Ellipse 7"
            rx="26"
            ry="27"
            transform="rotate(68 40.374 801.98)"></ellipse>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none"></circle>
            <circle cx="22.5" cy="22.5" r="17.5"></circle>
          </g>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none"></circle>
            <circle cx="22.5" cy="22.5" r="17.5"></circle>
          </g>
          <g
            fill="none"
            stroke="#80f1fa"
            strokeWidth="10"
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(276 32)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none"></circle>
            <circle cx="17.5" cy="17.5" r="12.5"></circle>
          </g>
        </g>
        <path
          fill="#e1e9f2"
          d="M2260.638 2707.244a17.291 17.291 0 016.782-7.376l119.414-69.965s5.6-4.094 10.189-2.8 3.463 11.377 3.463 11.377l-1.03 283.257a11.561 11.561 0 01-1.168 5.49 19.369 19.369 0 01-4.294 5l-126.422 72.36s-4 2.2-6.781 0-2.242-8.652-2.242-8.652l.351-276.722s-.391-7.132 1.738-11.969z"
          data-name="Path 19"
          transform="translate(-2099 -2513)"></path>
        <g data-name="Group 31">
          <path
            fill="#80f1fa"
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            transform="translate(-2099 -2513)"></path>
          <path
            fill="url(#linear-gradient-4)"
            d="M2265.946 2711.94c2.488-4.137 7.424-6.622 7.424-6.622l110.954-63.826s5.907-3.743 8.571-2.323 2.083 8 2.083 8v266.89s.245 5.962-1.264 8.919-7.556 6.5-7.556 6.5l-112.1 64.54s-6.528 4.666-9.053 2.995-1.588-11.416-1.588-11.416v-263.73s.041-5.79 2.529-9.927z"
            data-name="gradient-overlay"
            transform="translate(-2099 -2513)"></path>
        </g>
        <path
          fill="#e1e9f2"
          d="M2305.171 2684.971v4.673s.053 1.746 1.027 2.069 2.868-.775 2.868-.775l41.545-23.1a6.737 6.737 0 002.156-2.005 5.005 5.005 0 00.541-2.625v-6.181z"
          data-name="Path 21"
          transform="translate(-2099 -2513)"></path>
        <g data-name="Group 32" transform="translate(48 -4)">
          <path
            fill="#dee1e5"
            d="M1528.388 264.662c5.885-5.023 14.731-1.03 14.731-1.03l154.535 74.422s18.3 5.074 19.359 17.983 2.352 33.631 2.352 33.631l6.2 88.688s2.858 13-4.975 19.246-17.1 1.2-17.1 1.2l-154.715-77c-2.4-1.934-8.313-3.032-12.394-9.355s-3.929-15.938-3.929-15.938l-8.252-118.051s-1.7-8.773 4.188-13.796z"
            data-name="primary"
            transform="rotate(4.01 2256.063 -14544.895)"></path>
        </g>
        <ellipse
          cx="43.23"
          cy="24.974"
          data-name="Ellipse 11"
          opacity="0.09"
          rx="43.23"
          ry="24.974"
          transform="rotate(177 290.569 309.228)"></ellipse>
        <g data-name="Group 21" transform="translate(22 -178)">
          <path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 12"
            opacity="0.05"
            transform="rotate(6.02 -5338.434 4127.601)"></path>
          <g data-name="Group 12" transform="translate(-94 71)">
            <g data-name="Group 10" transform="rotate(6.02 -2772.608 -393.474)">
              <path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></path>
              <ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></ellipse>
            </g>
            <g data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></path>
              <ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></ellipse>
            </g>
          </g>
          <g data-name="Group 13" transform="translate(-94 71)">
            <g data-name="Group 11" transform="rotate(6.02 -2620.114 -397.116)">
              <path
                fill="#fdbb25"
                d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
                data-name="Path 10"
                transform="translate(564.486 161.268)"></path>
              <ellipse
                cx="40.23"
                cy="23.974"
                fill="#ffd474"
                data-name="Ellipse 2"
                rx="40.23"
                ry="23.974"
                transform="translate(562 159)"></ellipse>
            </g>
          </g>
        </g>
        <g data-name="Group 20" transform="translate(12 -178)">
          <path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 13"
            opacity="0.05"
            transform="rotate(14.98 -2433.023 2971.119)"></path>
          <g data-name="Group 9" transform="rotate(14 -1676.57 910.952)">
            <path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"></path>
            <ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"></ellipse>
          </g>
          <g
            clipPath="url(#clip-path)"
            data-name="Mask Group 4"
            transform="rotate(30 -202.997 341.993)">
            <g data-name="bitcoin (2)" transform="translate(781.208 229.054)">
              <g data-name="Group 19">
                <g data-name="Group 18">
                  <path
                    fill="#fdbb25"
                    d="M23.351 13.19c2.29-.93 3.528-2.791 3.1-4.657-.53-2.882-5.3-3.97-9.065-4.2V0h-3.709v4.295h-2.492V0h-3.71v4.295H0v2.768h2.783c1.246 0 1.855.267 1.855.993v11.891c0 .993-.689 1.3-1.431 1.3H.371v2.823H7.58v4.39h3.737v-4.39h2.491v4.39h3.632v-4.39h.8c7.633 0 10.178-2.691 10.178-6.356-.066-2.161-2.146-4.02-5.067-4.524zM11.185 7.234h2.65c1.855 0 5.513.229 5.513 2.405.127 1.42-1.3 2.665-3.26 2.844h-4.9l-.003-5.249zm4.108 13.743v-.019h-4.108v-5.726h4.771c1.113 0 5.3.267 5.3 2.405s-1.987 3.341-5.963 3.341z"
                    data-name="Path 18"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
        <g data-name="Group 29" transform="rotate(-12.04 667.555 406.612)">
          <path
            d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
            data-name="Path 15"
            opacity="0.05"
            transform="rotate(14.98 -1977.23 2502.019)"></path>
          <g data-name="Group 8" transform="rotate(14 -1176.754 403.157)">
            <path
              fill="#fdbb25"
              d="M39.573 0C60.86 0 78.117 11.04 78.117 24.658S60.86 49.316 39.573 49.316-1.974 38.967-1.974 25.349 18.286 0 39.573 0z"
              data-name="Path 10"
              transform="translate(564.486 161.268)"></path>
            <ellipse
              cx="40.23"
              cy="23.974"
              fill="#ffd474"
              data-name="Ellipse 2"
              rx="40.23"
              ry="23.974"
              transform="translate(562 159)"></ellipse>
          </g>
        </g>
        <path
          fill={primary}
          d="M5502.691 2771.159s5.75 9.28 16.467 7.161 10.039-11.479 10.039-11.479 9.593-4.682 16.84 1.439a79.982 79.982 0 0110.341 10.041l-2.6 25.536-7.736-3.678v63.5l-51.567 20.588v-70.608l-4.133 6.439-15.964-19.918s3.053-3.9 9.954-16.633 18.359-12.388 18.359-12.388z"
          data-name="Path 51"
          transform="translate(-5279.754 -2543)"></path>
        <g data-name="Group 51">
          <ellipse
            cx="7"
            cy="9"
            fill={primary}
            data-name="Ellipse 14"
            rx="7"
            ry="9"
            transform="translate(203 393)"></ellipse>
          <ellipse
            cx="7"
            cy="9"
            fill="#fff"
            data-name="Ellipse 15"
            rx="7"
            ry="9"
            transform="translate(240 377)"></ellipse>
          <ellipse
            cx="7"
            cy="9"
            fill="#fff"
            data-name="Ellipse 16"
            rx="7"
            ry="9"
            transform="translate(271 365)"></ellipse>
        </g>
        <g data-name="Group 49" transform="translate(78.143 286.653)">
          <path
            fill="#80f1fa"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            opacity="0.4"
            transform="translate(7)"></path>
          <path
            fill="#80f1fa"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            transform="translate(22)"></path>
          <path
            fill="#fff"
            d="M3754.723 2663.044v9.37l-82.32 44.771v-9.061z"
            data-name="Path 32"
            opacity="0.573"
            transform="translate(-3638.439 -2651.653)"></path>
          <path
            fill="#fff"
            d="M3736.6 2663.044v9.37l-64.2 35.771v-10.162z"
            data-name="Path 33"
            opacity="0.573"
            transform="translate(-3638.316 -2624.653)"></path>
        </g>
        <g data-name="Group 50" transform="translate(252.143 170.653)">
          <path
            fill="#fff"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            opacity="0.482"
            transform="translate(7)"></path>
          <path
            fill="#fff"
            d="M1.572 54.98a6.855 6.855 0 00-1.508 5.214v32.051s-.531 10.613 1.894 13.767 10.9-2.491 10.9-2.491L95.474 58.48a21.742 21.742 0 005.538-3.48c1.9-1.9 1.476-6.625 1.476-6.625V7.555S103.007 1.5 100.879.3s-8.294 1.673-8.294 1.673L11.808 48.377S3.619 52.3 1.572 54.98z"
            data-name="second"
            transform="translate(22)"></path>
          <path
            fill="#869db7"
            d="M3754.723 2663.044v9.37l-82.32 44.771v-9.061z"
            data-name="Path 32"
            opacity="0.573"
            transform="translate(-3638.439 -2651.653)"></path>
          <path
            fill="#869db7"
            d="M3736.6 2663.044v9.37l-64.2 35.771v-10.162z"
            data-name="Path 33"
            opacity="0.573"
            transform="translate(-3638.316 -2624.653)"></path>
        </g>
        <path
          fill="#fff"
          d="M159.577 95.738V79.169L0 0v16.022z"
          data-name="Path 52"
          opacity="0.573"
          transform="rotate(2 -5726.894 15892.483)"></path>
        <path
          fill="#fff"
          d="M91.515 64.353l-.633-18.13L0 0v16.022z"
          data-name="Path 53"
          opacity="0.573"
          transform="rotate(2 -6758.114 15910.483)"></path>
        <g data-name="Group 53" transform="translate(-270 110)">
          <g data-name="shopping bag" transform="translate(0 1)">
            <path
              fill={primary}
              d="M3599.553 2943.589h58.347l20.445 87.625h-92.018z"
              data-name="Path 399"
              transform="translate(-2912.435 -2390)"></path>
            <path
              fill="none"
              stroke={primary}
              strokeWidth="4"
              d="M731.336 554.527s.066-14.173-14.268-13.895-15.334 13.895-15.334 13.895"
              data-name="Path 401"></path>
          </g>
          <circle
            cx="24.5"
            cy="24.5"
            r="24.5"
            fill="#fff"
            data-name="Ellipse 88"
            transform="translate(692 575)"></circle>
          <g
            clipPath="url(#clip-path-2)"
            data-name="Mask Group 9"
            transform="translate(678 254)">
            <g transform="translate(24 329.535)">
              <path fill="none" d="M0 0h20v20H0z" data-name="Path 16"></path>
              <path
                fill={primary}
                d="M19.744 16.469a2.575 2.575 0 002.274-1.386l4.653-8.733a1.341 1.341 0 00-1.131-1.992H6.3L5.083 1.667H.833v2.691h2.6l4.678 10.213-1.754 3.284a2.7 2.7 0 002.274 4h15.6V19.16h-15.6l1.43-2.691zM7.54 7.049h15.791l-3.587 6.728H10.62zM8.631 23.2a2.693 2.693 0 000 5.383 2.693 2.693 0 000-5.383zm13 0a2.693 2.693 0 102.6 2.691 2.643 2.643 0 00-2.603-2.691z"
                data-name="Path 17"></path>
            </g>
          </g>
        </g>
        <g data-name="Group 54" transform="translate(-336 -158)">
          <g data-name="shopping bag" transform="translate(0 1)">
            <path
              fill="#80f1fa"
              d="M3599.553 2943.589h58.347l20.445 87.625h-92.018z"
              data-name="Path 399"
              transform="translate(-2912.435 -2390)"></path>
            <path
              fill="none"
              stroke="#80f1fa"
              strokeWidth="4"
              d="M731.336 554.527s.066-14.173-14.268-13.895-15.334 13.895-15.334 13.895"
              data-name="Path 401"></path>
          </g>
          <circle
            cx="24.5"
            cy="24.5"
            r="24.5"
            fill="#fff"
            data-name="Ellipse 88"
            transform="translate(692 575)"></circle>
          <g
            clipPath="url(#clip-path-2)"
            data-name="Mask Group 9"
            transform="translate(678 254)">
            <g data-name="shopping_cart-24px" transform="translate(24 329.535)">
              <path fill="none" d="M0 0h20v20H0z" data-name="Path 16"></path>
              <path
                fill="#80f1fa"
                d="M19.744 16.469a2.575 2.575 0 002.274-1.386l4.653-8.733a1.341 1.341 0 00-1.131-1.992H6.3L5.083 1.667H.833v2.691h2.6l4.678 10.213-1.754 3.284a2.7 2.7 0 002.274 4h15.6V19.16h-15.6l1.43-2.691zM7.54 7.049h15.791l-3.587 6.728H10.62zM8.631 23.2a2.693 2.693 0 000 5.383 2.693 2.693 0 000-5.383zm13 0a2.693 2.693 0 102.6 2.691 2.643 2.643 0 00-2.603-2.691z"
                data-name="Path 17"></path>
            </g>
          </g>
        </g>
        <g data-name="Group 155" transform="translate(457.67 277.781)">
          <g
            fill="#e3a976"
            data-name="Group 152"
            transform="translate(97.495 53.304)">
            <path
              d="M49.019 34.578L3.266 16.058C1.019 14.781-1.5 3.294 1.113.993s9.106.128 11.874.06c5.532-.145 14.289 9.8 22.486 11.828 7.377 1.926 27.231 8.632 25.221 12.056-7.241 15.019-11.675 9.641-11.675 9.641z"
              data-name="Path 135"
              transform="rotate(19.01 -59.48 45.43)"></path>
            <path
              d="M25.186 3.929L19.5 2.053s-6.518-3.928-9.925-.918S-1.484-.961.253 1.393c.854 1.161 8.7 5.81 10.757 5.962 1.889.141-2.752 2.223-.9 2.62 5.031 1.1 12.872.646 12.872.646z"
              data-name="Path 134"
              transform="rotate(103.001 44.465 37.336)"></path>
            <path
              d="M46.854 13.877c-6.869 5.053-21.461 6.311-21.461 6.311L2.066 22.933s-4.251-6.583-.557-7.321c0 0 31.863-15.1 43.385-15.593s8.829 8.807 1.96 13.858z"
              data-name="Path 136"
              transform="rotate(137.99 39.21 36.297)"></path>
          </g>
          <path
            fill="#e3a976"
            d="M3619.722 289.853c8.321 7.306 3.883 22.592 3.883 22.592s4.236 8.041 0 14.213-5.531 9.949-15.917 8.973-25.628-12.875-25.628-12.875l8.26-39.534s21.08-.675 29.402 6.631z"
            data-name="Path 420"
            transform="translate(-3500.758 -271.781)"></path>
          <path
            fill="#e3a976"
            d="M3625.142 351.321l-13.194-4.685-20.4 7.036 9.7 59.926h23.9z"
            data-name="Path 421"
            transform="translate(-3508.9 -272.781)"></path>
          <g data-name="Group 153" transform="translate(95.019 171.577)">
            <path
              fill="#e3a976"
              d="M3606.32 442.358s5.028 20.264 3.98 40.487-3.98 46.636-3.98 46.636h-13.986s-3.715-19.373-5.235-38.336 0-43.748 0-43.748z"
              data-name="Path 422"
              transform="translate(-3581.096 -442.358)"></path>
            <path
              fill="#e3a976"
              d="M3606.049 527.481l-7.208 46.292h-6.111s-2.846-24.385-2.238-38.225 4.668-17.133 4.668-17.133z"
              data-name="Path 423"
              transform="translate(-3580.686 -442.358)"></path>
            <path
              fill="#e3a976"
              d="M9.035 28.543L.919 35.412l5.129-15.876S-2.552 3.194.758.914c1.672-1.152 5-1.786 8.916 1.7 3.636 3.234 3.776 3.763 6.426 7.443a25.5 25.5 0 013.675 7.911 19.439 19.439 0 01-3.965 5.653 37.1 37.1 0 01-6.777 4.923z"
              data-name="Path 130"
              transform="rotate(126.011 -13.309 75.914)"></path>
            <path
              fill="#393939"
              d="M.662 9.663s.2-5.3 2.715-2.185C6.7 11.843 6.033 11.326 8.1 16.41c.869 2.189.265 5.908-.464 8.163A39.883 39.883 0 015.052 30.3a43.9 43.9 0 007.158-2.61c3.156-1.483 4.994-1.558 5.007-3.16.094-5.067-1.659-10.074-5.217-16.571S4.052-.274 1.406.034.662 9.663.662 9.663z"
              data-name="Path 364"
              transform="rotate(110 -24.522 79.548)"></path>
          </g>
          <g data-name="Group 154" transform="translate(54.479 171.407)">
            <path
              fill="#e3a976"
              d="M3643.949 450.324l-15.731 56.86a158.271 158.271 0 01-2.171 27.352c-2.5 14.814-9.532 31.936-9.532 31.936h-6.057s-1.937-16.6 0-31.936 4.584-29.564 4.584-29.564v-57.784z"
              data-name="Path 424"
              transform="translate(-3598.838 -447.188)"></path>
            <path
              fill="#e3a976"
              d="M12.329 19.626L2.49 26.772s5.756-7.6 5.3-13.4S-2.637 5.861.671 3.579A26.136 26.136 0 015.85.845c2.414-.945 5.56-1.456 7.7.448 3.636 3.239 7.734 7.023 8.492 9.847 0 0-.233.905-2.944 3.566a37.1 37.1 0 01-6.765 4.921z"
              data-name="Path 130"
              transform="rotate(126.011 -12.386 67.104)"></path>
            <path
              fill="#393939"
              d="M4.9 11.208s-1.224-6.891.89-6.472 5.909 5.4 5.67 7.193a28.4 28.4 0 01-.2 4.051 25.019 25.019 0 00-.913 5.718 72.37 72.37 0 006.963-3.141c3.156-1.483 2.761-1.33 2.774-2.93.096-5.065-2.051-4.227-5.613-10.727C11.919.245 6.6-.608 2.582.349 1.4.63-.472 1.358.109 4.074S4.9 11.208 4.9 11.208z"
              data-name="Path 364"
              transform="rotate(110 -22.967 69.645)"></path>
          </g>
          <path
            fill={primary}
            d="M73.91 120.362a32.136 32.136 0 01-4.927 1.325c-1.15-5.5-.572-9.589-7.453-14.675-7.779-5.749-4.829-2.342-10.159-2.86-10.518-1.02-5.493 19.569-8.428 22.3-1.106.069-5.2-2.634-6.278-2.912-1.651-.882 5.567-4.224-3.408-27.774-2.193-5.754-1.523-13.413-1.606-21.629-.023-2.288-.843-5.028-.926-7.551C27.335 56.891 0 21.174 0 21.174S8.681 7.921 23.2 5.226c16.109-2.991 41.052-9.742 50.575-.64C76.645 7.335 90.806 7.7 90.806 7.7s-6.606 7.48-8.568 16.712C80.484 32.7 69.067 57.083 68.593 61.938c6.04 23.086 2.1 27.31.157 40.081a33.624 33.624 0 005.16 18.342z"
            data-name="primary"
            transform="scale(-1) rotate(7 1618.238 -1246.118)"></path>
          <path
            fill="#5a2c1f"
            d="M59.254 30.294C46.473 47.878 29.483 56.605 26.313 63.361c-.022.047-29.777 35.63-25.977 42.834 5.624 10.664 16.891 17.451 33.945 12.815s43.974-27.256 56-49.3 21.577-14.148 31.693-28.067S105.371-2.406 88.365.153 72.035 12.71 59.254 30.294z"
            data-name="Path 367"
            transform="rotate(144 69.809 76.569)"></path>
          <path
            fill="#5a2c1f"
            d="M0 64.193c.24-12.564 24.32-38 33.26-62.26 6.958-10.96 17.275 28.035 17.168 32.86-.2 8.843-8.235 43.11-15.2 48.555C24.661 91.629-.237 76.753 0 64.193z"
            data-name="Path 366"
            transform="rotate(166 64.456 51.661)"></path>
        </g>
      </g>
    </svg>
  );
};

export default BuyProductsPlaceholder;
