import React from 'react';

import th from 'ui/theme';

const UpArrow = ({
  fill = th.colors.brand.secondary,
  ...rest
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 512 512" fill={fill} {...rest}>
      <path d="M369.227 283.365l-99.148-99.148c-7.734-7.694-20.226-7.694-27.96 0l-99.148 99.148c-6.365 7.416-6.365 18.382 0 25.798 7.119 8.309 19.651 9.28 27.96 2.161L256 226.256l85.267 85.069c7.734 7.694 20.226 7.694 27.96 0 7.694-7.734 7.694-20.227 0-27.96z" />
    </svg>
  );
};

export default UpArrow;
