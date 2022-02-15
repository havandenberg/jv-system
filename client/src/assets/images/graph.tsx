import React from 'react';

import th from 'ui/theme';

const Graph = ({
  fill = th.colors.white,
  stroke = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={22} {...rest}>
      <g stroke={stroke} fill={fill} fillRule="evenodd">
        <path strokeLinecap="square" d="M.5.5v21M.5 21.5h23" />
        <path strokeWidth={2} strokeLinecap="round" d="m1 17 8.5-6.5" />
        <path
          strokeWidth={2}
          strokeLinecap="square"
          d="m9.5 10.5 5 4M14.5 14.5l7-11"
        />
      </g>
    </svg>
  );
};

export default Graph;
