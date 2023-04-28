import React from 'react';
import styled from '@emotion/styled';

import Breadcrumbs, { BreadcrumbProps } from 'components/nav/breadcrumbs';
import useScrollPosition from 'hooks/use-scroll-position';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Content = styled(l.Div)(
  ({
    extraPaddingTop = 0,
    maxWidth,
    noMaxWidth,
  }: {
    extraPaddingTop?: number;
    maxWidth?: number;
    noMaxWidth?: boolean;
  }) => ({
    margin: '0 auto',
    paddingBottom: th.spacing.lg,
    paddingTop: th.heights.nav + th.heights.pageHeader + extraPaddingTop,
    width: noMaxWidth || maxWidth ? 'auto' : th.widths.maxContent,
  }),
);

const Header = styled(l.Div)(({ shadow }: { shadow?: boolean }) => ({
  background: th.colors.background,
  boxShadow: shadow ? th.shadows.contentBottom : undefined,
  left: 0,
  position: 'fixed',
  paddingTop: th.sizes.icon,
  top: th.heights.nav,
  width: th.sizes.fill,
  zIndex: 30,
}));

interface Props {
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbProps[];
  centerAction?: React.ReactNode;
  children?: React.ReactNode;
  enableShadow?: boolean;
  extraPaddingTop?: number;
  headerChildren?: React.ReactNode;
  maxWidth?: number;
  noMaxWidth?: boolean;
  title?: string;
}

const Page = ({
  actions,
  breadcrumbs,
  centerAction = <div />,
  children,
  enableShadow = true,
  extraPaddingTop,
  headerChildren,
  maxWidth,
  noMaxWidth,
  title,
}: Props) => {
  const scrollPosition = useScrollPosition();
  return (
    <Content
      extraPaddingTop={extraPaddingTop}
      maxWidth={maxWidth}
      noMaxWidth={noMaxWidth}
    >
      <Header shadow={enableShadow && scrollPosition.y < 0}>
        <l.Div
          maxWidth={
            noMaxWidth || maxWidth
              ? `calc(${th.sizes.fill} - ${th.spacing.xl})`
              : th.widths.maxContent
          }
          mx="auto"
          width={
            noMaxWidth || maxWidth
              ? `calc(${th.sizes.fill} - ${th.spacing.xl})`
              : th.sizes.fill
          }
        >
          <l.Flex justifyEnd column>
            {breadcrumbs && (
              <l.Div height={12} mb={th.spacing.sm}>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
              </l.Div>
            )}
            {(title || actions) && (
              <l.Flex alignCenter justifyBetween mb={th.spacing.md}>
                {title && (
                  <ty.TitleText
                    mb={0}
                    mr={th.spacing.lg}
                    mt={th.spacing.sm}
                    ellipsis
                  >
                    {title}
                  </ty.TitleText>
                )}
                {centerAction}
                {actions && <l.Flex>{actions}</l.Flex>}
              </l.Flex>
            )}
          </l.Flex>
          {headerChildren}
        </l.Div>
      </Header>
      {children}
    </Content>
  );
};

export default Page;
