import React from 'react';

import th from 'ui/theme';

const ResetItem = ({
  fill = th.colors.brand.secondary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 94 94" fill={fill} {...rest}>
    <path d="M94 47C94 21.043 72.958 0 47 0S0 21.043 0 47s21.042 47 47 47 47-21.043 47-47zM69.273 67.466c-5.67 5.67-13.221 8.792-21.26 8.792-8.038 0-15.587-3.122-21.256-8.792a29.958 29.958 0 0 1-2.399-39.806l-8.424-8.424h24.397l.001 24.397-8.017-8.017c-5.015 7.4-4.192 17.475 2.311 23.979 3.57 3.568 8.324 5.534 13.39 5.534 5.063 0 9.818-1.966 13.389-5.537 3.568-3.567 5.535-8.323 5.535-13.389 0-5.062-1.965-9.817-5.535-13.389a18.888 18.888 0 0 0-5.604-3.876l-2.33-1.049 4.568-10.15 2.33 1.052a29.881 29.881 0 0 1 8.904 6.157c11.723 11.724 11.722 30.796 0 42.518z" />
  </svg>
);

export default ResetItem;
