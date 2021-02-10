import React from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import th from 'ui/theme';
import { useSearchQueryParam } from './use-query-params';

const useSearch = (props?: TextInputProps) => {
  const [search, setSearch] = useSearchQueryParam();

  return {
    search,
    Search: (
      <TextInput
        Icon={<SearchImg height={th.sizes.sm} />}
        onClear={() => {
          setSearch(undefined, 'replaceIn');
        }}
        onChange={(e) => {
          setSearch(e.target.value || undefined, 'replaceIn');
        }}
        placeholder="Search"
        value={search || ''}
        {...props}
      />
    ),
  };
};

export default useSearch;
