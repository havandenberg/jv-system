import React from 'react';

import l from 'ui/layout';
import th from 'ui/theme';

interface Props {
  height?: string | number;
  status: keyof typeof th.colors.status;
}

const StatusIndicator = ({ height = th.sizes.xs, status }: Props) => (
  <l.Div
    background={th.colors.status[status]}
    borderRadius={th.borderRadii.circle}
    height={height}
    width={height}
  />
);

export default StatusIndicator;
