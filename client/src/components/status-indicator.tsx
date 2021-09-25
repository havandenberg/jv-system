import React from 'react';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props {
  diameter?: string | number;
  status: keyof typeof th.colors.status;
  value?: number;
}

const StatusIndicator = ({ diameter = th.sizes.xs, status, value }: Props) => (
  <l.Flex
    alignCenter
    background={th.colors.status[status]}
    borderRadius={th.borderRadii.circle}
    height={diameter}
    justifyCenter
    width={diameter}
  >
    {value !== undefined && (
      <ty.SmallText bold inverted>
        {value}
      </ty.SmallText>
    )}
  </l.Flex>
);

export default StatusIndicator;
