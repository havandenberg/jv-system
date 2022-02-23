import React from 'react';

import th from 'ui/theme';

const Alert = ({
  fill = th.colors.status.error,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={th.sizes.icon}
    height={th.sizes.icon}
    viewBox="-2 -1.5 24 24"
    preserveAspectRatio="xMinYMin"
    fill={fill}
    {...rest}
  >
    <path d="M10 20.393c-5.523 0-10-4.477-10-10 0-5.522 4.477-10 10-10s10 4.478 10 10c0 5.523-4.477 10-10 10zm0-15a1 1 0 0 0-1 1v5a1 1 0 0 0 2 0v-5a1 1 0 0 0-1-1zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

export default Alert;
