import { groupBy, sortBy, values } from 'ramda';

import {
  Maybe,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';

import { ShipperProjectionGridChanges, VesselUpdate } from './grid/types';

export const getAllVessels = (
  vessels: Maybe<ShipperProjectionVesselInfo>[],
  changes: ShipperProjectionGridChanges,
  getVesselValue: (
    vessel: Maybe<ShipperProjectionVesselInfo> | undefined,
    key: keyof VesselUpdate,
  ) => { dirty: boolean; value: string },
) =>
  sortBy((v) => getVesselValue(v, 'departureDate').value, [
    ...vessels,
    ...changes.newVessels,
  ] as ShipperProjectionVesselInfo[]).map((v) => {
    if (v) {
      return {
        ...v,
        shipperProjectionEntriesByVesselInfoId: {
          nodes: [
            ...v.shipperProjectionEntriesByVesselInfoId.nodes,
            ...changes.newEntries.filter((e) => e.vesselInfoId === v.id),
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
