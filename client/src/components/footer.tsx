import React from 'react';
import styled from '@emotion/styled';

import useScrollPosition from 'hooks/use-scroll-position';
import l from 'ui/layout';
import th from 'ui/theme';

const StyledFooter = styled(l.Div)(({ isBottom }: { isBottom?: boolean }) => ({
  background: th.colors.background,
  borderBottom: `${th.spacing.sm} solid ${th.colors.brand.primary}`,
  bottom: 0,
  boxShadow: isBottom ? undefined : th.shadows.contentTop,
  paddingBottom: th.spacing.md,
  position: 'fixed',
  zIndex: 10,
  width: th.sizes.fill,
}));

const Footer = () => {
  const { isBottom } = useScrollPosition();

  return <StyledFooter isBottom={isBottom} />;
};

export default Footer;
