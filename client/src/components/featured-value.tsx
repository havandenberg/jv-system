import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)({
  alignItems: 'center',
  borderRadius: th.borderRadii.default,
  background: th.colors.brand.primary,
  flexDirection: 'column',
  height: 110,
  justifyContent: 'space-between',
  minWidth: 100,
  padding: th.spacing.md,
});

const FeaturedValue = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <Wrapper>
    <ty.CaptionText center inverted secondary mb={th.spacing.sm}>
      {label}
    </ty.CaptionText>
    {value}
  </Wrapper>
);

export default FeaturedValue;
