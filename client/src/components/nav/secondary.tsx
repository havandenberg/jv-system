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

export interface SecondaryNavProps {
  activePathname: string;
  baseUrl: string;
  navItems: NavItemProps[];
  search?: string;
}

const SecondaryNav = ({
  activePathname,
  baseUrl,
  navItems,
  search,
}: SecondaryNavProps) => {
  return (
    <l.Flex
      flex={1}
      height={th.heights.nav - th.heights.navButton}
      pt={th.spacing.tn}
      px={th.spacing.sm}
    >
      {navItems.map(
        ({ disabled, search: itemSearch, to, text, visible }, idx) => {
          const path = `${baseUrl}/${to}${itemSearch || ''}`;
          const active = activePathname.includes(path);
          return (
            visible !== false && (
              <l.AreaLink
                key={idx}
                to={disabled ? '#' : `${path}${itemSearch ? '' : search}`}
              >
                <NavItem active={active} disabled={disabled} px={th.sizes.icon}>
                  <ty.BodyText>{text}</ty.BodyText>
                </NavItem>
              </l.AreaLink>
            )
          );
        },
      )}
    </l.Flex>
  );
};

export default SecondaryNav;
