import * as React from 'react';

export default function Passport(props) {
  const { width = 150, height = 150, primarycontrast } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 40 40`}
      {...props}
      fill={primarycontrast}>
      <defs>
        <clipPath id="prefix__b">
          <path
            data-name="Rectangle 1177"
            transform="translate(35 423)"
            fill="#fff"
            stroke="#707070"
            d="M0 0h40v40H0z"
          />
        </clipPath>
        <clipPath id="prefix__a">
          <path data-name="Rectangle 1180" d="M0 0h40v40H0z" />
        </clipPath>
        <clipPath id="prefix__c">
          <path
            data-name="Rectangle 1162"
            stroke="#707070"
            strokeWidth={0.65}
            d="M0 0h29v35H0z"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <g
          data-name="Mask Group 468"
          transform="translate(-35 -423)"
          clipPath="url(#prefix__b)">
          <g
            data-name="Passport"
            transform="translate(35 423)"
            clipPath="url(#prefix__a)">
            <g
              data-name="Mask Group 466"
              transform="translate(6 3)"
              clipPath="url(#prefix__c)">
              <g data-name="passport">
                <g data-name="Group 834">
                  <g data-name="Group 833">
                    <path
                      data-name="Path 61773"
                      d="M7.785 20.935a7.968 7.968 0 004.855 4.053 13.4 13.4 0 01-1.152-4.054z"
                    />
                    <path
                      data-name="Path 61774"
                      d="M21.872 13.648a7.969 7.969 0 00-4.857-4.05 13.4 13.4 0 011.152 4.054z"
                    />
                    <path
                      data-name="Path 61775"
                      d="M12.64 9.598a7.968 7.968 0 00-4.855 4.05h3.7a13.4 13.4 0 011.155-4.05z"
                    />
                    <path
                      data-name="Path 61776"
                      d="M11.23 17.292c0-.729.033-1.467.094-2.186H7.218a7.936 7.936 0 000 4.371h4.106a25.99 25.99 0 01-.094-2.185z"
                    />
                    <path
                      data-name="Path 61777"
                      d="M14.826 9.277c-.537 0-1.44 1.529-1.887 4.371h3.774c-.445-2.842-1.348-4.371-1.887-4.371z"
                    />
                    <path
                      data-name="Path 61778"
                      d="M14.826 25.306c.537 0 1.44-1.529 1.887-4.371h-3.772c.445 2.843 1.345 4.371 1.885 4.371z"
                    />
                    <path
                      data-name="Path 61779"
                      d="M18.333 15.106c.06.718.094 1.457.094 2.186s-.033 1.467-.094 2.186h4.106a7.934 7.934 0 000-4.371z"
                    />
                    <path
                      data-name="Path 61780"
                      d="M29.224 30.406V4.177a4.345 4.345 0 00-4.319-4.371H1.873a1.448 1.448 0 00-1.44 1.457V33.32a1.448 1.448 0 001.44 1.457h23.032a4.345 4.345 0 004.319-4.371zm-5.758-9.471a9.317 9.317 0 01-12.236 5.1 9.415 9.415 0 01-5.038-5.1 9.547 9.547 0 010-7.286 9.317 9.317 0 0112.236-5.1 9.415 9.415 0 015.038 5.1 9.548 9.548 0 010 7.285z"
                    />
                    <path
                      data-name="Path 61781"
                      d="M12.769 15.106c-.059.679-.1 1.4-.1 2.186s.042 1.507.1 2.186h4.117c.059-.679.1-1.4.1-2.186s-.042-1.507-.1-2.186z"
                    />
                    <path
                      data-name="Path 61782"
                      d="M17.014 24.988a7.969 7.969 0 004.858-4.054h-3.7a13.4 13.4 0 01-1.158 4.054z"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
