import React from 'react';
import styled from '@emotion/styled';

import Breadcrumbs, { BreadcrumbProps } from 'components/nav/breadcrumbs';
import useScrollPosition from 'hooks/use-scroll-position';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Content = styled(l.Div)(
  ({ extraPaddingTop = 0 }: { extraPaddingTop?: number }) => ({
    margin: '0 auto',
    paddingBottom: th.spacing.md,
    paddingTop: th.heights.nav + th.heights.pageHeader + extraPaddingTop,
    width: th.widths.maxContent,
  }),
);

const Header = styled(l.Div)(({ shadow }: { shadow?: boolean }) => ({
  background: th.colors.background,
  boxShadow: shadow ? th.shadows.contentBottom : undefined,
  left: 0,
  position: 'fixed',
  paddingTop: th.spacing.lg,
  top: th.heights.nav,
  width: th.sizes.fill,
  zIndex: 10,
}));

interface Props {
  breadcrumbs?: BreadcrumbProps[];
  children?: React.ReactNode;
  extraPaddingTop?: number;
  headerChildren?: React.ReactNode;
  title: string;
}

const Page = ({
  breadcrumbs,
  children,
  extraPaddingTop,
  headerChildren,
  title,
}: Props) => {
  const scrollPosition = useScrollPosition();
  return (
    <Content extraPaddingTop={extraPaddingTop}>
      <Header shadow={scrollPosition.y < 0}>
        <l.Div maxWidth={th.widths.maxContent} mx="auto" width={th.sizes.fill}>
          {breadcrumbs && (
            <l.Div mb={th.spacing.sm}>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            </l.Div>
          )}
          <ty.TitleText mb={th.spacing.lg}>{title}</ty.TitleText>
          {headerChildren}
        </l.Div>
      </Header>
      {children}
    </Content>
  );
};

export default Page;
