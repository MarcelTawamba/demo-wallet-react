import * as React from 'react';

export default function NoTransactionPlaceholder({
  width = 200,
  height = 200,
  primary,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      viewBox="0 0 200 200">
      <defs>
        <clipPath id="clip-No_transactions">
          <rect width="200" height="200" />
        </clipPath>
      </defs>
      <g
        id="No_transactions"
        data-name="No transactions"
        clipPath="url(#clip-No_transactions)">
        <path
          id="primary"
          d="M-721-2983H-826a13.908,13.908,0,0,1-9.9-4.1,13.909,13.909,0,0,1-4.1-9.9v-21h76a13.909,13.909,0,0,0,9.9-4.1,13.909,13.909,0,0,0,4.1-9.9v-40h29a13.908,13.908,0,0,1,9.9,4.1,13.908,13.908,0,0,1,4.1,9.9v61a13.909,13.909,0,0,1-4.1,9.9A13.908,13.908,0,0,1-721-2983Z"
          transform="translate(892 3145)"
          fill={primary}
          opacity="0.35"
        />
        <g
          id="Rectangle_2328"
          data-name="Rectangle 2328"
          transform="translate(16 38)"
          fill="none"
          stroke="#9a9a9a"
          strokeWidth="8">
          <rect width="133" height="89" rx="14" stroke="none" />
          <rect x="4" y="4" width="125" height="81" rx="10" fill="none" />
        </g>
        <path
          id="Path_62236"
          data-name="Path 62236"
          d="M90.511,92.207a3.187,3.187,0,0,0-4.346-.437,2.869,2.869,0,0,0-.457,4.157,13.452,13.452,0,0,0,7.676,4.192v.067a3.1,3.1,0,0,0,6.177.151c5-.729,8.527-3.817,9.087-8.053.637-4.822-2.665-9.451-8.031-11.255l-1.052-.356V73.111a3.427,3.427,0,0,1,1.525,1.046,3.182,3.182,0,0,0,4.307.711,2.875,2.875,0,0,0,.744-4.119,10.374,10.374,0,0,0-6.575-3.755v-.239a3.093,3.093,0,0,0-6.181,0v.45q-.491.112-.994.256a9.213,9.213,0,0,0-6.535,8.007c-.282,3.654,1.756,6.826,5.451,8.484.468.21,1.18.494,2.078.83V94a6.4,6.4,0,0,1-2.872-1.8Zm12-.664c-.178,1.346-1.23,2.314-2.951,2.766V87.017C101.845,88.15,102.709,90.076,102.515,91.543ZM92.019,75.9a3.342,3.342,0,0,1,1.365-2.4v4.809A2.478,2.478,0,0,1,92.019,75.9Z"
          transform="translate(-14.741 -1.35)"
          fill="#9a9a9a"
        />
      </g>
    </svg>
  );
}
