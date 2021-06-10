import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import { useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

const useSearch = (props?: TextInputProps) => {
  const [search, setSearch] = useSearchQueryParam();
  const [localSearch, setLocalSearch] = useState<string | undefined>();

  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch, 'replaceIn');
    }
  }, [debouncedSearch, search, setSearch]);

  return {
    search,
    Search: (
      <TextInput
        Icon={<SearchImg height={18} />}
        onClear={() => {
          setLocalSearch(undefined);
        }}
        onChange={(e) => {
          setLocalSearch(e.target.value || undefined);
        }}
        placeholder="Search"
        value={localSearch || ''}
        {...props}
      />
    ),
  };
};

export default useSearch;
