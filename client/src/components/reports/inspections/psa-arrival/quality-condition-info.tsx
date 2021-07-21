import React from 'react';

import th from 'ui/theme';
import ty from 'ui/typography';

export const PsaQualityInfo = () => (
  <>
    <ty.SmallText mb={th.spacing.sm} secondary>
      Scale:
    </ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>1 - Only For Exceptions</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>2 - Excellent</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>3 - Good</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>4 - Good / Fair</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>5 - Fair</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>6 - Poor</ty.SmallText>
    <ty.SmallText>7 - Very Poor</ty.SmallText>
  </>
);

export const PsaConditionInfo = () => (
  <>
    <ty.SmallText mb={th.spacing.sm} secondary>
      Scale:
    </ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>1 - Poor (same as 6)</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>2 - Excellent</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>3 - Good</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>4 - Good / Fair</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>5 - Fair</ty.SmallText>
    <ty.SmallText mb={th.spacing.sm}>6 - Poor</ty.SmallText>
    <ty.SmallText>7 - Very Poor</ty.SmallText>
  </>
);
