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

const RowWrapper = styled(l.Flex)({
  alignItems: 'center',
  background: th.colors.background,
  borderRadius: th.borderRadii.default,
  cursor: 'pointer',
  justifyContent: 'space-between',
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackground,
  },
});

export interface ItemSelectorProps<T> {
  allItems: T[];
  clearSearchOnBlur?: boolean;
  closeOnSelect?: boolean;
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
  searchParamName?: string;
  selectedItem?: string;
  selectItem?: (item: T) => void;
  width?: number;
}

const useItemSelector = <T extends { id: string }>({
  allItems,
  clearSearchOnBlur,
  closeOnSelect,
  disabled,
  excludedItems = [],
  editableCellProps,
  error,
  errorLabel,
  getItemContent,
  height = 300,
  loading,
  nameKey,
  onClear,
  onlyClearSearch,
  panelGap = th.spacing.sm,
  placeholder,
  searchParamName,
  selectedItem,
  selectItem,
  width = 500,
}: ItemSelectorProps<T>) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    !disabled && setFocused(true);
  };

  const { clearSearch, Search } = useSearch({
    disabled: !!editableCellProps,
    onClear,
    onlyClearSearch,
    paramName: searchParamName,
    placeholder,
    showIcon: false,
    value: focused || !selectedItem ? undefined : selectedItem,
    width,
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
                  rowHeight={32}
                  rowRenderer={({ key, index, style }) => {
                    const item = items[index];

                    return (
                      item && (
                        <RowWrapper
                          onClick={() => {
                            selectItem && selectItem(item);
                            clearSearch();
                            if (closeOnSelect) {
                              handleBlur();
                            }
                          }}
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
    ),
  };
};

export default useItemSelector;