import { add, isBefore } from 'date-fns';
import {
  last,
  mapObjIndexed,
  pathOr,
  pluck,
  reduce,
  sortBy,
  sum,
  times,
  values,
} from 'ramda';

import { formatDate } from 'components/date-range-picker';
import { CommonProductTag } from 'components/tag-manager';
import {
  CommonSpecies,
  InventoryItem,
  Maybe,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVessel,
  ShipperProjectionVesselInfo,
  Vessel,
  Warehouse,
} from 'types';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

import { ShipperProjectionProductWithEntries } from '../../sales/projections/grid/types';
import { getProductIdentifier } from '../../sales/projections/utils';

export const dateRanges = (startDate: string) => [
  ...times(() => 1, 7 - getInventoryStartDayIndex(startDate)),
  3,
  4,
  7,
  7,
  7,
];

export const inventorySortKeys = [
  { content: 'Default', value: '' },
  { content: 'Variety', value: 'variety' },
  { content: 'Size', value: 'size' },
  { content: 'Label', value: 'label' },
  { content: 'Pack Type', value: 'packType' },
  { content: 'Shipper', value: 'shipper' },
  { content: 'Country', value: 'countryOfOrigin' },
  { content: 'Program', value: 'program' },
  { content: 'PLU', value: 'plu' },
  { content: 'Size & Pack Type', value: 'sizePackType' },
];

export const getInventoryStartDayIndex = (startDate: string) => {
  const dayIndex = new Date(startDate.replace(/-/g, '/')).getDay();
  return dayIndex > 0 ? dayIndex - 1 : 6;
};

export const getDateRange = (idx: number, startDate: Date) => {
  const startDateStr = formatDate(startDate);
  const start = reduce(
    (acc, range) => acc + range,
    0,
    dateRanges(startDateStr).slice(0, idx),
  );
  return { start, end: start + dateRanges(startDateStr)[idx] };
};

export const getFilteredVessels = (
  vessels: (Vessel & { shipperId?: string })[],
  idx: number,
  currentStartOfWeek: Date,
) => {
  const dateRange = getDateRange(idx, currentStartOfWeek);
  const filteredVessels = sortBy(
    (vessel) => vessel.vesselCode,
    vessels.filter((vessel) => {
      const date = new Date(
        (vessel.dischargeDate || vessel.arrivalDate).replace(/-/g, '/'),
      );
      return (
        isDateGreaterThanOrEqualTo(
          date,
          add(currentStartOfWeek, { days: dateRange.start }),
        ) && isBefore(date, add(currentStartOfWeek, { days: dateRange.end }))
      );
    }),
  );
  return filteredVessels;
};

export const getDateInterval = (idx: number, currentStartOfWeek: Date) => {
  const dateRange = getDateRange(idx, currentStartOfWeek);
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
  const dateRange = getDateRange(idx, currentStartOfWeek);
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

export const getGroupedItems = (items: InventoryItem[], isInventory = true) =>
  Object.values(
    items.reduce((acc, item) => {
      const key = `${item.vessel?.id}-${item.shipper?.id}-${
        isInventory ? '' : item.product?.species?.id
      }`;
      return {
        ...acc,
        [key]: {
          ...(acc[key] || item),
          jvLotNumber: acc[key]
            ? acc[key].jvLotNumber === 'PARTIAL_DISTRESS'
              ? 'PARTIAL_DISTRESS'
              : acc[key].jvLotNumber === 'D0000'
              ? item.jvLotNumber === 'D0000'
                ? 'D0000'
                : 'PARTIAL_DISTRESS'
              : item.jvLotNumber === 'D0000'
              ? 'PARTIAL_DISTRESS'
              : item.jvLotNumber
            : item.jvLotNumber,
          palletsAvailable:
            parseInt(acc[key]?.palletsAvailable || '0', 10) +
            parseInt(item.palletsAvailable || '0', 10),
          palletsOnHand:
            parseInt(acc[key]?.palletsOnHand || '0', 10) +
            parseInt(item.palletsOnHand || '0', 10),
          palletsReceived:
            parseInt(acc[key]?.palletsReceived || '0', 10) +
            (item.pallets?.totalCount !== undefined
              ? item.pallets?.totalCount || 0
              : parseInt(item.palletsReceived || '0', 10)),
        },
      };
    }, {} as { [key: string]: InventoryItem }),
  );

export const getDetailedFilteredItems = (
  items: InventoryItem[],
  secondaryDetailsIndex: string,
) =>
  items.filter((item) =>
    [
      `${item.vessel?.id}-${item.shipper?.id}`,
      `${item.vessel?.id}-${item.shipper?.id}-${item.product?.species?.id}`,
    ].includes(secondaryDetailsIndex),
  );

export const isPreInventoryItem = (item: InventoryItem) => !!item.vessel?.isPre;

export interface InventoryItemPalletData {
  pre: number;
  real: number;
  total: number;
}

export const reducePalletData = (items: InventoryItem[]) =>
  items.reduce(
    (acc, item) => {
      const isPre = isPreInventoryItem(item);
      const palletsAvailableAcc = acc.palletsAvailable;
      const palletsOnHandAcc = acc.palletsOnHand;
      const palletsReceivedAcc = acc.palletsReceived;
      const newPalletsAvailableCount = parseInt(item.palletsAvailable, 10);
      const newPalletsOnHandCount = parseInt(item.palletsOnHand, 10);
      const newPalletsReceivedCount =
        item.pallets?.totalCount !== undefined
          ? item.pallets?.totalCount || 0
          : parseInt(item.palletsReceived || '0', 10);
      return {
        palletsAvailable: {
          pre: palletsAvailableAcc.pre + (isPre ? newPalletsAvailableCount : 0),
          real:
            palletsAvailableAcc.real + (isPre ? 0 : newPalletsAvailableCount),
          total: palletsAvailableAcc.total + newPalletsAvailableCount,
        },
        palletsOnHand: {
          pre: palletsOnHandAcc.pre + (isPre ? newPalletsOnHandCount : 0),
          real: palletsOnHandAcc.real + (isPre ? 0 : newPalletsOnHandCount),
          total: palletsOnHandAcc.total + newPalletsOnHandCount,
        },
        palletsReceived: {
          pre: palletsReceivedAcc.pre + (isPre ? newPalletsReceivedCount : 0),
          real: palletsReceivedAcc.real + (isPre ? 0 : newPalletsReceivedCount),
          total: palletsReceivedAcc.total + newPalletsReceivedCount,
        },
      };
    },
    {
      palletsAvailable: { pre: 0, real: 0, total: 0 },
      palletsOnHand: { pre: 0, real: 0, total: 0 },
      palletsReceived: { pre: 0, real: 0, total: 0 },
    },
  );

export const getVesselDischargeDate = (
  vessel: Vessel | ShipperProjectionVesselInfo,
) => add(new Date(vessel.arrivalDate.replace(/-/g, '/')), { days: 3 });

export const convertProjectionsToInventoryItems = (
  vessel: Maybe<Vessel> | undefined,
) => {
  if (!vessel) {
    return { preInventoryItems: [], products: [] };
  }

  const projections = (
    vessel
      ? (
          (vessel.shipperProjectionVessels?.nodes ||
            []) as ShipperProjectionVessel[]
        )
          .map((vessel) =>
            last(
              (vessel.shipperProjectionVesselInfosByVesselId?.nodes ||
                []) as ShipperProjectionVesselInfo[],
            ),
          )
          .flat()
      : []
  ) as ShipperProjectionVesselInfo[];

  const vesselInfos = projections.filter(
    (vesselInfo) =>
      vesselInfo.projection?.reviewStatus === 2 &&
      vesselInfo?.id ===
        last(
          (vesselInfo.vessel?.shipperProjectionVesselInfosByVesselId.nodes ||
            []) as ShipperProjectionVesselInfo[],
        )?.id,
  ) as ShipperProjectionVesselInfo[];

  const entries = [
    ...vesselInfos
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

  const preInventoryItems = vesselInfos
    .map((vesselInfo) => {
      const vesselProducts = products.filter((product) =>
        entries
          .filter((entry) => entry.vesselInfoId === vesselInfo.id)
          .map((entry) => entry?.product?.id)
          .includes(product?.id),
      );

      return vesselProducts.map((product) => ({
        nodeId: `${vessel.vesselCode}-${product.id}`,
        id: `${vessel.vesselCode}-${product.id}`,
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
            ({ vesselInfoId }) => vesselInfoId === vesselInfo.id,
          ),
        },
        vessel: vessel,
        vesselCode: vessel.vesselCode,
        shipper: vesselInfo.shipper,
        palletsReceived: '0',
        palletsCommitted: '0',
        palletsOnHand: '0',
        palletsAvailable: `${sum(
          pluck(
            'palletCount',
            product.entries.filter(
              ({ vesselInfoId }) => vesselInfoId === vesselInfo.id,
            ),
          ),
        )}`,
        palletsShipped: '0',
        plu: !!product.plu,
        country: vessel.country,
        coast: vessel.coast,
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
  };
};

export const reduceProductTags = (
  acc: { [key: string]: { [key: string]: InventoryItem[] } },
  tags: CommonProductTag[],
  item: InventoryItem,
  dateRangeIndex: string,
) =>
  tags.reduce(
    (acc2, tag) => ({
      ...acc2,
      [tag?.tagText || 'other']: {
        ...(acc[tag?.tagText || 'other'] || {}),
        [dateRangeIndex]: [
          ...(acc[tag?.tagText || 'other']?.[dateRangeIndex] || []),
          item,
        ],
      },
    }),
    {} as { [key: string]: { [key: string]: InventoryItem[] } },
  );

export const buildCategories =
  (
    groupedItems: { [key: string]: { [key: string]: InventoryItem[] } },
    {
      categoryType,
      rest,
      categoryTypeOrder,
      categoryTypes,
      commonSpecieses,
      isTag,
      params,
    }: {
      categoryType: string;
      rest: {
        [x: string]: any;
      };
      categoryTypeOrder: string[];
      categoryTypes?: string;
      commonSpecieses: CommonSpecies[];
      isTag: boolean;
      params: {
        species?: string;
        variety?: string;
        size?: string;
        packType?: string;
        sizePackType?: string;
        plu?: string;
        shipper?: string;
        countryOfOrigin?: string;
        program?: string;
        speciesTag?: string;
        varietyTag?: string;
        sizeTag?: string;
        packTypeTag?: string;
      };
    },
  ) =>
  (key: string) => {
    const {
      species,
      speciesTag,
      variety,
      varietyTag,
      size,
      sizeTag,
      packType,
      packTypeTag,
      plu,
      shipper,
      countryOfOrigin,
      program,
      sizePackType,
    } = params;
    const otherCategory = {
      id: 'other',
      speciesDescription: 'Other',
      varietyDescription: 'Other',
      packDescription: 'Other',
      combineDescription: 'Other',
      label: {
        labelCode: 'other',
        labelName: 'Other',
      },
      shipperName: 'Other',
      countryName: 'Other',
      customerSpecial: { customerName: 'No Program' },
      commonSpeciesTags: { nodes: [] },
      commonVarietyTags: { nodes: [] },
      commonSizeTags: { nodes: [] },
      commonPackTypeTags: { nodes: [] },
      defaultInvSortKey: '',
    };
    const item = mapObjIndexed(
      (val) => Object.values(val).flat(),
      groupedItems,
    )[key][0] as InventoryItem;
    const itemSpecies = item.product?.species || otherCategory;
    const itemVariety = item.product?.variety || otherCategory;
    const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
    const itemPackType = item.product?.packType || otherCategory;
    const itemShipper = item.shipper || otherCategory;
    const itemCountryOfOrigin = item.country || otherCategory;

    const commonSpecies = commonSpecieses.find(
      (cs) => cs && cs.productSpeciesId === item.product?.species?.id,
    );
    const commonSpeciesTag = commonSpecies?.commonSpeciesTags?.nodes[0];
    const commonVariety =
      commonSpecies?.commonVarieties?.nodes.find(
        (cv) => cv && cv.productVarietyId === item.product?.variety?.id,
      ) || otherCategory;
    const commonVarietyTag = commonVariety?.commonVarietyTags?.nodes[0];
    const commonSize =
      item.product?.sizes?.nodes[0]?.commonSizes?.nodes.find(
        (cs) => cs && cs.productSizeId === item.product?.sizes?.nodes[0]?.id,
      ) || otherCategory;
    const commonSizeTag = commonSize?.commonSizeTags?.nodes[0];
    const commonPackType =
      item.product?.packType?.commonPackTypes?.nodes.find(
        (cpt) => cpt && cpt.packMasterId === item.product?.packType?.id,
      ) || otherCategory;
    const commonPackTypeTag = commonPackType?.commonPackTypeTags?.nodes[0];

    const getId = () => {
      switch (categoryType) {
        case 'variety':
          return isTag ? commonVarietyTag?.tagText : itemVariety.id;
        case 'size':
          return isTag ? commonSizeTag?.tagText : itemSize.combineDescription;
        case 'label':
          return itemPackType.label?.labelCode;
        case 'packType':
          return isTag
            ? commonPackTypeTag?.tagText
            : itemPackType.packDescription;
        case 'plu':
          return item.plu ? 'true' : 'false';
        case 'shipper':
          return itemShipper.id;
        case 'countryOfOrigin':
          return itemCountryOfOrigin.id;
        case 'program':
          return itemPackType.customerSpecial?.customerName || 'no program';
        case 'sizePackType':
          return `${itemSize.id} - ${itemPackType.packDescription}`;
        default:
          return isTag ? commonSpeciesTag?.tagText : itemSpecies.id;
      }
    };
    const id = getId();

    const getText = () => {
      switch (categoryType) {
        case 'variety':
          return isTag
            ? commonVarietyTag?.tagText
            : itemVariety.varietyDescription;
        case 'size':
          return isTag
            ? commonSizeTag?.tagText
            : itemSize.combineDescription === 'other'
            ? ''
            : itemSize.combineDescription;
        case 'label':
          return itemPackType?.label?.labelName;
        case 'packType':
          return isTag
            ? commonPackTypeTag?.tagText
            : itemPackType.packDescription === 'other'
            ? ''
            : itemPackType.packDescription;
        case 'plu':
          return item.plu ? 'PLU' : 'No PLU';
        case 'shipper':
          return itemShipper.shipperName;
        case 'countryOfOrigin':
          return itemCountryOfOrigin.countryName;
        case 'program':
          return itemPackType?.customerSpecial?.customerName || 'No Program';
        case 'sizePackType':
          return `${itemSize.combineDescription} - ${itemPackType.packDescription}`;
        default:
          return isTag
            ? commonSpeciesTag?.tagText
            : itemSpecies.speciesDescription;
      }
    };
    const text = getText() || 'Other';

    const restParams = values(
      mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
    )
      .filter((value) => value)
      .join('&');
    const restParamString = restParams ? `${restParams}&` : '';

    const existingCategoriesParam = categoryTypeOrder
      .filter((type) => {
        switch (type) {
          case 'variety':
            return !!variety;
          case 'size':
            return !!size;
          case 'packType':
            return !!packType;
          case 'plu':
            return !!plu;
          case 'shipper':
            return !!shipper;
          case 'countryOfOrigin':
            return !!countryOfOrigin;
          case 'program':
            return !!program;
          case 'sizePackType':
            return !!sizePackType;
          default:
            return !!species;
        }
      })
      .map((type) => {
        switch (type) {
          case 'variety':
            const varietyTagString = varietyTag
              ? `&varietyTag=${encodeURIComponent(varietyTag)}`
              : '';
            return `variety=${encodeURIComponent(
              variety || '',
            )}${varietyTagString}`;
          case 'size':
            const sizeTagString = sizeTag
              ? `&sizeTag=${encodeURIComponent(sizeTag)}`
              : '';
            return `size=${encodeURIComponent(size || '')}${sizeTagString}`;
          case 'packType':
            const packTypeTagString = packTypeTag
              ? `&packTypeTag=${encodeURIComponent(packTypeTag)}`
              : '';
            return `packType=${encodeURIComponent(
              packType || '',
            )}${packTypeTagString}`;
          case 'plu':
            return `plu=${encodeURIComponent(plu || '')}`;
          case 'shipper':
            return `shipper=${encodeURIComponent(shipper || '')}`;
          case 'countryOfOrigin':
            return `countryOfOrigin=${encodeURIComponent(
              countryOfOrigin || '',
            )}`;
          case 'program':
            return `program=${encodeURIComponent(program || 'no program')}`;
          case 'sizePackType':
            return `sizePackType=${encodeURIComponent(sizePackType || '')}`;
          default:
            const speciesTagString = speciesTag
              ? `&speciesTag=${encodeURIComponent(speciesTag)}`
              : '';
            return `species=${encodeURIComponent(
              species || '',
            )}${speciesTagString}`;
        }
      })
      .join('&');
    const existingCategoriesParamString = existingCategoriesParam
      ? `${existingCategoriesParam}&`
      : '';

    const getDefaultNextSortKey = () => {
      switch (categoryType) {
        case 'variety':
          return commonVariety?.defaultInvSortKey;
        case 'size':
          return commonSize?.defaultInvSortKey;
        case 'packType':
          return commonPackType?.defaultInvSortKey;
        case 'species':
          return commonSpecies?.defaultInvSortKey;
        default:
          return undefined;
      }
    };
    const defaultInvSortKey = getDefaultNextSortKey() || '';

    const nextCategoryType =
      (!params[defaultInvSortKey as keyof typeof params] &&
        defaultInvSortKey) ||
      categoryTypeOrder
        .filter((type) => type !== categoryType)
        .find((type) => {
          switch (type) {
            case 'variety':
              return !variety;
            case 'size':
              return !size;
            case 'packType':
              return !packType;
            case 'plu':
              return !plu;
            case 'shipper':
              return !shipper;
            case 'countryOfOrigin':
              return !countryOfOrigin;
            case 'program':
              return !program;
            case 'sizePackType':
              return !sizePackType;
            default:
              return !species;
          }
        });

    const nextCategoryString = `${categoryType}=${encodeURIComponent(
      id || '',
    )}&categoryTypes=${categoryTypes},${nextCategoryType}`;

    const getTagText = () => {
      switch (categoryType) {
        case 'variety':
          return commonVarietyTag?.tagText || '';
        case 'size':
          return commonSizeTag?.tagText || '';
        case 'packType':
          return commonPackTypeTag?.tagText || '';
        case 'species':
          return commonSpeciesTag?.tagText || '';
        default:
          return '';
      }
    };
    const tagText = getTagText();

    const getTagLink = (isTagLink: boolean) => {
      switch (categoryType) {
        case 'variety':
          return !isTag || (isTagLink && varietyTag === tagText)
            ? ''
            : `&varietyTag=${encodeURIComponent(tagText)}`;
        case 'size':
          return !isTag || (isTagLink && sizeTag === tagText)
            ? ''
            : `&sizeTag=${encodeURIComponent(tagText)}`;
        case 'packType':
          return !isTag || (isTagLink && packTypeTag === tagText)
            ? ''
            : `&packTypeTag=${encodeURIComponent(tagText)}`;
        case 'species':
          return !isTag || (isTagLink && speciesTag === tagText)
            ? ''
            : `&speciesTag=${encodeURIComponent(tagText)}`;
        default:
          return '';
      }
    };

    const baseLink = `/inventory/index?${restParamString}${existingCategoriesParamString}`;

    const link = `${baseLink}${nextCategoryString}${getTagLink(false)}`;

    const tagLink = isTag
      ? `${baseLink}categoryTypes=${categoryTypes}${getTagLink(true)}`
      : undefined;

    return {
      id,
      defaultInvSortKey,
      link,
      tagLink,
      tagText: isTag ? tagText : undefined,
      text,
    };
  };

export const getInventoryItemDescription = (
  inventoryItem: InventoryItem,
  options?: {
    species?: boolean;
    variety?: boolean;
    size?: boolean;
    packType?: boolean;
    plu?: boolean;
    label?: boolean;
    program?: boolean;
  },
) => {
  const { species, variety, size, packType, plu, label, program } =
    options || {};
  return `${
    species ? '' : inventoryItem.product?.species?.speciesDescription + ', '
  }${variety ? '' : inventoryItem.product?.variety?.varietyDescription + ', '}${
    size
      ? ''
      : inventoryItem.product?.sizes.nodes?.[0]?.combineDescription + ', '
  }${packType ? '' : inventoryItem.product?.packType?.packDescription + ', '}${
    plu ? '' : (inventoryItem.plu ? 'PLU' : 'No PLU') + ', '
  }${label ? '' : inventoryItem.product?.packType?.label?.labelName + ', '}${
    program
      ? ''
      : inventoryItem.product?.packType?.customerSpecial?.customerName + ', '
  }`;
};
