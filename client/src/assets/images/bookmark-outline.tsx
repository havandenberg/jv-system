import React from 'react';

import th from 'ui/theme';

const BookmarkOutline = ({
  fill = th.colors.brand.primary,
  height = th.sizes.icon,
  width = th.sizes.icon,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 90 90" width={width} height={height} {...rest}>
    <g fill={fill} fillRule="nonzero">
      <path d="M45 0C20.185 0 0 20.185 0 45s20.185 45 45 45 45-20.189 45-45S69.815 0 45 0Zm0 83.333C23.866 83.333 6.667 66.138 6.667 45 6.667 23.862 23.866 6.667 45 6.667c21.138 0 38.333 17.195 38.333 38.333 0 21.138-17.199 38.333-38.333 38.333Z" />
      <path d="M58.913 23H31.087A2.089 2.089 0 0 0 29 25.09V66.91c0 .804.46 1.536 1.183 1.885.723.348 1.581.25 2.208-.252L45 58.435l12.61 10.107a2.083 2.083 0 0 0 2.207.252A2.091 2.091 0 0 0 61 66.909V25.091C61 23.936 60.066 23 58.913 23Zm-2.087 39.559-10.522-8.434a2.081 2.081 0 0 0-2.608 0l-10.522 8.434V27.182h23.652v35.377Z" />
    </g>
  </svg>
);

export default BookmarkOutline;
