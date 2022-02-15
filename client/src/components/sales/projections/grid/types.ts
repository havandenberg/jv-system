import {
  Maybe,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVessel,
} from 'types';

export type VesselUpdate = Pick<
  ShipperProjectionVessel,
  | 'id'
  | 'vesselName'
  | 'departureDate'
  | 'arrivalDate'
  | 'arrivalPort'
  | 'vesselStatus'
>;
export type ProductUpdate = Pick<
  ShipperProjectionProduct,
  'id' | 'species' | 'variety' | 'size' | 'packType' | 'plu'
>;
export type EntryUpdate = Pick<
  ShipperProjectionEntry,
  'id' | 'palletCount' | 'shipperProjectionId'
>;
export type UpdateType = VesselUpdate | ProductUpdate | EntryUpdate;

export type NewVessel = Pick<
  ShipperProjectionVessel,
  | 'id'
  | 'vesselName'
  | 'departureDate'
  | 'arrivalDate'
  | 'arrivalPort'
  | 'vesselStatus'
  | 'shipperProjectionEntriesByVesselId'
>;
export type NewProduct = Pick<
  ShipperProjectionProduct,
  'id' | 'species' | 'variety' | 'size' | 'packType' | 'plu' | 'shipperId'
>;
export type NewEntry = Pick<
  ShipperProjectionEntry,
  'id' | 'palletCount' | 'productId' | 'vesselId' | 'shipperProjectionId'
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
  newItemHandlers: {
    handleNewVessel: (newVessel: NewVessel) => void;
    handleNewProduct: (newProduct: NewProduct) => void;
  };
  removeItemHandlers: {
    handleRemoveNewVessel: (id: number) => void;
    handleRemoveProduct: (id: number) => void;
  };
  selectedShipper?: string;
  valueGetters: {
    getVesselValue: (
      vessel: Maybe<ShipperProjectionVessel> | undefined,
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
