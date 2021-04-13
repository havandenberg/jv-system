import React from 'react';
import styled from '@emotion/styled';

import UpArrow from 'assets/images/up-arrow';
import l from 'ui/layout';
import th from 'ui/theme';

const ARROW_SIDE_LENGTH = 14;

const Button = styled(l.Flex)(({ disabled }: { disabled?: boolean }) => ({
  alignItems: 'center',
  background: th.colors.brand.containerBackground,
  border: th.borders.secondary,
  cursor: disabled ? 'default' : 'pointer',
  justifyContent: 'center',
  height: th.sizes.xs,
  opacity: disabled ? th.opacities.disabled : 1,
  transition: th.transitions.default,
  width: th.sizes.xs,
  svg: {
    opacity: disabled ? th.opacities.disabled : th.opacities.secondary,
    transition: th.transitions.default,
  },
  ':hover': {
    background: disabled
      ? undefined
      : th.colors.brand.containerBackgroundAccent,
    svg: {
      opacity: disabled ? undefined : 1,
    },
  },
}));

const TopButton = styled(Button)(({ disabled }: { disabled?: boolean }) => ({
  borderBottomLeftRadius: th.borderRadii.default,
  borderTopLeftRadius: th.borderRadii.default,
  borderRight: disabled ? 0 : th.borders.secondary,
}));

const BottomButton = styled(Button)(
  ({ topDisabled }: { topDisabled?: boolean }) => ({
    borderBottomRightRadius: th.borderRadii.default,
    borderLeft: topDisabled ? th.borders.secondary : 0,
    borderTopRightRadius: th.borderRadii.default,
    transform: 'scaleY(-1)',
  }),
);

interface Props {
  disableDown?: boolean;
  disableUp?: boolean;
  onDown: () => void;
  onUp: () => void;
}

const SortControl = ({ disableDown, disableUp, onDown, onUp }: Props) => (
  <l.Flex>
    <TopButton disabled={disableUp} onClick={onUp}>
      <UpArrow
        fill={th.colors.brand.primary}
        height={ARROW_SIDE_LENGTH}
        width={ARROW_SIDE_LENGTH}
      />
    </TopButton>
    <BottomButton
      disabled={disableDown}
      topDisabled={disableUp}
      onClick={onDown}
    >
      <UpArrow
        fill={th.colors.brand.primary}
        height={ARROW_SIDE_LENGTH}
        width={ARROW_SIDE_LENGTH}
      />
    </BottomButton>
  </l.Flex>
);

export default SortControl;
