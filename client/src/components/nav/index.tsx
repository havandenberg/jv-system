import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useLocation } from 'react-router-dom';

import LogoImg from 'assets/images/jv-logo-white-no-text.png';
import UserLogin from 'components/user/login';
import l from 'ui/layout';
import th from 'ui/theme';
import { IS_PRODUCTION } from 'utils/env';

import NavItem, { NavItemProps } from './item';
import SecondaryNav from './secondary';
import { StringParam } from 'use-query-params';
import { useQuerySet } from 'hooks/use-query-params';

export interface NavItemType extends NavItemProps {
  secondaryItems?: NavItemProps[];
  dashboardItems?: NavItemProps[];
}

export const navItems: NavItemType[] = [
  {
    text: 'Inventory',
    to: '/inventory',
    dashboardItems: [
      { text: 'Inventory', to: 'index' },
      { text: 'Orders', to: 'orders' },
      { text: 'Vessels', to: 'vessels' },
      { text: 'Truck Loads', to: 'truck-loads' },
      { text: 'Products', to: 'products' },
    ],
    secondaryItems: [
      { text: 'Inventory', to: 'index' },
      { text: 'Orders', to: 'orders' },
      { text: 'Vessels', to: 'vessels' },
      { text: 'Truck Loads', to: 'truck-loads' },
      { text: 'Products', to: 'products' },
    ],
  },
  {
    text: 'Sales',
    to: '/sales',
    dashboardItems: [
      { text: 'Programs', to: 'programs' },
      { text: 'Projections', to: 'projections' },
      { text: 'Price Sheet', to: 'price-sheet' },
      { text: 'Agenda', to: 'agenda' },
      { isDev: true, text: 'Calendar', to: 'calendar' },
    ],
    secondaryItems: [
      { text: 'Programs', to: 'programs' },
      { text: 'Projections', to: 'projections' },
      { text: 'Price Sheet', to: 'price-sheet' },
      { text: 'Agenda', to: 'agenda' },
      { isDev: true, text: 'Calendar', to: 'calendar' },
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
    text: 'Accounting',
    to: '/accounting',
    dashboardItems: [
      {
        text: 'Invoices',
        to: 'invoices',
      },
      { text: 'Expenses', to: 'expenses' },
    ],
    secondaryItems: [
      {
        text: 'Invoices',
        to: 'invoices',
      },
      { text: 'Expenses', to: 'expenses' },
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
      { text: 'Vendors', to: 'vendors' },
      { text: 'Groups', to: 'groups' },
    ],
    secondaryItems: [
      { text: 'Internal', to: 'internal' },
      { text: 'Customers', to: 'customers' },
      { text: 'Shippers', to: 'shippers' },
      { text: 'Warehouses', to: 'warehouses' },
      { text: 'Vendors', to: 'vendors' },
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
  zIndex: 31,
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
  const secondaryItems = (
    hoverItem
      ? hoverSecondaryItems
        ? hoverSecondaryItems
        : []
      : activeSecondaryItems
      ? activeSecondaryItems
      : []
  ).filter((item) => !IS_PRODUCTION || !item.isDev);

  const [{ coast, startDate, endDate }] = useQuerySet({
    coast: StringParam,
    startDate: StringParam,
    endDate: StringParam,
  });

  const secondarySearch =
    coast && startDate && endDate
      ? `?coast=${coast}&startDate=${startDate}&endDate=${endDate}`
      : '';

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
              {navItems
                .filter((item) => !IS_PRODUCTION || !item.isDev)
                .map((item, idx) => (
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
              search={secondarySearch}
            />
          </l.Div>
        </l.Flex>
      </l.Flex>
      <UserLogin />
    </Wrapper>
  );
};

export default Nav;
