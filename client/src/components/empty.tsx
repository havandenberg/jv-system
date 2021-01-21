import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)({
  alignItems: 'center',
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  flexDirection: 'column',
  height: 300,
  justifyContent: 'center',
  width: th.sizes.fill,
});

const Empty = ({ header, text }: { header?: string; text?: string }) => (
  <Wrapper>
    {header && (
      <ty.LargeText mb={th.spacing.lg} secondary>
        {header}
      </ty.LargeText>
    )}
    {text && <ty.BodyText secondary>{text}</ty.BodyText>}
  </Wrapper>
);

export default Empty;
