import React from 'react';

import th from 'ui/theme';

const ArrowInCircleLeft = ({
  fill = th.colors.brand.secondary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg width={37} height={37} viewBox="0 0 37 37" {...rest}>
    <g fill={fill} fillRule="nonzero">
      <path d="M0 18.5C0 28.702 8.298 37 18.5 37S37 28.702 37 18.5 28.7 0 18.5 0 0 8.298 0 18.5zm34.134 0c0 8.62-7.013 15.634-15.634 15.634-8.62 0-15.634-7.015-15.634-15.634 0-8.62 7.013-15.634 15.634-15.634 8.62 0 15.634 7.015 15.634 15.634z" />
      <path d="M20.067 10.914l-7.15 7.118a1.418 1.418 0 000 2.007l7.15 7.118a1.434 1.434 0 001.86 0c.6-.51.67-1.41.157-2.007l-6.136-6.107 6.136-6.121a1.418 1.418 0 000-2.008 1.434 1.434 0 00-2.017 0z" />
    </g>
  </svg>
);

export default ArrowInCircleLeft;
