import React from 'react';

import th from 'ui/theme';

const Remove = ({
  fill = th.colors.status.error,
  ...rest
}: React.SVGProps<SVGSVGElement>) => (
  <svg fill={fill} viewBox="0 0 512 512" {...rest}>
    <path d="M256 0C114.618 0 0 114.618 0 256s114.618 256 256 256 256-114.618 256-256S397.382 0 256 0zm0 469.333c-117.818 0-213.333-95.515-213.333-213.333S138.182 42.667 256 42.667 469.333 138.182 469.333 256 373.818 469.333 256 469.333z" />
    <path d="M383.996 234.667H128.038c-11.782 0-21.333 9.551-21.333 21.333s9.551 21.333 21.333 21.333h255.957c11.782 0 21.333-9.551 21.333-21.333s-9.55-21.333-21.332-21.333z" />
  </svg>
);

export default Remove;
