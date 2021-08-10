import React from 'react';
import styled from '@emotion/styled';

import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { times } from 'ramda';
import { Maybe } from 'types';

const Wrapper = styled(l.Flex)(
  {
    alignItems: 'center',
    background: th.colors.brand.primary,
    borderRadius: th.borderRadii.default,
    boxShadow: th.shadows.box,
    flexDirection: 'column',
    height: 100,
    justifyContent: 'space-between',
    minWidth: 100,
    padding: `${th.spacing.md}`,
  },
  divPropsSet,
);

export interface FeaturedValue {
  customStyles?: {
    label?: DivProps;
    wrapper?: DivProps;
  };
  label: string;
  values: { label?: string; value?: Maybe<string> }[];
}

export const FeaturedValuePanel = ({
  customStyles,
  label,
  values,
}: FeaturedValue) => (
  <Wrapper {...customStyles?.wrapper}>
    <ty.CaptionText
      center
      inverted
      nowrap
      secondary
      mb={th.spacing.sm}
      {...customStyles?.label}
    >
      {label}
    </ty.CaptionText>
    {values &&
      values.length &&
      (values.length > 1 ? (
        <l.Div width={th.sizes.fill}>
          {values.map(({ label: lab, value: val }, idx) => (
            <l.Flex alignCenter justifyBetween key={idx} mx={th.spacing.sm}>
              {lab && (
                <ty.SmallText inverted secondary>
                  {lab}
                </ty.SmallText>
              )}
              <ty.LargeText inverted my={0}>
                {val || '-'}
              </ty.LargeText>
            </l.Flex>
          ))}
        </l.Div>
      ) : (
        <ty.DisplayText
          fontFamily={th.fontFamilies.body}
          fontSize="40px"
          inverted
          mb={th.spacing.sm}
        >
          {values[0].value || '-'}
        </ty.DisplayText>
      ))}
  </Wrapper>
);

export const placeholderFeaturedValues = (count: number) =>
  times(
    () => ({
      label: '-',
      values: [{ value: '-' }],
    }),
    count,
  );

const FeaturedValues = ({
  gap = th.spacing.md,
  values,
}: {
  gap?: string | number;
  values: FeaturedValue[];
}) => (
  <l.Flex justifyCenter mt={th.spacing.lg} width={th.sizes.fill}>
    {values.map((value, idx) => (
      <React.Fragment key={idx}>
        <FeaturedValuePanel {...value} />
        {idx < values.length - 1 && <l.Div width={gap} />}
      </React.Fragment>
    ))}
  </l.Flex>
);

export default FeaturedValues;
