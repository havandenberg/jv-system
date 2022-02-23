import {
  Maybe,
  Shipper,
  ShipperProjection,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';

export type VesselUpdate = Pick<
  ShipperProjectionVesselInfo,
  | 'id'
  | 'vesselName'
  | 'departureDate'
  | 'arrivalDate'
  | 'arrivalPort'
  | 'vesselStatus'
  | 'shipperId'
  | 'projectionId'
  | 'vesselId'
>;
export type ProductUpdate = Pick<
  ShipperProjectionProduct,
  'id' | 'species' | 'variety' | 'size' | 'packType' | 'plu'
>;
export type EntryUpdate = Pick<
  ShipperProjectionEntry,
  'id' | 'palletCount' | 'vesselInfoId' | 'productId'
>;
export type UpdateType = VesselUpdate | ProductUpdate | EntryUpdate;

export type NewVessel = Pick<
  ShipperProjectionVesselInfo,
  | 'id'
  | 'vesselName'
  | 'departureDate'
  | 'arrivalDate'
  | 'arrivalPort'
  | 'vesselStatus'
  | 'shipperProjectionEntriesByVesselInfoId'
  | 'shipperId'
  | 'projectionId'
  | 'vesselId'
>;
export type NewProduct = Pick<
  ShipperProjectionProduct,
  'id' | 'species' | 'variety' | 'size' | 'packType' | 'plu' | 'shipperId'
>;
export type NewEntry = Pick<
  ShipperProjectionEntry,
  'id' | 'palletCount' | 'productId' | 'vesselInfoId'
>;

export interface ShipperProjectionGridChanges {
  vesselUpdates: VesselUpdate[];
  productUpdates: ProductUpdate[];
  entryUpdates: EntryUpdate[];
  newVessels: NewVessel[];
  newProducts: NewProduct[];
  newEntries: NewEntry[];
}

export interface NewItemNextIds {
  vessel: number;
  product: number;
  entry: number;
}

export interface ShipperProjectionGridState {
  changes: ShipperProjectionGridChanges;
  newItemNextIds: NewItemNextIds;
  removedProductIds: number[];
  skippedWeeks: string[];
}

export interface ShipperProjectionGridProps {
  changeHandlers: {
    handleVesselChange: (update: VesselUpdate) => void;
    handleEntryChange: (update: EntryUpdate) => void;
    handleProductChange: (update: ProductUpdate) => void;
  };
  currentProjection?: Maybe<ShipperProjection>;
  newItemHandlers: {
    handleNewVessel: (newVessel: NewVessel) => void;
    handleNewProduct: (newProduct: NewProduct) => void;
  };
  removeItemHandlers: {
    handleRemoveNewVessel: (id: number) => void;
    handleRemoveProduct: (id: number) => void;
  };
  selectedShipper?: Maybe<Shipper>;
  valueGetters: {
    getVesselValue: (
      vessel: Maybe<ShipperProjectionVesselInfo> | undefined,
      key: keyof VesselUpdate,
    ) => { dirty: boolean; value: string };
    getProductValue: (
      product: Maybe<ShipperProjectionProduct> | undefined,
      key: keyof ProductUpdate,
    ) => { dirty: boolean; value: string };
    getEntryValue: (
      entry: Maybe<ShipperProjectionEntry> | undefined,
      key: keyof EntryUpdate,
      defaultValue?: string,
    ) => { dirty: boolean; value: string };
  };
}

export type ShipperProjectionProductWithEntries = ShipperProjectionProduct & {
  entries: ShipperProjectionEntry[];
};
