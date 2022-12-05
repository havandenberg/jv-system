import React from 'react';

import th from 'ui/theme';

const Cross = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" {...rest}>
      <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
    </svg>
  );
};

export default Cross;
