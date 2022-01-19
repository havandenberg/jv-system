import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

const Button = styled(l.Flex)(
  ({
    active,
    hover,
  }: {
    active?: boolean;
    hover?: boolean;
    disabled?: boolean;
  }) => ({
    alignItems: 'center',
    background: active
      ? th.colors.brand.primaryAccent
      : hover
      ? hexColorWithTransparency(th.colors.brand.primaryAccent, 0.5)
      : undefined,
    justifyContent: 'center',
    height: th.sizes.fill,
    transition: th.transitions.default,
    width: 176,
  }),
);

export interface NavItemProps {
  active?: boolean;
  hover?: boolean;
  baseUrl?: string;
  disabled?: boolean;
  isDev?: boolean;
  setHover?: (to: string) => void;
  text: string;
  to: string;
  search?: string;
}

const NavItem = ({
  active,
  disabled,
  hover,
  search,
  setHover,
  text,
  to,
}: NavItemProps) => (
  <l.AreaLink to={disabled ? '#' : `${to}${search || ''}`}>
    <Button
      active={active}
      cursor={disabled ? 'default' : 'pointer'}
      disabled={disabled}
      hover={hover}
      onMouseEnter={() => setHover && setHover(to)}
    >
      <ty.DisplayText inverted fontSize={th.fontSizes.body}>
        {text}
      </ty.DisplayText>
    </Button>
  </l.AreaLink>
);

export default NavItem;
