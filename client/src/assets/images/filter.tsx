import React from 'react';

import th from 'ui/theme';

const Filter = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={30} height={30} viewBox="0 0 30 30" {...rest}>
      <g fill="none" fillRule="evenodd">
        <circle stroke={fill} cx={15} cy={15} r={14.5} />
        <g fill={fill} fillRule="nonzero">
          <path d="M12.082 15.673c.283.42.199.07.199 8.417 0 .747.834 1.175 1.422.728 2.514-1.935 3.016-2.103 3.016-3.008 0-6.083-.07-5.74.2-6.137L21 10H8l4.082 5.673zM22.901 7.396A.844.844 0 0022.167 7H7.83c-.669 0-1.062.67-.678 1.157L7.847 9H22.15c.63-.763 1.052-1.092.752-1.604z" />
        </g>
      </g>
    </svg>
  );
};

export default Filter;
