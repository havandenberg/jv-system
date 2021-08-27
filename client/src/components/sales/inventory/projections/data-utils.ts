import { groupBy, sortBy, values } from 'ramda';

import {
  Maybe,
  ShipperProjectionProduct,
  ShipperProjectionVessel,
} from 'types';

import { ShipperProjectionChanges, VesselUpdate } from './types';

export const getAllVessels = (
  vessels: Maybe<ShipperProjectionVessel>[],
  changes: ShipperProjectionChanges,
  getVesselValue: (
    vessel: Maybe<ShipperProjectionVessel> | undefined,
    key: keyof VesselUpdate,
  ) => { dirty: boolean; value: string },
) =>
  sortBy((v) => getVesselValue(v, 'departureDate').value, [
    ...vessels,
    ...changes.newVessels,
  ] as ShipperProjectionVessel[]).map((v) => {
    if (v) {
      return {
        ...v,
        shipperProjectionEntriesByVesselId: {
          nodes: [
            ...v.shipperProjectionEntriesByVesselId.nodes,
            ...changes.newEntries.filter((e) => e.vesselId === v.id),
          ],
        },
      };
    }
    return v;
  });

export const getDuplicateProductIds = (products: ShipperProjectionProduct[]) =>
  values(
    groupBy(
      (product) =>
        `species=${product.species}variety=${product.variety}size=${product.size}packType=${product.packType}plu=${product.plu}`,
      products,
    ),
  )
    .filter((duplicateProducts) => duplicateProducts.length > 1)
    .map((duplicateProducts) =>
      duplicateProducts.map((p) => parseInt(p.id, 10)),
    )
    .flat();
