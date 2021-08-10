import React from 'react';

import th from 'ui/theme';

const Filter = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={30} height={30} fill={fill} viewBox="0 0 459 459" {...rest}>
      <path d="M124.95 181.05l-35.7 35.7L204 331.5l255-255-35.7-35.7L204 260.1l-79.05-79.05zM408 408H51V51h255V0H51C22.95 0 0 22.95 0 51v357c0 28.05 22.95 51 51 51h357c28.05 0 51-22.95 51-51V204h-51v204z" />
    </svg>
  );
};

export default Filter;
