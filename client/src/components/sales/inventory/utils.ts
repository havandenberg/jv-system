import { add, endOfISOWeek, isAfter, isBefore } from 'date-fns';
import { last, pathOr, pluck, reduce, sortBy, sum } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  InventoryItem,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
  Vessel,
  Warehouse,
} from 'types';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

import { ShipperProjectionProductWithEntries } from '../projections/grid/types';
import { getProductIdentifier } from '../projections/utils';

export const dateRanges = [1, 1, 1, 1, 1, 1, 1, 3, 4, 7, 7, 7];

export const getDateRange = (idx: number) => {
  const start = reduce(
    (acc, range) => acc + range,
    0,
    dateRanges.slice(0, idx),
  );
  return { start, end: start + dateRanges[idx] };
};

export const getFilteredVessels = (
  vessels: (Vessel & { shipperId?: string })[],
  idx: number,
  currentStartOfWeek: Date,
) => {
  const dateRange = getDateRange(idx);
  const filteredVessels = sortBy(
    (vessel) => vessel.vesselCode,
    vessels.filter(
      (vessel) =>
        isDateGreaterThanOrEqualTo(
          new Date(vessel.dischargeDate.replace(/-/g, '/')),
          add(currentStartOfWeek, { days: dateRange.start }),
        ) &&
        isBefore(
          new Date(vessel.dischargeDate.replace(/-/g, '/')),
          add(currentStartOfWeek, { days: dateRange.end }),
        ),
    ),
  );
  return filteredVessels;
};

export const getDateInterval = (idx: number, currentStartOfWeek: Date) => {
  const dateRange = getDateRange(idx);
  return {
    start: add(currentStartOfWeek, { days: dateRange.start }),
    end: add(currentStartOfWeek, { days: dateRange.end }),
  };
};

export const isWithinDateInterval = (
  item: InventoryItem,
  idx: number,
  currentStartOfWeek: Date,
) => {
  const dateRange = getDateRange(idx);
  return (
    item.vessel &&
    isDateGreaterThanOrEqualTo(
      new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
      add(currentStartOfWeek, { days: dateRange.start }),
    ) &&
    isBefore(
      new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
      add(currentStartOfWeek, { days: dateRange.end }),
    )
  );
};

export const getFilteredItems = (
  items: InventoryItem[],
  idx: number,
  currentStartOfWeek: Date,
) => {
  if (idx === 13) {
    return items.filter(
      (item) =>
        item.vessel &&
        isBefore(
          new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
          currentStartOfWeek,
        ),
    );
  }
  if (idx === 14) {
    return items;
  }
  return items.filter((item) =>
    isWithinDateInterval(item, idx, currentStartOfWeek),
  );
};

export const getSortedItems = (
  listLabels: LabelInfo<InventoryItem>[],
  items: InventoryItem[],
  sortKey: string,
  sortOrder: string,
) => {
  const activeLabel = listLabels.find(
    (label) => (label.sortKey || label.key) === sortKey,
  );
  return activeLabel && activeLabel.customSortBy
    ? sortOrder === SORT_ORDER.DESC
      ? sortBy(activeLabel.customSortBy, items).reverse()
      : sortBy(activeLabel.customSortBy, items)
    : items;
};

export const isPreInventoryItem = (item: InventoryItem) =>
  item.vesselCode?.includes('PRE-');

export interface InventoryItemPalletData {
  pre: number;
  real: number;
}

export const reducePalletData = (
  items: InventoryItem[],
  key: keyof InventoryItem,
) =>
  items.reduce(
    (acc, item) => {
      const isPre = isPreInventoryItem(item);
      const newPalletCount = parseInt(item[key], 10);
      return {
        pre: acc.pre + (isPre ? newPalletCount : 0),
        real: acc.real + (isPre ? 0 : newPalletCount),
      };
    },
    { pre: 0, real: 0 },
  );

export const getVesselDischargeDate = (
  vessel: Vessel | ShipperProjectionVesselInfo,
) => add(new Date(vessel.arrivalDate.replace(/-/g, '/')), { days: 3 });

export const convertProjectionsToInventoryItems = (
  projections: ShipperProjectionVesselInfo[],
  startDate: Date,
) => {
  const vessels = projections.filter(
    (vesselInfo) =>
      isAfter(getVesselDischargeDate(vesselInfo), endOfISOWeek(startDate)) &&
      vesselInfo.projection?.reviewStatus === 2 &&
      vesselInfo?.id ===
        last(
          (vesselInfo.vessel?.shipperProjectionVesselInfosByVesselId.nodes ||
            []) as ShipperProjectionVesselInfo[],
        )?.id,
  ) as ShipperProjectionVesselInfo[];

  const entries = [
    ...vessels
      .map((vessel) =>
        pathOr([], ['shipperProjectionEntriesByVesselInfoId', 'nodes'], vessel),
      )
      .flat(),
  ] as ShipperProjectionEntry[];

  const products = sortBy(
    (product) =>
      ['species', 'variety', 'size', 'packType', 'plu']
        .map(
          (key) => product[key as keyof ShipperProjectionProduct] || 'zzzzzz',
        )
        .join(' '),
    (pluck('product', entries) as ShipperProjectionProduct[]).map(
      (product) =>
        ({
          ...product,
          entries: entries
            .filter(
              (entry) =>
                entry.product &&
                getProductIdentifier(entry.product, false) ===
                  getProductIdentifier(product, false),
            )
            .map((entry) => ({
              id: entry.id,
              palletCount: entry.palletCount,
              productId: entry.productId,
              vesselInfoId: entry.vesselInfoId,
            })),
        } as ShipperProjectionProductWithEntries),
    ),
  );

  const preInventoryVessels = vessels.map((vessel) => ({
    id: -vessel.id,
    vesselCode: `PRE-${vessel.id}`,
    vesselName: vessel.vesselName,
    country: vessel.shipper?.country,
    departureDate: vessel.departureDate,
    arrivalDate: vessel.arrivalDate,
    dischargeDate: formatDate(getVesselDischargeDate(vessel)),
    coast: vessel.arrivalPort,
    shipperId: vessel.shipperId,
  })) as (Vessel & { shipperId: string })[];

  const preInventoryItems = vessels
    .map((vessel) => {
      const vesselProducts = products.filter((product) =>
        entries
          .filter((entry) => entry.vesselInfoId === vessel.id)
          .map((entry) => entry?.product?.id)
          .includes(product?.id),
      );

      const preInventoryVessel = preInventoryVessels.find(
        (v) => v.vesselCode === `PRE-${vessel.id}`,
      );

      if (!preInventoryVessel) {
        return [];
      }

      return vesselProducts.map((product) => ({
        nodeId: `${preInventoryVessel.vesselCode}-${product.id}`,
        id: `${preInventoryVessel.vesselCode}-${product.id}`,
        product: {
          id: `${product.commonSpecies?.productSpeciesId}${product.commonVariety?.productVarietyId}${product.commonSize?.productSizeId}${product.commonPackType?.packMasterId}`,
          nodeId: '',
          species: product.commonSpecies?.productSpecies,
          variety: product.commonVariety?.productVariety,
          size: product.commonSize?.productSize,
          packType: product.commonPackType?.packMaster,
          sizes: {
            edges: [],
            nodes: [product.commonSize?.productSize],
            pageInfo: { hasNextPage: false, hasPreviousPage: false },
            totalCount: 1,
          },
          entries: product.entries.filter(
            ({ vesselInfoId }) => vesselInfoId === vessel.id,
          ),
        },
        vessel: preInventoryVessel,
        vesselCode: preInventoryVessel.vesselCode,
        shipper: vessel.shipper,
        palletsReceived: '0',
        palletsCommitted: '0',
        palletsOnHand: '0',
        palletsAvailable: `${sum(
          pluck(
            'palletCount',
            product.entries.filter(
              ({ vesselInfoId }) => vesselInfoId === vessel.id,
            ),
          ),
        )}`,
        palletsShipped: '0',
        plu: !!product.plu,
        country: preInventoryVessel.country,
        coast: preInventoryVessel.coast,
        pallets: {
          edges: [],
          nodes: [],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
          totalCount: 0,
        },
        warehouse: {
          id: '39',
          warehouseName: 'Eastern Pro-Pack',
        } as Warehouse,
      }));
    })
    .flat() as InventoryItem[];

  return {
    preInventoryItems,
    products,
    preInventoryVessels,
  };
};
