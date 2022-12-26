import { ApolloError } from '@apollo/client';
import {
  Customer,
  CustomerProgram,
  CustomerProgramEntry,
  Maybe,
  Shipper,
  ShipperProgram,
  ShipperProgramEntry,
  ShipperProjectionVesselInfo,
} from 'types';

export interface ProgramTotal {
  total: number;
  available: number | null;
  projected: number | null;
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
  | 'customerId'
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
  | 'customerId'
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
  showAllocated: boolean;
}

export interface ProgramProps {
  allocateState: AllocateState;
  allocatedStartDate: Date;
  allocatedEndDate: Date;
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
  duplicateProgramIds: number[];
  customerPrograms: CustomerProgram[];
  customers: Customer[];
  editing: boolean;
  error?: ApolloError;
  handleRemoveItem: (key: keyof RemovedItems, id: number) => void;
  handleWeekRangeChange: (
    key: 'start' | 'end',
    value: string,
    referenceDate: Date,
  ) => void;
  isCustomers: boolean;
  loading: boolean;
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
  selectedCustomer?: Maybe<Customer> | undefined;
  selectedShipper?: Maybe<Shipper> | undefined;
  selectedWeekNumber: number;
  setAllocateState: (state: AllocateState) => void;
  shipperPrograms: ShipperProgram[];
  showAllocated: boolean;
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
  vesselInfos: ShipperProjectionVesselInfo[];
  weekCount: number;
}

export interface AllocateState {
  entry?: CustomerProgramEntry | ShipperProgramEntry;
  program?: CustomerProgram | ShipperProgram;
  isOpen: boolean;
}
