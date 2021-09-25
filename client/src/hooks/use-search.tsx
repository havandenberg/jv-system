import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import { useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

export interface SearchProps extends TextInputProps {
  disabled?: boolean;
  onClear?: () => void;
  placeholder?: string;
  showIcon?: boolean;
  value?: string;
}

const useSearch = (props?: SearchProps) => {
  const {
    disabled = false,
    onClear = undefined,
    placeholder = 'Search',
    showIcon = true,
    value = '',
    ...rest
  } = props ? props : {};
  const [search, setSearch] = useSearchQueryParam();
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
      <TextInput
        Icon={showIcon ? <SearchImg height={18} /> : undefined}
        onBlur={() => {
          setSearch(debouncedSearch, 'replaceIn');
        }}
        onClear={() => {
          onClear && onClear();
          clearSearch();
        }}
        onChange={(e) => {
          setLocalSearch(e.target.value || undefined);
        }}
        placeholder={placeholder === undefined ? undefined : placeholder}
        value={value || localSearch || ''}
        {...rest}
      />
    ),
    clearSearch,
  };
};

export default useSearch;
