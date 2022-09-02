import { groupBy, pluck, sortBy, sum, times, uniqBy, values } from 'ramda';
import { add, startOfISOWeek, endOfISOWeek } from 'date-fns';

import {
  CommonSpecies,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProgramEntryCustomerProgramEntry,
  ShipperProjectionVesselInfo,
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

export const getGridProps = (weekCount: number, isCustomers: boolean) => {
  const columnWidth = 70;
  const firstColumnWidth = isCustomers ? 500 : 600;
  const gridTemplateColumns = `${firstColumnWidth}px repeat(${weekCount}, ${columnWidth}px)`;
  const gridWidth = firstColumnWidth + weekCount * columnWidth;
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
  isCustomers: boolean,
) =>
  values(
    groupBy(
      (program) =>
        `species=${program.commonSpeciesId}variety=${
          program.commonVarietyId
        }size=${program.commonSizeId}packType=${program.commonPackTypeId}plu=${
          program.plu
        }${isCustomers ? '' : 'customerId=' + program.customerId}`,
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
      program?.plu === programToAllocate?.plu &&
      (!programToAllocate?.customer?.id ||
        program?.customer?.id === programToAllocate?.customer?.id);

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
  startDate: string,
  weekCount: number,
  getProgramEntryValue: (
    entry: T,
    key: keyof T,
  ) => { value: string; dirty: boolean },
  vesselInfos: ShipperProjectionVesselInfo[],
) =>
  times((index) => {
    const filteredEntries = entries
      .filter(
        (entry) =>
          entry &&
          startOfISOWeek(
            new Date(entry.programDate.replace(/-/g, '/')),
          ).toLocaleString() ===
            startOfISOWeek(
              add(
                new Date(startDate ? startDate.replace(/-/g, '/') : new Date()),
                { weeks: index },
              ),
            ).toLocaleString(),
      )
      .reverse();

    const filteredVesselInfos = vesselInfos.filter((vesselInfo) => {
      if (!vesselInfo) return false;
      const arrivalDate = vesselInfo.vessel?.vessel?.arrivalDate;
      return (
        vesselInfo &&
        arrivalDate &&
        startOfISOWeek(
          new Date(arrivalDate.replace(/-/g, '/')),
        ).toLocaleString() ===
          startOfISOWeek(
            add(
              new Date(startDate ? startDate.replace(/-/g, '/') : new Date()),
              { weeks: index },
            ),
          ).toLocaleString()
      );
    });

    return filteredEntries.length === 0
      ? { total: 0, available: null, projected: null }
      : filteredEntries.reduce(
          (acc, entry) => {
            const availableCount =
              entry.palletCount -
              sum(
                (
                  entry.shipperProgramEntryCustomerProgramEntries?.nodes || []
                ).map((alloc) => alloc && alloc.palletCount),
              );

            const shipperProgram = (entry as ShipperProgramEntry)
              ?.shipperProgram;
            const commonSpeciesId =
              shipperProgram && shipperProgram?.commonSpecies?.id;
            const commonVarietyId =
              shipperProgram && shipperProgram?.commonVariety?.id;
            const commonSizeId =
              shipperProgram && shipperProgram?.commonSize?.id;
            const commonPackTypeId =
              shipperProgram && shipperProgram?.commonPackType?.id;
            const plu = shipperProgram && shipperProgram?.plu;
            const customerId = shipperProgram && shipperProgram?.customer?.id;

            const projectionsCount = sum(
              filteredVesselInfos
                .map((vesselInfo) =>
                  (
                    vesselInfo.shipperProjectionEntriesByVesselInfoId?.nodes ||
                    []
                  )
                    .filter((entry) => {
                      const entryProduct = entry?.product;
                      const validSpecies =
                        entryProduct?.commonSpeciesId === commonSpeciesId;
                      const validVariety =
                        entryProduct?.commonVarietyId === commonVarietyId;
                      const validSize =
                        entryProduct?.commonSizeId === commonSizeId;
                      const validPackType =
                        entryProduct?.commonPackTypeId === commonPackTypeId;
                      const validPLU = entryProduct?.plu === plu;
                      const validCustomer =
                        entryProduct?.customerId ||
                        undefined === customerId ||
                        undefined;

                      return (
                        validSpecies &&
                        validVariety &&
                        validSize &&
                        validPackType &&
                        validPLU &&
                        validCustomer
                      );
                    })
                    .map((vesselInfoEntry) => vesselInfoEntry?.palletCount),
                )
                .flat(),
            );
            return {
              total:
                acc.total + +getProgramEntryValue(entry, 'palletCount').value,
              available:
                acc.available +
                (entry ? (availableCount < 0 ? 0 : availableCount) : 0),
              projected: acc.projected + projectionsCount,
            };
          },
          { total: 0, available: 0, projected: 0 },
        );
  }, weekCount);

export const getAllocatedPalletEntryTotalSets = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entries: T[],
  selectedWeekNumber: number,
  weekCount: number,
  isCustomers: boolean,
) => {
  const rows = [
    ...sortBy(
      ({ name }) => name,
      uniqBy(
        ({ id }) => id,
        pluck('shipperProgramEntryCustomerProgramEntries', entries)
          .map(
            (allocations) =>
              allocations?.nodes.map((allocation) => ({
                id: isCustomers
                  ? allocation?.shipperProgramEntry?.shipperProgram?.shipper?.id
                  : allocation?.customerProgramEntry?.customerProgram?.customer
                      ?.id,
                name:
                  (isCustomers
                    ? allocation?.shipperProgramEntry?.shipperProgram?.shipper
                        ?.shipperName
                    : allocation?.customerProgramEntry?.customerProgram
                        ?.customer?.customerName) || '',
              })) || [],
          )
          .flat(),
      ) as { id: string; name: string }[],
    ),
    { id: 'unalloc', name: 'Unalloc' },
  ];

  return rows.reduce((acc, { id, name }) => {
    const totals = times((index) => {
      const entry = entries.find(
        (e) =>
          e &&
          getWeekNumber(new Date(e.programDate.replace(/-/g, '/'))) ===
            selectedWeekNumber + index,
      );
      const total =
        entry &&
        sum(
          (entry.shipperProgramEntryCustomerProgramEntries?.nodes || [])
            .filter(
              (allocation) =>
                name === 'Unalloc' ||
                (isCustomers
                  ? allocation?.shipperProgramEntry?.shipperProgram?.shipper?.id
                  : allocation?.customerProgramEntry?.customerProgram?.customer
                      ?.id) === id,
            )
            .map((alloc) => alloc && alloc.palletCount),
        );
      return (
        entry &&
        total !== undefined &&
        total !== null &&
        (name === 'Unalloc' ? entry.palletCount - total : total)
      );
    }, weekCount);

    return {
      ...acc,
      [id]: {
        name,
        totals: [
          sum(
            totals.map((total) =>
              total !== null && total !== undefined && total < 0
                ? 0
                : total || 0,
            ),
          ),
          ...totals,
        ],
      },
    };
  }, {});
};

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
