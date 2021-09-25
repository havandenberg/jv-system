import React from 'react';

import th from 'ui/theme';

const Reset = ({
  fill = th.colors.brand.secondary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg width={27} height={27} viewBox="0 0 27 27" {...rest}>
    <g fill={fill} fillRule="nonzero">
      <path d="M13.5 0C20.944 0 27 6.056 27 13.5S20.944 27 13.5 27 0 20.943 0 13.5 6.056 0 13.5 0zm0 25C19.84 25 25 19.841 25 13.5S19.84 2 13.5 2C7.159 2 2 7.159 2 13.5S7.16 25 13.5 25z" />
      <path d="M10.282 8.58a6.615 6.615 0 013.635-1.08 6.615 6.615 0 014.655 1.904 6.474 6.474 0 011.41 2.066A6.39 6.39 0 0120.5 14a6.39 6.39 0 01-.518 2.53 6.565 6.565 0 01-3.503 3.458 6.615 6.615 0 01-2.562.512 6.641 6.641 0 01-2.212-.376 6.583 6.583 0 01-3.331-2.616 6.414 6.414 0 01-.858-1.983.845.845 0 01.63-1.016.854.854 0 011.03.622 4.83 4.83 0 001.702 2.634 4.873 4.873 0 003.039 1.05c1.302 0 2.527-.501 3.448-1.41A4.753 4.753 0 0018.793 14a4.753 4.753 0 00-1.428-3.404 4.876 4.876 0 00-3.448-1.41c-.963 0-1.893.276-2.691.798A4.846 4.846 0 009.6 11.76h.943c.472 0 .854.377.854.843a.848.848 0 01-.854.842h-3.19a.848.848 0 01-.853-.842V9.409c0-.465.382-.843.854-.843.47 0 .853.378.853.843v1.354a6.543 6.543 0 012.075-2.183z" />
    </g>
  </svg>
);

export default Reset;
