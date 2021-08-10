import { LabelInfo } from 'components/column-label';
import { add, isBefore } from 'date-fns';
import { SORT_ORDER } from 'hooks/use-columns';
import { reduce, sortBy } from 'ramda';

import { InventoryItem, Vessel } from 'types';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

export const dateRanges = [1, 1, 1, 1, 1, 1, 1, 3, 4, 7, 7, 7];

export const getDateRange = (idx: number) => {
  const start = reduce(
    (acc, range) => acc + range,
    0,
    dateRanges.slice(0, idx),
  );
  return { start, end: start + dateRanges[idx] };
};

export const getFilteredVessels = (
  vessels: Vessel[],
  idx: number,
  currentStartOfWeek: Date,
) => {
  const dateRange = getDateRange(idx);
  const filteredVessels = sortBy(
    (vessel) => vessel.vesselCode,
    vessels.filter(
      (vessel) =>
        isDateGreaterThanOrEqualTo(
          new Date(vessel.dischargeDate.replace(/-/g, '/')),
          add(currentStartOfWeek, { days: dateRange.start }),
        ) &&
        isBefore(
          new Date(vessel.dischargeDate.replace(/-/g, '/')),
          add(currentStartOfWeek, { days: dateRange.end }),
        ),
    ),
  );
  return filteredVessels;
};

export const getDateInterval = (idx: number, currentStartOfWeek: Date) => {
  const dateRange = getDateRange(idx);
  return {
    start: add(currentStartOfWeek, { days: dateRange.start }),
    end: add(currentStartOfWeek, { days: dateRange.end }),
  };
};

export const isWithinDateInterval = (
  item: InventoryItem,
  idx: number,
  currentStartOfWeek: Date,
) => {
  const dateRange = getDateRange(idx);
  return (
    item.vessel &&
    isDateGreaterThanOrEqualTo(
      new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
      add(currentStartOfWeek, { days: dateRange.start }),
    ) &&
    isBefore(
      new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
      add(currentStartOfWeek, { days: dateRange.end }),
    )
  );
};

export const getFilteredItems = (
  items: InventoryItem[],
  idx: number,
  currentStartOfWeek: Date,
) => {
  if (idx === 13) {
    return items.filter(
      (item) =>
        item.vessel &&
        isBefore(
          new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
          currentStartOfWeek,
        ),
    );
  }
  if (idx === 14) {
    return items;
  }
  return items.filter((item) =>
    isWithinDateInterval(item, idx, currentStartOfWeek),
  );
};

export const getSortedItems = (
  listLabels: LabelInfo<InventoryItem>[],
  items: InventoryItem[],
  sortKey: string,
  sortOrder: string,
) => {
  const activeLabel = listLabels.find(
    (label) => (label.sortKey || label.key) === sortKey,
  );
  return activeLabel && activeLabel.customSortBy
    ? sortOrder === SORT_ORDER.DESC
      ? sortBy(activeLabel.customSortBy, items).reverse()
      : sortBy(activeLabel.customSortBy, items)
    : items;
};

export const reducePalletData = (
  items: InventoryItem[],
  key: keyof InventoryItem,
) => items.reduce((acc, item) => acc + parseInt(item[key], 10), 0);
