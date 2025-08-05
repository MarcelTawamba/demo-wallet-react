import React from 'react';

export default function BitcoinCheckoutPlaceholder(props) {
  const { width, colors } = props;
  const { primary } = colors;
  const h = 150;
  const w = 150;

  return (
    <svg
      xmlns="http://www.w3.org/2000/Svg"
      height={h * (width / w)}
      width={width}
      viewBox="0 0 150 150">
      <defs>
        <clipPath id="clip-path">
          <path
            id="Rectangle_597"
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H150V150H0z"
            data-name="Rectangle 597"
            transform="translate(593 217)"></path>
        </clipPath>
        <clipPath id="clip-path-2">
          <path
            id="Rectangle_595"
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.388"
            d="M0 0H19.38V19.38H0z"
            data-name="Rectangle 595"
            transform="translate(1829.478 -899.235)"></path>
        </clipPath>
        <pattern
          id="pattern"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 128 128">
          <image
            width="128"
            height="128"
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC91BMVEUAAAD4lBr3lBv3kxr/qiv/v0D3lBv4kxr4kxv/mxv3lBv/lSv4lhz4kxr4lBv3lxv3lRv4kxv4lBr6lhv4lRz3lBv3lyD5lBv4kxv6kx34kxr4lBr3kxv6lBz/nSf4lBr//4D3kxr4lhv4lBr7lB34lBr7lh33lBr4kxr3kxv/nyD4kxv/lyP/lRr3lBv4lBv6lRv3lBv4lBv4lBv4kxr/lCH4lBr4lBr3lBv6lBv/niT3kxr////+/v3+/fz5uWr3lBz3kxv4p0X++vX837z71KT97975sVr3lB3+/v74qUj3mCX83bj4pUD+8+f5sVv3myz7zJP5s175tGD++/b7zZX6wn/97dn97936xIP4ojr3mCT3mSf3liL++vb4pD/5rlX82a/6wn797tv6xof84sH4qUn827L5r1b4pkT7z5r+8uT83LX969b958z++/f+9+/6wn36xIL+9u34ojv6wHr97Nj3njL6xob5s1/3lR73lR/+/fv++fL6x4n83bf95cn4p0b6vHL4pkP7zpf4pkL3min6yIv+/Pn5uWz6w4D95sr6v3n97Nf5tWL4qkz848T84sL+9uz4qkv3nC36xYX95836vnX848P6vXP++fT83rn96dL81qn4oDb96M/7zpj+9ev70qH7z5v3lSD+8+b5uGn6wXv97tz71KX96tL3lyL827P96M771ab5tmX84L/4qUr70qD3njH7z5n4q074q03++PH+8eP6xYT84L798N/++PD6u3D71af96tP70Z784cH5slz969T5t2b706P6w4H3mCb96dH5r1f5rlP5tGH4rFD84L34qEf4oTn6x4r++fP3mir3myv5sl33nS/5um73mSj70Jz3nC77y5L4pUH84cD5sFf7yo7+9Oj3nTD5um3816r95Mf7zJT95Mb+9+783rr82Kz969X4rE/98eH4oDf6x4j4rVH82K398eL7zZb5sVn+9On3liH3njP3lyP82K76vXT837v5uWv+/Pr4qEaA3nGYAAAAO3RSTlMA/uzCBgTGudocqQxJ+9JChPnMOItDIHy7NK/f7TcNiALES/M+1D3piagQlRYdhtlexayrdB91uIVfFSGgzMAAAAaaSURBVHhexdtldxvJEgbgEhriGLKG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"></image>
        </pattern>
        <clipPath id="clip-path-3">
          <path
            id="Rectangle_596"
            fill="#fff"
            stroke="#707070"
            strokeWidth="0.387"
            d="M0 0H19.367V19.367H0z"
            data-name="Rectangle 596"
            transform="translate(1894.856 -879.257)"></path>
        </clipPath>
      </defs>
      <g
        id="check-crypto"
        clipPath="url(#clip-path)"
        transform="translate(-593 -217)">
        <g
          id="Group_517"
          data-name="Group 517"
          transform="translate(-1206.646 1133.658)">
          <g
            id="Polygon_6"
            data-name="Polygon 6"
            opacity="0.3"
            transform="rotate(-90 519.697 -1301.037)">
            <path
              id="primary"
              fill={primary}
              d="M86.03 0a14.412 14.412 0 0112.459 7.262l22.837 39.5a15.033 15.033 0 010 15.011l-22.838 39.5a14.412 14.412 0 01-12.459 7.262H39.8a14.412 14.412 0 01-12.459-7.262L4.506 61.777a15.033 15.033 0 010-15.011l22.838-39.5A14.412 14.412 0 0139.8 0z"
              opacity="0.4"></path>
            <path
              id="Path_673"
              fill="rgba(0,0,0,0)"
              d="M39.8.369a13.906 13.906 0 00-6.994 1.895 14.273 14.273 0 00-5.152 5.186L4.816 46.953a14.66 14.66 0 000 14.636l22.837 39.5a14.273 14.273 0 005.153 5.186 13.906 13.906 0 006.994 1.895h46.229a13.906 13.906 0 006.994-1.895 14.273 14.273 0 005.153-5.186l22.837-39.5a14.66 14.66 0 000-14.636L98.177 7.45a14.273 14.273 0 00-5.153-5.186A13.906 13.906 0 0086.029.369H39.8m0-.369h46.229a14.412 14.412 0 0112.459 7.262l22.837 39.5a15.033 15.033 0 010 15.011l-22.837 39.5a14.412 14.412 0 01-12.459 7.262H39.8a14.412 14.412 0 01-12.459-7.262L4.5 61.777a15.033 15.033 0 010-15.011l22.837-39.5A14.412 14.412 0 0139.8 0z"
              data-name="Path 673"></path>
          </g>
          <g
            id="Group_516"
            data-name="Group 516"
            transform="translate(-3.487 -6.586)">
            <g id="Group_515" data-name="Group 515">
              <g
                id="Group_514"
                fill="#e6b18e"
                data-name="Group 514"
                transform="translate(-36.417 -6.974)">
                <path
                  id="Path_30"
                  d="M.761 2.467c-2.314 4.575.972 4.442 5.573 7.025s9.7 5.966 9.7 5.966l1.352-1.511S3.075-2.108.761 2.467z"
                  data-name="Path 30"
                  transform="rotate(-164 886.195 -560.407)"></path>
                <path
                  id="Path_31"
                  d="M0 7.383a9.429 9.429 0 011.111-3.365 2.424 2.424 0 013.051-1.047s2.187-1.808 2.394-1.627S4.49 4.6 4.49 4.6s1.186-.06.44.945A20.383 20.383 0 011.4 8.356z"
                  data-name="Path 31"
                  transform="rotate(-66.97 275.254 -1854.306)"></path>
                <path
                  id="Path_669"
                  d="M.356 18.945L6.244 2.872s6.4-3.861 8.222-2.63-1.9 6.883-1.9 6.883L3.981 22.3z"
                  data-name="Path 669"
                  opacity="0.998"
                  transform="rotate(77 1500.28 768.575)"></path>
              </g>
              <g
                id="Group_513"
                data-name="Group 513"
                transform="translate(1852.935 -889.125)">
                <g id="hair-back" fill="#3c1e56" transform="translate(17.329)">
                  <path
                    id="Path_16"
                    d="M110.32 158.535a3.41 3.41 0 013.344 2.485c1.015 2.7-.11 5.18 1.093 7.846s3.481 3.686 2.2 3.821a13.624 13.624 0 01-7.692-2.8c-2.8-2.136-2.005-6.745-2.005-6.745l.308-4.6z"
                    data-name="Path 16"
                    transform="translate(-93.935 -150.706)"></path>
                  <ellipse
                    id="Ellipse_1"
                    cx="7.942"
                    cy="9.104"
                    data-name="Ellipse 1"
                    rx="7.942"
                    ry="9.104"></ellipse>
                </g>
                <g id="neck" transform="translate(23.14 12.785)">
                  <path
                    id="Rectangle_2"
                    fill="#f8d5b7"
                    d="M0 0H5.811V9.298H0z"
                    data-name="Rectangle 2"></path>
                  <path
                    id="Intersection_2"
                    fill="#e6b18e"
                    d="M3.918.528A8.678 8.678 0 000 4.716V6.79h5.811V0a5.068 5.068 0 00-1.893.528z"
                    data-name="Intersection 2"
                    transform="rotate(180 2.905 4.364)"></path>
                </g>
                <g id="face" transform="translate(17.992 2.184)">
                  <path
                    id="Path_4"
                    fill="#f8d5b7"
                    d="M131.691 161.641c1.606-4.068-.814-8.229-2.266-9.02s-4.666-2.065-7.187-.631-4.386 3.147-3.817 7.407 3.649 9.852 6.029 9.748 5.635-3.434 7.241-7.504z"
                    data-name="Path 4"
                    transform="translate(-118.317 -151.34)"></path>
                  <path
                    id="Intersection_1"
                    fill="#b95a29"
                    d="M0 17.229a4.776 4.776 0 001.034-.435c2.521-1.433 4.386-3.146 3.817-7.405C4.372 5.809 2.12 1.289 0 0z"
                    data-name="Intersection 1"
                    opacity="0.291"
                    transform="rotate(180 2.477 8.726)"></path>
                  <path
                    id="Path_6"
                    fill="#f8d5b7"
                    d="M128 159.467l-1.112 3.022 1.75 1.418z"
                    data-name="Path 6"
                    transform="translate(-122.912 -150.178)"></path>
                  <path
                    id="Path_7"
                    fill="none"
                    stroke="#360e0e"
                    strokeWidth="0.31"
                    d="M7.117 9.619l.125-.144a2 2 0 011.3-.7 9.275 9.275 0 011.926.318"
                    data-name="Path 7"></path>
                  <path
                    id="Path_8"
                    fill="none"
                    stroke="#360e0e"
                    strokeWidth="0.31"
                    d="M4.241 9.619S3.66 8.77 2.973 8.77a7.415 7.415 0 00-1.711.318"
                    data-name="Path 8"></path>
                  <path
                    id="Path_9"
                    fill="#360e0e"
                    d="M.581 1.162c.321 0 .872-.235.872-.556S.9 0 .581 0a.581.581 0 100 1.162z"
                    data-name="Path 9"
                    transform="rotate(179.026 4.474 4.946)"></path>
                  <path
                    id="Path_10"
                    fill="#360e0e"
                    d="M.581 1.162c.321 0 .788-.091.788-.411A.955.955 0 00.581 0a.581.581 0 000 1.162z"
                    data-name="Path 10"
                    transform="rotate(179.026 1.569 4.922)"></path>
                  <path
                    id="Path_11"
                    fill="#3c1e56"
                    d="M4.953.586L4.738 0a5.752 5.752 0 01-2.231.751A7.265 7.265 0 010 .409a4.714 4.714 0 002.243.736 7.843 7.843 0 002.71-.559z"
                    data-name="Path 11"
                    transform="rotate(175.988 5.622 4.181)"></path>
                  <path
                    id="Path_12"
                    fill="#3c1e56"
                    d="M3.809.561l-.166.586A3.84 3.84 0 001.928.4 4.425 4.425 0 000 .739 3.152 3.152 0 011.725 0a4.9 4.9 0 012.084.561z"
                    data-name="Path 12"
                    transform="rotate(4.012 -98.053 14.154)"></path>
                  <path
                    id="Path_13"
                    fill="#f29292"
                    d="M126.2 165.118c.066 0 .274.008.462 0 .313-.006.279.022.833 0s1.385-.087 1.385-.087a6.129 6.129 0 01-2.219 1.2c-.839.076-1.7-.914-1.7-.914a4.4 4.4 0 011.239-.199z"
                    data-name="Path 13"
                    transform="translate(-121.224 -150.952)"></path>
                </g>
                <g
                  id="hair-front"
                  fill="#3c1e56"
                  transform="translate(16.678 1.162)">
                  <path
                    id="Path_14"
                    d="M133.8 150.565s.825 1.5-1.755 3.994-6.894 2.769-7.491 6.509-2.96-3.2-1.778-6.044a8.616 8.616 0 015.841-5.23 6.6 6.6 0 015.183.771z"
                    data-name="Path 14"
                    transform="translate(-122.447 -149.543)"></path>
                  <path
                    id="Path_15"
                    d="M117.9 152.234a47.353 47.353 0 012.77 6.589 11.446 11.446 0 010 6.121s2.883-5.215 1.929-8.794-4.7-5.862-4.7-5.862z"
                    data-name="Path 15"
                    transform="translate(-107.203 -149.818)"></path>
                </g>
                <path
                  id="Path_18"
                  fill="#fff"
                  d="M136.955 171.223l-4.071-1.234h-6.3a7.167 7.167 0 00-3.216 1.234c-1.556 1.411-2.1 3-4.159 6.382-3.266 5.385.516 6.446 1.356 12.214a50.891 50.891 0 010 12.1h18.413s-3.887-6.409-4.307-13.409 3.082-8.513 3.082-12.846-.798-4.441-.798-4.441z"
                  data-name="Path 18"
                  transform="translate(-103.636 -147.994)"></path>
                <path
                  id="primary-2"
                  fill={primary}
                  d="M141.752 202.31l-15.923 30.5s2.849 6 0 14.923-5.923 18.539-5.923 18.539h-4.645l8.458-63.967z"
                  data-name="primary"
                  transform="translate(-106.411 -148.381)"></path>
                <path
                  id="shadow"
                  d="M141.752 202.31l-15.923 30.5s2.849 6 0 14.923-5.923 18.539-5.923 18.539h-4.645l8.458-63.967z"
                  opacity="0.5"
                  transform="translate(-106.409 -148.381)"></path>
                <path
                  id="Path_23"
                  fill="#2b2b2b"
                  d="M146.721 264.3h-4.253a8.47 8.47 0 01-2.3 3.342c-1.872 1.823-7.662 3.492-6.41 3.952s11.932 0 11.932 0 2.968.167 2.968-1.656-1.937-5.638-1.937-5.638z"
                  data-name="Path 23"
                  transform="translate(-133.587 -146.444)"></path>
                <path
                  id="Path_24"
                  fill="#f8d5b7"
                  d="M129.007 169.5v1.034s-5.332 2.9-6.841 2.455 1.046-2.61 1.046-2.61z"
                  data-name="Path 24"
                  transform="translate(-100.094 -148.381)"></path>
                <path
                  id="Path_25"
                  fill="#f8d5b7"
                  d="M-.233 18.2l5.44-15.557S10.548-.91 12.065.223 10.48 6.555 10.48 6.555L6.867 13.6l-3.546 6.909z"
                  data-name="Path 25"
                  opacity="0.998"
                  transform="rotate(-33 68.264 -26.778)"></path>
                <path
                  id="Path_26"
                  fill="#f8d5b7"
                  d="M.832 1.43C.345 2.795.1 5.071 5.7 7.2s10.335 4.093 10.335 4.093l.459-2.6A93.189 93.189 0 007.55 2.614C1.879-.84 1.32.065.832 1.43z"
                  data-name="Path 26"
                  transform="rotate(-100.018 38.671 10.214)"></path>
                <path
                  id="Path_29"
                  fill="#fff"
                  d="M119.034 173.678l2.177-3.29a3.413 3.413 0 01-4.317.7c-.632.741-.392 1.023-.789 1.968a160.147 160.147 0 00-1.765 4.409l.107.131 5.675 5.2s3.575-4.542 3.568-4.813-2.479-7.592-2.479-7.592"
                  data-name="Path 29"
                  transform="rotate(77.993 161.139 38.307)"></path>
              </g>
              <path
                id="Path_670"
                fill="#fff"
                d="M116.474 171.006l-1.949-.6s3.5.232 4.727 1.853a19.07 19.07 0 012.145 5.224l-.107.131-6.433 5.456s-.51-5.579-.5-5.85.171-6.815.171-6.815"
                data-name="Path 670"
                transform="translate(1769.726 -1036.731)"></path>
              <g id="primary-3" fill={primary} data-name="primary">
                <path
                  id="Path_19"
                  d="M113.3 202.31l3.13 15.441 8.8 29.551 4.417-4.339s.672-19.565 0-28.4-4.417-12.255-4.417-12.255z"
                  data-name="Path 19"
                  transform="translate(1762.927 -1037.506)"></path>
                <path
                  id="Path_129"
                  d="M5.788 4.829C8.579 10.575 8.5 28.891 8.5 28.891l-2.5.267S-1.692 12.075.391 4.906 3-.918 5.788 4.829z"
                  data-name="Path 129"
                  transform="rotate(6.024 8534.778 17540.745)"></path>
              </g>
              <path
                id="Path_131"
                fill="#2b2b2b"
                d="M2.219.042L.026 1.413l1.362 4.876s2.561 1.32 4 .42a4.9 4.9 0 001.13-1.821A5.165 5.165 0 016.4 3.88a5.688 5.688 0 00-1.843-2.624A23.039 23.039 0 002.219.042z"
                data-name="Path 131"
                transform="rotate(32.005 2290.82 2911.785)"></path>
              <path
                id="Path_408"
                fill="#2b2b2b"
                d="M.063 3.016a2.578 2.578 0 004.149 1.11C7.1 2.116 3.017.064 3.017.064S6.828 2.191 7.2 2.921s.905.9-1.17 3.026S3.925 7.8 3.1 7.793.063 3.016.063 3.016z"
                data-name="Path 408"
                transform="rotate(45 1876.765 1898.787)"></path>
              <path
                id="Path_671"
                fill="#f8d5b7"
                d="M0 1.1a10.055 10.055 0 001.358 3.8c1.221 2.114 3.729 1.179 3.729 1.179S7.76 8.121 8.015 7.916s-2.526-3.67-2.526-3.67 1.449.068.538-1.067A24.725 24.725 0 001.717 0z"
                data-name="Path 671"
                transform="rotate(-117.975 690.348 -997.099)"></path>
            </g>
            <g
              id="Mask_Group_313"
              clipPath="url(#clip-path-2)"
              data-name="Mask Group 313"
              transform="rotate(-33 1823.476 -883.202)">
              <circle
                id="bitcoin"
                cx="9.69"
                cy="9.69"
                r="9.69"
                fill="url(#pattern)"
                transform="translate(1829.478 -899.235)"></circle>
            </g>
            <g
              id="Mask_Group_314"
              clipPath="url(#clip-path-3)"
              data-name="Mask Group 314"
              transform="rotate(4.992 1932.012 -831.983)">
              <circle
                id="bitcoin-2"
                cx="9.683"
                cy="9.683"
                r="9.683"
                fill="url(#pattern)"
                data-name="bitcoin"
                transform="translate(1894.856 -879.257)"></circle>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
