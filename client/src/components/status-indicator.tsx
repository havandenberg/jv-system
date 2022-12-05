import React from 'react';
import styled from '@emotion/styled';
import { constantCase } from 'change-case';

import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';
import { contrastColor } from 'ui/utils';

const Wrapper = styled(l.Flex)(({ onClick }: { onClick?: () => void }) => ({
  transition: th.transitions.default,
  ':hover': {
    opacity: !!onClick ? 1 : undefined,
  },
}));

interface Props {
  color?: string;
  customStyles?: {
    text?: TextProps;
    wrapper?: DivProps;
  };
  diameter?: string | number;
  halfSelected?: boolean;
  onClick?: () => void;
  selected?: boolean;
  status?: keyof typeof th.colors.status;
  text?: string;
  title?: string;
  transparentWhenUnselected?: boolean;
  value?: number;
}

const StatusIndicator = ({
  color,
  customStyles,
  diameter = th.sizes.xs,
  onClick,
  halfSelected,
  selected = true,
  status = 'warning',
  text,
  title,
  transparentWhenUnselected,
  value,
}: Props) => (
  <Wrapper
    alignCenter
    background={
      transparentWhenUnselected && !selected && !halfSelected
        ? 'transparent'
        : color || th.colors.status[status]
    }
    border={th.borders.primary}
    borderRadius={text ? th.borderRadii.default : th.borderRadii.circle}
    cursor={onClick ? 'pointer' : 'default'}
    height={text ? 'auto' : diameter}
    justifyCenter
    onClick={onClick}
    opacity={selected ? 1 : halfSelected ? th.opacities.secondary : 0.3}
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
  </Wrapper>
);

export default StatusIndicator;
