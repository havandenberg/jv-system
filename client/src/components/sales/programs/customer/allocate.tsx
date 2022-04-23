import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { equals, pick, pluck, sum, values } from 'ramda';
import OutsideClickHandler from 'react-outside-click-handler';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { ResetButton } from 'components/sales/inventory/use-filters';
import VirtualizedList from 'components/virtualized-list';
import usePrevious from 'hooks/use-previous';
import {
  useProgramsQueryParams,
  useSearchQueryParam,
} from 'hooks/use-query-params';
import {
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

import EditableCell from '../../../editable-cell';
import {
  filterShipperProgramEntries,
  getCustomerAllocatedPalletCount,
  getAvailablePalletCount,
  sortAllocatedShipperProgramEntries,
  sortShipperProgramEntries,
} from '../utils';

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

const ShipperProgramEntryRow = ({
  allocateCount,
  customerProgramEntry,
  entry,
  handleAllocate,
  program,
}: {
  allocateCount: string;
  customerProgramEntry: CustomerProgramEntry;
  entry: ShipperProgramEntry;
  handleAllocate: (
    shipperProgramEntry: ShipperProgramEntry,
    updatedCount: string,
  ) => void;
  program: ShipperProgram;
}) => {
  const programDate = entry && new Date(entry.programDate.replace(/-/g, '/'));

  const currentAllocatedCount = `${
    getCustomerAllocatedPalletCount(entry, customerProgramEntry.id) || 0
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

  return (
    <l.Grid
      alignCenter
      gridTemplateColumns={gridTemplateColumns}
      width={th.sizes.fill}
    >
      {[
        `${program?.shipper?.shipperName} (${program?.shipper?.id})`,
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

export interface Props {
  disabled?: boolean;
  shipperProgramEntries: ShipperProgramEntry[];
  entry?: Maybe<CustomerProgramEntry>;
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
}

const getInitialAllocateState = (
  entry: Maybe<CustomerProgramEntry> | undefined,
  shipperProgramEntries: ShipperProgramEntry[],
) =>
  entry
    ? shipperProgramEntries
        .filter((e) =>
          pluck(
            'shipperProgramEntryId',
            (entry?.shipperProgramEntryCustomerProgramEntries?.nodes ||
              []) as ShipperProgramEntryCustomerProgramEntry[],
          ).includes(e.id),
        )
        .reduce((acc, curr) => {
          const allocation = (
            curr.shipperProgramEntryCustomerProgramEntries?.nodes || []
          ).find((a) => a && a.customerProgramEntryId === entry.id);

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

const CustomerProgramAllocateModal = ({
  disabled,
  shipperProgramEntries,
  entry,
  loading,
  trigger,
  weekCount,
  startWeeks,
  endWeeks,
  handleWeekRangeChange,
}: Props) => {
  const previousLoading = usePrevious(loading);
  const previousShipperProgramEntries = usePrevious(shipperProgramEntries);

  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useSearchQueryParam('shipperAllocateSearch');
  const programDate = entry
    ? new Date(entry.programDate.replace(/-/g, '/'))
    : new Date();

  const initialAllocateState = getInitialAllocateState(
    entry,
    shipperProgramEntries,
  );

  const [allocateState, setAllocateState] = useState<{
    [key: number]: { entry: ShipperProgramEntry; allocatedCount: string };
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
        (alloc) => alloc.shipperProgramEntryId === val.entry.id,
      ) || parseInt(val.allocatedCount, 10) > 0,
  );

  const [{ shipperAllocateSearch }] = useProgramsQueryParams();

  const allEntries = [
    ...sortAllocatedShipperProgramEntries(nonZeroStateValues),
    ...sortShipperProgramEntries(
      filterShipperProgramEntries(
        shipperProgramEntries,
        nonZeroStateValues,
        shipperAllocateSearch,
        startWeeks,
        endWeeks,
        entry,
      ),
    ),
  ];

  const { addedAllocations, removedAllocations, updatedAllocations } = values(
    allocateState,
  ).reduce(
    (acc, val) => {
      const existingAllocation = existingAllocations.find(
        (alloc) => alloc.shipperProgramEntryId === val.entry.id,
      );

      return {
        addedAllocations: !!existingAllocation
          ? acc.addedAllocations
          : [
              ...acc.addedAllocations,
              {
                customerProgramEntryId: entry?.id,
                shipperProgramEntryId: val.entry.id,
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

  const isDirty = !equals(
    initialAllocateState,
    nonZeroStateValues.reduce(
      (acc, { allocatedCount, entry }) => ({
        ...acc,
        [entry.id]: { entry, allocatedCount },
      }),
      {},
    ),
  );

  const [handleUpsertAllocations, { loading: upsertLoading }] =
    api.useBulkUpsertAllocations(weekCount);
  const [handleDeleteAllocations, { loading: deleteLoading }] =
    api.useBulkDeleteAllocations(weekCount);
  const updateLoading = upsertLoading || deleteLoading;

  const handleSave = () => {
    if (entry) {
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

  const handleAllocate = (
    shipperProgramEntry: ShipperProgramEntry,
    allocatedCount: string,
  ) => {
    setAllocateState({
      ...allocateState,
      [shipperProgramEntry.id]: { entry: shipperProgramEntry, allocatedCount },
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

  useEffect(() => {
    if (
      !equals(previousShipperProgramEntries, shipperProgramEntries) ||
      (previousLoading && !loading)
    ) {
      setAllocateState(initialAllocateState);
    }
  }, [
    entry,
    loading,
    previousLoading,
    previousShipperProgramEntries,
    shipperProgramEntries,
    initialAllocateState,
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
            height={300}
            mt={th.spacing.tn}
            p={th.spacing.sm}
            position="absolute"
            width={panelWidth}
            zIndex={5}
          >
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
              <l.Flex alignCenter>
                <ty.SmallText mx={th.spacing.sm}>Total:</ty.SmallText>
                <ty.CaptionText>{entry?.palletCount || '-'}</ty.CaptionText>
              </l.Flex>
              <l.Flex alignCenter>
                <ty.SmallText ml={th.spacing.xs} mr={th.spacing.sm}>
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
              <l.Flex alignCenter justifyBetween>
                {isDirty ? (
                  <ResetButton
                    cursor="pointer"
                    ml={th.spacing.sm}
                    onClick={() => {
                      setAllocateState(
                        getInitialAllocateState(entry, shipperProgramEntries),
                      );
                    }}
                  >
                    <ResetImg height={th.sizes.xs} width={th.sizes.xs} />
                  </ResetButton>
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
                  const item: ShipperProgramEntry = allEntries[index];
                  const program = item?.shipperProgram as ShipperProgram;
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
                        <ShipperProgramEntryRow
                          allocateCount={
                            allocateState[item.id]?.allocatedCount || '0'
                          }
                          customerProgramEntry={entry as CustomerProgramEntry}
                          entry={item}
                          handleAllocate={handleAllocate}
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

export default CustomerProgramAllocateModal;
