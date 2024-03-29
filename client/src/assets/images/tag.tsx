import React from 'react';

import th from 'ui/theme';

const Tag = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="90px" height="90px" viewBox="0 0 90 90" {...rest}>
      <g fill={fill} fillRule="nonzero">
        <path d="M45 0c24.815 0 45 20.185 45 45S69.815 90 45 90 0 69.811 0 45 20.185 0 45 0Zm0 83.333c21.134 0 38.333-17.195 38.333-38.333C83.333 23.862 66.134 6.667 45 6.667 23.862 6.667 6.667 23.862 6.667 45c0 21.138 17.199 38.333 38.333 38.333Z" />
        <path
          d="M67.52 32.1a3.18 3.18 0 0 0-1.696-1.355L52.51 26.18a3.17 3.17 0 0 0-2.655.256L23.61 41.6a3.184 3.184 0 0 0-1.497 1.957A3.187 3.187 0 0 0 22.432 46L33.04 64.388a3.182 3.182 0 0 0 1.956 1.5 3.18 3.18 0 0 0 2.443-.32l26.244-15.164a3.17 3.17 0 0 0 1.548-2.167l2.709-13.824a3.207 3.207 0 0 0-.343-2.181c-.025-.045-.197.042-.223 0l.146-.131Zm-6.124 3.153a4.494 4.494 0 0 1-1.645 6.142 4.5 4.5 0 1 1 1.645-6.141Z"
          stroke={fill}
          strokeWidth={1.157}
        />
      </g>
    </svg>
  );
};

export default Tag;
