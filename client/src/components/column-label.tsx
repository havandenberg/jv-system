import React, { useState } from 'react';
import styled from '@emotion/styled';
import { reduce, sortBy } from 'ramda';

import InfoImg from 'assets/images/info';
import UpArrow from 'assets/images/up-arrow';
import {
  BaseDataItemSelectorProps,
  baseDataTransforms,
} from 'components/base-data';
import { EditableCellProps } from 'components/editable-cell';
import InfoPanel, { InfoPanelProps } from 'components/info-panel';
import FilterPanel, { FilterPanelProps } from 'components/filter-panel';
import { SortOrder, SORT_ORDER } from 'hooks/use-columns';
import l from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';

export const ARROW_SIDE_LENGTH = 14;

const Wrapper = styled(l.Flex)(
  ({
    active,
    labelStyles,
    sortable,
  }: {
    active?: boolean;
    labelStyles?: TextProps;
    sortable?: boolean;
  }) => ({
    cursor: sortable ? 'pointer' : 'default',
    '.label': {
      opacity: active && sortable ? 1 : th.opacities.secondary,
      transition: th.transitions.default,
      ...labelStyles,
    },
    '.arrow': {
      opacity: active ? 1 : 0,
    },
    ':hover': {
      '.label, .arrow': {
        opacity: sortable ? 1 : th.opacities.secondary,
        ...labelStyles,
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
  allowClick?: boolean;
  allowOverflow?: boolean;
  boldColumn?: boolean;
  customFilterBy?: (data: T) => boolean;
  customSortBy?: (data: T) => any;
  customStyles?: {
    label?: TextProps;
  };
  defaultSortOrder?: SortOrder;
  dropdownOptions?: {
    content?: React.ReactNode;
    value: string;
  }[];
  editablCellProps?: Partial<EditableCellProps>;
  filterable?: boolean;
  getValue?: (data: T) => React.ReactNode;
  key: keyof T;
  label: string;
  filterPanelProps?: FilterPanelProps;
  infoPanelProps?: InfoPanelProps;
  itemSelectorQueryProps?: BaseDataItemSelectorProps;
  isBoolean?: boolean;
  isColor?: boolean;
  isDate?: boolean;
  isNumber?: boolean;
  isCurrency?: boolean;
  readOnly?: boolean;
  rowKey?: (data: T) => string | number;
  show?: boolean;
  sortable?: boolean;
  sortKey?: string;
  title?: (data: T) => string | undefined;
  transformKey?: keyof typeof baseDataTransforms;
  transformValue?: (val: any) => any;
  validate?: (val: any) => boolean;
}

export const validateItem = <T extends {}>(
  changes: T,
  labels: LabelInfo<T>[],
) =>
  reduce(
    (isValid, label) =>
      isValid && (label.validate ? label.validate(changes) : true),
    true,
    labels,
  );

export const getFilteredItems = <T extends {}>(
  listLabels: LabelInfo<T>[],
  items: T[],
) =>
  items.filter((item) =>
    listLabels
      .map(({ customFilterBy }) =>
        customFilterBy ? customFilterBy(item) : true,
      )
      .every(Boolean),
  );

export const getSortedItems = <T extends {}>(
  listLabels: LabelInfo<T>[],
  items: T[],
  sortKey: string,
  sortOrder: string,
) => {
  const activeLabel = listLabels.find(
    (label) => (label.sortKey || label.key) === sortKey,
  );
  const sortByFunc =
    activeLabel &&
    (activeLabel.customSortBy ||
      ((item: T) => item[(activeLabel.sortKey || activeLabel.key) as keyof T]));

  return sortKey && sortByFunc
    ? sortOrder === SORT_ORDER.DESC
      ? sortBy(sortByFunc, items).reverse()
      : sortBy(sortByFunc, items)
    : items;
};

interface Props<T> {
  sortBy: keyof T;
  sortOrder: SortOrder;
  handleSortChange: (sortKey: string, sortOrder?: SortOrder) => void;
  labelInfo: LabelInfo<T>;
  schemaName?: string;
  tableName?: string;
}

const ColumnLabel = <T extends {}>({
  sortBy,
  sortOrder,
  handleSortChange,
  labelInfo: {
    customStyles,
    defaultSortOrder,
    filterPanelProps,
    filterable,
    infoPanelProps,
    key,
    label,
    sortable,
    sortKey,
  },
  schemaName,
  tableName,
}: Props<T>) => {
  const active = sortBy === (sortKey || key);
  const [hover, setHover] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <l.Div relative>
      <Wrapper
        active={active}
        labelStyles={customStyles?.label}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={
          sortable
            ? () => {
                handleSortChange(String(sortKey || key), defaultSortOrder);
              }
            : undefined
        }
        sortable={sortable}
      >
        <l.Flex
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          relative
        >
          <ty.SmallText
            className="label"
            pr={th.spacing.xs}
            px={th.spacing.sm}
            {...customStyles?.label}
          >
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
            setShowPanel={setShowFilterPanel}
            showPanel={showFilterPanel}
            sortKey={sortKey}
            tableName={tableName}
            visible={hover}
            {...filterPanelProps}
          />
        </l.Div>
      )}
      {infoPanelProps && (
        <l.Div
          cursor="pointer"
          position="absolute"
          left={filterable ? -28 : -11}
          top={-1}
        >
          <InfoPanel
            content={infoPanelProps.content}
            customStyles={infoPanelProps.customStyles}
            setShow={setShowInfoPanel}
            show={showInfoPanel}
            triggerIcon={<InfoImg height={14} width={14} />}
            visible={hover}
          />
        </l.Div>
      )}
    </l.Div>
  );
};

export default ColumnLabel;
