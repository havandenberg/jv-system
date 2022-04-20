import {
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  ShipperProgram,
  ShipperProgramEntry,
} from 'types';

export interface CollapsedItems {
  shipperPrograms: number[];
  customerPrograms: number[];
}

export type ShipperProgramUpdate = Pick<
  ShipperProgram,
  | 'id'
  | 'arrivalPort'
  | 'commonSpeciesId'
  | 'commonVarietyId'
  | 'commonSizeId'
  | 'commonPackTypeId'
  | 'plu'
  | 'shipperId'
>;
export type ShipperProgramEntryUpdate = Pick<
  ShipperProgramEntry,
  | 'id'
  | 'notes'
  | 'programDate'
  | 'palletCount'
  | 'shipperProgramId'
  | 'shipperProgram'
>;
export type CustomerProgramUpdate = Pick<
  CustomerProgram,
  | 'id'
  | 'arrivalPort'
  | 'commonSpeciesId'
  | 'commonVarietyId'
  | 'commonSizeId'
  | 'commonPackTypeId'
  | 'plu'
  | 'customerId'
>;
export type CustomerProgramEntryUpdate = Pick<
  CustomerProgramEntry,
  | 'id'
  | 'notes'
  | 'programDate'
  | 'palletCount'
  | 'customerProgramId'
  | 'customerProgram'
>;
export type UpdateType =
  | ShipperProgramUpdate
  | ShipperProgramEntryUpdate
  | CustomerProgramUpdate
  | CustomerProgramEntryUpdate;

export type NewShipperProgram = Pick<
  ShipperProgram,
  | 'id'
  | 'arrivalPort'
  | 'commonSpeciesId'
  | 'commonVarietyId'
  | 'commonSizeId'
  | 'commonPackTypeId'
  | 'plu'
  | 'shipperId'
>;
export type NewCustomerProgram = Pick<
  CustomerProgram,
  | 'id'
  | 'arrivalPort'
  | 'commonSpeciesId'
  | 'commonVarietyId'
  | 'commonSizeId'
  | 'commonPackTypeId'
  | 'plu'
  | 'customerId'
>;
export type NewShipperProgramEntry = Pick<
  ShipperProgramEntry,
  | 'id'
  | 'notes'
  | 'programDate'
  | 'palletCount'
  | 'shipperProgramId'
  | 'shipperProgram'
>;
export type NewCustomerProgramEntry = Pick<
  CustomerProgramEntry,
  | 'id'
  | 'notes'
  | 'programDate'
  | 'palletCount'
  | 'customerProgramId'
  | 'customerProgram'
>;

export interface ProgramChanges {
  shipperProgramUpdates: ShipperProgramUpdate[];
  customerProgramUpdates: CustomerProgramUpdate[];
  shipperProgramEntryUpdates: ShipperProgramEntryUpdate[];
  customerProgramEntryUpdates: CustomerProgramEntryUpdate[];
  newShipperPrograms: NewShipperProgram[];
  newCustomerPrograms: NewCustomerProgram[];
  newShipperProgramEntries: NewShipperProgramEntry[];
  newCustomerProgramEntries: NewCustomerProgramEntry[];
}

export interface RemovedItem {
  id: number;
}

export interface RemovedItems {
  shipperPrograms: RemovedItem[];
  customerPrograms: RemovedItem[];
}

export interface NewItemNextIds {
  shipperProgram: number;
  customerProgram: number;
  shipperProgramEntry: number;
  customerProgramEntry: number;
}

export interface ProgramState {
  changes: ProgramChanges;
  editing: boolean;
  newItemNextIds: NewItemNextIds;
  removedItems: RemovedItems;
}

export interface ProgramProps {
  changeHandlers: {
    handleShipperProgramChange: (update: ShipperProgramUpdate) => void;
    handleCustomerProgramChange: (update: CustomerProgramUpdate) => void;
    handleShipperProgramEntryChange: (
      update: ShipperProgramEntryUpdate,
    ) => void;
    handleCustomerProgramEntryChange: (
      update: CustomerProgramEntryUpdate,
    ) => void;
  };
  editing: boolean;
  handleRemoveItem: (key: keyof RemovedItems, id: number) => void;
  isItemCollapsed: (key: keyof CollapsedItems, id: number) => boolean;
  newItemHandlers: {
    handleNewShipperProgram: (newShipperProgram: NewShipperProgram) => void;
    handleNewCustomerProgram: (newCustomerProgram: NewCustomerProgram) => void;
    handleNewShipperProgramEntry: (
      newShipperProgramEntry: NewShipperProgramEntry,
    ) => void;
    handleNewCustomerProgramEntry: (
      newCustomerProgramEntry: NewCustomerProgramEntry,
    ) => void;
  };
  selectedWeekNumber: number;
  toggleCollapseItem: (key: keyof CollapsedItems, id: number) => void;
  valueGetters: {
    getShipperProgramValue: (
      shipperProgram: Maybe<ShipperProgram> | undefined,
      key: keyof ShipperProgramUpdate,
    ) => { dirty: boolean; value: string };
    getCustomerProgramValue: (
      customerProgram: Maybe<CustomerProgram> | undefined,
      key: keyof CustomerProgramUpdate,
    ) => { dirty: boolean; value: string };
    getShipperProgramEntryValue: (
      shipperProgramEntry: Maybe<ShipperProgramEntry> | undefined,
      key: keyof ShipperProgramEntryUpdate,
    ) => { dirty: boolean; value: string };
    getCustomerProgramEntryValue: (
      customerProgramEntry: Maybe<CustomerProgramEntry> | undefined,
      key: keyof CustomerProgramEntryUpdate,
    ) => { dirty: boolean; value: string };
  };
  weekCount: number;
}
