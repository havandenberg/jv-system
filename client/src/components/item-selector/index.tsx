import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pluck } from 'ramda';
import OutsideClickHandler from 'react-outside-click-handler';

import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import { FilterCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import EditableCell, { EditableCellProps } from '../editable-cell';

const RowWrapper = styled(l.Flex)(
  ({
    isMultiSelect,
    onClick,
  }: {
    isMultiSelect?: boolean;
    onClick?: () => void;
  }) => ({
    alignItems: 'center',
    background: th.colors.background,
    borderRadius: th.borderRadii.default,
    cursor: onClick ? 'pointer' : 'default',
    justifyContent: isMultiSelect ? 'flex-start' : 'space-between',
    transition: th.transitions.default,
    ':hover': {
      background: onClick
        ? th.colors.brand.containerBackground
        : th.colors.background,
    },
  }),
);

export interface ItemSelectorProps<T> {
  allItems: (localValue: string) => T[];
  clearSearchOnBlur?: boolean;
  closeOnSelect?: boolean;
  defaultFocused?: boolean;
  disabled?: boolean;
  disableSearchQuery?: boolean;
  editableCellProps?: EditableCellProps;
  error?: ApolloError;
  errorLabel: string;
  excludedItems?: T[];
  getItemContent?: (item: T) => React.ReactNode;
  height?: number;
  key?: string;
  loading: boolean;
  isDirty?: boolean;
  isMultiSelect?: boolean;
  nameKey: keyof T;
  offset?: string | number;
  onClear?: () => void;
  onlyClearSearch?: boolean;
  panelGap?: string | number;
  placeholder?: string;
  rowHeight?: number;
  searchParamName?: string;
  searchWidth?: string | number;
  selectedItem?: string;
  selectItem?: (item: T) => void;
  warning?: boolean;
  width?: number;
  validationError?: boolean;
}

const ItemSelector = <T extends { id?: string; disabled?: boolean }>({
  clearSearch,
  closeOnSelect,
  editableCellProps,
  errorLabel,
  focused,
  getItemContent,
  handleBlur,
  handleFocus,
  height = 300,
  isMultiSelect,
  items,
  loading,
  nameKey,
  offset,
  panelGap = th.spacing.sm,
  rowHeight = 32,
  Search,
  selectItem,
  selectedItem,
  width,
}: ItemSelectorProps<T> & {
  clearSearch: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
  focused: boolean;
  items: T[];
  Search: React.ReactNode;
  width?: number;
}) => {
  const selectedItems =
    isMultiSelect && selectedItem ? selectedItem.split(',') : [];
  return (
    <l.Div relative>
      <l.Div onClick={handleFocus}>
        {editableCellProps ? <EditableCell {...editableCellProps} /> : Search}
      </l.Div>
      {focused && (
        <OutsideClickHandler onOutsideClick={handleBlur}>
          <l.Flex
            borderRadius={th.borderRadii.default}
            border={th.borders.secondary}
            bg={th.colors.background}
            boxShadow={th.shadows.box}
            height={height}
            ml={offset}
            mt={panelGap}
            position="absolute"
            width={width}
            zIndex={5}
          >
            {items && items.length > 0 ? (
              <VirtualizedList
                height={height}
                rowCount={items.length}
                rowHeight={rowHeight}
                rowRenderer={({ key, index, style }) => {
                  const item = items[index] as T;

                  const isSelected =
                    item?.id && selectedItems.includes(item.id);

                  return (
                    item && (
                      <RowWrapper
                        isMultiSelect={isMultiSelect}
                        onClick={
                          item.disabled
                            ? undefined
                            : () => {
                                selectItem && selectItem(item);
                                clearSearch();
                                if (closeOnSelect) {
                                  handleBlur();
                                }
                              }
                        }
                        key={key}
                        style={style}
                      >
                        {isMultiSelect && (
                          <l.Div ml={th.spacing.xs}>
                            <FilterCheckbox
                              checked={!!isSelected}
                              onChange={() => ({})}
                            />
                          </l.Div>
                        )}
                        {getItemContent
                          ? getItemContent(item)
                          : item && (
                              <ty.CaptionText pl={th.spacing.sm}>
                                {item.id} - {item[nameKey]}
                              </ty.CaptionText>
                            )}
                      </RowWrapper>
                    )
                  );
                }}
                style={{ borderRadius: th.borderRadii.default }}
                width={width}
              />
            ) : (
              <ty.CaptionText disabled mt={th.spacing.md} px={th.spacing.sm}>
                {loading ? 'Loading...' : `No ${errorLabel} found...`}
              </ty.CaptionText>
            )}
          </l.Flex>
        </OutsideClickHandler>
      )}
    </l.Div>
  );
};

const useItemSelector = <T extends { id?: string; disabled?: boolean }>(
  props: ItemSelectorProps<T>,
) => {
  const {
    allItems,
    clearSearchOnBlur,
    defaultFocused = false,
    disabled,
    disableSearchQuery,
    excludedItems = [],
    editableCellProps,
    isDirty,
    onClear,
    onlyClearSearch,
    placeholder,
    searchParamName,
    selectedItem,
    searchWidth,
    warning,
    width = 500,
    validationError,
  } = props;
  const [focused, setFocused] = useState(defaultFocused);

  const handleFocus = () => {
    !disabled && setFocused(true);
  };

  const { clearSearch, localSearch, Search } = useSearch({
    disabled: !!editableCellProps,
    disableSearchQuery,
    error: validationError,
    isDirty,
    onClear,
    onlyClearSearch,
    paramName: searchParamName,
    placeholder,
    showIcon: false,
    value:
      (!disableSearchQuery && focused) || !selectedItem
        ? undefined
        : selectedItem,
    warning,
    width: searchWidth || width,
  });

  const handleBlur = () => {
    setFocused(false);
    if (clearSearchOnBlur) {
      clearSearch();
    }
  };

  const items = allItems(localSearch || '').filter(
    (item) => !pluck('id', excludedItems).includes(item.id),
  );

  return {
    clearSearch,
    ItemSelector: (
      <ItemSelector
        {...props}
        clearSearch={clearSearch}
        focused={focused}
        handleBlur={handleBlur}
        handleFocus={handleFocus}
        items={items}
        Search={Search}
      />
    ),
  };
};

export default useItemSelector;
