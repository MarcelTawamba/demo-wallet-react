import React from 'react';
import { useTheme } from '../context';
import { makeStyles } from '@material-ui/styles';

const PlaceholderSvg = props => {
  let { color, colorsOveride, name, width = 200, height } = props;
  if (!height) height = width;

  let { colors = { primary: '#E43' } } = useTheme();
  if (colorsOveride) {
    colors = colorsOveride;
  }

  switch (name) {
    case 'error':
      return (
        <ErrorSvg color={color} colors={colors} width={width} height={height} />
      );
    case 'productHeader':
      return (
        <ProductHeaderSvg
          color={color}
          colors={colors}
          width={width}
          height={height}
        />
      );
    case 'success':
      return (
        <SuccessSvg
          color={color}
          colors={colors}
          width={width}
          height={height}
        />
      );
    default:
      return null;
  }
};

const SuccessSvg = props => {
  const { width, height, colors } = props;
  const { primary } = colors;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 900 900">
      <defs>
        <linearGradient
          id="a"
          x1="-0.386"
          x2="1"
          y1="0.289"
          y2="0.557"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#b9fdc1" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="d"
          cx="0.5"
          cy="0.5"
          r="0.5"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#b9fdc1" />
          <stop offset="1" stopColor="#a5ffae" />
        </radialGradient>
        <filter
          id="c"
          width="747"
          height="747"
          x="76.5"
          y="76.5"
          filterUnits="userSpaceOnUse">
          <feOffset />
          <feGaussianBlur result="blur" stdDeviation="49.5" />
          <feFlood floodColor="#b7fdbf" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <clipPath id="e">
          <path
            fill="#fff"
            stroke="#707070"
            strokeWidth="1"
            d="M0 0H415.959V385.801H0z"
            data-name="Rectangle 149"
          />
        </clipPath>
      </defs>
      <g data-name="success - client ver">
        <g data-name="Success - Client ver.">
          <g
            fill={primary}
            data-name="Group 119"
            transform="translate(-244 -20)">
            <circle
              cx="450"
              cy="450"
              r="450"
              data-name="Ellipse 83"
              opacity="0.1"
              transform="translate(244 20)"
            />
            <circle
              cx="400"
              cy="400"
              r="400"
              data-name="Ellipse 84"
              opacity="0.3"
              transform="translate(294 70)"
            />
            <circle
              cx="350"
              cy="350"
              r="350"
              data-name="Ellipse 85"
              opacity="0.4"
              transform="translate(344 120)"
            />
          </g>
          <path
            fill={primary}
            d="M867.558-4295.834A349.652 349.652 0 01850.524-4404c0-111.716 52.344-211.209 133.841-275.292a201.593 201.593 0 0135.63 13.4c99.526 48.541 140.857 168.575 92.315 268.1a200.536 200.536 0 01-180.355 112.652 199.092 199.092 0 01-64.397-10.694z"
            opacity="0.208"
            transform="translate(-244 -20) translate(-506.524 4874)"
          />
          <path
            fill="#fff"
            d="M1237.51-4196.134c-164.158-.017-320.248-189.743-478.812-211.393a348.394 348.394 0 0163.991-198.287c56.887 20.062 126.386 56.1 211.25 113.753 240.774 163.585 353.047 98.376 410.921-9.652a350.036 350.036 0 0113.821 97.713 352.461 352.461 0 01-4.311 55.088c-37.194 63.795-84.506 115.884-141.4 138.37a202.968 202.968 0 01-75.429 14.408z"
            opacity="0.215"
            transform="translate(-244 -20) translate(-414.681 4874)"
          />
          <g transform="translate(-244 -20) translate(-226 231)">
            <circle
              cx="69.5"
              cy="69.5"
              r="69.5"
              fill={primary}
              opacity="0.5"
              data-name="Ellipse 87"
              transform="translate(1033 377)"
            />
            <path
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              d="M1033.034 444.213s-83.113 4.264-38.255 5.906c23.551.862 52.436 20.492 92.3 23.888s88.522-17.869 111.152-19.215c63.617-6.962-26.489-17.4-26.489-17.4"
              data-name="Path 268"
              opacity="0.297"
            />
          </g>
          <g data-name="Group 56">
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 105"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(11 -3514.506 8654.777)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 106"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 -.07 .07 .998 971.124 830.878)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 228"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 -.07 .07 .998 1003.06 532.971)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 147"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(2 -27806.304 33776.901)"
            />
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 107"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 .07 -.07 .998 1726.096 791.869)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 229"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -4541.394 21034.486)"
            />
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 146"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(-7 5048.955 -10974.44)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 108"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -9781.5 17753.603)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 145"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -9199.468 25537.46)"
            />
          </g>
        </g>
        <g
          filter="url(#c)"
          transform="translate(-244 -20) translate(-87 -90) translate(331 110)">
          <path
            fill="url(#d)"
            d="M225 0c124.264 0 225 100.736 225 225S349.264 450 225 450 0 349.264 0 225 100.736 0 225 0z"
            data-name="Path 290"
            transform="translate(225 225)"
          />
        </g>
        <g
          clipPath="url(#e)"
          data-name="Mask Group 19"
          transform="translate(-244 -20) translate(-87 -90) translate(573 367)">
          <path
            fill="none"
            d="M0 0h377.59v385.63H0z"
            data-name="Path 288"
            transform="translate(19.24 .384)"
          />
          <path
            fill="#fff"
            d="M110.346 206.953l-66.078-67.485-22.026 22.5 88.1 89.98 188.8-192.815-22.026-22.5z"
            data-name="Path 289"
            transform="translate(19.24 .384) translate(31.25 53.347)"
          />
        </g>
        <g data-name="Group 56">
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 105"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(11 -3849.802 7497.391)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 106"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 -.07 .07 .998 971.124 695.136)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 228"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 -.07 .07 .998 1031.218 485.176)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 147"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(2 -22510.357 32414.241)"
          />
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 107"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 .07 -.07 .998 1580.662 759.189)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 229"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(4.01 -4556.112 20614.287)"
          />
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 146"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(-7 3030.774 -9058.735)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 108"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(4.01 -8296.87 16942.43)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 145"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(4.01 -4816.338 22563.074)"
          />
        </g>
      </g>
    </svg>
  );
};

const ErrorSvg = props => {
  const { width, height, colors } = props;
  const { primary } = colors;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 900 900">
      <defs>
        <linearGradient
          id="a"
          x1="-0.386"
          x2="1"
          y1="0.289"
          y2="0.557"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#ff8d8e" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="0.5"
          x2="0.5"
          y2="1"
          gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor={primary} />
          <stop offset="1" stopColor={primary} stopOpacity="0" />
        </linearGradient>
        <filter
          id="c"
          width="747"
          height="747"
          x="76.5"
          y="76.5"
          filterUnits="userSpaceOnUse">
          <feOffset />
          <feGaussianBlur result="blur" stdDeviation="49.5" />
          <feFlood floodColor="#fd6666" floodOpacity="0.635" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g data-name="Error - client ver">
        <g data-name="Group 133">
          <g
            fill={primary}
            data-name="Group 119"
            transform="translate(-244 -20)">
            <circle
              cx="450"
              cy="450"
              r="450"
              data-name="Ellipse 83"
              opacity="0.1"
              transform="translate(244 20)"
            />
            <circle
              cx="400"
              cy="400"
              r="400"
              data-name="Ellipse 84"
              opacity="0.3"
              transform="translate(294 70)"
            />
            <circle
              cx="350"
              cy="350"
              r="350"
              data-name="Ellipse 85"
              opacity="0.4"
              transform="translate(344 120)"
            />
          </g>
          <path
            fill={primary}
            d="M867.558-4295.834A349.652 349.652 0 01850.524-4404c0-111.716 52.344-211.209 133.841-275.292a201.593 201.593 0 0135.63 13.4c99.526 48.541 140.857 168.575 92.315 268.1a200.536 200.536 0 01-180.355 112.652 199.092 199.092 0 01-64.397-10.694z"
            opacity="0.2"
            transform="translate(-244 -20) translate(-506.524 4874)"
          />
          <path
            fill="#fff"
            d="M1237.51-4196.134c-164.158-.017-320.248-189.743-478.812-211.393a348.394 348.394 0 0163.991-198.287c56.887 20.062 126.386 56.1 211.25 113.753 240.774 163.585 353.047 98.376 410.921-9.652a350.036 350.036 0 0113.821 97.713 352.461 352.461 0 01-4.311 55.088c-37.194 63.795-84.506 115.884-141.4 138.37a202.968 202.968 0 01-75.429 14.408z"
            opacity="0.132"
            transform="translate(-244 -20) translate(-414.681 4874)"
          />
          <g transform="translate(-244 -20) translate(-224 236)">
            <circle
              cx="69.5"
              cy="69.5"
              r="69.5"
              fill={primary}
              opacity="0.5"
              data-name="Ellipse 87"
              transform="translate(1033 377)"
            />
            <path
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              d="M1033.034 444.213s-83.113 4.264-38.255 5.906c23.551.862 52.436 20.492 92.3 23.888s88.522-17.869 111.152-19.215c63.617-6.962-26.489-17.4-26.489-17.4"
              data-name="Path 268"
              opacity="0.297"
            />
          </g>
          <g data-name="Group 56">
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 105"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(11 -3514.506 8654.777)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 106"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 -.07 .07 .998 971.124 830.878)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 228"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 -.07 .07 .998 1003.06 532.971)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 147"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(2 -27806.304 33776.901)"
            />
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 107"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) matrix(.998 .07 -.07 .998 1651.096 774.869)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 229"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -4541.394 21034.486)"
            />
            <path
              fill="#e3feff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 146"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(-7 5048.955 -10974.44)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 108"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -9781.5 17753.603)"
            />
            <path
              fill="#fff"
              d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
              data-name="Path 145"
              opacity="0.6"
              transform="translate(-244 -20) translate(-686.547 -260.171) rotate(4.01 -7753.832 24801.109)"
            />
          </g>
        </g>
        <g data-name="Group 56">
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 105"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(11 -3849.802 7497.391)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 106"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 -.07 .07 .998 971.124 695.136)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 228"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 -.07 .07 .998 1031.218 485.176)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 147"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(2 -22510.357 32414.241)"
          />
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 107"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) matrix(.998 .07 -.07 .998 1580.662 759.189)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 229"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(4.01 -4556.112 20614.287)"
          />
          <path
            fill="#e3feff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 146"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(-7 3030.774 -9058.735)"
          />
          <path
            fill="#fff"
            d="M12.223 0L0 21.887l12.223 23.094 10.73-23.094z"
            data-name="Path 145"
            opacity="0.6"
            transform="translate(-244 -20) translate(-583.438 -144.171) rotate(4.01 -4816.338 22563.074)"
          />
        </g>
        <g data-name="error icon" transform="translate(-244 -20)">
          <g data-name="Group 141">
            <g
              filter="url(#c)"
              transform="translate(-87 -90) translate(331 110)">
              <path
                fill="#fd6666"
                d="M225 0c124.264 0 225 100.736 225 225S349.264 450 225 450 0 349.264 0 225 100.736 0 225 0z"
                data-name="Path 290"
                transform="translate(225 225)"
              />
            </g>
            <g data-name="Group 145">
              <path
                fill="none"
                d="M0 0h377.59v385.63H0z"
                data-name="Path 288"
                transform="translate(-87 -90) translate(573 367) translate(19.24 .384)"
              />
            </g>
          </g>
          <path
            fill="#fff"
            d="M0 0H48V179H0z"
            data-name="Rectangle 151"
            transform="translate(670 332)"
          />
          <path
            fill="#fff"
            d="M0 0H48V45H0z"
            data-name="Rectangle 152"
            transform="translate(670 554)"
          />
        </g>
      </g>
    </svg>
  );
};

const ProductHeaderSvg = props => {
  const classes = useStyles();
  const { width = 40, height, colors } = props;
  const { primary, secondary } = colors;
  const h = 118.401;
  const w = 130.432;

  return (
    <div className={classes.product}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={100}
        // width={width}
        viewBox="0 0 118.401 130.432">
        <g fill={secondary} data-name="Group 176">
          <path
            d="M181.71 49.731l-59.2 32.529-59.2-32.529 59.206-32.845z"
            data-name="Path 90"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-63.311 -16.886)"
          />
          <path
            d="M143.224 94l-59.2 32.529V61.471l59.2-32.529z"
            data-name="Path 91"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-24.826 3.904)"
          />
          <path
            d="M63.31 94l59.205 32.529V61.471L63.31 28.942z"
            data-name="Path 92"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(129.426 447.482) translate(-63.311 3.904)"
          />
        </g>
        <g fill="#fff">
          <path
            d="M181.71 49.731l-59.2 32.529-59.2-32.529 59.206-32.845z"
            data-name="Path 90"
            opacity="0.75"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(66.114 430.596)"
          />
          <path
            d="M143.224 94l-59.2 32.529V61.471l59.2-32.529z"
            data-name="Path 91"
            opacity="0.52"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(104.599 451.386)"
          />
        </g>
        <g fill="#fff" data-name="Group 177">
          <path
            d="M1053.014 8224.208l59.754-32.455 10.647 5.852-57.887 33.951z"
            data-name="Path 437"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(-900.983 -7731.602)"
          />
          <path
            d="M1053.014 8224.122v16.53l12.416 6.792v-15.961z"
            data-name="Path 438"
            transform="translate(-119.301 -139.286) translate(-10.123 -308.196) translate(-900.983 -7731.602)"
          />
        </g>
      </svg>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  product: {
    // padding: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    height: 200,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default PlaceholderSvg;
