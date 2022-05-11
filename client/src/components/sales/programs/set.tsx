import React from 'react';
import { equals, mapObjIndexed, values } from 'ramda';

import { useProgramsQueryParams } from 'hooks/use-query-params';
import { CommonSpecies, Maybe, CustomerProgram, ShipperProgram } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  ProgramProps,
  CustomerProgramUpdate,
  ShipperProgramUpdate,
} from './types';
import ProgramRow, { ProgramTotalRow } from './row';
import { getGridProps } from './utils';

const ProgramSet = <
  T extends CustomerProgram | ShipperProgram,
  K extends CustomerProgramUpdate | ShipperProgramUpdate,
>({
  editing,
  getProgramValue,
  groupedPrograms,
  programTotals,
  rest,
  to,
  specieses,
}: {
  editing: boolean;
  getProgramValue: (
    program: Maybe<T> | undefined,
    key: keyof K,
  ) => { dirty: boolean; value: string };
  groupedPrograms: Record<string, T[]>;
  loading: boolean;
  programTotals: {
    [key: string]: { total: number; available: number | null }[];
  };
  rest: ProgramProps;
  to?: string;
  specieses: CommonSpecies[];
}) => {
  const [{ programsView: view }] = useProgramsQueryParams();
  const { gridTemplateColumns, gridWidth } = getGridProps(rest.weekCount);
  return (
    <>
      {values(
        mapObjIndexed((programs, key, object) => {
          const isEvenRow =
            object && Object.keys(object).indexOf(key) % 2 === 0;
          const isFirstRow = object && Object.keys(object).indexOf(key) === 0;
          const customerName = (programs[0] as CustomerProgram)?.customer
            ?.customerName;
          const shipperName = (programs[0] as ShipperProgram)?.shipper
            ?.shipperName;
          const name = view === 'customers' ? customerName : shipperName;
          const programTotalsKey = to ? `${name}-${key}` : key;
          return (
            <l.Div key={key} my={th.spacing.md} relative>
              {to && isFirstRow && (
                <l.Div mb={th.spacing.sm} ml={th.spacing.md}>
                  <ty.LinkText
                    bold
                    fontSize={th.fontSizes.caption}
                    hover
                    nowrap
                    to={to}
                    overflow="hidden"
                    textDecoration="underline"
                    textOverflow="ellipsis"
                  >
                    {name}
                  </ty.LinkText>
                </l.Div>
              )}
              <l.Div>
                {
                  programs.reduce<{
                    components: React.ReactNode[];
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
                      return {
                        components: [
                          ...components,
                          <ProgramRow
                            {...rest}
                            commonSpecieses={specieses}
                            gridTemplateColumns={gridTemplateColumns}
                            index={idx}
                            key={idx}
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
                      getProgramValue(programs[0], 'commonSpeciesId').value
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

export default ProgramSet;
