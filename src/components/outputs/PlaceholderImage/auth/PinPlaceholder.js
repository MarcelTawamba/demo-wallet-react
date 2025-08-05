import React from 'react';

const PinPlaceholder = props => {
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
            d="M0 0H432V441H0z"
            data-name="Rectangle 28"
            transform="translate(-.315)"
          />
        </clipPath>
        <clipPath id="a">
          <path d="M0 0H500V500H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <g
          clipPath="url(#b)"
          data-name="Mask Group 16"
          transform="translate(34.315 30)">
          <g transform="translate(.003)">
            <path
              fill="#3c3b41"
              d="M316.916 200.707h-29.272v-65.141c0-28.268-22.528-51.264-50.217-51.264s-50.218 23-50.218 51.264v65.141h-29.273v-65.141c0-44.745 35.66-81.148 79.491-81.148s79.492 36.4 79.492 81.148v65.141z"
              data-name="Path 39"
              transform="translate(-21.583 -6.456)"
            />
            <path
              fill="#171719"
              d="M250 54.419V84.3c27.69 0 50.217 23 50.217 51.264v65.141h29.273v-65.139c.01-44.745-35.655-81.147-79.49-81.147z"
              data-name="Path 40"
              transform="translate(-34.162 -6.456)"
            />
            <path
              fill="#d5d5d5"
              d="M295.734 391.708H166.852c-29.588 0-53.8-24.714-53.8-54.92v-109.1c0-14.521 11.639-26.4 25.863-26.4H323.67c14.225 0 25.863 11.881 25.863 26.4v109.1c-.001 30.207-24.211 54.92-53.799 54.92z"
              data-name="Path 41"
              transform="translate(-15.451 -23.878)"
            />
            <path
              fill="#959595"
              d="M342.38 201.283H250v190.425h64.442c29.588 0 53.8-24.714 53.8-54.92v-109.1c.002-14.523-11.637-26.405-25.862-26.405z"
              data-name="Path 42"
              transform="translate(-34.162 -23.878)"
            />
            <g
              fill="#272727"
              data-name="Group 42"
              transform="translate(144.069 253.054)">
              <path
                d="M202.6 298.652l-4.209-6.211-9.956 7.031v-12.358h-7.4v12.358l-9.956-7.031-4.21 6.211 11.362 8.025-11.358 8.023 4.21 6.211 9.956-7.031v12.358h7.4v-12.355l9.956 7.031 4.205-6.214-11.363-8.026z"
                data-name="Path 43"
                transform="translate(-166.873 -287.114)"
              />
              <path
                d="M265.042 298.652l-4.211-6.211-9.955 7.031v-12.358h-7.4v12.358l-9.955-7.031-4.21 6.211 11.362 8.025-11.36 8.023 4.21 6.211 9.955-7.031v12.358h7.4v-12.355l9.955 7.031 4.211-6.211-11.363-8.026z"
                data-name="Path 44"
                transform="translate(-175.404 -287.114)"
              />
            </g>
            <g
              fill="#272727"
              data-name="Group 43"
              transform="translate(215.843 253.054)">
              <path
                d="M253.7 313.883l9.955 7.031 4.211-6.211-11.363-8.026 11.363-8.025-4.211-6.211-9.955 7.031v-12.358H250v39.127h3.7z"
                data-name="Path 45"
                transform="translate(-250.005 -287.114)"
              />
              <path
                d="M327.482 298.652l-4.21-6.211-9.955 7.031v-12.358h-7.4v12.358l-9.955-7.031-4.211 6.211 11.363 8.025-11.362 8.023 4.211 6.211 9.955-7.031v12.358h7.4v-12.355l9.955 7.031 4.21-6.211-11.363-8.026z"
                data-name="Path 46"
                transform="translate(-255.709 -287.114)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default PinPlaceholder;
