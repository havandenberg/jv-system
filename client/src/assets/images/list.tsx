import React from 'react';

import th from 'ui/theme';

const List = ({
  fill = th.colors.white,
  stroke = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={24} height={22} {...rest}>
      <g fill={fill} stroke={stroke} fillRule="evenodd">
        <rect width={24} height={6} rx={2} />
        <rect y={8} width={24} height={6} rx={2} />
        <rect y={16} width={24} height={6} rx={2} />
      </g>
    </svg>
  );
};

export default List;
