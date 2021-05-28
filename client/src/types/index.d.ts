export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: any;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /** The day, does not include a time. */
  Date: any;
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: any;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Country`. */
  countries?: Maybe<CountriesConnection>;
  /** Reads and enables pagination through a set of `Customer`. */
  customers?: Maybe<CustomersConnection>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts?: Maybe<PersonContactsConnection>;
  /** Reads and enables pagination through a set of `Shipper`. */
  shippers?: Maybe<ShippersConnection>;
  /** Reads and enables pagination through a set of `Warehouse`. */
  warehouses?: Maybe<WarehousesConnection>;
  /** Reads and enables pagination through a set of `AgendaItem`. */
  agendaItems?: Maybe<AgendaItemsConnection>;
  /** Reads and enables pagination through a set of `PriceCategory`. */
  priceCategories?: Maybe<PriceCategoriesConnection>;
  /** Reads and enables pagination through a set of `PriceEntry`. */
  priceEntries?: Maybe<PriceEntriesConnection>;
  /** Reads and enables pagination through a set of `PriceProduct`. */
  priceProducts?: Maybe<PriceProductsConnection>;
  /** Reads and enables pagination through a set of `PriceSize`. */
  priceSizes?: Maybe<PriceSizesConnection>;
  /** Reads and enables pagination through a set of `ChileDepartureInspectionPallet`. */
  chileDepartureInspectionPallets?: Maybe<ChileDepartureInspectionPalletsConnection>;
  /** Reads and enables pagination through a set of `PeruDepartureInspection`. */
  peruDepartureInspections?: Maybe<PeruDepartureInspectionsConnection>;
  /** Reads and enables pagination through a set of `PeruDepartureInspectionPallet`. */
  peruDepartureInspectionPallets?: Maybe<PeruDepartureInspectionPalletsConnection>;
  country?: Maybe<Country>;
  customer?: Maybe<Customer>;
  personContact?: Maybe<PersonContact>;
  shipper?: Maybe<Shipper>;
  warehouse?: Maybe<Warehouse>;
  agendaItem?: Maybe<AgendaItem>;
  priceCategory?: Maybe<PriceCategory>;
  priceEntry?: Maybe<PriceEntry>;
  priceProduct?: Maybe<PriceProduct>;
  priceSize?: Maybe<PriceSize>;
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  distinctValues?: Maybe<DistinctValuesConnection>;
  customerDistinctValues?: Maybe<CustomerDistinctValuesConnection>;
  /** Reads and enables pagination through a set of `ChileDepartureInspection`. */
  chileDepartureInspections?: Maybe<ChileDepartureInspectionsConnection>;
  /** Reads a single `Country` using its globally unique `ID`. */
  countryByNodeId?: Maybe<Country>;
  /** Reads a single `Customer` using its globally unique `ID`. */
  customerByNodeId?: Maybe<Customer>;
  /** Reads a single `PersonContact` using its globally unique `ID`. */
  personContactByNodeId?: Maybe<PersonContact>;
  /** Reads a single `Shipper` using its globally unique `ID`. */
  shipperByNodeId?: Maybe<Shipper>;
  /** Reads a single `Warehouse` using its globally unique `ID`. */
  warehouseByNodeId?: Maybe<Warehouse>;
  /** Reads a single `AgendaItem` using its globally unique `ID`. */
  agendaItemByNodeId?: Maybe<AgendaItem>;
  /** Reads a single `PriceCategory` using its globally unique `ID`. */
  priceCategoryByNodeId?: Maybe<PriceCategory>;
  /** Reads a single `PriceEntry` using its globally unique `ID`. */
  priceEntryByNodeId?: Maybe<PriceEntry>;
  /** Reads a single `PriceProduct` using its globally unique `ID`. */
  priceProductByNodeId?: Maybe<PriceProduct>;
  /** Reads a single `PriceSize` using its globally unique `ID`. */
  priceSizeByNodeId?: Maybe<PriceSize>;
  /** Reads a single `ChileDepartureInspectionPallet` using its globally unique `ID`. */
  chileDepartureInspectionPalletByNodeId?: Maybe<ChileDepartureInspectionPallet>;
  /** Reads a single `PeruDepartureInspection` using its globally unique `ID`. */
  peruDepartureInspectionByNodeId?: Maybe<PeruDepartureInspection>;
  /** Reads a single `PeruDepartureInspectionPallet` using its globally unique `ID`. */
  peruDepartureInspectionPalletByNodeId?: Maybe<PeruDepartureInspectionPallet>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCountriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CountriesOrderBy>>;
  condition?: Maybe<CountryCondition>;
  filter?: Maybe<CountryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCustomersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CustomersOrderBy>>;
  condition?: Maybe<CustomerCondition>;
  filter?: Maybe<CustomerFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryShippersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ShippersOrderBy>>;
  condition?: Maybe<ShipperCondition>;
  filter?: Maybe<ShipperFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWarehousesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
  condition?: Maybe<WarehouseCondition>;
  filter?: Maybe<WarehouseFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAgendaItemsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AgendaItemsOrderBy>>;
  condition?: Maybe<AgendaItemCondition>;
  filter?: Maybe<AgendaItemFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceCategoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceCategoriesOrderBy>>;
  condition?: Maybe<PriceCategoryCondition>;
  filter?: Maybe<PriceCategoryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceEntriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceEntriesOrderBy>>;
  condition?: Maybe<PriceEntryCondition>;
  filter?: Maybe<PriceEntryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceProductsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceProductsOrderBy>>;
  condition?: Maybe<PriceProductCondition>;
  filter?: Maybe<PriceProductFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceSizesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceSizesOrderBy>>;
  condition?: Maybe<PriceSizeCondition>;
  filter?: Maybe<PriceSizeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChileDepartureInspectionPalletsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ChileDepartureInspectionPalletsOrderBy>>;
  condition?: Maybe<ChileDepartureInspectionPalletCondition>;
  filter?: Maybe<ChileDepartureInspectionPalletFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PeruDepartureInspectionsOrderBy>>;
  condition?: Maybe<PeruDepartureInspectionCondition>;
  filter?: Maybe<PeruDepartureInspectionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionPalletsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PeruDepartureInspectionPalletsOrderBy>>;
  condition?: Maybe<PeruDepartureInspectionPalletCondition>;
  filter?: Maybe<PeruDepartureInspectionPalletFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCountryArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCustomerArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonContactArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryShipperArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWarehouseArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAgendaItemArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceCategoryArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceEntryArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceProductArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceSizeArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChileDepartureInspectionPalletArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionArgs = {
  containerId: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionPalletArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryDistinctValuesArgs = {
  schemaName?: Maybe<Scalars['String']>;
  tableName?: Maybe<Scalars['String']>;
  columnName?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  filter?: Maybe<StringFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCustomerDistinctValuesArgs = {
  columnName?: Maybe<Scalars['String']>;
  conditionName?: Maybe<Scalars['String']>;
  conditionValue?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  filter?: Maybe<StringFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChileDepartureInspectionsArgs = {
  orderBy?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  filter?: Maybe<ChileDepartureInspectionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCountryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCustomerByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonContactByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryShipperByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWarehouseByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAgendaItemByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceCategoryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceEntryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceProductByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPriceSizeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChileDepartureInspectionPalletByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPeruDepartureInspectionPalletByNodeIdArgs = {
  nodeId: Scalars['ID'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** A connection to a list of `Country` values. */
export type CountriesConnection = {
  __typename?: 'CountriesConnection';
  /** A list of `Country` objects. */
  nodes: Array<Maybe<Country>>;
  /** A list of edges which contains the `Country` and cursor to aid in pagination. */
  edges: Array<CountriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Country` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Country = Node & {
  __typename?: 'Country';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  countryName: Scalars['String'];
  /** Reads and enables pagination through a set of `Warehouse`. */
  warehouses: WarehousesConnection;
  /** Reads and enables pagination through a set of `Customer`. */
  customers: CustomersConnection;
  /** Reads and enables pagination through a set of `Shipper`. */
  shippers: ShippersConnection;
};


export type CountryWarehousesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
  condition?: Maybe<WarehouseCondition>;
  filter?: Maybe<WarehouseFilter>;
};


export type CountryCustomersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CustomersOrderBy>>;
  condition?: Maybe<CustomerCondition>;
  filter?: Maybe<CustomerFilter>;
};


export type CountryShippersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ShippersOrderBy>>;
  condition?: Maybe<ShipperCondition>;
  filter?: Maybe<ShipperFilter>;
};

/** A connection to a list of `Warehouse` values. */
export type WarehousesConnection = {
  __typename?: 'WarehousesConnection';
  /** A list of `Warehouse` objects. */
  nodes: Array<Maybe<Warehouse>>;
  /** A list of edges which contains the `Warehouse` and cursor to aid in pagination. */
  edges: Array<WarehousesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Warehouse` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Warehouse = Node & {
  __typename?: 'Warehouse';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  warehouseName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  /** Reads a single `Country` that is related to this `Warehouse`. */
  country?: Maybe<Country>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
  searchText?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Shipper`. */
  shippersByPersonContactWarehouseIdAndShipperId: WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Customer`. */
  customersByPersonContactWarehouseIdAndCustomerId: WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyConnection;
};


export type WarehousePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};


export type WarehouseShippersByPersonContactWarehouseIdAndShipperIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ShippersOrderBy>>;
  condition?: Maybe<ShipperCondition>;
  filter?: Maybe<ShipperFilter>;
};


export type WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CustomersOrderBy>>;
  condition?: Maybe<CustomerCondition>;
  filter?: Maybe<CustomerFilter>;
};

/** A connection to a list of `PersonContact` values. */
export type PersonContactsConnection = {
  __typename?: 'PersonContactsConnection';
  /** A list of `PersonContact` objects. */
  nodes: Array<Maybe<PersonContact>>;
  /** A list of edges which contains the `PersonContact` and cursor to aid in pagination. */
  edges: Array<PersonContactsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PersonContact` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PersonContact = Node & {
  __typename?: 'PersonContact';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  shipperId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isPrimary: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal: Scalars['Boolean'];
  roles?: Maybe<Scalars['String']>;
  /** Reads a single `Shipper` that is related to this `PersonContact`. */
  shipper?: Maybe<Shipper>;
  /** Reads a single `Customer` that is related to this `PersonContact`. */
  customer?: Maybe<Customer>;
  /** Reads a single `Warehouse` that is related to this `PersonContact`. */
  warehouse?: Maybe<Warehouse>;
  searchText?: Maybe<Scalars['String']>;
};


export type Shipper = Node & {
  __typename?: 'Shipper';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  shipperName: Scalars['String'];
  countryId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  /** Reads a single `Country` that is related to this `Shipper`. */
  country?: Maybe<Country>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
  searchText?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Customer`. */
  customersByPersonContactShipperIdAndCustomerId: ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Warehouse`. */
  warehousesByPersonContactShipperIdAndWarehouseId: ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyConnection;
};


export type ShipperPersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};


export type ShipperCustomersByPersonContactShipperIdAndCustomerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<CustomersOrderBy>>;
  condition?: Maybe<CustomerCondition>;
  filter?: Maybe<CustomerFilter>;
};


export type ShipperWarehousesByPersonContactShipperIdAndWarehouseIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
  condition?: Maybe<WarehouseCondition>;
  filter?: Maybe<WarehouseFilter>;
};


/** Methods to use when ordering `PersonContact`. */
export enum PersonContactsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  CustomerIdAsc = 'CUSTOMER_ID_ASC',
  CustomerIdDesc = 'CUSTOMER_ID_DESC',
  WarehouseIdAsc = 'WAREHOUSE_ID_ASC',
  WarehouseIdDesc = 'WAREHOUSE_ID_DESC',
  FirstNameAsc = 'FIRST_NAME_ASC',
  FirstNameDesc = 'FIRST_NAME_DESC',
  LastNameAsc = 'LAST_NAME_ASC',
  LastNameDesc = 'LAST_NAME_DESC',
  IsPrimaryAsc = 'IS_PRIMARY_ASC',
  IsPrimaryDesc = 'IS_PRIMARY_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  SecondaryEmailAsc = 'SECONDARY_EMAIL_ASC',
  SecondaryEmailDesc = 'SECONDARY_EMAIL_DESC',
  HomePhoneAsc = 'HOME_PHONE_ASC',
  HomePhoneDesc = 'HOME_PHONE_DESC',
  CellPhoneAsc = 'CELL_PHONE_ASC',
  CellPhoneDesc = 'CELL_PHONE_DESC',
  WorkPhoneAsc = 'WORK_PHONE_ASC',
  WorkPhoneDesc = 'WORK_PHONE_DESC',
  WorkExtensionAsc = 'WORK_EXTENSION_ASC',
  WorkExtensionDesc = 'WORK_EXTENSION_DESC',
  ImageSrcAsc = 'IMAGE_SRC_ASC',
  ImageSrcDesc = 'IMAGE_SRC_DESC',
  IsInternalAsc = 'IS_INTERNAL_ASC',
  IsInternalDesc = 'IS_INTERNAL_DESC',
  RolesAsc = 'ROLES_ASC',
  RolesDesc = 'ROLES_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PersonContact` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PersonContactCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `warehouseId` field. */
  warehouseId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `isPrimary` field. */
  isPrimary?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `secondaryEmail` field. */
  secondaryEmail?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `homePhone` field. */
  homePhone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `cellPhone` field. */
  cellPhone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `workPhone` field. */
  workPhone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `workExtension` field. */
  workExtension?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `imageSrc` field. */
  imageSrc?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `isInternal` field. */
  isInternal?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `roles` field. */
  roles?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PersonContact` object types. All fields are combined with a logical ‘and.’ */
export type PersonContactFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<StringFilter>;
  /** Filter by the object’s `warehouseId` field. */
  warehouseId?: Maybe<StringFilter>;
  /** Filter by the object’s `firstName` field. */
  firstName?: Maybe<StringFilter>;
  /** Filter by the object’s `lastName` field. */
  lastName?: Maybe<StringFilter>;
  /** Filter by the object’s `isPrimary` field. */
  isPrimary?: Maybe<BooleanFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `secondaryEmail` field. */
  secondaryEmail?: Maybe<StringFilter>;
  /** Filter by the object’s `homePhone` field. */
  homePhone?: Maybe<StringFilter>;
  /** Filter by the object’s `cellPhone` field. */
  cellPhone?: Maybe<StringFilter>;
  /** Filter by the object’s `workPhone` field. */
  workPhone?: Maybe<StringFilter>;
  /** Filter by the object’s `workExtension` field. */
  workExtension?: Maybe<StringFilter>;
  /** Filter by the object’s `imageSrc` field. */
  imageSrc?: Maybe<StringFilter>;
  /** Filter by the object’s `isInternal` field. */
  isInternal?: Maybe<BooleanFilter>;
  /** Filter by the object’s `roles` field. */
  roles?: Maybe<StringFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `shipper` relation. */
  shipper?: Maybe<ShipperFilter>;
  /** A related `shipper` exists. */
  shipperExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `customer` relation. */
  customer?: Maybe<CustomerFilter>;
  /** A related `customer` exists. */
  customerExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `warehouse` relation. */
  warehouse?: Maybe<WarehouseFilter>;
  /** A related `warehouse` exists. */
  warehouseExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PersonContactFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PersonContactFilter>>;
  /** Negates the expression. */
  not?: Maybe<PersonContactFilter>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['BigInt']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['BigInt']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['BigInt']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['BigInt']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['BigInt']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['BigInt']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['BigInt']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['BigInt']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['BigInt']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Boolean']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Boolean']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Boolean']>;
};

/** A filter to be used against `Shipper` object types. All fields are combined with a logical ‘and.’ */
export type ShipperFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperName` field. */
  shipperName?: Maybe<StringFilter>;
  /** Filter by the object’s `countryId` field. */
  countryId?: Maybe<StringFilter>;
  /** Filter by the object’s `groupId` field. */
  groupId?: Maybe<StringFilter>;
  /** Filter by the object’s `logoSrc` field. */
  logoSrc?: Maybe<StringFilter>;
  /** Filter by the object’s `notes` field. */
  notes?: Maybe<StringFilter>;
  /** Filter by the object’s `website` field. */
  website?: Maybe<StringFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `personContacts` relation. */
  personContacts?: Maybe<ShipperToManyPersonContactFilter>;
  /** Some related `personContacts` exist. */
  personContactsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `country` relation. */
  country?: Maybe<CountryFilter>;
  /** A related `country` exists. */
  countryExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ShipperFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ShipperFilter>>;
  /** Negates the expression. */
  not?: Maybe<ShipperFilter>;
};

/** A filter to be used against many `PersonContact` object types. All fields are combined with a logical ‘and.’ */
export type ShipperToManyPersonContactFilter = {
  /** Every related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PersonContactFilter>;
  /** Some related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PersonContactFilter>;
  /** No related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PersonContactFilter>;
};

/** A filter to be used against `Country` object types. All fields are combined with a logical ‘and.’ */
export type CountryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `countryName` field. */
  countryName?: Maybe<StringFilter>;
  /** Filter by the object’s `warehouses` relation. */
  warehouses?: Maybe<CountryToManyWarehouseFilter>;
  /** Some related `warehouses` exist. */
  warehousesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `customers` relation. */
  customers?: Maybe<CountryToManyCustomerFilter>;
  /** Some related `customers` exist. */
  customersExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `shippers` relation. */
  shippers?: Maybe<CountryToManyShipperFilter>;
  /** Some related `shippers` exist. */
  shippersExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<CountryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<CountryFilter>>;
  /** Negates the expression. */
  not?: Maybe<CountryFilter>;
};

/** A filter to be used against many `Warehouse` object types. All fields are combined with a logical ‘and.’ */
export type CountryToManyWarehouseFilter = {
  /** Every related `Warehouse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<WarehouseFilter>;
  /** Some related `Warehouse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<WarehouseFilter>;
  /** No related `Warehouse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<WarehouseFilter>;
};

/** A filter to be used against `Warehouse` object types. All fields are combined with a logical ‘and.’ */
export type WarehouseFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `warehouseName` field. */
  warehouseName?: Maybe<StringFilter>;
  /** Filter by the object’s `address1` field. */
  address1?: Maybe<StringFilter>;
  /** Filter by the object’s `address2` field. */
  address2?: Maybe<StringFilter>;
  /** Filter by the object’s `address3` field. */
  address3?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `postalState` field. */
  postalState?: Maybe<StringFilter>;
  /** Filter by the object’s `countryId` field. */
  countryId?: Maybe<StringFilter>;
  /** Filter by the object’s `zipCode` field. */
  zipCode?: Maybe<StringFilter>;
  /** Filter by the object’s `phone` field. */
  phone?: Maybe<StringFilter>;
  /** Filter by the object’s `outQueue` field. */
  outQueue?: Maybe<StringFilter>;
  /** Filter by the object’s `stateTaxCode` field. */
  stateTaxCode?: Maybe<StringFilter>;
  /** Filter by the object’s `countyTaxCode` field. */
  countyTaxCode?: Maybe<StringFilter>;
  /** Filter by the object’s `cityTaxCode` field. */
  cityTaxCode?: Maybe<StringFilter>;
  /** Filter by the object’s `miscTaxCode` field. */
  miscTaxCode?: Maybe<StringFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `personContacts` relation. */
  personContacts?: Maybe<WarehouseToManyPersonContactFilter>;
  /** Some related `personContacts` exist. */
  personContactsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `country` relation. */
  country?: Maybe<CountryFilter>;
  /** A related `country` exists. */
  countryExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<WarehouseFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<WarehouseFilter>>;
  /** Negates the expression. */
  not?: Maybe<WarehouseFilter>;
};

/** A filter to be used against many `PersonContact` object types. All fields are combined with a logical ‘and.’ */
export type WarehouseToManyPersonContactFilter = {
  /** Every related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PersonContactFilter>;
  /** Some related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PersonContactFilter>;
  /** No related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PersonContactFilter>;
};

/** A filter to be used against many `Customer` object types. All fields are combined with a logical ‘and.’ */
export type CountryToManyCustomerFilter = {
  /** Every related `Customer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<CustomerFilter>;
  /** Some related `Customer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<CustomerFilter>;
  /** No related `Customer` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<CustomerFilter>;
};

/** A filter to be used against `Customer` object types. All fields are combined with a logical ‘and.’ */
export type CustomerFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `customerName` field. */
  customerName?: Maybe<StringFilter>;
  /** Filter by the object’s `address1` field. */
  address1?: Maybe<StringFilter>;
  /** Filter by the object’s `address2` field. */
  address2?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<StringFilter>;
  /** Filter by the object’s `postalState` field. */
  postalState?: Maybe<StringFilter>;
  /** Filter by the object’s `zipCode` field. */
  zipCode?: Maybe<StringFilter>;
  /** Filter by the object’s `countryId` field. */
  countryId?: Maybe<StringFilter>;
  /** Filter by the object’s `phone` field. */
  phone?: Maybe<StringFilter>;
  /** Filter by the object’s `logoSrc` field. */
  logoSrc?: Maybe<StringFilter>;
  /** Filter by the object’s `notes` field. */
  notes?: Maybe<StringFilter>;
  /** Filter by the object’s `website` field. */
  website?: Maybe<StringFilter>;
  /** Filter by the object’s `active` field. */
  active?: Maybe<BooleanFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `personContacts` relation. */
  personContacts?: Maybe<CustomerToManyPersonContactFilter>;
  /** Some related `personContacts` exist. */
  personContactsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `country` relation. */
  country?: Maybe<CountryFilter>;
  /** A related `country` exists. */
  countryExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<CustomerFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<CustomerFilter>>;
  /** Negates the expression. */
  not?: Maybe<CustomerFilter>;
};

/** A filter to be used against many `PersonContact` object types. All fields are combined with a logical ‘and.’ */
export type CustomerToManyPersonContactFilter = {
  /** Every related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PersonContactFilter>;
  /** Some related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PersonContactFilter>;
  /** No related `PersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PersonContactFilter>;
};

/** A filter to be used against many `Shipper` object types. All fields are combined with a logical ‘and.’ */
export type CountryToManyShipperFilter = {
  /** Every related `Shipper` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ShipperFilter>;
  /** Some related `Shipper` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ShipperFilter>;
  /** No related `Shipper` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ShipperFilter>;
};

/** A connection to a list of `Customer` values, with data from `PersonContact`. */
export type ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyConnection = {
  __typename?: 'ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyConnection';
  /** A list of `Customer` objects. */
  nodes: Array<Maybe<Customer>>;
  /** A list of edges which contains the `Customer`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Customer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Customer = Node & {
  __typename?: 'Customer';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  customerName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  /** Reads a single `Country` that is related to this `Customer`. */
  country?: Maybe<Country>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
  searchText?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Shipper`. */
  shippersByPersonContactCustomerIdAndShipperId: CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyConnection;
  /** Reads and enables pagination through a set of `Warehouse`. */
  warehousesByPersonContactCustomerIdAndWarehouseId: CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyConnection;
};


export type CustomerPersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};


export type CustomerShippersByPersonContactCustomerIdAndShipperIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ShippersOrderBy>>;
  condition?: Maybe<ShipperCondition>;
  filter?: Maybe<ShipperFilter>;
};


export type CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
  condition?: Maybe<WarehouseCondition>;
  filter?: Maybe<WarehouseFilter>;
};

/** A connection to a list of `Shipper` values, with data from `PersonContact`. */
export type CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyConnection = {
  __typename?: 'CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyConnection';
  /** A list of `Shipper` objects. */
  nodes: Array<Maybe<Shipper>>;
  /** A list of edges which contains the `Shipper`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Shipper` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Shipper` edge in the connection, with data from `PersonContact`. */
export type CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyEdge = {
  __typename?: 'CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Shipper` at the end of the edge. */
  node?: Maybe<Shipper>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Shipper` edge in the connection, with data from `PersonContact`. */
export type CustomerShippersByPersonContactCustomerIdAndShipperIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

/** Methods to use when ordering `Shipper`. */
export enum ShippersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ShipperNameAsc = 'SHIPPER_NAME_ASC',
  ShipperNameDesc = 'SHIPPER_NAME_DESC',
  CountryIdAsc = 'COUNTRY_ID_ASC',
  CountryIdDesc = 'COUNTRY_ID_DESC',
  GroupIdAsc = 'GROUP_ID_ASC',
  GroupIdDesc = 'GROUP_ID_DESC',
  LogoSrcAsc = 'LOGO_SRC_ASC',
  LogoSrcDesc = 'LOGO_SRC_DESC',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  WebsiteAsc = 'WEBSITE_ASC',
  WebsiteDesc = 'WEBSITE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Shipper` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ShipperCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperName` field. */
  shipperName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryId` field. */
  countryId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `groupId` field. */
  groupId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `logoSrc` field. */
  logoSrc?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `notes` field. */
  notes?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `website` field. */
  website?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Warehouse` values, with data from `PersonContact`. */
export type CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyConnection = {
  __typename?: 'CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyConnection';
  /** A list of `Warehouse` objects. */
  nodes: Array<Maybe<Warehouse>>;
  /** A list of edges which contains the `Warehouse`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Warehouse` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Warehouse` edge in the connection, with data from `PersonContact`. */
export type CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyEdge = {
  __typename?: 'CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Warehouse` at the end of the edge. */
  node?: Maybe<Warehouse>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Warehouse` edge in the connection, with data from `PersonContact`. */
export type CustomerWarehousesByPersonContactCustomerIdAndWarehouseIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** Methods to use when ordering `Warehouse`. */
export enum WarehousesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  WarehouseNameAsc = 'WAREHOUSE_NAME_ASC',
  WarehouseNameDesc = 'WAREHOUSE_NAME_DESC',
  Address_1Asc = 'ADDRESS_1_ASC',
  Address_1Desc = 'ADDRESS_1_DESC',
  Address_2Asc = 'ADDRESS_2_ASC',
  Address_2Desc = 'ADDRESS_2_DESC',
  Address_3Asc = 'ADDRESS_3_ASC',
  Address_3Desc = 'ADDRESS_3_DESC',
  CityAsc = 'CITY_ASC',
  CityDesc = 'CITY_DESC',
  PostalStateAsc = 'POSTAL_STATE_ASC',
  PostalStateDesc = 'POSTAL_STATE_DESC',
  CountryIdAsc = 'COUNTRY_ID_ASC',
  CountryIdDesc = 'COUNTRY_ID_DESC',
  ZipCodeAsc = 'ZIP_CODE_ASC',
  ZipCodeDesc = 'ZIP_CODE_DESC',
  PhoneAsc = 'PHONE_ASC',
  PhoneDesc = 'PHONE_DESC',
  OutQueueAsc = 'OUT_QUEUE_ASC',
  OutQueueDesc = 'OUT_QUEUE_DESC',
  StateTaxCodeAsc = 'STATE_TAX_CODE_ASC',
  StateTaxCodeDesc = 'STATE_TAX_CODE_DESC',
  CountyTaxCodeAsc = 'COUNTY_TAX_CODE_ASC',
  CountyTaxCodeDesc = 'COUNTY_TAX_CODE_DESC',
  CityTaxCodeAsc = 'CITY_TAX_CODE_ASC',
  CityTaxCodeDesc = 'CITY_TAX_CODE_DESC',
  MiscTaxCodeAsc = 'MISC_TAX_CODE_ASC',
  MiscTaxCodeDesc = 'MISC_TAX_CODE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `Warehouse` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WarehouseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `warehouseName` field. */
  warehouseName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address1` field. */
  address1?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address2` field. */
  address2?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address3` field. */
  address3?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `postalState` field. */
  postalState?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryId` field. */
  countryId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `zipCode` field. */
  zipCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `phone` field. */
  phone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `outQueue` field. */
  outQueue?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `stateTaxCode` field. */
  stateTaxCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countyTaxCode` field. */
  countyTaxCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `cityTaxCode` field. */
  cityTaxCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `miscTaxCode` field. */
  miscTaxCode?: Maybe<Scalars['String']>;
};

/** A `Customer` edge in the connection, with data from `PersonContact`. */
export type ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyEdge = {
  __typename?: 'ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Customer` at the end of the edge. */
  node?: Maybe<Customer>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Customer` edge in the connection, with data from `PersonContact`. */
export type ShipperCustomersByPersonContactShipperIdAndCustomerIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** Methods to use when ordering `Customer`. */
export enum CustomersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CustomerNameAsc = 'CUSTOMER_NAME_ASC',
  CustomerNameDesc = 'CUSTOMER_NAME_DESC',
  Address_1Asc = 'ADDRESS_1_ASC',
  Address_1Desc = 'ADDRESS_1_DESC',
  Address_2Asc = 'ADDRESS_2_ASC',
  Address_2Desc = 'ADDRESS_2_DESC',
  CityAsc = 'CITY_ASC',
  CityDesc = 'CITY_DESC',
  PostalStateAsc = 'POSTAL_STATE_ASC',
  PostalStateDesc = 'POSTAL_STATE_DESC',
  ZipCodeAsc = 'ZIP_CODE_ASC',
  ZipCodeDesc = 'ZIP_CODE_DESC',
  CountryIdAsc = 'COUNTRY_ID_ASC',
  CountryIdDesc = 'COUNTRY_ID_DESC',
  PhoneAsc = 'PHONE_ASC',
  PhoneDesc = 'PHONE_DESC',
  LogoSrcAsc = 'LOGO_SRC_ASC',
  LogoSrcDesc = 'LOGO_SRC_DESC',
  NotesAsc = 'NOTES_ASC',
  NotesDesc = 'NOTES_DESC',
  WebsiteAsc = 'WEBSITE_ASC',
  WebsiteDesc = 'WEBSITE_DESC',
  ActiveAsc = 'ACTIVE_ASC',
  ActiveDesc = 'ACTIVE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `Customer` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CustomerCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerName` field. */
  customerName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address1` field. */
  address1?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address2` field. */
  address2?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `postalState` field. */
  postalState?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `zipCode` field. */
  zipCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryId` field. */
  countryId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `phone` field. */
  phone?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `logoSrc` field. */
  logoSrc?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `notes` field. */
  notes?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `website` field. */
  website?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `active` field. */
  active?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `Warehouse` values, with data from `PersonContact`. */
export type ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyConnection = {
  __typename?: 'ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyConnection';
  /** A list of `Warehouse` objects. */
  nodes: Array<Maybe<Warehouse>>;
  /** A list of edges which contains the `Warehouse`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Warehouse` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Warehouse` edge in the connection, with data from `PersonContact`. */
export type ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyEdge = {
  __typename?: 'ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Warehouse` at the end of the edge. */
  node?: Maybe<Warehouse>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Warehouse` edge in the connection, with data from `PersonContact`. */
export type ShipperWarehousesByPersonContactShipperIdAndWarehouseIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** A `PersonContact` edge in the connection. */
export type PersonContactsEdge = {
  __typename?: 'PersonContactsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PersonContact` at the end of the edge. */
  node?: Maybe<PersonContact>;
};

/** A connection to a list of `Shipper` values, with data from `PersonContact`. */
export type WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyConnection = {
  __typename?: 'WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyConnection';
  /** A list of `Shipper` objects. */
  nodes: Array<Maybe<Shipper>>;
  /** A list of edges which contains the `Shipper`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Shipper` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Shipper` edge in the connection, with data from `PersonContact`. */
export type WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyEdge = {
  __typename?: 'WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Shipper` at the end of the edge. */
  node?: Maybe<Shipper>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Shipper` edge in the connection, with data from `PersonContact`. */
export type WarehouseShippersByPersonContactWarehouseIdAndShipperIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** A connection to a list of `Customer` values, with data from `PersonContact`. */
export type WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyConnection = {
  __typename?: 'WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyConnection';
  /** A list of `Customer` objects. */
  nodes: Array<Maybe<Customer>>;
  /** A list of edges which contains the `Customer`, info from the `PersonContact`, and the cursor to aid in pagination. */
  edges: Array<WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Customer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Customer` edge in the connection, with data from `PersonContact`. */
export type WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyEdge = {
  __typename?: 'WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Customer` at the end of the edge. */
  node?: Maybe<Customer>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts: PersonContactsConnection;
};


/** A `Customer` edge in the connection, with data from `PersonContact`. */
export type WarehouseCustomersByPersonContactWarehouseIdAndCustomerIdManyToManyEdgePersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};

/** A `Warehouse` edge in the connection. */
export type WarehousesEdge = {
  __typename?: 'WarehousesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Warehouse` at the end of the edge. */
  node?: Maybe<Warehouse>;
};

/** A connection to a list of `Customer` values. */
export type CustomersConnection = {
  __typename?: 'CustomersConnection';
  /** A list of `Customer` objects. */
  nodes: Array<Maybe<Customer>>;
  /** A list of edges which contains the `Customer` and cursor to aid in pagination. */
  edges: Array<CustomersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Customer` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Customer` edge in the connection. */
export type CustomersEdge = {
  __typename?: 'CustomersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Customer` at the end of the edge. */
  node?: Maybe<Customer>;
};

/** A connection to a list of `Shipper` values. */
export type ShippersConnection = {
  __typename?: 'ShippersConnection';
  /** A list of `Shipper` objects. */
  nodes: Array<Maybe<Shipper>>;
  /** A list of edges which contains the `Shipper` and cursor to aid in pagination. */
  edges: Array<ShippersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Shipper` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Shipper` edge in the connection. */
export type ShippersEdge = {
  __typename?: 'ShippersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Shipper` at the end of the edge. */
  node?: Maybe<Shipper>;
};

/** A `Country` edge in the connection. */
export type CountriesEdge = {
  __typename?: 'CountriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Country` at the end of the edge. */
  node?: Maybe<Country>;
};

/** Methods to use when ordering `Country`. */
export enum CountriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CountryNameAsc = 'COUNTRY_NAME_ASC',
  CountryNameDesc = 'COUNTRY_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Country` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CountryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `countryName` field. */
  countryName?: Maybe<Scalars['String']>;
};

/** A connection to a list of `AgendaItem` values. */
export type AgendaItemsConnection = {
  __typename?: 'AgendaItemsConnection';
  /** A list of `AgendaItem` objects. */
  nodes: Array<Maybe<AgendaItem>>;
  /** A list of edges which contains the `AgendaItem` and cursor to aid in pagination. */
  edges: Array<AgendaItemsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AgendaItem` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type AgendaItem = Node & {
  __typename?: 'AgendaItem';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  content: Scalars['String'];
  itemDate: Scalars['Date'];
  sortOrder: Scalars['Int'];
};


/** A `AgendaItem` edge in the connection. */
export type AgendaItemsEdge = {
  __typename?: 'AgendaItemsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `AgendaItem` at the end of the edge. */
  node?: Maybe<AgendaItem>;
};

/** Methods to use when ordering `AgendaItem`. */
export enum AgendaItemsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  ItemDateAsc = 'ITEM_DATE_ASC',
  ItemDateDesc = 'ITEM_DATE_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `AgendaItem` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type AgendaItemCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `content` field. */
  content?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `itemDate` field. */
  itemDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: Maybe<Scalars['Int']>;
};

/** A filter to be used against `AgendaItem` object types. All fields are combined with a logical ‘and.’ */
export type AgendaItemFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `content` field. */
  content?: Maybe<StringFilter>;
  /** Filter by the object’s `itemDate` field. */
  itemDate?: Maybe<DateFilter>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: Maybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<AgendaItemFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<AgendaItemFilter>>;
  /** Negates the expression. */
  not?: Maybe<AgendaItemFilter>;
};

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Date']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Date']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Date']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Date']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Date']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Date']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Date']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Date']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Date']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Int']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Int']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `PriceCategory` values. */
export type PriceCategoriesConnection = {
  __typename?: 'PriceCategoriesConnection';
  /** A list of `PriceCategory` objects. */
  nodes: Array<Maybe<PriceCategory>>;
  /** A list of edges which contains the `PriceCategory` and cursor to aid in pagination. */
  edges: Array<PriceCategoriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PriceCategory` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PriceCategory = Node & {
  __typename?: 'PriceCategory';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  categoryName: Scalars['String'];
  sortOrder: Scalars['Int'];
  /** Reads and enables pagination through a set of `PriceProduct`. */
  priceProductsByCategoryId: PriceProductsConnection;
};


export type PriceCategoryPriceProductsByCategoryIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceProductsOrderBy>>;
  condition?: Maybe<PriceProductCondition>;
  filter?: Maybe<PriceProductFilter>;
};

/** A connection to a list of `PriceProduct` values. */
export type PriceProductsConnection = {
  __typename?: 'PriceProductsConnection';
  /** A list of `PriceProduct` objects. */
  nodes: Array<Maybe<PriceProduct>>;
  /** A list of edges which contains the `PriceProduct` and cursor to aid in pagination. */
  edges: Array<PriceProductsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PriceProduct` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PriceProduct = Node & {
  __typename?: 'PriceProduct';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  categoryId: Scalars['BigInt'];
  color: Scalars['String'];
  productName: Scalars['String'];
  sortOrder: Scalars['Int'];
  /** Reads a single `PriceCategory` that is related to this `PriceProduct`. */
  category?: Maybe<PriceCategory>;
  /** Reads and enables pagination through a set of `PriceSize`. */
  priceSizesByProductId: PriceSizesConnection;
  productRootId?: Maybe<Scalars['BigInt']>;
};


export type PriceProductPriceSizesByProductIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceSizesOrderBy>>;
  condition?: Maybe<PriceSizeCondition>;
  filter?: Maybe<PriceSizeFilter>;
};

/** A connection to a list of `PriceSize` values. */
export type PriceSizesConnection = {
  __typename?: 'PriceSizesConnection';
  /** A list of `PriceSize` objects. */
  nodes: Array<Maybe<PriceSize>>;
  /** A list of edges which contains the `PriceSize` and cursor to aid in pagination. */
  edges: Array<PriceSizesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PriceSize` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PriceSize = Node & {
  __typename?: 'PriceSize';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  productId: Scalars['BigInt'];
  sizeName: Scalars['String'];
  sortOrder: Scalars['Int'];
  /** Reads a single `PriceProduct` that is related to this `PriceSize`. */
  product?: Maybe<PriceProduct>;
  /** Reads and enables pagination through a set of `PriceEntry`. */
  priceEntriesBySizeId: PriceEntriesConnection;
};


export type PriceSizePriceEntriesBySizeIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PriceEntriesOrderBy>>;
  condition?: Maybe<PriceEntryCondition>;
  filter?: Maybe<PriceEntryFilter>;
};

/** A connection to a list of `PriceEntry` values. */
export type PriceEntriesConnection = {
  __typename?: 'PriceEntriesConnection';
  /** A list of `PriceEntry` objects. */
  nodes: Array<Maybe<PriceEntry>>;
  /** A list of edges which contains the `PriceEntry` and cursor to aid in pagination. */
  edges: Array<PriceEntriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PriceEntry` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PriceEntry = Node & {
  __typename?: 'PriceEntry';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  sizeId: Scalars['BigInt'];
  entryDate: Scalars['Date'];
  entryDescription: Scalars['String'];
  content: Scalars['String'];
  highlight: Scalars['Boolean'];
  /** Reads a single `PriceSize` that is related to this `PriceEntry`. */
  size?: Maybe<PriceSize>;
};

/** A `PriceEntry` edge in the connection. */
export type PriceEntriesEdge = {
  __typename?: 'PriceEntriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PriceEntry` at the end of the edge. */
  node?: Maybe<PriceEntry>;
};

/** Methods to use when ordering `PriceEntry`. */
export enum PriceEntriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SizeIdAsc = 'SIZE_ID_ASC',
  SizeIdDesc = 'SIZE_ID_DESC',
  EntryDateAsc = 'ENTRY_DATE_ASC',
  EntryDateDesc = 'ENTRY_DATE_DESC',
  EntryDescriptionAsc = 'ENTRY_DESCRIPTION_ASC',
  EntryDescriptionDesc = 'ENTRY_DESCRIPTION_DESC',
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  HighlightAsc = 'HIGHLIGHT_ASC',
  HighlightDesc = 'HIGHLIGHT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PriceEntry` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PriceEntryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `sizeId` field. */
  sizeId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `entryDate` field. */
  entryDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `entryDescription` field. */
  entryDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `content` field. */
  content?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `highlight` field. */
  highlight?: Maybe<Scalars['Boolean']>;
};

/** A filter to be used against `PriceEntry` object types. All fields are combined with a logical ‘and.’ */
export type PriceEntryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `sizeId` field. */
  sizeId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `entryDate` field. */
  entryDate?: Maybe<DateFilter>;
  /** Filter by the object’s `entryDescription` field. */
  entryDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `content` field. */
  content?: Maybe<StringFilter>;
  /** Filter by the object’s `highlight` field. */
  highlight?: Maybe<BooleanFilter>;
  /** Filter by the object’s `size` relation. */
  size?: Maybe<PriceSizeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PriceEntryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PriceEntryFilter>>;
  /** Negates the expression. */
  not?: Maybe<PriceEntryFilter>;
};

/** A filter to be used against `PriceSize` object types. All fields are combined with a logical ‘and.’ */
export type PriceSizeFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `productId` field. */
  productId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `sizeName` field. */
  sizeName?: Maybe<StringFilter>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: Maybe<IntFilter>;
  /** Filter by the object’s `priceEntriesBySizeId` relation. */
  priceEntriesBySizeId?: Maybe<PriceSizeToManyPriceEntryFilter>;
  /** Some related `priceEntriesBySizeId` exist. */
  priceEntriesBySizeIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `product` relation. */
  product?: Maybe<PriceProductFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PriceSizeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PriceSizeFilter>>;
  /** Negates the expression. */
  not?: Maybe<PriceSizeFilter>;
};

/** A filter to be used against many `PriceEntry` object types. All fields are combined with a logical ‘and.’ */
export type PriceSizeToManyPriceEntryFilter = {
  /** Every related `PriceEntry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PriceEntryFilter>;
  /** Some related `PriceEntry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PriceEntryFilter>;
  /** No related `PriceEntry` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PriceEntryFilter>;
};

/** A filter to be used against `PriceProduct` object types. All fields are combined with a logical ‘and.’ */
export type PriceProductFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `categoryId` field. */
  categoryId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `color` field. */
  color?: Maybe<StringFilter>;
  /** Filter by the object’s `productName` field. */
  productName?: Maybe<StringFilter>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: Maybe<IntFilter>;
  /** Filter by the object’s `productRootId` field. */
  productRootId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `priceSizesByProductId` relation. */
  priceSizesByProductId?: Maybe<PriceProductToManyPriceSizeFilter>;
  /** Some related `priceSizesByProductId` exist. */
  priceSizesByProductIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `category` relation. */
  category?: Maybe<PriceCategoryFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PriceProductFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PriceProductFilter>>;
  /** Negates the expression. */
  not?: Maybe<PriceProductFilter>;
};

/** A filter to be used against many `PriceSize` object types. All fields are combined with a logical ‘and.’ */
export type PriceProductToManyPriceSizeFilter = {
  /** Every related `PriceSize` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PriceSizeFilter>;
  /** Some related `PriceSize` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PriceSizeFilter>;
  /** No related `PriceSize` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PriceSizeFilter>;
};

/** A filter to be used against `PriceCategory` object types. All fields are combined with a logical ‘and.’ */
export type PriceCategoryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `categoryName` field. */
  categoryName?: Maybe<StringFilter>;
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: Maybe<IntFilter>;
  /** Filter by the object’s `priceProductsByCategoryId` relation. */
  priceProductsByCategoryId?: Maybe<PriceCategoryToManyPriceProductFilter>;
  /** Some related `priceProductsByCategoryId` exist. */
  priceProductsByCategoryIdExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PriceCategoryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PriceCategoryFilter>>;
  /** Negates the expression. */
  not?: Maybe<PriceCategoryFilter>;
};

/** A filter to be used against many `PriceProduct` object types. All fields are combined with a logical ‘and.’ */
export type PriceCategoryToManyPriceProductFilter = {
  /** Every related `PriceProduct` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PriceProductFilter>;
  /** Some related `PriceProduct` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PriceProductFilter>;
  /** No related `PriceProduct` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PriceProductFilter>;
};

/** A `PriceSize` edge in the connection. */
export type PriceSizesEdge = {
  __typename?: 'PriceSizesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PriceSize` at the end of the edge. */
  node?: Maybe<PriceSize>;
};

/** Methods to use when ordering `PriceSize`. */
export enum PriceSizesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  SizeNameAsc = 'SIZE_NAME_ASC',
  SizeNameDesc = 'SIZE_NAME_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PriceSize` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PriceSizeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `productId` field. */
  productId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `sizeName` field. */
  sizeName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: Maybe<Scalars['Int']>;
};

/** A `PriceProduct` edge in the connection. */
export type PriceProductsEdge = {
  __typename?: 'PriceProductsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PriceProduct` at the end of the edge. */
  node?: Maybe<PriceProduct>;
};

/** Methods to use when ordering `PriceProduct`. */
export enum PriceProductsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CategoryIdAsc = 'CATEGORY_ID_ASC',
  CategoryIdDesc = 'CATEGORY_ID_DESC',
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  ProductNameAsc = 'PRODUCT_NAME_ASC',
  ProductNameDesc = 'PRODUCT_NAME_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PriceProduct` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PriceProductCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `categoryId` field. */
  categoryId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `color` field. */
  color?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `productName` field. */
  productName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: Maybe<Scalars['Int']>;
};

/** A `PriceCategory` edge in the connection. */
export type PriceCategoriesEdge = {
  __typename?: 'PriceCategoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PriceCategory` at the end of the edge. */
  node?: Maybe<PriceCategory>;
};

/** Methods to use when ordering `PriceCategory`. */
export enum PriceCategoriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CategoryNameAsc = 'CATEGORY_NAME_ASC',
  CategoryNameDesc = 'CATEGORY_NAME_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PriceCategory` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PriceCategoryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `categoryName` field. */
  categoryName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `ChileDepartureInspectionPallet` values. */
export type ChileDepartureInspectionPalletsConnection = {
  __typename?: 'ChileDepartureInspectionPalletsConnection';
  /** A list of `ChileDepartureInspectionPallet` objects. */
  nodes: Array<Maybe<ChileDepartureInspectionPallet>>;
  /** A list of edges which contains the `ChileDepartureInspectionPallet` and cursor to aid in pagination. */
  edges: Array<ChileDepartureInspectionPalletsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChileDepartureInspectionPallet` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ChileDepartureInspectionPallet = Node & {
  __typename?: 'ChileDepartureInspectionPallet';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  lotId: Scalars['String'];
  lotNumber: Scalars['String'];
  locationName: Scalars['String'];
  shipper: Scalars['String'];
  inspectionDate: Scalars['Date'];
  productName: Scalars['String'];
  packingType: Scalars['String'];
  productType: Scalars['String'];
  palletCount: Scalars['BigFloat'];
  supervisor: Scalars['String'];
  palletNumber: Scalars['String'];
  boxesCount: Scalars['BigFloat'];
  netWeight: Scalars['BigFloat'];
  grower: Scalars['String'];
  size: Scalars['String'];
  variety: Scalars['String'];
  packingDate: Scalars['Date'];
  label: Scalars['String'];
  temperature: Scalars['String'];
  openAppearance: Scalars['String'];
  color: Scalars['String'];
  stem: Scalars['String'];
  texture: Scalars['String'];
  bunchesCount: Scalars['BigFloat'];
  brix: Scalars['BigFloat'];
  diameterMin: Scalars['BigFloat'];
  diameterMax: Scalars['BigFloat'];
  stragglyTightPct: Scalars['BigFloat'];
  surfaceDiscPct: Scalars['BigFloat'];
  russetScarsPct: Scalars['BigFloat'];
  sunburnPct: Scalars['BigFloat'];
  undersizedBunchesPct: Scalars['BigFloat'];
  otherDefectsPct: Scalars['BigFloat'];
  stemDehyPct: Scalars['BigFloat'];
  glassyWeakPct: Scalars['BigFloat'];
  decayPct: Scalars['BigFloat'];
  splitCrushedPct: Scalars['BigFloat'];
  drySplitPct: Scalars['BigFloat'];
  wetStickyPct: Scalars['BigFloat'];
  waterberriesPct: Scalars['BigFloat'];
  shatterPct: Scalars['BigFloat'];
  totalQualityDefectsPct: Scalars['BigFloat'];
  totalConditionDefectsPct: Scalars['BigFloat'];
  qualityScore: Scalars['BigFloat'];
  conditionScore: Scalars['BigFloat'];
  scoreName: Scalars['String'];
  reportLink: Scalars['String'];
  imagesLink: Scalars['String'];
};


/** A `ChileDepartureInspectionPallet` edge in the connection. */
export type ChileDepartureInspectionPalletsEdge = {
  __typename?: 'ChileDepartureInspectionPalletsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ChileDepartureInspectionPallet` at the end of the edge. */
  node?: Maybe<ChileDepartureInspectionPallet>;
};

/** Methods to use when ordering `ChileDepartureInspectionPallet`. */
export enum ChileDepartureInspectionPalletsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LotIdAsc = 'LOT_ID_ASC',
  LotIdDesc = 'LOT_ID_DESC',
  LotNumberAsc = 'LOT_NUMBER_ASC',
  LotNumberDesc = 'LOT_NUMBER_DESC',
  LocationNameAsc = 'LOCATION_NAME_ASC',
  LocationNameDesc = 'LOCATION_NAME_DESC',
  ShipperAsc = 'SHIPPER_ASC',
  ShipperDesc = 'SHIPPER_DESC',
  InspectionDateAsc = 'INSPECTION_DATE_ASC',
  InspectionDateDesc = 'INSPECTION_DATE_DESC',
  ProductNameAsc = 'PRODUCT_NAME_ASC',
  ProductNameDesc = 'PRODUCT_NAME_DESC',
  PackingTypeAsc = 'PACKING_TYPE_ASC',
  PackingTypeDesc = 'PACKING_TYPE_DESC',
  ProductTypeAsc = 'PRODUCT_TYPE_ASC',
  ProductTypeDesc = 'PRODUCT_TYPE_DESC',
  PalletCountAsc = 'PALLET_COUNT_ASC',
  PalletCountDesc = 'PALLET_COUNT_DESC',
  SupervisorAsc = 'SUPERVISOR_ASC',
  SupervisorDesc = 'SUPERVISOR_DESC',
  PalletNumberAsc = 'PALLET_NUMBER_ASC',
  PalletNumberDesc = 'PALLET_NUMBER_DESC',
  BoxesCountAsc = 'BOXES_COUNT_ASC',
  BoxesCountDesc = 'BOXES_COUNT_DESC',
  NetWeightAsc = 'NET_WEIGHT_ASC',
  NetWeightDesc = 'NET_WEIGHT_DESC',
  GrowerAsc = 'GROWER_ASC',
  GrowerDesc = 'GROWER_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  VarietyAsc = 'VARIETY_ASC',
  VarietyDesc = 'VARIETY_DESC',
  PackingDateAsc = 'PACKING_DATE_ASC',
  PackingDateDesc = 'PACKING_DATE_DESC',
  LabelAsc = 'LABEL_ASC',
  LabelDesc = 'LABEL_DESC',
  TemperatureAsc = 'TEMPERATURE_ASC',
  TemperatureDesc = 'TEMPERATURE_DESC',
  OpenAppearanceAsc = 'OPEN_APPEARANCE_ASC',
  OpenAppearanceDesc = 'OPEN_APPEARANCE_DESC',
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  StemAsc = 'STEM_ASC',
  StemDesc = 'STEM_DESC',
  TextureAsc = 'TEXTURE_ASC',
  TextureDesc = 'TEXTURE_DESC',
  BunchesCountAsc = 'BUNCHES_COUNT_ASC',
  BunchesCountDesc = 'BUNCHES_COUNT_DESC',
  BrixAsc = 'BRIX_ASC',
  BrixDesc = 'BRIX_DESC',
  DiameterMinAsc = 'DIAMETER_MIN_ASC',
  DiameterMinDesc = 'DIAMETER_MIN_DESC',
  DiameterMaxAsc = 'DIAMETER_MAX_ASC',
  DiameterMaxDesc = 'DIAMETER_MAX_DESC',
  StragglyTightPctAsc = 'STRAGGLY_TIGHT_PCT_ASC',
  StragglyTightPctDesc = 'STRAGGLY_TIGHT_PCT_DESC',
  SurfaceDiscPctAsc = 'SURFACE_DISC_PCT_ASC',
  SurfaceDiscPctDesc = 'SURFACE_DISC_PCT_DESC',
  RussetScarsPctAsc = 'RUSSET_SCARS_PCT_ASC',
  RussetScarsPctDesc = 'RUSSET_SCARS_PCT_DESC',
  SunburnPctAsc = 'SUNBURN_PCT_ASC',
  SunburnPctDesc = 'SUNBURN_PCT_DESC',
  UndersizedBunchesPctAsc = 'UNDERSIZED_BUNCHES_PCT_ASC',
  UndersizedBunchesPctDesc = 'UNDERSIZED_BUNCHES_PCT_DESC',
  OtherDefectsPctAsc = 'OTHER_DEFECTS_PCT_ASC',
  OtherDefectsPctDesc = 'OTHER_DEFECTS_PCT_DESC',
  StemDehyPctAsc = 'STEM_DEHY_PCT_ASC',
  StemDehyPctDesc = 'STEM_DEHY_PCT_DESC',
  GlassyWeakPctAsc = 'GLASSY_WEAK_PCT_ASC',
  GlassyWeakPctDesc = 'GLASSY_WEAK_PCT_DESC',
  DecayPctAsc = 'DECAY_PCT_ASC',
  DecayPctDesc = 'DECAY_PCT_DESC',
  SplitCrushedPctAsc = 'SPLIT_CRUSHED_PCT_ASC',
  SplitCrushedPctDesc = 'SPLIT_CRUSHED_PCT_DESC',
  DrySplitPctAsc = 'DRY_SPLIT_PCT_ASC',
  DrySplitPctDesc = 'DRY_SPLIT_PCT_DESC',
  WetStickyPctAsc = 'WET_STICKY_PCT_ASC',
  WetStickyPctDesc = 'WET_STICKY_PCT_DESC',
  WaterberriesPctAsc = 'WATERBERRIES_PCT_ASC',
  WaterberriesPctDesc = 'WATERBERRIES_PCT_DESC',
  ShatterPctAsc = 'SHATTER_PCT_ASC',
  ShatterPctDesc = 'SHATTER_PCT_DESC',
  TotalQualityDefectsPctAsc = 'TOTAL_QUALITY_DEFECTS_PCT_ASC',
  TotalQualityDefectsPctDesc = 'TOTAL_QUALITY_DEFECTS_PCT_DESC',
  TotalConditionDefectsPctAsc = 'TOTAL_CONDITION_DEFECTS_PCT_ASC',
  TotalConditionDefectsPctDesc = 'TOTAL_CONDITION_DEFECTS_PCT_DESC',
  QualityScoreAsc = 'QUALITY_SCORE_ASC',
  QualityScoreDesc = 'QUALITY_SCORE_DESC',
  ConditionScoreAsc = 'CONDITION_SCORE_ASC',
  ConditionScoreDesc = 'CONDITION_SCORE_DESC',
  ScoreNameAsc = 'SCORE_NAME_ASC',
  ScoreNameDesc = 'SCORE_NAME_DESC',
  ReportLinkAsc = 'REPORT_LINK_ASC',
  ReportLinkDesc = 'REPORT_LINK_DESC',
  ImagesLinkAsc = 'IMAGES_LINK_ASC',
  ImagesLinkDesc = 'IMAGES_LINK_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `ChileDepartureInspectionPallet` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type ChileDepartureInspectionPalletCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lotId` field. */
  lotId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lotNumber` field. */
  lotNumber?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `locationName` field. */
  locationName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipper` field. */
  shipper?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `inspectionDate` field. */
  inspectionDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `productName` field. */
  productName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `packingType` field. */
  packingType?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `productType` field. */
  productType?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `palletCount` field. */
  palletCount?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `supervisor` field. */
  supervisor?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `palletNumber` field. */
  palletNumber?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `boxesCount` field. */
  boxesCount?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `netWeight` field. */
  netWeight?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `grower` field. */
  grower?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `size` field. */
  size?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `variety` field. */
  variety?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `packingDate` field. */
  packingDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `label` field. */
  label?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `temperature` field. */
  temperature?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `openAppearance` field. */
  openAppearance?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `color` field. */
  color?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `stem` field. */
  stem?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `texture` field. */
  texture?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `bunchesCount` field. */
  bunchesCount?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `brix` field. */
  brix?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `diameterMin` field. */
  diameterMin?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `diameterMax` field. */
  diameterMax?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `stragglyTightPct` field. */
  stragglyTightPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `surfaceDiscPct` field. */
  surfaceDiscPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `russetScarsPct` field. */
  russetScarsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `sunburnPct` field. */
  sunburnPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `undersizedBunchesPct` field. */
  undersizedBunchesPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `otherDefectsPct` field. */
  otherDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `stemDehyPct` field. */
  stemDehyPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `glassyWeakPct` field. */
  glassyWeakPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `decayPct` field. */
  decayPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `splitCrushedPct` field. */
  splitCrushedPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `drySplitPct` field. */
  drySplitPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `wetStickyPct` field. */
  wetStickyPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `waterberriesPct` field. */
  waterberriesPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `shatterPct` field. */
  shatterPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `totalQualityDefectsPct` field. */
  totalQualityDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `totalConditionDefectsPct` field. */
  totalConditionDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `qualityScore` field. */
  qualityScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `conditionScore` field. */
  conditionScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `scoreName` field. */
  scoreName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `reportLink` field. */
  reportLink?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `imagesLink` field. */
  imagesLink?: Maybe<Scalars['String']>;
};

/** A filter to be used against `ChileDepartureInspectionPallet` object types. All fields are combined with a logical ‘and.’ */
export type ChileDepartureInspectionPalletFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `lotId` field. */
  lotId?: Maybe<StringFilter>;
  /** Filter by the object’s `lotNumber` field. */
  lotNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `locationName` field. */
  locationName?: Maybe<StringFilter>;
  /** Filter by the object’s `shipper` field. */
  shipper?: Maybe<StringFilter>;
  /** Filter by the object’s `inspectionDate` field. */
  inspectionDate?: Maybe<DateFilter>;
  /** Filter by the object’s `productName` field. */
  productName?: Maybe<StringFilter>;
  /** Filter by the object’s `packingType` field. */
  packingType?: Maybe<StringFilter>;
  /** Filter by the object’s `productType` field. */
  productType?: Maybe<StringFilter>;
  /** Filter by the object’s `palletCount` field. */
  palletCount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `supervisor` field. */
  supervisor?: Maybe<StringFilter>;
  /** Filter by the object’s `palletNumber` field. */
  palletNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `boxesCount` field. */
  boxesCount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `netWeight` field. */
  netWeight?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `grower` field. */
  grower?: Maybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: Maybe<StringFilter>;
  /** Filter by the object’s `variety` field. */
  variety?: Maybe<StringFilter>;
  /** Filter by the object’s `packingDate` field. */
  packingDate?: Maybe<DateFilter>;
  /** Filter by the object’s `label` field. */
  label?: Maybe<StringFilter>;
  /** Filter by the object’s `temperature` field. */
  temperature?: Maybe<StringFilter>;
  /** Filter by the object’s `openAppearance` field. */
  openAppearance?: Maybe<StringFilter>;
  /** Filter by the object’s `color` field. */
  color?: Maybe<StringFilter>;
  /** Filter by the object’s `stem` field. */
  stem?: Maybe<StringFilter>;
  /** Filter by the object’s `texture` field. */
  texture?: Maybe<StringFilter>;
  /** Filter by the object’s `bunchesCount` field. */
  bunchesCount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brix` field. */
  brix?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `diameterMin` field. */
  diameterMin?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `diameterMax` field. */
  diameterMax?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `stragglyTightPct` field. */
  stragglyTightPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `surfaceDiscPct` field. */
  surfaceDiscPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `russetScarsPct` field. */
  russetScarsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `sunburnPct` field. */
  sunburnPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `undersizedBunchesPct` field. */
  undersizedBunchesPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `otherDefectsPct` field. */
  otherDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `stemDehyPct` field. */
  stemDehyPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `glassyWeakPct` field. */
  glassyWeakPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `decayPct` field. */
  decayPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `splitCrushedPct` field. */
  splitCrushedPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `drySplitPct` field. */
  drySplitPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `wetStickyPct` field. */
  wetStickyPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `waterberriesPct` field. */
  waterberriesPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `shatterPct` field. */
  shatterPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `totalQualityDefectsPct` field. */
  totalQualityDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `totalConditionDefectsPct` field. */
  totalConditionDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `qualityScore` field. */
  qualityScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `conditionScore` field. */
  conditionScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `scoreName` field. */
  scoreName?: Maybe<StringFilter>;
  /** Filter by the object’s `reportLink` field. */
  reportLink?: Maybe<StringFilter>;
  /** Filter by the object’s `imagesLink` field. */
  imagesLink?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ChileDepartureInspectionPalletFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ChileDepartureInspectionPalletFilter>>;
  /** Negates the expression. */
  not?: Maybe<ChileDepartureInspectionPalletFilter>;
};

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['BigFloat']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['BigFloat']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['BigFloat']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['BigFloat']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['BigFloat']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['BigFloat']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['BigFloat']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['BigFloat']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['BigFloat']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['BigFloat']>;
};

/** A connection to a list of `PeruDepartureInspection` values. */
export type PeruDepartureInspectionsConnection = {
  __typename?: 'PeruDepartureInspectionsConnection';
  /** A list of `PeruDepartureInspection` objects. */
  nodes: Array<Maybe<PeruDepartureInspection>>;
  /** A list of edges which contains the `PeruDepartureInspection` and cursor to aid in pagination. */
  edges: Array<PeruDepartureInspectionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PeruDepartureInspection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PeruDepartureInspection = Node & {
  __typename?: 'PeruDepartureInspection';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  avgBunchesPerBox: Scalars['BigFloat'];
  avgNetWeight: Scalars['BigFloat'];
  bagsPerBox: Scalars['BigFloat'];
  bagType?: Maybe<Scalars['String']>;
  brand: Scalars['String'];
  brixAvg: Scalars['BigFloat'];
  brixMax: Scalars['BigFloat'];
  brixMin: Scalars['BigFloat'];
  category: Scalars['String'];
  comments: Scalars['String'];
  conditionScore: Scalars['BigFloat'];
  containerId: Scalars['String'];
  departureWeek: Scalars['String'];
  destination: Scalars['String'];
  exporter: Scalars['String'];
  inspectionDate: Scalars['Date'];
  packingDate: Scalars['Date'];
  packingHouse: Scalars['String'];
  packingMaterial: Scalars['String'];
  presentation: Scalars['String'];
  qualityScore: Scalars['BigFloat'];
  variety: Scalars['String'];
  /** Reads and enables pagination through a set of `PeruDepartureInspectionPallet`. */
  peruDepartureInspectionPalletsByContainerId: PeruDepartureInspectionPalletsConnection;
  searchText?: Maybe<Scalars['String']>;
  imageUrls?: Maybe<Array<Scalars['String']>>;
};


export type PeruDepartureInspectionPeruDepartureInspectionPalletsByContainerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PeruDepartureInspectionPalletsOrderBy>>;
  condition?: Maybe<PeruDepartureInspectionPalletCondition>;
  filter?: Maybe<PeruDepartureInspectionPalletFilter>;
};

/** A connection to a list of `PeruDepartureInspectionPallet` values. */
export type PeruDepartureInspectionPalletsConnection = {
  __typename?: 'PeruDepartureInspectionPalletsConnection';
  /** A list of `PeruDepartureInspectionPallet` objects. */
  nodes: Array<Maybe<PeruDepartureInspectionPallet>>;
  /** A list of edges which contains the `PeruDepartureInspectionPallet` and cursor to aid in pagination. */
  edges: Array<PeruDepartureInspectionPalletsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PeruDepartureInspectionPallet` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PeruDepartureInspectionPallet = Node & {
  __typename?: 'PeruDepartureInspectionPallet';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  palletId: Scalars['String'];
  containerId: Scalars['String'];
  size: Scalars['String'];
  netWeight: Scalars['BigFloat'];
  openingScore: Scalars['BigFloat'];
  colorScore: Scalars['BigFloat'];
  stemScore: Scalars['BigFloat'];
  textureScore: Scalars['BigFloat'];
  bunchesPerBox: Scalars['BigFloat'];
  brix: Scalars['BigFloat'];
  qualityScore: Scalars['BigFloat'];
  conditionScore: Scalars['BigFloat'];
  stragglyTightPct: Scalars['BigFloat'];
  surfaceDiscPct: Scalars['BigFloat'];
  russetScarsPct: Scalars['BigFloat'];
  sunburnPct: Scalars['BigFloat'];
  undersizedBunchesPct: Scalars['BigFloat'];
  otherDefectsPct: Scalars['BigFloat'];
  totalQualityDefectsPct: Scalars['BigFloat'];
  stemDehyPct: Scalars['BigFloat'];
  glassyWeakPct: Scalars['BigFloat'];
  decayPct: Scalars['BigFloat'];
  splitCrushedPct: Scalars['BigFloat'];
  drySplitPct: Scalars['BigFloat'];
  wetStickyPct: Scalars['BigFloat'];
  waterberriesPct: Scalars['BigFloat'];
  shatterPct: Scalars['BigFloat'];
  totalConditionDefectsPct: Scalars['BigFloat'];
  totalDefectsPct: Scalars['BigFloat'];
  /** Reads a single `PeruDepartureInspection` that is related to this `PeruDepartureInspectionPallet`. */
  container?: Maybe<PeruDepartureInspection>;
};

/** A `PeruDepartureInspectionPallet` edge in the connection. */
export type PeruDepartureInspectionPalletsEdge = {
  __typename?: 'PeruDepartureInspectionPalletsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PeruDepartureInspectionPallet` at the end of the edge. */
  node?: Maybe<PeruDepartureInspectionPallet>;
};

/** Methods to use when ordering `PeruDepartureInspectionPallet`. */
export enum PeruDepartureInspectionPalletsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PalletIdAsc = 'PALLET_ID_ASC',
  PalletIdDesc = 'PALLET_ID_DESC',
  ContainerIdAsc = 'CONTAINER_ID_ASC',
  ContainerIdDesc = 'CONTAINER_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  NetWeightAsc = 'NET_WEIGHT_ASC',
  NetWeightDesc = 'NET_WEIGHT_DESC',
  OpeningScoreAsc = 'OPENING_SCORE_ASC',
  OpeningScoreDesc = 'OPENING_SCORE_DESC',
  ColorScoreAsc = 'COLOR_SCORE_ASC',
  ColorScoreDesc = 'COLOR_SCORE_DESC',
  StemScoreAsc = 'STEM_SCORE_ASC',
  StemScoreDesc = 'STEM_SCORE_DESC',
  TextureScoreAsc = 'TEXTURE_SCORE_ASC',
  TextureScoreDesc = 'TEXTURE_SCORE_DESC',
  BunchesPerBoxAsc = 'BUNCHES_PER_BOX_ASC',
  BunchesPerBoxDesc = 'BUNCHES_PER_BOX_DESC',
  BrixAsc = 'BRIX_ASC',
  BrixDesc = 'BRIX_DESC',
  QualityScoreAsc = 'QUALITY_SCORE_ASC',
  QualityScoreDesc = 'QUALITY_SCORE_DESC',
  ConditionScoreAsc = 'CONDITION_SCORE_ASC',
  ConditionScoreDesc = 'CONDITION_SCORE_DESC',
  StragglyTightPctAsc = 'STRAGGLY_TIGHT_PCT_ASC',
  StragglyTightPctDesc = 'STRAGGLY_TIGHT_PCT_DESC',
  SurfaceDiscPctAsc = 'SURFACE_DISC_PCT_ASC',
  SurfaceDiscPctDesc = 'SURFACE_DISC_PCT_DESC',
  RussetScarsPctAsc = 'RUSSET_SCARS_PCT_ASC',
  RussetScarsPctDesc = 'RUSSET_SCARS_PCT_DESC',
  SunburnPctAsc = 'SUNBURN_PCT_ASC',
  SunburnPctDesc = 'SUNBURN_PCT_DESC',
  UndersizedBunchesPctAsc = 'UNDERSIZED_BUNCHES_PCT_ASC',
  UndersizedBunchesPctDesc = 'UNDERSIZED_BUNCHES_PCT_DESC',
  OtherDefectsPctAsc = 'OTHER_DEFECTS_PCT_ASC',
  OtherDefectsPctDesc = 'OTHER_DEFECTS_PCT_DESC',
  TotalQualityDefectsPctAsc = 'TOTAL_QUALITY_DEFECTS_PCT_ASC',
  TotalQualityDefectsPctDesc = 'TOTAL_QUALITY_DEFECTS_PCT_DESC',
  StemDehyPctAsc = 'STEM_DEHY_PCT_ASC',
  StemDehyPctDesc = 'STEM_DEHY_PCT_DESC',
  GlassyWeakPctAsc = 'GLASSY_WEAK_PCT_ASC',
  GlassyWeakPctDesc = 'GLASSY_WEAK_PCT_DESC',
  DecayPctAsc = 'DECAY_PCT_ASC',
  DecayPctDesc = 'DECAY_PCT_DESC',
  SplitCrushedPctAsc = 'SPLIT_CRUSHED_PCT_ASC',
  SplitCrushedPctDesc = 'SPLIT_CRUSHED_PCT_DESC',
  DrySplitPctAsc = 'DRY_SPLIT_PCT_ASC',
  DrySplitPctDesc = 'DRY_SPLIT_PCT_DESC',
  WetStickyPctAsc = 'WET_STICKY_PCT_ASC',
  WetStickyPctDesc = 'WET_STICKY_PCT_DESC',
  WaterberriesPctAsc = 'WATERBERRIES_PCT_ASC',
  WaterberriesPctDesc = 'WATERBERRIES_PCT_DESC',
  ShatterPctAsc = 'SHATTER_PCT_ASC',
  ShatterPctDesc = 'SHATTER_PCT_DESC',
  TotalConditionDefectsPctAsc = 'TOTAL_CONDITION_DEFECTS_PCT_ASC',
  TotalConditionDefectsPctDesc = 'TOTAL_CONDITION_DEFECTS_PCT_DESC',
  TotalDefectsPctAsc = 'TOTAL_DEFECTS_PCT_ASC',
  TotalDefectsPctDesc = 'TOTAL_DEFECTS_PCT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PeruDepartureInspectionPallet` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type PeruDepartureInspectionPalletCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `palletId` field. */
  palletId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `containerId` field. */
  containerId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `size` field. */
  size?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `netWeight` field. */
  netWeight?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `openingScore` field. */
  openingScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `colorScore` field. */
  colorScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `stemScore` field. */
  stemScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `textureScore` field. */
  textureScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `bunchesPerBox` field. */
  bunchesPerBox?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `brix` field. */
  brix?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `qualityScore` field. */
  qualityScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `conditionScore` field. */
  conditionScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `stragglyTightPct` field. */
  stragglyTightPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `surfaceDiscPct` field. */
  surfaceDiscPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `russetScarsPct` field. */
  russetScarsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `sunburnPct` field. */
  sunburnPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `undersizedBunchesPct` field. */
  undersizedBunchesPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `otherDefectsPct` field. */
  otherDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `totalQualityDefectsPct` field. */
  totalQualityDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `stemDehyPct` field. */
  stemDehyPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `glassyWeakPct` field. */
  glassyWeakPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `decayPct` field. */
  decayPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `splitCrushedPct` field. */
  splitCrushedPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `drySplitPct` field. */
  drySplitPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `wetStickyPct` field. */
  wetStickyPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `waterberriesPct` field. */
  waterberriesPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `shatterPct` field. */
  shatterPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `totalConditionDefectsPct` field. */
  totalConditionDefectsPct?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `totalDefectsPct` field. */
  totalDefectsPct?: Maybe<Scalars['BigFloat']>;
};

/** A filter to be used against `PeruDepartureInspectionPallet` object types. All fields are combined with a logical ‘and.’ */
export type PeruDepartureInspectionPalletFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `palletId` field. */
  palletId?: Maybe<StringFilter>;
  /** Filter by the object’s `containerId` field. */
  containerId?: Maybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: Maybe<StringFilter>;
  /** Filter by the object’s `netWeight` field. */
  netWeight?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `openingScore` field. */
  openingScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `colorScore` field. */
  colorScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `stemScore` field. */
  stemScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `textureScore` field. */
  textureScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `bunchesPerBox` field. */
  bunchesPerBox?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brix` field. */
  brix?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `qualityScore` field. */
  qualityScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `conditionScore` field. */
  conditionScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `stragglyTightPct` field. */
  stragglyTightPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `surfaceDiscPct` field. */
  surfaceDiscPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `russetScarsPct` field. */
  russetScarsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `sunburnPct` field. */
  sunburnPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `undersizedBunchesPct` field. */
  undersizedBunchesPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `otherDefectsPct` field. */
  otherDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `totalQualityDefectsPct` field. */
  totalQualityDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `stemDehyPct` field. */
  stemDehyPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `glassyWeakPct` field. */
  glassyWeakPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `decayPct` field. */
  decayPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `splitCrushedPct` field. */
  splitCrushedPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `drySplitPct` field. */
  drySplitPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `wetStickyPct` field. */
  wetStickyPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `waterberriesPct` field. */
  waterberriesPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `shatterPct` field. */
  shatterPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `totalConditionDefectsPct` field. */
  totalConditionDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `totalDefectsPct` field. */
  totalDefectsPct?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `container` relation. */
  container?: Maybe<PeruDepartureInspectionFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PeruDepartureInspectionPalletFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PeruDepartureInspectionPalletFilter>>;
  /** Negates the expression. */
  not?: Maybe<PeruDepartureInspectionPalletFilter>;
};

/** A filter to be used against `PeruDepartureInspection` object types. All fields are combined with a logical ‘and.’ */
export type PeruDepartureInspectionFilter = {
  /** Filter by the object’s `avgBunchesPerBox` field. */
  avgBunchesPerBox?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `avgNetWeight` field. */
  avgNetWeight?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `bagsPerBox` field. */
  bagsPerBox?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `bagType` field. */
  bagType?: Maybe<StringFilter>;
  /** Filter by the object’s `brand` field. */
  brand?: Maybe<StringFilter>;
  /** Filter by the object’s `brixAvg` field. */
  brixAvg?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brixMax` field. */
  brixMax?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brixMin` field. */
  brixMin?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `category` field. */
  category?: Maybe<StringFilter>;
  /** Filter by the object’s `comments` field. */
  comments?: Maybe<StringFilter>;
  /** Filter by the object’s `conditionScore` field. */
  conditionScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `containerId` field. */
  containerId?: Maybe<StringFilter>;
  /** Filter by the object’s `departureWeek` field. */
  departureWeek?: Maybe<StringFilter>;
  /** Filter by the object’s `destination` field. */
  destination?: Maybe<StringFilter>;
  /** Filter by the object’s `exporter` field. */
  exporter?: Maybe<StringFilter>;
  /** Filter by the object’s `inspectionDate` field. */
  inspectionDate?: Maybe<DateFilter>;
  /** Filter by the object’s `packingDate` field. */
  packingDate?: Maybe<DateFilter>;
  /** Filter by the object’s `packingHouse` field. */
  packingHouse?: Maybe<StringFilter>;
  /** Filter by the object’s `packingMaterial` field. */
  packingMaterial?: Maybe<StringFilter>;
  /** Filter by the object’s `presentation` field. */
  presentation?: Maybe<StringFilter>;
  /** Filter by the object’s `qualityScore` field. */
  qualityScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `variety` field. */
  variety?: Maybe<StringFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `peruDepartureInspectionPalletsByContainerId` relation. */
  peruDepartureInspectionPalletsByContainerId?: Maybe<PeruDepartureInspectionToManyPeruDepartureInspectionPalletFilter>;
  /** Some related `peruDepartureInspectionPalletsByContainerId` exist. */
  peruDepartureInspectionPalletsByContainerIdExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PeruDepartureInspectionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PeruDepartureInspectionFilter>>;
  /** Negates the expression. */
  not?: Maybe<PeruDepartureInspectionFilter>;
};

/** A filter to be used against many `PeruDepartureInspectionPallet` object types. All fields are combined with a logical ‘and.’ */
export type PeruDepartureInspectionToManyPeruDepartureInspectionPalletFilter = {
  /** Every related `PeruDepartureInspectionPallet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PeruDepartureInspectionPalletFilter>;
  /** Some related `PeruDepartureInspectionPallet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PeruDepartureInspectionPalletFilter>;
  /** No related `PeruDepartureInspectionPallet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PeruDepartureInspectionPalletFilter>;
};

/** A `PeruDepartureInspection` edge in the connection. */
export type PeruDepartureInspectionsEdge = {
  __typename?: 'PeruDepartureInspectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PeruDepartureInspection` at the end of the edge. */
  node?: Maybe<PeruDepartureInspection>;
};

/** Methods to use when ordering `PeruDepartureInspection`. */
export enum PeruDepartureInspectionsOrderBy {
  Natural = 'NATURAL',
  AvgBunchesPerBoxAsc = 'AVG_BUNCHES_PER_BOX_ASC',
  AvgBunchesPerBoxDesc = 'AVG_BUNCHES_PER_BOX_DESC',
  AvgNetWeightAsc = 'AVG_NET_WEIGHT_ASC',
  AvgNetWeightDesc = 'AVG_NET_WEIGHT_DESC',
  BagsPerBoxAsc = 'BAGS_PER_BOX_ASC',
  BagsPerBoxDesc = 'BAGS_PER_BOX_DESC',
  BagTypeAsc = 'BAG_TYPE_ASC',
  BagTypeDesc = 'BAG_TYPE_DESC',
  BrandAsc = 'BRAND_ASC',
  BrandDesc = 'BRAND_DESC',
  BrixAvgAsc = 'BRIX_AVG_ASC',
  BrixAvgDesc = 'BRIX_AVG_DESC',
  BrixMaxAsc = 'BRIX_MAX_ASC',
  BrixMaxDesc = 'BRIX_MAX_DESC',
  BrixMinAsc = 'BRIX_MIN_ASC',
  BrixMinDesc = 'BRIX_MIN_DESC',
  CategoryAsc = 'CATEGORY_ASC',
  CategoryDesc = 'CATEGORY_DESC',
  CommentsAsc = 'COMMENTS_ASC',
  CommentsDesc = 'COMMENTS_DESC',
  ConditionScoreAsc = 'CONDITION_SCORE_ASC',
  ConditionScoreDesc = 'CONDITION_SCORE_DESC',
  ContainerIdAsc = 'CONTAINER_ID_ASC',
  ContainerIdDesc = 'CONTAINER_ID_DESC',
  DepartureWeekAsc = 'DEPARTURE_WEEK_ASC',
  DepartureWeekDesc = 'DEPARTURE_WEEK_DESC',
  DestinationAsc = 'DESTINATION_ASC',
  DestinationDesc = 'DESTINATION_DESC',
  ExporterAsc = 'EXPORTER_ASC',
  ExporterDesc = 'EXPORTER_DESC',
  InspectionDateAsc = 'INSPECTION_DATE_ASC',
  InspectionDateDesc = 'INSPECTION_DATE_DESC',
  PackingDateAsc = 'PACKING_DATE_ASC',
  PackingDateDesc = 'PACKING_DATE_DESC',
  PackingHouseAsc = 'PACKING_HOUSE_ASC',
  PackingHouseDesc = 'PACKING_HOUSE_DESC',
  PackingMaterialAsc = 'PACKING_MATERIAL_ASC',
  PackingMaterialDesc = 'PACKING_MATERIAL_DESC',
  PresentationAsc = 'PRESENTATION_ASC',
  PresentationDesc = 'PRESENTATION_DESC',
  QualityScoreAsc = 'QUALITY_SCORE_ASC',
  QualityScoreDesc = 'QUALITY_SCORE_DESC',
  VarietyAsc = 'VARIETY_ASC',
  VarietyDesc = 'VARIETY_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PeruDepartureInspection` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type PeruDepartureInspectionCondition = {
  /** Checks for equality with the object’s `avgBunchesPerBox` field. */
  avgBunchesPerBox?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `avgNetWeight` field. */
  avgNetWeight?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `bagsPerBox` field. */
  bagsPerBox?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `bagType` field. */
  bagType?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `brand` field. */
  brand?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `brixAvg` field. */
  brixAvg?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `brixMax` field. */
  brixMax?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `brixMin` field. */
  brixMin?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `category` field. */
  category?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `comments` field. */
  comments?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `conditionScore` field. */
  conditionScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `containerId` field. */
  containerId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `departureWeek` field. */
  departureWeek?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `destination` field. */
  destination?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `exporter` field. */
  exporter?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `inspectionDate` field. */
  inspectionDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `packingDate` field. */
  packingDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `packingHouse` field. */
  packingHouse?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `packingMaterial` field. */
  packingMaterial?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `presentation` field. */
  presentation?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `qualityScore` field. */
  qualityScore?: Maybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `variety` field. */
  variety?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type DistinctValuesConnection = {
  __typename?: 'DistinctValuesConnection';
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<DistinctValueEdge>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type DistinctValueEdge = {
  __typename?: 'DistinctValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type CustomerDistinctValuesConnection = {
  __typename?: 'CustomerDistinctValuesConnection';
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<CustomerDistinctValueEdge>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type CustomerDistinctValueEdge = {
  __typename?: 'CustomerDistinctValueEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `ChileDepartureInspection` values. */
export type ChileDepartureInspectionsConnection = {
  __typename?: 'ChileDepartureInspectionsConnection';
  /** A list of `ChileDepartureInspection` objects. */
  nodes: Array<Maybe<ChileDepartureInspection>>;
  /** A list of edges which contains the `ChileDepartureInspection` and cursor to aid in pagination. */
  edges: Array<ChileDepartureInspectionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChileDepartureInspection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ChileDepartureInspection = {
  __typename?: 'ChileDepartureInspection';
  lotNumber?: Maybe<Scalars['String']>;
  inspectionDate?: Maybe<Scalars['Date']>;
  packingDate?: Maybe<Scalars['String']>;
  shipper?: Maybe<Scalars['String']>;
  variety?: Maybe<Scalars['String']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  avgNetWeight?: Maybe<Scalars['BigFloat']>;
  avgBunchesCount?: Maybe<Scalars['BigFloat']>;
  brixAvg?: Maybe<Scalars['BigFloat']>;
  brixMin?: Maybe<Scalars['BigFloat']>;
  brixMax?: Maybe<Scalars['BigFloat']>;
  searchText?: Maybe<Scalars['String']>;
  imageUrls?: Maybe<Array<Scalars['String']>>;
};

/** A `ChileDepartureInspection` edge in the connection. */
export type ChileDepartureInspectionsEdge = {
  __typename?: 'ChileDepartureInspectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ChileDepartureInspection` at the end of the edge. */
  node?: Maybe<ChileDepartureInspection>;
};

/** A filter to be used against `ChileDepartureInspection` object types. All fields are combined with a logical ‘and.’ */
export type ChileDepartureInspectionFilter = {
  /** Filter by the object’s `lotNumber` field. */
  lotNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `inspectionDate` field. */
  inspectionDate?: Maybe<DateFilter>;
  /** Filter by the object’s `packingDate` field. */
  packingDate?: Maybe<StringFilter>;
  /** Filter by the object’s `shipper` field. */
  shipper?: Maybe<StringFilter>;
  /** Filter by the object’s `variety` field. */
  variety?: Maybe<StringFilter>;
  /** Filter by the object’s `qualityScore` field. */
  qualityScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `conditionScore` field. */
  conditionScore?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `avgNetWeight` field. */
  avgNetWeight?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `avgBunchesCount` field. */
  avgBunchesCount?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brixAvg` field. */
  brixAvg?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brixMin` field. */
  brixMin?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `brixMax` field. */
  brixMax?: Maybe<BigFloatFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ChileDepartureInspectionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ChileDepartureInspectionFilter>>;
  /** Negates the expression. */
  not?: Maybe<ChileDepartureInspectionFilter>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Country`. */
  createCountry?: Maybe<CreateCountryPayload>;
  /** Creates a single `Customer`. */
  createCustomer?: Maybe<CreateCustomerPayload>;
  /** Creates a single `PersonContact`. */
  createPersonContact?: Maybe<CreatePersonContactPayload>;
  /** Creates a single `Shipper`. */
  createShipper?: Maybe<CreateShipperPayload>;
  /** Creates a single `Warehouse`. */
  createWarehouse?: Maybe<CreateWarehousePayload>;
  /** Creates a single `AgendaItem`. */
  createAgendaItem?: Maybe<CreateAgendaItemPayload>;
  /** Creates a single `PriceCategory`. */
  createPriceCategory?: Maybe<CreatePriceCategoryPayload>;
  /** Creates a single `PriceEntry`. */
  createPriceEntry?: Maybe<CreatePriceEntryPayload>;
  /** Creates a single `PriceProduct`. */
  createPriceProduct?: Maybe<CreatePriceProductPayload>;
  /** Creates a single `PriceSize`. */
  createPriceSize?: Maybe<CreatePriceSizePayload>;
  /** Creates a single `ChileDepartureInspectionPallet`. */
  createChileDepartureInspectionPallet?: Maybe<CreateChileDepartureInspectionPalletPayload>;
  /** Creates a single `PeruDepartureInspection`. */
  createPeruDepartureInspection?: Maybe<CreatePeruDepartureInspectionPayload>;
  /** Creates a single `PeruDepartureInspectionPallet`. */
  createPeruDepartureInspectionPallet?: Maybe<CreatePeruDepartureInspectionPalletPayload>;
  /** Updates a single `Country` using its globally unique id and a patch. */
  updateCountryByNodeId?: Maybe<UpdateCountryPayload>;
  /** Updates a single `Country` using a unique key and a patch. */
  updateCountry?: Maybe<UpdateCountryPayload>;
  /** Updates a single `Customer` using its globally unique id and a patch. */
  updateCustomerByNodeId?: Maybe<UpdateCustomerPayload>;
  /** Updates a single `Customer` using a unique key and a patch. */
  updateCustomer?: Maybe<UpdateCustomerPayload>;
  /** Updates a single `PersonContact` using its globally unique id and a patch. */
  updatePersonContactByNodeId?: Maybe<UpdatePersonContactPayload>;
  /** Updates a single `PersonContact` using a unique key and a patch. */
  updatePersonContact?: Maybe<UpdatePersonContactPayload>;
  /** Updates a single `Shipper` using its globally unique id and a patch. */
  updateShipperByNodeId?: Maybe<UpdateShipperPayload>;
  /** Updates a single `Shipper` using a unique key and a patch. */
  updateShipper?: Maybe<UpdateShipperPayload>;
  /** Updates a single `Warehouse` using its globally unique id and a patch. */
  updateWarehouseByNodeId?: Maybe<UpdateWarehousePayload>;
  /** Updates a single `Warehouse` using a unique key and a patch. */
  updateWarehouse?: Maybe<UpdateWarehousePayload>;
  /** Updates a single `AgendaItem` using its globally unique id and a patch. */
  updateAgendaItemByNodeId?: Maybe<UpdateAgendaItemPayload>;
  /** Updates a single `AgendaItem` using a unique key and a patch. */
  updateAgendaItem?: Maybe<UpdateAgendaItemPayload>;
  /** Updates a single `PriceCategory` using its globally unique id and a patch. */
  updatePriceCategoryByNodeId?: Maybe<UpdatePriceCategoryPayload>;
  /** Updates a single `PriceCategory` using a unique key and a patch. */
  updatePriceCategory?: Maybe<UpdatePriceCategoryPayload>;
  /** Updates a single `PriceEntry` using its globally unique id and a patch. */
  updatePriceEntryByNodeId?: Maybe<UpdatePriceEntryPayload>;
  /** Updates a single `PriceEntry` using a unique key and a patch. */
  updatePriceEntry?: Maybe<UpdatePriceEntryPayload>;
  /** Updates a single `PriceProduct` using its globally unique id and a patch. */
  updatePriceProductByNodeId?: Maybe<UpdatePriceProductPayload>;
  /** Updates a single `PriceProduct` using a unique key and a patch. */
  updatePriceProduct?: Maybe<UpdatePriceProductPayload>;
  /** Updates a single `PriceSize` using its globally unique id and a patch. */
  updatePriceSizeByNodeId?: Maybe<UpdatePriceSizePayload>;
  /** Updates a single `PriceSize` using a unique key and a patch. */
  updatePriceSize?: Maybe<UpdatePriceSizePayload>;
  /** Updates a single `ChileDepartureInspectionPallet` using its globally unique id and a patch. */
  updateChileDepartureInspectionPalletByNodeId?: Maybe<UpdateChileDepartureInspectionPalletPayload>;
  /** Updates a single `ChileDepartureInspectionPallet` using a unique key and a patch. */
  updateChileDepartureInspectionPallet?: Maybe<UpdateChileDepartureInspectionPalletPayload>;
  /** Updates a single `PeruDepartureInspection` using its globally unique id and a patch. */
  updatePeruDepartureInspectionByNodeId?: Maybe<UpdatePeruDepartureInspectionPayload>;
  /** Updates a single `PeruDepartureInspection` using a unique key and a patch. */
  updatePeruDepartureInspection?: Maybe<UpdatePeruDepartureInspectionPayload>;
  /** Updates a single `PeruDepartureInspectionPallet` using its globally unique id and a patch. */
  updatePeruDepartureInspectionPalletByNodeId?: Maybe<UpdatePeruDepartureInspectionPalletPayload>;
  /** Updates a single `PeruDepartureInspectionPallet` using a unique key and a patch. */
  updatePeruDepartureInspectionPallet?: Maybe<UpdatePeruDepartureInspectionPalletPayload>;
  /** Deletes a single `Country` using its globally unique id. */
  deleteCountryByNodeId?: Maybe<DeleteCountryPayload>;
  /** Deletes a single `Country` using a unique key. */
  deleteCountry?: Maybe<DeleteCountryPayload>;
  /** Deletes a single `Customer` using its globally unique id. */
  deleteCustomerByNodeId?: Maybe<DeleteCustomerPayload>;
  /** Deletes a single `Customer` using a unique key. */
  deleteCustomer?: Maybe<DeleteCustomerPayload>;
  /** Deletes a single `PersonContact` using its globally unique id. */
  deletePersonContactByNodeId?: Maybe<DeletePersonContactPayload>;
  /** Deletes a single `PersonContact` using a unique key. */
  deletePersonContact?: Maybe<DeletePersonContactPayload>;
  /** Deletes a single `Shipper` using its globally unique id. */
  deleteShipperByNodeId?: Maybe<DeleteShipperPayload>;
  /** Deletes a single `Shipper` using a unique key. */
  deleteShipper?: Maybe<DeleteShipperPayload>;
  /** Deletes a single `Warehouse` using its globally unique id. */
  deleteWarehouseByNodeId?: Maybe<DeleteWarehousePayload>;
  /** Deletes a single `Warehouse` using a unique key. */
  deleteWarehouse?: Maybe<DeleteWarehousePayload>;
  /** Deletes a single `AgendaItem` using its globally unique id. */
  deleteAgendaItemByNodeId?: Maybe<DeleteAgendaItemPayload>;
  /** Deletes a single `AgendaItem` using a unique key. */
  deleteAgendaItem?: Maybe<DeleteAgendaItemPayload>;
  /** Deletes a single `PriceCategory` using its globally unique id. */
  deletePriceCategoryByNodeId?: Maybe<DeletePriceCategoryPayload>;
  /** Deletes a single `PriceCategory` using a unique key. */
  deletePriceCategory?: Maybe<DeletePriceCategoryPayload>;
  /** Deletes a single `PriceEntry` using its globally unique id. */
  deletePriceEntryByNodeId?: Maybe<DeletePriceEntryPayload>;
  /** Deletes a single `PriceEntry` using a unique key. */
  deletePriceEntry?: Maybe<DeletePriceEntryPayload>;
  /** Deletes a single `PriceProduct` using its globally unique id. */
  deletePriceProductByNodeId?: Maybe<DeletePriceProductPayload>;
  /** Deletes a single `PriceProduct` using a unique key. */
  deletePriceProduct?: Maybe<DeletePriceProductPayload>;
  /** Deletes a single `PriceSize` using its globally unique id. */
  deletePriceSizeByNodeId?: Maybe<DeletePriceSizePayload>;
  /** Deletes a single `PriceSize` using a unique key. */
  deletePriceSize?: Maybe<DeletePriceSizePayload>;
  /** Deletes a single `ChileDepartureInspectionPallet` using its globally unique id. */
  deleteChileDepartureInspectionPalletByNodeId?: Maybe<DeleteChileDepartureInspectionPalletPayload>;
  /** Deletes a single `ChileDepartureInspectionPallet` using a unique key. */
  deleteChileDepartureInspectionPallet?: Maybe<DeleteChileDepartureInspectionPalletPayload>;
  /** Deletes a single `PeruDepartureInspection` using its globally unique id. */
  deletePeruDepartureInspectionByNodeId?: Maybe<DeletePeruDepartureInspectionPayload>;
  /** Deletes a single `PeruDepartureInspection` using a unique key. */
  deletePeruDepartureInspection?: Maybe<DeletePeruDepartureInspectionPayload>;
  /** Deletes a single `PeruDepartureInspectionPallet` using its globally unique id. */
  deletePeruDepartureInspectionPalletByNodeId?: Maybe<DeletePeruDepartureInspectionPalletPayload>;
  /** Deletes a single `PeruDepartureInspectionPallet` using a unique key. */
  deletePeruDepartureInspectionPallet?: Maybe<DeletePeruDepartureInspectionPalletPayload>;
  bulkUpsertAgendaItem?: Maybe<BulkUpsertAgendaItemPayload>;
  bulkUpsertPriceCategory?: Maybe<BulkUpsertPriceCategoryPayload>;
  bulkUpsertPriceEntry?: Maybe<BulkUpsertPriceEntryPayload>;
  bulkUpsertPriceProduct?: Maybe<BulkUpsertPriceProductPayload>;
  bulkUpsertPriceSize?: Maybe<BulkUpsertPriceSizePayload>;
  deletePriceCategoryEntries?: Maybe<DeletePriceCategoryEntriesPayload>;
  deletePriceProductEntries?: Maybe<DeletePriceProductEntriesPayload>;
  deletePriceSizeEntries?: Maybe<DeletePriceSizeEntriesPayload>;
  batchCreateChileDepartureInspectionPallet?: Maybe<BatchCreateChileDepartureInspectionPalletPayload>;
  sendPriceSheetUpdateEmail: Scalars['String'];
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePersonContactArgs = {
  input: CreatePersonContactInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateShipperArgs = {
  input: CreateShipperInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWarehouseArgs = {
  input: CreateWarehouseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAgendaItemArgs = {
  input: CreateAgendaItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePriceCategoryArgs = {
  input: CreatePriceCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePriceEntryArgs = {
  input: CreatePriceEntryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePriceProductArgs = {
  input: CreatePriceProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePriceSizeArgs = {
  input: CreatePriceSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChileDepartureInspectionPalletArgs = {
  input: CreateChileDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePeruDepartureInspectionArgs = {
  input: CreatePeruDepartureInspectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePeruDepartureInspectionPalletArgs = {
  input: CreatePeruDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCountryByNodeIdArgs = {
  input: UpdateCountryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCustomerByNodeIdArgs = {
  input: UpdateCustomerByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonContactByNodeIdArgs = {
  input: UpdatePersonContactByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonContactArgs = {
  input: UpdatePersonContactInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShipperByNodeIdArgs = {
  input: UpdateShipperByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateShipperArgs = {
  input: UpdateShipperInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWarehouseByNodeIdArgs = {
  input: UpdateWarehouseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWarehouseArgs = {
  input: UpdateWarehouseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAgendaItemByNodeIdArgs = {
  input: UpdateAgendaItemByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAgendaItemArgs = {
  input: UpdateAgendaItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceCategoryByNodeIdArgs = {
  input: UpdatePriceCategoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceCategoryArgs = {
  input: UpdatePriceCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceEntryByNodeIdArgs = {
  input: UpdatePriceEntryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceEntryArgs = {
  input: UpdatePriceEntryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceProductByNodeIdArgs = {
  input: UpdatePriceProductByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceProductArgs = {
  input: UpdatePriceProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceSizeByNodeIdArgs = {
  input: UpdatePriceSizeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePriceSizeArgs = {
  input: UpdatePriceSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChileDepartureInspectionPalletByNodeIdArgs = {
  input: UpdateChileDepartureInspectionPalletByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChileDepartureInspectionPalletArgs = {
  input: UpdateChileDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePeruDepartureInspectionByNodeIdArgs = {
  input: UpdatePeruDepartureInspectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePeruDepartureInspectionArgs = {
  input: UpdatePeruDepartureInspectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePeruDepartureInspectionPalletByNodeIdArgs = {
  input: UpdatePeruDepartureInspectionPalletByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePeruDepartureInspectionPalletArgs = {
  input: UpdatePeruDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCountryByNodeIdArgs = {
  input: DeleteCountryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCountryArgs = {
  input: DeleteCountryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCustomerByNodeIdArgs = {
  input: DeleteCustomerByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCustomerArgs = {
  input: DeleteCustomerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonContactByNodeIdArgs = {
  input: DeletePersonContactByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonContactArgs = {
  input: DeletePersonContactInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShipperByNodeIdArgs = {
  input: DeleteShipperByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteShipperArgs = {
  input: DeleteShipperInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWarehouseByNodeIdArgs = {
  input: DeleteWarehouseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWarehouseArgs = {
  input: DeleteWarehouseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAgendaItemByNodeIdArgs = {
  input: DeleteAgendaItemByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAgendaItemArgs = {
  input: DeleteAgendaItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceCategoryByNodeIdArgs = {
  input: DeletePriceCategoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceCategoryArgs = {
  input: DeletePriceCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceEntryByNodeIdArgs = {
  input: DeletePriceEntryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceEntryArgs = {
  input: DeletePriceEntryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceProductByNodeIdArgs = {
  input: DeletePriceProductByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceProductArgs = {
  input: DeletePriceProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceSizeByNodeIdArgs = {
  input: DeletePriceSizeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceSizeArgs = {
  input: DeletePriceSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChileDepartureInspectionPalletByNodeIdArgs = {
  input: DeleteChileDepartureInspectionPalletByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChileDepartureInspectionPalletArgs = {
  input: DeleteChileDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePeruDepartureInspectionByNodeIdArgs = {
  input: DeletePeruDepartureInspectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePeruDepartureInspectionArgs = {
  input: DeletePeruDepartureInspectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePeruDepartureInspectionPalletByNodeIdArgs = {
  input: DeletePeruDepartureInspectionPalletByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePeruDepartureInspectionPalletArgs = {
  input: DeletePeruDepartureInspectionPalletInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkUpsertAgendaItemArgs = {
  input: BulkUpsertAgendaItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkUpsertPriceCategoryArgs = {
  input: BulkUpsertPriceCategoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkUpsertPriceEntryArgs = {
  input: BulkUpsertPriceEntryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkUpsertPriceProductArgs = {
  input: BulkUpsertPriceProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkUpsertPriceSizeArgs = {
  input: BulkUpsertPriceSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceCategoryEntriesArgs = {
  input: DeletePriceCategoryEntriesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceProductEntriesArgs = {
  input: DeletePriceProductEntriesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePriceSizeEntriesArgs = {
  input: DeletePriceSizeEntriesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBatchCreateChileDepartureInspectionPalletArgs = {
  input: BatchCreateChileDepartureInspectionPalletInput;
};

/** The output of our create `Country` mutation. */
export type CreateCountryPayload = {
  __typename?: 'CreateCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Country` that was created by this mutation. */
  country?: Maybe<Country>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Country`. May be used by Relay 1. */
  countryEdge?: Maybe<CountriesEdge>;
};


/** The output of our create `Country` mutation. */
export type CreateCountryPayloadCountryEdgeArgs = {
  orderBy?: Maybe<Array<CountriesOrderBy>>;
};

/** All input for the create `Country` mutation. */
export type CreateCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Country` to be created by this mutation. */
  country: CountryInput;
};

/** An input for mutations affecting `Country` */
export type CountryInput = {
  id: Scalars['String'];
  countryName: Scalars['String'];
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `warehouse` in the `CountryInput` mutation. */
export type WarehouseCountryIdFkeyInverseInput = {
  /** Flag indicating whether all other `warehouse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  connectById?: Maybe<Array<WarehouseWarehousePkeyConnect>>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<WarehouseNodeIdConnect>>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  deleteById?: Maybe<Array<WarehouseWarehousePkeyDelete>>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<WarehouseNodeIdDelete>>;
  /** The primary key(s) and patch data for `warehouse` for the far side of the relationship. */
  updateById?: Maybe<Array<WarehouseOnWarehouseForWarehouseCountryIdFkeyUsingWarehousePkeyUpdate>>;
  /** The primary key(s) and patch data for `warehouse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<CountryOnWarehouseForWarehouseCountryIdFkeyNodeIdUpdate>>;
  /** A `WarehouseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<WarehouseCountryIdFkeyWarehouseCreateInput>>;
};

/** The fields on `warehouse` to look up the row to connect. */
export type WarehouseWarehousePkeyConnect = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type WarehouseNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `warehouse` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `warehouse` to look up the row to delete. */
export type WarehouseWarehousePkeyDelete = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type WarehouseNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `warehouse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `warehouse` to look up the row to update. */
export type WarehouseOnWarehouseForWarehouseCountryIdFkeyUsingWarehousePkeyUpdate = {
  /** An object where the defined keys will be set on the `warehouse` being updated. */
  patch: UpdateWarehouseOnWarehouseForWarehouseCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `warehouse` being updated. */
export type UpdateWarehouseOnWarehouseForWarehouseCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  warehouseName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `country` in the `WarehouseInput` mutation. */
export type WarehouseCountryIdFkeyInput = {
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectById?: Maybe<CountryCountryPkeyConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectByNodeId?: Maybe<CountryNodeIdConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteById?: Maybe<CountryCountryPkeyDelete>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteByNodeId?: Maybe<CountryNodeIdDelete>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateById?: Maybe<CountryOnWarehouseForWarehouseCountryIdFkeyUsingCountryPkeyUpdate>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateByNodeId?: Maybe<WarehouseOnWarehouseForWarehouseCountryIdFkeyNodeIdUpdate>;
  /** A `CountryInput` object that will be created and connected to this object. */
  create?: Maybe<WarehouseCountryIdFkeyCountryCreateInput>;
};

/** The fields on `country` to look up the row to connect. */
export type CountryCountryPkeyConnect = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type CountryNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `country` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `country` to look up the row to delete. */
export type CountryCountryPkeyDelete = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type CountryNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `country` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `country` to look up the row to update. */
export type CountryOnWarehouseForWarehouseCountryIdFkeyUsingCountryPkeyUpdate = {
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: UpdateCountryOnWarehouseForWarehouseCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `country` being updated. */
export type UpdateCountryOnWarehouseForWarehouseCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `customer` in the `CountryInput` mutation. */
export type CustomerCountryIdFkeyInverseInput = {
  /** Flag indicating whether all other `customer` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  connectById?: Maybe<Array<CustomerCustomerPkeyConnect>>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<CustomerNodeIdConnect>>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  deleteById?: Maybe<Array<CustomerCustomerPkeyDelete>>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<CustomerNodeIdDelete>>;
  /** The primary key(s) and patch data for `customer` for the far side of the relationship. */
  updateById?: Maybe<Array<CustomerOnCustomerForCustomerCountryIdFkeyUsingCustomerPkeyUpdate>>;
  /** The primary key(s) and patch data for `customer` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<CountryOnCustomerForCustomerCountryIdFkeyNodeIdUpdate>>;
  /** A `CustomerInput` object that will be created and connected to this object. */
  create?: Maybe<Array<CustomerCountryIdFkeyCustomerCreateInput>>;
};

/** The fields on `customer` to look up the row to connect. */
export type CustomerCustomerPkeyConnect = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type CustomerNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `customer` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `customer` to look up the row to delete. */
export type CustomerCustomerPkeyDelete = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type CustomerNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `customer` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `customer` to look up the row to update. */
export type CustomerOnCustomerForCustomerCountryIdFkeyUsingCustomerPkeyUpdate = {
  /** An object where the defined keys will be set on the `customer` being updated. */
  patch: UpdateCustomerOnCustomerForCustomerCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `customer` being updated. */
export type UpdateCustomerOnCustomerForCustomerCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** Input for the nested mutation of `country` in the `CustomerInput` mutation. */
export type CustomerCountryIdFkeyInput = {
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectById?: Maybe<CountryCountryPkeyConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectByNodeId?: Maybe<CountryNodeIdConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteById?: Maybe<CountryCountryPkeyDelete>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteByNodeId?: Maybe<CountryNodeIdDelete>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateById?: Maybe<CountryOnCustomerForCustomerCountryIdFkeyUsingCountryPkeyUpdate>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateByNodeId?: Maybe<CustomerOnCustomerForCustomerCountryIdFkeyNodeIdUpdate>;
  /** A `CountryInput` object that will be created and connected to this object. */
  create?: Maybe<CustomerCountryIdFkeyCountryCreateInput>;
};

/** The fields on `country` to look up the row to update. */
export type CountryOnCustomerForCustomerCountryIdFkeyUsingCountryPkeyUpdate = {
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: UpdateCountryOnCustomerForCustomerCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `country` being updated. */
export type UpdateCountryOnCustomerForCustomerCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `shipper` in the `CountryInput` mutation. */
export type ShipperCountryIdFkeyInverseInput = {
  /** Flag indicating whether all other `shipper` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  connectById?: Maybe<Array<ShipperShipperPkeyConnect>>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ShipperNodeIdConnect>>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  deleteById?: Maybe<Array<ShipperShipperPkeyDelete>>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ShipperNodeIdDelete>>;
  /** The primary key(s) and patch data for `shipper` for the far side of the relationship. */
  updateById?: Maybe<Array<ShipperOnShipperForShipperCountryIdFkeyUsingShipperPkeyUpdate>>;
  /** The primary key(s) and patch data for `shipper` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<CountryOnShipperForShipperCountryIdFkeyNodeIdUpdate>>;
  /** A `ShipperInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ShipperCountryIdFkeyShipperCreateInput>>;
};

/** The fields on `shipper` to look up the row to connect. */
export type ShipperShipperPkeyConnect = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ShipperNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `shipper` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `shipper` to look up the row to delete. */
export type ShipperShipperPkeyDelete = {
  id: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ShipperNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `shipper` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `shipper` to look up the row to update. */
export type ShipperOnShipperForShipperCountryIdFkeyUsingShipperPkeyUpdate = {
  /** An object where the defined keys will be set on the `shipper` being updated. */
  patch: UpdateShipperOnShipperForShipperCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `shipper` being updated. */
export type UpdateShipperOnShipperForShipperCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  shipperName?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** Input for the nested mutation of `country` in the `ShipperInput` mutation. */
export type ShipperCountryIdFkeyInput = {
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectById?: Maybe<CountryCountryPkeyConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  connectByNodeId?: Maybe<CountryNodeIdConnect>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteById?: Maybe<CountryCountryPkeyDelete>;
  /** The primary key(s) for `country` for the far side of the relationship. */
  deleteByNodeId?: Maybe<CountryNodeIdDelete>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateById?: Maybe<CountryOnShipperForShipperCountryIdFkeyUsingCountryPkeyUpdate>;
  /** The primary key(s) and patch data for `country` for the far side of the relationship. */
  updateByNodeId?: Maybe<ShipperOnShipperForShipperCountryIdFkeyNodeIdUpdate>;
  /** A `CountryInput` object that will be created and connected to this object. */
  create?: Maybe<ShipperCountryIdFkeyCountryCreateInput>;
};

/** The fields on `country` to look up the row to update. */
export type CountryOnShipperForShipperCountryIdFkeyUsingCountryPkeyUpdate = {
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: UpdateCountryOnShipperForShipperCountryIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `country` being updated. */
export type UpdateCountryOnShipperForShipperCountryIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ShipperOnShipperForShipperCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `country` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: CountryPatch;
};

/** Represents an update to a `Country`. Fields that are set will be updated. */
export type CountryPatch = {
  id?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** The `country` to be created by this mutation. */
export type ShipperCountryIdFkeyCountryCreateInput = {
  id: Scalars['String'];
  countryName: Scalars['String'];
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `personContact` in the `ShipperInput` mutation. */
export type PersonContactShipperIdFkeyInverseInput = {
  /** Flag indicating whether all other `personContact` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectById?: Maybe<Array<PersonContactPersonContactPkeyConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PersonContactNodeIdConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteById?: Maybe<Array<PersonContactPersonContactPkeyDelete>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PersonContactNodeIdDelete>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateById?: Maybe<Array<PersonContactOnPersonContactForPersonContactShipperIdFkeyUsingPersonContactPkeyUpdate>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ShipperOnPersonContactForPersonContactShipperIdFkeyNodeIdUpdate>>;
  /** A `PersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PersonContactShipperIdFkeyPersonContactCreateInput>>;
};

/** The fields on `personContact` to look up the row to connect. */
export type PersonContactPersonContactPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PersonContactNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `personContact` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `personContact` to look up the row to delete. */
export type PersonContactPersonContactPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PersonContactNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `personContact` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `personContact` to look up the row to update. */
export type PersonContactOnPersonContactForPersonContactShipperIdFkeyUsingPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: UpdatePersonContactOnPersonContactForPersonContactShipperIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `personContact` being updated. */
export type UpdatePersonContactOnPersonContactForPersonContactShipperIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  customerId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** Input for the nested mutation of `shipper` in the `PersonContactInput` mutation. */
export type PersonContactShipperIdFkeyInput = {
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  connectById?: Maybe<ShipperShipperPkeyConnect>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  connectByNodeId?: Maybe<ShipperNodeIdConnect>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  deleteById?: Maybe<ShipperShipperPkeyDelete>;
  /** The primary key(s) for `shipper` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ShipperNodeIdDelete>;
  /** The primary key(s) and patch data for `shipper` for the far side of the relationship. */
  updateById?: Maybe<ShipperOnPersonContactForPersonContactShipperIdFkeyUsingShipperPkeyUpdate>;
  /** The primary key(s) and patch data for `shipper` for the far side of the relationship. */
  updateByNodeId?: Maybe<PersonContactOnPersonContactForPersonContactShipperIdFkeyNodeIdUpdate>;
  /** A `ShipperInput` object that will be created and connected to this object. */
  create?: Maybe<PersonContactShipperIdFkeyShipperCreateInput>;
};

/** The fields on `shipper` to look up the row to update. */
export type ShipperOnPersonContactForPersonContactShipperIdFkeyUsingShipperPkeyUpdate = {
  /** An object where the defined keys will be set on the `shipper` being updated. */
  patch: UpdateShipperOnPersonContactForPersonContactShipperIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `shipper` being updated. */
export type UpdateShipperOnPersonContactForPersonContactShipperIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  shipperName?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PersonContactOnPersonContactForPersonContactShipperIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `shipper` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `shipper` being updated. */
  patch: ShipperPatch;
};

/** Represents an update to a `Shipper`. Fields that are set will be updated. */
export type ShipperPatch = {
  id?: Maybe<Scalars['String']>;
  shipperName?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** The `shipper` to be created by this mutation. */
export type PersonContactShipperIdFkeyShipperCreateInput = {
  id: Scalars['String'];
  shipperName: Scalars['String'];
  countryId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** Input for the nested mutation of `customer` in the `PersonContactInput` mutation. */
export type PersonContactCustomerIdFkeyInput = {
  /** The primary key(s) for `customer` for the far side of the relationship. */
  connectById?: Maybe<CustomerCustomerPkeyConnect>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  connectByNodeId?: Maybe<CustomerNodeIdConnect>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  deleteById?: Maybe<CustomerCustomerPkeyDelete>;
  /** The primary key(s) for `customer` for the far side of the relationship. */
  deleteByNodeId?: Maybe<CustomerNodeIdDelete>;
  /** The primary key(s) and patch data for `customer` for the far side of the relationship. */
  updateById?: Maybe<CustomerOnPersonContactForPersonContactCustomerIdFkeyUsingCustomerPkeyUpdate>;
  /** The primary key(s) and patch data for `customer` for the far side of the relationship. */
  updateByNodeId?: Maybe<PersonContactOnPersonContactForPersonContactCustomerIdFkeyNodeIdUpdate>;
  /** A `CustomerInput` object that will be created and connected to this object. */
  create?: Maybe<PersonContactCustomerIdFkeyCustomerCreateInput>;
};

/** The fields on `customer` to look up the row to update. */
export type CustomerOnPersonContactForPersonContactCustomerIdFkeyUsingCustomerPkeyUpdate = {
  /** An object where the defined keys will be set on the `customer` being updated. */
  patch: UpdateCustomerOnPersonContactForPersonContactCustomerIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `customer` being updated. */
export type UpdateCustomerOnPersonContactForPersonContactCustomerIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** Input for the nested mutation of `personContact` in the `CustomerInput` mutation. */
export type PersonContactCustomerIdFkeyInverseInput = {
  /** Flag indicating whether all other `personContact` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectById?: Maybe<Array<PersonContactPersonContactPkeyConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PersonContactNodeIdConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteById?: Maybe<Array<PersonContactPersonContactPkeyDelete>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PersonContactNodeIdDelete>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateById?: Maybe<Array<PersonContactOnPersonContactForPersonContactCustomerIdFkeyUsingPersonContactPkeyUpdate>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<CustomerOnPersonContactForPersonContactCustomerIdFkeyNodeIdUpdate>>;
  /** A `PersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PersonContactCustomerIdFkeyPersonContactCreateInput>>;
};

/** The fields on `personContact` to look up the row to update. */
export type PersonContactOnPersonContactForPersonContactCustomerIdFkeyUsingPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: UpdatePersonContactOnPersonContactForPersonContactCustomerIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `personContact` being updated. */
export type UpdatePersonContactOnPersonContactForPersonContactCustomerIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** Input for the nested mutation of `warehouse` in the `PersonContactInput` mutation. */
export type PersonContactWarehouseIdFkeyInput = {
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  connectById?: Maybe<WarehouseWarehousePkeyConnect>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  connectByNodeId?: Maybe<WarehouseNodeIdConnect>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  deleteById?: Maybe<WarehouseWarehousePkeyDelete>;
  /** The primary key(s) for `warehouse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<WarehouseNodeIdDelete>;
  /** The primary key(s) and patch data for `warehouse` for the far side of the relationship. */
  updateById?: Maybe<WarehouseOnPersonContactForPersonContactWarehouseIdFkeyUsingWarehousePkeyUpdate>;
  /** The primary key(s) and patch data for `warehouse` for the far side of the relationship. */
  updateByNodeId?: Maybe<PersonContactOnPersonContactForPersonContactWarehouseIdFkeyNodeIdUpdate>;
  /** A `WarehouseInput` object that will be created and connected to this object. */
  create?: Maybe<PersonContactWarehouseIdFkeyWarehouseCreateInput>;
};

/** The fields on `warehouse` to look up the row to update. */
export type WarehouseOnPersonContactForPersonContactWarehouseIdFkeyUsingWarehousePkeyUpdate = {
  /** An object where the defined keys will be set on the `warehouse` being updated. */
  patch: UpdateWarehouseOnPersonContactForPersonContactWarehouseIdFkeyPatch;
  id: Scalars['String'];
};

/** An object where the defined keys will be set on the `warehouse` being updated. */
export type UpdateWarehouseOnPersonContactForPersonContactWarehouseIdFkeyPatch = {
  id?: Maybe<Scalars['String']>;
  warehouseName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `personContact` in the `WarehouseInput` mutation. */
export type PersonContactWarehouseIdFkeyInverseInput = {
  /** Flag indicating whether all other `personContact` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectById?: Maybe<Array<PersonContactPersonContactPkeyConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PersonContactNodeIdConnect>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteById?: Maybe<Array<PersonContactPersonContactPkeyDelete>>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PersonContactNodeIdDelete>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateById?: Maybe<Array<PersonContactOnPersonContactForPersonContactWarehouseIdFkeyUsingPersonContactPkeyUpdate>>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<WarehouseOnPersonContactForPersonContactWarehouseIdFkeyNodeIdUpdate>>;
  /** A `PersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PersonContactWarehouseIdFkeyPersonContactCreateInput>>;
};

/** The fields on `personContact` to look up the row to update. */
export type PersonContactOnPersonContactForPersonContactWarehouseIdFkeyUsingPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: UpdatePersonContactOnPersonContactForPersonContactWarehouseIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `personContact` being updated. */
export type UpdatePersonContactOnPersonContactForPersonContactWarehouseIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type WarehouseOnPersonContactForPersonContactWarehouseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `personContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: PersonContactPatch;
};

/** Represents an update to a `PersonContact`. Fields that are set will be updated. */
export type PersonContactPatch = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isPrimary?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The `personContact` to be created by this mutation. */
export type PersonContactWarehouseIdFkeyPersonContactCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isPrimary: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal: Scalars['Boolean'];
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PersonContactOnPersonContactForPersonContactWarehouseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `warehouse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `warehouse` being updated. */
  patch: WarehousePatch;
};

/** Represents an update to a `Warehouse`. Fields that are set will be updated. */
export type WarehousePatch = {
  id?: Maybe<Scalars['String']>;
  warehouseName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** The `warehouse` to be created by this mutation. */
export type PersonContactWarehouseIdFkeyWarehouseCreateInput = {
  id: Scalars['String'];
  warehouseName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CustomerOnPersonContactForPersonContactCustomerIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `personContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: PersonContactPatch;
};

/** The `personContact` to be created by this mutation. */
export type PersonContactCustomerIdFkeyPersonContactCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isPrimary: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal: Scalars['Boolean'];
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PersonContactOnPersonContactForPersonContactCustomerIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `customer` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `customer` being updated. */
  patch: CustomerPatch;
};

/** Represents an update to a `Customer`. Fields that are set will be updated. */
export type CustomerPatch = {
  id?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** The `customer` to be created by this mutation. */
export type PersonContactCustomerIdFkeyCustomerCreateInput = {
  id: Scalars['String'];
  customerName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ShipperOnPersonContactForPersonContactShipperIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `personContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: PersonContactPatch;
};

/** The `personContact` to be created by this mutation. */
export type PersonContactShipperIdFkeyPersonContactCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  customerId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isPrimary: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal: Scalars['Boolean'];
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CountryOnShipperForShipperCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `shipper` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `shipper` being updated. */
  patch: ShipperPatch;
};

/** The `shipper` to be created by this mutation. */
export type ShipperCountryIdFkeyShipperCreateInput = {
  id: Scalars['String'];
  shipperName: Scalars['String'];
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CustomerOnCustomerForCustomerCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `country` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: CountryPatch;
};

/** The `country` to be created by this mutation. */
export type CustomerCountryIdFkeyCountryCreateInput = {
  id: Scalars['String'];
  countryName: Scalars['String'];
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CountryOnCustomerForCustomerCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `customer` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `customer` being updated. */
  patch: CustomerPatch;
};

/** The `customer` to be created by this mutation. */
export type CustomerCountryIdFkeyCustomerCreateInput = {
  id: Scalars['String'];
  customerName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type WarehouseOnWarehouseForWarehouseCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `country` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: CountryPatch;
};

/** The `country` to be created by this mutation. */
export type WarehouseCountryIdFkeyCountryCreateInput = {
  id: Scalars['String'];
  countryName: Scalars['String'];
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CountryOnWarehouseForWarehouseCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `warehouse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `warehouse` being updated. */
  patch: WarehousePatch;
};

/** The `warehouse` to be created by this mutation. */
export type WarehouseCountryIdFkeyWarehouseCreateInput = {
  id: Scalars['String'];
  warehouseName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** The output of our create `Customer` mutation. */
export type CreateCustomerPayload = {
  __typename?: 'CreateCustomerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Customer` that was created by this mutation. */
  customer?: Maybe<Customer>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Customer`. */
  country?: Maybe<Country>;
  /** An edge for our `Customer`. May be used by Relay 1. */
  customerEdge?: Maybe<CustomersEdge>;
};


/** The output of our create `Customer` mutation. */
export type CreateCustomerPayloadCustomerEdgeArgs = {
  orderBy?: Maybe<Array<CustomersOrderBy>>;
};

/** All input for the create `Customer` mutation. */
export type CreateCustomerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Customer` to be created by this mutation. */
  customer: CustomerInput;
};

/** An input for mutations affecting `Customer` */
export type CustomerInput = {
  id: Scalars['String'];
  customerName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  active: Scalars['Boolean'];
  countryToCountryId?: Maybe<CustomerCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactCustomerIdFkeyInverseInput>;
};

/** The output of our create `PersonContact` mutation. */
export type CreatePersonContactPayload = {
  __typename?: 'CreatePersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PersonContact` that was created by this mutation. */
  personContact?: Maybe<PersonContact>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Shipper` that is related to this `PersonContact`. */
  shipper?: Maybe<Shipper>;
  /** Reads a single `Customer` that is related to this `PersonContact`. */
  customer?: Maybe<Customer>;
  /** Reads a single `Warehouse` that is related to this `PersonContact`. */
  warehouse?: Maybe<Warehouse>;
  /** An edge for our `PersonContact`. May be used by Relay 1. */
  personContactEdge?: Maybe<PersonContactsEdge>;
};


/** The output of our create `PersonContact` mutation. */
export type CreatePersonContactPayloadPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
};

/** All input for the create `PersonContact` mutation. */
export type CreatePersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PersonContact` to be created by this mutation. */
  personContact: PersonContactInput;
};

/** An input for mutations affecting `PersonContact` */
export type PersonContactInput = {
  id?: Maybe<Scalars['BigInt']>;
  shipperId?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  warehouseId?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isPrimary: Scalars['Boolean'];
  email?: Maybe<Scalars['String']>;
  secondaryEmail?: Maybe<Scalars['String']>;
  homePhone?: Maybe<Scalars['String']>;
  cellPhone?: Maybe<Scalars['String']>;
  workPhone?: Maybe<Scalars['String']>;
  workExtension?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['String']>;
  isInternal: Scalars['Boolean'];
  roles?: Maybe<Scalars['String']>;
  shipperToShipperId?: Maybe<PersonContactShipperIdFkeyInput>;
  customerToCustomerId?: Maybe<PersonContactCustomerIdFkeyInput>;
  warehouseToWarehouseId?: Maybe<PersonContactWarehouseIdFkeyInput>;
};

/** The output of our create `Shipper` mutation. */
export type CreateShipperPayload = {
  __typename?: 'CreateShipperPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Shipper` that was created by this mutation. */
  shipper?: Maybe<Shipper>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Shipper`. */
  country?: Maybe<Country>;
  /** An edge for our `Shipper`. May be used by Relay 1. */
  shipperEdge?: Maybe<ShippersEdge>;
};


/** The output of our create `Shipper` mutation. */
export type CreateShipperPayloadShipperEdgeArgs = {
  orderBy?: Maybe<Array<ShippersOrderBy>>;
};

/** All input for the create `Shipper` mutation. */
export type CreateShipperInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Shipper` to be created by this mutation. */
  shipper: ShipperInput;
};

/** An input for mutations affecting `Shipper` */
export type ShipperInput = {
  id: Scalars['String'];
  shipperName: Scalars['String'];
  countryId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  logoSrc?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<ShipperCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactShipperIdFkeyInverseInput>;
};

/** The output of our create `Warehouse` mutation. */
export type CreateWarehousePayload = {
  __typename?: 'CreateWarehousePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Warehouse` that was created by this mutation. */
  warehouse?: Maybe<Warehouse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Warehouse`. */
  country?: Maybe<Country>;
  /** An edge for our `Warehouse`. May be used by Relay 1. */
  warehouseEdge?: Maybe<WarehousesEdge>;
};


/** The output of our create `Warehouse` mutation. */
export type CreateWarehousePayloadWarehouseEdgeArgs = {
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
};

/** All input for the create `Warehouse` mutation. */
export type CreateWarehouseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Warehouse` to be created by this mutation. */
  warehouse: WarehouseInput;
};

/** An input for mutations affecting `Warehouse` */
export type WarehouseInput = {
  id: Scalars['String'];
  warehouseName: Scalars['String'];
  address1?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  address3?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postalState?: Maybe<Scalars['String']>;
  countryId?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  outQueue?: Maybe<Scalars['String']>;
  stateTaxCode?: Maybe<Scalars['String']>;
  countyTaxCode?: Maybe<Scalars['String']>;
  cityTaxCode?: Maybe<Scalars['String']>;
  miscTaxCode?: Maybe<Scalars['String']>;
  countryToCountryId?: Maybe<WarehouseCountryIdFkeyInput>;
  personContactsUsingId?: Maybe<PersonContactWarehouseIdFkeyInverseInput>;
};

/** The output of our create `AgendaItem` mutation. */
export type CreateAgendaItemPayload = {
  __typename?: 'CreateAgendaItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `AgendaItem` that was created by this mutation. */
  agendaItem?: Maybe<AgendaItem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `AgendaItem`. May be used by Relay 1. */
  agendaItemEdge?: Maybe<AgendaItemsEdge>;
};


/** The output of our create `AgendaItem` mutation. */
export type CreateAgendaItemPayloadAgendaItemEdgeArgs = {
  orderBy?: Maybe<Array<AgendaItemsOrderBy>>;
};

/** All input for the create `AgendaItem` mutation. */
export type CreateAgendaItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `AgendaItem` to be created by this mutation. */
  agendaItem: AgendaItemInput;
};

/** An input for mutations affecting `AgendaItem` */
export type AgendaItemInput = {
  id?: Maybe<Scalars['BigInt']>;
  content: Scalars['String'];
  itemDate: Scalars['Date'];
  sortOrder: Scalars['Int'];
};

/** The output of our create `PriceCategory` mutation. */
export type CreatePriceCategoryPayload = {
  __typename?: 'CreatePriceCategoryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceCategory` that was created by this mutation. */
  priceCategory?: Maybe<PriceCategory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PriceCategory`. May be used by Relay 1. */
  priceCategoryEdge?: Maybe<PriceCategoriesEdge>;
};


/** The output of our create `PriceCategory` mutation. */
export type CreatePriceCategoryPayloadPriceCategoryEdgeArgs = {
  orderBy?: Maybe<Array<PriceCategoriesOrderBy>>;
};

/** All input for the create `PriceCategory` mutation. */
export type CreatePriceCategoryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceCategory` to be created by this mutation. */
  priceCategory: PriceCategoryInput;
};

/** An input for mutations affecting `PriceCategory` */
export type PriceCategoryInput = {
  id?: Maybe<Scalars['BigInt']>;
  categoryName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceProductsUsingId?: Maybe<PriceProductCategoryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `priceProduct` in the `PriceCategoryInput` mutation. */
export type PriceProductCategoryIdFkeyInverseInput = {
  /** Flag indicating whether all other `priceProduct` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  connectById?: Maybe<Array<PriceProductPriceProductPkeyConnect>>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PriceProductNodeIdConnect>>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  deleteById?: Maybe<Array<PriceProductPriceProductPkeyDelete>>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PriceProductNodeIdDelete>>;
  /** The primary key(s) and patch data for `priceProduct` for the far side of the relationship. */
  updateById?: Maybe<Array<PriceProductOnPriceProductForPriceProductCategoryIdFkeyUsingPriceProductPkeyUpdate>>;
  /** The primary key(s) and patch data for `priceProduct` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PriceCategoryOnPriceProductForPriceProductCategoryIdFkeyNodeIdUpdate>>;
  /** A `PriceProductInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PriceProductCategoryIdFkeyPriceProductCreateInput>>;
};

/** The fields on `priceProduct` to look up the row to connect. */
export type PriceProductPriceProductPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PriceProductNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `priceProduct` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceProduct` to look up the row to delete. */
export type PriceProductPriceProductPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PriceProductNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `priceProduct` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceProduct` to look up the row to update. */
export type PriceProductOnPriceProductForPriceProductCategoryIdFkeyUsingPriceProductPkeyUpdate = {
  /** An object where the defined keys will be set on the `priceProduct` being updated. */
  patch: UpdatePriceProductOnPriceProductForPriceProductCategoryIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceProduct` being updated. */
export type UpdatePriceProductOnPriceProductForPriceProductCategoryIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  color?: Maybe<Scalars['String']>;
  productName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** Input for the nested mutation of `priceCategory` in the `PriceProductInput` mutation. */
export type PriceProductCategoryIdFkeyInput = {
  /** The primary key(s) for `priceCategory` for the far side of the relationship. */
  connectById?: Maybe<PriceCategoryPriceCategoryPkeyConnect>;
  /** The primary key(s) for `priceCategory` for the far side of the relationship. */
  connectByNodeId?: Maybe<PriceCategoryNodeIdConnect>;
  /** The primary key(s) for `priceCategory` for the far side of the relationship. */
  deleteById?: Maybe<PriceCategoryPriceCategoryPkeyDelete>;
  /** The primary key(s) for `priceCategory` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PriceCategoryNodeIdDelete>;
  /** The primary key(s) and patch data for `priceCategory` for the far side of the relationship. */
  updateById?: Maybe<PriceCategoryOnPriceProductForPriceProductCategoryIdFkeyUsingPriceCategoryPkeyUpdate>;
  /** The primary key(s) and patch data for `priceCategory` for the far side of the relationship. */
  updateByNodeId?: Maybe<PriceProductOnPriceProductForPriceProductCategoryIdFkeyNodeIdUpdate>;
  /** A `PriceCategoryInput` object that will be created and connected to this object. */
  create?: Maybe<PriceProductCategoryIdFkeyPriceCategoryCreateInput>;
};

/** The fields on `priceCategory` to look up the row to connect. */
export type PriceCategoryPriceCategoryPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PriceCategoryNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `priceCategory` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceCategory` to look up the row to delete. */
export type PriceCategoryPriceCategoryPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PriceCategoryNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `priceCategory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceCategory` to look up the row to update. */
export type PriceCategoryOnPriceProductForPriceProductCategoryIdFkeyUsingPriceCategoryPkeyUpdate = {
  /** An object where the defined keys will be set on the `priceCategory` being updated. */
  patch: UpdatePriceCategoryOnPriceProductForPriceProductCategoryIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceCategory` being updated. */
export type UpdatePriceCategoryOnPriceProductForPriceProductCategoryIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  categoryName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceProductsUsingId?: Maybe<PriceProductCategoryIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceProductOnPriceProductForPriceProductCategoryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceCategory` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceCategory` being updated. */
  patch: PriceCategoryPatch;
};

/** Represents an update to a `PriceCategory`. Fields that are set will be updated. */
export type PriceCategoryPatch = {
  id?: Maybe<Scalars['BigInt']>;
  categoryName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceProductsUsingId?: Maybe<PriceProductCategoryIdFkeyInverseInput>;
};

/** The `priceCategory` to be created by this mutation. */
export type PriceProductCategoryIdFkeyPriceCategoryCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  categoryName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceProductsUsingId?: Maybe<PriceProductCategoryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `priceSize` in the `PriceProductInput` mutation. */
export type PriceSizeProductIdFkeyInverseInput = {
  /** Flag indicating whether all other `priceSize` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  connectById?: Maybe<Array<PriceSizePriceSizePkeyConnect>>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PriceSizeNodeIdConnect>>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  deleteById?: Maybe<Array<PriceSizePriceSizePkeyDelete>>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PriceSizeNodeIdDelete>>;
  /** The primary key(s) and patch data for `priceSize` for the far side of the relationship. */
  updateById?: Maybe<Array<PriceSizeOnPriceSizeForPriceSizeProductIdFkeyUsingPriceSizePkeyUpdate>>;
  /** The primary key(s) and patch data for `priceSize` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PriceProductOnPriceSizeForPriceSizeProductIdFkeyNodeIdUpdate>>;
  /** A `PriceSizeInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PriceSizeProductIdFkeyPriceSizeCreateInput>>;
};

/** The fields on `priceSize` to look up the row to connect. */
export type PriceSizePriceSizePkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PriceSizeNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `priceSize` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceSize` to look up the row to delete. */
export type PriceSizePriceSizePkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PriceSizeNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `priceSize` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceSize` to look up the row to update. */
export type PriceSizeOnPriceSizeForPriceSizeProductIdFkeyUsingPriceSizePkeyUpdate = {
  /** An object where the defined keys will be set on the `priceSize` being updated. */
  patch: UpdatePriceSizeOnPriceSizeForPriceSizeProductIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceSize` being updated. */
export type UpdatePriceSizeOnPriceSizeForPriceSizeProductIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  sizeName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** Input for the nested mutation of `priceProduct` in the `PriceSizeInput` mutation. */
export type PriceSizeProductIdFkeyInput = {
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  connectById?: Maybe<PriceProductPriceProductPkeyConnect>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  connectByNodeId?: Maybe<PriceProductNodeIdConnect>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  deleteById?: Maybe<PriceProductPriceProductPkeyDelete>;
  /** The primary key(s) for `priceProduct` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PriceProductNodeIdDelete>;
  /** The primary key(s) and patch data for `priceProduct` for the far side of the relationship. */
  updateById?: Maybe<PriceProductOnPriceSizeForPriceSizeProductIdFkeyUsingPriceProductPkeyUpdate>;
  /** The primary key(s) and patch data for `priceProduct` for the far side of the relationship. */
  updateByNodeId?: Maybe<PriceSizeOnPriceSizeForPriceSizeProductIdFkeyNodeIdUpdate>;
  /** A `PriceProductInput` object that will be created and connected to this object. */
  create?: Maybe<PriceSizeProductIdFkeyPriceProductCreateInput>;
};

/** The fields on `priceProduct` to look up the row to update. */
export type PriceProductOnPriceSizeForPriceSizeProductIdFkeyUsingPriceProductPkeyUpdate = {
  /** An object where the defined keys will be set on the `priceProduct` being updated. */
  patch: UpdatePriceProductOnPriceSizeForPriceSizeProductIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceProduct` being updated. */
export type UpdatePriceProductOnPriceSizeForPriceSizeProductIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  categoryId?: Maybe<Scalars['BigInt']>;
  color?: Maybe<Scalars['String']>;
  productName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceSizeOnPriceSizeForPriceSizeProductIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceProduct` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceProduct` being updated. */
  patch: PriceProductPatch;
};

/** Represents an update to a `PriceProduct`. Fields that are set will be updated. */
export type PriceProductPatch = {
  id?: Maybe<Scalars['BigInt']>;
  categoryId?: Maybe<Scalars['BigInt']>;
  color?: Maybe<Scalars['String']>;
  productName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** The `priceProduct` to be created by this mutation. */
export type PriceSizeProductIdFkeyPriceProductCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  categoryId?: Maybe<Scalars['BigInt']>;
  color: Scalars['String'];
  productName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** Input for the nested mutation of `priceEntry` in the `PriceSizeInput` mutation. */
export type PriceEntrySizeIdFkeyInverseInput = {
  /** Flag indicating whether all other `priceEntry` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `priceEntry` for the far side of the relationship. */
  connectById?: Maybe<Array<PriceEntryPriceEntryPkeyConnect>>;
  /** The primary key(s) for `priceEntry` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PriceEntryNodeIdConnect>>;
  /** The primary key(s) for `priceEntry` for the far side of the relationship. */
  deleteById?: Maybe<Array<PriceEntryPriceEntryPkeyDelete>>;
  /** The primary key(s) for `priceEntry` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PriceEntryNodeIdDelete>>;
  /** The primary key(s) and patch data for `priceEntry` for the far side of the relationship. */
  updateById?: Maybe<Array<PriceEntryOnPriceEntryForPriceEntrySizeIdFkeyUsingPriceEntryPkeyUpdate>>;
  /** The primary key(s) and patch data for `priceEntry` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PriceSizeOnPriceEntryForPriceEntrySizeIdFkeyNodeIdUpdate>>;
  /** A `PriceEntryInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PriceEntrySizeIdFkeyPriceEntryCreateInput>>;
};

/** The fields on `priceEntry` to look up the row to connect. */
export type PriceEntryPriceEntryPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PriceEntryNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `priceEntry` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceEntry` to look up the row to delete. */
export type PriceEntryPriceEntryPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PriceEntryNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `priceEntry` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `priceEntry` to look up the row to update. */
export type PriceEntryOnPriceEntryForPriceEntrySizeIdFkeyUsingPriceEntryPkeyUpdate = {
  /** An object where the defined keys will be set on the `priceEntry` being updated. */
  patch: UpdatePriceEntryOnPriceEntryForPriceEntrySizeIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceEntry` being updated. */
export type UpdatePriceEntryOnPriceEntryForPriceEntrySizeIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  entryDate?: Maybe<Scalars['Date']>;
  entryDescription?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['Boolean']>;
  priceSizeToSizeId?: Maybe<PriceEntrySizeIdFkeyInput>;
};

/** Input for the nested mutation of `priceSize` in the `PriceEntryInput` mutation. */
export type PriceEntrySizeIdFkeyInput = {
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  connectById?: Maybe<PriceSizePriceSizePkeyConnect>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  connectByNodeId?: Maybe<PriceSizeNodeIdConnect>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  deleteById?: Maybe<PriceSizePriceSizePkeyDelete>;
  /** The primary key(s) for `priceSize` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PriceSizeNodeIdDelete>;
  /** The primary key(s) and patch data for `priceSize` for the far side of the relationship. */
  updateById?: Maybe<PriceSizeOnPriceEntryForPriceEntrySizeIdFkeyUsingPriceSizePkeyUpdate>;
  /** The primary key(s) and patch data for `priceSize` for the far side of the relationship. */
  updateByNodeId?: Maybe<PriceEntryOnPriceEntryForPriceEntrySizeIdFkeyNodeIdUpdate>;
  /** A `PriceSizeInput` object that will be created and connected to this object. */
  create?: Maybe<PriceEntrySizeIdFkeyPriceSizeCreateInput>;
};

/** The fields on `priceSize` to look up the row to update. */
export type PriceSizeOnPriceEntryForPriceEntrySizeIdFkeyUsingPriceSizePkeyUpdate = {
  /** An object where the defined keys will be set on the `priceSize` being updated. */
  patch: UpdatePriceSizeOnPriceEntryForPriceEntrySizeIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `priceSize` being updated. */
export type UpdatePriceSizeOnPriceEntryForPriceEntrySizeIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  productId?: Maybe<Scalars['BigInt']>;
  sizeName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceEntryOnPriceEntryForPriceEntrySizeIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceSize` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceSize` being updated. */
  patch: PriceSizePatch;
};

/** Represents an update to a `PriceSize`. Fields that are set will be updated. */
export type PriceSizePatch = {
  id?: Maybe<Scalars['BigInt']>;
  productId?: Maybe<Scalars['BigInt']>;
  sizeName?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** The `priceSize` to be created by this mutation. */
export type PriceEntrySizeIdFkeyPriceSizeCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  productId?: Maybe<Scalars['BigInt']>;
  sizeName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceSizeOnPriceEntryForPriceEntrySizeIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceEntry` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceEntry` being updated. */
  patch: PriceEntryPatch;
};

/** Represents an update to a `PriceEntry`. Fields that are set will be updated. */
export type PriceEntryPatch = {
  id?: Maybe<Scalars['BigInt']>;
  sizeId?: Maybe<Scalars['BigInt']>;
  entryDate?: Maybe<Scalars['Date']>;
  entryDescription?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['Boolean']>;
  priceSizeToSizeId?: Maybe<PriceEntrySizeIdFkeyInput>;
};

/** The `priceEntry` to be created by this mutation. */
export type PriceEntrySizeIdFkeyPriceEntryCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  entryDate: Scalars['Date'];
  entryDescription: Scalars['String'];
  content: Scalars['String'];
  highlight: Scalars['Boolean'];
  priceSizeToSizeId?: Maybe<PriceEntrySizeIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceProductOnPriceSizeForPriceSizeProductIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceSize` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceSize` being updated. */
  patch: PriceSizePatch;
};

/** The `priceSize` to be created by this mutation. */
export type PriceSizeProductIdFkeyPriceSizeCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  sizeName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PriceCategoryOnPriceProductForPriceProductCategoryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `priceProduct` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `priceProduct` being updated. */
  patch: PriceProductPatch;
};

/** The `priceProduct` to be created by this mutation. */
export type PriceProductCategoryIdFkeyPriceProductCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  color: Scalars['String'];
  productName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** The output of our create `PriceEntry` mutation. */
export type CreatePriceEntryPayload = {
  __typename?: 'CreatePriceEntryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceEntry` that was created by this mutation. */
  priceEntry?: Maybe<PriceEntry>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceSize` that is related to this `PriceEntry`. */
  size?: Maybe<PriceSize>;
  /** An edge for our `PriceEntry`. May be used by Relay 1. */
  priceEntryEdge?: Maybe<PriceEntriesEdge>;
};


/** The output of our create `PriceEntry` mutation. */
export type CreatePriceEntryPayloadPriceEntryEdgeArgs = {
  orderBy?: Maybe<Array<PriceEntriesOrderBy>>;
};

/** All input for the create `PriceEntry` mutation. */
export type CreatePriceEntryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceEntry` to be created by this mutation. */
  priceEntry: PriceEntryInput;
};

/** An input for mutations affecting `PriceEntry` */
export type PriceEntryInput = {
  id?: Maybe<Scalars['BigInt']>;
  sizeId?: Maybe<Scalars['BigInt']>;
  entryDate: Scalars['Date'];
  entryDescription: Scalars['String'];
  content: Scalars['String'];
  highlight: Scalars['Boolean'];
  priceSizeToSizeId?: Maybe<PriceEntrySizeIdFkeyInput>;
};

/** The output of our create `PriceProduct` mutation. */
export type CreatePriceProductPayload = {
  __typename?: 'CreatePriceProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceProduct` that was created by this mutation. */
  priceProduct?: Maybe<PriceProduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceCategory` that is related to this `PriceProduct`. */
  category?: Maybe<PriceCategory>;
  /** An edge for our `PriceProduct`. May be used by Relay 1. */
  priceProductEdge?: Maybe<PriceProductsEdge>;
};


/** The output of our create `PriceProduct` mutation. */
export type CreatePriceProductPayloadPriceProductEdgeArgs = {
  orderBy?: Maybe<Array<PriceProductsOrderBy>>;
};

/** All input for the create `PriceProduct` mutation. */
export type CreatePriceProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceProduct` to be created by this mutation. */
  priceProduct: PriceProductInput;
};

/** An input for mutations affecting `PriceProduct` */
export type PriceProductInput = {
  id?: Maybe<Scalars['BigInt']>;
  categoryId?: Maybe<Scalars['BigInt']>;
  color: Scalars['String'];
  productName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceCategoryToCategoryId?: Maybe<PriceProductCategoryIdFkeyInput>;
  priceSizesUsingId?: Maybe<PriceSizeProductIdFkeyInverseInput>;
};

/** The output of our create `PriceSize` mutation. */
export type CreatePriceSizePayload = {
  __typename?: 'CreatePriceSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceSize` that was created by this mutation. */
  priceSize?: Maybe<PriceSize>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceProduct` that is related to this `PriceSize`. */
  product?: Maybe<PriceProduct>;
  /** An edge for our `PriceSize`. May be used by Relay 1. */
  priceSizeEdge?: Maybe<PriceSizesEdge>;
};


/** The output of our create `PriceSize` mutation. */
export type CreatePriceSizePayloadPriceSizeEdgeArgs = {
  orderBy?: Maybe<Array<PriceSizesOrderBy>>;
};

/** All input for the create `PriceSize` mutation. */
export type CreatePriceSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceSize` to be created by this mutation. */
  priceSize: PriceSizeInput;
};

/** An input for mutations affecting `PriceSize` */
export type PriceSizeInput = {
  id?: Maybe<Scalars['BigInt']>;
  productId?: Maybe<Scalars['BigInt']>;
  sizeName: Scalars['String'];
  sortOrder: Scalars['Int'];
  priceProductToProductId?: Maybe<PriceSizeProductIdFkeyInput>;
  priceEntriesUsingId?: Maybe<PriceEntrySizeIdFkeyInverseInput>;
};

/** The output of our create `ChileDepartureInspectionPallet` mutation. */
export type CreateChileDepartureInspectionPalletPayload = {
  __typename?: 'CreateChileDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ChileDepartureInspectionPallet` that was created by this mutation. */
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ChileDepartureInspectionPallet`. May be used by Relay 1. */
  chileDepartureInspectionPalletEdge?: Maybe<ChileDepartureInspectionPalletsEdge>;
};


/** The output of our create `ChileDepartureInspectionPallet` mutation. */
export type CreateChileDepartureInspectionPalletPayloadChileDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<ChileDepartureInspectionPalletsOrderBy>>;
};

/** All input for the create `ChileDepartureInspectionPallet` mutation. */
export type CreateChileDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ChileDepartureInspectionPallet` to be created by this mutation. */
  chileDepartureInspectionPallet: ChileDepartureInspectionPalletInput;
};

/** An input for mutations affecting `ChileDepartureInspectionPallet` */
export type ChileDepartureInspectionPalletInput = {
  id: Scalars['String'];
  lotId: Scalars['String'];
  lotNumber: Scalars['String'];
  locationName: Scalars['String'];
  shipper: Scalars['String'];
  inspectionDate: Scalars['Date'];
  productName: Scalars['String'];
  packingType: Scalars['String'];
  productType: Scalars['String'];
  palletCount: Scalars['BigFloat'];
  supervisor: Scalars['String'];
  palletNumber: Scalars['String'];
  boxesCount: Scalars['BigFloat'];
  netWeight: Scalars['BigFloat'];
  grower: Scalars['String'];
  size: Scalars['String'];
  variety: Scalars['String'];
  packingDate: Scalars['Date'];
  label: Scalars['String'];
  temperature: Scalars['String'];
  openAppearance: Scalars['String'];
  color: Scalars['String'];
  stem: Scalars['String'];
  texture: Scalars['String'];
  bunchesCount: Scalars['BigFloat'];
  brix: Scalars['BigFloat'];
  diameterMin: Scalars['BigFloat'];
  diameterMax: Scalars['BigFloat'];
  stragglyTightPct: Scalars['BigFloat'];
  surfaceDiscPct: Scalars['BigFloat'];
  russetScarsPct: Scalars['BigFloat'];
  sunburnPct: Scalars['BigFloat'];
  undersizedBunchesPct: Scalars['BigFloat'];
  otherDefectsPct: Scalars['BigFloat'];
  stemDehyPct: Scalars['BigFloat'];
  glassyWeakPct: Scalars['BigFloat'];
  decayPct: Scalars['BigFloat'];
  splitCrushedPct: Scalars['BigFloat'];
  drySplitPct: Scalars['BigFloat'];
  wetStickyPct: Scalars['BigFloat'];
  waterberriesPct: Scalars['BigFloat'];
  shatterPct: Scalars['BigFloat'];
  totalQualityDefectsPct: Scalars['BigFloat'];
  totalConditionDefectsPct: Scalars['BigFloat'];
  qualityScore: Scalars['BigFloat'];
  conditionScore: Scalars['BigFloat'];
  scoreName: Scalars['String'];
  reportLink: Scalars['String'];
  imagesLink: Scalars['String'];
};

/** The output of our create `PeruDepartureInspection` mutation. */
export type CreatePeruDepartureInspectionPayload = {
  __typename?: 'CreatePeruDepartureInspectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspection` that was created by this mutation. */
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PeruDepartureInspection`. May be used by Relay 1. */
  peruDepartureInspectionEdge?: Maybe<PeruDepartureInspectionsEdge>;
};


/** The output of our create `PeruDepartureInspection` mutation. */
export type CreatePeruDepartureInspectionPayloadPeruDepartureInspectionEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionsOrderBy>>;
};

/** All input for the create `PeruDepartureInspection` mutation. */
export type CreatePeruDepartureInspectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspection` to be created by this mutation. */
  peruDepartureInspection: PeruDepartureInspectionInput;
};

/** An input for mutations affecting `PeruDepartureInspection` */
export type PeruDepartureInspectionInput = {
  avgBunchesPerBox: Scalars['BigFloat'];
  avgNetWeight: Scalars['BigFloat'];
  bagsPerBox: Scalars['BigFloat'];
  bagType?: Maybe<Scalars['String']>;
  brand: Scalars['String'];
  brixAvg: Scalars['BigFloat'];
  brixMax: Scalars['BigFloat'];
  brixMin: Scalars['BigFloat'];
  category: Scalars['String'];
  comments: Scalars['String'];
  conditionScore: Scalars['BigFloat'];
  containerId: Scalars['String'];
  departureWeek: Scalars['String'];
  destination: Scalars['String'];
  exporter: Scalars['String'];
  inspectionDate: Scalars['Date'];
  packingDate: Scalars['Date'];
  packingHouse: Scalars['String'];
  packingMaterial: Scalars['String'];
  presentation: Scalars['String'];
  qualityScore: Scalars['BigFloat'];
  variety: Scalars['String'];
  peruDepartureInspectionPalletsUsingContainerId?: Maybe<FkContainerInverseInput>;
};

/** Input for the nested mutation of `peruDepartureInspectionPallet` in the `PeruDepartureInspectionInput` mutation. */
export type FkContainerInverseInput = {
  /** Flag indicating whether all other `peruDepartureInspectionPallet` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `peruDepartureInspectionPallet` for the far side of the relationship. */
  connectById?: Maybe<Array<PeruDepartureInspectionPalletPeruDepartureInspectionPalletPkeyConnect>>;
  /** The primary key(s) for `peruDepartureInspectionPallet` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PeruDepartureInspectionPalletNodeIdConnect>>;
  /** The primary key(s) for `peruDepartureInspectionPallet` for the far side of the relationship. */
  deleteById?: Maybe<Array<PeruDepartureInspectionPalletPeruDepartureInspectionPalletPkeyDelete>>;
  /** The primary key(s) for `peruDepartureInspectionPallet` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PeruDepartureInspectionPalletNodeIdDelete>>;
  /** The primary key(s) and patch data for `peruDepartureInspectionPallet` for the far side of the relationship. */
  updateById?: Maybe<Array<PeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerUsingPeruDepartureInspectionPalletPkeyUpdate>>;
  /** The primary key(s) and patch data for `peruDepartureInspectionPallet` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerNodeIdUpdate>>;
  /** A `PeruDepartureInspectionPalletInput` object that will be created and connected to this object. */
  create?: Maybe<Array<FkContainerPeruDepartureInspectionPalletCreateInput>>;
};

/** The fields on `peruDepartureInspectionPallet` to look up the row to connect. */
export type PeruDepartureInspectionPalletPeruDepartureInspectionPalletPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PeruDepartureInspectionPalletNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspectionPallet` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `peruDepartureInspectionPallet` to look up the row to delete. */
export type PeruDepartureInspectionPalletPeruDepartureInspectionPalletPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PeruDepartureInspectionPalletNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspectionPallet` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `peruDepartureInspectionPallet` to look up the row to update. */
export type PeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerUsingPeruDepartureInspectionPalletPkeyUpdate = {
  /** An object where the defined keys will be set on the `peruDepartureInspectionPallet` being updated. */
  patch: UpdatePeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `peruDepartureInspectionPallet` being updated. */
export type UpdatePeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerPatch = {
  id?: Maybe<Scalars['BigInt']>;
  palletId?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  netWeight?: Maybe<Scalars['BigFloat']>;
  openingScore?: Maybe<Scalars['BigFloat']>;
  colorScore?: Maybe<Scalars['BigFloat']>;
  stemScore?: Maybe<Scalars['BigFloat']>;
  textureScore?: Maybe<Scalars['BigFloat']>;
  bunchesPerBox?: Maybe<Scalars['BigFloat']>;
  brix?: Maybe<Scalars['BigFloat']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  stragglyTightPct?: Maybe<Scalars['BigFloat']>;
  surfaceDiscPct?: Maybe<Scalars['BigFloat']>;
  russetScarsPct?: Maybe<Scalars['BigFloat']>;
  sunburnPct?: Maybe<Scalars['BigFloat']>;
  undersizedBunchesPct?: Maybe<Scalars['BigFloat']>;
  otherDefectsPct?: Maybe<Scalars['BigFloat']>;
  totalQualityDefectsPct?: Maybe<Scalars['BigFloat']>;
  stemDehyPct?: Maybe<Scalars['BigFloat']>;
  glassyWeakPct?: Maybe<Scalars['BigFloat']>;
  decayPct?: Maybe<Scalars['BigFloat']>;
  splitCrushedPct?: Maybe<Scalars['BigFloat']>;
  drySplitPct?: Maybe<Scalars['BigFloat']>;
  wetStickyPct?: Maybe<Scalars['BigFloat']>;
  waterberriesPct?: Maybe<Scalars['BigFloat']>;
  shatterPct?: Maybe<Scalars['BigFloat']>;
  totalConditionDefectsPct?: Maybe<Scalars['BigFloat']>;
  totalDefectsPct?: Maybe<Scalars['BigFloat']>;
  peruDepartureInspectionToContainerId?: Maybe<FkContainerInput>;
};

/** Input for the nested mutation of `peruDepartureInspection` in the `PeruDepartureInspectionPalletInput` mutation. */
export type FkContainerInput = {
  /** The primary key(s) for `peruDepartureInspection` for the far side of the relationship. */
  connectByContainerId?: Maybe<PeruDepartureInspectionPeruDepartureInspectionPkeyConnect>;
  /** The primary key(s) for `peruDepartureInspection` for the far side of the relationship. */
  connectByNodeId?: Maybe<PeruDepartureInspectionNodeIdConnect>;
  /** The primary key(s) for `peruDepartureInspection` for the far side of the relationship. */
  deleteByContainerId?: Maybe<PeruDepartureInspectionPeruDepartureInspectionPkeyDelete>;
  /** The primary key(s) for `peruDepartureInspection` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PeruDepartureInspectionNodeIdDelete>;
  /** The primary key(s) and patch data for `peruDepartureInspection` for the far side of the relationship. */
  updateByContainerId?: Maybe<PeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerUsingPeruDepartureInspectionPkeyUpdate>;
  /** The primary key(s) and patch data for `peruDepartureInspection` for the far side of the relationship. */
  updateByNodeId?: Maybe<PeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerNodeIdUpdate>;
  /** A `PeruDepartureInspectionInput` object that will be created and connected to this object. */
  create?: Maybe<FkContainerPeruDepartureInspectionCreateInput>;
};

/** The fields on `peruDepartureInspection` to look up the row to connect. */
export type PeruDepartureInspectionPeruDepartureInspectionPkeyConnect = {
  containerId: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PeruDepartureInspectionNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspection` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `peruDepartureInspection` to look up the row to delete. */
export type PeruDepartureInspectionPeruDepartureInspectionPkeyDelete = {
  containerId: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PeruDepartureInspectionNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `peruDepartureInspection` to look up the row to update. */
export type PeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerUsingPeruDepartureInspectionPkeyUpdate = {
  /** An object where the defined keys will be set on the `peruDepartureInspection` being updated. */
  patch: UpdatePeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerPatch;
  containerId: Scalars['String'];
};

/** An object where the defined keys will be set on the `peruDepartureInspection` being updated. */
export type UpdatePeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerPatch = {
  avgBunchesPerBox?: Maybe<Scalars['BigFloat']>;
  avgNetWeight?: Maybe<Scalars['BigFloat']>;
  bagsPerBox?: Maybe<Scalars['BigFloat']>;
  bagType?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  brixAvg?: Maybe<Scalars['BigFloat']>;
  brixMax?: Maybe<Scalars['BigFloat']>;
  brixMin?: Maybe<Scalars['BigFloat']>;
  category?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  departureWeek?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  exporter?: Maybe<Scalars['String']>;
  inspectionDate?: Maybe<Scalars['Date']>;
  packingDate?: Maybe<Scalars['Date']>;
  packingHouse?: Maybe<Scalars['String']>;
  packingMaterial?: Maybe<Scalars['String']>;
  presentation?: Maybe<Scalars['String']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  variety?: Maybe<Scalars['String']>;
  peruDepartureInspectionPalletsUsingContainerId?: Maybe<FkContainerInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PeruDepartureInspectionPalletOnPeruDepartureInspectionPalletForFkContainerNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspection` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `peruDepartureInspection` being updated. */
  patch: PeruDepartureInspectionPatch;
};

/** Represents an update to a `PeruDepartureInspection`. Fields that are set will be updated. */
export type PeruDepartureInspectionPatch = {
  avgBunchesPerBox?: Maybe<Scalars['BigFloat']>;
  avgNetWeight?: Maybe<Scalars['BigFloat']>;
  bagsPerBox?: Maybe<Scalars['BigFloat']>;
  bagType?: Maybe<Scalars['String']>;
  brand?: Maybe<Scalars['String']>;
  brixAvg?: Maybe<Scalars['BigFloat']>;
  brixMax?: Maybe<Scalars['BigFloat']>;
  brixMin?: Maybe<Scalars['BigFloat']>;
  category?: Maybe<Scalars['String']>;
  comments?: Maybe<Scalars['String']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  containerId?: Maybe<Scalars['String']>;
  departureWeek?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  exporter?: Maybe<Scalars['String']>;
  inspectionDate?: Maybe<Scalars['Date']>;
  packingDate?: Maybe<Scalars['Date']>;
  packingHouse?: Maybe<Scalars['String']>;
  packingMaterial?: Maybe<Scalars['String']>;
  presentation?: Maybe<Scalars['String']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  variety?: Maybe<Scalars['String']>;
  peruDepartureInspectionPalletsUsingContainerId?: Maybe<FkContainerInverseInput>;
};

/** The `peruDepartureInspection` to be created by this mutation. */
export type FkContainerPeruDepartureInspectionCreateInput = {
  avgBunchesPerBox: Scalars['BigFloat'];
  avgNetWeight: Scalars['BigFloat'];
  bagsPerBox: Scalars['BigFloat'];
  bagType?: Maybe<Scalars['String']>;
  brand: Scalars['String'];
  brixAvg: Scalars['BigFloat'];
  brixMax: Scalars['BigFloat'];
  brixMin: Scalars['BigFloat'];
  category: Scalars['String'];
  comments: Scalars['String'];
  conditionScore: Scalars['BigFloat'];
  departureWeek: Scalars['String'];
  destination: Scalars['String'];
  exporter: Scalars['String'];
  inspectionDate: Scalars['Date'];
  packingDate: Scalars['Date'];
  packingHouse: Scalars['String'];
  packingMaterial: Scalars['String'];
  presentation: Scalars['String'];
  qualityScore: Scalars['BigFloat'];
  variety: Scalars['String'];
  peruDepartureInspectionPalletsUsingContainerId?: Maybe<FkContainerInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PeruDepartureInspectionOnPeruDepartureInspectionPalletForFkContainerNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `peruDepartureInspectionPallet` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `peruDepartureInspectionPallet` being updated. */
  patch: PeruDepartureInspectionPalletPatch;
};

/** Represents an update to a `PeruDepartureInspectionPallet`. Fields that are set will be updated. */
export type PeruDepartureInspectionPalletPatch = {
  id?: Maybe<Scalars['BigInt']>;
  palletId?: Maybe<Scalars['String']>;
  containerId?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  netWeight?: Maybe<Scalars['BigFloat']>;
  openingScore?: Maybe<Scalars['BigFloat']>;
  colorScore?: Maybe<Scalars['BigFloat']>;
  stemScore?: Maybe<Scalars['BigFloat']>;
  textureScore?: Maybe<Scalars['BigFloat']>;
  bunchesPerBox?: Maybe<Scalars['BigFloat']>;
  brix?: Maybe<Scalars['BigFloat']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  stragglyTightPct?: Maybe<Scalars['BigFloat']>;
  surfaceDiscPct?: Maybe<Scalars['BigFloat']>;
  russetScarsPct?: Maybe<Scalars['BigFloat']>;
  sunburnPct?: Maybe<Scalars['BigFloat']>;
  undersizedBunchesPct?: Maybe<Scalars['BigFloat']>;
  otherDefectsPct?: Maybe<Scalars['BigFloat']>;
  totalQualityDefectsPct?: Maybe<Scalars['BigFloat']>;
  stemDehyPct?: Maybe<Scalars['BigFloat']>;
  glassyWeakPct?: Maybe<Scalars['BigFloat']>;
  decayPct?: Maybe<Scalars['BigFloat']>;
  splitCrushedPct?: Maybe<Scalars['BigFloat']>;
  drySplitPct?: Maybe<Scalars['BigFloat']>;
  wetStickyPct?: Maybe<Scalars['BigFloat']>;
  waterberriesPct?: Maybe<Scalars['BigFloat']>;
  shatterPct?: Maybe<Scalars['BigFloat']>;
  totalConditionDefectsPct?: Maybe<Scalars['BigFloat']>;
  totalDefectsPct?: Maybe<Scalars['BigFloat']>;
  peruDepartureInspectionToContainerId?: Maybe<FkContainerInput>;
};

/** The `peruDepartureInspectionPallet` to be created by this mutation. */
export type FkContainerPeruDepartureInspectionPalletCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  palletId: Scalars['String'];
  size: Scalars['String'];
  netWeight: Scalars['BigFloat'];
  openingScore: Scalars['BigFloat'];
  colorScore: Scalars['BigFloat'];
  stemScore: Scalars['BigFloat'];
  textureScore: Scalars['BigFloat'];
  bunchesPerBox: Scalars['BigFloat'];
  brix: Scalars['BigFloat'];
  qualityScore: Scalars['BigFloat'];
  conditionScore: Scalars['BigFloat'];
  stragglyTightPct: Scalars['BigFloat'];
  surfaceDiscPct: Scalars['BigFloat'];
  russetScarsPct: Scalars['BigFloat'];
  sunburnPct: Scalars['BigFloat'];
  undersizedBunchesPct: Scalars['BigFloat'];
  otherDefectsPct: Scalars['BigFloat'];
  totalQualityDefectsPct: Scalars['BigFloat'];
  stemDehyPct: Scalars['BigFloat'];
  glassyWeakPct: Scalars['BigFloat'];
  decayPct: Scalars['BigFloat'];
  splitCrushedPct: Scalars['BigFloat'];
  drySplitPct: Scalars['BigFloat'];
  wetStickyPct: Scalars['BigFloat'];
  waterberriesPct: Scalars['BigFloat'];
  shatterPct: Scalars['BigFloat'];
  totalConditionDefectsPct: Scalars['BigFloat'];
  totalDefectsPct: Scalars['BigFloat'];
  peruDepartureInspectionToContainerId?: Maybe<FkContainerInput>;
};

/** The output of our create `PeruDepartureInspectionPallet` mutation. */
export type CreatePeruDepartureInspectionPalletPayload = {
  __typename?: 'CreatePeruDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspectionPallet` that was created by this mutation. */
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PeruDepartureInspection` that is related to this `PeruDepartureInspectionPallet`. */
  container?: Maybe<PeruDepartureInspection>;
  /** An edge for our `PeruDepartureInspectionPallet`. May be used by Relay 1. */
  peruDepartureInspectionPalletEdge?: Maybe<PeruDepartureInspectionPalletsEdge>;
};


/** The output of our create `PeruDepartureInspectionPallet` mutation. */
export type CreatePeruDepartureInspectionPalletPayloadPeruDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionPalletsOrderBy>>;
};

/** All input for the create `PeruDepartureInspectionPallet` mutation. */
export type CreatePeruDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspectionPallet` to be created by this mutation. */
  peruDepartureInspectionPallet: PeruDepartureInspectionPalletInput;
};

/** An input for mutations affecting `PeruDepartureInspectionPallet` */
export type PeruDepartureInspectionPalletInput = {
  id?: Maybe<Scalars['BigInt']>;
  palletId: Scalars['String'];
  containerId?: Maybe<Scalars['String']>;
  size: Scalars['String'];
  netWeight: Scalars['BigFloat'];
  openingScore: Scalars['BigFloat'];
  colorScore: Scalars['BigFloat'];
  stemScore: Scalars['BigFloat'];
  textureScore: Scalars['BigFloat'];
  bunchesPerBox: Scalars['BigFloat'];
  brix: Scalars['BigFloat'];
  qualityScore: Scalars['BigFloat'];
  conditionScore: Scalars['BigFloat'];
  stragglyTightPct: Scalars['BigFloat'];
  surfaceDiscPct: Scalars['BigFloat'];
  russetScarsPct: Scalars['BigFloat'];
  sunburnPct: Scalars['BigFloat'];
  undersizedBunchesPct: Scalars['BigFloat'];
  otherDefectsPct: Scalars['BigFloat'];
  totalQualityDefectsPct: Scalars['BigFloat'];
  stemDehyPct: Scalars['BigFloat'];
  glassyWeakPct: Scalars['BigFloat'];
  decayPct: Scalars['BigFloat'];
  splitCrushedPct: Scalars['BigFloat'];
  drySplitPct: Scalars['BigFloat'];
  wetStickyPct: Scalars['BigFloat'];
  waterberriesPct: Scalars['BigFloat'];
  shatterPct: Scalars['BigFloat'];
  totalConditionDefectsPct: Scalars['BigFloat'];
  totalDefectsPct: Scalars['BigFloat'];
  peruDepartureInspectionToContainerId?: Maybe<FkContainerInput>;
};

/** The output of our update `Country` mutation. */
export type UpdateCountryPayload = {
  __typename?: 'UpdateCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Country` that was updated by this mutation. */
  country?: Maybe<Country>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Country`. May be used by Relay 1. */
  countryEdge?: Maybe<CountriesEdge>;
};


/** The output of our update `Country` mutation. */
export type UpdateCountryPayloadCountryEdgeArgs = {
  orderBy?: Maybe<Array<CountriesOrderBy>>;
};

/** All input for the `updateCountryByNodeId` mutation. */
export type UpdateCountryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Country` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Country` being updated. */
  patch: CountryPatch;
};

/** All input for the `updateCountry` mutation. */
export type UpdateCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Country` being updated. */
  patch: CountryPatch;
  id: Scalars['String'];
};

/** The output of our update `Customer` mutation. */
export type UpdateCustomerPayload = {
  __typename?: 'UpdateCustomerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Customer` that was updated by this mutation. */
  customer?: Maybe<Customer>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Customer`. */
  country?: Maybe<Country>;
  /** An edge for our `Customer`. May be used by Relay 1. */
  customerEdge?: Maybe<CustomersEdge>;
};


/** The output of our update `Customer` mutation. */
export type UpdateCustomerPayloadCustomerEdgeArgs = {
  orderBy?: Maybe<Array<CustomersOrderBy>>;
};

/** All input for the `updateCustomerByNodeId` mutation. */
export type UpdateCustomerByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Customer` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Customer` being updated. */
  patch: CustomerPatch;
};

/** All input for the `updateCustomer` mutation. */
export type UpdateCustomerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Customer` being updated. */
  patch: CustomerPatch;
  id: Scalars['String'];
};

/** The output of our update `PersonContact` mutation. */
export type UpdatePersonContactPayload = {
  __typename?: 'UpdatePersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PersonContact` that was updated by this mutation. */
  personContact?: Maybe<PersonContact>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Shipper` that is related to this `PersonContact`. */
  shipper?: Maybe<Shipper>;
  /** Reads a single `Customer` that is related to this `PersonContact`. */
  customer?: Maybe<Customer>;
  /** Reads a single `Warehouse` that is related to this `PersonContact`. */
  warehouse?: Maybe<Warehouse>;
  /** An edge for our `PersonContact`. May be used by Relay 1. */
  personContactEdge?: Maybe<PersonContactsEdge>;
};


/** The output of our update `PersonContact` mutation. */
export type UpdatePersonContactPayloadPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
};

/** All input for the `updatePersonContactByNodeId` mutation. */
export type UpdatePersonContactByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PersonContact` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PersonContact` being updated. */
  patch: PersonContactPatch;
};

/** All input for the `updatePersonContact` mutation. */
export type UpdatePersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PersonContact` being updated. */
  patch: PersonContactPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `Shipper` mutation. */
export type UpdateShipperPayload = {
  __typename?: 'UpdateShipperPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Shipper` that was updated by this mutation. */
  shipper?: Maybe<Shipper>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Shipper`. */
  country?: Maybe<Country>;
  /** An edge for our `Shipper`. May be used by Relay 1. */
  shipperEdge?: Maybe<ShippersEdge>;
};


/** The output of our update `Shipper` mutation. */
export type UpdateShipperPayloadShipperEdgeArgs = {
  orderBy?: Maybe<Array<ShippersOrderBy>>;
};

/** All input for the `updateShipperByNodeId` mutation. */
export type UpdateShipperByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Shipper` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Shipper` being updated. */
  patch: ShipperPatch;
};

/** All input for the `updateShipper` mutation. */
export type UpdateShipperInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Shipper` being updated. */
  patch: ShipperPatch;
  id: Scalars['String'];
};

/** The output of our update `Warehouse` mutation. */
export type UpdateWarehousePayload = {
  __typename?: 'UpdateWarehousePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Warehouse` that was updated by this mutation. */
  warehouse?: Maybe<Warehouse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Warehouse`. */
  country?: Maybe<Country>;
  /** An edge for our `Warehouse`. May be used by Relay 1. */
  warehouseEdge?: Maybe<WarehousesEdge>;
};


/** The output of our update `Warehouse` mutation. */
export type UpdateWarehousePayloadWarehouseEdgeArgs = {
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
};

/** All input for the `updateWarehouseByNodeId` mutation. */
export type UpdateWarehouseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Warehouse` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Warehouse` being updated. */
  patch: WarehousePatch;
};

/** All input for the `updateWarehouse` mutation. */
export type UpdateWarehouseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Warehouse` being updated. */
  patch: WarehousePatch;
  id: Scalars['String'];
};

/** The output of our update `AgendaItem` mutation. */
export type UpdateAgendaItemPayload = {
  __typename?: 'UpdateAgendaItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `AgendaItem` that was updated by this mutation. */
  agendaItem?: Maybe<AgendaItem>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `AgendaItem`. May be used by Relay 1. */
  agendaItemEdge?: Maybe<AgendaItemsEdge>;
};


/** The output of our update `AgendaItem` mutation. */
export type UpdateAgendaItemPayloadAgendaItemEdgeArgs = {
  orderBy?: Maybe<Array<AgendaItemsOrderBy>>;
};

/** All input for the `updateAgendaItemByNodeId` mutation. */
export type UpdateAgendaItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `AgendaItem` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `AgendaItem` being updated. */
  patch: AgendaItemPatch;
};

/** Represents an update to a `AgendaItem`. Fields that are set will be updated. */
export type AgendaItemPatch = {
  id?: Maybe<Scalars['BigInt']>;
  content?: Maybe<Scalars['String']>;
  itemDate?: Maybe<Scalars['Date']>;
  sortOrder?: Maybe<Scalars['Int']>;
};

/** All input for the `updateAgendaItem` mutation. */
export type UpdateAgendaItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `AgendaItem` being updated. */
  patch: AgendaItemPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `PriceCategory` mutation. */
export type UpdatePriceCategoryPayload = {
  __typename?: 'UpdatePriceCategoryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceCategory` that was updated by this mutation. */
  priceCategory?: Maybe<PriceCategory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PriceCategory`. May be used by Relay 1. */
  priceCategoryEdge?: Maybe<PriceCategoriesEdge>;
};


/** The output of our update `PriceCategory` mutation. */
export type UpdatePriceCategoryPayloadPriceCategoryEdgeArgs = {
  orderBy?: Maybe<Array<PriceCategoriesOrderBy>>;
};

/** All input for the `updatePriceCategoryByNodeId` mutation. */
export type UpdatePriceCategoryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceCategory` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PriceCategory` being updated. */
  patch: PriceCategoryPatch;
};

/** All input for the `updatePriceCategory` mutation. */
export type UpdatePriceCategoryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PriceCategory` being updated. */
  patch: PriceCategoryPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `PriceEntry` mutation. */
export type UpdatePriceEntryPayload = {
  __typename?: 'UpdatePriceEntryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceEntry` that was updated by this mutation. */
  priceEntry?: Maybe<PriceEntry>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceSize` that is related to this `PriceEntry`. */
  size?: Maybe<PriceSize>;
  /** An edge for our `PriceEntry`. May be used by Relay 1. */
  priceEntryEdge?: Maybe<PriceEntriesEdge>;
};


/** The output of our update `PriceEntry` mutation. */
export type UpdatePriceEntryPayloadPriceEntryEdgeArgs = {
  orderBy?: Maybe<Array<PriceEntriesOrderBy>>;
};

/** All input for the `updatePriceEntryByNodeId` mutation. */
export type UpdatePriceEntryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceEntry` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PriceEntry` being updated. */
  patch: PriceEntryPatch;
};

/** All input for the `updatePriceEntry` mutation. */
export type UpdatePriceEntryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PriceEntry` being updated. */
  patch: PriceEntryPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `PriceProduct` mutation. */
export type UpdatePriceProductPayload = {
  __typename?: 'UpdatePriceProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceProduct` that was updated by this mutation. */
  priceProduct?: Maybe<PriceProduct>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceCategory` that is related to this `PriceProduct`. */
  category?: Maybe<PriceCategory>;
  /** An edge for our `PriceProduct`. May be used by Relay 1. */
  priceProductEdge?: Maybe<PriceProductsEdge>;
};


/** The output of our update `PriceProduct` mutation. */
export type UpdatePriceProductPayloadPriceProductEdgeArgs = {
  orderBy?: Maybe<Array<PriceProductsOrderBy>>;
};

/** All input for the `updatePriceProductByNodeId` mutation. */
export type UpdatePriceProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceProduct` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PriceProduct` being updated. */
  patch: PriceProductPatch;
};

/** All input for the `updatePriceProduct` mutation. */
export type UpdatePriceProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PriceProduct` being updated. */
  patch: PriceProductPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `PriceSize` mutation. */
export type UpdatePriceSizePayload = {
  __typename?: 'UpdatePriceSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceSize` that was updated by this mutation. */
  priceSize?: Maybe<PriceSize>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceProduct` that is related to this `PriceSize`. */
  product?: Maybe<PriceProduct>;
  /** An edge for our `PriceSize`. May be used by Relay 1. */
  priceSizeEdge?: Maybe<PriceSizesEdge>;
};


/** The output of our update `PriceSize` mutation. */
export type UpdatePriceSizePayloadPriceSizeEdgeArgs = {
  orderBy?: Maybe<Array<PriceSizesOrderBy>>;
};

/** All input for the `updatePriceSizeByNodeId` mutation. */
export type UpdatePriceSizeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceSize` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PriceSize` being updated. */
  patch: PriceSizePatch;
};

/** All input for the `updatePriceSize` mutation. */
export type UpdatePriceSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PriceSize` being updated. */
  patch: PriceSizePatch;
  id: Scalars['BigInt'];
};

/** The output of our update `ChileDepartureInspectionPallet` mutation. */
export type UpdateChileDepartureInspectionPalletPayload = {
  __typename?: 'UpdateChileDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ChileDepartureInspectionPallet` that was updated by this mutation. */
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ChileDepartureInspectionPallet`. May be used by Relay 1. */
  chileDepartureInspectionPalletEdge?: Maybe<ChileDepartureInspectionPalletsEdge>;
};


/** The output of our update `ChileDepartureInspectionPallet` mutation. */
export type UpdateChileDepartureInspectionPalletPayloadChileDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<ChileDepartureInspectionPalletsOrderBy>>;
};

/** All input for the `updateChileDepartureInspectionPalletByNodeId` mutation. */
export type UpdateChileDepartureInspectionPalletByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ChileDepartureInspectionPallet` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ChileDepartureInspectionPallet` being updated. */
  patch: ChileDepartureInspectionPalletPatch;
};

/** Represents an update to a `ChileDepartureInspectionPallet`. Fields that are set will be updated. */
export type ChileDepartureInspectionPalletPatch = {
  id?: Maybe<Scalars['String']>;
  lotId?: Maybe<Scalars['String']>;
  lotNumber?: Maybe<Scalars['String']>;
  locationName?: Maybe<Scalars['String']>;
  shipper?: Maybe<Scalars['String']>;
  inspectionDate?: Maybe<Scalars['Date']>;
  productName?: Maybe<Scalars['String']>;
  packingType?: Maybe<Scalars['String']>;
  productType?: Maybe<Scalars['String']>;
  palletCount?: Maybe<Scalars['BigFloat']>;
  supervisor?: Maybe<Scalars['String']>;
  palletNumber?: Maybe<Scalars['String']>;
  boxesCount?: Maybe<Scalars['BigFloat']>;
  netWeight?: Maybe<Scalars['BigFloat']>;
  grower?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  variety?: Maybe<Scalars['String']>;
  packingDate?: Maybe<Scalars['Date']>;
  label?: Maybe<Scalars['String']>;
  temperature?: Maybe<Scalars['String']>;
  openAppearance?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  stem?: Maybe<Scalars['String']>;
  texture?: Maybe<Scalars['String']>;
  bunchesCount?: Maybe<Scalars['BigFloat']>;
  brix?: Maybe<Scalars['BigFloat']>;
  diameterMin?: Maybe<Scalars['BigFloat']>;
  diameterMax?: Maybe<Scalars['BigFloat']>;
  stragglyTightPct?: Maybe<Scalars['BigFloat']>;
  surfaceDiscPct?: Maybe<Scalars['BigFloat']>;
  russetScarsPct?: Maybe<Scalars['BigFloat']>;
  sunburnPct?: Maybe<Scalars['BigFloat']>;
  undersizedBunchesPct?: Maybe<Scalars['BigFloat']>;
  otherDefectsPct?: Maybe<Scalars['BigFloat']>;
  stemDehyPct?: Maybe<Scalars['BigFloat']>;
  glassyWeakPct?: Maybe<Scalars['BigFloat']>;
  decayPct?: Maybe<Scalars['BigFloat']>;
  splitCrushedPct?: Maybe<Scalars['BigFloat']>;
  drySplitPct?: Maybe<Scalars['BigFloat']>;
  wetStickyPct?: Maybe<Scalars['BigFloat']>;
  waterberriesPct?: Maybe<Scalars['BigFloat']>;
  shatterPct?: Maybe<Scalars['BigFloat']>;
  totalQualityDefectsPct?: Maybe<Scalars['BigFloat']>;
  totalConditionDefectsPct?: Maybe<Scalars['BigFloat']>;
  qualityScore?: Maybe<Scalars['BigFloat']>;
  conditionScore?: Maybe<Scalars['BigFloat']>;
  scoreName?: Maybe<Scalars['String']>;
  reportLink?: Maybe<Scalars['String']>;
  imagesLink?: Maybe<Scalars['String']>;
};

/** All input for the `updateChileDepartureInspectionPallet` mutation. */
export type UpdateChileDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ChileDepartureInspectionPallet` being updated. */
  patch: ChileDepartureInspectionPalletPatch;
  id: Scalars['String'];
};

/** The output of our update `PeruDepartureInspection` mutation. */
export type UpdatePeruDepartureInspectionPayload = {
  __typename?: 'UpdatePeruDepartureInspectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspection` that was updated by this mutation. */
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PeruDepartureInspection`. May be used by Relay 1. */
  peruDepartureInspectionEdge?: Maybe<PeruDepartureInspectionsEdge>;
};


/** The output of our update `PeruDepartureInspection` mutation. */
export type UpdatePeruDepartureInspectionPayloadPeruDepartureInspectionEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionsOrderBy>>;
};

/** All input for the `updatePeruDepartureInspectionByNodeId` mutation. */
export type UpdatePeruDepartureInspectionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PeruDepartureInspection` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PeruDepartureInspection` being updated. */
  patch: PeruDepartureInspectionPatch;
};

/** All input for the `updatePeruDepartureInspection` mutation. */
export type UpdatePeruDepartureInspectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PeruDepartureInspection` being updated. */
  patch: PeruDepartureInspectionPatch;
  containerId: Scalars['String'];
};

/** The output of our update `PeruDepartureInspectionPallet` mutation. */
export type UpdatePeruDepartureInspectionPalletPayload = {
  __typename?: 'UpdatePeruDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspectionPallet` that was updated by this mutation. */
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PeruDepartureInspection` that is related to this `PeruDepartureInspectionPallet`. */
  container?: Maybe<PeruDepartureInspection>;
  /** An edge for our `PeruDepartureInspectionPallet`. May be used by Relay 1. */
  peruDepartureInspectionPalletEdge?: Maybe<PeruDepartureInspectionPalletsEdge>;
};


/** The output of our update `PeruDepartureInspectionPallet` mutation. */
export type UpdatePeruDepartureInspectionPalletPayloadPeruDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionPalletsOrderBy>>;
};

/** All input for the `updatePeruDepartureInspectionPalletByNodeId` mutation. */
export type UpdatePeruDepartureInspectionPalletByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PeruDepartureInspectionPallet` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PeruDepartureInspectionPallet` being updated. */
  patch: PeruDepartureInspectionPalletPatch;
};

/** All input for the `updatePeruDepartureInspectionPallet` mutation. */
export type UpdatePeruDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PeruDepartureInspectionPallet` being updated. */
  patch: PeruDepartureInspectionPalletPatch;
  id: Scalars['BigInt'];
};

/** The output of our delete `Country` mutation. */
export type DeleteCountryPayload = {
  __typename?: 'DeleteCountryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Country` that was deleted by this mutation. */
  country?: Maybe<Country>;
  deletedCountryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Country`. May be used by Relay 1. */
  countryEdge?: Maybe<CountriesEdge>;
};


/** The output of our delete `Country` mutation. */
export type DeleteCountryPayloadCountryEdgeArgs = {
  orderBy?: Maybe<Array<CountriesOrderBy>>;
};

/** All input for the `deleteCountryByNodeId` mutation. */
export type DeleteCountryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Country` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteCountry` mutation. */
export type DeleteCountryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `Customer` mutation. */
export type DeleteCustomerPayload = {
  __typename?: 'DeleteCustomerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Customer` that was deleted by this mutation. */
  customer?: Maybe<Customer>;
  deletedCustomerNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Customer`. */
  country?: Maybe<Country>;
  /** An edge for our `Customer`. May be used by Relay 1. */
  customerEdge?: Maybe<CustomersEdge>;
};


/** The output of our delete `Customer` mutation. */
export type DeleteCustomerPayloadCustomerEdgeArgs = {
  orderBy?: Maybe<Array<CustomersOrderBy>>;
};

/** All input for the `deleteCustomerByNodeId` mutation. */
export type DeleteCustomerByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Customer` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteCustomer` mutation. */
export type DeleteCustomerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `PersonContact` mutation. */
export type DeletePersonContactPayload = {
  __typename?: 'DeletePersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PersonContact` that was deleted by this mutation. */
  personContact?: Maybe<PersonContact>;
  deletedPersonContactNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Shipper` that is related to this `PersonContact`. */
  shipper?: Maybe<Shipper>;
  /** Reads a single `Customer` that is related to this `PersonContact`. */
  customer?: Maybe<Customer>;
  /** Reads a single `Warehouse` that is related to this `PersonContact`. */
  warehouse?: Maybe<Warehouse>;
  /** An edge for our `PersonContact`. May be used by Relay 1. */
  personContactEdge?: Maybe<PersonContactsEdge>;
};


/** The output of our delete `PersonContact` mutation. */
export type DeletePersonContactPayloadPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
};

/** All input for the `deletePersonContactByNodeId` mutation. */
export type DeletePersonContactByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PersonContact` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePersonContact` mutation. */
export type DeletePersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `Shipper` mutation. */
export type DeleteShipperPayload = {
  __typename?: 'DeleteShipperPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Shipper` that was deleted by this mutation. */
  shipper?: Maybe<Shipper>;
  deletedShipperNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Shipper`. */
  country?: Maybe<Country>;
  /** An edge for our `Shipper`. May be used by Relay 1. */
  shipperEdge?: Maybe<ShippersEdge>;
};


/** The output of our delete `Shipper` mutation. */
export type DeleteShipperPayloadShipperEdgeArgs = {
  orderBy?: Maybe<Array<ShippersOrderBy>>;
};

/** All input for the `deleteShipperByNodeId` mutation. */
export type DeleteShipperByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Shipper` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteShipper` mutation. */
export type DeleteShipperInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `Warehouse` mutation. */
export type DeleteWarehousePayload = {
  __typename?: 'DeleteWarehousePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Warehouse` that was deleted by this mutation. */
  warehouse?: Maybe<Warehouse>;
  deletedWarehouseNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Country` that is related to this `Warehouse`. */
  country?: Maybe<Country>;
  /** An edge for our `Warehouse`. May be used by Relay 1. */
  warehouseEdge?: Maybe<WarehousesEdge>;
};


/** The output of our delete `Warehouse` mutation. */
export type DeleteWarehousePayloadWarehouseEdgeArgs = {
  orderBy?: Maybe<Array<WarehousesOrderBy>>;
};

/** All input for the `deleteWarehouseByNodeId` mutation. */
export type DeleteWarehouseByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Warehouse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteWarehouse` mutation. */
export type DeleteWarehouseInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `AgendaItem` mutation. */
export type DeleteAgendaItemPayload = {
  __typename?: 'DeleteAgendaItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `AgendaItem` that was deleted by this mutation. */
  agendaItem?: Maybe<AgendaItem>;
  deletedAgendaItemNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `AgendaItem`. May be used by Relay 1. */
  agendaItemEdge?: Maybe<AgendaItemsEdge>;
};


/** The output of our delete `AgendaItem` mutation. */
export type DeleteAgendaItemPayloadAgendaItemEdgeArgs = {
  orderBy?: Maybe<Array<AgendaItemsOrderBy>>;
};

/** All input for the `deleteAgendaItemByNodeId` mutation. */
export type DeleteAgendaItemByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `AgendaItem` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteAgendaItem` mutation. */
export type DeleteAgendaItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `PriceCategory` mutation. */
export type DeletePriceCategoryPayload = {
  __typename?: 'DeletePriceCategoryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceCategory` that was deleted by this mutation. */
  priceCategory?: Maybe<PriceCategory>;
  deletedPriceCategoryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PriceCategory`. May be used by Relay 1. */
  priceCategoryEdge?: Maybe<PriceCategoriesEdge>;
};


/** The output of our delete `PriceCategory` mutation. */
export type DeletePriceCategoryPayloadPriceCategoryEdgeArgs = {
  orderBy?: Maybe<Array<PriceCategoriesOrderBy>>;
};

/** All input for the `deletePriceCategoryByNodeId` mutation. */
export type DeletePriceCategoryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceCategory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePriceCategory` mutation. */
export type DeletePriceCategoryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `PriceEntry` mutation. */
export type DeletePriceEntryPayload = {
  __typename?: 'DeletePriceEntryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceEntry` that was deleted by this mutation. */
  priceEntry?: Maybe<PriceEntry>;
  deletedPriceEntryNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceSize` that is related to this `PriceEntry`. */
  size?: Maybe<PriceSize>;
  /** An edge for our `PriceEntry`. May be used by Relay 1. */
  priceEntryEdge?: Maybe<PriceEntriesEdge>;
};


/** The output of our delete `PriceEntry` mutation. */
export type DeletePriceEntryPayloadPriceEntryEdgeArgs = {
  orderBy?: Maybe<Array<PriceEntriesOrderBy>>;
};

/** All input for the `deletePriceEntryByNodeId` mutation. */
export type DeletePriceEntryByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceEntry` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePriceEntry` mutation. */
export type DeletePriceEntryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `PriceProduct` mutation. */
export type DeletePriceProductPayload = {
  __typename?: 'DeletePriceProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceProduct` that was deleted by this mutation. */
  priceProduct?: Maybe<PriceProduct>;
  deletedPriceProductNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceCategory` that is related to this `PriceProduct`. */
  category?: Maybe<PriceCategory>;
  /** An edge for our `PriceProduct`. May be used by Relay 1. */
  priceProductEdge?: Maybe<PriceProductsEdge>;
};


/** The output of our delete `PriceProduct` mutation. */
export type DeletePriceProductPayloadPriceProductEdgeArgs = {
  orderBy?: Maybe<Array<PriceProductsOrderBy>>;
};

/** All input for the `deletePriceProductByNodeId` mutation. */
export type DeletePriceProductByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceProduct` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePriceProduct` mutation. */
export type DeletePriceProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `PriceSize` mutation. */
export type DeletePriceSizePayload = {
  __typename?: 'DeletePriceSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PriceSize` that was deleted by this mutation. */
  priceSize?: Maybe<PriceSize>;
  deletedPriceSizeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PriceProduct` that is related to this `PriceSize`. */
  product?: Maybe<PriceProduct>;
  /** An edge for our `PriceSize`. May be used by Relay 1. */
  priceSizeEdge?: Maybe<PriceSizesEdge>;
};


/** The output of our delete `PriceSize` mutation. */
export type DeletePriceSizePayloadPriceSizeEdgeArgs = {
  orderBy?: Maybe<Array<PriceSizesOrderBy>>;
};

/** All input for the `deletePriceSizeByNodeId` mutation. */
export type DeletePriceSizeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PriceSize` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePriceSize` mutation. */
export type DeletePriceSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `ChileDepartureInspectionPallet` mutation. */
export type DeleteChileDepartureInspectionPalletPayload = {
  __typename?: 'DeleteChileDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ChileDepartureInspectionPallet` that was deleted by this mutation. */
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  deletedChileDepartureInspectionPalletNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ChileDepartureInspectionPallet`. May be used by Relay 1. */
  chileDepartureInspectionPalletEdge?: Maybe<ChileDepartureInspectionPalletsEdge>;
};


/** The output of our delete `ChileDepartureInspectionPallet` mutation. */
export type DeleteChileDepartureInspectionPalletPayloadChileDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<ChileDepartureInspectionPalletsOrderBy>>;
};

/** All input for the `deleteChileDepartureInspectionPalletByNodeId` mutation. */
export type DeleteChileDepartureInspectionPalletByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ChileDepartureInspectionPallet` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteChileDepartureInspectionPallet` mutation. */
export type DeleteChileDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `PeruDepartureInspection` mutation. */
export type DeletePeruDepartureInspectionPayload = {
  __typename?: 'DeletePeruDepartureInspectionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspection` that was deleted by this mutation. */
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  deletedPeruDepartureInspectionNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PeruDepartureInspection`. May be used by Relay 1. */
  peruDepartureInspectionEdge?: Maybe<PeruDepartureInspectionsEdge>;
};


/** The output of our delete `PeruDepartureInspection` mutation. */
export type DeletePeruDepartureInspectionPayloadPeruDepartureInspectionEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionsOrderBy>>;
};

/** All input for the `deletePeruDepartureInspectionByNodeId` mutation. */
export type DeletePeruDepartureInspectionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PeruDepartureInspection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePeruDepartureInspection` mutation. */
export type DeletePeruDepartureInspectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  containerId: Scalars['String'];
};

/** The output of our delete `PeruDepartureInspectionPallet` mutation. */
export type DeletePeruDepartureInspectionPalletPayload = {
  __typename?: 'DeletePeruDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PeruDepartureInspectionPallet` that was deleted by this mutation. */
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  deletedPeruDepartureInspectionPalletNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PeruDepartureInspection` that is related to this `PeruDepartureInspectionPallet`. */
  container?: Maybe<PeruDepartureInspection>;
  /** An edge for our `PeruDepartureInspectionPallet`. May be used by Relay 1. */
  peruDepartureInspectionPalletEdge?: Maybe<PeruDepartureInspectionPalletsEdge>;
};


/** The output of our delete `PeruDepartureInspectionPallet` mutation. */
export type DeletePeruDepartureInspectionPalletPayloadPeruDepartureInspectionPalletEdgeArgs = {
  orderBy?: Maybe<Array<PeruDepartureInspectionPalletsOrderBy>>;
};

/** All input for the `deletePeruDepartureInspectionPalletByNodeId` mutation. */
export type DeletePeruDepartureInspectionPalletByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PeruDepartureInspectionPallet` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePeruDepartureInspectionPallet` mutation. */
export type DeletePeruDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our `bulkUpsertAgendaItem` mutation. */
export type BulkUpsertAgendaItemPayload = {
  __typename?: 'BulkUpsertAgendaItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  agendaItems?: Maybe<Array<Maybe<AgendaItem>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkUpsertAgendaItem` mutation. */
export type BulkUpsertAgendaItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  items: Array<Maybe<AgendaItemInput>>;
};

/** The output of our `bulkUpsertPriceCategory` mutation. */
export type BulkUpsertPriceCategoryPayload = {
  __typename?: 'BulkUpsertPriceCategoryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  priceCategories?: Maybe<Array<Maybe<PriceCategory>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkUpsertPriceCategory` mutation. */
export type BulkUpsertPriceCategoryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  categories: Array<Maybe<PriceCategoryInput>>;
};

/** The output of our `bulkUpsertPriceEntry` mutation. */
export type BulkUpsertPriceEntryPayload = {
  __typename?: 'BulkUpsertPriceEntryPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  priceEntries?: Maybe<Array<Maybe<PriceEntry>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkUpsertPriceEntry` mutation. */
export type BulkUpsertPriceEntryInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  entries: Array<Maybe<PriceEntryInput>>;
};

/** The output of our `bulkUpsertPriceProduct` mutation. */
export type BulkUpsertPriceProductPayload = {
  __typename?: 'BulkUpsertPriceProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  priceProducts?: Maybe<Array<Maybe<PriceProduct>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkUpsertPriceProduct` mutation. */
export type BulkUpsertPriceProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  products: Array<Maybe<PriceProductInput>>;
};

/** The output of our `bulkUpsertPriceSize` mutation. */
export type BulkUpsertPriceSizePayload = {
  __typename?: 'BulkUpsertPriceSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  priceSizes?: Maybe<Array<Maybe<PriceSize>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkUpsertPriceSize` mutation. */
export type BulkUpsertPriceSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  sizes: Array<Maybe<PriceSizeInput>>;
};

/** The output of our `deletePriceCategoryEntries` mutation. */
export type DeletePriceCategoryEntriesPayload = {
  __typename?: 'DeletePriceCategoryEntriesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  bigInts?: Maybe<Array<Maybe<Scalars['BigInt']>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `deletePriceCategoryEntries` mutation. */
export type DeletePriceCategoryEntriesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  selectedCategoryId: Scalars['BigInt'];
  selectedDate: Scalars['Date'];
};

/** The output of our `deletePriceProductEntries` mutation. */
export type DeletePriceProductEntriesPayload = {
  __typename?: 'DeletePriceProductEntriesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  bigInts?: Maybe<Array<Maybe<Scalars['BigInt']>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `deletePriceProductEntries` mutation. */
export type DeletePriceProductEntriesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  selectedProductId: Scalars['BigInt'];
  selectedDate: Scalars['Date'];
};

/** The output of our `deletePriceSizeEntries` mutation. */
export type DeletePriceSizeEntriesPayload = {
  __typename?: 'DeletePriceSizeEntriesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  bigInts?: Maybe<Array<Maybe<Scalars['BigInt']>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `deletePriceSizeEntries` mutation. */
export type DeletePriceSizeEntriesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  selectedSizeId: Scalars['BigInt'];
  selectedDate: Scalars['Date'];
};

/** The output of our `batchCreateChileDepartureInspectionPallet` mutation. */
export type BatchCreateChileDepartureInspectionPalletPayload = {
  __typename?: 'BatchCreateChileDepartureInspectionPalletPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  chileDepartureInspectionPallets?: Maybe<Array<Maybe<ChileDepartureInspectionPallet>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `batchCreateChileDepartureInspectionPallet` mutation. */
export type BatchCreateChileDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  newPallets: Array<Maybe<ChileDepartureInspectionPalletInput>>;
};
