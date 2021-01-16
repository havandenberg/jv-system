import React from 'react';
import styled from '@emotion/styled';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import LogoImg from 'assets/images/jv-logo-white.png';
import l from 'ui/layout';
import th from 'ui/theme';
import NavItem, { NavItemProps } from './item';
import SecondaryNav from './secondary';

const navItems: NavItemProps[] = [
  {
    disabled: true,
    text: 'Directory',
    to: '/directory',
  },
  {
    disabled: true,
    text: 'Inventory',
    to: '/inventory',
  },
  {
    text: 'Reports',
    to: '/reports/inspections',
  },
];

const Logo = styled(l.AreaLink)({
  background: th.colors.brand.primary,
  borderTopRightRadius: th.borderRadii.default,
  borderBottomRightRadius: th.borderRadii.default,
  justifyContent: 'center',
  paddingTop: th.spacing.md,
  width: 246,
});

const Nav = ({ location: { pathname } }: RouteComponentProps) => (
  <l.Flex
    bg={th.colors.background}
    h={th.heights.nav}
    position="fixed"
    top={0}
    left={0}
    right={0}
  >
    <Logo to="/">
      <l.Flex justifyCenter>
        <l.Img height={100} src={LogoImg} width={136} />
      </l.Flex>
    </Logo>
    <l.Flex column flex={1}>
      <l.Div height={24} />
      <l.Flex bg={th.colors.brand.primary} height={th.heights.navButton}>
        {navItems.map((item, idx) => (
          <NavItem active={pathname === item.to} key={idx} {...item} />
        ))}
      </l.Flex>
      <SecondaryNav activePathname={pathname} />
    </l.Flex>
  </l.Flex>
);

export default withRouter(Nav);
