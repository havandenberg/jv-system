import React, { useState } from 'react';

import SearchImg from 'assets/images/search';
import TextInput, { TextInputProps } from 'ui/input';
import th from 'ui/theme';

const useSearch = (props?: TextInputProps) => {
  const [search, setSearch] = useState('');

  return {
    search,
    Search: (
      <TextInput
        Icon={<SearchImg height={th.sizes.sm} />}
        onClear={() => {
          setSearch('');
        }}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        placeholder="Search"
        value={search}
        {...props}
      />
    ),
  };
};

export default useSearch;
