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

const RowWrapper = styled(l.Flex)(({ index }: { index: number }) => ({
  alignItems: 'center',
  background:
    index % 2 === 0
      ? th.colors.brand.containerBackground
      : th.colors.background,
  cursor: 'pointer',
  justifyContent: 'space-between',
  ':hover': {
    p: {
      color: th.colors.brand.primaryAccent,
      textDecoration: 'underline',
    },
  },
}));

interface Props<T> {
  allItems: T[];
  closeOnSelect?: boolean;
  currentItems: T[];
  error?: ApolloError;
  errorLabel: string;
  loading: boolean;
  nameKey: keyof T;
  onClear?: () => void;
  placeholder: string;
  selectedItem?: string;
  selectItem: (item: T) => void;
  width?: number;
}

const ItemSelector = <T extends { id: string }>({
  allItems,
  closeOnSelect,
  currentItems,
  error,
  errorLabel,
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
    (item) => !pluck('id', currentItems).includes(item.id),
  );
  const showList = focused;

  return (
    <l.Div position="relative" pt={th.spacing.sm} ref={ref}>
      <l.Div onClick={handleFocus}>{Search}</l.Div>
      {showList && (
        <l.Flex
          borderRadius={th.borderRadii.default}
          border={th.borders.disabled}
          bg={th.colors.background}
          boxShadow={th.shadows.box}
          height={300}
          mt={th.spacing.md}
          position="absolute"
          width={width}
        >
          {items && items.length > 0 ? (
            <VirtualizedList
              height={300}
              rowCount={items.length}
              rowHeight={36}
              rowRenderer={({ key, index, style }) => {
                const item = items[index];
                return (
                  item && (
                    <RowWrapper
                      index={index}
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
                      <ty.TriggerText pl={th.spacing.md}>
                        {item[nameKey]}
                      </ty.TriggerText>
                      <ty.TriggerText pr={th.spacing.md}>
                        {item.id}
                      </ty.TriggerText>
                    </RowWrapper>
                  )
                );
              }}
              width={width}
            />
          ) : (
            <ty.BodyText secondary mt={th.spacing.md} px={th.spacing.md}>
              {loading
                ? 'Loading...'
                : error
                ? 'Error...'
                : `No ${errorLabel} Found...`}
            </ty.BodyText>
          )}
        </l.Flex>
      )}
    </l.Div>
  );
};

export default ItemSelector;
