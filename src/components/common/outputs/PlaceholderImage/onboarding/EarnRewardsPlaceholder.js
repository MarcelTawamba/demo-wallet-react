import React from 'react';

const EarnRewardsPlaceholder = props => {
  const { width, colors } = props;
  const { primary, font, secondary, placeholderScreen } = colors;
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
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="linear-gradient-2"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip-path">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H34V37H0z"
            data-name="Rectangle 125"
            transform="translate(516 226)"
          />
        </clipPath>
        <clipPath id="clip-path-2">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H51.869V50.812H0z"
            data-name="Rectangle 126"
            transform="translate(680 334)"
          />
        </clipPath>
        <clipPath id="clip-path-3">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H33V36H0z"
            data-name="Rectangle 127"
            transform="translate(518.526 334)"
          />
        </clipPath>
        <clipPath id="clip-path-4">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H274V359H0z"
            data-name="Rectangle 121"
            transform="translate(183 330)"
          />
        </clipPath>
        <clipPath id="clip-path-5">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H80V80H0z"
            data-name="Rectangle 124"
            transform="translate(410 669)"
          />
        </clipPath>
        <clipPath id="clip-path-7">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H33V33H0z"
            data-name="Rectangle 128"
            transform="translate(187 245)"
          />
        </clipPath>
        <clipPath id="clip-path-8">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.332"
            d="M0 0H31.571V31.074H0z"
            data-name="Rectangle 124"
          />
        </clipPath>
        <clipPath id="clip-path-9">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H154V154H0z"
            data-name="Rectangle 129"
            transform="translate(563 481)"
          />
        </clipPath>
        <clipPath id="clip-path-10">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1.828"
            d="M0 0H146.24V146.24H0z"
            data-name="Rectangle 124"
            transform="translate(749.479 1222.931)"
          />
        </clipPath>
        <clipPath id="clip-Earn_rewards">
          <path d="M0 0H900V900H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip-Earn_rewards)" data-name="Earn rewards">
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
          fill="url(#linear-gradient)"
          d="M1517.5 252.514c15.163-9.651 32.966 3.943 32.966 3.943l283.154 162.766s34.57 15.436 42.741 30.585 9.856 40.559 9.856 40.559l-.71 327.7s1.685 26.434-13.409 37.527-40.451-4.56-40.451-4.56l-284.954-164.117c-4.417-4.83-22.949-9.835-33.016-26.182s-8.816-51.706-8.816-51.706l2.772-295.968s-5.301-50.896 9.867-60.547z"
          opacity="0.311"
          transform="rotate(-60 1110.43 1657.03)"
        />
        <g data-name="Group 22">
          <g data-name="Group 21" transform="rotate(-2 -4794.815 536.004)">
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
        </g>
        <g data-name="Group 30">
          <ellipse
            cx="65.5"
            cy="68"
            fill="url(#linear-gradient-2)"
            data-name="primary"
            opacity="0.573"
            rx="65.5"
            ry="68"
            transform="translate(53 284)"
          />
          <circle
            cx="32.5"
            cy="32.5"
            r="32.5"
            fill="url(#linear-gradient-2)"
            data-name="primary"
            opacity="0.573"
            transform="rotate(73 73.334 782.987)"
          />
          <g
            fill="none"
            stroke={primary}
            strokeWidth="10"
            data-name="primary"
            opacity="0.779"
            transform="translate(381 249)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <circle cx="17.5" cy="17.5" r="12.5" />
          </g>
        </g>
        <g fill="none" stroke="#80f1fa" strokeWidth="10">
          <g
            data-name="Ellipse 9"
            opacity="0.544"
            transform="translate(102 732)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <g
            data-name="Ellipse 5"
            opacity="0.779"
            transform="translate(231 687)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <g
            data-name="Ellipse 6"
            opacity="0.779"
            transform="translate(640 38)">
            <circle cx="22.5" cy="22.5" r="22.5" stroke="none" />
            <circle cx="22.5" cy="22.5" r="17.5" />
          </g>
          <g
            data-name="Ellipse 10"
            opacity="0.25"
            transform="translate(213 108)">
            <circle cx="17.5" cy="17.5" r="17.5" stroke="none" />
            <circle cx="17.5" cy="17.5" r="12.5" />
          </g>
        </g>
        <path
          fill="#80f1fa"
          d="M2634.4 2733.067c3.744 6.682 2.473 26.013 2.473 26.013v94.848s1.331 13.013-3.256 16.159-15.092-3.576-15.092-3.576l-158.673-91.411s-6.651-3.931-10.133-8.684-2.7-16.543-2.7-16.543v-101.932s-.95-15.109 2.944-18.126 15.174 4.177 15.174 4.177l154.711 87.224s10.81 5.169 14.552 11.851z"
          data-name="Path 40"
          opacity="0.5"
          transform="translate(-1897 -2455)"
        />
        <path
          fill="#80f1fa"
          d="M2634.4 2733.067c3.744 6.682 2.473 26.013 2.473 26.013v94.848s1.331 13.013-3.256 16.159-15.092-3.576-15.092-3.576l-158.673-91.411s-6.651-3.931-10.133-8.684-2.7-16.543-2.7-16.543v-101.932s-.95-15.109 2.944-18.126 15.174 4.177 15.174 4.177l154.711 87.224s10.81 5.169 14.552 11.851z"
          data-name="Path 23"
          transform="translate(-1928 -2446)"
        />
        <path
          fill={primary}
          d="M4861.955 2770.021v51.3l40.373 22.661V2790.2z"
          data-name="primary"
          transform="translate(-4273 -2499)"
        />
        <path
          fill="#fff"
          d="M4895.8 2790.991v52.171l5.891 3.338v-52.623z"
          data-name="Path 41"
          transform="translate(-4291 -2512)"
        />
        <path
          fill="#fff"
          d="M4895.316 2795.957l.414 45.813 6.53-3.472-.916-45.546z"
          data-name="Path 42"
          transform="rotate(117.97 3508.05 275.248)"
        />
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="2.999"
          d="M607.216 279.45s9.513-9.782 13.652-9.062 6.737 9.109 2.904 11.942-16.556-2.88-16.556-2.88z"
          data-name="Path 43"
        />
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          d="M606.674 281.1s-.79-12.196-4.081-14.117-9.733 1.813-9.08 6.421 13.16 7.696 13.16 7.696z"
          data-name="Path 44"
        />
        <g
          clipPath="url(#clip-path)"
          data-name="Mask Group 5"
          transform="translate(20)">
          <path
            fill="#efce4a"
            d="M17 .489l5.253 11.621L34 13.975l-8.5 9.045 2.007 12.774L17 29.763 6.494 35.794 8.5 23.02 0 13.975l11.747-1.864z"
            transform="translate(516 226.419)"
          />
        </g>
        <g
          clipPath="url(#clip-path-2)"
          data-name="Mask Group 6"
          transform="rotate(8 1259.018 318.591)">
          <path
            fill="#efce4a"
            d="M25.985.489L34.014 16.4l17.955 2.552L38.976 31.33l3.067 17.485-16.058-8.255-16.06 8.255 3.067-17.485L0 18.948 17.955 16.4z"
            data-name="star"
            transform="translate(680 334.754)"
          />
        </g>
        <g
          clipPath="url(#clip-path-3)"
          data-name="Mask Group 7"
          transform="translate(-28.526 -52)">
          <path
            fill="#efce4a"
            d="M16.263.489l5.025 11.266 11.238 1.807-8.132 8.769 1.92 12.383-10.051-5.847-10.051 5.846 1.92-12.383L0 13.562l11.238-1.807z"
            data-name="star"
            transform="translate(519 334.391)"
          />
        </g>
        <g data-name="Group 44">
          <g data-name="Group 27" transform="translate(51 7)">
            <path
              d="M66.23 0c36.578 0 66.23 13.868 66.23 30.974S99.2 42.053 61.983 34.668s-27.074 1.819-55.73-6.214S29.652 0 66.23 0z"
              data-name="Path 39"
              opacity="0.09"
              transform="rotate(2.98 -10423.886 3336.147)"
            />
            <g
              clipPath="url(#clip-path-4)"
              data-name="Mask Group 1"
              transform="translate(-83 -82)">
              <g data-name="Group 603" transform="translate(129.969 298.136)">
                <g data-name="Group 604">
                  <g
                    data-name="Group 146"
                    transform="scale(-1) rotate(29 666.928 -633.413)">
                    <path
                      fill="#5a2c1f"
                      d="M165.22 145.135c-29.919 1.7-47.562-30.6-66.4-35.606s-33.88-12.668-34.053-31.8c-.114-12.513 4.554-21.173 22.286-28.575s47.2 12.1 75.95 6.013S248.48 77.46 239.74 104.68s-23.138 29.942-32.572 52.984-12.029-14.226-41.948-12.529z"
                      data-name="Path 367"
                      transform="rotate(-141 169.333 163.612)"
                    />
                    <path
                      fill="#e3a976"
                      d="M31.523 79.727a46.163 46.163 0 01-15.233 2.734C8.055 82.443 0 77.249 0 77.249l3.247-63.214L20.788 0z"
                      data-name="Path 126"
                      transform="rotate(-31 189.084 -25.054)"
                    />
                    <path
                      fill="#e3a976"
                      d="M19.507 63.258a134.7 134.7 0 0010.9-26.233c4.1-14.289 5.966-22.845 6.058-26.012.429-14.668-6-10.451-6-10.451l-3.19 4.019S-2.233 63.186.135 73.837C2.974 86.61 19.507 63.258 19.507 63.258z"
                      data-name="Path 127"
                      transform="rotate(-45.972 69.698 26.673)"
                    />
                    <path
                      fill="#e3a976"
                      d="M0 11.348v47.547C0 63.206 2.905 66.7 6.488 66.7l4.075-1.162c3.584 0 4.549-7.746 5.714-21.348s.187-33.107.187-33.107c0-4.311-5.441-10.209-8.036-9.944l-1.939 2.4C2.905 3.542 0 7.037 0 11.348z"
                      data-name="Path 132"
                      transform="rotate(131 15.866 155.856)"
                    />
                    <path
                      fill="#e3a976"
                      d="M68.31 58.465L13.677 17.336c-2.193-1.37-1.471-5.881 1.27-8.216s9.138.325 11.921.313c5.563-.033 13.857 10.453 21.986 12.735a45.245 45.245 0 0119.319 11.508c2.63 1.637 10.324-.412 8.133 3.094-8.029 15.409-7.996 21.695-7.996 21.695z"
                      data-name="Path 135"
                      transform="scale(-1) rotate(-20 -795.414 584.959)"
                    />
                    <path
                      fill="#e3a976"
                      d="M15.112 32.887L0 34.734l8.3-11.916S-1.628 2.787 1.845.391C3.6-.819 7.033.845 11.1 4.443c3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2z"
                      data-name="Path 130"
                      transform="rotate(-59 32.52 18.351)"
                    />
                    <path
                      fill="#e3a976"
                      d="M56.546 122.237c-2.821.978-5.275 1.538-8.556 2.452-9.764 4.7-20.947 4.97-31.03 2.255-12.544-2.069-.876 3.01-11.755-25.819-3.013-7.986 9.868-25.832 9.495-36.68C13.744 36.573 0 15.423 0 15.423s64.445-33.066 66.379-2.366a72.2 72.2 0 01-.488 15.633C63.6 43.856 44.211 47.12 54.555 84.249c2.898 34.293 14.853 33.621 1.991 37.988z"
                      data-name="Path 125"
                      transform="rotate(-27 336.89 -74.073)"
                    />
                    <path
                      fill="#e3a976"
                      d="M34.769 76.363C33.141 94.708 33.7 72.029 25.8 72.01S0 65.648 0 65.648L13.369 0l17.7 2.233s5.331 55.786 3.7 74.13z"
                      data-name="Path 128"
                      transform="rotate(-31 187.475 -76.438)"
                    />
                    <path
                      fill="#e3a976"
                      d="M17.762 64.473C24.377 47.635 24.454.793 24.454.793L16.909 0S-3 46.268.389 66.134s10.754 15.178 17.373-1.661z"
                      data-name="Path 129"
                      transform="rotate(25 42.324 241.034)"
                    />
                    <path
                      fill="#e3a976"
                      d="M28.741 22.721s-7.016-5.439-7.714-10.759C21.021 11.914 19.1 0 19.1 0L0 8.106s1.864 3.818 3.57 7.139a27.154 27.154 0 012.32 6.731z"
                      data-name="Path 361"
                      transform="rotate(-10 1428.746 -718.27)"
                    />
                    <path
                      d="M-2.857 10.058l1.264-5.474C.929 3.483 7.655.386 12.435 1.7s3.729 9.3 3.729 9.3l.041 5.1z"
                      data-name="Path 362"
                      opacity="0.089"
                      transform="rotate(-42 402.882 -72.876)"
                    />
                    <path
                      fill="#e3a976"
                      d="M35.1 19.871c7.028-11.253 20.132-15.048 33.26-6.844s21.272 37.726 10.38 42.514-16.336 2.751-31.988-3.7S28.064 31.125 35.1 19.871z"
                      data-name="Path 360"
                      transform="rotate(-151 147.84 139.808)"
                    />
                    <path
                      fill={primary}
                      d="M75.745 125.448a32.778 32.778 0 01-4.94 1.825c-1.2-5.768-9.415-21.365-22.735-19.236s-7.132 20.8-10.164 23.66a18.585 18.585 0 01-4.479-.5c-1.71-.928 1.56-4.933-7.769-29.652-3.015-7.989 4.134-18.877 3.761-29.729C25.891 61.641 0 22.682 0 22.682S22.308 8.52 37.321 5.72C53.982 2.611 65.433-4.86 75.3 4.707c2.978 2.888 18.622 4 18.622 4s-6.824 7.839-8.834 17.52c-1.8 8.693-14.721 31.2-15.2 36.29 1.528 5.887 3.326 17.666 3.927 22.49 1.716 13.757-1.033 12.466-2.539 22.6-.077 6.8.886 12.061 4.472 17.836z"
                      data-name="primary"
                      transform="rotate(-23.02 382.26 -64.232)"
                    />
                    <path
                      fill="#393939"
                      d="M.094 10.608S-.48 5.532 2.142 8.745a63.876 63.876 0 018.442 14.718c2.18 5.458.279 7.114.279 7.114a6.742 6.742 0 004.965-6.42c.123-5.252-.933-8.155-4.635-14.872S4.887-.305 2.113.026.094 10.608.094 10.608z"
                      data-name="Path 364"
                      transform="rotate(-74.991 24.097 18.487)"
                    />
                    <path
                      fill="#e3a976"
                      d="M13.878 10.7C5.553 13.983-3.709 26.127-3.709 26.127l-15.542 18.3s2.939 8.568 5.657 5.723c0 0 31.824-20.285 38.692-30.147S22.2 7.425 13.878 10.7z"
                      data-name="Path 136"
                      transform="rotate(-115 186.853 58.605)"
                    />
                    <path
                      fill="#e3a976"
                      d="M10.158 3.426l-9.047-.518s-3.7-1.47-5.175.7S-.185 9-.185 9a31.707 31.707 0 00-6.239 7.147c-2.028 3.624-2.591 4.753-1.866 7.335s1.262 3.592 4.764 2.977 4.819-2.844 8.207-6.647a98.263 98.263 0 007.141-9.535z"
                      data-name="Path 137"
                      transform="rotate(-131 190.796 70.074)"
                    />
                    <path
                      fill="#e3a976"
                      d="M15.112 32.887L0 34.734l8.3-11.916S-1.628 2.787 1.845.391C3.6-.819 7.033.845 11.1 4.443c3.775 3.342 3.917 3.892 6.662 7.7a26.055 26.055 0 013.782 8.2z"
                      data-name="Path 130"
                      transform="rotate(6.02 107.278 1024.67)"
                    />
                    <path
                      fill="#393939"
                      d="M.094 10.608S-.48 5.532 2.142 8.745a63.876 63.876 0 018.442 14.718c2.18 5.458.279 7.114.279 7.114a6.742 6.742 0 004.965-6.42c.123-5.252-.933-8.155-4.635-14.872S4.887-.305 2.113.026.094 10.608.094 10.608z"
                      data-name="Path 364"
                      transform="rotate(-10 22.248 -619.88)"
                    />
                    <path
                      fill="#e3a976"
                      d="M13.878 10.7C5.553 13.983-3.709 26.127-3.709 26.127l-15.542 18.3s2.939 8.568 5.657 5.723c0 0 31.824-20.285 38.692-30.147S22.2 7.425 13.878 10.7z"
                      data-name="Path 136"
                      transform="rotate(73 -76.814 165.859)"
                    />
                    <path
                      fill="#e3a976"
                      d="M10.158 3.426l-9.047-.518s-3.7-1.47-5.175.7S-.185 9-.185 9a31.707 31.707 0 00-6.239 7.147c-2.028 3.624-2.591 4.753-1.866 7.335s1.262 3.592 4.764 2.977 4.819-2.844 8.207-6.647a98.263 98.263 0 007.141-9.535z"
                      data-name="Path 137"
                      transform="rotate(57 -134.858 139.228)"
                    />
                  </g>
                  <path
                    fill="#5a2c1f"
                    d="M50 38.88C53.544 32.493 16.127 28.767 6.783 5.8-.462-4.58-.08 1.241.049 5.8c.234 8.36 7.715 31.754 14.94 36.926C25.968 50.589 46.456 45.267 50 38.88z"
                    data-name="Path 366"
                    transform="rotate(-169 119.533 39.213)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
        <g data-name="Group 47">
          <g data-name="Group 46">
            <g clipPath="url(#clip-path-5)" data-name="Mask Group 8">
              <g transform="translate(413.69 669)">
                <path
                  fill="#80f1fa"
                  d="M111.451 30.5L75.145 50.454 38.832 30.5l36.313-20.143z"
                  transform="translate(-38.832 -10.357)"
                />
                <path
                  fill="#80f1fa"
                  d="M87.846 57.654L51.54 77.606V37.7l36.306-19.949z"
                  data-name="second"
                  transform="translate(-15.227 2.394)"
                />
                <path
                  d="M87.846 57.654L51.54 77.606V37.7l36.306-19.949z"
                  opacity="0.2"
                  transform="translate(-15.227 2.394)"
                />
                <path
                  fill="#80f1fa"
                  d="M38.832 57.654l36.313 19.952V37.7L38.832 17.751z"
                  data-name="second"
                  transform="translate(-38.832 2.394)"
                />
                <path
                  d="M38.832 57.654l36.313 19.952V37.7L38.832 17.751z"
                  data-name="overlay"
                  opacity="0.1"
                  transform="translate(-38.832 2.394)"
                />
              </g>
            </g>
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M423.977 695.079v39.551l12.88 7.27v-39.427z"
              data-name="Path 45"
              opacity="0.768"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M475.856 695.232v39.4l-12.88 7.27v-39.427z"
              data-name="Path 46"
              opacity="0.513"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M437.035 701.8l-12.576-7.517 35.254-19.453 11.938 6.663z"
              data-name="Path 47"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M439.914 674.958l-12.542 7.086 35.11 19.8 13.032-7.36z"
              data-name="Path 48"
            />
          </g>
          <g fill="none" stroke="#ffd474" data-name="Group 45">
            <path
              strokeWidth="4"
              d="M451 688.945s15.178-19.845 23.883-19.43 10.13 8.12 4.159 12.978S451 688.945 451 688.945z"
              data-name="Path 49"
            />
            <path
              strokeWidth="3.999"
              d="M448.163 688.397s-17.519-18.582-24.868-16.552-6.805 10.575-.589 14.714 25.457 1.838 25.457 1.838z"
              data-name="Path 50"
            />
          </g>
        </g>
        <g data-name="Group 48" transform="translate(73 -259)">
          <g data-name="Group 46">
            <g clipPath="url(#clip-path-5)" data-name="Mask Group 8">
              <g data-name="cube" transform="translate(413.69 669)">
                <path
                  fill="#80f1fa"
                  d="M111.451 30.5L75.145 50.454 38.832 30.5l36.313-20.143z"
                  data-name="second"
                  transform="translate(-38.832 -10.357)"
                />
                <path
                  fill="#80f1fa"
                  d="M87.846 57.654L51.54 77.606V37.7l36.306-19.949z"
                  data-name="second"
                  transform="translate(-15.227 2.394)"
                />
                <path
                  d="M87.846 57.654L51.54 77.606V37.7l36.306-19.949z"
                  data-name="overlay"
                  opacity="0.2"
                  transform="translate(-15.227 2.394)"
                />
                <path
                  fill="#80f1fa"
                  d="M38.832 57.654l36.313 19.952V37.7L38.832 17.751z"
                  data-name="second"
                  transform="translate(-38.832 2.394)"
                />
                <path
                  d="M38.832 57.654l36.313 19.952V37.7L38.832 17.751z"
                  data-name="overlay"
                  opacity="0.1"
                  transform="translate(-38.832 2.394)"
                />
              </g>
            </g>
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M423.977 695.079v39.551l12.88 7.27v-39.427z"
              data-name="Path 45"
              opacity="0.768"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M475.856 695.232v39.4l-12.88 7.27v-39.427z"
              data-name="Path 46"
              opacity="0.513"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M437.035 701.8l-12.576-7.517 35.254-19.453 11.938 6.663z"
              data-name="Path 47"
            />
            <path
              fill="#fff"
              stroke="#fff"
              strokeWidth="1"
              d="M439.914 674.958l-12.542 7.086 35.11 19.8 13.032-7.36z"
              data-name="Path 48"
            />
          </g>
          <g fill="none" stroke="#ffd474" data-name="Group 45">
            <path
              strokeWidth="4"
              d="M451 688.945s15.178-19.845 23.883-19.43 10.13 8.12 4.159 12.978S451 688.945 451 688.945z"
              data-name="Path 49"
            />
            <path
              strokeWidth="3.999"
              d="M448.163 688.397s-17.519-18.582-24.868-16.552-6.805 10.575-.589 14.714 25.457 1.838 25.457 1.838z"
              data-name="Path 50"
            />
          </g>
        </g>
        <g
          clipPath="url(#clip-path-7)"
          data-name="Mask Group 10"
          transform="translate(-2)">
          <g data-name="Group 47" transform="translate(187.838 246.065)">
            <g data-name="Group 46" transform="translate(0 .585)">
              <g clipPath="url(#clip-path-8)" data-name="Mask Group 8">
                <g data-name="cube" transform="translate(1.456)">
                  <path
                    fill="#80f1fa"
                    d="M41.564 11.266l-14.327 7.751-14.33-7.751 14.33-7.824z"
                    data-name="second"
                    transform="translate(-12.906 -3.442)"
                  />
                  <path
                    fill="#80f1fa"
                    d="M31.458 21.4L17.13 29.149v-15.5L31.458 5.9z"
                    data-name="second"
                    transform="translate(-2.8 1.925)"
                  />
                  <path
                    d="M31.458 21.4L17.13 29.149v-15.5L31.458 5.9z"
                    data-name="overlay"
                    opacity="0.2"
                    transform="translate(-2.8 1.925)"
                  />
                  <path
                    fill="#80f1fa"
                    d="M12.906 21.4l14.33 7.75v-15.5L12.906 5.9z"
                    data-name="second"
                    transform="translate(-12.906 1.925)"
                  />
                  <path
                    d="M12.906 21.4l14.33 7.75v-15.5L12.906 5.9z"
                    data-name="overlay"
                    opacity="0.1"
                    transform="translate(-12.906 1.925)"
                  />
                </g>
              </g>
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.332"
                d="M5.516 10.13v15.363l5.083 2.824V13.002z"
                data-name="Path 45"
                opacity="0.768"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.332"
                d="M25.989 10.191v15.3l-5.083 2.824V13.001z"
                data-name="Path 46"
                opacity="0.513"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.332"
                d="M10.669 12.741l-4.963-2.92 13.912-7.556 4.711 2.588z"
                data-name="Path 47"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="0.332"
                d="M11.805 2.314L6.856 5.066l13.856 7.691L25.854 9.9z"
                data-name="Path 48"
              />
            </g>
            <g
              fill="none"
              stroke="#ffd474"
              strokeWidth="1.329"
              data-name="Group 45"
              transform="translate(2.62)">
              <path
                d="M13.561 8.332S19.551.624 22.986.785s4 3.154 1.641 5.041-11.066 2.506-11.066 2.506z"
                data-name="Path 49"
              />
              <path
                d="M12.44 8.12S5.528.9 2.628 1.69s-2.688 4.108-.233 5.715 10.047.715 10.047.715z"
                data-name="Path 50"
              />
            </g>
          </g>
        </g>
        <g
          clipPath="url(#clip-path-9)"
          data-name="Mask Group 9"
          transform="translate(11 9)">
          <g data-name="Group 47" transform="translate(-182.599 -734.171)">
            <g data-name="Group 46">
              <g clipPath="url(#clip-path-10)" data-name="Mask Group 8">
                <g data-name="cube" transform="translate(756.224 1222.931)">
                  <path
                    fill="#80f1fa"
                    d="M203.732 55.754L137.365 92.23l-66.38-36.476 66.38-36.821z"
                    data-name="second"
                    transform="translate(-70.985 -18.933)"
                  />
                  <path
                    fill="#80f1fa"
                    d="M160.582 105.391l-66.367 36.473V68.916l66.367-36.467z"
                    data-name="second"
                    transform="translate(-27.835 4.376)"
                  />
                  <path
                    d="M160.582 105.391l-66.367 36.473V68.916l66.367-36.467z"
                    data-name="overlay"
                    opacity="0.2"
                    transform="translate(-27.835 4.376)"
                  />
                  <path
                    fill="#80f1fa"
                    d="M70.985 105.391l66.38 36.472V68.916l-66.38-36.467z"
                    data-name="second"
                    transform="translate(-70.985 4.376)"
                  />
                  <path
                    d="M70.985 105.391l66.38 36.472V68.916l-66.38-36.467z"
                    data-name="overlay"
                    opacity="0.1"
                    transform="translate(-70.985 4.376)"
                  />
                </g>
              </g>
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.828"
                d="M775.029 1270.603v72.3l23.544 13.29v-72.072z"
                data-name="Path 45"
                opacity="0.768"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.828"
                d="M869.863 1270.883v72.023l-23.544 13.29v-72.073z"
                data-name="Path 46"
                opacity="0.513"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.828"
                d="M798.899 1282.889l-22.989-13.741 64.443-35.56 21.823 12.18z"
                data-name="Path 47"
              />
              <path
                fill="#fff"
                stroke="#fff"
                strokeWidth="1.828"
                d="M804.161 1233.822l-22.926 12.953 64.181 36.195 23.822-13.454z"
                data-name="Path 48"
              />
            </g>
            <g fill="none" stroke="#ffd474" data-name="Group 45">
              <path
                strokeWidth="7.312"
                d="M824.426 1259.391s27.746-36.276 43.658-35.518 18.518 14.844 7.6 23.724-51.258 11.794-51.258 11.794z"
                data-name="Path 49"
              />
              <path
                strokeWidth="7.311"
                d="M819.262 1258.34s-32.026-33.968-45.46-30.257-12.439 19.33-1.076 26.896 46.536 3.36 46.536 3.36z"
                data-name="Path 50"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default EarnRewardsPlaceholder;
