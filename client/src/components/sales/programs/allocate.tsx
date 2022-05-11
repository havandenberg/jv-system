import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { equals, pick, pluck, sum, values } from 'ramda';
import OutsideClickHandler from 'react-outside-click-handler';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import VirtualizedList from 'components/virtualized-list';
import usePrevious from 'hooks/use-previous';
import {
  useProgramsQueryParams,
  useSearchQueryParam,
} from 'hooks/use-query-params';
import {
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProgramEntryCustomerProgramEntry,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import EditableCell from '../../editable-cell';
import {
  filterProgramEntries,
  getAvailablePalletCount,
  sortProgramEntries,
  getAllocatedPalletCount,
} from './utils';
import { LineItemCheckbox } from 'ui/checkbox';

const gridTemplateColumns =
  'repeat(3, 100px) repeat(3, 70px) 110px repeat(2, 1fr) 1.3fr';
const panelWidth = 850;

const EntryRowText = ({
  customStyles,
  isDirty,
  value,
}: {
  customStyles?: TextProps;
  isDirty?: boolean;
  value: string | number;
}) => (
  <ty.CaptionText
    bold={isDirty}
    ml={th.spacing.sm}
    pr={th.spacing.sm}
    nowrap
    overflow="hidden"
    textOverflow="ellipsis"
    title={value}
    {...customStyles}
  >
    {value || value === 0 ? value : '-'}
  </ty.CaptionText>
);

const ProgramEntryRow = <
  T extends CustomerProgram | ShipperProgram,
  K extends CustomerProgramEntry | ShipperProgramEntry,
>({
  allocateCount,
  entry,
  entryToAllocate,
  handleAllocate,
  isCustomers,
  program,
}: {
  allocateCount: string;
  entry: K;
  entryToAllocate: K;
  handleAllocate: (programEntry: K, updatedCount: string) => void;
  isCustomers: boolean;
  program: T;
}) => {
  const programDate = entry && new Date(entry.programDate.replace(/-/g, '/'));

  const currentAllocatedCount = `${
    getAllocatedPalletCount(entry, entryToAllocate.id, isCustomers) || 0
  }`;
  const maxAllocateCount =
    Math.min(getAvailablePalletCount(entry)) +
    parseInt(currentAllocatedCount, 10);

  const availableCount = entry
    ? getAvailablePalletCount(entry) -
      parseInt(allocateCount, 10) +
      parseInt(currentAllocatedCount, 10)
    : '';

  const isDirty = allocateCount !== currentAllocatedCount;

  const name = isCustomers
    ? `${(program as ShipperProgram)?.shipper?.shipperName} (${
        (program as ShipperProgram)?.shipper?.id
      })`
    : `${(program as CustomerProgram)?.customer?.customerName} (${
        (program as CustomerProgram)?.customer?.id
      })`;

  return (
    <l.Grid
      alignCenter
      gridTemplateColumns={gridTemplateColumns}
      width={th.sizes.fill}
    >
      {[
        name,
        program?.commonSpecies?.speciesName,
        program?.commonVariety?.varietyName,
        program?.commonSize?.sizeName,
        program?.commonPackType?.packTypeName,
        program?.plu,
        `${getWeekNumber(programDate)} - ${format(programDate, 'M/d')}`,
        entry?.palletCount,
      ].map((val, idx) => (
        <EntryRowText key={idx} value={val} />
      ))}
      <EntryRowText
        customStyles={{
          color: availableCount < 0 ? th.colors.status.error : undefined,
        }}
        isDirty={isDirty}
        value={availableCount}
      />
      <EditableCell
        content={{
          dirty: isDirty,
          value: `${allocateCount}`,
        }}
        defaultChildren={null}
        editing={true}
        error={parseInt(allocateCount, 10) > maxAllocateCount}
        inputProps={{
          min: 0,
          max: maxAllocateCount,
          type: 'number',
          mx: th.spacing.xs,
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleAllocate(entry, e.target.value || '0');
        }}
      />
    </l.Grid>
  );
};

const RowWrapper = styled(l.Flex)(({ allocated }: { allocated: boolean }) => ({
  alignItems: 'center',
  background: allocated
    ? th.colors.brand.containerBackground
    : th.colors.background,
  borderRadius: th.borderRadii.default,
  justifyContent: 'space-between',
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
  },
}));

export interface Props<T extends CustomerProgramEntry | ShipperProgramEntry> {
  disabled?: boolean;
  entriesToAllocate: T[];
  entry?: Maybe<T>;
  isCustomers: boolean;
  loading: boolean;
  trigger: (focused: boolean) => React.ReactNode;
  weekCount: number;
  startWeeks: number;
  endWeeks: number;
  handleWeekRangeChange: (
    key: 'start' | 'end',
    value: string,
    referenceDate: Date,
  ) => void;
  allocatedStartDate: Date;
  allocatedEndDate: Date;
}

const getInitialAllocateState = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>(
  entry: Maybe<T> | undefined,
  entriesToAllocate: T[],
  isCustomers: boolean,
) =>
  entry
    ? entriesToAllocate
        .filter((e) =>
          pluck(
            isCustomers ? 'shipperProgramEntryId' : 'customerProgramEntryId',
            (entry?.shipperProgramEntryCustomerProgramEntries?.nodes ||
              []) as ShipperProgramEntryCustomerProgramEntry[],
          ).includes(e.id),
        )
        .reduce((acc, curr) => {
          const allocation = (
            curr.shipperProgramEntryCustomerProgramEntries?.nodes || []
          ).find(
            (a) =>
              a &&
              (isCustomers
                ? a.customerProgramEntryId
                : a?.shipperProgramEntryId) === entry.id,
          );

          if (!allocation) {
            return acc;
          }

          return {
            ...acc,
            [curr.id]: curr.palletCount
              ? { entry: curr, allocatedCount: allocation?.palletCount }
              : undefined,
          };
        }, {})
    : {};

const ProgramAllocateModal = <
  T extends CustomerProgramEntry | ShipperProgramEntry,
>({
  disabled,
  entriesToAllocate,
  entry,
  isCustomers,
  loading,
  trigger,
  weekCount,
  startWeeks,
  endWeeks,
  handleWeekRangeChange,
  allocatedStartDate,
  allocatedEndDate,
}: Props<T>) => {
  const previousLoading = usePrevious(loading);
  const previousEntriesToAllocate = usePrevious(entriesToAllocate);

  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useSearchQueryParam(
    isCustomers ? 'shipperAllocateSearch' : 'customerAllocateSearch',
  );
  const programDate = entry
    ? new Date(entry.programDate.replace(/-/g, '/'))
    : new Date();

  const initialAllocateState = getInitialAllocateState(
    entry,
    entriesToAllocate,
    isCustomers,
  );

  const [entryState, setEntryState] = useState(entry as T);

  const [allocateState, setAllocateState] = useState<{
    [key: number]: { entry: T; allocatedCount: string };
  }>(initialAllocateState);

  const availableCount = `${
    entry
      ? entry.palletCount -
        sum(
          pluck('allocatedCount', values(allocateState)).map((val) =>
            parseInt(val, 10),
          ),
        )
      : 0
  }`;

  const existingAllocations = (entry?.shipperProgramEntryCustomerProgramEntries
    ?.nodes || []) as ShipperProgramEntryCustomerProgramEntry[];

  const nonZeroStateValues = values(allocateState).filter(
    (val) =>
      existingAllocations.find(
        (alloc) =>
          (isCustomers
            ? alloc.shipperProgramEntryId
            : alloc.customerProgramEntryId) === val.entry.id,
      ) || parseInt(val.allocatedCount, 10) > 0,
  );

  const [{ customerAllocateSearch, shipperAllocateSearch }] =
    useProgramsQueryParams();
  const allocateSearch = isCustomers
    ? shipperAllocateSearch
    : customerAllocateSearch;

  const allEntries = [
    ...sortProgramEntries(pluck('entry', nonZeroStateValues), isCustomers),
    ...sortProgramEntries(
      filterProgramEntries(
        allocateSearch,
        entriesToAllocate,
        isCustomers,
        endWeeks,
        entry,
        nonZeroStateValues,
        startWeeks,
      ),
      isCustomers,
    ),
  ];

  const { addedAllocations, removedAllocations, updatedAllocations } = values(
    allocateState,
  ).reduce(
    (acc, val) => {
      const existingAllocation = existingAllocations.find(
        (alloc) =>
          (isCustomers
            ? alloc.shipperProgramEntryId
            : alloc.customerProgramEntryId) === val.entry.id,
      );

      return {
        addedAllocations: !!existingAllocation
          ? acc.addedAllocations
          : [
              ...acc.addedAllocations,
              {
                customerProgramEntryId: isCustomers ? entry?.id : val.entry.id,
                shipperProgramEntryId: isCustomers ? val.entry.id : entry?.id,
                palletCount: val.allocatedCount,
              },
            ],
        removedAllocations:
          !!existingAllocation && parseInt(val.allocatedCount, 10) === 0
            ? [...acc.removedAllocations, existingAllocation.id]
            : acc.removedAllocations,
        updatedAllocations:
          !!existingAllocation && parseInt(val.allocatedCount, 10) > 0
            ? [
                ...acc.updatedAllocations,
                {
                  ...pick(
                    ['customerProgramEntryId', 'id', 'shipperProgramEntryId'],
                    existingAllocation,
                  ),
                  palletCount: val.allocatedCount,
                },
              ]
            : acc.updatedAllocations,
      };
    },
    {
      addedAllocations: [] as Pick<
        ShipperProgramEntryCustomerProgramEntry,
        'customerProgramEntryId' | 'palletCount' | 'shipperProgramEntryId'
      >[],
      removedAllocations: [] as number[],
      updatedAllocations: [] as Pick<
        ShipperProgramEntryCustomerProgramEntry,
        | 'customerProgramEntryId'
        | 'id'
        | 'palletCount'
        | 'shipperProgramEntryId'
      >[],
    },
  );

  const isDirty =
    !equals(
      initialAllocateState,
      nonZeroStateValues.reduce(
        (acc, { allocatedCount, entry }) => ({
          ...acc,
          [entry.id]: { entry, allocatedCount },
        }),
        {},
      ),
    ) || !equals(entry, entryState);

  const [
    handleUpsertCustomerProgramEntries,
    { loading: upsertCustomerEntryLoading },
  ] = api.useUpsertCustomerProgramEntries(
    weekCount,
    allocatedStartDate,
    allocatedEndDate,
  );
  const [
    handleUpsertShipperProgramEntries,
    { loading: upsertShipperEntryLoading },
  ] = api.useUpsertShipperProgramEntries(
    weekCount,
    allocatedStartDate,
    allocatedEndDate,
  );
  const [handleUpsertAllocations, { loading: upsertLoading }] =
    api.useBulkUpsertAllocations(weekCount);
  const [handleDeleteAllocations, { loading: deleteLoading }] =
    api.useBulkDeleteAllocations(weekCount);
  const updateLoading =
    upsertCustomerEntryLoading ||
    upsertShipperEntryLoading ||
    upsertLoading ||
    deleteLoading;

  const entryUpsertVariables = entry
    ? {
        [isCustomers ? 'customerProgramEntries' : 'shipperProgramEntries']: [
          {
            ...pick(
              ['id', 'notes', 'palletCount', 'programDate'],
              entryState || {},
            ),
            customerProgramId: isCustomers
              ? ((entryState || {}) as CustomerProgramEntry).customerProgram?.id
              : undefined,
            shipperProgramId: isCustomers
              ? ((entryState || {}) as ShipperProgramEntry).shipperProgram?.id
              : undefined,
            isAdWeek: isCustomers
              ? ((entryState || {}) as CustomerProgramEntry).isAdWeek
              : undefined,
          },
        ],
      }
    : {};

  const handleSave = () => {
    if (entry) {
      if (isCustomers) {
        handleUpsertCustomerProgramEntries({
          variables: entryUpsertVariables,
        });
      } else {
        handleUpsertShipperProgramEntries({
          variables: entryUpsertVariables,
        });
      }
      handleUpsertAllocations({
        variables: {
          allocations: [...addedAllocations, ...updatedAllocations],
        },
      }).then(() => {
        handleDeleteAllocations({
          variables: {
            idsToDelete: removedAllocations,
          },
        });
      });
    }
  };

  const handleAllocate = (entryToAllocate: T, allocatedCount: string) => {
    setAllocateState({
      ...allocateState,
      [entryToAllocate.id]: { entry: entryToAllocate, allocatedCount },
    });
  };

  const handleAdWeekChange = (isAdWeek: boolean) => {
    setEntryState({
      ...entryState,
      isAdWeek,
    });
  };

  const handleNotesChange = (notes: string) => {
    setEntryState({
      ...entryState,
      notes,
    });
  };

  const handleFocus = () => {
    !disabled && setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    setSearch(undefined);
    setAllocateState(initialAllocateState);
  };

  const handleReset = useCallback(() => {
    setAllocateState(initialAllocateState);
    setEntryState(entry as T);
  }, [entry, initialAllocateState]);

  useEffect(() => {
    if (
      !equals(previousEntriesToAllocate, entriesToAllocate) ||
      (previousLoading && !loading)
    ) {
      handleReset();
    }
  }, [
    entriesToAllocate,
    loading,
    previousLoading,
    previousEntriesToAllocate,
    handleReset,
  ]);

  return (
    <l.Div relative>
      <l.Div onClick={handleFocus}>{trigger(focused)}</l.Div>
      {focused && (
        <OutsideClickHandler onOutsideClick={handleBlur}>
          <l.Div
            borderRadius={th.borderRadii.default}
            border={th.borders.secondary}
            bg={th.colors.background}
            boxShadow={th.shadows.box}
            height={336}
            mt={th.spacing.tn}
            p={th.spacing.sm}
            position="absolute"
            width={panelWidth}
            zIndex={5}
          >
            {entry && (
              <l.Flex alignCenter mb={th.spacing.sm} mx={th.spacing.sm}>
                <l.Flex alignCenter>
                  {isCustomers ? (
                    <LineItemCheckbox
                      checked={
                        !!((entryState || {}) as CustomerProgramEntry).isAdWeek
                      }
                      label={
                        <ty.CaptionText ml={th.spacing.sm} mr={th.spacing.lg}>
                          Ad Week
                        </ty.CaptionText>
                      }
                      onChange={() => {
                        handleAdWeekChange(
                          !((entryState || {}) as CustomerProgramEntry)
                            .isAdWeek,
                        );
                      }}
                    />
                  ) : (
                    <div />
                  )}
                  <l.Flex alignCenter>
                    <ty.SmallText mr={th.spacing.sm} secondary>
                      Notes:
                    </ty.SmallText>
                    <EditableCell
                      content={{
                        dirty: false,
                        value: (entryState as T).notes || '',
                      }}
                      defaultChildren={null}
                      editing={true}
                      inputProps={{
                        width: 200,
                      }}
                      onChange={(e) => {
                        handleNotesChange(e.target.value);
                      }}
                    />
                  </l.Flex>
                </l.Flex>
                <l.Flex alignCenter ml={th.spacing.lg}>
                  {isDirty ? (
                    <b.Error
                      ml={th.spacing.sm}
                      onClick={handleReset}
                      small
                      status={th.colors.brand.primaryAccent}
                      mx={th.spacing.sm}
                    >
                      Reset
                    </b.Error>
                  ) : (
                    <div />
                  )}
                  <b.Success
                    disabled={updateLoading || !isDirty}
                    onClick={handleSave}
                    small
                    status={th.colors.brand.primaryAccent}
                    mx={th.spacing.sm}
                  >
                    {updateLoading ? (
                      <l.Flex alignCenter justifyCenter>
                        <ClipLoader
                          color={th.colors.brand.secondary}
                          size={th.sizes.xs}
                        />
                      </l.Flex>
                    ) : (
                      'Save'
                    )}
                  </b.Success>
                </l.Flex>
              </l.Flex>
            )}
            <l.Grid
              alignCenter
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.md}
            >
              <l.Flex alignCenter gridColumn="1 / 7" ml={th.spacing.sm}>
                <ty.SmallText mr={th.spacing.sm} secondary>
                  Search:
                </ty.SmallText>
                <EditableCell
                  content={{ dirty: false, value: search || '' }}
                  debounce={500}
                  defaultChildren={null}
                  editing={true}
                  inputProps={{
                    autoFocus: true,
                    marginRight: th.spacing.lg,
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <ty.SmallText mr={th.spacing.sm} secondary>
                  Previous weeks:
                </ty.SmallText>
                <EditableCell
                  content={{ dirty: false, value: `${startWeeks}` }}
                  debounce={500}
                  defaultChildren={null}
                  editing={true}
                  inputProps={{
                    type: 'number',
                    marginRight: th.spacing.md,
                    width: th.sizes.sm,
                  }}
                  onChange={(e) => {
                    handleWeekRangeChange(
                      'start',
                      e.target.value,
                      new Date(entry?.programDate.replace(/-/g, '/')),
                    );
                  }}
                />
                <ty.SmallText mr={th.spacing.sm} secondary>
                  Future:
                </ty.SmallText>
                <EditableCell
                  content={{ dirty: false, value: `${endWeeks}` }}
                  debounce={500}
                  defaultChildren={null}
                  editing={true}
                  inputProps={{
                    type: 'number',
                    width: th.sizes.sm,
                  }}
                  onChange={(e) => {
                    handleWeekRangeChange(
                      'end',
                      e.target.value,
                      new Date(entry?.programDate.replace(/-/g, '/')),
                    );
                  }}
                />
              </l.Flex>
              <ty.CaptionText
                ml={th.spacing.sm}
                mr={th.spacing.md}
                pr={th.spacing.sm}
              >
                {programDate
                  ? `${getWeekNumber(programDate)} - ${format(
                      programDate,
                      'M/d',
                    )}`
                  : '-'}
              </ty.CaptionText>
              <l.Flex
                alignCenter
                gridColumn="8 / 10"
                justifyBetween
                width={th.sizes.fill}
              >
                <l.Flex alignCenter>
                  <ty.SmallText mx={th.spacing.sm}>Total:</ty.SmallText>
                  <ty.CaptionText>{entry?.palletCount || '-'}</ty.CaptionText>
                </l.Flex>
                <l.Flex alignCenter>
                  <ty.SmallText ml={th.spacing.md} mr={th.spacing.sm}>
                    Avail:
                  </ty.SmallText>
                  <ty.CaptionText
                    bold
                    color={
                      availableCount === '0'
                        ? th.colors.status.success
                        : th.colors.status.error
                    }
                  >
                    {entry ? availableCount : '-'}
                  </ty.CaptionText>
                </l.Flex>
              </l.Flex>
            </l.Grid>
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              mr={th.spacing.md}
            >
              {[
                'Shipper',
                'Species',
                'Variety',
                'Size',
                'Pack Type',
                'PLU/GTIN',
                'Program Week',
                'Total',
                'Avail',
                'Alloc',
              ].map((val, idx) => (
                <ty.SmallText
                  key={idx}
                  ml={th.spacing.sm}
                  nowrap
                  overflow="hidden"
                  secondary
                  textOverflow="ellipsis"
                  title={val}
                  width={th.sizes.fill}
                >
                  {val}
                </ty.SmallText>
              ))}
            </l.Grid>
            {allEntries.length > 0 ? (
              <VirtualizedList
                height={230}
                rowCount={allEntries.length}
                rowHeight={32}
                rowRenderer={({ index, style }) => {
                  const item: T = allEntries[index];
                  const program = isCustomers
                    ? ((item as ShipperProgramEntry)
                        ?.shipperProgram as ShipperProgram)
                    : ((item as CustomerProgramEntry)
                        ?.customerProgram as CustomerProgram);
                  return (
                    item && (
                      <RowWrapper
                        allocated={
                          !!nonZeroStateValues.find(
                            (v) => v.entry.id === item.id,
                          )
                        }
                        key={item.id}
                        style={style}
                      >
                        <ProgramEntryRow
                          allocateCount={
                            allocateState[item.id]?.allocatedCount || '0'
                          }
                          entryToAllocate={entry as T}
                          entry={item}
                          handleAllocate={handleAllocate}
                          isCustomers={isCustomers}
                          program={program}
                        />
                      </RowWrapper>
                    )
                  );
                }}
                style={{ borderRadius: th.borderRadii.default }}
                width={panelWidth}
              />
            ) : (
              <ty.CaptionText disabled mt={th.spacing.md} px={th.spacing.sm}>
                No matching programs found...
              </ty.CaptionText>
            )}
          </l.Div>
        </OutsideClickHandler>
      )}
    </l.Div>
  );
};

export default ProgramAllocateModal;
