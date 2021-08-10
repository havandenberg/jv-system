import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

import LogoImg from 'assets/images/jv-logo-white-no-text.png';
import UserLogin from 'components/user/login';
import l from 'ui/layout';
import th from 'ui/theme';

import NavItem, { NavItemProps } from './item';
import SecondaryNav from './secondary';

export interface NavItemType extends NavItemProps {
  secondaryItems?: NavItemProps[];
  dashboardItems?: NavItemProps[];
}

export const navItems: NavItemType[] = [
  {
    text: 'Sales',
    to: '/sales',
    dashboardItems: [
      { text: 'Inventory', to: 'inventory' },
      { text: 'Vessels', to: 'vessels' },
      { text: 'Calendar', to: 'calendar' },
      { text: 'Price Sheet', to: 'price-sheet' },
      { text: 'Agenda', to: 'agenda' },
    ],
    secondaryItems: [
      { text: 'Inventory', to: 'inventory' },
      { text: 'Vessels', to: 'vessels' },
      { text: 'Calendar', to: 'calendar' },
      { text: 'Price Sheet', to: 'price-sheet' },
      { text: 'Agenda', to: 'agenda' },
    ],
  },
  {
    baseUrl: '/reports',
    text: 'Reports',
    to: '/reports/inspections',
    dashboardItems: [
      { text: 'Inspections', to: 'inspections' },
      // { text: 'Movement', to: 'movement' },
    ],
    secondaryItems: [
      { text: 'Inspections', to: 'inspections' },
      // { text: 'Movement', to: 'movement' },
    ],
  },
  {
    text: 'Directory',
    to: '/directory',
    dashboardItems: [
      { text: 'Internal', to: 'internal' },
      { text: 'Customers', to: 'customers' },
      { text: 'Shippers', to: 'shippers' },
      { text: 'Warehouses', to: 'warehouses' },
      { text: 'Groups', to: 'groups' },
    ],
    secondaryItems: [
      { text: 'Internal', to: 'internal' },
      { text: 'Customers', to: 'customers' },
      { text: 'Shippers', to: 'shippers' },
      { text: 'Warehouses', to: 'warehouses' },
      { text: 'Groups', to: 'groups' },
    ],
  },
];

const Wrapper = styled(l.Flex)({
  background: th.colors.background,
  height: th.heights.nav,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
  zIndex: 11,
});

const Logo = styled(l.AreaLink)({
  background: th.colors.brand.primary,
  borderBottomRightRadius: th.borderRadii.default,
  justifyContent: 'center',
  paddingTop: 13,
  width: 150,
});

const Nav = () => {
  const { pathname } = useLocation();
  const activeItem = navItems.find((it) => pathname.includes(it.to));
  const activeBaseUrl = activeItem ? activeItem.baseUrl || activeItem.to : '';
  const activeSecondaryItems = activeItem && activeItem.secondaryItems;

  const [hoverTo, setHoverTo] = useState('');
  const hoverItem = navItems.find((it) => hoverTo === it.to);
  const hoverBaseUrl = hoverItem ? hoverItem.baseUrl || hoverItem.to : '';
  const hoverSecondaryItems = hoverItem && hoverItem.secondaryItems;
  const secondaryItems = hoverItem
    ? hoverSecondaryItems
      ? hoverSecondaryItems
      : []
    : activeSecondaryItems
    ? activeSecondaryItems
    : [];

  return (
    <Wrapper>
      <Logo to="/">
        <l.Flex justifyCenter>
          <l.Img height={50} src={LogoImg} width={50} />
        </l.Flex>
      </Logo>
      <l.Flex column flex={1} relative>
        <l.Flex
          bg={th.colors.brand.primary}
          height={th.heights.navButton}
          position="absolute"
          width="100%"
        >
          <l.Div onMouseLeave={() => setHoverTo('')}>
            <l.Flex height={th.heights.navButton}>
              {navItems.map((item, idx) => (
                <NavItem
                  active={pathname.includes(item.to)}
                  hover={hoverItem && hoverItem.to === item.to}
                  key={idx}
                  {...item}
                  setHover={setHoverTo}
                />
              ))}
            </l.Flex>
            <SecondaryNav
              activePathname={pathname}
              baseUrl={hoverBaseUrl || activeBaseUrl}
              navItems={secondaryItems}
            />
          </l.Div>
        </l.Flex>
      </l.Flex>
      <UserLogin />
    </Wrapper>
  );
};

export default Nav;
