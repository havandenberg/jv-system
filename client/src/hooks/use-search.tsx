import React, { useEffect, useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import { useSearchQueryParam } from './use-query-params';
import useDebounce from './use-debounce';

interface Props {
  placeholder?: string;
  showIcon?: boolean;
}

const useSearch = (props?: TextInputProps & Props) => {
  const {
    placeholder = 'Search',
    showIcon = true,
    ...rest
  } = props ? props : {};
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
        Icon={showIcon ? <SearchImg height={18} /> : undefined}
        onClear={() => {
          setLocalSearch(undefined);
        }}
        onChange={(e) => {
          setLocalSearch(e.target.value || undefined);
        }}
        placeholder={placeholder === undefined ? undefined : placeholder}
        value={localSearch || ''}
        {...rest}
      />
    ),
  };
};

export default useSearch;
