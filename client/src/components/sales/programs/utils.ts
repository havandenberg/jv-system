import { groupBy, pluck, sortBy, sum, times, values } from 'ramda';
import { add, startOfISOWeek, endOfISOWeek } from 'date-fns';

import {
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProgramEntryCustomerProgramEntry,
} from 'types';
import {
  getWeekNumber,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import {
  CustomerProgramUpdate,
  ProgramChanges,
  RemovedItems,
  ShipperProgramUpdate,
} from './types';

export const getGridProps = (weekCount: number) => {
  const columnWidth = 70;
  const gridTemplateColumns = `500px repeat(${weekCount}, ${columnWidth}px)`;
  const gridWidth = 500 + weekCount * columnWidth;
  return { gridTemplateColumns, gridWidth, weekCount };
};

export const getAllShipperPrograms = (
  shipperPrograms: Maybe<ShipperProgram>[],
  changes: ProgramChanges,
  removedItems: RemovedItems,
) =>
  (
    [
      ...shipperPrograms.filter(
        (c) => c && !removedItems.shipperPrograms.find((rc) => rc.id === c.id),
      ),
      ...changes.newShipperPrograms,
    ] as ShipperProgram[]
  ).map((p) => {
    if (p) {
      return {
        ...p,
        shipperProgramEntries: {
          nodes: [
            ...(p.shipperProgramEntries?.nodes || []).filter(
              (e) =>
                e &&
                !removedItems.shipperPrograms.find(
                  (rp) => rp.id === e.shipperProgramId,
                ),
            ),
            ...changes.newShipperProgramEntries.filter(
              (sp) => sp.shipperProgramId === p.id,
            ),
          ] as ShipperProgramEntry[],
        },
      };
    }
    return p;
  });

export const getAllCustomerPrograms = (
  customerPrograms: Maybe<CustomerProgram>[],
  changes: ProgramChanges,
  removedItems: RemovedItems,
) =>
  (
    [
      ...customerPrograms.filter(
        (c) => c && !removedItems.customerPrograms.find((rc) => rc.id === c.id),
      ),
      ...changes.newCustomerPrograms,
    ] as CustomerProgram[]
  ).map((p) => {
    if (p) {
      return {
        ...p,
        customerProgramEntries: {
          nodes: [
            ...(p.customerProgramEntries?.nodes || []).filter(
              (e) =>
                e &&
                !removedItems.customerPrograms.find(
                  (rp) => rp.id === e.customerProgramId,
                ),
            ),
            ...changes.newCustomerProgramEntries.filter(
              (sp) => sp.customerProgramId === p.id,
            ),
          ] as CustomerProgramEntry[],
        },
      };
    }
    return p;
  });

export const getDuplicateProgramIds = (
  programs: (ShipperProgramUpdate | CustomerProgramUpdate)[],
) =>
  values(
    groupBy(
      (program) =>
        `species=${program.commonSpeciesId}variety=${program.commonVarietyId}size=${program.commonSizeId}packType=${program.commonPackTypeId}plu=${program.plu}`,
      programs,
    ),
  )
    .filter((duplicatePrograms) => duplicatePrograms.length > 1)
    .map((duplicatePrograms) =>
      duplicatePrograms.map((p) => parseInt(p.id, 10)),
    )
    .flat();

export const getAvailablePalletCount = (
  entry: ShipperProgramEntry | CustomerProgramEntry,
) =>
  entry.palletCount -
  sum(
    pluck(
      'palletCount',
      (entry.shipperProgramEntryCustomerProgramEntries?.nodes ||
        []) as ShipperProgramEntryCustomerProgramEntry[],
    ),
  );

export const getShipperAllocatedPalletCount = (
  entry: CustomerProgramEntry,
  shipperProgramEntryId: number,
) =>
  sum(
    pluck(
      'palletCount',
      (
        (entry.shipperProgramEntryCustomerProgramEntries?.nodes ||
          []) as ShipperProgramEntryCustomerProgramEntry[]
      ).filter((e) => e.shipperProgramEntryId === shipperProgramEntryId),
    ),
  );

export const getCustomerAllocatedPalletCount = (
  entry: ShipperProgramEntry,
  customerProgramEntryId: number,
) =>
  sum(
    pluck(
      'palletCount',
      (
        (entry.shipperProgramEntryCustomerProgramEntries?.nodes ||
          []) as ShipperProgramEntryCustomerProgramEntry[]
      ).filter((e) => e.customerProgramEntryId === customerProgramEntryId),
    ),
  );

export const filterShipperProgramEntries = (
  entries: ShipperProgramEntry[],
  nonZeroStateValues: {
    entry: ShipperProgramEntry;
    allocatedCount: string;
  }[],
  shipperAllocateSearch: string,
  startWeeks: number,
  endWeeks: number,
  entry?: Maybe<CustomerProgramEntry>,
) => {
  const programDate = entry
    ? new Date(entry.programDate.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(add(programDate, { weeks: -startWeeks }));
  const endDate = endOfISOWeek(add(programDate, { weeks: endWeeks }));

  const filteredEntries = entries.filter((e) => {
    const hasAvailablePallets =
      !pluck(
        'id',
        nonZeroStateValues.map((val) => val.entry),
      ).includes(e?.id) && getAvailablePalletCount(e) > 0;

    const matchesSearchText =
      shipperAllocateSearch &&
      shipperAllocateSearch
        .split(' ')
        .every((s) =>
          (e.searchText || '').toLowerCase().includes(s.toLowerCase()),
        );
    const isExactMatch =
      entry?.customerProgram?.commonSpecies?.id ===
        e?.shipperProgram?.commonSpecies?.id &&
      entry?.customerProgram?.commonVariety?.id ===
        e?.shipperProgram?.commonVariety?.id &&
      entry?.customerProgram?.commonSize?.id ===
        e?.shipperProgram?.commonSize?.id &&
      entry?.customerProgram?.commonPackType?.id ===
        e?.shipperProgram?.commonPackType?.id &&
      entry?.customerProgram?.plu === e?.shipperProgram?.plu;

    const meetsSearchCriteria = !!shipperAllocateSearch
      ? matchesSearchText
      : isExactMatch;

    const meetsDateCriteria =
      isDateGreaterThanOrEqualTo(
        new Date(e.programDate.replace(/-/g, '/')),
        startDate,
      ) &&
      isDateLessThanOrEqualTo(
        new Date(e.programDate.replace(/-/g, '/')),
        endDate,
      );

    return hasAvailablePallets && meetsSearchCriteria && meetsDateCriteria;
  });

  return filteredEntries;
};

export const filterCustomerProgramEntries = (
  entries: CustomerProgramEntry[],
  nonZeroStateValues: {
    entry: CustomerProgramEntry;
    allocatedCount: string;
  }[],
  customerAllocateSearch: string,
  startWeeks: number,
  endWeeks: number,
  entry?: Maybe<ShipperProgramEntry>,
) => {
  const programDate = entry
    ? new Date(entry.programDate.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(add(programDate, { weeks: -startWeeks }));
  const endDate = endOfISOWeek(add(programDate, { weeks: endWeeks }));

  const filteredEntries = entries.filter((e) => {
    const hasAvailablePallets =
      !pluck(
        'id',
        nonZeroStateValues.map((val) => val.entry),
      ).includes(e?.id) && getAvailablePalletCount(e) > 0;

    const matchesSearchText =
      customerAllocateSearch &&
      customerAllocateSearch
        .split(' ')
        .every((s) =>
          (e.searchText || '').toLowerCase().includes(s.toLowerCase()),
        );
    const isExactMatch =
      entry?.shipperProgram?.commonSpecies?.id ===
        e?.customerProgram?.commonSpecies?.id &&
      entry?.shipperProgram?.commonVariety?.id ===
        e?.customerProgram?.commonVariety?.id &&
      entry?.shipperProgram?.commonSize?.id ===
        e?.customerProgram?.commonSize?.id &&
      entry?.shipperProgram?.commonPackType?.id ===
        e?.customerProgram?.commonPackType?.id &&
      entry?.shipperProgram?.plu === e?.customerProgram?.plu;

    const meetsSearchCriteria = !!customerAllocateSearch
      ? matchesSearchText
      : isExactMatch;

    const meetsDateCriteria =
      isDateGreaterThanOrEqualTo(
        new Date(e.programDate.replace(/-/g, '/')),
        startDate,
      ) &&
      isDateLessThanOrEqualTo(
        new Date(e.programDate.replace(/-/g, '/')),
        endDate,
      );

    return hasAvailablePallets && meetsSearchCriteria && meetsDateCriteria;
  });

  return filteredEntries;
};

export const sortAllocatedShipperProgramEntries = (
  allocateState: {
    entry: ShipperProgramEntry;
    allocatedCount: string;
  }[],
) =>
  sortBy(
    ({ id }) =>
      -parseInt(
        allocateState.find((s) => s.entry.id === id)?.allocatedCount || '0',
        10,
      ),
    sortShipperProgramEntries(
      pluck('entry', allocateState) as ShipperProgramEntry[],
    ),
  );

export const sortAllocatedCustomerProgramEntries = (
  allocateState: {
    entry: CustomerProgramEntry;
    allocatedCount: string;
  }[],
) =>
  sortBy(
    ({ id }) =>
      -parseInt(
        allocateState.find((s) => s.entry.id === id)?.allocatedCount || '0',
        10,
      ),
    sortCustomerProgramEntries(
      pluck('entry', allocateState) as CustomerProgramEntry[],
    ),
  );

export const sortShipperProgramEntries = (entries: ShipperProgramEntry[]) =>
  sortBy(
    ({ shipperProgram: program }) =>
      `${program?.shipper?.shipperName}${program?.commonSpecies?.speciesName}${program?.commonVariety?.varietyName}${program?.commonSize?.sizeName}${program?.commonPackType?.packTypeName}${program?.plu}`,
    sortBy(
      ({ programDate }) =>
        -getWeekNumber(new Date(programDate.replace(/-/g, '/'))),
      entries,
    ),
  );

export const sortCustomerProgramEntries = (entries: CustomerProgramEntry[]) =>
  sortBy(
    ({ customerProgram: program }) =>
      `${program?.customer?.customerName}${program?.commonSpecies?.speciesName}${program?.commonVariety?.varietyName}${program?.commonSize?.sizeName}${program?.commonPackType?.packTypeName}${program?.plu}`,
    sortBy(
      ({ programDate }) =>
        -getWeekNumber(new Date(programDate.replace(/-/g, '/'))),
      entries,
    ),
  );

export const getShipperProgramTotals = (
  ps: ShipperProgram[],
  selectedWeekNumber: number,
  weekCount: number,
  getShipperProgramEntryValue: (
    entry: ShipperProgramEntry,
    key: keyof ShipperProgramEntry,
  ) => { value: string; dirty: boolean },
) =>
  times((index) => {
    const filteredEntries = pluck('shipperProgramEntries', ps)
      .map((entries) =>
        (entries.nodes as ShipperProgramEntry[])
          .filter(
            (entry) =>
              entry &&
              getWeekNumber(new Date(entry.programDate.replace(/-/g, '/'))) ===
                selectedWeekNumber + index,
          )
          .reverse(),
      )
      .flat();

    return filteredEntries.length === 0
      ? { total: 0, available: -1 }
      : filteredEntries.reduce(
          (acc, entry) => {
            const availableCount =
              entry.palletCount -
              sum(
                (
                  entry.shipperProgramEntryCustomerProgramEntries?.nodes || []
                ).map((alloc) => alloc && alloc.palletCount),
              );
            return {
              total:
                acc.total +
                +getShipperProgramEntryValue(entry, 'palletCount').value,
              available:
                acc.available +
                (entry ? (availableCount < 0 ? 0 : availableCount) : 0),
            };
          },
          { total: 0, available: 0 },
        );
  }, weekCount);

export const getCustomerProgramTotals = (
  ps: CustomerProgram[],
  selectedWeekNumber: number,
  weekCount: number,
  getCustomerProgramEntryValue: (
    entry: CustomerProgramEntry,
    key: keyof CustomerProgramEntry,
  ) => { value: string; dirty: boolean },
) =>
  times((index) => {
    const filteredEntries = pluck('customerProgramEntries', ps)
      .map((entries) =>
        (entries.nodes as CustomerProgramEntry[])
          .filter(
            (entry) =>
              entry &&
              getWeekNumber(new Date(entry.programDate.replace(/-/g, '/'))) ===
                selectedWeekNumber + index,
          )
          .reverse(),
      )
      .flat();

    return filteredEntries.length === 0
      ? { total: 0, available: -1 }
      : filteredEntries.reduce(
          (acc, entry) => {
            const availableCount =
              entry.palletCount -
              sum(
                (
                  entry.shipperProgramEntryCustomerProgramEntries?.nodes || []
                ).map((alloc) => alloc && alloc.palletCount),
              );
            return {
              total:
                acc.total +
                +getCustomerProgramEntryValue(entry, 'palletCount').value,
              available:
                acc.available +
                (entry ? (availableCount < 0 ? 0 : availableCount) : 0),
            };
          },
          { total: 0, available: 0 },
        );
  }, weekCount);

export const getShipperAvailablePalletEntryTotals = (
  program: ShipperProgram,
  selectedWeekNumber: number,
  weekCount: number,
) =>
  times((index) => {
    const entry = (program.shipperProgramEntries?.nodes || []).find(
      (e) =>
        e &&
        getWeekNumber(new Date(e.programDate.replace(/-/g, '/'))) ===
          selectedWeekNumber + index,
    );
    return (
      entry &&
      entry.palletCount -
        sum(
          (entry.shipperProgramEntryCustomerProgramEntries?.nodes || []).map(
            (alloc) => alloc && alloc.palletCount,
          ),
        )
    );
  }, weekCount);

export const getCustomerAvailablePalletEntryTotals = (
  program: CustomerProgram,
  selectedWeekNumber: number,
  weekCount: number,
) =>
  times((index) => {
    const entry = (program.customerProgramEntries?.nodes || []).find(
      (e) =>
        e &&
        getWeekNumber(new Date(e.programDate.replace(/-/g, '/'))) ===
          selectedWeekNumber + index,
    );
    return (
      entry &&
      entry.palletCount -
        sum(
          (entry.shipperProgramEntryCustomerProgramEntries?.nodes || []).map(
            (alloc) => alloc && alloc.palletCount,
          ),
        )
    );
  }, weekCount);
