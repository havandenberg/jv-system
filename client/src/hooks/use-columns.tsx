import React, { useEffect } from 'react';

import { LabelInfo } from 'components/reports/inspections/peru-departure/data-utils';
import ColumnLabel from 'components/column-label';
import { useSortQueryParams } from 'hooks/use-query-params';

export type SortOrder = 'ASC' | 'DESC';

export const SORT_ORDER: { [key in SortOrder]: SortOrder } = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const useColumns = <T extends {}>(
  defaultSortBy: keyof T,
  defaultSortOrder: SortOrder = SORT_ORDER.DESC,
  labels: LabelInfo<T>[],
) => {
  const [{ sortBy, sortOrder }, setSortParams] = useSortQueryParams();

  const handleSortChange = (newSortBy: keyof T, newSortOrder?: SortOrder) => {
    if (sortBy === newSortBy) {
      setSortParams({
        sortBy,
        sortOrder:
          sortOrder === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.DESC,
      });
    } else {
      setSortParams({
        sortBy: newSortBy,
        sortOrder: newSortOrder || defaultSortOrder,
      });
    }
  };

  useEffect(() => {
    if (!sortBy) {
      setSortParams({ sortBy: defaultSortBy, sortOrder });
    }
  }, [defaultSortBy, setSortParams, sortBy, sortOrder]);

  useEffect(() => {
    if (!sortOrder) {
      setSortParams({ sortBy, sortOrder: defaultSortOrder });
    }
  }, [defaultSortOrder, setSortParams, sortBy, sortOrder]);

  return labels.map((labelInfo, idx) => (
    <ColumnLabel<T>
      sortBy={sortBy}
      sortOrder={sortOrder}
      handleSortChange={handleSortChange}
      key={idx}
      labelInfo={labelInfo}
    />
  ));
};

export default useColumns;
