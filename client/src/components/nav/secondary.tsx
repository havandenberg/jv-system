import React from 'react';
import styled from '@emotion/styled';

import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { NavItemProps } from './item';

const navItems: { [key: string]: NavItemProps[] } = {
  reports: [
    { text: 'Inspections', to: 'inspections' },
    { disabled: true, text: 'Market', to: 'market' },
    { disabled: true, text: 'Movement', to: 'movement' },
  ],
  inventory: [
    { text: 'Price Sheet', to: 'price-sheet' },
    { text: 'Agenda', to: 'agenda' },
  ],
};

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
};

export default SecondaryNav;
