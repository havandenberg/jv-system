import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { pluck } from 'ramda';

import VirtualizedList from 'components/virtualized-list';
import useOutsideClickRef from 'hooks/use-outside-click-ref';
import useSearch from 'hooks/use-search';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props<T> {
  addItem: (item: T) => void;
  allItems: T[];
  currentItems: T[];
  error?: ApolloError;
  errorLabel: string;
  loading: boolean;
  nameKey: keyof T;
  placeholder: string;
}

const AddCompanyToContact = <T extends { id: string }>({
  addItem,
  allItems,
  currentItems,
  error,
  errorLabel,
  loading,
  nameKey,
  placeholder,
}: Props<T>) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };
  const { Search } = useSearch({
    placeholder,
    showIcon: false,
  });
  const ref = useOutsideClickRef(() => {
    handleBlur();
  });
  const items = allItems.filter(
    (item) => !pluck('id', currentItems).includes(item.id),
  );
  const showList = focused;

  return (
    <l.Div pt={th.spacing.sm} ref={ref}>
      <l.Div onClick={handleFocus}>{Search}</l.Div>
      {showList && (
        <l.Flex height={200} mt={th.spacing.md}>
          {items && items.length > 0 ? (
            <VirtualizedList
              height={200}
              rowCount={items.length}
              rowHeight={28}
              rowRenderer={({ key, index, style }) => {
                const item = items[index];
                return (
                  item && (
                    <div key={key} style={style}>
                      <ty.TriggerText
                        onClick={() => {
                          addItem(item);
                        }}
                      >
                        {item[nameKey]} ({item.id})
                      </ty.TriggerText>
                    </div>
                  )
                );
              }}
              width={500}
            />
          ) : (
            <ty.BodyText secondary mt={th.spacing.md}>
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

export default AddCompanyToContact;
