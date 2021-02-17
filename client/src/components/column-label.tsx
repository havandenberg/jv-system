import React, { useState } from 'react';
import styled from '@emotion/styled';

import FilterPanel from 'components/filter-panel';
import { LabelInfo } from 'components/reports/inspections/peru-departure/data-utils';
import { SortOrder, SORT_ORDER } from 'hooks/use-columns';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import UpArrow from 'assets/images/up-arrow';

export const ARROW_SIDE_LENGTH = 14;

const Wrapper = styled(l.Flex)(({ active }: { active?: boolean }) => ({
  cursor: 'pointer',
  '.label': {
    opacity: active ? 1 : th.opacities.secondary,
    transition: th.transitions.default,
  },
  '.arrow': {
    opacity: active ? 1 : 0,
  },
  ':hover': {
    '.label, .arrow': {
      opacity: 1,
    },
  },
}));

const ChevronWrapper = styled(l.Div)(({ flip }: { flip: boolean }) => ({
  height: ARROW_SIDE_LENGTH,
  position: 'absolute',
  right: -10,
  transform: `translateY(${flip ? -1 : 3}px) rotate(${flip ? 0 : 180}deg)`,
  transition: 'opacity 0.3s ease',
  width: ARROW_SIDE_LENGTH,
}));

interface Props<T> {
  sortBy: keyof T;
  sortOrder: SortOrder;
  handleSortChange: (sortKey: keyof T, sortOrder?: SortOrder) => void;
  labelInfo: LabelInfo<T>;
}

const ColumnLabel = <T extends {}>({
  sortBy,
  sortOrder,
  handleSortChange,
  labelInfo: { defaultSortOrder, filterable, key, label },
}: Props<T>) => {
  const active = sortBy === key;
  const [hover, setHover] = useState(false);
  return (
    <l.Div relative>
      <Wrapper
        active={active}
        onClick={() => {
          handleSortChange(key, defaultSortOrder);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <l.Flex relative>
          <ty.SmallText className="label" pr={th.spacing.xs} px={th.spacing.sm}>
            {label}
          </ty.SmallText>
          <ChevronWrapper
            className="arrow"
            flip={
              active
                ? sortOrder === SORT_ORDER.ASC
                : defaultSortOrder === SORT_ORDER.ASC
            }
          >
            <UpArrow
              fill={th.colors.brand.primary}
              height={ARROW_SIDE_LENGTH}
              width={ARROW_SIDE_LENGTH}
            />
          </ChevronWrapper>
        </l.Flex>
      </Wrapper>
      {filterable && (
        <l.Div cursor="pointer" position="absolute" left={-11} top={-1}>
          <FilterPanel<T>
            filterKey={key}
            tableName="peru_departure_inspection"
            visible={hover}
          />
        </l.Div>
      )}
    </l.Div>
  );
};

export default ColumnLabel;
