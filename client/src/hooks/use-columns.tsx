import React, { useEffect } from 'react';

import ColumnLabel, { LabelInfo } from 'components/column-label';
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
  schemaName: string,
  tableName: string,
) => {
  const [{ sortBy, sortOrder }, setSortParams] = useSortQueryParams();

  const handleSortChange = (newSortBy: string, newSortOrder?: SortOrder) => {
    if (sortBy === newSortBy) {
      setSortParams({
        listScrollTop: 0,
        sortBy,
        sortOrder:
          sortOrder === SORT_ORDER.DESC ? SORT_ORDER.ASC : SORT_ORDER.DESC,
      });
    } else {
      setSortParams({
        listScrollTop: 0,
        sortBy: newSortBy,
        sortOrder: newSortOrder || defaultSortOrder,
      });
    }
  };

  useEffect(() => {
    if (!sortBy || !sortOrder) {
      setSortParams(
        { sortBy: defaultSortBy, sortOrder: defaultSortOrder },
        'replaceIn',
      );
    }
  }, [defaultSortBy, defaultSortOrder, setSortParams, sortBy, sortOrder]);

  return labels
    .filter(({ show = true }) => !!show)
    .map((labelInfo, idx) => (
      <ColumnLabel<T>
        sortBy={sortBy}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        key={idx}
        labelInfo={labelInfo}
        schemaName={schemaName}
        tableName={tableName}
      />
    ));
};

export default useColumns;
