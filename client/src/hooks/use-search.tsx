import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';

import { UpdateType, useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

export interface SearchProps extends TextInputProps {
  disabled?: boolean;
  disableSearchQuery?: boolean;
  error?: boolean;
  onClear?: () => void;
  onlyClearSearch?: boolean;
  paramName?: string;
  placeholder?: string;
  showIcon?: boolean;
  value?: string;
  warning?: boolean;
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
    disableSearchQuery,
    error,
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
    warning,
    ...rest
  } = props;

  return (
    <TextInput
      hasError={error}
      hasWarning={warning}
      Icon={showIcon ? <SearchImg height={18} /> : undefined}
      onBlur={() => {
        !disableSearchQuery && setSearch(debouncedSearch, 'replaceIn');
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
  const {
    disableSearchQuery = false,
    disabled = false,
    paramName = undefined,
  } = props ? props : {};
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
      !disabled &&
        !disableSearchQuery &&
        setSearch(debouncedSearch, 'replaceIn');
    }
  }, [debouncedSearch, disabled, disableSearchQuery, search, setSearch]);

  return {
    localSearch,
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
