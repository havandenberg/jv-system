import React from 'react';
import styled from '@emotion/styled';

import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { NavItemProps } from './item';

export const NavItem = styled(l.Flex)(
  ({ active, disabled }: { active?: boolean; disabled?: boolean }) => ({
    alignItems: 'center',
    cursor: disabled ? 'default' : 'pointer',
    justifyContent: 'center',
    height: th.sizes.fill,
    opacity: active ? 1 : th.opacities.secondary,
    transition: th.transitions.default,
    ':hover': {
      opacity: disabled ? undefined : 1,
    },
  }),
  ...divPropsSet,
);

interface SecondaryNavProps {
  activePathname: string;
  baseUrl: string;
  navItems: NavItemProps[];
}

const SecondaryNav = ({
  activePathname,
  baseUrl,
  navItems,
}: SecondaryNavProps) => (
  <l.Flex flex={1}>
    {navItems.map(({ disabled, to, text }, idx) => {
      const pathname = `${baseUrl}/${to}`;
      const active = activePathname.includes(pathname);
      return (
        <l.AreaLink key={idx} to={disabled ? '#' : pathname}>
          <NavItem active={active} disabled={disabled} px={th.spacing.lg}>
            <ty.LargeText>{text}</ty.LargeText>
          </NavItem>
        </l.AreaLink>
      );
    })}
  </l.Flex>
);

export default SecondaryNav;
