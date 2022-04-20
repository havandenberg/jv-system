import { groupBy, values } from 'ramda';
import {
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
} from 'types';

import {
  CustomerProgramUpdate,
  ProgramChanges,
  RemovedItems,
  ShipperProgramUpdate,
} from './types';

export const getGridProps = (weekCount: number) => {
  const columnWidth = 70;
  const gridTemplateColumns = `500px repeat(${weekCount}, ${columnWidth}px)`;
  const gridWidth = 500 + weekCount * columnWidth;
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
) =>
  values(
    groupBy(
      (program) =>
        `species=${program.commonSpeciesId}variety=${program.commonVarietyId}size=${program.commonSizeId}packType=${program.commonPackTypeId}plu=${program.plu}`,
      programs,
    ),
  )
    .filter((duplicatePrograms) => duplicatePrograms.length > 1)
    .map((duplicatePrograms) =>
      duplicatePrograms.map((p) => parseInt(p.id, 10)),
    )
    .flat();
