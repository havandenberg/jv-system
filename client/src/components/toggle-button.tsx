import React from 'react';
import { constantCase } from 'change-case';

import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';
import { contrastColor } from 'ui/utils';

interface Props {
  color?: string;
  customStyles?: {
    text?: TextProps;
    wrapper?: DivProps;
  };
  diameter?: string | number;
  status?: keyof typeof th.colors.status;
  text?: string;
  title?: string;
  value?: number;
}

const StatusIndicator = ({
  color,
  customStyles,
  diameter = th.sizes.xs,
  status = 'warning',
  text,
  title,
  value,
}: Props) => {
  return (
    <l.Flex
      alignCenter
      background={color || th.colors.status[status]}
      borderRadius={text ? th.borderRadii.default : th.borderRadii.circle}
      height={text ? 'auto' : diameter}
      justifyCenter
      p={text ? th.spacing.xs : 0}
      title={title}
      width={text ? 'auto' : diameter}
      {...(customStyles?.wrapper || {})}
    >
      {(text || value !== undefined) && (
        <ty.SmallText
          bold
          color={contrastColor(color || th.colors.status[status])}
          {...(customStyles?.text || {})}
        >
          {constantCase(text || '') || value}
        </ty.SmallText>
      )}
    </l.Flex>
  );
};

export default StatusIndicator;
