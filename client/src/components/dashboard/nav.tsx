import React from 'react';
import styled from '@emotion/styled';

import { navItems } from 'components/nav';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { IS_PRODUCTION } from 'utils/env';

const ItemWrapper = styled(l.Flex)({
  alignItems: 'center',
  background: th.colors.brand.containerBackground,
  borderRadius: th.borderRadii.default,
  border: th.borders.disabled,
  boxShadow: th.shadows.boxLight,
  flexDirection: 'column',
  height: 220,
  transition: th.transitions.default,
  '.title': {
    colors: th.colors.brand.secondary,
    transition: th.transitions.default,
  },
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
    border: th.borders.disabled,
    '.title': {
      color: th.colors.brand.primaryAccent,
    },
  },
});

const SecondaryItemWrapper = styled(l.Flex)({
  alignItems: 'center',
  justifyContent: 'center',
  p: {
    transition: th.transitions.default,
  },
  ':hover': {
    p: {
      color: th.colors.brand.primaryAccent,
    },
  },
});

const DashboardNav = () => (
  <l.Grid
    gridGap={th.spacing.lg}
    gridTemplateColumns="repeat(3, 1fr)"
    justifyBetween
    width={th.sizes.fill}
  >
    {navItems.map((it, idx) => (
      <l.Div key={idx} relative>
        <l.AreaLink to={it.to}>
          <ItemWrapper>
            <ty.LargeText
              className="title"
              color={th.colors.brand.primary}
              mt={th.sizes.md}
            >
              {it.text}
            </ty.LargeText>
          </ItemWrapper>
        </l.AreaLink>
        {it.dashboardItems && (
          <l.Flex
            alignCenter
            bottom={40}
            flexWrap="wrap"
            left="50%"
            justifyCenter
            position="absolute"
            transform="translateX(-50%)"
            height={76}
            width={300}
          >
            {it.dashboardItems
              .filter((item) => !IS_PRODUCTION || !item.isDev)
              .map((i, idx) => {
                const pathname = `${it.baseUrl || it.to}/${i.to}`;
                return (
                  !i.disabled && (
                    <l.AreaLink key={idx} to={pathname} width={100}>
                      <SecondaryItemWrapper>
                        <ty.BodyText center color={th.colors.brand.secondary}>
                          {i.text}
                        </ty.BodyText>
                      </SecondaryItemWrapper>
                    </l.AreaLink>
                  )
                );
              })}
          </l.Flex>
        )}
      </l.Div>
    ))}
  </l.Grid>
);

export default DashboardNav;
