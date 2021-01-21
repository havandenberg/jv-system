import React from 'react';
import styled from '@emotion/styled';

import { SortState } from 'hooks/use-sort';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { LabelInfo } from './reports/inspections/data-utils';
import UpArrow from 'assets/images/up-arrow';

const ARROW_SIDE_LENGTH = 14;

const Wrapper = styled(l.Flex)(({ active }: { active?: boolean }) => ({
  cursor: 'pointer',
  opacity: active ? 1 : th.opacities.secondary,
  position: 'relative',
  transition: th.transitions.default,
  width: th.sizes.fill,
  ':hover': {
    opacity: 1,
    '> div': {
      opacity: active ? 1 : th.opacities.secondary,
    },
  },
}));

const ChevronWrapper = styled(l.Div)(
  ({ active, isDescending }: { active: boolean; isDescending: boolean }) => {
    const flip = active && !isDescending;
    return {
      height: ARROW_SIDE_LENGTH,
      opacity: active ? 1 : 0,
      position: 'absolute',
      left: -12,
      transform: `translateY(${flip ? -1 : 3}px) rotate(${flip ? 0 : 180}deg)`,
      transition: 'opacity 0.3s ease',
      width: ARROW_SIDE_LENGTH,
    };
  },
);

interface Props<T> {
  activeOption: SortState<T>;
  handleSortChange: (sortKey: keyof T) => void;
  labelInfo: LabelInfo<T>;
}

const SortLabel = <T extends {}>({
  activeOption,
  handleSortChange,
  labelInfo: { key, label },
}: Props<T>) => {
  const active = activeOption.sortKey === key;
  return (
    <Wrapper
      active={active}
      onClick={() => {
        handleSortChange(key);
      }}
    >
      <ty.SmallText pr={th.spacing.sm} px={th.spacing.sm}>
        {label}
      </ty.SmallText>
      <ChevronWrapper active={active} isDescending={activeOption.isDescending}>
        <UpArrow
          fill={th.colors.brand.primary}
          height={ARROW_SIDE_LENGTH}
          width={ARROW_SIDE_LENGTH}
        />
      </ChevronWrapper>
    </Wrapper>
  );
};

export default SortLabel;
