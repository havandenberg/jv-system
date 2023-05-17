import React from 'react';
import styled from '@emotion/styled';

import { getNavItems } from 'components/nav';
import { useActiveUser } from 'components/user/context';
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
  height: 400,
  transition: th.transitions.default,
  '.title': {
    colors: th.colors.brand.secondary,
    transition: th.transitions.default,
  },
  ':hover': {
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

const DashboardNav = () => {
  const { roles } = useActiveUser();

  const navItems = getNavItems(Object.keys(roles));

  return (
    <l.Grid
      gridGap={th.spacing.lg}
      gridTemplateColumns="repeat(5, 1fr)"
      justifyBetween
      width={th.sizes.fill}
    >
      {navItems.map(
        (it, idx) =>
          it.visible !== false && (
            <l.Div key={idx} relative>
              <l.AreaLink to={it.to}>
                <ItemWrapper>
                  <ty.LargeText
                    className="title"
                    color={th.colors.brand.primary}
                    my={th.sizes.md}
                  >
                    {it.text}
                  </ty.LargeText>
                  {it.dashboardItems && (
                    <div>
                      {it.dashboardItems
                        .filter(
                          (item) =>
                            (!IS_PRODUCTION || !item.isDev) &&
                            item.visible !== false,
                        )
                        .map((i, idx) => {
                          const pathname = `${it.baseUrl || it.to}/${i.to}`;
                          return (
                            !i.disabled && (
                              <l.Div mb={th.spacing.sm}>
                                <l.AreaLink key={idx} to={pathname}>
                                  <SecondaryItemWrapper>
                                    <ty.BodyText
                                      center
                                      color={th.colors.brand.secondary}
                                    >
                                      {i.text}
                                    </ty.BodyText>
                                  </SecondaryItemWrapper>
                                </l.AreaLink>
                              </l.Div>
                            )
                          );
                        })}
                    </div>
                  )}
                </ItemWrapper>
              </l.AreaLink>
            </l.Div>
          ),
      )}
    </l.Grid>
  );
};

export default DashboardNav;
