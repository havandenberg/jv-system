import { groupBy, pluck, sortBy, sum, times, values } from 'ramda';
import { add, startOfISOWeek, endOfISOWeek } from 'date-fns';

import {
  CommonSpecies,
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

export const getAllocatedPalletCount = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entry: T,
  programEntryId: number,
  isCustomers: boolean,
) =>
  sum(
    pluck(
      'palletCount',
      (
        (entry.shipperProgramEntryCustomerProgramEntries?.nodes ||
          []) as ShipperProgramEntryCustomerProgramEntry[]
      ).filter(
        (e) =>
          (isCustomers ? e.customerProgramEntryId : e.shipperProgramEntryId) ===
          programEntryId,
      ),
    ),
  );

export const filterProgramEntries = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  allocateSearch: string,
  entries: T[],
  isCustomers: boolean,
  endWeeks: number,
  entry: Maybe<T> | undefined,
  nonZeroStateValues: {
    entry: T;
    allocatedCount: string;
  }[],
  startWeeks: number,
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
      allocateSearch &&
      allocateSearch
        .split(' ')
        .every((s) =>
          (e.searchText || '').toLowerCase().includes(s.toLowerCase()),
        );

    const program = isCustomers
      ? (entry as CustomerProgramEntry)?.customerProgram
      : (entry as ShipperProgramEntry)?.shipperProgram;

    const programToAllocate = isCustomers
      ? (e as ShipperProgramEntry)?.shipperProgram
      : (e as CustomerProgramEntry)?.customerProgram;

    const isExactMatch =
      program?.commonSpecies?.id === programToAllocate?.commonSpecies?.id &&
      program?.commonVariety?.id === programToAllocate?.commonVariety?.id &&
      program?.commonSize?.id === programToAllocate?.commonSize?.id &&
      program?.commonPackType?.id === programToAllocate?.commonPackType?.id &&
      program?.plu === programToAllocate?.plu;

    const meetsSearchCriteria = !!allocateSearch
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

export const sortProgramEntries = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entries: T[],
  isCustomers: boolean,
) =>
  sortBy(
    (entry) => {
      const program = isCustomers
        ? (entry as ShipperProgramEntry).shipperProgram
        : (entry as CustomerProgramEntry).customerProgram;
      const name = isCustomers
        ? (program as ShipperProgram)?.shipper?.shipperName
        : (program as CustomerProgram)?.customer?.customerName;
      return `${name}${program?.commonSpecies?.speciesName}${program?.commonVariety?.varietyName}${program?.commonSize?.sizeName}${program?.commonPackType?.packTypeName}${program?.plu}`;
    },
    sortBy(
      ({ programDate }) =>
        -getWeekNumber(new Date(programDate.replace(/-/g, '/'))),
      entries,
    ),
  );

export const getProgramTotals = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entries: T[],
  selectedWeekNumber: number,
  weekCount: number,
  getProgramEntryValue: (
    entry: T,
    key: keyof T,
  ) => { value: string; dirty: boolean },
) =>
  times((index) => {
    const filteredEntries = entries
      .filter(
        (entry) =>
          entry &&
          getWeekNumber(new Date(entry.programDate.replace(/-/g, '/'))) ===
            selectedWeekNumber + index,
      )
      .reverse();

    return filteredEntries.length === 0
      ? { total: 0, available: null }
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
                acc.total + +getProgramEntryValue(entry, 'palletCount').value,
              available:
                acc.available +
                (entry ? (availableCount < 0 ? 0 : availableCount) : 0),
            };
          },
          { total: 0, available: 0 },
        );
  }, weekCount);

export const getAvailablePalletEntryTotals = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entries: T[],
  selectedWeekNumber: number,
  weekCount: number,
) =>
  times((index) => {
    const entry = entries.find(
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

export const groupProgramsByProduct = <
  T extends CustomerProgram | ShipperProgram,
  K extends CustomerProgramUpdate | ShipperProgramUpdate,
>(
  specieses: CommonSpecies[],
  programs: T[],
  getProgramValue: (
    program: Maybe<T> | undefined,
    key: keyof K,
  ) => { value: string },
) =>
  groupBy(
    (program) => {
      const species = specieses.find(
        (s) => s.id === getProgramValue(program, 'commonSpeciesId').value,
      );
      return `${species?.speciesName}`;
    },
    sortBy((program) => {
      const species = specieses.find(
        (s) => s.id === getProgramValue(program, 'commonSpeciesId').value,
      );
      const variety = species?.commonVarieties?.nodes.find(
        (v) => v && v.id === getProgramValue(program, 'commonVarietyId').value,
      );
      const size = species?.commonSizes?.nodes.find(
        (s) => s && s.id === getProgramValue(program, 'commonSizeId').value,
      );
      const packType = species?.commonPackTypes?.nodes.find(
        (p) => p && p.id === getProgramValue(program, 'commonPackTypeId').value,
      );
      return `${species?.speciesName || 'aaaaa'} ${
        variety?.varietyName || 'aaaaa'
      } ${size?.sizeName || 'aaaaa'} ${packType?.packTypeName || 'aaaaa'} ${
        getProgramValue(program, 'plu').value
      }`.toLowerCase();
    }, programs),
  );
