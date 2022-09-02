import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pluck } from 'ramda';
import OutsideClickHandler from 'react-outside-click-handler';

import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import EditableCell, { EditableCellProps } from '../editable-cell';

const RowWrapper = styled(l.Flex)(({ onClick }) => ({
  alignItems: 'center',
  background: th.colors.background,
  borderRadius: th.borderRadii.default,
  cursor: onClick ? 'pointer' : 'default',
  justifyContent: 'space-between',
  transition: th.transitions.default,
  ':hover': {
    background: onClick
      ? th.colors.brand.containerBackground
      : th.colors.background,
  },
}));

export interface ItemSelectorProps<T> {
  allItems: T[];
  clearSearchOnBlur?: boolean;
  closeOnSelect?: boolean;
  defaultFocused?: boolean;
  disabled?: boolean;
  editableCellProps?: EditableCellProps;
  error?: ApolloError;
  errorLabel: string;
  excludedItems?: T[];
  getItemContent?: (item: T) => React.ReactNode;
  height?: number;
  key?: string;
  loading: boolean;
  nameKey: keyof T;
  onClear?: () => void;
  onlyClearSearch?: boolean;
  panelGap?: string | number;
  placeholder?: string;
  rowHeight?: number;
  searchParamName?: string;
  searchWidth?: string | number;
  selectedItem?: string;
  selectItem?: (item: T) => void;
  width?: number;
  validationError?: boolean;
}

const ItemSelector = <T extends { id: string; disabled?: boolean }>({
  clearSearch,
  closeOnSelect,
  editableCellProps,
  errorLabel,
  focused,
  getItemContent,
  handleBlur,
  handleFocus,
  height = 300,
  items,
  loading,
  nameKey,
  panelGap = th.spacing.sm,
  rowHeight = 32,
  Search,
  selectItem,
  width,
  validationError,
}: ItemSelectorProps<T> & {
  clearSearch: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
  focused: boolean;
  items: T[];
  Search: React.ReactNode;
  width?: number;
}) => (
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

                return (
                  item && (
                    <RowWrapper
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

const useItemSelector = <T extends { id: string; disabled?: boolean }>(
  props: ItemSelectorProps<T>,
) => {
  const {
    allItems,
    clearSearchOnBlur,
    defaultFocused = false,
    disabled,
    excludedItems = [],
    editableCellProps,
    onClear,
    onlyClearSearch,
    placeholder,
    searchParamName,
    selectedItem,
    searchWidth,
    width = 500,
    validationError,
  } = props;
  const [focused, setFocused] = useState(defaultFocused);

  const handleFocus = () => {
    !disabled && setFocused(true);
  };

  const { clearSearch, Search } = useSearch({
    disabled: !!editableCellProps,
    error: validationError,
    onClear,
    onlyClearSearch,
    paramName: searchParamName,
    placeholder,
    showIcon: false,
    value: focused || !selectedItem ? undefined : selectedItem,
    width: searchWidth || width,
  });

  const handleBlur = () => {
    setFocused(false);
    if (clearSearchOnBlur) {
      clearSearch();
    }
  };

  const items = allItems.filter(
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
