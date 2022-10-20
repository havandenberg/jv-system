import React from 'react';

import th from 'ui/theme';

const Bookmark = ({
  fill = th.colors.brand.primary,
  height = th.sizes.icon,
  width = th.sizes.icon,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 90 90" width={width} height={height} {...rest}>
    <g fill={fill} fillRule="nonzero">
      <path d="M45 0C20.185 0 0 20.185 0 45s20.185 45 45 45 45-20.189 45-45S69.815 0 45 0Zm0 83.333C23.866 83.333 6.667 66.138 6.667 45 6.667 23.862 23.866 6.667 45 6.667c21.138 0 38.333 17.195 38.333 38.333 0 21.138-17.199 38.333-38.333 38.333Z" />
      <path d="M57.37 22H32.764C30.76 22 29 23.788 29 25.905v39.482c0 .708.182 1.299.475 1.755.35.545.914.858 1.52.858.571 0 1.18-.276 1.743-.797l11.009-10.139c.34-.315.828-.495 1.336-.495.507 0 .995.18 1.336.496L57.39 67.201c.564.523 1.131.799 1.702.799.966 0 1.907-.808 1.907-2.613V25.905C61 23.788 59.374 22 57.37 22Z" />
    </g>
  </svg>
);

export default Bookmark;
