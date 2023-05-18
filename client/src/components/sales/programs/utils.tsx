import React from 'react';
import { equals, pluck, sortBy, sum, times, uniqBy, values } from 'ramda';
import { add, startOfISOWeek, endOfISOWeek } from 'date-fns';
import { useLocation } from 'react-router-dom';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { useProgramsQueryParams } from 'hooks/use-query-params';
import {
  CommonPackTypeTag,
  CommonSizeTag,
  CommonSpecies,
  CommonSpeciesTag,
  CommonVarietyTag,
  Customer,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  Shipper,
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

import ProgramRow, { getProgramDetailRows, getProgramTotalRows } from './row';
import {
  CustomerProgramUpdate,
  ProgramChanges,
  ProgramProps,
  ProgramTotal,
  RemovedItems,
  ShipperProgramUpdate,
} from './types';

export const getGridProps = (weekCount: number, isCustomers: boolean) => {
  const columnWidth = 65;
  const firstColumnWidth = isCustomers ? 500 : 600;
  const gridTemplateColumns = `${firstColumnWidth}px repeat(${weekCount}, ${columnWidth}px)`;
  const gridWidth = firstColumnWidth + weekCount * columnWidth + 16;
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

interface GroupedPrograms<T> {
  [key: string]: {
    [key: string]: {
      programs: { [key: string]: T[] };
      programTotals: ProgramTotal[];
    };
  };
}

export const useFilterAndGroupPrograms = <
  T extends CustomerProgram | ShipperProgram,
  K extends CustomerProgramEntry | ShipperProgramEntry,
  J extends CustomerProgramUpdate | ShipperProgramUpdate,
  L extends Customer | Shipper,
>({
  coast,
  commonSpecieses,
  commonSpeciesId,
  commonVarietyId,
  commonSizeId,
  commonPackTypeId,
  customerIdFilter,
  editing,
  getProgramValue,
  getProgramEntryValue,
  isCustomers,
  selectedCustomerOrShipper,
  endDate,
  startDate,
  programProps,
  programs,
  vesselInfos,
  weekCount,
}: {
  coast: string;
  commonSpecieses: CommonSpecies[];
  commonSpeciesId: string[];
  commonVarietyId: string[];
  commonSizeId: string[];
  commonPackTypeId: string[];
  customerIdFilter: string[];
  editing: boolean;
  getProgramValue: (
    program: Maybe<T> | undefined,
    key: keyof J,
  ) => { dirty: boolean; value: string };
  getProgramEntryValue: (
    entry: K,
    key: keyof K,
  ) => { value: string; dirty: boolean };
  isCustomers: boolean;
  selectedCustomerOrShipper?: L;
  endDate: string;
  startDate: string;
  programs: T[];
  programProps: Omit<
    ProgramProps,
    'customerPrograms' | 'shipperPrograms' | 'duplicateProgramIds'
  >;
  vesselInfos: ShipperProjectionVesselInfo[];
  weekCount: number;
}) => {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  params.delete('listScrollTop');
  const toParams = params.toString();
  const { gridTemplateColumns } = getGridProps(
    programProps.weekCount,
    isCustomers,
  );

  const [, setProgramsQueryParams] = useProgramsQueryParams();

  let combinedGrandProgramTotals = times(
    () => ({ total: 0, available: 0, projected: 0 }),
    weekCount,
  ) as ProgramTotal[];
  let ecGrandProgramTotals = times(
    () => ({ total: 0, available: 0, projected: 0 }),
    weekCount,
  ) as ProgramTotal[];
  let wcGrandProgramTotals = times(
    () => ({ total: 0, available: 0, projected: 0 }),
    weekCount,
  ) as ProgramTotal[];
  const groupedPrograms = {} as GroupedPrograms<T>;

  const filterPrograms = (arrivalPort: string) =>
    programs.reduce((acc, program) => {
      const isCoastValid = program.arrivalPort === arrivalPort;
      const isValid =
        (selectedCustomerOrShipper?.id
          ? (isCustomers
              ? program.customerId
              : (program as ShipperProgram).shipperId) ===
            selectedCustomerOrShipper?.id
          : true) &&
        (editing ||
          ((!commonSpeciesId ||
            commonSpeciesId.some((id: string) =>
              id === 'None'
                ? !program.commonSpecies?.speciesName
                : [
                    program.commonSpecies?.speciesName,
                    ...pluck(
                      'tagText',
                      (program.commonSpecies?.commonSpeciesTags?.nodes ||
                        []) as CommonSpeciesTag[],
                    ).map((tagText) => `${tagText} (tag)`),
                  ].includes(id),
            )) &&
            (!commonVarietyId ||
              commonVarietyId.some((id: string) =>
                id === 'None'
                  ? !program.commonVariety?.varietyName
                  : [
                      program.commonVariety?.varietyName,
                      ...pluck(
                        'tagText',
                        (program.commonVariety?.commonVarietyTags?.nodes ||
                          []) as CommonVarietyTag[],
                      ).map((tagText) => `${tagText} (tag)`),
                    ].includes(id),
              )) &&
            (!commonSizeId ||
              commonSizeId.some((id: string) =>
                id === 'None'
                  ? !program.commonSize?.sizeName
                  : [
                      program.commonSize?.sizeName,
                      ...pluck(
                        'tagText',
                        (program.commonSize?.commonSizeTags?.nodes ||
                          []) as CommonSizeTag[],
                      ).map((tagText) => `${tagText} (tag)`),
                    ].includes(id),
              )) &&
            (!commonPackTypeId ||
              commonPackTypeId.some((id: string) =>
                id === 'None'
                  ? !program.commonPackType?.packTypeName
                  : [
                      program.commonPackType?.packTypeName,
                      ...pluck(
                        'tagText',
                        (program.commonPackType?.commonPackTypeTags?.nodes ||
                          []) as CommonPackTypeTag[],
                      ).map((tagText) => `${tagText} (tag)`),
                    ].includes(id),
              )) &&
            (isCustomers ||
              !customerIdFilter ||
              customerIdFilter.some((id: string) =>
                id === 'None'
                  ? !program.customer?.customerName
                  : [program.customer?.customerName].includes(id),
              )))) &&
        (program.id < 0 ||
          (isCustomers
            ? (((program as CustomerProgram).customerProgramEntries.nodes ||
                []) as CustomerProgramEntry[])
            : (((program as ShipperProgram).shipperProgramEntries.nodes ||
                []) as ShipperProgramEntry[])
          ).some(
            (e) =>
              isDateGreaterThanOrEqualTo(
                new Date(e.programDate.replace(/-/g, '/')),
                startOfISOWeek(new Date(startDate.replace(/-/g, '/'))),
              ) &&
              (startDate === endDate ||
                isDateLessThanOrEqualTo(
                  new Date(e.programDate.replace(/-/g, '/')),
                  endOfISOWeek(new Date(endDate.replace(/-/g, '/'))),
                )),
          ));

      const customerOrShipperKey =
        (isCustomers
          ? program.customer?.customerName ||
            (selectedCustomerOrShipper as Customer)?.customerName
          : (program as ShipperProgram).shipper?.shipperName) ||
        (selectedCustomerOrShipper as Shipper)?.shipperName;

      if (!isValid || !customerOrShipperKey) {
        return acc;
      }

      const commonSpecies = commonSpecieses.find(
        (s) => s.id === program.commonSpeciesId,
      );

      const speciesKey = commonSpecies?.speciesName || 'UNK';

      const productKey = `${program.commonSpeciesId}-${
        program.commonVarietyId
      }-${program.commonSizeId}-${program.commonPackTypeId}-${program.plu}${
        isCustomers ? '' : `-${program.customerId}`
      }`;

      const programTotals = getProgramTotals(
        (isCustomers
          ? (program as CustomerProgram).customerProgramEntries.nodes
          : (program as ShipperProgram).shipperProgramEntries.nodes
        ).flat() as K[],
        startDate || '',
        weekCount,
        getProgramEntryValue,
        isCustomers
          ? []
          : vesselInfos.filter(
              (vesselInfo) =>
                program &&
                vesselInfo.shipperId === (program as ShipperProgram).shipperId,
            ),
      );

      if (isCoastValid) {
        combinedGrandProgramTotals = combinedGrandProgramTotals.map(
          ({ total, available, projected }, idx) => ({
            total: total + programTotals[idx].total,
            available: (available || 0) + (programTotals[idx].available || 0),
            projected: (projected || 0) + (programTotals[idx].projected || 0),
          }),
        );
      }
      if (arrivalPort === 'EC' && isCoastValid) {
        ecGrandProgramTotals = ecGrandProgramTotals.map(
          ({ total, available, projected }, idx) => ({
            total: total + programTotals[idx].total,
            available: (available || 0) + (programTotals[idx].available || 0),
            projected: (projected || 0) + (programTotals[idx].projected || 0),
          }),
        );
      }
      if (arrivalPort === 'WC' && isCoastValid) {
        wcGrandProgramTotals = wcGrandProgramTotals.map(
          ({ total, available, projected }, idx) => ({
            total: total + programTotals[idx].total,
            available: (available || 0) + (programTotals[idx].available || 0),
            projected: (projected || 0) + (programTotals[idx].projected || 0),
          }),
        );
      }

      if (program.arrivalPort === coast && isCoastValid) {
        if (groupedPrograms[customerOrShipperKey]) {
          const programsBySpecies =
            groupedPrograms[customerOrShipperKey][speciesKey];
          if (programsBySpecies) {
            if (programsBySpecies.programs[productKey]) {
              programsBySpecies.programs[productKey] = [
                ...programsBySpecies.programs[productKey],
                program,
              ];
              programsBySpecies.programTotals =
                programsBySpecies.programTotals.map(
                  ({ total, available, projected }, idx) => ({
                    total: total + programTotals[idx].total,
                    available:
                      (available || 0) + (programTotals[idx].available || 0),
                    projected:
                      (projected || 0) + (programTotals[idx].projected || 0),
                  }),
                );
            } else {
              programsBySpecies.programs[productKey] = [program];
              programsBySpecies.programTotals =
                programsBySpecies.programTotals.map(
                  ({ total, available, projected }, idx) => ({
                    total: total + programTotals[idx].total,
                    available:
                      (available || 0) + (programTotals[idx].available || 0),
                    projected:
                      (projected || 0) + (programTotals[idx].projected || 0),
                  }),
                );
            }
          } else {
            groupedPrograms[customerOrShipperKey][speciesKey] = {
              programs: {
                [productKey]: [program],
              },
              programTotals,
            };
          }
        } else {
          groupedPrograms[customerOrShipperKey] = {
            [speciesKey]: {
              programs: {
                [productKey]: [program],
              },
              programTotals,
            },
          };
        }
      }

      if (program.arrivalPort !== coast) return acc;

      return [...acc, program];
    }, [] as T[]);

  const ecFilteredPrograms = filterPrograms('EC');
  const wcFilteredPrograms = filterPrograms('WC');

  const filteredPrograms =
    coast === 'EC' ? ecFilteredPrograms : wcFilteredPrograms;

  const grandProgramTotals =
    coast === 'EC' ? ecGrandProgramTotals : wcGrandProgramTotals;

  const duplicateProgramIds = (
    selectedCustomerOrShipper?.id
      ? Object.values(groupedPrograms)
          .map((customerOrShipper) =>
            Object.keys(customerOrShipper)
              .map((speciesKey) =>
                Object.keys(customerOrShipper[speciesKey].programs)
                  .map(
                    (productKey) =>
                      (customerOrShipper[speciesKey].programs[productKey]
                        ?.length > 1
                        ? customerOrShipper[speciesKey].programs[
                            productKey
                          ].map((program) => parseInt(program.id, 10))
                        : []) as number[],
                  )
                  .flat(),
              )
              .flat(),
          )
          .flat()
      : []
  ) as number[];

  let startIndex = 1;

  const components = Object.keys(groupedPrograms)
    .sort()
    .map((customerOrShipperKey) => {
      const customerOrShipper = groupedPrograms[customerOrShipperKey];
      const speciesKeys = Object.keys(customerOrShipper).sort();
      return speciesKeys
        .map((speciesKey, speciesIdx) => {
          const programsBySpecies = customerOrShipper[speciesKey];
          const programs = sortBy(
            (prog: T) =>
              `${prog.commonVariety?.varietyName} ${prog.commonSize?.sizeName} ${prog.commonPackType?.packTypeName} ${prog.plu} ${prog.customer?.customerName}`.toLowerCase(),
            values(programsBySpecies.programs).flat() as T[],
          );

          const { programTotals } = programsBySpecies;

          const programTotalRows = getProgramTotalRows({
            editing,
            gridTemplateColumns,
            isCustomers,
            programTotals,
            showAllocated: programProps.showAllocated,
            species: getProgramValue(programs[0], 'commonSpeciesId').value,
          });

          const isEvenRow =
            (((programsBySpecies &&
              Object.keys(programsBySpecies).indexOf(speciesKey)) ||
              0) +
              startIndex) %
              2 ===
            0;
          const isFirstRow = speciesIdx === 0;

          const customerName =
            editing && selectedCustomerOrShipper
              ? (selectedCustomerOrShipper as Customer)?.customerName
              : (programs[0] as CustomerProgram)?.customer?.customerName ||
                'UNK';
          const shipperName =
            editing && selectedCustomerOrShipper
              ? (selectedCustomerOrShipper as Shipper)?.shipperName
              : (programs[0] as ShipperProgram)?.shipper?.shipperName;
          const name = isCustomers ? customerName : shipperName;

          const speciesName = speciesKeys.join(' - ');

          const id = isCustomers
            ? (programs[0] as CustomerProgram)?.customer?.id
            : (programs[0] as ShipperProgram)?.shipper?.id;

          startIndex += 1;

          return [
            ...(isFirstRow
              ? [
                  ({ scrollLeft = 0 }: { scrollLeft?: number }) => (
                    <l.Flex
                      alignCenter
                      bg={
                        isEvenRow
                          ? th.colors.brand.containerBackground
                          : 'transparent'
                      }
                      height={th.sizes.fill}
                    >
                      <l.Flex
                        alignCenter
                        transform={`translateX(${scrollLeft}px)`}
                      >
                        <ty.LinkText
                          bold
                          fontSize={13}
                          hover
                          ml={th.spacing.md}
                          nowrap
                          to={`${pathname}?${toParams}&${
                            isCustomers ? 'customerId' : 'shipperId'
                          }=${id}`}
                          overflow="hidden"
                          textDecoration="underline"
                          textOverflow="ellipsis"
                        >
                          {name}
                        </ty.LinkText>
                        {scrollLeft > 100 && (
                          <ty.CaptionText bold fontSize={13}>
                            &nbsp;&nbsp;-&nbsp;&nbsp;{speciesName}
                          </ty.CaptionText>
                        )}
                      </l.Flex>
                    </l.Flex>
                  ),
                ]
              : []),
            ...programs.reduce<{
              components: ((props: {
                portalTop?: number;
                scrollLeft?: number;
              }) => JSX.Element)[];
              previousProgram?: CustomerProgram | ShipperProgram;
            }>(
              ({ components, previousProgram }, program, idx) => {
                const showSpecies =
                  !previousProgram ||
                  !equals(
                    program.commonSpeciesId,
                    previousProgram.commonSpeciesId,
                  );
                const showVariety =
                  !previousProgram ||
                  !equals(
                    program.commonVarietyId,
                    previousProgram.commonVarietyId,
                  );

                const programVesselInfos = vesselInfos.filter(
                  (vesselInfo) =>
                    program &&
                    vesselInfo.shipperId ===
                      (program as ShipperProgram).shipperId,
                );

                const programDetailRows = getProgramDetailRows({
                  editing,
                  gridTemplateColumns,
                  changeHandlers: programProps.changeHandlers,
                  newItemHandlers: programProps.newItemHandlers,
                  isCustomers,
                  program,
                  setProgramsQueryParams,
                  showAllocated: programProps.showAllocated,
                  showPricing: programProps.showPricing,
                  startDate,
                  vesselInfos: programVesselInfos,
                  weekCount,
                  valueGetters: programProps.valueGetters,
                });

                return {
                  components: [
                    ...components,
                    ({ portalTop }) => (
                      <l.Flex
                        alignCenter
                        bg={
                          isEvenRow
                            ? th.colors.brand.containerBackground
                            : 'transparent'
                        }
                        height={th.sizes.fill}
                      >
                        <ProgramRow
                          {...programProps}
                          commonSpecieses={commonSpecieses}
                          duplicateProgramIds={duplicateProgramIds}
                          gridTemplateColumns={gridTemplateColumns}
                          index={idx}
                          key={idx}
                          program={program}
                          portalTop={portalTop}
                          previousProgram={previousProgram}
                          showSpecies={showSpecies}
                          showVariety={showVariety}
                        />
                      </l.Flex>
                    ),
                    ...programDetailRows.map((row) => () => (
                      <l.Flex
                        alignCenter
                        bg={
                          isEvenRow
                            ? th.colors.brand.containerBackground
                            : 'transparent'
                        }
                        height={th.sizes.fill}
                      >
                        {row}
                      </l.Flex>
                    )),
                  ],
                  previousProgram: program,
                };
              },
              { components: [] },
            ).components,
            ...programTotalRows.map((row, idy) => () => (
              <l.Flex
                alignCenter
                borderBottom={
                  idy === programTotalRows.length - 1
                    ? th.borders.secondary
                    : 'transparent'
                }
                borderTop={
                  programProps.showAllocated && !editing && idy === 0
                    ? `1px dashed ${th.colors.brand.disabled}`
                    : 'transparent'
                }
                bg={
                  isEvenRow
                    ? th.colors.brand.containerBackground
                    : 'transparent'
                }
                height={34}
              >
                {row()}
              </l.Flex>
            )),
          ];
        })
        .flat();
    })
    .flat();

  return {
    duplicateProgramIds,
    components,
    filteredPrograms,
    combinedGrandProgramTotals,
    grandProgramTotals,
    groupedPrograms,
  };
};

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

export const getAllocatedPalletEntryTotalSets = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entries: T[],
  startDate: string | null | undefined,
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
          startOfISOWeek(
            new Date(e.programDate.replace(/-/g, '/')),
          ).toLocaleString() ===
            startOfISOWeek(
              add(
                new Date(startDate ? startDate.replace(/-/g, '/') : new Date()),
                { weeks: index },
              ),
            ).toLocaleString(),
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
        (entry &&
          total !== undefined &&
          total !== null &&
          (name === 'Unalloc' ? entry.palletCount - total : total)) ||
        undefined
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
