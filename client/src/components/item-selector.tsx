import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pluck } from 'ramda';

import VirtualizedList from 'components/virtualized-list';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import useSearch from 'hooks/use-search';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import EditableCell, { EditableCellProps } from './editable-cell';

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

interface Props<T> {
  allItems: T[];
  closeOnSelect?: boolean;
  editableCellProps?: EditableCellProps;
  error?: ApolloError;
  errorLabel: string;
  excludedItems: T[];
  getItemContent?: (item: T) => React.ReactNode;
  height?: number;
  loading: boolean;
  nameKey: keyof T;
  onClear?: () => void;
  placeholder?: string;
  selectedItem?: string;
  selectItem: (item: T) => void;
  width?: number;
}

const ItemSelector = <T extends { id: string }>({
  allItems,
  closeOnSelect,
  excludedItems,
  editableCellProps,
  error,
  errorLabel,
  getItemContent,
  height = 300,
  loading,
  nameKey,
  onClear,
  placeholder,
  selectedItem,
  selectItem,
  width = 500,
}: Props<T>) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const { clearSearch, Search } = useSearch({
    disabled: !!editableCellProps,
    onClear,
    placeholder,
    showIcon: false,
    value: focused || !selectedItem ? undefined : selectedItem,
    width,
  });

  const ref = useOutsideClickRef(() => {
    handleBlur();
  });

  const items = allItems.filter(
    (item) => !pluck('id', excludedItems).includes(item.id),
  );

  return (
    <l.Div relative ref={ref}>
      <l.Div onClick={handleFocus}>
        {editableCellProps ? <EditableCell {...editableCellProps} /> : Search}
      </l.Div>
      {focused && (
        <l.Flex
          borderRadius={th.borderRadii.default}
          border={th.borders.secondary}
          bg={th.colors.background}
          boxShadow={th.shadows.box}
          height={height}
          mt={th.spacing.sm}
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
                        selectItem(item);
                        clearSearch();
                        if (closeOnSelect) {
                          handleBlur();
                        }
                      }}
                      key={key}
                      style={style}
                    >
                      {getItemContent ? (
                        getItemContent(item)
                      ) : (
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
              {loading
                ? 'Loading...'
                : error
                ? 'Error...'
                : `No ${errorLabel} Found...`}
            </ty.CaptionText>
          )}
        </l.Flex>
      )}
    </l.Div>
  );
};

export default ItemSelector;
