import React from 'react';

import th from 'ui/theme';

const MessageRead = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg height={512} viewBox="0 0 24 24" width={512} fill={fill} {...rest}>
      <path d="M22.437 6.554l-9.958-5.432a1 1 0 00-.958 0L1.564 6.554A2.995 2.995 0 000 9.188V20c0 1.654 1.346 3 3 3h18c1.654 0 3-1.346 3-3V9.188c0-1.1-.599-2.109-1.563-2.634zM2.521 8.31L12 3.139l9.479 5.17c.321.176.521.512.521.879v1.249l-9.414 4.917a1.294 1.294 0 01-1.169.002L2 10.437V9.188c0-.367.2-.703.521-.878z" />
    </svg>
  );
};

export default MessageRead;
