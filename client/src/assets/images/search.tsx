import React from 'react';

import th from 'ui/theme';

const Search = ({
  fill = th.colors.brand.primary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      {...rest}
    >
      <g transform="translate(-16 -10)" fill="none" fillRule="evenodd">
        <g fill={fill} fillRule="nonzero">
          <path d="M32.134 25A8.49 8.49 0 0131 26.134L34.866 30 36 28.865 32.134 25zM24.5 27c-4.687 0-8.5-3.813-8.5-8.5 0-4.687 3.813-8.5 8.5-8.5 4.687 0 8.5 3.813 8.5 8.5 0 4.687-3.813 8.5-8.5 8.5zm0-16.105c-4.194 0-7.605 3.411-7.605 7.605 0 4.194 3.411 7.605 7.605 7.605 4.194 0 7.605-3.411 7.605-7.605 0-4.194-3.411-7.605-7.605-7.605z" />
        </g>
      </g>
    </svg>
  );
};

export default Search;
