import React, { Fragment } from 'react';
import { ApolloError } from '@apollo/client';
import {
  equals,
  groupBy,
  mapObjIndexed,
  pluck,
  sortBy,
  times,
  values,
} from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { DataMessage } from 'components/page/message';
import { useQueryValue } from 'hooks/use-query-params';
import {
  CommonSpecies,
  Maybe,
  Shipper,
  ShipperProgram,
  ShipperProgramEntry,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import { ProgramProps, ShipperProgramUpdate } from '../types';
import { getGridProps } from '../utils';
import ProgramRow, { NewProgramRow, ProgramTotalRow } from './row';

interface Props extends ProgramProps {
  duplicateProgramIds: number[];
  error?: ApolloError;
  loading: boolean;
  programs: ShipperProgram[];
  selectedShipper?: Maybe<Shipper> | undefined;
  selectedWeekNumber: number;
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
  programTotals: { [key: string]: number[] };
  rest: Pick<
    Props,
    | 'changeHandlers'
    | 'duplicateProgramIds'
    | 'handleRemoveItem'
    | 'isItemCollapsed'
    | 'newItemHandlers'
    | 'selectedWeekNumber'
    | 'toggleCollapseItem'
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
                            isEvenRow={!!isEvenRow}
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
                    gridTemplateColumns={gridTemplateColumns}
                    programTotals={programTotals[programTotalsKey]}
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
  const { error, selectedWeekNumber } = rest;

  const { pathname } = useLocation();
  const [startDateQuery] = useQueryValue('startDate');
  const [endDateQuery] = useQueryValue('endDate');
  const [coast] = useQueryValue('coast');

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

  const getProgramTotals = (ps: ShipperProgram[]) =>
    times(
      (index) =>
        pluck('shipperProgramEntries', ps)
          .map((entries) =>
            (entries.nodes as ShipperProgramEntry[])
              .filter(
                (entry) =>
                  entry &&
                  getWeekNumber(
                    new Date(entry.programDate.replace(/-/g, '/')),
                  ) ===
                    selectedWeekNumber + index,
              )
              .reverse(),
          )
          .flat()
          .reduce(
            (acc, entry) =>
              acc + +getShipperProgramEntryValue(entry, 'palletCount').value,
            0,
          ),
      weekCount,
    );

  const hasPrograms = programs.length > 0;

  const programTotals = selectedShipper
    ? mapObjIndexed((ps) => getProgramTotals(ps), groupedProgramsByProduct)
    : Object.keys(groupedProgramsByShipperAndProduct).reduce((acc, key) => {
        const ps = groupedProgramsByShipperAndProduct[key];
        const newProducts: { [key: string]: number[] } = {};
        Object.keys(ps).forEach((productKey) => {
          const product = ps[productKey];
          newProducts[`${key}-${productKey}`] = getProgramTotals(product);
        });
        return { ...acc, ...newProducts };
      }, {});

  const grandProgramTotals = getProgramTotals(programs);

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
                      shipperTo={`${pathname}?coast=${coast}&startDate=${startDateQuery}&endDate=${endDateQuery}&shipperId=${
                        values(programsByShipper)[0]?.[0]?.shipperId
                      }&view=shippers`}
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
            gridTemplateColumns={gridTemplateColumns}
            programTotals={grandProgramTotals}
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
            header: 'No shipper programs found',
          }}
          error={error}
          loading={loading}
        />
      )}
    </l.Div>
  );
};

export default ShipperPrograms;
