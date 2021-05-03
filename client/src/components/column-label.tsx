import React, { useState } from 'react';
import styled from '@emotion/styled';

import UpArrow from 'assets/images/up-arrow';
import { baseDataTransforms } from 'components/base-data';
import FilterPanel from 'components/filter-panel';
import { SortOrder, SORT_ORDER } from 'hooks/use-columns';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export const ARROW_SIDE_LENGTH = 14;

const Wrapper = styled(l.Flex)(
  ({ active, sortable }: { active?: boolean; sortable?: boolean }) => ({
    cursor: sortable ? 'pointer' : 'default',
    '.label': {
      opacity: active && sortable ? 1 : th.opacities.secondary,
      transition: th.transitions.default,
    },
    '.arrow': {
      opacity: active ? 1 : 0,
    },
    ':hover': {
      '.label, .arrow': {
        opacity: sortable ? 1 : th.opacities.secondary,
      },
    },
  }),
);

const ChevronWrapper = styled(l.Div)(({ flip }: { flip: boolean }) => ({
  height: ARROW_SIDE_LENGTH,
  position: 'absolute',
  right: -10,
  transform: `translateY(${flip ? -1 : 3}px) rotate(${flip ? 0 : 180}deg)`,
  transition: 'opacity 0.3s ease',
  width: ARROW_SIDE_LENGTH,
}));

export interface LabelInfo<T> {
  boldColumn?: boolean;
  defaultSortOrder?: SortOrder;
  filterable?: boolean;
  getValue?: (data: T) => React.ReactNode;
  key: keyof T;
  label: string;
  sortable?: boolean;
  transformValue?: (val: any) => any;
  transformKey?: keyof typeof baseDataTransforms;
}

interface Props<T> {
  sortBy: keyof T;
  sortOrder: SortOrder;
  handleSortChange: (sortKey: keyof T, sortOrder?: SortOrder) => void;
  labelInfo: LabelInfo<T>;
  schemaName: string;
  tableName: string;
}

const ColumnLabel = <T extends {}>({
  sortBy,
  sortOrder,
  handleSortChange,
  labelInfo: { defaultSortOrder, filterable, key, label, sortable },
  schemaName,
  tableName,
}: Props<T>) => {
  const active = sortBy === key;
  const [hover, setHover] = useState(false);
  return (
    <l.Div relative>
      <Wrapper
        active={active}
        onClick={
          sortable
            ? () => {
                handleSortChange(key, defaultSortOrder);
              }
            : undefined
        }
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sortable={sortable}
      >
        <l.Flex relative>
          <ty.SmallText className="label" pr={th.spacing.xs} px={th.spacing.sm}>
            {label}
          </ty.SmallText>
          {sortable && (
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
          )}
        </l.Flex>
      </Wrapper>
      {filterable && (
        <l.Div cursor="pointer" position="absolute" left={-11} top={-1}>
          <FilterPanel<T>
            filterKey={key}
            schemaName={schemaName}
            tableName={tableName}
            visible={hover}
          />
        </l.Div>
      )}
    </l.Div>
  );
};

export default ColumnLabel;
