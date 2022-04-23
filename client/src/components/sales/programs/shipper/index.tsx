import React from 'react';
import { ApolloError } from '@apollo/client';
import { equals, groupBy, mapObjIndexed, sortBy, values } from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { DataMessage } from 'components/page/message';
import {
  CommonSpecies,
  Maybe,
  Shipper,
  ShipperProgram,
  CustomerProgramEntry,
  ShipperProgramEntry,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ProgramProps, ShipperProgramUpdate } from '../types';
import { getGridProps, getShipperProgramTotals } from '../utils';
import ProgramRow, { NewProgramRow, ProgramTotalRow } from './row';

interface Props extends ProgramProps {
  duplicateProgramIds: number[];
  error?: ApolloError;
  loading: boolean;
  programs: ShipperProgram[];
  selectedShipper?: Maybe<Shipper> | undefined;
  selectedWeekNumber: number;
  customerProgramEntries: CustomerProgramEntry[];
}

const ShipperProgramSet = ({
  editing,
  getShipperProgramValue,
  groupedPrograms,
  loading,
  programTotals,
  rest,
  shipperTo,
  specieses,
}: {
  editing: boolean;
  getShipperProgramValue: (
    shipperProgram: Maybe<ShipperProgram> | undefined,
    key: keyof ShipperProgramUpdate,
  ) => { dirty: boolean; value: string };
  groupedPrograms: Record<string, ShipperProgram[]>;
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
  shipperTo?: string;
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
          const programTotalsKey = shipperTo
            ? `${programs[0]?.shipper?.shipperName}-${key}`
            : key;
          return (
            <l.Div key={key} my={th.spacing.md} relative>
              {shipperTo && isFirstRow && (
                <l.Div mb={th.spacing.sm} ml={th.spacing.md}>
                  <ty.LinkText
                    bold
                    fontSize={th.fontSizes.caption}
                    hover
                    nowrap
                    to={shipperTo}
                    overflow="hidden"
                    textDecoration="underline"
                    textOverflow="ellipsis"
                  >
                    {programs[0]?.shipper?.shipperName}
                  </ty.LinkText>
                </l.Div>
              )}
              <l.Div>
                {
                  programs.reduce<{
                    components: React.ReactNode[];
                    previousProgram?: ShipperProgram;
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
                      getShipperProgramValue(programs[0], 'commonSpeciesId')
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

const ShipperPrograms = ({
  editing,
  loading: parentLoading,
  programs,
  selectedShipper,
  ...rest
}: Props) => {
  const { error, selectedWeekNumber, showAllocated } = rest;

  const { pathname, search } = useLocation();

  const { data: speciesData, loading: speciesLoading } =
    api.useCommonSpecieses();
  const specieses = (speciesData ? speciesData.nodes : []) as CommonSpecies[];
  const loading = parentLoading || speciesLoading;

  const { getShipperProgramValue, getShipperProgramEntryValue } =
    rest.valueGetters;

  const groupProgramByProduct = (programsToGroup: ShipperProgram[]) =>
    groupBy(
      (program) => {
        const species = specieses.find(
          (s) =>
            s.id === getShipperProgramValue(program, 'commonSpeciesId').value,
        );
        return `${species?.speciesName}`;
      },
      sortBy((program) => {
        const species = specieses.find(
          (s) =>
            s.id === getShipperProgramValue(program, 'commonSpeciesId').value,
        );
        const variety = species?.commonVarieties?.nodes.find(
          (v) =>
            v &&
            v.id === getShipperProgramValue(program, 'commonVarietyId').value,
        );
        const size = species?.commonSizes?.nodes.find(
          (s) =>
            s && s.id === getShipperProgramValue(program, 'commonSizeId').value,
        );
        const packType = species?.commonPackTypes?.nodes.find(
          (p) =>
            p &&
            p.id === getShipperProgramValue(program, 'commonPackTypeId').value,
        );
        return `${species?.speciesName} ${variety?.varietyName} ${
          size?.sizeName
        } ${packType?.packTypeName} ${
          getShipperProgramValue(program, 'plu').value
        }`;
      }, programsToGroup),
    );
  const groupedProgramsByProduct = groupProgramByProduct(programs);

  const groupedProgramsByShipperAndProduct = mapObjIndexed(
    (shipperPrograms: ShipperProgram[]) =>
      groupProgramByProduct(shipperPrograms),
    groupBy((program) => program.shipper?.shipperName || '', programs),
  );

  const { gridTemplateColumns, gridWidth, weekCount } = getGridProps(
    rest.weekCount,
  );

  const hasPrograms = programs.length > 0;

  const buildProgramTotals = (progs: ShipperProgram[]) =>
    getShipperProgramTotals(
      progs,
      selectedWeekNumber,
      weekCount,
      getShipperProgramEntryValue as (
        entry: ShipperProgramEntry,
        key: keyof ShipperProgramEntry,
      ) => { dirty: boolean; value: string },
    );

  const programTotals = selectedShipper
    ? mapObjIndexed((ps) => buildProgramTotals(ps), groupedProgramsByProduct)
    : Object.keys(groupedProgramsByShipperAndProduct).reduce((acc, key) => {
        const ps = groupedProgramsByShipperAndProduct[key];
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
          {selectedShipper ? (
            <ShipperProgramSet
              editing={editing}
              getShipperProgramValue={getShipperProgramValue}
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
                  (programsByShipper, key) => (
                    <ShipperProgramSet
                      editing={editing}
                      getShipperProgramValue={getShipperProgramValue}
                      groupedPrograms={programsByShipper}
                      key={key}
                      loading={loading}
                      programTotals={programTotals}
                      rest={rest}
                      shipperTo={`${pathname}${search}&shipperId=${
                        values(programsByShipper)[0]?.[0]?.shipperId
                      }`}
                      specieses={specieses}
                    />
                  ),
                  groupedProgramsByShipperAndProduct,
                ),
              )}
            </>
          )}
          {selectedShipper && editing && (
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

export default ShipperPrograms;
