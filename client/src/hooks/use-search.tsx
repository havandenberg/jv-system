import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import { UpdateType, useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

export interface SearchProps extends TextInputProps {
  disabled?: boolean;
  onClear?: () => void;
  onlyClearSearch?: boolean;
  paramName?: string;
  placeholder?: string;
  showIcon?: boolean;
  value?: string;
}

const Search = (
  props: SearchProps & {
    setSearch: (value: string | undefined, updateType?: UpdateType) => void;
    debouncedSearch?: string;
    search?: string | null;
    clearSearch: () => void;
    setLocalSearch: (search?: string) => void;
    localSearch?: string;
  },
) => {
  const {
    onClear = undefined,
    onlyClearSearch = undefined,
    placeholder = 'Search',
    showIcon = true,
    value = '',
    setSearch,
    debouncedSearch,
    search,
    clearSearch,
    setLocalSearch,
    localSearch,
    ...rest
  } = props;

  return (
    <TextInput
      Icon={showIcon ? <SearchImg height={18} /> : undefined}
      onBlur={() => {
        setSearch(debouncedSearch, 'replaceIn');
      }}
      onClear={() => {
        onClear && (!onlyClearSearch || !search) && onClear();
        clearSearch();
      }}
      onChange={(e) => {
        setLocalSearch(e.target.value || undefined);
      }}
      placeholder={placeholder === undefined ? undefined : placeholder}
      value={value || localSearch || ''}
      {...rest}
    />
  );
};

const useSearch = (props?: SearchProps) => {
  const { disabled = false, paramName = undefined } = props ? props : {};
  const [search, setSearch] = useSearchQueryParam(paramName);
  const [localSearch, setLocalSearch] = useState<string | undefined>(
    search || undefined,
  );

  const debouncedSearch = useDebounce(localSearch);

  const clearSearch = () => {
    setLocalSearch(undefined);
  };

  useEffect(() => {
    if (debouncedSearch !== search) {
      !disabled && setSearch(debouncedSearch, 'replaceIn');
    }
  }, [debouncedSearch, disabled, search, setSearch]);

  return {
    search,
    Search: (
      <Search
        {...props}
        clearSearch={clearSearch}
        debouncedSearch={debouncedSearch}
        localSearch={localSearch}
        search={search}
        setLocalSearch={setLocalSearch}
        setSearch={setSearch}
      />
    ),
    clearSearch,
  };
};

export default useSearch;
