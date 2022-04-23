import React from 'react';
import { ApolloError } from '@apollo/client';
import { equals, groupBy, mapObjIndexed, sortBy, values } from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { DataMessage } from 'components/page/message';
import {
  CommonSpecies,
  Maybe,
  Customer,
  CustomerProgram,
  CustomerProgramEntry,
  ShipperProgramEntry,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ProgramProps, CustomerProgramUpdate } from '../types';
import { getGridProps, getCustomerProgramTotals } from '../utils';
import ProgramRow, { NewProgramRow, ProgramTotalRow } from './row';

interface Props extends ProgramProps {
  duplicateProgramIds: number[];
  error?: ApolloError;
  loading: boolean;
  programs: CustomerProgram[];
  selectedCustomer?: Maybe<Customer> | undefined;
  selectedWeekNumber: number;
  shipperProgramEntries: ShipperProgramEntry[];
}

const CustomerProgramSet = ({
  editing,
  getCustomerProgramValue,
  groupedPrograms,
  loading,
  programTotals,
  rest,
  customerTo,
  specieses,
}: {
  editing: boolean;
  getCustomerProgramValue: (
    customerProgram: Maybe<CustomerProgram> | undefined,
    key: keyof CustomerProgramUpdate,
  ) => { dirty: boolean; value: string };
  groupedPrograms: Record<string, CustomerProgram[]>;
  loading: boolean;
  programTotals: { [key: string]: { total: number; available: number }[] };
  rest: Pick<
    Props,
    | 'changeHandlers'
    | 'customerProgramEntries'
    | 'duplicateProgramIds'
    | 'handleRemoveItem'
    | 'newItemHandlers'
    | 'showAllocated'
    | 'startWeeks'
    | 'endWeeks'
    | 'handleWeekRangeChange'
    | 'selectedWeekNumber'
    | 'shipperProgramEntries'
    | 'valueGetters'
    | 'weekCount'
  >;
  customerTo?: string;
  specieses: CommonSpecies[];
}) => {
  const { gridTemplateColumns, gridWidth } = getGridProps(rest.weekCount);
  return (
    <>
      {values(
        mapObjIndexed((programs, key, object) => {
          const isEvenRow =
            object && Object.keys(object).indexOf(key) % 2 === 0;
          const isFirstRow = object && Object.keys(object).indexOf(key) === 0;
          const programTotalsKey = customerTo
            ? `${programs[0]?.customer?.customerName}-${key}`
            : key;
          return (
            <l.Div key={key} my={th.spacing.md} relative>
              {customerTo && isFirstRow && (
                <l.Div mb={th.spacing.sm} ml={th.spacing.md}>
                  <ty.LinkText
                    bold
                    fontSize={th.fontSizes.caption}
                    hover
                    nowrap
                    to={customerTo}
                    overflow="hidden"
                    textDecoration="underline"
                    textOverflow="ellipsis"
                  >
                    {programs[0]?.customer?.customerName}
                  </ty.LinkText>
                </l.Div>
              )}
              <l.Div>
                {
                  programs.reduce<{
                    components: React.ReactNode[];
                    previousProgram?: CustomerProgram;
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
                      return {
                        components: [
                          ...components,
                          <ProgramRow
                            {...rest}
                            commonSpecieses={specieses}
                            editing={editing}
                            gridTemplateColumns={gridTemplateColumns}
                            index={idx}
                            key={idx}
                            loading={loading}
                            program={program}
                            previousProgram={previousProgram}
                            showSpecies={showSpecies}
                            showVariety={showVariety}
                          />,
                        ],
                        previousProgram: program,
                      };
                    },
                    { components: [] },
                  ).components
                }
                {key && (
                  <ProgramTotalRow
                    editing={editing}
                    gridTemplateColumns={gridTemplateColumns}
                    programTotals={programTotals[programTotalsKey]}
                    showAllocated={rest.showAllocated}
                    species={
                      getCustomerProgramValue(programs[0], 'commonSpeciesId')
                        .value
                    }
                  />
                )}
              </l.Div>
              <l.Div
                background={
                  isEvenRow
                    ? th.colors.brand.containerBackground
                    : 'transparent'
                }
                borderBottom={th.borders.secondary}
                position="absolute"
                top={`-${th.spacing.sm}`}
                height={`calc(${th.sizes.fill} + ${th.spacing.md})`}
                width={gridWidth}
                zIndex={-1}
              />
            </l.Div>
          );
        }, groupedPrograms),
      )}
    </>
  );
};

const CustomerPrograms = ({
  editing,
  loading: parentLoading,
  programs,
  selectedCustomer,
  ...rest
}: Props) => {
  const { error, selectedWeekNumber, showAllocated } = rest;

  const { pathname, search } = useLocation();

  const { data: speciesData, loading: speciesLoading } =
    api.useCommonSpecieses();
  const specieses = (speciesData ? speciesData.nodes : []) as CommonSpecies[];
  const loading = parentLoading || speciesLoading;

  const { getCustomerProgramValue, getCustomerProgramEntryValue } =
    rest.valueGetters;

  const groupProgramByProduct = (programsToGroup: CustomerProgram[]) =>
    groupBy(
      (program) => {
        const species = specieses.find(
          (s) =>
            s.id === getCustomerProgramValue(program, 'commonSpeciesId').value,
        );
        return `${species?.speciesName}`;
      },
      sortBy((program) => {
        const species = specieses.find(
          (s) =>
            s.id === getCustomerProgramValue(program, 'commonSpeciesId').value,
        );
        const variety = species?.commonVarieties?.nodes.find(
          (v) =>
            v &&
            v.id === getCustomerProgramValue(program, 'commonVarietyId').value,
        );
        const size = species?.commonSizes?.nodes.find(
          (s) =>
            s &&
            s.id === getCustomerProgramValue(program, 'commonSizeId').value,
        );
        const packType = species?.commonPackTypes?.nodes.find(
          (p) =>
            p &&
            p.id === getCustomerProgramValue(program, 'commonPackTypeId').value,
        );
        return `${species?.speciesName} ${variety?.varietyName} ${
          size?.sizeName
        } ${packType?.packTypeName} ${
          getCustomerProgramValue(program, 'plu').value
        }`;
      }, programsToGroup),
    );
  const groupedProgramsByProduct = groupProgramByProduct(programs);

  const groupedProgramsByCustomerAndProduct = mapObjIndexed(
    (customerPrograms: CustomerProgram[]) =>
      groupProgramByProduct(customerPrograms),
    groupBy((program) => program.customer?.customerName || '', programs),
  );

  const { gridTemplateColumns, gridWidth, weekCount } = getGridProps(
    rest.weekCount,
  );

  const hasPrograms = programs.length > 0;

  const buildProgramTotals = (progs: CustomerProgram[]) =>
    getCustomerProgramTotals(
      progs,
      selectedWeekNumber,
      weekCount,
      getCustomerProgramEntryValue as (
        entry: CustomerProgramEntry,
        key: keyof CustomerProgramEntry,
      ) => { dirty: boolean; value: string },
    );

  const programTotals = selectedCustomer
    ? mapObjIndexed((ps) => buildProgramTotals(ps), groupedProgramsByProduct)
    : Object.keys(groupedProgramsByCustomerAndProduct).reduce((acc, key) => {
        const ps = groupedProgramsByCustomerAndProduct[key];
        const newProducts: {
          [key: string]: { total: number; available: number }[];
        } = {};
        Object.keys(ps).forEach((productKey) => {
          const product = ps[productKey];
          newProducts[`${key}-${productKey}`] = buildProgramTotals(product);
        });
        return { ...acc, ...newProducts };
      }, {});

  const grandProgramTotals = buildProgramTotals(programs);

  return (
    <l.Div mb={th.spacing.xxl} relative>
      <l.Grid
        gridColumnGap={th.spacing.sm}
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        mt={th.spacing.md}
      >
        <l.Grid
          gridColumnGap={th.spacing.xs}
          gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
          marginLeft={52}
          relative
        >
          <ty.CaptionText secondary>Species</ty.CaptionText>
          <ty.CaptionText secondary>Variety</ty.CaptionText>
          <ty.CaptionText secondary>Size</ty.CaptionText>
          <ty.CaptionText secondary>Pack Type</ty.CaptionText>
          <ty.CaptionText secondary>PLU/GTIN</ty.CaptionText>
          {(hasPrograms || editing) && !loading && (
            <l.Div
              borderTop={th.borders.secondary}
              position="absolute"
              left={-52}
              bottom={`-${th.spacing.sm}`}
              width={gridWidth}
            />
          )}
        </l.Grid>
      </l.Grid>
      {(hasPrograms || editing) && !loading ? (
        <>
          {selectedCustomer ? (
            <CustomerProgramSet
              editing={editing}
              getCustomerProgramValue={getCustomerProgramValue}
              groupedPrograms={groupedProgramsByProduct}
              loading={loading}
              programTotals={programTotals}
              rest={rest}
              specieses={specieses}
            />
          ) : (
            <>
              {values(
                mapObjIndexed(
                  (programsByCustomer, key) => (
                    <CustomerProgramSet
                      editing={editing}
                      getCustomerProgramValue={getCustomerProgramValue}
                      groupedPrograms={programsByCustomer}
                      key={key}
                      loading={loading}
                      programTotals={programTotals}
                      rest={rest}
                      customerTo={`${pathname}${search}&customerId=${
                        values(programsByCustomer)[0]?.[0]?.customerId
                      }`}
                      specieses={specieses}
                    />
                  ),
                  groupedProgramsByCustomerAndProduct,
                ),
              )}
            </>
          )}
          {selectedCustomer && editing && (
            <NewProgramRow editing={true} hasPrograms={hasPrograms} {...rest} />
          )}
          <ProgramTotalRow
            editing={editing}
            gridTemplateColumns={gridTemplateColumns}
            programTotals={grandProgramTotals}
            showAllocated={showAllocated}
            species="Grand"
          />
          <l.Div
            borderLeft={th.borders.secondary}
            position="absolute"
            top={27}
            bottom={0}
          />
          <l.Div
            borderRight={th.borders.secondary}
            position="absolute"
            top={26}
            left={gridWidth}
            bottom={0}
          />
          <l.Div
            borderBottom={th.borders.secondary}
            position="absolute"
            bottom={0}
            width={gridWidth}
          />
        </>
      ) : (
        <DataMessage
          data={programs}
          emptyProps={{
            header: 'No customer programs found',
          }}
          error={error}
          loading={loading}
        />
      )}
    </l.Div>
  );
};

export default CustomerPrograms;
