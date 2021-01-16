import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { NavItemProps } from './item';

const navItems: { [key: string]: NavItemProps[] } = {
  reports: [
    { text: 'Inspections', to: 'inspections' },
    { disabled: true, text: 'Market', to: 'market' },
  ],
};

const NavItem = styled(l.Flex)(
  ({ active, disabled }: { active?: boolean; disabled?: boolean }) => ({
    alignItems: 'center',
    cursor: disabled ? 'default' : 'pointer',
    justifyContent: 'center',
    height: th.sizes.fill,
    opacity: active ? 1 : th.opacities.secondary,
    padding: `0 ${th.spacing.lg}`,
    transition: th.transitions.default,
    ':hover': {
      opacity: disabled ? undefined : 1,
    },
  }),
);

interface SecondaryNavProps {
  activePathname: string;
}

const SecondaryNav = ({ activePathname }: SecondaryNavProps) => {
  const baseUrl = activePathname.split('/')[1];
  const items = navItems[baseUrl];

  if (!items) {
    return null;
  }

  return (
    <l.Flex flex={1}>
      {items.map(({ disabled, to, text }, idx) => {
        const pathname = `/${baseUrl}/${to}`;
        const active = activePathname === pathname;
        return (
          <l.AreaLink key={idx} to={disabled ? '#' : pathname}>
            <NavItem active={active} disabled={disabled}>
              <ty.LargeText>{text}</ty.LargeText>
            </NavItem>
          </l.AreaLink>
        );
      })}
    </l.Flex>
  );
};

export default SecondaryNav;
