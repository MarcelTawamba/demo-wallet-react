import React from 'react';

const SendToEmailPlaceholder = props => {
  const { width, colors } = props;
  const { primary, secondary, font, placeholderScreen } = colors;
  const h = 900;
  const w = 900;

  return (
    <svg
      xmlns="http://www.w3.org/2000/Svg"
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
        <clipPath id="clip-Send_to_email">
          <path d="M0 0H900V900H0z"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Send_to_email)" data-name="Send to email">
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
            transform="translate(685 125)"></ellipse>
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
        <path
          fill="#64e1ff"
          d="M2448.894 2706.646c-2.762 4.984-1.824 19.4-1.824 19.4v70.75s-.982 9.707 2.4 12.054 11.132-2.667 11.132-2.667L2577.639 2738s4.906-2.933 7.474-6.478 1.992-12.34 1.992-12.34v-76.033s.7-11.271-2.172-13.521-11.192 3.116-11.192 3.116l-114.113 65.064s-7.973 3.854-10.734 8.838z"
          data-name="Path 24"
          opacity="0.4"
          transform="translate(-2275 -2439)"></path>
        <path
          fill="#64e1ff"
          d="M2448.894 2706.646c-2.762 4.984-1.824 19.4-1.824 19.4v70.75s-.982 9.707 2.4 12.054 11.132-2.667 11.132-2.667L2577.639 2738s4.906-2.933 7.474-6.478 1.992-12.34 1.992-12.34v-76.033s.7-11.271-2.172-13.521-11.192 3.116-11.192 3.116l-114.113 65.064s-7.973 3.854-10.734 8.838z"
          data-name="Path 23"
          transform="translate(-2253 -2427)"></path>
        <g data-name="Group 32" transform="translate(50 24)">
          <path
            fill={primary}
            d="M1528.388 264.662c5.885-5.023 14.731-1.03 14.731-1.03l154.535 74.422s18.3 5.074 19.359 17.983 2.352 33.631 2.352 33.631l6.2 88.688s2.858 13-4.975 19.246-17.1 1.2-17.1 1.2l-154.715-77c-2.4-1.934-8.313-3.032-12.394-9.355s-3.929-15.938-3.929-15.938l-8.252-118.051s-1.7-8.773 4.188-13.796z"
            data-name="primary"
            transform="rotate(4.01 2256.063 -14544.895)"></path>
          <path
            fill="#fff"
            d="M1528.388 264.662a11.269 11.269 0 016.529-2.443 25.723 25.723 0 018.2 1.413l154.535 74.422a36.22 36.22 0 0113.779 7.62c2.632 2.442 6.547 9.236 4.842 10.1-44.494 12.14-106.476 43.2-106.476 43.2s-83.782-132-81.409-134.312z"
            opacity="0.45"
            transform="rotate(4.01 2256.063 -14544.895)"></path>
        </g>
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
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          d="M282.872 299.894v-7.953l2.067-20.454-2.067 8.32s-6.694-4.875-12 0a29.676 29.676 0 00-9.23 19.5c-.663 7.712 3.253 9.907 7.649 9.37s13.583-12.093 13.583-12.093-2.428 4.832 0 4.359 6.063-5.68 6.063-5.68 12.418-17.612 5.6-31.134-22.315-3.389-32.9 8.651-11.868 26.74-9.292 38.206 11.978 12 20.876 8.561 19.568-20.24 19.568-20.24"
          data-name="Path 413"></path>
        <ellipse
          cx="43.23"
          cy="24.974"
          data-name="Ellipse 3"
          opacity="0.09"
          rx="43.23"
          ry="24.974"
          transform="rotate(2.98 -10584.162 5596.258)"></ellipse>
        <path
          fill="#e3a976"
          d="M3600.983 330.382v18.673l17.229 2.266v-27.864z"
          data-name="Path 419"
          transform="translate(-3118)"></path>
        <g data-name="Group 155" transform="translate(-171 8)">
          <g fill="#e3a976" data-name="Group 152">
            <path
              d="M49.019.937L3.266 19.457C1.019 20.733-1.5 32.22 1.113 34.522s9.106-.128 11.874-.06c5.532.145 14.289-9.8 22.486-11.828C42.851 20.709 62.7 14 60.694 10.578 53.453-4.442 49.019.937 49.019.937z"
              data-name="Path 135"
              transform="rotate(160.999 213.806 231.377)"></path>
            <path
              d="M25.186 6.784L19.5 8.66s-6.518 3.928-9.925.918S-1.484 11.674.253 9.32c.854-1.161 8.7-5.81 10.757-5.962 1.889-.141-2.752-2.223-.9-2.62C15.144-.361 22.985.093 22.985.093z"
              data-name="Path 134"
              transform="rotate(76.999 1.095 420.824)"></path>
            <path
              d="M46.854 9.056C39.985 4 25.393 2.744 25.393 2.744L2.066 0s-4.251 6.583-.557 7.321c0 0 31.863 15.1 43.385 15.593s8.829-8.807 1.96-13.858z"
              data-name="Path 136"
              transform="rotate(42.01 -242.315 711.943)"></path>
          </g>
          <path
            fill="#e3a976"
            d="M3587.825 289.853c-8.321 7.306-3.883 22.592-3.883 22.592s-4.236 8.041 0 14.213 5.531 9.949 15.917 8.973 25.628-12.875 25.628-12.875l-8.26-39.534s-21.08-.675-29.402 6.631z"
            data-name="Path 420"
            transform="translate(-3118)"></path>
          <path
            fill="#e3a976"
            d="M3591.547 351.321l13.194-4.685 20.4 7.036-9.7 59.926h-23.9z"
            data-name="Path 421"
            transform="translate(-3119 -1)"></path>
          <g data-name="Group 153" transform="translate(-4 1)">
            <path
              fill="#e3a976"
              d="M3590.547 442.358s-5.028 20.264-3.98 40.487 3.98 46.636 3.98 46.636h13.986s3.715-19.373 5.235-38.336 0-43.748 0-43.748z"
              data-name="Path 422"
              transform="translate(-3118)"></path>
            <path
              fill="#e3a976"
              d="M3590.408 527.481l7.208 46.292h6.111s2.846-24.385 2.238-38.225-4.668-17.133-4.668-17.133z"
              data-name="Path 423"
              transform="translate(-3118)"></path>
            <path
              fill="#e3a976"
              d="M9.035 6.869L.919 0l5.129 15.876S-2.552 32.218.758 34.5c1.672 1.152 5 1.786 8.916-1.7 3.636-3.239 3.776-3.768 6.429-7.448a25.5 25.5 0 003.675-7.911 19.439 19.439 0 00-3.965-5.653 37.1 37.1 0 00-6.778-4.919z"
              data-name="Path 130"
              transform="rotate(53.989 -299.57 753.592)"></path>
            <path
              fill="#393939"
              d="M.662 20.633s.2 5.3 2.715 2.185C6.7 18.453 6.033 18.969 8.1 13.885c.869-2.189.265-5.908-.464-8.163A39.882 39.882 0 005.052 0a43.9 43.9 0 017.158 2.605c3.156 1.483 4.994 1.558 5.007 3.16.094 5.066-1.659 10.073-5.221 16.571s-7.944 8.233-10.59 7.926-.744-9.629-.744-9.629z"
              data-name="Path 364"
              transform="rotate(70 -158.963 626.793)"></path>
          </g>
          <g data-name="Group 154">
            <path
              fill="#e3a976"
              d="M3609.6 450.324l15.731 56.86a158.271 158.271 0 002.171 27.352c2.5 14.814 9.532 31.936 9.532 31.936h6.057s1.937-16.6 0-31.936-4.584-29.564-4.584-29.564v-57.784z"
              data-name="Path 424"
              transform="translate(-3120.398 -4)"></path>
            <path
              fill="#e3a976"
              d="M12.2 7.146L2.359 0s5.756 7.6 5.3 13.4-10.428 7.515-7.12 9.8a26.136 26.136 0 005.179 2.734c2.414.945 5.56 1.456 7.7-.448 3.636-3.239 7.734-7.023 8.492-9.847 0 0-.233-.905-2.944-3.566A37.1 37.1 0 0012.2 7.146z"
              data-name="Path 130"
              transform="rotate(53.989 -273.37 783.868)"></path>
            <path
              fill="#393939"
              d="M4.9 10.49s-1.224 6.891.89 6.472 5.909-5.4 5.67-7.193a28.4 28.4 0 00-.2-4.051A25.019 25.019 0 0110.349 0a72.37 72.37 0 016.963 3.141c3.156 1.483 2.761 1.33 2.774 2.93.094 5.066-2.053 4.228-5.615 10.725-2.552 4.657-7.871 5.511-11.889 4.554C1.4 21.069-.472 20.34.109 17.625S4.9 10.49 4.9 10.49z"
              data-name="Path 364"
              transform="rotate(70 -133.283 646.78)"></path>
          </g>
          <path
            fill={primary}
            d="M73.91 6.094a32.136 32.136 0 00-4.927-1.325c-1.15 5.5-.572 9.589-7.453 14.675-7.779 5.749-4.829 2.342-10.159 2.86C40.852 23.324 45.878 2.735 42.943 0c-1.106-.069-5.2 2.634-6.278 2.912-1.651.882 5.567 4.224-3.408 27.774-2.193 5.754-1.523 13.413-1.606 21.629-.023 2.288-.843 5.028-.926 7.551C27.335 69.565 0 105.283 0 105.283s8.681 13.252 23.2 15.947c16.109 2.991 41.052 9.742 50.575.64 2.874-2.748 17.034-3.109 17.034-3.109s-6.609-7.484-8.568-16.716c-1.754-8.29-13.171-32.671-13.645-37.526 6.04-23.086 2.1-27.31.157-40.081A33.624 33.624 0 0173.909 6.1z"
            data-name="primary"
            transform="rotate(-7.004 3100.793 -3364.69)"></path>
          <path
            fill="#5a2c1f"
            d="M59.291 90.2C46.51 72.613 29.52 63.886 26.35 57.13 26.328 57.083-3.427 21.5.372 14.3 6 3.632 17.263-3.155 34.317 1.482s43.974 27.256 56 49.3S111.9 64.93 122.011 78.849 105.408 122.9 88.4 120.338 72.072 107.781 59.291 90.2z"
            data-name="Path 367"
            transform="rotate(36 -174.06 886.975)"></path>
          <path
            fill="#5a2c1f"
            d="M0 18.133c.24 12.564 24.32 38 33.26 62.26 6.958 10.96 17.275-28.035 17.168-32.86-.2-8.843-8.235-43.11-15.2-48.555C24.662-9.3-.237 5.573 0 18.133z"
            data-name="Path 366"
            transform="rotate(14 -897.847 2049.748)"></path>
        </g>
      </g>
    </svg>
  );
};

export default SendToEmailPlaceholder;
