import React, { ChangeEvent } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pascalCase } from 'change-case';
import { equals, pick, sortBy, sum, times } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import { useProgramsQueryParams, useQueryValue } from 'hooks/use-query-params';
import { CommonSpecies, CustomerProgram } from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getDateOfISOWeek, getWeekNumber } from 'utils/date';

import { ProgramProps, CustomerProgramUpdate } from '../types';

const ProgramWrapper = styled(l.Grid)(
  {
    alignItems: 'center',
    height: 24,
    zIndex: 2,
  },
  divPropsSet,
);

export const NewProgramRow = ({
  newItemHandlers: { handleNewCustomerProgram },
  hasPrograms,
}: ProgramProps & { hasPrograms: boolean }) => {
  const [arrivalPort] = useQueryValue('coast');
  const [customerId] = useQueryValue('customerId');

  const newProgram = {
    id: -1,
    commonSpeciesId: '',
    commonVarietyId: '',
    commonSizeId: '',
    commonPackTypeId: '',
    plu: '',
    customerId,
    arrivalPort,
  };

  return (
    <ProgramWrapper mt={hasPrograms ? th.spacing.xs : th.spacing.md}>
      <l.Flex
        border={th.borders.transparent}
        alignCenter
        marginLeft={52}
        relative
      >
        <l.HoverButton
          onClick={() => {
            handleNewCustomerProgram(newProgram);
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

export const ProgramTotalRow = ({
  gridTemplateColumns,
  programTotals,
  species,
}: {
  gridTemplateColumns: string;
  programTotals: number[];
  species: string;
}) => (
  <ProgramWrapper
    gridTemplateColumns={gridTemplateColumns}
    mt={species === 'Grand' ? `-${th.spacing.sm}` : th.spacing.xs}
    py={th.spacing.md}
    relative
  >
    <l.Flex alignCenter justifyEnd ml={52}>
      <ty.CaptionText textAlign="right">
        {species === 'Grand' ? 'Grand ' : ''}Total:
      </ty.CaptionText>
      <ty.CaptionText
        bold
        ml={th.spacing.lg}
        mr={th.spacing.md}
        width={th.spacing.lg}
      >
        ({sum(programTotals)})
      </ty.CaptionText>
    </l.Flex>
    {programTotals.map((total, idx) => (
      <l.Flex alignCenter justifyCenter key={idx}>
        <ty.CaptionText center mr={th.spacing.md}>
          {total <= 0 ? '' : total}
        </ty.CaptionText>
      </l.Flex>
    ))}
  </ProgramWrapper>
);

const Cell = styled(l.Flex)(
  ({
    error,
    isEvenRow,
    onClick,
    warning,
  }: {
    error: boolean;
    isEvenRow: boolean;
    onClick?: () => void;
    warning: boolean;
  }) => ({
    alignItems: 'center',
    background: isEvenRow
      ? th.colors.background
      : th.colors.brand.containerBackground,
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : th.borders.disabled,
    height: 20,
    cursor: onClick ? 'pointer' : 'default',
    padding: `0 ${th.spacing.tn}`,
    position: 'relative',
    transition: th.transitions.default,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm} - 2px)`,
    ':hover': {
      border: error
        ? th.borders.error
        : warning
        ? th.borders.warning
        : th.borders.primaryAccent,
    },
  }),
);

const ProgramRow = (
  props: {
    error?: ApolloError;
    loading: boolean;
    commonSpecieses: CommonSpecies[];
    duplicateProgramIds: number[];
    gridTemplateColumns: string;
    index: number;
    isEvenRow: boolean;
    previousProgram?: CustomerProgram;
    program: CustomerProgram;
    showSpecies: boolean;
    showVariety: boolean;
  } & ProgramProps,
) => {
  const {
    commonSpecieses,
    changeHandlers: {
      handleCustomerProgramChange,
      handleCustomerProgramEntryChange,
    },
    handleRemoveItem,
    newItemHandlers: {
      handleNewCustomerProgram,
      handleNewCustomerProgramEntry,
    },
    valueGetters: { getCustomerProgramEntryValue, getCustomerProgramValue },
    editing,
    error,
    duplicateProgramIds,
    gridTemplateColumns,
    isEvenRow,
    loading,
    previousProgram,
    program,
    selectedWeekNumber,
    showSpecies,
    showVariety,
    weekCount,
  } = props;
  const { id } = program;

  const [, setProgramsQueryParams] = useProgramsQueryParams();

  const isDuplicate = duplicateProgramIds.includes(parseInt(id, 10));

  const updatedProgram = {
    id: program.id,
    arrivalPort: program.arrivalPort,
    customerId: program.customerId,
    plu: getCustomerProgramValue(program, 'plu').value,
    commonSpeciesId: getCustomerProgramValue(program, 'commonSpeciesId').value,
    commonVarietyId: getCustomerProgramValue(program, 'commonVarietyId').value,
    commonSizeId: getCustomerProgramValue(program, 'commonSizeId').value,
    commonPackTypeId: getCustomerProgramValue(program, 'commonPackTypeId')
      .value,
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

  const handleChange = (key: keyof CustomerProgram, value: string | null) => {
    handleCustomerProgramChange({
      ...updatedProgram,
      [key]: value,
    });
  };

  const commonSelectorProps = {
    closeOnSelect: true,
    error,
    height: 150,
    loading,
    panelGap: 0,
    width: 250,
  };

  const getSelectorValue = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    switch (type) {
      case 'species':
        return commonSpecies?.speciesName || '';
      case 'variety':
        return commonVariety?.varietyName || '';
      case 'size':
        return commonSize?.sizeName || '';
      case 'packType':
        return commonPackType?.packTypeName || '';
      default:
        return '';
    }
  };

  const isValueDirty = (type: 'species' | 'variety' | 'size' | 'packType') => {
    switch (type) {
      case 'species':
        return commonSpeciesId !== program.commonSpeciesId;
      case 'variety':
        return commonVarietyId !== program.commonVarietyId;
      case 'size':
        return commonSizeId !== program.commonSizeId;
      case 'packType':
        return commonPackTypeId !== program.commonPackTypeId;
      default:
        return true;
    }
  };

  const getLinkSelectorProps = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    const value = getSelectorValue(type);
    const isDirty = isValueDirty(type);

    const allItems = sortBy(
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
        .filter((link) => !!link) as ItemLink[],
    );

    const commonProductId =
      updatedProgram[
        `common${pascalCase(type)}Id` as keyof CustomerProgramUpdate
      ];

    const getItemContent = (link: ItemLink) => (
      <ItemLinkRow active={link.id === commonProductId} link={link} />
    );

    const selectItem = ({ id }: ItemLink) => {
      handleChange(
        `common${pascalCase(type)}Id` as keyof CustomerProgramUpdate,
        id === '-1' ? null : id,
      );
    };

    return {
      ...commonSelectorProps,
      allItems,
      editableCellProps: {
        content: { dirty: isDirty, value },
        defaultChildren: null,
        editing,
        error: !commonProductId || isDuplicate,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(
            `common${pascalCase(type)}Id` as keyof CustomerProgramUpdate,
            e.target.value,
          );
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

  const { ItemSelector: SpeciesSelector } = useItemSelector({
    errorLabel: 'species',
    ...speciesLinkSelectorProps,
  });

  const { ItemSelector: VarietySelector } = useItemSelector({
    errorLabel: 'varieties',
    ...varietyLinkSelectorProps,
  });

  const { ItemSelector: SizeSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...sizeLinkSelectorProps,
  });

  const { ItemSelector: PackTypeSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...packTypeLinkSelectorProps,
  });

  const isDifferentVariety =
    previousProgram &&
    !equals(
      updatedProgram.commonVarietyId,
      getCustomerProgramValue(previousProgram, 'commonVarietyId').value,
    );

  return (
    <ProgramWrapper
      gridTemplateColumns={gridTemplateColumns}
      mt={isDifferentVariety ? th.spacing.md : undefined}
    >
      <l.Grid
        alignCenter
        key={program.id}
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
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
                handleRemoveItem('customerPrograms', id);
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
                handleNewCustomerProgram(updatedProgram);
              }}
              position="absolute"
              left={-22}
            >
              <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
            </l.HoverButton>
          </>
        )}
        {editing ? (
          SpeciesSelector
        ) : showSpecies ? (
          <Cell
            {...pick(
              ['error', 'warning'],
              speciesLinkSelectorProps.editableCellProps,
            )}
            isEvenRow={isEvenRow}
            onClick={
              commonSpeciesId
                ? () => {
                    setProgramsQueryParams({ commonSpeciesId });
                  }
                : undefined
            }
            width={89}
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
                isEvenRow={isEvenRow}
                onClick={
                  commonSpeciesId && commonVarietyId
                    ? () => {
                        setProgramsQueryParams({
                          commonSpeciesId,
                          commonVarietyId,
                        });
                      }
                    : undefined
                }
                width={89}
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
                isEvenRow={isEvenRow}
                onClick={
                  commonSpecies && commonSizeId
                    ? () => {
                        setProgramsQueryParams({
                          commonSpeciesId,
                          commonSizeId,
                        });
                      }
                    : undefined
                }
                width={58}
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
                isEvenRow={isEvenRow}
                onClick={
                  commonSpeciesId && commonPackTypeId
                    ? () => {
                        setProgramsQueryParams({
                          commonSpeciesId,
                          commonPackTypeId,
                        });
                      }
                    : undefined
                }
                width={58}
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
                <Cell
                  error={false}
                  warning={false}
                  isEvenRow={isEvenRow}
                  onClick={
                    commonSpeciesId && plu
                      ? () => {
                          setProgramsQueryParams({
                            commonSpeciesId,
                            plu,
                          });
                        }
                      : undefined
                  }
                  width={58}
                >
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
          </>
        )}
      </l.Grid>
      {times((index) => {
        const entry = program.customerProgramEntries.nodes.find(
          (entry) =>
            entry &&
            getWeekNumber(new Date(entry.programDate.replace(/-/g, '/'))) ===
              selectedWeekNumber + index,
        );

        const palletCountCurrentValue = getCustomerProgramEntryValue(
          entry,
          'palletCount',
        ).value;
        const palletCountInputValue =
          !!palletCountCurrentValue && palletCountCurrentValue !== '0'
            ? palletCountCurrentValue
            : '';
        const palletCountValue = !!entry?.palletCount
          ? parseInt(entry?.palletCount, 10)
          : 0 || '-';
        const isEntryDirty =
          getCustomerProgramEntryValue(entry, 'palletCount').value !==
          entry?.palletCount;

        return (
          <l.Flex
            alignCenter
            bg={
              isEvenRow
                ? th.colors.background
                : th.colors.brand.containerBackground
            }
            height={`calc(${th.sizes.fill} - 6px)`}
            justifyCenter
            key={index}
            mx={th.spacing.tn}
          >
            {editing ? (
              <EditableCell
                content={{
                  dirty: entry?.id < 0 || isEntryDirty,
                  value: palletCountInputValue,
                }}
                defaultChildren={null}
                editing={true}
                inputProps={{
                  min: 0,
                  textAlign: 'center',
                  type: 'number',
                }}
                onChange={(e) => {
                  entry
                    ? handleCustomerProgramEntryChange({
                        ...entry,
                        palletCount: e.target.value,
                      })
                    : handleNewCustomerProgramEntry({
                        id: 0,
                        notes: '',
                        palletCount: e.target.value,
                        programDate: getDateOfISOWeek(
                          selectedWeekNumber + index,
                          'yyyy-MM-dd',
                        ),
                        customerProgramId: program.id,
                        customerProgram: program,
                      });
                }}
              />
            ) : (
              <ty.CaptionText center mr={th.spacing.md}>
                {palletCountValue || '-'}
              </ty.CaptionText>
            )}
          </l.Flex>
        );
      }, weekCount)}
    </ProgramWrapper>
  );
};

export default ProgramRow;
