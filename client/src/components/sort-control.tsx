import React from 'react';
import styled from '@emotion/styled';

import UpArrow from 'assets/images/up-arrow';
import l from 'ui/layout';
import th from 'ui/theme';

const ARROW_SIDE_LENGTH = 14;

const Button = styled(l.Flex)(
  ({
    disabled,
    sideLength,
  }: {
    disabled?: boolean;
    sideLength: string | number;
  }) => ({
    alignItems: 'center',
    background: th.colors.brand.containerBackground,
    border: th.borders.secondary,
    cursor: disabled ? 'default' : 'pointer',
    justifyContent: 'center',
    height: sideLength,
    opacity: disabled ? th.opacities.disabled : 1,
    transition: th.transitions.default,
    width: sideLength,
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
  }),
);

const TopButton = styled(Button)(
  ({ color, disabled }: { color?: string; disabled?: boolean }) => ({
    borderBottomLeftRadius: th.borderRadii.default,
    borderTopLeftRadius: th.borderRadii.default,
    borderRight: disabled ? 0 : th.borders.secondary,
    borderColor: color,
  }),
);

const BottomButton = styled(Button)(
  ({ color, topDisabled }: { color?: string; topDisabled?: boolean }) => ({
    borderBottomRightRadius: th.borderRadii.default,
    borderLeft: topDisabled ? th.borders.secondary : 0,
    borderTopRightRadius: th.borderRadii.default,
    borderColor: color,
    transform: 'scaleY(-1)',
  }),
);

interface Props {
  color?: string;
  disableDown?: boolean;
  disableUp?: boolean;
  onDown: () => void;
  onUp: () => void;
  sideLength?: string | number;
  arrowSideLength?: string | number;
}

const SortControl = ({
  color = th.colors.brand.secondary,
  disableDown,
  disableUp,
  onDown,
  onUp,
  sideLength = th.sizes.xs,
  arrowSideLength = ARROW_SIDE_LENGTH,
}: Props) => (
  <l.Flex>
    <TopButton
      color={color}
      disabled={disableUp}
      onClick={onUp}
      sideLength={sideLength}
    >
      <UpArrow fill={color} height={arrowSideLength} width={arrowSideLength} />
    </TopButton>
    <BottomButton
      color={color}
      disabled={disableDown}
      topDisabled={disableUp}
      onClick={onDown}
      sideLength={sideLength}
    >
      <UpArrow fill={color} height={arrowSideLength} width={arrowSideLength} />
    </BottomButton>
  </l.Flex>
);

export default SortControl;
