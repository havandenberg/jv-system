import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import { useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

interface Props {
  onClear?: () => void;
  placeholder?: string;
  showIcon?: boolean;
  value?: string;
}

const useSearch = (props?: TextInputProps & Props) => {
  const {
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
      setSearch(debouncedSearch, 'replaceIn');
    }
  }, [debouncedSearch, search, setSearch]);

  return {
    search,
    Search: (
      <TextInput
        Icon={showIcon ? <SearchImg height={18} /> : undefined}
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
