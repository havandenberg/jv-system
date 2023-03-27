import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { pascalCase } from 'change-case';
import { add, startOfISOWeek } from 'date-fns';
import { mapObjIndexed, pick, pluck, sortBy, sum, times, values } from 'ramda';
import { DecodedValueMap, QueryParamConfigMap } from 'use-query-params';

import PlusInCircle from 'assets/images/plus-in-circle';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import { useProgramsQueryParams, useQueryValue } from 'hooks/use-query-params';
import {
  CommonSpecies,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProjectionVesselInfo,
} from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

import ProgramNotes from './notes';
import {
  ProgramProps,
  CustomerProgramUpdate,
  NewShipperProgram,
  NewCustomerProgram,
  ShipperProgramUpdate,
  CustomerProgramEntryUpdate,
  ShipperProgramEntryUpdate,
  ProgramTotal,
} from './types';
import { getAllocatedPalletEntryTotalSets, getProgramTotals } from './utils';

export const ProgramWrapper = styled(l.Grid)(
  {
    alignItems: 'center',
    height: 24,
    zIndex: 2,
  },
  divPropsSet,
);

export const NewProgramRow = ({
  handleNewProgram,
  id,
  isCustomers,
}: {
  handleNewProgram: (
    newProgram: NewCustomerProgram | NewShipperProgram,
  ) => void;
  hasPrograms: boolean;
  id: string;
  isCustomers: boolean;
}) => {
  const [arrivalPort] = useQueryValue('coast');

  const newProgram = {
    id: -1,
    commonSpeciesId: '',
    commonVarietyId: '',
    commonSizeId: '',
    commonPackTypeId: '',
    plu: '',
    customerId: isCustomers ? id : undefined,
    shipperId: isCustomers ? undefined : id,
    arrivalPort,
  };

  return (
    <ProgramWrapper height={th.sizes.fill}>
      <l.Flex
        alignCenter
        border={th.borders.transparent}
        marginLeft={52}
        relative
      >
        <l.HoverButton
          onClick={() => {
            handleNewProgram(newProgram);
          }}
          position="absolute"
          left={-23}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      </l.Flex>
    </ProgramWrapper>
  );
};

export const getProgramDetailRows = <
  T extends CustomerProgram | ShipperProgram,
>({
  editing,
  gridTemplateColumns,
  isCustomers,
  program,
  setProgramsQueryParams,
  showAllocated,
  startDate,
  weekCount,
  vesselInfos,
}: {
  editing: boolean;
  gridTemplateColumns: string;
  isCustomers: boolean;
  program: T;
  setProgramsQueryParams: (
    newQuery: Partial<DecodedValueMap<QueryParamConfigMap>>,
  ) => void;
  showAllocated: boolean;
  startDate: string;
  vesselInfos: ShipperProjectionVesselInfo[];
  weekCount: number;
}) => {
  const entries = isCustomers
    ? (((program as CustomerProgram).customerProgramEntries?.nodes ||
        []) as CustomerProgramEntry[])
    : (((program as ShipperProgram).shipperProgramEntries?.nodes ||
        []) as ShipperProgramEntry[] as (
        | CustomerProgramEntry
        | ShipperProgramEntry
      )[]);

  const allocatedPalletTotalSets = getAllocatedPalletEntryTotalSets(
    entries,
    startDate,
    weekCount,
    isCustomers,
  );

  const projectedTotals = pluck(
    'projected',
    getProgramTotals(
      entries,
      startDate || '',
      weekCount,
      (entry, key) => ({ value: entry[key], dirty: false }),
      vesselInfos,
    ),
  );
  const hasProjections = sum(projectedTotals.map((val) => val || 0)) > 0;

  return [
    ...(!editing && showAllocated
      ? values(
          mapObjIndexed((item, id) => {
            const { name, totals } = item;
            const index = Object.keys(allocatedPalletTotalSets).indexOf(id);
            const isFirst = index === 0;
            const isLast =
              index === Object.keys(allocatedPalletTotalSets).length - 1;
            return (
              <ProgramWrapper
                gridTemplateColumns={gridTemplateColumns}
                key={id}
                mb={isLast && !hasProjections ? th.spacing.md : th.spacing.tn}
                mt={isFirst ? th.spacing.xs : th.spacing.tn}
              >
                <l.Flex alignCenter justifyBetween>
                  {isFirst && program.notes ? (
                    <ty.SmallText
                      ml={26}
                      nowrap
                      overflow="hidden"
                      textOverflow="ellipsis"
                      title={program.notes}
                    >
                      {program.notes}
                    </ty.SmallText>
                  ) : (
                    <div />
                  )}
                  <l.Flex>
                    <l.HoverButton
                      dark
                      onClick={
                        isLast
                          ? undefined
                          : () => {
                              setProgramsQueryParams({
                                programsView: isCustomers
                                  ? 'shippers'
                                  : 'customers',
                                [isCustomers ? 'shipperId' : 'customerId']: id,
                              });
                            }
                      }
                    >
                      <ty.SmallText
                        fontSize={th.fontSizes.small}
                        textAlign="right"
                      >
                        {isLast ? 'Unalloc' : name}:
                      </ty.SmallText>
                    </l.HoverButton>
                    <ty.CaptionText
                      bold
                      color={
                        isLast
                          ? totals[0] === 0
                            ? th.colors.status.success
                            : th.colors.status.error
                          : th.colors.text.default
                      }
                      ml={th.spacing.lg}
                      mr={th.spacing.md}
                      textAlign="right"
                      width={th.spacing.lg}
                    >
                      {totals[0] !== null && totals[0] !== undefined
                        ? totals[0]
                        : ''}
                    </ty.CaptionText>
                  </l.Flex>
                </l.Flex>
                {(totals as number[]).slice(1).map((total, idx) => (
                  <ty.CaptionText
                    color={
                      isLast
                        ? total === 0
                          ? th.colors.status.success
                          : th.colors.status.error
                        : th.colors.text.default
                    }
                    key={idx}
                    mr={th.spacing.md}
                    textAlign="center"
                  >
                    {total !== null && total !== undefined ? total : ''}
                  </ty.CaptionText>
                ))}
              </ProgramWrapper>
            );
          }, allocatedPalletTotalSets),
        )
      : []),
    ...(!editing && !isCustomers && hasProjections
      ? [
          <ProgramWrapper
            gridTemplateColumns={gridTemplateColumns}
            mt={th.spacing.tn}
            mb={th.spacing.md}
            relative
          >
            <l.Flex alignCenter justifyEnd ml={52}>
              <ty.SmallText secondary textAlign="right">
                Projected:
              </ty.SmallText>
              <ty.CaptionText
                bold
                color={th.colors.status.warningSecondary}
                ml={th.spacing.lg}
                mr={th.spacing.md}
                textAlign="right"
                width={th.spacing.lg}
              >
                {sum(
                  projectedTotals.map((val) =>
                    val === null || val < 0 ? 0 : val,
                  ),
                )}
              </ty.CaptionText>
            </l.Flex>
            {projectedTotals.map((total, idx) => (
              <ty.CaptionText
                color={th.colors.status.warningSecondary}
                key={idx}
                mr={th.spacing.md}
                textAlign="center"
              >
                {total !== null && total !== undefined ? total : ''}
              </ty.CaptionText>
            ))}
          </ProgramWrapper>,
        ]
      : []),
  ];
};

export const getProgramTotalRows = ({
  editing,
  gridTemplateColumns,
  isCustomers,
  programTotals,
  showAllocated,
  species,
}: {
  editing: boolean;
  gridTemplateColumns: string;
  isCustomers: boolean;
  programTotals: ProgramTotal[];
  showAllocated: boolean;
  species: string;
}) => {
  const totals = pluck('total', programTotals || []);
  const availableTotals = pluck('available', programTotals || []);
  const projectedTotals = pluck('projected', programTotals || []);
  const hasProjections = sum(projectedTotals.map((val) => val || 0)) > 0;

  const isGrand =
    species === 'Net Grand' ||
    species === 'Customers Grand' ||
    species === 'Shippers Grand';
  const isNetGrand = species === 'Net Grand';

  const textColor = isNetGrand
    ? sum(totals) >= 0
      ? th.colors.status.success
      : th.colors.status.error
    : undefined;

  const components = [
    () => (
      <ProgramWrapper gridTemplateColumns={gridTemplateColumns} relative>
        <l.Flex alignCenter justifyEnd ml={52}>
          <ty.CaptionText textAlign="right">
            {isGrand ? `${species} ` : ''}Total:
          </ty.CaptionText>
          <ty.CaptionText
            bold
            color={textColor}
            ml={th.spacing.lg}
            mr={th.spacing.md}
            textAlign="right"
            width={th.spacing.lg}
          >
            {sum(totals)}
          </ty.CaptionText>
        </l.Flex>
        {totals.map((total, idx) => (
          <l.Flex alignCenter justifyCenter key={idx}>
            <ty.CaptionText center color={textColor} mr={th.spacing.md}>
              {total === 0 ? '' : total}
            </ty.CaptionText>
          </l.Flex>
        ))}
      </ProgramWrapper>
    ),
  ];

  if (!editing && showAllocated && !isNetGrand) {
    components.push(() => (
      <ProgramWrapper
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.md}
        relative
      >
        <l.Flex alignCenter justifyEnd ml={52}>
          <ty.CaptionText secondary textAlign="right">
            Unalloc:
          </ty.CaptionText>
          <ty.CaptionText
            bold
            color={
              sum(
                availableTotals.map((val) =>
                  val === null || val < 0 ? 0 : val,
                ),
              ) === 0
                ? th.colors.status.success
                : th.colors.status.error
            }
            ml={th.spacing.lg}
            mr={th.spacing.md}
            textAlign="right"
            width={th.spacing.lg}
          >
            {sum(
              availableTotals.map((val) => (val === null || val < 0 ? 0 : val)),
            )}
          </ty.CaptionText>
        </l.Flex>
        {availableTotals.map((total, idx) => (
          <ty.CaptionText
            color={
              total === 0 ? th.colors.status.success : th.colors.status.error
            }
            key={idx}
            mr={th.spacing.md}
            textAlign="center"
          >
            {total !== null && total !== undefined && totals[idx] !== 0
              ? total
              : ''}
          </ty.CaptionText>
        ))}
      </ProgramWrapper>
    ));
  }

  if (
    !editing &&
    !isNetGrand &&
    !isCustomers &&
    species !== 'Customers Grand' &&
    hasProjections
  ) {
    components.push(() => (
      <ProgramWrapper
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.md}
        relative
      >
        <l.Flex alignCenter justifyEnd ml={52}>
          <ty.CaptionText secondary textAlign="right">
            Projected:
          </ty.CaptionText>
          <ty.CaptionText
            bold
            color={th.colors.status.warningSecondary}
            ml={th.spacing.lg}
            mr={th.spacing.md}
            textAlign="right"
            width={th.spacing.lg}
          >
            {sum(
              projectedTotals.map((val) => (val === null || val < 0 ? 0 : val)),
            )}
          </ty.CaptionText>
        </l.Flex>
        {projectedTotals.map((total, idx) => (
          <ty.CaptionText
            color={th.colors.status.warningSecondary}
            key={idx}
            mr={th.spacing.md}
            textAlign="center"
          >
            {total !== null && total !== undefined ? total : ''}
          </ty.CaptionText>
        ))}
      </ProgramWrapper>
    ));
  }

  return components;
};

const Cell = styled(l.Flex)(
  ({
    active,
    disabled,
    error,
    highlight,
    onClick,
    warning,
  }: {
    active?: boolean;
    disabled?: boolean;
    error?: boolean;
    highlight?: boolean;
    onClick?: () => void;
    warning?: boolean;
  }) => ({
    alignItems: 'center',
    background: highlight
      ? hexColorWithTransparency(th.colors.background, 0.8)
      : th.colors.background,
    border: warning
      ? th.borders.warning
      : error
      ? th.borders.error
      : active
      ? th.borders.primaryAccent
      : th.borders.disabled,
    height: 20,
    cursor: onClick ? 'pointer' : 'default',
    opacity: disabled ? th.opacities.disabled : 1,
    padding: `0 ${th.spacing.tn}`,
    position: 'relative',
    transition: th.transitions.default,
    ':hover': {
      border: onClick
        ? error
          ? th.borders.error
          : warning
          ? th.borders.warning
          : th.borders.primaryAccent
        : undefined,
    },
  }),
);

const ProgramRow = <
  T extends CustomerProgram | ShipperProgram,
  K extends CustomerProgramUpdate | ShipperProgramUpdate,
>(
  props: {
    commonSpecieses: CommonSpecies[];
    gridTemplateColumns: string;
    index: number;
    isCustomers: boolean;
    portalTop?: number;
    previousProgram?: T;
    program: T;
    showSpecies: boolean;
    showVariety: boolean;
  } & Omit<ProgramProps, 'customerPrograms' | 'shipperPrograms'>,
) => {
  const {
    allocatedStartDate,
    allocatedEndDate,
    commonSpecieses,
    customers,
    changeHandlers: {
      handleCustomerProgramChange,
      handleCustomerProgramEntryChange,
      handleShipperProgramChange,
      handleShipperProgramEntryChange,
    },
    handleRemoveItem,
    newItemHandlers: {
      handleNewCustomerProgram,
      handleNewCustomerProgramEntry,
      handleNewShipperProgram,
      handleNewShipperProgramEntry,
    },
    valueGetters: {
      getCustomerProgramEntryValue,
      getCustomerProgramValue,
      getShipperProgramEntryValue,
      getShipperProgramValue,
    },
    editing,
    error,
    duplicateProgramIds,
    gridTemplateColumns,
    isCustomers,
    loading,
    portalTop = 0,
    program,
    setAllocateState,
    showSpecies,
    showVariety,
    weekCount,
  } = props;
  const { id } = program;

  const [startDate] = useQueryValue('startDate');

  const [
    {
      commonSpeciesId: commonSpeciesIdQuery,
      commonVarietyId: commonVarietyIdQuery,
      commonSizeId: commonSizeIdQuery,
      commonPackTypeId: commonPackTypeIdQuery,
      plu: pluQuery,
      customerIdFilter: customerIdQuery,
    },
  ] = useProgramsQueryParams();

  const isDuplicate = duplicateProgramIds.includes(parseInt(id, 10));

  const getProgramValue = (
    isCustomers ? getCustomerProgramValue : getShipperProgramValue
  ) as (
    program: Maybe<T> | undefined,
    key: keyof K,
  ) => { dirty: boolean; value: string };

  const getProgramEntryValue = (
    isCustomers ? getCustomerProgramEntryValue : getShipperProgramEntryValue
  ) as <
    L extends CustomerProgramEntry | ShipperProgramEntry,
    M extends CustomerProgramEntryUpdate | ShipperProgramEntryUpdate,
  >(
    entry: Maybe<L> | undefined,
    key: keyof M,
  ) => { dirty: boolean; value: string };

  const updatedProgram = {
    id: program.id,
    arrivalPort: program.arrivalPort,
    customerId: isCustomers
      ? program.customerId
      : getProgramValue(program, 'customerId').value,
    shipperId: isCustomers ? undefined : (program as ShipperProgram).shipperId,
    plu: getProgramValue(program, 'plu').value,
    commonSpeciesId: getProgramValue(program, 'commonSpeciesId').value,
    commonVarietyId: getProgramValue(program, 'commonVarietyId').value,
    commonSizeId: getProgramValue(program, 'commonSizeId').value,
    commonPackTypeId: getProgramValue(program, 'commonPackTypeId').value,
    customerProgramEntries: {
      edges: [],
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
      totalCount: 0,
    },
  };
  const {
    plu,
    commonSpeciesId,
    commonVarietyId,
    commonSizeId,
    commonPackTypeId,
    customerId,
  } = updatedProgram;

  const commonSpecies = commonSpecieses.find((sp) => sp.id === commonSpeciesId);
  const commonVariety = commonSpecies?.commonVarieties.nodes.find(
    (v) => v && v.id === commonVarietyId,
  );
  const commonSize = commonSpecies?.commonSizes.nodes.find(
    (sz) => sz && sz.id === commonSizeId,
  );
  const commonPackType = commonSpecies?.commonPackTypes.nodes.find(
    (pt) => pt && pt.id === commonPackTypeId,
  );
  const customer = customers.find((c) => c && c.id === customerId);

  const handleProgramChange = isCustomers
    ? handleCustomerProgramChange
    : handleShipperProgramChange;

  const handleChange = (key: keyof T, value: string | null) => {
    handleProgramChange({
      ...updatedProgram,
      [key]: value,
    });
  };

  const handleNewProgram = isCustomers
    ? handleNewCustomerProgram
    : handleNewShipperProgram;

  const handleProgramEntryChange = isCustomers
    ? handleCustomerProgramEntryChange
    : handleShipperProgramEntryChange;

  const handleNewProgramEntry = isCustomers
    ? handleNewCustomerProgramEntry
    : handleNewShipperProgramEntry;

  const commonSelectorProps = {
    closeOnSelect: true,
    error,
    height: 150,
    loading,
    panelGap: 0,
    width: 250,
  };

  const getSelectorValue = (
    type: 'species' | 'variety' | 'size' | 'packType' | 'customer',
  ) => {
    switch (type) {
      case 'species':
        return (
          commonSpecies?.speciesName || updatedProgram.commonSpeciesId || ''
        );
      case 'variety':
        return (
          commonVariety?.varietyName || updatedProgram.commonVarietyId || ''
        );
      case 'size':
        return commonSize?.sizeName || updatedProgram.commonSizeId || '';
      case 'packType':
        return (
          commonPackType?.packTypeName || updatedProgram.commonPackTypeId || ''
        );
      case 'customer':
        return customer?.customerName || updatedProgram.customerId || '';
      default:
        return '';
    }
  };

  const getSelectorProduct = (
    type: 'species' | 'variety' | 'size' | 'packType' | 'customer',
  ) => {
    switch (type) {
      case 'species':
        return commonSpecies;
      case 'variety':
        return commonVariety;
      case 'size':
        return commonSize;
      case 'packType':
        return commonPackType;
      case 'customer':
        return customer;
      default:
        return '';
    }
  };

  const isValueDirty = (
    type: 'species' | 'variety' | 'size' | 'packType' | 'customer',
  ) => {
    switch (type) {
      case 'species':
        return commonSpeciesId !== program.commonSpeciesId;
      case 'variety':
        return commonVarietyId !== program.commonVarietyId;
      case 'size':
        return commonSizeId !== program.commonSizeId;
      case 'packType':
        return commonPackTypeId !== program.commonPackTypeId;
      case 'customer':
        return customerId !== program.customerId;
      default:
        return true;
    }
  };

  const getLinkSelectorProps = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    const value = getSelectorValue(type);
    const isDirty = isValueDirty(type);

    const allItems = () =>
      sortBy(
        (p) => p.text,
        commonSpecieses
          .map((s) => {
            const speciesIsValid = s.id === commonSpeciesId;
            switch (type) {
              case 'variety':
                return (
                  speciesIsValid &&
                  s.commonVarieties.nodes.map(
                    (v) =>
                      v && {
                        color: v.uiColor,
                        id: v.id,
                        text: v.varietyName || '',
                      },
                  )
                );
              case 'size':
                return (
                  speciesIsValid &&
                  s.commonSizes.nodes.map(
                    (sz) =>
                      sz && {
                        id: sz.id,
                        text: sz.sizeName || '',
                      },
                  )
                );
              case 'packType':
                return (
                  speciesIsValid &&
                  s.commonPackTypes.nodes.map(
                    (pt) =>
                      pt && {
                        id: pt.id,
                        text: pt.packTypeName || '',
                      },
                  )
                );
              default:
                return {
                  color: s.uiColor,
                  id: s.id,
                  text: s.speciesName || '',
                };
            }
          })
          .flat()
          .filter(
            (link) =>
              !!link &&
              (link.id === '-1' ||
                `${link.id} ${link.text}`
                  .toLowerCase()
                  .includes(getSelectorValue(type).toLowerCase())),
          ) as ItemLink[],
      );

    const commonProductKey = `common${pascalCase(type)}Id` as keyof (
      | CustomerProgramUpdate
      | ShipperProgramUpdate
    );

    const commonProductId = updatedProgram[commonProductKey];

    const getItemContent = (link: ItemLink) => (
      <ItemLinkRow active={link.id === commonProductId} link={link} />
    );

    const selectItem = ({ id }: ItemLink) => {
      handleChange(commonProductKey, id === '-1' ? null : id);
    };

    return {
      ...commonSelectorProps,
      allItems,
      editableCellProps: {
        bypassLocalValue: true,
        content: { dirty: isDirty, value },
        defaultChildren: null,
        editing,
        error:
          editing &&
          (isDuplicate || !!(commonProductId && !getSelectorProduct(type))),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(commonProductKey, e.target.value);
        },
        warning: false,
      },
      getItemContent,
      nameKey: 'text' as keyof ItemLink,
      selectItem,
    };
  };

  const speciesLinkSelectorProps = getLinkSelectorProps('species');
  const varietyLinkSelectorProps = getLinkSelectorProps('variety');
  const sizeLinkSelectorProps = getLinkSelectorProps('size');
  const packTypeLinkSelectorProps = getLinkSelectorProps('packType');

  const customerLinkItems = customers.map((c) => ({
    id: c.id,
    text: c.customerName,
  }));

  const customerLinkSelectorProps = {
    ...commonSelectorProps,
    allItems: () =>
      customerLinkItems.filter(
        (c) =>
          c.id === '-1' ||
          `${c.id} ${c.text}`
            .toLowerCase()
            .includes(getSelectorValue('customer').toLowerCase()),
      ),
    editableCellProps: {
      bypassLocalValue: true,
      content: {
        dirty: isValueDirty('customer'),
        value: getSelectorValue('customer'),
      },
      defaultChildren: null,
      editing,
      error:
        editing &&
        (isDuplicate ||
          !!(getSelectorValue('customer') && !getSelectorProduct('customer'))),
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        handleChange('customerId', e.target.value);
      },
      warning: false,
    },
    getItemContent: (link: ItemLink) => (
      <ItemLinkRow
        active={link.id === customerId}
        link={{
          ...link,
          text: link.id === '-1' ? link.text : `${link.id} - ${link.text}`,
        }}
      />
    ),
    nameKey: 'text' as keyof ItemLink,
    selectItem: ({ id }: ItemLink) => {
      handleChange('customerId', id === '-1' ? null : id);
    },
    width: 350,
  };

  const { ItemSelector: SpeciesSelector } = useItemSelector({
    errorLabel: 'species',
    ...speciesLinkSelectorProps,
    portalId: 'programs-portal',
    portalTop,
    portalLeft: 52,
  });

  const { ItemSelector: VarietySelector } = useItemSelector({
    errorLabel: 'varieties',
    ...varietyLinkSelectorProps,
    portalId: 'programs-portal',
    portalTop,
    portalLeft: 160,
  });

  const { ItemSelector: SizeSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...sizeLinkSelectorProps,
    portalId: 'programs-portal',
    portalTop,
    portalLeft: 268,
  });

  const { ItemSelector: PackTypeSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...packTypeLinkSelectorProps,
    portalId: 'programs-portal',
    portalTop,
    portalLeft: 343,
  });

  const { ItemSelector: CustomerSelector } = useItemSelector({
    errorLabel: 'customers',
    ...customerLinkSelectorProps,
    portalId: 'programs-portal',
    portalTop,
    portalLeft: 498,
  });

  const entries = isCustomers
    ? (((program as CustomerProgram).customerProgramEntries?.nodes ||
        []) as CustomerProgramEntry[])
    : (((program as ShipperProgram).shipperProgramEntries?.nodes ||
        []) as ShipperProgramEntry[] as (
        | CustomerProgramEntry
        | ShipperProgramEntry
      )[]);

  return (
    <ProgramWrapper gridTemplateColumns={gridTemplateColumns}>
      <l.Grid
        alignCenter
        key={program.id}
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns={`repeat(2, 1fr) repeat(3, 0.7fr)${
          isCustomers ? '' : ' 1fr'
        }`}
        ml={52}
        relative
      >
        {editing && (
          <>
            <BasicModal
              title="Confirm Remove Product"
              content={
                <ty.BodyText mb={th.spacing.md}>
                  Are you sure you want to remove this product? This action
                  cannot be undone.
                </ty.BodyText>
              }
              handleConfirm={() => {
                handleRemoveItem(
                  isCustomers ? 'customerPrograms' : 'shipperPrograms',
                  id,
                );
              }}
              shouldConfirm={program.id >= 0}
              triggerProps={{
                position: 'absolute',
                left: -45,
              }}
              triggerType="remove-icon"
            />
            <l.HoverButton
              onClick={() => {
                handleNewProgram(updatedProgram);
              }}
              position="absolute"
              left={-22}
            >
              <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
            </l.HoverButton>
          </>
        )}
        {!editing && (
          <l.Div
            cursor="pointer"
            position="absolute"
            left={-32}
            top={th.spacing.xs}
          >
            <ProgramNotes
              allocatedStartDate={allocatedStartDate}
              allocatedEndDate={allocatedEndDate}
              isCustomers={isCustomers}
              portalTop={portalTop}
              program={program}
              weekCount={weekCount}
            />
          </l.Div>
        )}
        {editing ? (
          SpeciesSelector
        ) : showSpecies ? (
          <Cell
            {...pick(
              ['error', 'warning'],
              speciesLinkSelectorProps.editableCellProps,
            )}
            warning={!!commonSpeciesIdQuery}
            width={95}
          >
            <ty.CaptionText
              bold
              ellipsis
              title={program.commonSpecies?.speciesName}
            >
              {program.commonSpecies?.speciesName}
            </ty.CaptionText>
          </Cell>
        ) : (
          <div />
        )}
        {commonSpecies && (
          <>
            {editing ? (
              VarietySelector
            ) : showVariety ? (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  varietyLinkSelectorProps.editableCellProps,
                )}
                warning={!!commonVarietyIdQuery}
                width={95}
              >
                <ty.CaptionText
                  ellipsis
                  title={program.commonVariety?.varietyName}
                >
                  {program.commonVariety?.varietyName}
                </ty.CaptionText>
              </Cell>
            ) : (
              <div />
            )}
            {editing ? (
              SizeSelector
            ) : (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  sizeLinkSelectorProps.editableCellProps,
                )}
                warning={!!commonSizeIdQuery}
                width={64}
              >
                <ty.CaptionText ellipsis title={program.commonSize?.sizeName}>
                  {program.commonSize?.sizeName}
                </ty.CaptionText>
              </Cell>
            )}
            {editing ? (
              PackTypeSelector
            ) : (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  packTypeLinkSelectorProps.editableCellProps,
                )}
                warning={!!commonPackTypeIdQuery}
                width={64}
              >
                <ty.CaptionText
                  ellipsis
                  title={program.commonPackType?.packTypeName}
                >
                  {program.commonPackType?.packTypeName}
                </ty.CaptionText>
              </Cell>
            )}
            <EditableCell
              content={{ dirty: plu !== program.plu, value: plu || '' }}
              defaultChildren={
                <Cell warning={!!pluQuery} width={64}>
                  <ty.CaptionText>{plu}</ty.CaptionText>
                </Cell>
              }
              editing={!!editing}
              error={isDuplicate}
              onChange={(e) => {
                handleChange('plu', e.target.value);
              }}
              showBorder={false}
            />
            {isCustomers ? null : editing ? (
              CustomerSelector
            ) : (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  customerLinkSelectorProps.editableCellProps,
                )}
                warning={!!customerIdQuery}
                width={95}
              >
                <ty.CaptionText
                  ellipsis
                  title={
                    program.customer
                      ? `${program.customer?.id} - ${program.customer?.customerName}`
                      : ''
                  }
                >
                  {program.customer ? program.customer?.customerName : ''}
                </ty.CaptionText>
              </Cell>
            )}
          </>
        )}
      </l.Grid>
      {times((index) => {
        const weekStartDate = startOfISOWeek(
          add(new Date(startDate ? startDate.replace(/-/g, '/') : new Date()), {
            weeks: index,
          }),
        );
        const entry = entries.find(
          (entry) =>
            entry &&
            startOfISOWeek(
              new Date(entry.programDate.replace(/-/g, '/')),
            ).toLocaleString() === weekStartDate.toLocaleString(),
        );

        const palletCountCurrentValue = getProgramEntryValue(
          entry,
          'palletCount',
        ).value;
        const palletCountInputValue =
          !!palletCountCurrentValue && palletCountCurrentValue !== '0'
            ? palletCountCurrentValue
            : '';
        const palletCountValue = !!entry?.palletCount
          ? parseInt(entry?.palletCount, 10)
          : 0;
        const isEntryDirty =
          getProgramEntryValue(entry, 'palletCount').value !==
          entry?.palletCount;

        const isAdWeek = isCustomers
          ? !!(entry as CustomerProgramEntry)?.isAdWeek
          : false;
        const hasNotes = isCustomers
          ? !!(entry as CustomerProgramEntry)?.notes
          : false;

        return editing ? (
          <l.Flex
            alignCenter
            height={`calc(${th.sizes.fill} - 6px)`}
            justifyCenter
            key={index}
            mx={th.spacing.tn}
          >
            <EditableCell
              content={{
                dirty: entry?.id < 0 || isEntryDirty,
                value: palletCountInputValue,
              }}
              defaultChildren={null}
              editing={true}
              highlight={isAdWeek || hasNotes}
              highlightColor={
                isAdWeek
                  ? hexColorWithTransparency(
                      th.colors.status.error,
                      th.opacities.disabled,
                    )
                  : hexColorWithTransparency(
                      th.colors.status.warning,
                      th.opacities.disabled,
                    )
              }
              inputProps={{
                min: 0,
                textAlign: 'center',
                type: 'number',
              }}
              onChange={(e) => {
                entry
                  ? handleProgramEntryChange({
                      ...entry,
                      palletCount: e.target.value,
                    })
                  : handleNewProgramEntry({
                      id: 0,
                      notes: '',
                      palletCount: e.target.value,
                      programDate: formatDate(weekStartDate),
                      customerProgramId: isCustomers ? program.id : undefined,
                      customerProgram: isCustomers
                        ? (program as CustomerProgram)
                        : undefined,
                      shipperProgramId: isCustomers ? undefined : program.id,
                      shipperProgram: isCustomers
                        ? undefined
                        : (program as ShipperProgram),
                    });
              }}
            />
          </l.Flex>
        ) : (
          <l.Div
            background={
              isAdWeek
                ? hexColorWithTransparency(
                    th.colors.status.error,
                    th.opacities.secondary,
                  )
                : hasNotes
                ? hexColorWithTransparency(
                    th.colors.status.warning,
                    th.opacities.secondary,
                  )
                : undefined
            }
            key={index}
          >
            <Cell
              alignCenter
              disabled={!palletCountValue}
              onClick={
                !editing && palletCountValue
                  ? () => {
                      entry &&
                        setAllocateState({ entry, program, isOpen: true });
                    }
                  : undefined
              }
              height={`calc(${th.sizes.fill} - 6px)`}
              highlight={isAdWeek || hasNotes}
              justifyCenter
              mx={th.spacing.tn}
            >
              <ty.CaptionText center mr={th.spacing.md}>
                {palletCountValue || '-'}
              </ty.CaptionText>
            </Cell>
          </l.Div>
        );
      }, weekCount)}
    </ProgramWrapper>
  );
};

export default ProgramRow;
