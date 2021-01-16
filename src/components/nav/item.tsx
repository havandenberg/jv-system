import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Button = styled(l.Flex)(
  ({ active, disabled }: { active?: boolean; disabled?: boolean }) => ({
    alignItems: 'center',
    background: active ? th.colors.brand.primaryAccent : undefined,
    justifyContent: 'center',
    height: th.sizes.fill,
    transition: th.transitions.default,
    width: 176,
    ':hover': {
      background: disabled ? undefined : th.colors.brand.primaryAccent,
    },
  }),
);

export interface NavItemProps {
  active?: boolean;
  disabled?: boolean;
  text: string;
  to: string;
}

const NavItem = ({ active, disabled, text, to }: NavItemProps) => (
  <l.Div mr={th.spacing.md}>
    <l.AreaLink to={disabled ? '#' : to}>
      <Button
        active={active}
        cursor={disabled ? 'default' : 'pointer'}
        disabled={disabled}
      >
        <ty.DisplayText inverted fontSize={th.fontSizes.large}>
          {text}
        </ty.DisplayText>
      </Button>
    </l.AreaLink>
  </l.Div>
);

export default NavItem;
