import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { times } from 'ramda';

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

export interface FeaturedValue {
  label: string;
  value: React.ReactNode;
}

export const FeaturedValuePanel = ({ label, value }: FeaturedValue) => (
  <Wrapper>
    <ty.CaptionText center inverted nowrap secondary mb={th.spacing.sm}>
      {label}
    </ty.CaptionText>
    {value}
  </Wrapper>
);

export const placeholderFeaturedValues = (count: number) =>
  times(
    (idx) => ({
      label: '-',
      value: (
        <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
          -
        </ty.HugeText>
      ),
    }),
    count,
  );

const FeaturedValues = ({ values }: { values: FeaturedValue[] }) => (
  <l.Flex
    justifyCenter
    mb={th.spacing.xl}
    mt={th.spacing.lg}
    width={th.sizes.fill}
  >
    {values.map((value, idx) => (
      <React.Fragment key={idx}>
        <FeaturedValuePanel {...value} />
        {idx < values.length - 1 && <l.Div width={th.spacing.md} />}
      </React.Fragment>
    ))}
  </l.Flex>
);

export default FeaturedValues;
