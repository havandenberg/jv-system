import React, { useState } from 'react';

import { LabelInfo } from 'components/reports/inspections/departure/peru/data-utils';
import SortLabel from 'components/sort-label';

export interface SortState<T> {
  sortKey: keyof T;
  isDescending: boolean;
}

const useSort = <T extends {}>(defaultKey: keyof T, labels: LabelInfo<T>[]) => {
  const [sortOption, setSortOption] = useState({
    sortKey: defaultKey,
    isDescending: true,
  });

  const handleSortChange = (newKey: keyof T) => {
    const { sortKey, isDescending } = sortOption;
    if (sortKey === newKey) {
      setSortOption({ sortKey, isDescending: !isDescending });
    } else {
      setSortOption({ sortKey: newKey, isDescending: true });
    }
  };

  return {
    sortOption,
    sortableLabels: labels.map((labelInfo, idx) => (
      <SortLabel<T>
        activeOption={sortOption}
        handleSortChange={handleSortChange}
        key={idx}
        labelInfo={labelInfo}
      />
    )),
  };
};

export default useSort;
