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
  /** Reads and enables pagination through a set of `ContactAlias`. */
  contactAliases?: Maybe<ContactAliasesConnection>;
  /** Reads and enables pagination through a set of `ContactAliasPersonContact`. */
  contactAliasPersonContacts?: Maybe<ContactAliasPersonContactsConnection>;
  /** Reads and enables pagination through a set of `Country`. */
  countries?: Maybe<CountriesConnection>;
  /** Reads and enables pagination through a set of `Customer`. */
  customers?: Maybe<CustomersConnection>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContacts?: Maybe<PersonContactsConnection>;
  /** Reads and enables pagination through a set of `Shipper`. */
  shippers?: Maybe<ShippersConnection>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>;
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
  /** Reads and enables pagination through a set of `PsaArrivalPicture`. */
  psaArrivalPictures?: Maybe<PsaArrivalPicturesConnection>;
  /** Reads and enables pagination through a set of `PsaArrivalReport`. */
  psaArrivalReports?: Maybe<PsaArrivalReportsConnection>;
  /** Reads and enables pagination through a set of `Master`. */
  masters?: Maybe<MastersConnection>;
  /** Reads and enables pagination through a set of `PackAtmosphere`. */
  packAtmospheres?: Maybe<PackAtmospheresConnection>;
  /** Reads and enables pagination through a set of `PackBoxStyle`. */
  packBoxStyles?: Maybe<PackBoxStylesConnection>;
  /** Reads and enables pagination through a set of `PackBoxType`. */
  packBoxTypes?: Maybe<PackBoxTypesConnection>;
  /** Reads and enables pagination through a set of `PackDestination`. */
  packDestinations?: Maybe<PackDestinationsConnection>;
  /** Reads and enables pagination through a set of `PackGrade`. */
  packGrades?: Maybe<PackGradesConnection>;
  /** Reads and enables pagination through a set of `PackHold`. */
  packHolds?: Maybe<PackHoldsConnection>;
  /** Reads and enables pagination through a set of `PackLabel`. */
  packLabels?: Maybe<PackLabelsConnection>;
  /** Reads and enables pagination through a set of `PackLiner`. */
  packLiners?: Maybe<PackLinersConnection>;
  /** Reads and enables pagination through a set of `PackOut`. */
  packOuts?: Maybe<PackOutsConnection>;
  /** Reads and enables pagination through a set of `PackPalletType`. */
  packPalletTypes?: Maybe<PackPalletTypesConnection>;
  /** Reads and enables pagination through a set of `PackProduction`. */
  packProductions?: Maybe<PackProductionsConnection>;
  /** Reads and enables pagination through a set of `PackSpecial`. */
  packSpecials?: Maybe<PackSpecialsConnection>;
  /** Reads and enables pagination through a set of `PackStyle`. */
  packStyles?: Maybe<PackStylesConnection>;
  /** Reads and enables pagination through a set of `PackTreeRipe`. */
  packTreeRipes?: Maybe<PackTreeRipesConnection>;
  /** Reads and enables pagination through a set of `Size`. */
  sizes?: Maybe<SizesConnection>;
  /** Reads and enables pagination through a set of `Species`. */
  specieses?: Maybe<SpeciesConnection>;
  /** Reads and enables pagination through a set of `Variety`. */
  varieties?: Maybe<VarietiesConnection>;
  contactAlias?: Maybe<ContactAlias>;
  contactAliasPersonContact?: Maybe<ContactAliasPersonContact>;
  country?: Maybe<Country>;
  customer?: Maybe<Customer>;
  personContact?: Maybe<PersonContact>;
  shipper?: Maybe<Shipper>;
  user?: Maybe<User>;
  userByPin?: Maybe<User>;
  warehouse?: Maybe<Warehouse>;
  agendaItem?: Maybe<AgendaItem>;
  priceCategory?: Maybe<PriceCategory>;
  priceEntry?: Maybe<PriceEntry>;
  priceProduct?: Maybe<PriceProduct>;
  priceSize?: Maybe<PriceSize>;
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  psaArrivalPicture?: Maybe<PsaArrivalPicture>;
  psaArrivalReport?: Maybe<PsaArrivalReport>;
  master?: Maybe<Master>;
  packAtmosphere?: Maybe<PackAtmosphere>;
  packBoxStyle?: Maybe<PackBoxStyle>;
  packBoxType?: Maybe<PackBoxType>;
  packDestination?: Maybe<PackDestination>;
  packGrade?: Maybe<PackGrade>;
  packHold?: Maybe<PackHold>;
  packLabel?: Maybe<PackLabel>;
  packLiner?: Maybe<PackLiner>;
  packOut?: Maybe<PackOut>;
  packPalletType?: Maybe<PackPalletType>;
  packProduction?: Maybe<PackProduction>;
  packSpecial?: Maybe<PackSpecial>;
  packStyle?: Maybe<PackStyle>;
  packTreeRipe?: Maybe<PackTreeRipe>;
  size?: Maybe<Size>;
  species?: Maybe<Species>;
  variety?: Maybe<Variety>;
  distinctValues?: Maybe<DistinctValuesConnection>;
  customerDistinctValues?: Maybe<CustomerDistinctValuesConnection>;
  /** Reads and enables pagination through a set of `ChileDepartureInspection`. */
  chileDepartureInspections?: Maybe<ChileDepartureInspectionsConnection>;
  /** Reads a single `ContactAlias` using its globally unique `ID`. */
  contactAliasByNodeId?: Maybe<ContactAlias>;
  /** Reads a single `ContactAliasPersonContact` using its globally unique `ID`. */
  contactAliasPersonContactByNodeId?: Maybe<ContactAliasPersonContact>;
  /** Reads a single `Country` using its globally unique `ID`. */
  countryByNodeId?: Maybe<Country>;
  /** Reads a single `Customer` using its globally unique `ID`. */
  customerByNodeId?: Maybe<Customer>;
  /** Reads a single `PersonContact` using its globally unique `ID`. */
  personContactByNodeId?: Maybe<PersonContact>;
  /** Reads a single `Shipper` using its globally unique `ID`. */
  shipperByNodeId?: Maybe<Shipper>;
  /** Reads a single `User` using its globally unique `ID`. */
  userByNodeId?: Maybe<User>;
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
  /** Reads a single `PsaArrivalPicture` using its globally unique `ID`. */
  psaArrivalPictureByNodeId?: Maybe<PsaArrivalPicture>;
  /** Reads a single `PsaArrivalReport` using its globally unique `ID`. */
  psaArrivalReportByNodeId?: Maybe<PsaArrivalReport>;
  /** Reads a single `Master` using its globally unique `ID`. */
  masterByNodeId?: Maybe<Master>;
  /** Reads a single `PackAtmosphere` using its globally unique `ID`. */
  packAtmosphereByNodeId?: Maybe<PackAtmosphere>;
  /** Reads a single `PackBoxStyle` using its globally unique `ID`. */
  packBoxStyleByNodeId?: Maybe<PackBoxStyle>;
  /** Reads a single `PackBoxType` using its globally unique `ID`. */
  packBoxTypeByNodeId?: Maybe<PackBoxType>;
  /** Reads a single `PackDestination` using its globally unique `ID`. */
  packDestinationByNodeId?: Maybe<PackDestination>;
  /** Reads a single `PackGrade` using its globally unique `ID`. */
  packGradeByNodeId?: Maybe<PackGrade>;
  /** Reads a single `PackHold` using its globally unique `ID`. */
  packHoldByNodeId?: Maybe<PackHold>;
  /** Reads a single `PackLabel` using its globally unique `ID`. */
  packLabelByNodeId?: Maybe<PackLabel>;
  /** Reads a single `PackLiner` using its globally unique `ID`. */
  packLinerByNodeId?: Maybe<PackLiner>;
  /** Reads a single `PackOut` using its globally unique `ID`. */
  packOutByNodeId?: Maybe<PackOut>;
  /** Reads a single `PackPalletType` using its globally unique `ID`. */
  packPalletTypeByNodeId?: Maybe<PackPalletType>;
  /** Reads a single `PackProduction` using its globally unique `ID`. */
  packProductionByNodeId?: Maybe<PackProduction>;
  /** Reads a single `PackSpecial` using its globally unique `ID`. */
  packSpecialByNodeId?: Maybe<PackSpecial>;
  /** Reads a single `PackStyle` using its globally unique `ID`. */
  packStyleByNodeId?: Maybe<PackStyle>;
  /** Reads a single `PackTreeRipe` using its globally unique `ID`. */
  packTreeRipeByNodeId?: Maybe<PackTreeRipe>;
  /** Reads a single `Size` using its globally unique `ID`. */
  sizeByNodeId?: Maybe<Size>;
  /** Reads a single `Species` using its globally unique `ID`. */
  speciesByNodeId?: Maybe<Species>;
  /** Reads a single `Variety` using its globally unique `ID`. */
  varietyByNodeId?: Maybe<Variety>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryContactAliasesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
  condition?: Maybe<ContactAliasCondition>;
  filter?: Maybe<ContactAliasFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryContactAliasPersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
  condition?: Maybe<ContactAliasPersonContactCondition>;
  filter?: Maybe<ContactAliasPersonContactFilter>;
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
export type QueryUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UsersOrderBy>>;
  condition?: Maybe<UserCondition>;
  filter?: Maybe<UserFilter>;
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
export type QueryPsaArrivalPicturesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PsaArrivalPicturesOrderBy>>;
  condition?: Maybe<PsaArrivalPictureCondition>;
  filter?: Maybe<PsaArrivalPictureFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPsaArrivalReportsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PsaArrivalReportsOrderBy>>;
  condition?: Maybe<PsaArrivalReportCondition>;
  filter?: Maybe<PsaArrivalReportFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryMastersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<MastersOrderBy>>;
  condition?: Maybe<MasterCondition>;
  filter?: Maybe<MasterFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackAtmospheresArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackAtmospheresOrderBy>>;
  condition?: Maybe<PackAtmosphereCondition>;
  filter?: Maybe<PackAtmosphereFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxStylesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackBoxStylesOrderBy>>;
  condition?: Maybe<PackBoxStyleCondition>;
  filter?: Maybe<PackBoxStyleFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxTypesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackBoxTypesOrderBy>>;
  condition?: Maybe<PackBoxTypeCondition>;
  filter?: Maybe<PackBoxTypeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackDestinationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackDestinationsOrderBy>>;
  condition?: Maybe<PackDestinationCondition>;
  filter?: Maybe<PackDestinationFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackGradesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackGradesOrderBy>>;
  condition?: Maybe<PackGradeCondition>;
  filter?: Maybe<PackGradeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackHoldsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackHoldsOrderBy>>;
  condition?: Maybe<PackHoldCondition>;
  filter?: Maybe<PackHoldFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLabelsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackLabelsOrderBy>>;
  condition?: Maybe<PackLabelCondition>;
  filter?: Maybe<PackLabelFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLinersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackLinersOrderBy>>;
  condition?: Maybe<PackLinerCondition>;
  filter?: Maybe<PackLinerFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackOutsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackOutsOrderBy>>;
  condition?: Maybe<PackOutCondition>;
  filter?: Maybe<PackOutFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackPalletTypesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackPalletTypesOrderBy>>;
  condition?: Maybe<PackPalletTypeCondition>;
  filter?: Maybe<PackPalletTypeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackProductionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackProductionsOrderBy>>;
  condition?: Maybe<PackProductionCondition>;
  filter?: Maybe<PackProductionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackSpecialsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackSpecialsOrderBy>>;
  condition?: Maybe<PackSpecialCondition>;
  filter?: Maybe<PackSpecialFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackStylesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackStylesOrderBy>>;
  condition?: Maybe<PackStyleCondition>;
  filter?: Maybe<PackStyleFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPackTreeRipesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PackTreeRipesOrderBy>>;
  condition?: Maybe<PackTreeRipeCondition>;
  filter?: Maybe<PackTreeRipeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySizesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<SizesOrderBy>>;
  condition?: Maybe<SizeCondition>;
  filter?: Maybe<SizeFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySpeciesesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<SpeciesOrderBy>>;
  condition?: Maybe<SpeciesCondition>;
  filter?: Maybe<SpeciesFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryVarietiesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<VarietiesOrderBy>>;
  condition?: Maybe<VarietyCondition>;
  filter?: Maybe<VarietyFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryContactAliasArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryContactAliasPersonContactArgs = {
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
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
export type QueryUserArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByPinArgs = {
  pin: Scalars['String'];
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
export type QueryPsaArrivalPictureArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPsaArrivalReportArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMasterArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackAtmosphereArgs = {
  shipperId: Scalars['String'];
  maCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxStyleArgs = {
  shipperId: Scalars['String'];
  boxStyle: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxTypeArgs = {
  shipperId: Scalars['String'];
  boxType: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackDestinationArgs = {
  shipperId: Scalars['String'];
  destinationCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackGradeArgs = {
  shipperId: Scalars['String'];
  gradeCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackHoldArgs = {
  shipperId: Scalars['String'];
  holdCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLabelArgs = {
  shipperId: Scalars['String'];
  labelCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLinerArgs = {
  shipperId: Scalars['String'];
  linerCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackOutArgs = {
  shipperId: Scalars['String'];
  outCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackPalletTypeArgs = {
  shipperId: Scalars['String'];
  palletType: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackProductionArgs = {
  shipperId: Scalars['String'];
  productionCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackSpecialArgs = {
  shipperId: Scalars['String'];
  customerCode: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackStyleArgs = {
  shipperId: Scalars['String'];
  packStyle: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackTreeRipeArgs = {
  shipperId: Scalars['String'];
  treeRipe: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySizeArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySpeciesArgs = {
  id: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVarietyArgs = {
  id: Scalars['String'];
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
export type QueryContactAliasByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryContactAliasPersonContactByNodeIdArgs = {
  nodeId: Scalars['ID'];
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
export type QueryUserByNodeIdArgs = {
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


/** The root query type which gives access points into the data universe. */
export type QueryPsaArrivalPictureByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPsaArrivalReportByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMasterByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackAtmosphereByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxStyleByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackBoxTypeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackDestinationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackGradeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackHoldByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLabelByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackLinerByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackOutByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackPalletTypeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackProductionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackSpecialByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackStyleByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPackTreeRipeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySizeByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySpeciesByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryVarietyByNodeIdArgs = {
  nodeId: Scalars['ID'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** A connection to a list of `ContactAlias` values. */
export type ContactAliasesConnection = {
  __typename?: 'ContactAliasesConnection';
  /** A list of `ContactAlias` objects. */
  nodes: Array<Maybe<ContactAlias>>;
  /** A list of edges which contains the `ContactAlias` and cursor to aid in pagination. */
  edges: Array<ContactAliasesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ContactAlias` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ContactAlias = Node & {
  __typename?: 'ContactAlias';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  aliasDescription: Scalars['String'];
  aliasName: Scalars['String'];
  userId?: Maybe<Scalars['BigInt']>;
  /** Reads a single `User` that is related to this `ContactAlias`. */
  user?: Maybe<User>;
  /** Reads and enables pagination through a set of `ContactAliasPersonContact`. */
  contactAliasPersonContactsByAliasId: ContactAliasPersonContactsConnection;
  searchText?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `PersonContact`. */
  personContactsByContactAliasPersonContactAliasIdAndPersonContactId: ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyConnection;
};


export type ContactAliasContactAliasPersonContactsByAliasIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
  condition?: Maybe<ContactAliasPersonContactCondition>;
  filter?: Maybe<ContactAliasPersonContactFilter>;
};


export type ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PersonContactsOrderBy>>;
  condition?: Maybe<PersonContactCondition>;
  filter?: Maybe<PersonContactFilter>;
};


export type User = Node & {
  __typename?: 'User';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  pin?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `ContactAlias`. */
  contactAliases: ContactAliasesConnection;
};


export type UserContactAliasesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
  condition?: Maybe<ContactAliasCondition>;
  filter?: Maybe<ContactAliasFilter>;
};


/** Methods to use when ordering `ContactAlias`. */
export enum ContactAliasesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AliasDescriptionAsc = 'ALIAS_DESCRIPTION_ASC',
  AliasDescriptionDesc = 'ALIAS_DESCRIPTION_DESC',
  AliasNameAsc = 'ALIAS_NAME_ASC',
  AliasNameDesc = 'ALIAS_NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `ContactAlias` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ContactAliasCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `aliasDescription` field. */
  aliasDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `aliasName` field. */
  aliasName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['BigInt']>;
};

/** A filter to be used against `ContactAlias` object types. All fields are combined with a logical ‘and.’ */
export type ContactAliasFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `aliasDescription` field. */
  aliasDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `aliasName` field. */
  aliasName?: Maybe<StringFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Filter by the object’s `contactAliasPersonContactsByAliasId` relation. */
  contactAliasPersonContactsByAliasId?: Maybe<ContactAliasToManyContactAliasPersonContactFilter>;
  /** Some related `contactAliasPersonContactsByAliasId` exist. */
  contactAliasPersonContactsByAliasIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ContactAliasFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ContactAliasFilter>>;
  /** Negates the expression. */
  not?: Maybe<ContactAliasFilter>;
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

/** A filter to be used against many `ContactAliasPersonContact` object types. All fields are combined with a logical ‘and.’ */
export type ContactAliasToManyContactAliasPersonContactFilter = {
  /** Every related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ContactAliasPersonContactFilter>;
  /** Some related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ContactAliasPersonContactFilter>;
  /** No related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ContactAliasPersonContactFilter>;
};

/** A filter to be used against `ContactAliasPersonContact` object types. All fields are combined with a logical ‘and.’ */
export type ContactAliasPersonContactFilter = {
  /** Filter by the object’s `aliasId` field. */
  aliasId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `personContactId` field. */
  personContactId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `alias` relation. */
  alias?: Maybe<ContactAliasFilter>;
  /** Filter by the object’s `personContact` relation. */
  personContact?: Maybe<PersonContactFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ContactAliasPersonContactFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ContactAliasPersonContactFilter>>;
  /** Negates the expression. */
  not?: Maybe<ContactAliasPersonContactFilter>;
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
  /** Filter by the object’s `contactAliasPersonContacts` relation. */
  contactAliasPersonContacts?: Maybe<PersonContactToManyContactAliasPersonContactFilter>;
  /** Some related `contactAliasPersonContacts` exist. */
  contactAliasPersonContactsExist?: Maybe<Scalars['Boolean']>;
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

/** A filter to be used against many `ContactAliasPersonContact` object types. All fields are combined with a logical ‘and.’ */
export type PersonContactToManyContactAliasPersonContactFilter = {
  /** Every related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ContactAliasPersonContactFilter>;
  /** Some related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ContactAliasPersonContactFilter>;
  /** No related `ContactAliasPersonContact` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ContactAliasPersonContactFilter>;
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

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `pin` field. */
  pin?: Maybe<StringFilter>;
  /** Filter by the object’s `displayName` field. */
  displayName?: Maybe<StringFilter>;
  /** Filter by the object’s `contactAliases` relation. */
  contactAliases?: Maybe<UserToManyContactAliasFilter>;
  /** Some related `contactAliases` exist. */
  contactAliasesExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<UserFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<UserFilter>>;
  /** Negates the expression. */
  not?: Maybe<UserFilter>;
};

/** A filter to be used against many `ContactAlias` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyContactAliasFilter = {
  /** Every related `ContactAlias` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ContactAliasFilter>;
  /** Some related `ContactAlias` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ContactAliasFilter>;
  /** No related `ContactAlias` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ContactAliasFilter>;
};

/** A connection to a list of `ContactAliasPersonContact` values. */
export type ContactAliasPersonContactsConnection = {
  __typename?: 'ContactAliasPersonContactsConnection';
  /** A list of `ContactAliasPersonContact` objects. */
  nodes: Array<Maybe<ContactAliasPersonContact>>;
  /** A list of edges which contains the `ContactAliasPersonContact` and cursor to aid in pagination. */
  edges: Array<ContactAliasPersonContactsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ContactAliasPersonContact` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ContactAliasPersonContact = Node & {
  __typename?: 'ContactAliasPersonContact';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
  /** Reads a single `ContactAlias` that is related to this `ContactAliasPersonContact`. */
  alias?: Maybe<ContactAlias>;
  /** Reads a single `PersonContact` that is related to this `ContactAliasPersonContact`. */
  personContact?: Maybe<PersonContact>;
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
  /** Reads and enables pagination through a set of `ContactAliasPersonContact`. */
  contactAliasPersonContacts: ContactAliasPersonContactsConnection;
  searchText?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `ContactAlias`. */
  contactAliasesByContactAliasPersonContactPersonContactIdAndAliasId: PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyConnection;
};


export type PersonContactContactAliasPersonContactsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
  condition?: Maybe<ContactAliasPersonContactCondition>;
  filter?: Maybe<ContactAliasPersonContactFilter>;
};


export type PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
  condition?: Maybe<ContactAliasCondition>;
  filter?: Maybe<ContactAliasFilter>;
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

/** A `PersonContact` edge in the connection. */
export type PersonContactsEdge = {
  __typename?: 'PersonContactsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PersonContact` at the end of the edge. */
  node?: Maybe<PersonContact>;
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

/** Methods to use when ordering `ContactAliasPersonContact`. */
export enum ContactAliasPersonContactsOrderBy {
  Natural = 'NATURAL',
  AliasIdAsc = 'ALIAS_ID_ASC',
  AliasIdDesc = 'ALIAS_ID_DESC',
  PersonContactIdAsc = 'PERSON_CONTACT_ID_ASC',
  PersonContactIdDesc = 'PERSON_CONTACT_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `ContactAliasPersonContact` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type ContactAliasPersonContactCondition = {
  /** Checks for equality with the object’s `aliasId` field. */
  aliasId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `personContactId` field. */
  personContactId?: Maybe<Scalars['BigInt']>;
};

/** A connection to a list of `ContactAlias` values, with data from `ContactAliasPersonContact`. */
export type PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyConnection = {
  __typename?: 'PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyConnection';
  /** A list of `ContactAlias` objects. */
  nodes: Array<Maybe<ContactAlias>>;
  /** A list of edges which contains the `ContactAlias`, info from the `ContactAliasPersonContact`, and the cursor to aid in pagination. */
  edges: Array<PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ContactAlias` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ContactAlias` edge in the connection, with data from `ContactAliasPersonContact`. */
export type PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyEdge = {
  __typename?: 'PersonContactContactAliasesByContactAliasPersonContactPersonContactIdAndAliasIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ContactAlias` at the end of the edge. */
  node?: Maybe<ContactAlias>;
};

/** A `ContactAliasPersonContact` edge in the connection. */
export type ContactAliasPersonContactsEdge = {
  __typename?: 'ContactAliasPersonContactsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ContactAliasPersonContact` at the end of the edge. */
  node?: Maybe<ContactAliasPersonContact>;
};

/** A connection to a list of `PersonContact` values, with data from `ContactAliasPersonContact`. */
export type ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyConnection = {
  __typename?: 'ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyConnection';
  /** A list of `PersonContact` objects. */
  nodes: Array<Maybe<PersonContact>>;
  /** A list of edges which contains the `PersonContact`, info from the `ContactAliasPersonContact`, and the cursor to aid in pagination. */
  edges: Array<ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PersonContact` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PersonContact` edge in the connection, with data from `ContactAliasPersonContact`. */
export type ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyEdge = {
  __typename?: 'ContactAliasPersonContactsByContactAliasPersonContactAliasIdAndPersonContactIdManyToManyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PersonContact` at the end of the edge. */
  node?: Maybe<PersonContact>;
};

/** A `ContactAlias` edge in the connection. */
export type ContactAliasesEdge = {
  __typename?: 'ContactAliasesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ContactAlias` at the end of the edge. */
  node?: Maybe<ContactAlias>;
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

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node?: Maybe<User>;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PinAsc = 'PIN_ASC',
  PinDesc = 'PIN_DESC',
  DisplayNameAsc = 'DISPLAY_NAME_ASC',
  DisplayNameDesc = 'DISPLAY_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `pin` field. */
  pin?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `displayName` field. */
  displayName?: Maybe<Scalars['String']>;
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

/** A connection to a list of `PsaArrivalPicture` values. */
export type PsaArrivalPicturesConnection = {
  __typename?: 'PsaArrivalPicturesConnection';
  /** A list of `PsaArrivalPicture` objects. */
  nodes: Array<Maybe<PsaArrivalPicture>>;
  /** A list of edges which contains the `PsaArrivalPicture` and cursor to aid in pagination. */
  edges: Array<PsaArrivalPicturesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PsaArrivalPicture` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PsaArrivalPicture = Node & {
  __typename?: 'PsaArrivalPicture';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  pictureDate?: Maybe<Scalars['Date']>;
  arrivalCode?: Maybe<Scalars['String']>;
  pictureDescription?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  palletId?: Maybe<Scalars['String']>;
  productCode?: Maybe<Scalars['String']>;
  varietyName?: Maybe<Scalars['String']>;
  imageUrl: Scalars['String'];
};

/** A `PsaArrivalPicture` edge in the connection. */
export type PsaArrivalPicturesEdge = {
  __typename?: 'PsaArrivalPicturesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PsaArrivalPicture` at the end of the edge. */
  node?: Maybe<PsaArrivalPicture>;
};

/** Methods to use when ordering `PsaArrivalPicture`. */
export enum PsaArrivalPicturesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PictureDateAsc = 'PICTURE_DATE_ASC',
  PictureDateDesc = 'PICTURE_DATE_DESC',
  ArrivalCodeAsc = 'ARRIVAL_CODE_ASC',
  ArrivalCodeDesc = 'ARRIVAL_CODE_DESC',
  PictureDescriptionAsc = 'PICTURE_DESCRIPTION_ASC',
  PictureDescriptionDesc = 'PICTURE_DESCRIPTION_DESC',
  ExporterIdAsc = 'EXPORTER_ID_ASC',
  ExporterIdDesc = 'EXPORTER_ID_DESC',
  PalletIdAsc = 'PALLET_ID_ASC',
  PalletIdDesc = 'PALLET_ID_DESC',
  ProductCodeAsc = 'PRODUCT_CODE_ASC',
  ProductCodeDesc = 'PRODUCT_CODE_DESC',
  VarietyNameAsc = 'VARIETY_NAME_ASC',
  VarietyNameDesc = 'VARIETY_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PsaArrivalPicture` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PsaArrivalPictureCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `pictureDate` field. */
  pictureDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `arrivalCode` field. */
  arrivalCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `pictureDescription` field. */
  pictureDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `exporterId` field. */
  exporterId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `palletId` field. */
  palletId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `productCode` field. */
  productCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `varietyName` field. */
  varietyName?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PsaArrivalPicture` object types. All fields are combined with a logical ‘and.’ */
export type PsaArrivalPictureFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `pictureDate` field. */
  pictureDate?: Maybe<DateFilter>;
  /** Filter by the object’s `arrivalCode` field. */
  arrivalCode?: Maybe<StringFilter>;
  /** Filter by the object’s `pictureDescription` field. */
  pictureDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `exporterId` field. */
  exporterId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `palletId` field. */
  palletId?: Maybe<StringFilter>;
  /** Filter by the object’s `productCode` field. */
  productCode?: Maybe<StringFilter>;
  /** Filter by the object’s `varietyName` field. */
  varietyName?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PsaArrivalPictureFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PsaArrivalPictureFilter>>;
  /** Negates the expression. */
  not?: Maybe<PsaArrivalPictureFilter>;
};

/** A connection to a list of `PsaArrivalReport` values. */
export type PsaArrivalReportsConnection = {
  __typename?: 'PsaArrivalReportsConnection';
  /** A list of `PsaArrivalReport` objects. */
  nodes: Array<Maybe<PsaArrivalReport>>;
  /** A list of edges which contains the `PsaArrivalReport` and cursor to aid in pagination. */
  edges: Array<PsaArrivalReportsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PsaArrivalReport` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PsaArrivalReport = Node & {
  __typename?: 'PsaArrivalReport';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  reportDate?: Maybe<Scalars['Date']>;
  locationName?: Maybe<Scalars['String']>;
  arrivalCode?: Maybe<Scalars['String']>;
  arrivalName?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  exporterName?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `PsaArrivalPicture`. */
  pictures: PsaArrivalPicturesConnection;
  searchText?: Maybe<Scalars['String']>;
  reportUrl: Scalars['String'];
};


export type PsaArrivalReportPicturesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  filter?: Maybe<PsaArrivalPictureFilter>;
};

/** A `PsaArrivalReport` edge in the connection. */
export type PsaArrivalReportsEdge = {
  __typename?: 'PsaArrivalReportsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PsaArrivalReport` at the end of the edge. */
  node?: Maybe<PsaArrivalReport>;
};

/** Methods to use when ordering `PsaArrivalReport`. */
export enum PsaArrivalReportsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReportDateAsc = 'REPORT_DATE_ASC',
  ReportDateDesc = 'REPORT_DATE_DESC',
  LocationNameAsc = 'LOCATION_NAME_ASC',
  LocationNameDesc = 'LOCATION_NAME_DESC',
  ArrivalCodeAsc = 'ARRIVAL_CODE_ASC',
  ArrivalCodeDesc = 'ARRIVAL_CODE_DESC',
  ArrivalNameAsc = 'ARRIVAL_NAME_ASC',
  ArrivalNameDesc = 'ARRIVAL_NAME_DESC',
  ExporterIdAsc = 'EXPORTER_ID_ASC',
  ExporterIdDesc = 'EXPORTER_ID_DESC',
  ExporterNameAsc = 'EXPORTER_NAME_ASC',
  ExporterNameDesc = 'EXPORTER_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PsaArrivalReport` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PsaArrivalReportCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reportDate` field. */
  reportDate?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `locationName` field. */
  locationName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `arrivalCode` field. */
  arrivalCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `arrivalName` field. */
  arrivalName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `exporterId` field. */
  exporterId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `exporterName` field. */
  exporterName?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PsaArrivalReport` object types. All fields are combined with a logical ‘and.’ */
export type PsaArrivalReportFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `reportDate` field. */
  reportDate?: Maybe<DateFilter>;
  /** Filter by the object’s `locationName` field. */
  locationName?: Maybe<StringFilter>;
  /** Filter by the object’s `arrivalCode` field. */
  arrivalCode?: Maybe<StringFilter>;
  /** Filter by the object’s `arrivalName` field. */
  arrivalName?: Maybe<StringFilter>;
  /** Filter by the object’s `exporterId` field. */
  exporterId?: Maybe<BigIntFilter>;
  /** Filter by the object’s `exporterName` field. */
  exporterName?: Maybe<StringFilter>;
  /** Filter by the object’s `searchText` field. */
  searchText?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PsaArrivalReportFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PsaArrivalReportFilter>>;
  /** Negates the expression. */
  not?: Maybe<PsaArrivalReportFilter>;
};

/** A connection to a list of `Master` values. */
export type MastersConnection = {
  __typename?: 'MastersConnection';
  /** A list of `Master` objects. */
  nodes: Array<Maybe<Master>>;
  /** A list of edges which contains the `Master` and cursor to aid in pagination. */
  edges: Array<MastersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Master` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Master = Node & {
  __typename?: 'Master';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  defaultPalletQuantity?: Maybe<Scalars['String']>;
  lotNumber?: Maybe<Scalars['String']>;
};

/** A `Master` edge in the connection. */
export type MastersEdge = {
  __typename?: 'MastersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Master` at the end of the edge. */
  node?: Maybe<Master>;
};

/** Methods to use when ordering `Master`. */
export enum MastersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  DefaultPalletQuantityAsc = 'DEFAULT_PALLET_QUANTITY_ASC',
  DefaultPalletQuantityDesc = 'DEFAULT_PALLET_QUANTITY_DESC',
  LotNumberAsc = 'LOT_NUMBER_ASC',
  LotNumberDesc = 'LOT_NUMBER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Master` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type MasterCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `defaultPalletQuantity` field. */
  defaultPalletQuantity?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lotNumber` field. */
  lotNumber?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Master` object types. All fields are combined with a logical ‘and.’ */
export type MasterFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `defaultPalletQuantity` field. */
  defaultPalletQuantity?: Maybe<StringFilter>;
  /** Filter by the object’s `lotNumber` field. */
  lotNumber?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<MasterFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<MasterFilter>>;
  /** Negates the expression. */
  not?: Maybe<MasterFilter>;
};

/** A connection to a list of `PackAtmosphere` values. */
export type PackAtmospheresConnection = {
  __typename?: 'PackAtmospheresConnection';
  /** A list of `PackAtmosphere` objects. */
  nodes: Array<Maybe<PackAtmosphere>>;
  /** A list of edges which contains the `PackAtmosphere` and cursor to aid in pagination. */
  edges: Array<PackAtmospheresEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackAtmosphere` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackAtmosphere = Node & {
  __typename?: 'PackAtmosphere';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  maCode: Scalars['String'];
  maDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackAtmosphere` edge in the connection. */
export type PackAtmospheresEdge = {
  __typename?: 'PackAtmospheresEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackAtmosphere` at the end of the edge. */
  node?: Maybe<PackAtmosphere>;
};

/** Methods to use when ordering `PackAtmosphere`. */
export enum PackAtmospheresOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  MaCodeAsc = 'MA_CODE_ASC',
  MaCodeDesc = 'MA_CODE_DESC',
  MaDescriptionAsc = 'MA_DESCRIPTION_ASC',
  MaDescriptionDesc = 'MA_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackAtmosphere` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackAtmosphereCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `maCode` field. */
  maCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `maDescription` field. */
  maDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackAtmosphere` object types. All fields are combined with a logical ‘and.’ */
export type PackAtmosphereFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `maCode` field. */
  maCode?: Maybe<StringFilter>;
  /** Filter by the object’s `maDescription` field. */
  maDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackAtmosphereFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackAtmosphereFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackAtmosphereFilter>;
};

/** A connection to a list of `PackBoxStyle` values. */
export type PackBoxStylesConnection = {
  __typename?: 'PackBoxStylesConnection';
  /** A list of `PackBoxStyle` objects. */
  nodes: Array<Maybe<PackBoxStyle>>;
  /** A list of edges which contains the `PackBoxStyle` and cursor to aid in pagination. */
  edges: Array<PackBoxStylesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackBoxStyle` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackBoxStyle = Node & {
  __typename?: 'PackBoxStyle';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  boxStyle: Scalars['String'];
  boxDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  combineDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackBoxStyle` edge in the connection. */
export type PackBoxStylesEdge = {
  __typename?: 'PackBoxStylesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackBoxStyle` at the end of the edge. */
  node?: Maybe<PackBoxStyle>;
};

/** Methods to use when ordering `PackBoxStyle`. */
export enum PackBoxStylesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  BoxStyleAsc = 'BOX_STYLE_ASC',
  BoxStyleDesc = 'BOX_STYLE_DESC',
  BoxDescriptionAsc = 'BOX_DESCRIPTION_ASC',
  BoxDescriptionDesc = 'BOX_DESCRIPTION_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  CombineDescriptionAsc = 'COMBINE_DESCRIPTION_ASC',
  CombineDescriptionDesc = 'COMBINE_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackBoxStyle` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackBoxStyleCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `boxStyle` field. */
  boxStyle?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `boxDescription` field. */
  boxDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineDescription` field. */
  combineDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackBoxStyle` object types. All fields are combined with a logical ‘and.’ */
export type PackBoxStyleFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `boxStyle` field. */
  boxStyle?: Maybe<StringFilter>;
  /** Filter by the object’s `boxDescription` field. */
  boxDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Filter by the object’s `combineDescription` field. */
  combineDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackBoxStyleFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackBoxStyleFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackBoxStyleFilter>;
};

/** A connection to a list of `PackBoxType` values. */
export type PackBoxTypesConnection = {
  __typename?: 'PackBoxTypesConnection';
  /** A list of `PackBoxType` objects. */
  nodes: Array<Maybe<PackBoxType>>;
  /** A list of edges which contains the `PackBoxType` and cursor to aid in pagination. */
  edges: Array<PackBoxTypesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackBoxType` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackBoxType = Node & {
  __typename?: 'PackBoxType';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  boxType: Scalars['String'];
  boxDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackBoxType` edge in the connection. */
export type PackBoxTypesEdge = {
  __typename?: 'PackBoxTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackBoxType` at the end of the edge. */
  node?: Maybe<PackBoxType>;
};

/** Methods to use when ordering `PackBoxType`. */
export enum PackBoxTypesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  BoxTypeAsc = 'BOX_TYPE_ASC',
  BoxTypeDesc = 'BOX_TYPE_DESC',
  BoxDescriptionAsc = 'BOX_DESCRIPTION_ASC',
  BoxDescriptionDesc = 'BOX_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackBoxType` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackBoxTypeCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `boxType` field. */
  boxType?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `boxDescription` field. */
  boxDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackBoxType` object types. All fields are combined with a logical ‘and.’ */
export type PackBoxTypeFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `boxType` field. */
  boxType?: Maybe<StringFilter>;
  /** Filter by the object’s `boxDescription` field. */
  boxDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackBoxTypeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackBoxTypeFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackBoxTypeFilter>;
};

/** A connection to a list of `PackDestination` values. */
export type PackDestinationsConnection = {
  __typename?: 'PackDestinationsConnection';
  /** A list of `PackDestination` objects. */
  nodes: Array<Maybe<PackDestination>>;
  /** A list of edges which contains the `PackDestination` and cursor to aid in pagination. */
  edges: Array<PackDestinationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackDestination` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackDestination = Node & {
  __typename?: 'PackDestination';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  destinationCode: Scalars['String'];
  destinationDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackDestination` edge in the connection. */
export type PackDestinationsEdge = {
  __typename?: 'PackDestinationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackDestination` at the end of the edge. */
  node?: Maybe<PackDestination>;
};

/** Methods to use when ordering `PackDestination`. */
export enum PackDestinationsOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  DestinationCodeAsc = 'DESTINATION_CODE_ASC',
  DestinationCodeDesc = 'DESTINATION_CODE_DESC',
  DestinationDescriptionAsc = 'DESTINATION_DESCRIPTION_ASC',
  DestinationDescriptionDesc = 'DESTINATION_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackDestination` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackDestinationCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `destinationCode` field. */
  destinationCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `destinationDescription` field. */
  destinationDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackDestination` object types. All fields are combined with a logical ‘and.’ */
export type PackDestinationFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `destinationCode` field. */
  destinationCode?: Maybe<StringFilter>;
  /** Filter by the object’s `destinationDescription` field. */
  destinationDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackDestinationFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackDestinationFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackDestinationFilter>;
};

/** A connection to a list of `PackGrade` values. */
export type PackGradesConnection = {
  __typename?: 'PackGradesConnection';
  /** A list of `PackGrade` objects. */
  nodes: Array<Maybe<PackGrade>>;
  /** A list of edges which contains the `PackGrade` and cursor to aid in pagination. */
  edges: Array<PackGradesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackGrade` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackGrade = Node & {
  __typename?: 'PackGrade';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  gradeCode: Scalars['String'];
  gradeDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackGrade` edge in the connection. */
export type PackGradesEdge = {
  __typename?: 'PackGradesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackGrade` at the end of the edge. */
  node?: Maybe<PackGrade>;
};

/** Methods to use when ordering `PackGrade`. */
export enum PackGradesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  GradeCodeAsc = 'GRADE_CODE_ASC',
  GradeCodeDesc = 'GRADE_CODE_DESC',
  GradeDescriptionAsc = 'GRADE_DESCRIPTION_ASC',
  GradeDescriptionDesc = 'GRADE_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackGrade` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackGradeCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `gradeCode` field. */
  gradeCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `gradeDescription` field. */
  gradeDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackGrade` object types. All fields are combined with a logical ‘and.’ */
export type PackGradeFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `gradeCode` field. */
  gradeCode?: Maybe<StringFilter>;
  /** Filter by the object’s `gradeDescription` field. */
  gradeDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackGradeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackGradeFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackGradeFilter>;
};

/** A connection to a list of `PackHold` values. */
export type PackHoldsConnection = {
  __typename?: 'PackHoldsConnection';
  /** A list of `PackHold` objects. */
  nodes: Array<Maybe<PackHold>>;
  /** A list of edges which contains the `PackHold` and cursor to aid in pagination. */
  edges: Array<PackHoldsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackHold` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackHold = Node & {
  __typename?: 'PackHold';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  holdCode: Scalars['String'];
  holdDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackHold` edge in the connection. */
export type PackHoldsEdge = {
  __typename?: 'PackHoldsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackHold` at the end of the edge. */
  node?: Maybe<PackHold>;
};

/** Methods to use when ordering `PackHold`. */
export enum PackHoldsOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  HoldCodeAsc = 'HOLD_CODE_ASC',
  HoldCodeDesc = 'HOLD_CODE_DESC',
  HoldDescriptionAsc = 'HOLD_DESCRIPTION_ASC',
  HoldDescriptionDesc = 'HOLD_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackHold` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackHoldCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `holdCode` field. */
  holdCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `holdDescription` field. */
  holdDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackHold` object types. All fields are combined with a logical ‘and.’ */
export type PackHoldFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `holdCode` field. */
  holdCode?: Maybe<StringFilter>;
  /** Filter by the object’s `holdDescription` field. */
  holdDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackHoldFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackHoldFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackHoldFilter>;
};

/** A connection to a list of `PackLabel` values. */
export type PackLabelsConnection = {
  __typename?: 'PackLabelsConnection';
  /** A list of `PackLabel` objects. */
  nodes: Array<Maybe<PackLabel>>;
  /** A list of edges which contains the `PackLabel` and cursor to aid in pagination. */
  edges: Array<PackLabelsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackLabel` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackLabel = Node & {
  __typename?: 'PackLabel';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  labelCode: Scalars['String'];
  labelName?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  shipperName?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackLabel` edge in the connection. */
export type PackLabelsEdge = {
  __typename?: 'PackLabelsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackLabel` at the end of the edge. */
  node?: Maybe<PackLabel>;
};

/** Methods to use when ordering `PackLabel`. */
export enum PackLabelsOrderBy {
  Natural = 'NATURAL',
  LabelCodeAsc = 'LABEL_CODE_ASC',
  LabelCodeDesc = 'LABEL_CODE_DESC',
  LabelNameAsc = 'LABEL_NAME_ASC',
  LabelNameDesc = 'LABEL_NAME_DESC',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  ShipperNameAsc = 'SHIPPER_NAME_ASC',
  ShipperNameDesc = 'SHIPPER_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackLabel` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackLabelCondition = {
  /** Checks for equality with the object’s `labelCode` field. */
  labelCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `labelName` field. */
  labelName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperName` field. */
  shipperName?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackLabel` object types. All fields are combined with a logical ‘and.’ */
export type PackLabelFilter = {
  /** Filter by the object’s `labelCode` field. */
  labelCode?: Maybe<StringFilter>;
  /** Filter by the object’s `labelName` field. */
  labelName?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperName` field. */
  shipperName?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackLabelFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackLabelFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackLabelFilter>;
};

/** A connection to a list of `PackLiner` values. */
export type PackLinersConnection = {
  __typename?: 'PackLinersConnection';
  /** A list of `PackLiner` objects. */
  nodes: Array<Maybe<PackLiner>>;
  /** A list of edges which contains the `PackLiner` and cursor to aid in pagination. */
  edges: Array<PackLinersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackLiner` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackLiner = Node & {
  __typename?: 'PackLiner';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  linerCode: Scalars['String'];
  linerDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackLiner` edge in the connection. */
export type PackLinersEdge = {
  __typename?: 'PackLinersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackLiner` at the end of the edge. */
  node?: Maybe<PackLiner>;
};

/** Methods to use when ordering `PackLiner`. */
export enum PackLinersOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  LinerCodeAsc = 'LINER_CODE_ASC',
  LinerCodeDesc = 'LINER_CODE_DESC',
  LinerDescriptionAsc = 'LINER_DESCRIPTION_ASC',
  LinerDescriptionDesc = 'LINER_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackLiner` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackLinerCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `linerCode` field. */
  linerCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `linerDescription` field. */
  linerDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackLiner` object types. All fields are combined with a logical ‘and.’ */
export type PackLinerFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `linerCode` field. */
  linerCode?: Maybe<StringFilter>;
  /** Filter by the object’s `linerDescription` field. */
  linerDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackLinerFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackLinerFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackLinerFilter>;
};

/** A connection to a list of `PackOut` values. */
export type PackOutsConnection = {
  __typename?: 'PackOutsConnection';
  /** A list of `PackOut` objects. */
  nodes: Array<Maybe<PackOut>>;
  /** A list of edges which contains the `PackOut` and cursor to aid in pagination. */
  edges: Array<PackOutsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackOut` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackOut = Node & {
  __typename?: 'PackOut';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  outCode: Scalars['String'];
  outDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackOut` edge in the connection. */
export type PackOutsEdge = {
  __typename?: 'PackOutsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackOut` at the end of the edge. */
  node?: Maybe<PackOut>;
};

/** Methods to use when ordering `PackOut`. */
export enum PackOutsOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  OutCodeAsc = 'OUT_CODE_ASC',
  OutCodeDesc = 'OUT_CODE_DESC',
  OutDescriptionAsc = 'OUT_DESCRIPTION_ASC',
  OutDescriptionDesc = 'OUT_DESCRIPTION_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PackOut` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PackOutCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `outCode` field. */
  outCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `outDescription` field. */
  outDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackOut` object types. All fields are combined with a logical ‘and.’ */
export type PackOutFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `outCode` field. */
  outCode?: Maybe<StringFilter>;
  /** Filter by the object’s `outDescription` field. */
  outDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackOutFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackOutFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackOutFilter>;
};

/** A connection to a list of `PackPalletType` values. */
export type PackPalletTypesConnection = {
  __typename?: 'PackPalletTypesConnection';
  /** A list of `PackPalletType` objects. */
  nodes: Array<Maybe<PackPalletType>>;
  /** A list of edges which contains the `PackPalletType` and cursor to aid in pagination. */
  edges: Array<PackPalletTypesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackPalletType` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackPalletType = Node & {
  __typename?: 'PackPalletType';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  palletType: Scalars['String'];
  palletTypeDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackPalletType` edge in the connection. */
export type PackPalletTypesEdge = {
  __typename?: 'PackPalletTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackPalletType` at the end of the edge. */
  node?: Maybe<PackPalletType>;
};

/** Methods to use when ordering `PackPalletType`. */
export enum PackPalletTypesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  PalletTypeAsc = 'PALLET_TYPE_ASC',
  PalletTypeDesc = 'PALLET_TYPE_DESC',
  PalletTypeDescriptionAsc = 'PALLET_TYPE_DESCRIPTION_ASC',
  PalletTypeDescriptionDesc = 'PALLET_TYPE_DESCRIPTION_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackPalletType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackPalletTypeCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `palletType` field. */
  palletType?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `palletTypeDescription` field. */
  palletTypeDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackPalletType` object types. All fields are combined with a logical ‘and.’ */
export type PackPalletTypeFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `palletType` field. */
  palletType?: Maybe<StringFilter>;
  /** Filter by the object’s `palletTypeDescription` field. */
  palletTypeDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackPalletTypeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackPalletTypeFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackPalletTypeFilter>;
};

/** A connection to a list of `PackProduction` values. */
export type PackProductionsConnection = {
  __typename?: 'PackProductionsConnection';
  /** A list of `PackProduction` objects. */
  nodes: Array<Maybe<PackProduction>>;
  /** A list of edges which contains the `PackProduction` and cursor to aid in pagination. */
  edges: Array<PackProductionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackProduction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackProduction = Node & {
  __typename?: 'PackProduction';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  productionCode: Scalars['String'];
  productionDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackProduction` edge in the connection. */
export type PackProductionsEdge = {
  __typename?: 'PackProductionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackProduction` at the end of the edge. */
  node?: Maybe<PackProduction>;
};

/** Methods to use when ordering `PackProduction`. */
export enum PackProductionsOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  ProductionCodeAsc = 'PRODUCTION_CODE_ASC',
  ProductionCodeDesc = 'PRODUCTION_CODE_DESC',
  ProductionDescriptionAsc = 'PRODUCTION_DESCRIPTION_ASC',
  ProductionDescriptionDesc = 'PRODUCTION_DESCRIPTION_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackProduction` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackProductionCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `productionCode` field. */
  productionCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `productionDescription` field. */
  productionDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackProduction` object types. All fields are combined with a logical ‘and.’ */
export type PackProductionFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `productionCode` field. */
  productionCode?: Maybe<StringFilter>;
  /** Filter by the object’s `productionDescription` field. */
  productionDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackProductionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackProductionFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackProductionFilter>;
};

/** A connection to a list of `PackSpecial` values. */
export type PackSpecialsConnection = {
  __typename?: 'PackSpecialsConnection';
  /** A list of `PackSpecial` objects. */
  nodes: Array<Maybe<PackSpecial>>;
  /** A list of edges which contains the `PackSpecial` and cursor to aid in pagination. */
  edges: Array<PackSpecialsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackSpecial` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackSpecial = Node & {
  __typename?: 'PackSpecial';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  customerCode: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
  customer?: Maybe<Customer>;
  shipper?: Maybe<Shipper>;
};

/** A `PackSpecial` edge in the connection. */
export type PackSpecialsEdge = {
  __typename?: 'PackSpecialsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackSpecial` at the end of the edge. */
  node?: Maybe<PackSpecial>;
};

/** Methods to use when ordering `PackSpecial`. */
export enum PackSpecialsOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  CustomerCodeAsc = 'CUSTOMER_CODE_ASC',
  CustomerCodeDesc = 'CUSTOMER_CODE_DESC',
  CustomerIdAsc = 'CUSTOMER_ID_ASC',
  CustomerIdDesc = 'CUSTOMER_ID_DESC',
  CustomerNameAsc = 'CUSTOMER_NAME_ASC',
  CustomerNameDesc = 'CUSTOMER_NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackSpecial` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackSpecialCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerCode` field. */
  customerCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerId` field. */
  customerId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerName` field. */
  customerName?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackSpecial` object types. All fields are combined with a logical ‘and.’ */
export type PackSpecialFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `customerCode` field. */
  customerCode?: Maybe<StringFilter>;
  /** Filter by the object’s `customerId` field. */
  customerId?: Maybe<StringFilter>;
  /** Filter by the object’s `customerName` field. */
  customerName?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackSpecialFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackSpecialFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackSpecialFilter>;
};

/** A connection to a list of `PackStyle` values. */
export type PackStylesConnection = {
  __typename?: 'PackStylesConnection';
  /** A list of `PackStyle` objects. */
  nodes: Array<Maybe<PackStyle>>;
  /** A list of edges which contains the `PackStyle` and cursor to aid in pagination. */
  edges: Array<PackStylesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackStyle` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackStyle = Node & {
  __typename?: 'PackStyle';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  packStyle: Scalars['String'];
  styleDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackStyle` edge in the connection. */
export type PackStylesEdge = {
  __typename?: 'PackStylesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackStyle` at the end of the edge. */
  node?: Maybe<PackStyle>;
};

/** Methods to use when ordering `PackStyle`. */
export enum PackStylesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  PackStyleAsc = 'PACK_STYLE_ASC',
  PackStyleDesc = 'PACK_STYLE_DESC',
  StyleDescriptionAsc = 'STYLE_DESCRIPTION_ASC',
  StyleDescriptionDesc = 'STYLE_DESCRIPTION_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackStyle` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PackStyleCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `packStyle` field. */
  packStyle?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `styleDescription` field. */
  styleDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackStyle` object types. All fields are combined with a logical ‘and.’ */
export type PackStyleFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `packStyle` field. */
  packStyle?: Maybe<StringFilter>;
  /** Filter by the object’s `styleDescription` field. */
  styleDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackStyleFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackStyleFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackStyleFilter>;
};

/** A connection to a list of `PackTreeRipe` values. */
export type PackTreeRipesConnection = {
  __typename?: 'PackTreeRipesConnection';
  /** A list of `PackTreeRipe` objects. */
  nodes: Array<Maybe<PackTreeRipe>>;
  /** A list of edges which contains the `PackTreeRipe` and cursor to aid in pagination. */
  edges: Array<PackTreeRipesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PackTreeRipe` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PackTreeRipe = Node & {
  __typename?: 'PackTreeRipe';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  shipperId: Scalars['String'];
  treeRipe: Scalars['String'];
  treeRipeDescription?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
};

/** A `PackTreeRipe` edge in the connection. */
export type PackTreeRipesEdge = {
  __typename?: 'PackTreeRipesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PackTreeRipe` at the end of the edge. */
  node?: Maybe<PackTreeRipe>;
};

/** Methods to use when ordering `PackTreeRipe`. */
export enum PackTreeRipesOrderBy {
  Natural = 'NATURAL',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  TreeRipeAsc = 'TREE_RIPE_ASC',
  TreeRipeDesc = 'TREE_RIPE_DESC',
  TreeRipeDescriptionAsc = 'TREE_RIPE_DESCRIPTION_ASC',
  TreeRipeDescriptionDesc = 'TREE_RIPE_DESCRIPTION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/**
 * A condition to be used against `PackTreeRipe` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PackTreeRipeCondition = {
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `treeRipe` field. */
  treeRipe?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `treeRipeDescription` field. */
  treeRipeDescription?: Maybe<Scalars['String']>;
};

/** A filter to be used against `PackTreeRipe` object types. All fields are combined with a logical ‘and.’ */
export type PackTreeRipeFilter = {
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Filter by the object’s `treeRipe` field. */
  treeRipe?: Maybe<StringFilter>;
  /** Filter by the object’s `treeRipeDescription` field. */
  treeRipeDescription?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PackTreeRipeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PackTreeRipeFilter>>;
  /** Negates the expression. */
  not?: Maybe<PackTreeRipeFilter>;
};

/** A connection to a list of `Size` values. */
export type SizesConnection = {
  __typename?: 'SizesConnection';
  /** A list of `Size` objects. */
  nodes: Array<Maybe<Size>>;
  /** A list of edges which contains the `Size` and cursor to aid in pagination. */
  edges: Array<SizesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Size` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Size = Node & {
  __typename?: 'Size';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  speciesId?: Maybe<Scalars['String']>;
  varietyId?: Maybe<Scalars['String']>;
  jvCode?: Maybe<Scalars['String']>;
  jvDescription?: Maybe<Scalars['String']>;
  shipperCode?: Maybe<Scalars['String']>;
  shipperDescription?: Maybe<Scalars['String']>;
  combinedCode?: Maybe<Scalars['String']>;
  combinedDescription?: Maybe<Scalars['String']>;
  shipperId?: Maybe<Scalars['String']>;
  shipper?: Maybe<Shipper>;
  species?: Maybe<Species>;
  variety?: Maybe<Variety>;
};

export type Species = Node & {
  __typename?: 'Species';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  speciesDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  fdaProductCode?: Maybe<Scalars['String']>;
  fdaIndustryCode?: Maybe<Scalars['String']>;
  defaultTemperature?: Maybe<Scalars['String']>;
};

export type Variety = Node & {
  __typename?: 'Variety';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['String'];
  varietyDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  customerLetterSequence?: Maybe<Scalars['String']>;
  summaryCode?: Maybe<Scalars['String']>;
  varietyGroup?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** A `Size` edge in the connection. */
export type SizesEdge = {
  __typename?: 'SizesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Size` at the end of the edge. */
  node?: Maybe<Size>;
};

/** Methods to use when ordering `Size`. */
export enum SizesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SpeciesIdAsc = 'SPECIES_ID_ASC',
  SpeciesIdDesc = 'SPECIES_ID_DESC',
  VarietyIdAsc = 'VARIETY_ID_ASC',
  VarietyIdDesc = 'VARIETY_ID_DESC',
  JvCodeAsc = 'JV_CODE_ASC',
  JvCodeDesc = 'JV_CODE_DESC',
  JvDescriptionAsc = 'JV_DESCRIPTION_ASC',
  JvDescriptionDesc = 'JV_DESCRIPTION_DESC',
  ShipperCodeAsc = 'SHIPPER_CODE_ASC',
  ShipperCodeDesc = 'SHIPPER_CODE_DESC',
  ShipperDescriptionAsc = 'SHIPPER_DESCRIPTION_ASC',
  ShipperDescriptionDesc = 'SHIPPER_DESCRIPTION_DESC',
  CombinedCodeAsc = 'COMBINED_CODE_ASC',
  CombinedCodeDesc = 'COMBINED_CODE_DESC',
  CombinedDescriptionAsc = 'COMBINED_DESCRIPTION_ASC',
  CombinedDescriptionDesc = 'COMBINED_DESCRIPTION_DESC',
  ShipperIdAsc = 'SHIPPER_ID_ASC',
  ShipperIdDesc = 'SHIPPER_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Size` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SizeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `speciesId` field. */
  speciesId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `varietyId` field. */
  varietyId?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `jvCode` field. */
  jvCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `jvDescription` field. */
  jvDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperCode` field. */
  shipperCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperDescription` field. */
  shipperDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combinedCode` field. */
  combinedCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combinedDescription` field. */
  combinedDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `shipperId` field. */
  shipperId?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Size` object types. All fields are combined with a logical ‘and.’ */
export type SizeFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<BigIntFilter>;
  /** Filter by the object’s `speciesId` field. */
  speciesId?: Maybe<StringFilter>;
  /** Filter by the object’s `varietyId` field. */
  varietyId?: Maybe<StringFilter>;
  /** Filter by the object’s `jvCode` field. */
  jvCode?: Maybe<StringFilter>;
  /** Filter by the object’s `jvDescription` field. */
  jvDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperCode` field. */
  shipperCode?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperDescription` field. */
  shipperDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `combinedCode` field. */
  combinedCode?: Maybe<StringFilter>;
  /** Filter by the object’s `combinedDescription` field. */
  combinedDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `shipperId` field. */
  shipperId?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<SizeFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<SizeFilter>>;
  /** Negates the expression. */
  not?: Maybe<SizeFilter>;
};

/** A connection to a list of `Species` values. */
export type SpeciesConnection = {
  __typename?: 'SpeciesConnection';
  /** A list of `Species` objects. */
  nodes: Array<Maybe<Species>>;
  /** A list of edges which contains the `Species` and cursor to aid in pagination. */
  edges: Array<SpeciesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Species` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Species` edge in the connection. */
export type SpeciesEdge = {
  __typename?: 'SpeciesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Species` at the end of the edge. */
  node?: Maybe<Species>;
};

/** Methods to use when ordering `Species`. */
export enum SpeciesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SpeciesDescriptionAsc = 'SPECIES_DESCRIPTION_ASC',
  SpeciesDescriptionDesc = 'SPECIES_DESCRIPTION_DESC',
  SecondaryDescriptionAsc = 'SECONDARY_DESCRIPTION_ASC',
  SecondaryDescriptionDesc = 'SECONDARY_DESCRIPTION_DESC',
  FdaProductCodeAsc = 'FDA_PRODUCT_CODE_ASC',
  FdaProductCodeDesc = 'FDA_PRODUCT_CODE_DESC',
  FdaIndustryCodeAsc = 'FDA_INDUSTRY_CODE_ASC',
  FdaIndustryCodeDesc = 'FDA_INDUSTRY_CODE_DESC',
  DefaultTemperatureAsc = 'DEFAULT_TEMPERATURE_ASC',
  DefaultTemperatureDesc = 'DEFAULT_TEMPERATURE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Species` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SpeciesCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `speciesDescription` field. */
  speciesDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `secondaryDescription` field. */
  secondaryDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `fdaProductCode` field. */
  fdaProductCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `fdaIndustryCode` field. */
  fdaIndustryCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `defaultTemperature` field. */
  defaultTemperature?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Species` object types. All fields are combined with a logical ‘and.’ */
export type SpeciesFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `speciesDescription` field. */
  speciesDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `secondaryDescription` field. */
  secondaryDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `fdaProductCode` field. */
  fdaProductCode?: Maybe<StringFilter>;
  /** Filter by the object’s `fdaIndustryCode` field. */
  fdaIndustryCode?: Maybe<StringFilter>;
  /** Filter by the object’s `defaultTemperature` field. */
  defaultTemperature?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<SpeciesFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<SpeciesFilter>>;
  /** Negates the expression. */
  not?: Maybe<SpeciesFilter>;
};

/** A connection to a list of `Variety` values. */
export type VarietiesConnection = {
  __typename?: 'VarietiesConnection';
  /** A list of `Variety` objects. */
  nodes: Array<Maybe<Variety>>;
  /** A list of edges which contains the `Variety` and cursor to aid in pagination. */
  edges: Array<VarietiesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Variety` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Variety` edge in the connection. */
export type VarietiesEdge = {
  __typename?: 'VarietiesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Variety` at the end of the edge. */
  node?: Maybe<Variety>;
};

/** Methods to use when ordering `Variety`. */
export enum VarietiesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  VarietyDescriptionAsc = 'VARIETY_DESCRIPTION_ASC',
  VarietyDescriptionDesc = 'VARIETY_DESCRIPTION_DESC',
  SecondaryDescriptionAsc = 'SECONDARY_DESCRIPTION_ASC',
  SecondaryDescriptionDesc = 'SECONDARY_DESCRIPTION_DESC',
  CustomerLetterSequenceAsc = 'CUSTOMER_LETTER_SEQUENCE_ASC',
  CustomerLetterSequenceDesc = 'CUSTOMER_LETTER_SEQUENCE_DESC',
  SummaryCodeAsc = 'SUMMARY_CODE_ASC',
  SummaryCodeDesc = 'SUMMARY_CODE_DESC',
  VarietyGroupAsc = 'VARIETY_GROUP_ASC',
  VarietyGroupDesc = 'VARIETY_GROUP_DESC',
  CombineWithAsc = 'COMBINE_WITH_ASC',
  CombineWithDesc = 'COMBINE_WITH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Variety` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type VarietyCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `varietyDescription` field. */
  varietyDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `secondaryDescription` field. */
  secondaryDescription?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `customerLetterSequence` field. */
  customerLetterSequence?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `summaryCode` field. */
  summaryCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `varietyGroup` field. */
  varietyGroup?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `combineWith` field. */
  combineWith?: Maybe<Scalars['String']>;
};

/** A filter to be used against `Variety` object types. All fields are combined with a logical ‘and.’ */
export type VarietyFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `varietyDescription` field. */
  varietyDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `secondaryDescription` field. */
  secondaryDescription?: Maybe<StringFilter>;
  /** Filter by the object’s `customerLetterSequence` field. */
  customerLetterSequence?: Maybe<StringFilter>;
  /** Filter by the object’s `summaryCode` field. */
  summaryCode?: Maybe<StringFilter>;
  /** Filter by the object’s `varietyGroup` field. */
  varietyGroup?: Maybe<StringFilter>;
  /** Filter by the object’s `combineWith` field. */
  combineWith?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<VarietyFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<VarietyFilter>>;
  /** Negates the expression. */
  not?: Maybe<VarietyFilter>;
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
  /** Creates a single `ContactAlias`. */
  createContactAlias?: Maybe<CreateContactAliasPayload>;
  /** Creates a single `ContactAliasPersonContact`. */
  createContactAliasPersonContact?: Maybe<CreateContactAliasPersonContactPayload>;
  /** Creates a single `Country`. */
  createCountry?: Maybe<CreateCountryPayload>;
  /** Creates a single `Customer`. */
  createCustomer?: Maybe<CreateCustomerPayload>;
  /** Creates a single `PersonContact`. */
  createPersonContact?: Maybe<CreatePersonContactPayload>;
  /** Creates a single `Shipper`. */
  createShipper?: Maybe<CreateShipperPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
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
  /** Creates a single `PsaArrivalPicture`. */
  createPsaArrivalPicture?: Maybe<CreatePsaArrivalPicturePayload>;
  /** Creates a single `PsaArrivalReport`. */
  createPsaArrivalReport?: Maybe<CreatePsaArrivalReportPayload>;
  /** Creates a single `Master`. */
  createMaster?: Maybe<CreateMasterPayload>;
  /** Creates a single `PackAtmosphere`. */
  createPackAtmosphere?: Maybe<CreatePackAtmospherePayload>;
  /** Creates a single `PackBoxStyle`. */
  createPackBoxStyle?: Maybe<CreatePackBoxStylePayload>;
  /** Creates a single `PackBoxType`. */
  createPackBoxType?: Maybe<CreatePackBoxTypePayload>;
  /** Creates a single `PackDestination`. */
  createPackDestination?: Maybe<CreatePackDestinationPayload>;
  /** Creates a single `PackGrade`. */
  createPackGrade?: Maybe<CreatePackGradePayload>;
  /** Creates a single `PackHold`. */
  createPackHold?: Maybe<CreatePackHoldPayload>;
  /** Creates a single `PackLabel`. */
  createPackLabel?: Maybe<CreatePackLabelPayload>;
  /** Creates a single `PackLiner`. */
  createPackLiner?: Maybe<CreatePackLinerPayload>;
  /** Creates a single `PackOut`. */
  createPackOut?: Maybe<CreatePackOutPayload>;
  /** Creates a single `PackPalletType`. */
  createPackPalletType?: Maybe<CreatePackPalletTypePayload>;
  /** Creates a single `PackProduction`. */
  createPackProduction?: Maybe<CreatePackProductionPayload>;
  /** Creates a single `PackSpecial`. */
  createPackSpecial?: Maybe<CreatePackSpecialPayload>;
  /** Creates a single `PackStyle`. */
  createPackStyle?: Maybe<CreatePackStylePayload>;
  /** Creates a single `PackTreeRipe`. */
  createPackTreeRipe?: Maybe<CreatePackTreeRipePayload>;
  /** Creates a single `Size`. */
  createSize?: Maybe<CreateSizePayload>;
  /** Creates a single `Species`. */
  createSpecies?: Maybe<CreateSpeciesPayload>;
  /** Creates a single `Variety`. */
  createVariety?: Maybe<CreateVarietyPayload>;
  /** Updates a single `ContactAlias` using its globally unique id and a patch. */
  updateContactAliasByNodeId?: Maybe<UpdateContactAliasPayload>;
  /** Updates a single `ContactAlias` using a unique key and a patch. */
  updateContactAlias?: Maybe<UpdateContactAliasPayload>;
  /** Updates a single `ContactAliasPersonContact` using its globally unique id and a patch. */
  updateContactAliasPersonContactByNodeId?: Maybe<UpdateContactAliasPersonContactPayload>;
  /** Updates a single `ContactAliasPersonContact` using a unique key and a patch. */
  updateContactAliasPersonContact?: Maybe<UpdateContactAliasPersonContactPayload>;
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
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserByNodeId?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByPin?: Maybe<UpdateUserPayload>;
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
  /** Updates a single `PsaArrivalPicture` using its globally unique id and a patch. */
  updatePsaArrivalPictureByNodeId?: Maybe<UpdatePsaArrivalPicturePayload>;
  /** Updates a single `PsaArrivalPicture` using a unique key and a patch. */
  updatePsaArrivalPicture?: Maybe<UpdatePsaArrivalPicturePayload>;
  /** Updates a single `PsaArrivalReport` using its globally unique id and a patch. */
  updatePsaArrivalReportByNodeId?: Maybe<UpdatePsaArrivalReportPayload>;
  /** Updates a single `PsaArrivalReport` using a unique key and a patch. */
  updatePsaArrivalReport?: Maybe<UpdatePsaArrivalReportPayload>;
  /** Updates a single `Master` using its globally unique id and a patch. */
  updateMasterByNodeId?: Maybe<UpdateMasterPayload>;
  /** Updates a single `Master` using a unique key and a patch. */
  updateMaster?: Maybe<UpdateMasterPayload>;
  /** Updates a single `PackAtmosphere` using its globally unique id and a patch. */
  updatePackAtmosphereByNodeId?: Maybe<UpdatePackAtmospherePayload>;
  /** Updates a single `PackAtmosphere` using a unique key and a patch. */
  updatePackAtmosphere?: Maybe<UpdatePackAtmospherePayload>;
  /** Updates a single `PackBoxStyle` using its globally unique id and a patch. */
  updatePackBoxStyleByNodeId?: Maybe<UpdatePackBoxStylePayload>;
  /** Updates a single `PackBoxStyle` using a unique key and a patch. */
  updatePackBoxStyle?: Maybe<UpdatePackBoxStylePayload>;
  /** Updates a single `PackBoxType` using its globally unique id and a patch. */
  updatePackBoxTypeByNodeId?: Maybe<UpdatePackBoxTypePayload>;
  /** Updates a single `PackBoxType` using a unique key and a patch. */
  updatePackBoxType?: Maybe<UpdatePackBoxTypePayload>;
  /** Updates a single `PackDestination` using its globally unique id and a patch. */
  updatePackDestinationByNodeId?: Maybe<UpdatePackDestinationPayload>;
  /** Updates a single `PackDestination` using a unique key and a patch. */
  updatePackDestination?: Maybe<UpdatePackDestinationPayload>;
  /** Updates a single `PackGrade` using its globally unique id and a patch. */
  updatePackGradeByNodeId?: Maybe<UpdatePackGradePayload>;
  /** Updates a single `PackGrade` using a unique key and a patch. */
  updatePackGrade?: Maybe<UpdatePackGradePayload>;
  /** Updates a single `PackHold` using its globally unique id and a patch. */
  updatePackHoldByNodeId?: Maybe<UpdatePackHoldPayload>;
  /** Updates a single `PackHold` using a unique key and a patch. */
  updatePackHold?: Maybe<UpdatePackHoldPayload>;
  /** Updates a single `PackLabel` using its globally unique id and a patch. */
  updatePackLabelByNodeId?: Maybe<UpdatePackLabelPayload>;
  /** Updates a single `PackLabel` using a unique key and a patch. */
  updatePackLabel?: Maybe<UpdatePackLabelPayload>;
  /** Updates a single `PackLiner` using its globally unique id and a patch. */
  updatePackLinerByNodeId?: Maybe<UpdatePackLinerPayload>;
  /** Updates a single `PackLiner` using a unique key and a patch. */
  updatePackLiner?: Maybe<UpdatePackLinerPayload>;
  /** Updates a single `PackOut` using its globally unique id and a patch. */
  updatePackOutByNodeId?: Maybe<UpdatePackOutPayload>;
  /** Updates a single `PackOut` using a unique key and a patch. */
  updatePackOut?: Maybe<UpdatePackOutPayload>;
  /** Updates a single `PackPalletType` using its globally unique id and a patch. */
  updatePackPalletTypeByNodeId?: Maybe<UpdatePackPalletTypePayload>;
  /** Updates a single `PackPalletType` using a unique key and a patch. */
  updatePackPalletType?: Maybe<UpdatePackPalletTypePayload>;
  /** Updates a single `PackProduction` using its globally unique id and a patch. */
  updatePackProductionByNodeId?: Maybe<UpdatePackProductionPayload>;
  /** Updates a single `PackProduction` using a unique key and a patch. */
  updatePackProduction?: Maybe<UpdatePackProductionPayload>;
  /** Updates a single `PackSpecial` using its globally unique id and a patch. */
  updatePackSpecialByNodeId?: Maybe<UpdatePackSpecialPayload>;
  /** Updates a single `PackSpecial` using a unique key and a patch. */
  updatePackSpecial?: Maybe<UpdatePackSpecialPayload>;
  /** Updates a single `PackStyle` using its globally unique id and a patch. */
  updatePackStyleByNodeId?: Maybe<UpdatePackStylePayload>;
  /** Updates a single `PackStyle` using a unique key and a patch. */
  updatePackStyle?: Maybe<UpdatePackStylePayload>;
  /** Updates a single `PackTreeRipe` using its globally unique id and a patch. */
  updatePackTreeRipeByNodeId?: Maybe<UpdatePackTreeRipePayload>;
  /** Updates a single `PackTreeRipe` using a unique key and a patch. */
  updatePackTreeRipe?: Maybe<UpdatePackTreeRipePayload>;
  /** Updates a single `Size` using its globally unique id and a patch. */
  updateSizeByNodeId?: Maybe<UpdateSizePayload>;
  /** Updates a single `Size` using a unique key and a patch. */
  updateSize?: Maybe<UpdateSizePayload>;
  /** Updates a single `Species` using its globally unique id and a patch. */
  updateSpeciesByNodeId?: Maybe<UpdateSpeciesPayload>;
  /** Updates a single `Species` using a unique key and a patch. */
  updateSpecies?: Maybe<UpdateSpeciesPayload>;
  /** Updates a single `Variety` using its globally unique id and a patch. */
  updateVarietyByNodeId?: Maybe<UpdateVarietyPayload>;
  /** Updates a single `Variety` using a unique key and a patch. */
  updateVariety?: Maybe<UpdateVarietyPayload>;
  /** Deletes a single `ContactAlias` using its globally unique id. */
  deleteContactAliasByNodeId?: Maybe<DeleteContactAliasPayload>;
  /** Deletes a single `ContactAlias` using a unique key. */
  deleteContactAlias?: Maybe<DeleteContactAliasPayload>;
  /** Deletes a single `ContactAliasPersonContact` using its globally unique id. */
  deleteContactAliasPersonContactByNodeId?: Maybe<DeleteContactAliasPersonContactPayload>;
  /** Deletes a single `ContactAliasPersonContact` using a unique key. */
  deleteContactAliasPersonContact?: Maybe<DeleteContactAliasPersonContactPayload>;
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
  /** Deletes a single `User` using its globally unique id. */
  deleteUserByNodeId?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByPin?: Maybe<DeleteUserPayload>;
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
  /** Deletes a single `PsaArrivalPicture` using its globally unique id. */
  deletePsaArrivalPictureByNodeId?: Maybe<DeletePsaArrivalPicturePayload>;
  /** Deletes a single `PsaArrivalPicture` using a unique key. */
  deletePsaArrivalPicture?: Maybe<DeletePsaArrivalPicturePayload>;
  /** Deletes a single `PsaArrivalReport` using its globally unique id. */
  deletePsaArrivalReportByNodeId?: Maybe<DeletePsaArrivalReportPayload>;
  /** Deletes a single `PsaArrivalReport` using a unique key. */
  deletePsaArrivalReport?: Maybe<DeletePsaArrivalReportPayload>;
  /** Deletes a single `Master` using its globally unique id. */
  deleteMasterByNodeId?: Maybe<DeleteMasterPayload>;
  /** Deletes a single `Master` using a unique key. */
  deleteMaster?: Maybe<DeleteMasterPayload>;
  /** Deletes a single `PackAtmosphere` using its globally unique id. */
  deletePackAtmosphereByNodeId?: Maybe<DeletePackAtmospherePayload>;
  /** Deletes a single `PackAtmosphere` using a unique key. */
  deletePackAtmosphere?: Maybe<DeletePackAtmospherePayload>;
  /** Deletes a single `PackBoxStyle` using its globally unique id. */
  deletePackBoxStyleByNodeId?: Maybe<DeletePackBoxStylePayload>;
  /** Deletes a single `PackBoxStyle` using a unique key. */
  deletePackBoxStyle?: Maybe<DeletePackBoxStylePayload>;
  /** Deletes a single `PackBoxType` using its globally unique id. */
  deletePackBoxTypeByNodeId?: Maybe<DeletePackBoxTypePayload>;
  /** Deletes a single `PackBoxType` using a unique key. */
  deletePackBoxType?: Maybe<DeletePackBoxTypePayload>;
  /** Deletes a single `PackDestination` using its globally unique id. */
  deletePackDestinationByNodeId?: Maybe<DeletePackDestinationPayload>;
  /** Deletes a single `PackDestination` using a unique key. */
  deletePackDestination?: Maybe<DeletePackDestinationPayload>;
  /** Deletes a single `PackGrade` using its globally unique id. */
  deletePackGradeByNodeId?: Maybe<DeletePackGradePayload>;
  /** Deletes a single `PackGrade` using a unique key. */
  deletePackGrade?: Maybe<DeletePackGradePayload>;
  /** Deletes a single `PackHold` using its globally unique id. */
  deletePackHoldByNodeId?: Maybe<DeletePackHoldPayload>;
  /** Deletes a single `PackHold` using a unique key. */
  deletePackHold?: Maybe<DeletePackHoldPayload>;
  /** Deletes a single `PackLabel` using its globally unique id. */
  deletePackLabelByNodeId?: Maybe<DeletePackLabelPayload>;
  /** Deletes a single `PackLabel` using a unique key. */
  deletePackLabel?: Maybe<DeletePackLabelPayload>;
  /** Deletes a single `PackLiner` using its globally unique id. */
  deletePackLinerByNodeId?: Maybe<DeletePackLinerPayload>;
  /** Deletes a single `PackLiner` using a unique key. */
  deletePackLiner?: Maybe<DeletePackLinerPayload>;
  /** Deletes a single `PackOut` using its globally unique id. */
  deletePackOutByNodeId?: Maybe<DeletePackOutPayload>;
  /** Deletes a single `PackOut` using a unique key. */
  deletePackOut?: Maybe<DeletePackOutPayload>;
  /** Deletes a single `PackPalletType` using its globally unique id. */
  deletePackPalletTypeByNodeId?: Maybe<DeletePackPalletTypePayload>;
  /** Deletes a single `PackPalletType` using a unique key. */
  deletePackPalletType?: Maybe<DeletePackPalletTypePayload>;
  /** Deletes a single `PackProduction` using its globally unique id. */
  deletePackProductionByNodeId?: Maybe<DeletePackProductionPayload>;
  /** Deletes a single `PackProduction` using a unique key. */
  deletePackProduction?: Maybe<DeletePackProductionPayload>;
  /** Deletes a single `PackSpecial` using its globally unique id. */
  deletePackSpecialByNodeId?: Maybe<DeletePackSpecialPayload>;
  /** Deletes a single `PackSpecial` using a unique key. */
  deletePackSpecial?: Maybe<DeletePackSpecialPayload>;
  /** Deletes a single `PackStyle` using its globally unique id. */
  deletePackStyleByNodeId?: Maybe<DeletePackStylePayload>;
  /** Deletes a single `PackStyle` using a unique key. */
  deletePackStyle?: Maybe<DeletePackStylePayload>;
  /** Deletes a single `PackTreeRipe` using its globally unique id. */
  deletePackTreeRipeByNodeId?: Maybe<DeletePackTreeRipePayload>;
  /** Deletes a single `PackTreeRipe` using a unique key. */
  deletePackTreeRipe?: Maybe<DeletePackTreeRipePayload>;
  /** Deletes a single `Size` using its globally unique id. */
  deleteSizeByNodeId?: Maybe<DeleteSizePayload>;
  /** Deletes a single `Size` using a unique key. */
  deleteSize?: Maybe<DeleteSizePayload>;
  /** Deletes a single `Species` using its globally unique id. */
  deleteSpeciesByNodeId?: Maybe<DeleteSpeciesPayload>;
  /** Deletes a single `Species` using a unique key. */
  deleteSpecies?: Maybe<DeleteSpeciesPayload>;
  /** Deletes a single `Variety` using its globally unique id. */
  deleteVarietyByNodeId?: Maybe<DeleteVarietyPayload>;
  /** Deletes a single `Variety` using a unique key. */
  deleteVariety?: Maybe<DeleteVarietyPayload>;
  bulkAddContactsToAlias?: Maybe<BulkAddContactsToAliasPayload>;
  bulkRemoveContactAliasPersonContact?: Maybe<BulkRemoveContactAliasPersonContactPayload>;
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
export type MutationCreateContactAliasArgs = {
  input: CreateContactAliasInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateContactAliasPersonContactArgs = {
  input: CreateContactAliasPersonContactInput;
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
export type MutationCreateUserArgs = {
  input: CreateUserInput;
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
export type MutationCreatePsaArrivalPictureArgs = {
  input: CreatePsaArrivalPictureInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePsaArrivalReportArgs = {
  input: CreatePsaArrivalReportInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateMasterArgs = {
  input: CreateMasterInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackAtmosphereArgs = {
  input: CreatePackAtmosphereInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackBoxStyleArgs = {
  input: CreatePackBoxStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackBoxTypeArgs = {
  input: CreatePackBoxTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackDestinationArgs = {
  input: CreatePackDestinationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackGradeArgs = {
  input: CreatePackGradeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackHoldArgs = {
  input: CreatePackHoldInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackLabelArgs = {
  input: CreatePackLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackLinerArgs = {
  input: CreatePackLinerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackOutArgs = {
  input: CreatePackOutInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackPalletTypeArgs = {
  input: CreatePackPalletTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackProductionArgs = {
  input: CreatePackProductionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackSpecialArgs = {
  input: CreatePackSpecialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackStyleArgs = {
  input: CreatePackStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePackTreeRipeArgs = {
  input: CreatePackTreeRipeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSizeArgs = {
  input: CreateSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSpeciesArgs = {
  input: CreateSpeciesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateVarietyArgs = {
  input: CreateVarietyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateContactAliasByNodeIdArgs = {
  input: UpdateContactAliasByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateContactAliasArgs = {
  input: UpdateContactAliasInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateContactAliasPersonContactByNodeIdArgs = {
  input: UpdateContactAliasPersonContactByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateContactAliasPersonContactArgs = {
  input: UpdateContactAliasPersonContactInput;
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
export type MutationUpdateUserByNodeIdArgs = {
  input: UpdateUserByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByPinArgs = {
  input: UpdateUserByPinInput;
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
export type MutationUpdatePsaArrivalPictureByNodeIdArgs = {
  input: UpdatePsaArrivalPictureByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePsaArrivalPictureArgs = {
  input: UpdatePsaArrivalPictureInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePsaArrivalReportByNodeIdArgs = {
  input: UpdatePsaArrivalReportByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePsaArrivalReportArgs = {
  input: UpdatePsaArrivalReportInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMasterByNodeIdArgs = {
  input: UpdateMasterByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateMasterArgs = {
  input: UpdateMasterInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackAtmosphereByNodeIdArgs = {
  input: UpdatePackAtmosphereByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackAtmosphereArgs = {
  input: UpdatePackAtmosphereInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackBoxStyleByNodeIdArgs = {
  input: UpdatePackBoxStyleByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackBoxStyleArgs = {
  input: UpdatePackBoxStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackBoxTypeByNodeIdArgs = {
  input: UpdatePackBoxTypeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackBoxTypeArgs = {
  input: UpdatePackBoxTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackDestinationByNodeIdArgs = {
  input: UpdatePackDestinationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackDestinationArgs = {
  input: UpdatePackDestinationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackGradeByNodeIdArgs = {
  input: UpdatePackGradeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackGradeArgs = {
  input: UpdatePackGradeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackHoldByNodeIdArgs = {
  input: UpdatePackHoldByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackHoldArgs = {
  input: UpdatePackHoldInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackLabelByNodeIdArgs = {
  input: UpdatePackLabelByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackLabelArgs = {
  input: UpdatePackLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackLinerByNodeIdArgs = {
  input: UpdatePackLinerByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackLinerArgs = {
  input: UpdatePackLinerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackOutByNodeIdArgs = {
  input: UpdatePackOutByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackOutArgs = {
  input: UpdatePackOutInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackPalletTypeByNodeIdArgs = {
  input: UpdatePackPalletTypeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackPalletTypeArgs = {
  input: UpdatePackPalletTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackProductionByNodeIdArgs = {
  input: UpdatePackProductionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackProductionArgs = {
  input: UpdatePackProductionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackSpecialByNodeIdArgs = {
  input: UpdatePackSpecialByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackSpecialArgs = {
  input: UpdatePackSpecialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackStyleByNodeIdArgs = {
  input: UpdatePackStyleByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackStyleArgs = {
  input: UpdatePackStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackTreeRipeByNodeIdArgs = {
  input: UpdatePackTreeRipeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePackTreeRipeArgs = {
  input: UpdatePackTreeRipeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSizeByNodeIdArgs = {
  input: UpdateSizeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSizeArgs = {
  input: UpdateSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSpeciesByNodeIdArgs = {
  input: UpdateSpeciesByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSpeciesArgs = {
  input: UpdateSpeciesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVarietyByNodeIdArgs = {
  input: UpdateVarietyByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateVarietyArgs = {
  input: UpdateVarietyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteContactAliasByNodeIdArgs = {
  input: DeleteContactAliasByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteContactAliasArgs = {
  input: DeleteContactAliasInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteContactAliasPersonContactByNodeIdArgs = {
  input: DeleteContactAliasPersonContactByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteContactAliasPersonContactArgs = {
  input: DeleteContactAliasPersonContactInput;
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
export type MutationDeleteUserByNodeIdArgs = {
  input: DeleteUserByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByPinArgs = {
  input: DeleteUserByPinInput;
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
export type MutationDeletePsaArrivalPictureByNodeIdArgs = {
  input: DeletePsaArrivalPictureByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePsaArrivalPictureArgs = {
  input: DeletePsaArrivalPictureInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePsaArrivalReportByNodeIdArgs = {
  input: DeletePsaArrivalReportByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePsaArrivalReportArgs = {
  input: DeletePsaArrivalReportInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMasterByNodeIdArgs = {
  input: DeleteMasterByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteMasterArgs = {
  input: DeleteMasterInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackAtmosphereByNodeIdArgs = {
  input: DeletePackAtmosphereByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackAtmosphereArgs = {
  input: DeletePackAtmosphereInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackBoxStyleByNodeIdArgs = {
  input: DeletePackBoxStyleByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackBoxStyleArgs = {
  input: DeletePackBoxStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackBoxTypeByNodeIdArgs = {
  input: DeletePackBoxTypeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackBoxTypeArgs = {
  input: DeletePackBoxTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackDestinationByNodeIdArgs = {
  input: DeletePackDestinationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackDestinationArgs = {
  input: DeletePackDestinationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackGradeByNodeIdArgs = {
  input: DeletePackGradeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackGradeArgs = {
  input: DeletePackGradeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackHoldByNodeIdArgs = {
  input: DeletePackHoldByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackHoldArgs = {
  input: DeletePackHoldInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackLabelByNodeIdArgs = {
  input: DeletePackLabelByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackLabelArgs = {
  input: DeletePackLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackLinerByNodeIdArgs = {
  input: DeletePackLinerByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackLinerArgs = {
  input: DeletePackLinerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackOutByNodeIdArgs = {
  input: DeletePackOutByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackOutArgs = {
  input: DeletePackOutInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackPalletTypeByNodeIdArgs = {
  input: DeletePackPalletTypeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackPalletTypeArgs = {
  input: DeletePackPalletTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackProductionByNodeIdArgs = {
  input: DeletePackProductionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackProductionArgs = {
  input: DeletePackProductionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackSpecialByNodeIdArgs = {
  input: DeletePackSpecialByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackSpecialArgs = {
  input: DeletePackSpecialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackStyleByNodeIdArgs = {
  input: DeletePackStyleByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackStyleArgs = {
  input: DeletePackStyleInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackTreeRipeByNodeIdArgs = {
  input: DeletePackTreeRipeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePackTreeRipeArgs = {
  input: DeletePackTreeRipeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSizeByNodeIdArgs = {
  input: DeleteSizeByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSizeArgs = {
  input: DeleteSizeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSpeciesByNodeIdArgs = {
  input: DeleteSpeciesByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSpeciesArgs = {
  input: DeleteSpeciesInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVarietyByNodeIdArgs = {
  input: DeleteVarietyByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteVarietyArgs = {
  input: DeleteVarietyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkAddContactsToAliasArgs = {
  input: BulkAddContactsToAliasInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationBulkRemoveContactAliasPersonContactArgs = {
  input: BulkRemoveContactAliasPersonContactInput;
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


/** The root mutation type which contains root level fields which mutate data. */
export type MutationSendPriceSheetUpdateEmailArgs = {
  input?: Maybe<PriceSheetUpdateInput>;
};

/** The output of our create `ContactAlias` mutation. */
export type CreateContactAliasPayload = {
  __typename?: 'CreateContactAliasPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAlias` that was created by this mutation. */
  contactAlias?: Maybe<ContactAlias>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ContactAlias`. */
  user?: Maybe<User>;
  /** An edge for our `ContactAlias`. May be used by Relay 1. */
  contactAliasEdge?: Maybe<ContactAliasesEdge>;
};


/** The output of our create `ContactAlias` mutation. */
export type CreateContactAliasPayloadContactAliasEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
};

/** All input for the create `ContactAlias` mutation. */
export type CreateContactAliasInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAlias` to be created by this mutation. */
  contactAlias: ContactAliasInput;
};

/** An input for mutations affecting `ContactAlias` */
export type ContactAliasInput = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription: Scalars['String'];
  aliasName: Scalars['String'];
  userId?: Maybe<Scalars['BigInt']>;
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `ContactAliasInput` mutation. */
export type ContactAliasUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByPin?: Maybe<UserUserPinKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByPin?: Maybe<UserUserPinKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnContactAliasForContactAliasUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByPin?: Maybe<UserOnContactAliasForContactAliasUserIdFkeyUsingUserPinKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<ContactAliasOnContactAliasForContactAliasUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<ContactAliasUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to connect. */
export type UserUserPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The fields on `user` to look up the row to connect. */
export type UserUserPinKeyConnect = {
  pin: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type UserNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `user` to look up the row to delete. */
export type UserUserPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The fields on `user` to look up the row to delete. */
export type UserUserPinKeyDelete = {
  pin: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type UserNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `user` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `user` to look up the row to update. */
export type UserOnContactAliasForContactAliasUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnContactAliasForContactAliasUserIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnContactAliasForContactAliasUserIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  pin?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  contactAliasesUsingId?: Maybe<ContactAliasUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `contactAlias` in the `UserInput` mutation. */
export type ContactAliasUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `contactAlias` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  connectById?: Maybe<Array<ContactAliasContactAliasPkeyConnect>>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ContactAliasNodeIdConnect>>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  deleteById?: Maybe<Array<ContactAliasContactAliasPkeyDelete>>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ContactAliasNodeIdDelete>>;
  /** The primary key(s) and patch data for `contactAlias` for the far side of the relationship. */
  updateById?: Maybe<Array<ContactAliasOnContactAliasForContactAliasUserIdFkeyUsingContactAliasPkeyUpdate>>;
  /** The primary key(s) and patch data for `contactAlias` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnContactAliasForContactAliasUserIdFkeyNodeIdUpdate>>;
  /** A `ContactAliasInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ContactAliasUserIdFkeyContactAliasCreateInput>>;
};

/** The fields on `contactAlias` to look up the row to connect. */
export type ContactAliasContactAliasPkeyConnect = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ContactAliasNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `contactAlias` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `contactAlias` to look up the row to delete. */
export type ContactAliasContactAliasPkeyDelete = {
  id: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ContactAliasNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `contactAlias` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `contactAlias` to look up the row to update. */
export type ContactAliasOnContactAliasForContactAliasUserIdFkeyUsingContactAliasPkeyUpdate = {
  /** An object where the defined keys will be set on the `contactAlias` being updated. */
  patch: UpdateContactAliasOnContactAliasForContactAliasUserIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `contactAlias` being updated. */
export type UpdateContactAliasOnContactAliasForContactAliasUserIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription?: Maybe<Scalars['String']>;
  aliasName?: Maybe<Scalars['String']>;
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** Input for the nested mutation of `contactAliasPersonContact` in the `ContactAliasInput` mutation. */
export type ContactAliasPersonContactAliasIdFkeyInverseInput = {
  /** Flag indicating whether all other `contactAliasPersonContact` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  connectByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactContactAliasPersonContactPkeyConnect>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ContactAliasPersonContactNodeIdConnect>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  deleteByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactContactAliasPersonContactPkeyDelete>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ContactAliasPersonContactNodeIdDelete>>;
  /** The primary key(s) and patch data for `contactAliasPersonContact` for the far side of the relationship. */
  updateByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyUsingContactAliasPersonContactPkeyUpdate>>;
  /** The primary key(s) and patch data for `contactAliasPersonContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyNodeIdUpdate>>;
  /** A `ContactAliasPersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ContactAliasPersonContactAliasIdFkeyContactAliasPersonContactCreateInput>>;
};

/** The fields on `contactAliasPersonContact` to look up the row to connect. */
export type ContactAliasPersonContactContactAliasPersonContactPkeyConnect = {
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ContactAliasPersonContactNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `contactAliasPersonContact` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `contactAliasPersonContact` to look up the row to delete. */
export type ContactAliasPersonContactContactAliasPersonContactPkeyDelete = {
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ContactAliasPersonContactNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `contactAliasPersonContact` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `contactAliasPersonContact` to look up the row to update. */
export type ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyUsingContactAliasPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
  patch: UpdateContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyPatch;
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
export type UpdateContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyPatch = {
  personContactId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
};

/** Input for the nested mutation of `contactAlias` in the `ContactAliasPersonContactInput` mutation. */
export type ContactAliasPersonContactAliasIdFkeyInput = {
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  connectById?: Maybe<ContactAliasContactAliasPkeyConnect>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  connectByNodeId?: Maybe<ContactAliasNodeIdConnect>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  deleteById?: Maybe<ContactAliasContactAliasPkeyDelete>;
  /** The primary key(s) for `contactAlias` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ContactAliasNodeIdDelete>;
  /** The primary key(s) and patch data for `contactAlias` for the far side of the relationship. */
  updateById?: Maybe<ContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyUsingContactAliasPkeyUpdate>;
  /** The primary key(s) and patch data for `contactAlias` for the far side of the relationship. */
  updateByNodeId?: Maybe<ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyNodeIdUpdate>;
  /** A `ContactAliasInput` object that will be created and connected to this object. */
  create?: Maybe<ContactAliasPersonContactAliasIdFkeyContactAliasCreateInput>;
};

/** The fields on `contactAlias` to look up the row to update. */
export type ContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyUsingContactAliasPkeyUpdate = {
  /** An object where the defined keys will be set on the `contactAlias` being updated. */
  patch: UpdateContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `contactAlias` being updated. */
export type UpdateContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyPatch = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription?: Maybe<Scalars['String']>;
  aliasName?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['BigInt']>;
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `contactAlias` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `contactAlias` being updated. */
  patch: ContactAliasPatch;
};

/** Represents an update to a `ContactAlias`. Fields that are set will be updated. */
export type ContactAliasPatch = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription?: Maybe<Scalars['String']>;
  aliasName?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['BigInt']>;
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** The `contactAlias` to be created by this mutation. */
export type ContactAliasPersonContactAliasIdFkeyContactAliasCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription: Scalars['String'];
  aliasName: Scalars['String'];
  userId?: Maybe<Scalars['BigInt']>;
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** Input for the nested mutation of `personContact` in the `ContactAliasPersonContactInput` mutation. */
export type ContactAliasPersonContactPersonContactIdFkeyInput = {
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectById?: Maybe<PersonContactPersonContactPkeyConnect>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<PersonContactNodeIdConnect>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteById?: Maybe<PersonContactPersonContactPkeyDelete>;
  /** The primary key(s) for `personContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PersonContactNodeIdDelete>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateById?: Maybe<PersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyUsingPersonContactPkeyUpdate>;
  /** The primary key(s) and patch data for `personContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyNodeIdUpdate>;
  /** A `PersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<ContactAliasPersonContactPersonContactIdFkeyPersonContactCreateInput>;
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
export type PersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyUsingPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: UpdatePersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyPatch;
  id: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `personContact` being updated. */
export type UpdatePersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyPatch = {
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
};

/** Input for the nested mutation of `contactAliasPersonContact` in the `PersonContactInput` mutation. */
export type ContactAliasPersonContactPersonContactIdFkeyInverseInput = {
  /** Flag indicating whether all other `contactAliasPersonContact` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  connectByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactContactAliasPersonContactPkeyConnect>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ContactAliasPersonContactNodeIdConnect>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  deleteByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactContactAliasPersonContactPkeyDelete>>;
  /** The primary key(s) for `contactAliasPersonContact` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ContactAliasPersonContactNodeIdDelete>>;
  /** The primary key(s) and patch data for `contactAliasPersonContact` for the far side of the relationship. */
  updateByAliasIdAndPersonContactId?: Maybe<Array<ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyUsingContactAliasPersonContactPkeyUpdate>>;
  /** The primary key(s) and patch data for `contactAliasPersonContact` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyNodeIdUpdate>>;
  /** A `ContactAliasPersonContactInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ContactAliasPersonContactPersonContactIdFkeyContactAliasPersonContactCreateInput>>;
};

/** The fields on `contactAliasPersonContact` to look up the row to update. */
export type ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyUsingContactAliasPersonContactPkeyUpdate = {
  /** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
  patch: UpdateContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyPatch;
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
};

/** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
export type UpdateContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyPatch = {
  aliasId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `contactAliasPersonContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
  patch: ContactAliasPersonContactPatch;
};

/** Represents an update to a `ContactAliasPersonContact`. Fields that are set will be updated. */
export type ContactAliasPersonContactPatch = {
  aliasId?: Maybe<Scalars['BigInt']>;
  personContactId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
};

/** The `contactAliasPersonContact` to be created by this mutation. */
export type ContactAliasPersonContactPersonContactIdFkeyContactAliasPersonContactCreateInput = {
  aliasId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type CountryOnShipperForShipperCountryIdFkeyNodeIdUpdate = {
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

/** Represents an update to a `Country`. Fields that are set will be updated. */
export type CountryPatch = {
  id?: Maybe<Scalars['String']>;
  countryName?: Maybe<Scalars['String']>;
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
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

/** The globally unique `ID` look up for the row to update. */
export type ShipperOnShipperForShipperCountryIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `country` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `country` being updated. */
  patch: CountryPatch;
};

/** The `country` to be created by this mutation. */
export type ShipperCountryIdFkeyCountryCreateInput = {
  id: Scalars['String'];
  countryName: Scalars['String'];
  warehousesUsingId?: Maybe<WarehouseCountryIdFkeyInverseInput>;
  customersUsingId?: Maybe<CustomerCountryIdFkeyInverseInput>;
  shippersUsingId?: Maybe<ShipperCountryIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type PersonContactOnPersonContactForPersonContactShipperIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `shipper` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `shipper` being updated. */
  patch: ShipperPatch;
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

/** The globally unique `ID` look up for the row to update. */
export type ContactAliasPersonContactOnContactAliasPersonContactForContactAliasPersonContactPersonContactIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `personContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `personContact` being updated. */
  patch: PersonContactPatch;
};

/** The `personContact` to be created by this mutation. */
export type ContactAliasPersonContactPersonContactIdFkeyPersonContactCreateInput = {
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ContactAliasOnContactAliasPersonContactForContactAliasPersonContactAliasIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `contactAliasPersonContact` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `contactAliasPersonContact` being updated. */
  patch: ContactAliasPersonContactPatch;
};

/** The `contactAliasPersonContact` to be created by this mutation. */
export type ContactAliasPersonContactAliasIdFkeyContactAliasPersonContactCreateInput = {
  personContactId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type UserOnContactAliasForContactAliasUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `contactAlias` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `contactAlias` being updated. */
  patch: ContactAliasPatch;
};

/** The `contactAlias` to be created by this mutation. */
export type ContactAliasUserIdFkeyContactAliasCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  aliasDescription: Scalars['String'];
  aliasName: Scalars['String'];
  userToUserId?: Maybe<ContactAliasUserIdFkeyInput>;
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactAliasIdFkeyInverseInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnContactAliasForContactAliasUserIdFkeyUsingUserPinKeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnContactAliasForContactAliasUserIdFkeyPatch;
  pin: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type ContactAliasOnContactAliasForContactAliasUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UserPatch;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  id?: Maybe<Scalars['BigInt']>;
  pin?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  contactAliasesUsingId?: Maybe<ContactAliasUserIdFkeyInverseInput>;
};

/** The `user` to be created by this mutation. */
export type ContactAliasUserIdFkeyUserCreateInput = {
  id?: Maybe<Scalars['BigInt']>;
  pin?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  contactAliasesUsingId?: Maybe<ContactAliasUserIdFkeyInverseInput>;
};

/** The output of our create `ContactAliasPersonContact` mutation. */
export type CreateContactAliasPersonContactPayload = {
  __typename?: 'CreateContactAliasPersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAliasPersonContact` that was created by this mutation. */
  contactAliasPersonContact?: Maybe<ContactAliasPersonContact>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ContactAlias` that is related to this `ContactAliasPersonContact`. */
  alias?: Maybe<ContactAlias>;
  /** Reads a single `PersonContact` that is related to this `ContactAliasPersonContact`. */
  personContact?: Maybe<PersonContact>;
  /** An edge for our `ContactAliasPersonContact`. May be used by Relay 1. */
  contactAliasPersonContactEdge?: Maybe<ContactAliasPersonContactsEdge>;
};


/** The output of our create `ContactAliasPersonContact` mutation. */
export type CreateContactAliasPersonContactPayloadContactAliasPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
};

/** All input for the create `ContactAliasPersonContact` mutation. */
export type CreateContactAliasPersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAliasPersonContact` to be created by this mutation. */
  contactAliasPersonContact: ContactAliasPersonContactInput;
};

/** An input for mutations affecting `ContactAliasPersonContact` */
export type ContactAliasPersonContactInput = {
  aliasId?: Maybe<Scalars['BigInt']>;
  personContactId?: Maybe<Scalars['BigInt']>;
  contactAliasToAliasId?: Maybe<ContactAliasPersonContactAliasIdFkeyInput>;
  personContactToPersonContactId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInput>;
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
  contactAliasPersonContactsUsingId?: Maybe<ContactAliasPersonContactPersonContactIdFkeyInverseInput>;
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

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  id?: Maybe<Scalars['BigInt']>;
  pin?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  contactAliasesUsingId?: Maybe<ContactAliasUserIdFkeyInverseInput>;
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

/** The output of our create `PsaArrivalPicture` mutation. */
export type CreatePsaArrivalPicturePayload = {
  __typename?: 'CreatePsaArrivalPicturePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalPicture` that was created by this mutation. */
  psaArrivalPicture?: Maybe<PsaArrivalPicture>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalPicture`. May be used by Relay 1. */
  psaArrivalPictureEdge?: Maybe<PsaArrivalPicturesEdge>;
};


/** The output of our create `PsaArrivalPicture` mutation. */
export type CreatePsaArrivalPicturePayloadPsaArrivalPictureEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalPicturesOrderBy>>;
};

/** All input for the create `PsaArrivalPicture` mutation. */
export type CreatePsaArrivalPictureInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalPicture` to be created by this mutation. */
  psaArrivalPicture: PsaArrivalPictureInput;
};

/** An input for mutations affecting `PsaArrivalPicture` */
export type PsaArrivalPictureInput = {
  id: Scalars['BigInt'];
  pictureDate?: Maybe<Scalars['Date']>;
  arrivalCode?: Maybe<Scalars['String']>;
  pictureDescription?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  palletId?: Maybe<Scalars['String']>;
  productCode?: Maybe<Scalars['String']>;
  varietyName?: Maybe<Scalars['String']>;
};

/** The output of our create `PsaArrivalReport` mutation. */
export type CreatePsaArrivalReportPayload = {
  __typename?: 'CreatePsaArrivalReportPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalReport` that was created by this mutation. */
  psaArrivalReport?: Maybe<PsaArrivalReport>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalReport`. May be used by Relay 1. */
  psaArrivalReportEdge?: Maybe<PsaArrivalReportsEdge>;
};


/** The output of our create `PsaArrivalReport` mutation. */
export type CreatePsaArrivalReportPayloadPsaArrivalReportEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalReportsOrderBy>>;
};

/** All input for the create `PsaArrivalReport` mutation. */
export type CreatePsaArrivalReportInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalReport` to be created by this mutation. */
  psaArrivalReport: PsaArrivalReportInput;
};

/** An input for mutations affecting `PsaArrivalReport` */
export type PsaArrivalReportInput = {
  id: Scalars['BigInt'];
  reportDate?: Maybe<Scalars['Date']>;
  locationName?: Maybe<Scalars['String']>;
  arrivalCode?: Maybe<Scalars['String']>;
  arrivalName?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  exporterName?: Maybe<Scalars['String']>;
};

/** The output of our create `Master` mutation. */
export type CreateMasterPayload = {
  __typename?: 'CreateMasterPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Master` that was created by this mutation. */
  master?: Maybe<Master>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Master`. May be used by Relay 1. */
  masterEdge?: Maybe<MastersEdge>;
};


/** The output of our create `Master` mutation. */
export type CreateMasterPayloadMasterEdgeArgs = {
  orderBy?: Maybe<Array<MastersOrderBy>>;
};

/** All input for the create `Master` mutation. */
export type CreateMasterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Master` to be created by this mutation. */
  master: MasterInput;
};

/** An input for mutations affecting `Master` */
export type MasterInput = {
  id: Scalars['String'];
  defaultPalletQuantity?: Maybe<Scalars['String']>;
  lotNumber?: Maybe<Scalars['String']>;
};

/** The output of our create `PackAtmosphere` mutation. */
export type CreatePackAtmospherePayload = {
  __typename?: 'CreatePackAtmospherePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackAtmosphere` that was created by this mutation. */
  packAtmosphere?: Maybe<PackAtmosphere>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackAtmosphere`. May be used by Relay 1. */
  packAtmosphereEdge?: Maybe<PackAtmospheresEdge>;
};


/** The output of our create `PackAtmosphere` mutation. */
export type CreatePackAtmospherePayloadPackAtmosphereEdgeArgs = {
  orderBy?: Maybe<Array<PackAtmospheresOrderBy>>;
};

/** All input for the create `PackAtmosphere` mutation. */
export type CreatePackAtmosphereInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackAtmosphere` to be created by this mutation. */
  packAtmosphere: PackAtmosphereInput;
};

/** An input for mutations affecting `PackAtmosphere` */
export type PackAtmosphereInput = {
  shipperId: Scalars['String'];
  maCode: Scalars['String'];
  maDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackBoxStyle` mutation. */
export type CreatePackBoxStylePayload = {
  __typename?: 'CreatePackBoxStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxStyle` that was created by this mutation. */
  packBoxStyle?: Maybe<PackBoxStyle>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxStyle`. May be used by Relay 1. */
  packBoxStyleEdge?: Maybe<PackBoxStylesEdge>;
};


/** The output of our create `PackBoxStyle` mutation. */
export type CreatePackBoxStylePayloadPackBoxStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxStylesOrderBy>>;
};

/** All input for the create `PackBoxStyle` mutation. */
export type CreatePackBoxStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxStyle` to be created by this mutation. */
  packBoxStyle: PackBoxStyleInput;
};

/** An input for mutations affecting `PackBoxStyle` */
export type PackBoxStyleInput = {
  shipperId: Scalars['String'];
  boxStyle: Scalars['String'];
  boxDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  combineDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackBoxType` mutation. */
export type CreatePackBoxTypePayload = {
  __typename?: 'CreatePackBoxTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxType` that was created by this mutation. */
  packBoxType?: Maybe<PackBoxType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxType`. May be used by Relay 1. */
  packBoxTypeEdge?: Maybe<PackBoxTypesEdge>;
};


/** The output of our create `PackBoxType` mutation. */
export type CreatePackBoxTypePayloadPackBoxTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxTypesOrderBy>>;
};

/** All input for the create `PackBoxType` mutation. */
export type CreatePackBoxTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxType` to be created by this mutation. */
  packBoxType: PackBoxTypeInput;
};

/** An input for mutations affecting `PackBoxType` */
export type PackBoxTypeInput = {
  shipperId: Scalars['String'];
  boxType: Scalars['String'];
  boxDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackDestination` mutation. */
export type CreatePackDestinationPayload = {
  __typename?: 'CreatePackDestinationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackDestination` that was created by this mutation. */
  packDestination?: Maybe<PackDestination>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackDestination`. May be used by Relay 1. */
  packDestinationEdge?: Maybe<PackDestinationsEdge>;
};


/** The output of our create `PackDestination` mutation. */
export type CreatePackDestinationPayloadPackDestinationEdgeArgs = {
  orderBy?: Maybe<Array<PackDestinationsOrderBy>>;
};

/** All input for the create `PackDestination` mutation. */
export type CreatePackDestinationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackDestination` to be created by this mutation. */
  packDestination: PackDestinationInput;
};

/** An input for mutations affecting `PackDestination` */
export type PackDestinationInput = {
  shipperId: Scalars['String'];
  destinationCode: Scalars['String'];
  destinationDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackGrade` mutation. */
export type CreatePackGradePayload = {
  __typename?: 'CreatePackGradePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackGrade` that was created by this mutation. */
  packGrade?: Maybe<PackGrade>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackGrade`. May be used by Relay 1. */
  packGradeEdge?: Maybe<PackGradesEdge>;
};


/** The output of our create `PackGrade` mutation. */
export type CreatePackGradePayloadPackGradeEdgeArgs = {
  orderBy?: Maybe<Array<PackGradesOrderBy>>;
};

/** All input for the create `PackGrade` mutation. */
export type CreatePackGradeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackGrade` to be created by this mutation. */
  packGrade: PackGradeInput;
};

/** An input for mutations affecting `PackGrade` */
export type PackGradeInput = {
  shipperId: Scalars['String'];
  gradeCode: Scalars['String'];
  gradeDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackHold` mutation. */
export type CreatePackHoldPayload = {
  __typename?: 'CreatePackHoldPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackHold` that was created by this mutation. */
  packHold?: Maybe<PackHold>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackHold`. May be used by Relay 1. */
  packHoldEdge?: Maybe<PackHoldsEdge>;
};


/** The output of our create `PackHold` mutation. */
export type CreatePackHoldPayloadPackHoldEdgeArgs = {
  orderBy?: Maybe<Array<PackHoldsOrderBy>>;
};

/** All input for the create `PackHold` mutation. */
export type CreatePackHoldInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackHold` to be created by this mutation. */
  packHold: PackHoldInput;
};

/** An input for mutations affecting `PackHold` */
export type PackHoldInput = {
  shipperId: Scalars['String'];
  holdCode: Scalars['String'];
  holdDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackLabel` mutation. */
export type CreatePackLabelPayload = {
  __typename?: 'CreatePackLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLabel` that was created by this mutation. */
  packLabel?: Maybe<PackLabel>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLabel`. May be used by Relay 1. */
  packLabelEdge?: Maybe<PackLabelsEdge>;
};


/** The output of our create `PackLabel` mutation. */
export type CreatePackLabelPayloadPackLabelEdgeArgs = {
  orderBy?: Maybe<Array<PackLabelsOrderBy>>;
};

/** All input for the create `PackLabel` mutation. */
export type CreatePackLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLabel` to be created by this mutation. */
  packLabel: PackLabelInput;
};

/** An input for mutations affecting `PackLabel` */
export type PackLabelInput = {
  labelCode: Scalars['String'];
  labelName?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  shipperName?: Maybe<Scalars['String']>;
};

/** The output of our create `PackLiner` mutation. */
export type CreatePackLinerPayload = {
  __typename?: 'CreatePackLinerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLiner` that was created by this mutation. */
  packLiner?: Maybe<PackLiner>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLiner`. May be used by Relay 1. */
  packLinerEdge?: Maybe<PackLinersEdge>;
};


/** The output of our create `PackLiner` mutation. */
export type CreatePackLinerPayloadPackLinerEdgeArgs = {
  orderBy?: Maybe<Array<PackLinersOrderBy>>;
};

/** All input for the create `PackLiner` mutation. */
export type CreatePackLinerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLiner` to be created by this mutation. */
  packLiner: PackLinerInput;
};

/** An input for mutations affecting `PackLiner` */
export type PackLinerInput = {
  shipperId: Scalars['String'];
  linerCode: Scalars['String'];
  linerDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `PackOut` mutation. */
export type CreatePackOutPayload = {
  __typename?: 'CreatePackOutPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackOut` that was created by this mutation. */
  packOut?: Maybe<PackOut>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackOut`. May be used by Relay 1. */
  packOutEdge?: Maybe<PackOutsEdge>;
};


/** The output of our create `PackOut` mutation. */
export type CreatePackOutPayloadPackOutEdgeArgs = {
  orderBy?: Maybe<Array<PackOutsOrderBy>>;
};

/** All input for the create `PackOut` mutation. */
export type CreatePackOutInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackOut` to be created by this mutation. */
  packOut: PackOutInput;
};

/** An input for mutations affecting `PackOut` */
export type PackOutInput = {
  shipperId: Scalars['String'];
  outCode: Scalars['String'];
  outDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** The output of our create `PackPalletType` mutation. */
export type CreatePackPalletTypePayload = {
  __typename?: 'CreatePackPalletTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackPalletType` that was created by this mutation. */
  packPalletType?: Maybe<PackPalletType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackPalletType`. May be used by Relay 1. */
  packPalletTypeEdge?: Maybe<PackPalletTypesEdge>;
};


/** The output of our create `PackPalletType` mutation. */
export type CreatePackPalletTypePayloadPackPalletTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackPalletTypesOrderBy>>;
};

/** All input for the create `PackPalletType` mutation. */
export type CreatePackPalletTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackPalletType` to be created by this mutation. */
  packPalletType: PackPalletTypeInput;
};

/** An input for mutations affecting `PackPalletType` */
export type PackPalletTypeInput = {
  shipperId: Scalars['String'];
  palletType: Scalars['String'];
  palletTypeDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** The output of our create `PackProduction` mutation. */
export type CreatePackProductionPayload = {
  __typename?: 'CreatePackProductionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackProduction` that was created by this mutation. */
  packProduction?: Maybe<PackProduction>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackProduction`. May be used by Relay 1. */
  packProductionEdge?: Maybe<PackProductionsEdge>;
};


/** The output of our create `PackProduction` mutation. */
export type CreatePackProductionPayloadPackProductionEdgeArgs = {
  orderBy?: Maybe<Array<PackProductionsOrderBy>>;
};

/** All input for the create `PackProduction` mutation. */
export type CreatePackProductionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackProduction` to be created by this mutation. */
  packProduction: PackProductionInput;
};

/** An input for mutations affecting `PackProduction` */
export type PackProductionInput = {
  shipperId: Scalars['String'];
  productionCode: Scalars['String'];
  productionDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** The output of our create `PackSpecial` mutation. */
export type CreatePackSpecialPayload = {
  __typename?: 'CreatePackSpecialPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackSpecial` that was created by this mutation. */
  packSpecial?: Maybe<PackSpecial>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackSpecial`. May be used by Relay 1. */
  packSpecialEdge?: Maybe<PackSpecialsEdge>;
};


/** The output of our create `PackSpecial` mutation. */
export type CreatePackSpecialPayloadPackSpecialEdgeArgs = {
  orderBy?: Maybe<Array<PackSpecialsOrderBy>>;
};

/** All input for the create `PackSpecial` mutation. */
export type CreatePackSpecialInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackSpecial` to be created by this mutation. */
  packSpecial: PackSpecialInput;
};

/** An input for mutations affecting `PackSpecial` */
export type PackSpecialInput = {
  shipperId: Scalars['String'];
  customerCode: Scalars['String'];
  customerId?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
};

/** The output of our create `PackStyle` mutation. */
export type CreatePackStylePayload = {
  __typename?: 'CreatePackStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackStyle` that was created by this mutation. */
  packStyle?: Maybe<PackStyle>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackStyle`. May be used by Relay 1. */
  packStyleEdge?: Maybe<PackStylesEdge>;
};


/** The output of our create `PackStyle` mutation. */
export type CreatePackStylePayloadPackStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackStylesOrderBy>>;
};

/** All input for the create `PackStyle` mutation. */
export type CreatePackStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackStyle` to be created by this mutation. */
  packStyle: PackStyleInput;
};

/** An input for mutations affecting `PackStyle` */
export type PackStyleInput = {
  shipperId: Scalars['String'];
  packStyle: Scalars['String'];
  styleDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** The output of our create `PackTreeRipe` mutation. */
export type CreatePackTreeRipePayload = {
  __typename?: 'CreatePackTreeRipePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackTreeRipe` that was created by this mutation. */
  packTreeRipe?: Maybe<PackTreeRipe>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackTreeRipe`. May be used by Relay 1. */
  packTreeRipeEdge?: Maybe<PackTreeRipesEdge>;
};


/** The output of our create `PackTreeRipe` mutation. */
export type CreatePackTreeRipePayloadPackTreeRipeEdgeArgs = {
  orderBy?: Maybe<Array<PackTreeRipesOrderBy>>;
};

/** All input for the create `PackTreeRipe` mutation. */
export type CreatePackTreeRipeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackTreeRipe` to be created by this mutation. */
  packTreeRipe: PackTreeRipeInput;
};

/** An input for mutations affecting `PackTreeRipe` */
export type PackTreeRipeInput = {
  shipperId: Scalars['String'];
  treeRipe: Scalars['String'];
  treeRipeDescription?: Maybe<Scalars['String']>;
};

/** The output of our create `Size` mutation. */
export type CreateSizePayload = {
  __typename?: 'CreateSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Size` that was created by this mutation. */
  size?: Maybe<Size>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Size`. May be used by Relay 1. */
  sizeEdge?: Maybe<SizesEdge>;
};


/** The output of our create `Size` mutation. */
export type CreateSizePayloadSizeEdgeArgs = {
  orderBy?: Maybe<Array<SizesOrderBy>>;
};

/** All input for the create `Size` mutation. */
export type CreateSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Size` to be created by this mutation. */
  size: SizeInput;
};

/** An input for mutations affecting `Size` */
export type SizeInput = {
  id?: Maybe<Scalars['BigInt']>;
  speciesId?: Maybe<Scalars['String']>;
  varietyId?: Maybe<Scalars['String']>;
  jvCode?: Maybe<Scalars['String']>;
  jvDescription?: Maybe<Scalars['String']>;
  shipperCode?: Maybe<Scalars['String']>;
  shipperDescription?: Maybe<Scalars['String']>;
  combinedCode?: Maybe<Scalars['String']>;
  combinedDescription?: Maybe<Scalars['String']>;
  shipperId?: Maybe<Scalars['String']>;
};

/** The output of our create `Species` mutation. */
export type CreateSpeciesPayload = {
  __typename?: 'CreateSpeciesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Species` that was created by this mutation. */
  species?: Maybe<Species>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Species`. May be used by Relay 1. */
  speciesEdge?: Maybe<SpeciesEdge>;
};


/** The output of our create `Species` mutation. */
export type CreateSpeciesPayloadSpeciesEdgeArgs = {
  orderBy?: Maybe<Array<SpeciesOrderBy>>;
};

/** All input for the create `Species` mutation. */
export type CreateSpeciesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Species` to be created by this mutation. */
  species: SpeciesInput;
};

/** An input for mutations affecting `Species` */
export type SpeciesInput = {
  id: Scalars['String'];
  speciesDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  fdaProductCode?: Maybe<Scalars['String']>;
  fdaIndustryCode?: Maybe<Scalars['String']>;
  defaultTemperature?: Maybe<Scalars['String']>;
};

/** The output of our create `Variety` mutation. */
export type CreateVarietyPayload = {
  __typename?: 'CreateVarietyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Variety` that was created by this mutation. */
  variety?: Maybe<Variety>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Variety`. May be used by Relay 1. */
  varietyEdge?: Maybe<VarietiesEdge>;
};


/** The output of our create `Variety` mutation. */
export type CreateVarietyPayloadVarietyEdgeArgs = {
  orderBy?: Maybe<Array<VarietiesOrderBy>>;
};

/** All input for the create `Variety` mutation. */
export type CreateVarietyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Variety` to be created by this mutation. */
  variety: VarietyInput;
};

/** An input for mutations affecting `Variety` */
export type VarietyInput = {
  id: Scalars['String'];
  varietyDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  customerLetterSequence?: Maybe<Scalars['String']>;
  summaryCode?: Maybe<Scalars['String']>;
  varietyGroup?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** The output of our update `ContactAlias` mutation. */
export type UpdateContactAliasPayload = {
  __typename?: 'UpdateContactAliasPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAlias` that was updated by this mutation. */
  contactAlias?: Maybe<ContactAlias>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ContactAlias`. */
  user?: Maybe<User>;
  /** An edge for our `ContactAlias`. May be used by Relay 1. */
  contactAliasEdge?: Maybe<ContactAliasesEdge>;
};


/** The output of our update `ContactAlias` mutation. */
export type UpdateContactAliasPayloadContactAliasEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
};

/** All input for the `updateContactAliasByNodeId` mutation. */
export type UpdateContactAliasByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ContactAlias` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ContactAlias` being updated. */
  patch: ContactAliasPatch;
};

/** All input for the `updateContactAlias` mutation. */
export type UpdateContactAliasInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ContactAlias` being updated. */
  patch: ContactAliasPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `ContactAliasPersonContact` mutation. */
export type UpdateContactAliasPersonContactPayload = {
  __typename?: 'UpdateContactAliasPersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAliasPersonContact` that was updated by this mutation. */
  contactAliasPersonContact?: Maybe<ContactAliasPersonContact>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ContactAlias` that is related to this `ContactAliasPersonContact`. */
  alias?: Maybe<ContactAlias>;
  /** Reads a single `PersonContact` that is related to this `ContactAliasPersonContact`. */
  personContact?: Maybe<PersonContact>;
  /** An edge for our `ContactAliasPersonContact`. May be used by Relay 1. */
  contactAliasPersonContactEdge?: Maybe<ContactAliasPersonContactsEdge>;
};


/** The output of our update `ContactAliasPersonContact` mutation. */
export type UpdateContactAliasPersonContactPayloadContactAliasPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
};

/** All input for the `updateContactAliasPersonContactByNodeId` mutation. */
export type UpdateContactAliasPersonContactByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ContactAliasPersonContact` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ContactAliasPersonContact` being updated. */
  patch: ContactAliasPersonContactPatch;
};

/** All input for the `updateContactAliasPersonContact` mutation. */
export type UpdateContactAliasPersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ContactAliasPersonContact` being updated. */
  patch: ContactAliasPersonContactPatch;
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
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

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the `updateUserByNodeId` mutation. */
export type UpdateUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateUserByPin` mutation. */
export type UpdateUserByPinInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  pin: Scalars['String'];
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

/** The output of our update `PsaArrivalPicture` mutation. */
export type UpdatePsaArrivalPicturePayload = {
  __typename?: 'UpdatePsaArrivalPicturePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalPicture` that was updated by this mutation. */
  psaArrivalPicture?: Maybe<PsaArrivalPicture>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalPicture`. May be used by Relay 1. */
  psaArrivalPictureEdge?: Maybe<PsaArrivalPicturesEdge>;
};


/** The output of our update `PsaArrivalPicture` mutation. */
export type UpdatePsaArrivalPicturePayloadPsaArrivalPictureEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalPicturesOrderBy>>;
};

/** All input for the `updatePsaArrivalPictureByNodeId` mutation. */
export type UpdatePsaArrivalPictureByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PsaArrivalPicture` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PsaArrivalPicture` being updated. */
  patch: PsaArrivalPicturePatch;
};

/** Represents an update to a `PsaArrivalPicture`. Fields that are set will be updated. */
export type PsaArrivalPicturePatch = {
  id?: Maybe<Scalars['BigInt']>;
  pictureDate?: Maybe<Scalars['Date']>;
  arrivalCode?: Maybe<Scalars['String']>;
  pictureDescription?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  palletId?: Maybe<Scalars['String']>;
  productCode?: Maybe<Scalars['String']>;
  varietyName?: Maybe<Scalars['String']>;
};

/** All input for the `updatePsaArrivalPicture` mutation. */
export type UpdatePsaArrivalPictureInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PsaArrivalPicture` being updated. */
  patch: PsaArrivalPicturePatch;
  id: Scalars['BigInt'];
};

/** The output of our update `PsaArrivalReport` mutation. */
export type UpdatePsaArrivalReportPayload = {
  __typename?: 'UpdatePsaArrivalReportPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalReport` that was updated by this mutation. */
  psaArrivalReport?: Maybe<PsaArrivalReport>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalReport`. May be used by Relay 1. */
  psaArrivalReportEdge?: Maybe<PsaArrivalReportsEdge>;
};


/** The output of our update `PsaArrivalReport` mutation. */
export type UpdatePsaArrivalReportPayloadPsaArrivalReportEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalReportsOrderBy>>;
};

/** All input for the `updatePsaArrivalReportByNodeId` mutation. */
export type UpdatePsaArrivalReportByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PsaArrivalReport` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PsaArrivalReport` being updated. */
  patch: PsaArrivalReportPatch;
};

/** Represents an update to a `PsaArrivalReport`. Fields that are set will be updated. */
export type PsaArrivalReportPatch = {
  id?: Maybe<Scalars['BigInt']>;
  reportDate?: Maybe<Scalars['Date']>;
  locationName?: Maybe<Scalars['String']>;
  arrivalCode?: Maybe<Scalars['String']>;
  arrivalName?: Maybe<Scalars['String']>;
  exporterId?: Maybe<Scalars['BigInt']>;
  exporterName?: Maybe<Scalars['String']>;
};

/** All input for the `updatePsaArrivalReport` mutation. */
export type UpdatePsaArrivalReportInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PsaArrivalReport` being updated. */
  patch: PsaArrivalReportPatch;
  id: Scalars['BigInt'];
};

/** The output of our update `Master` mutation. */
export type UpdateMasterPayload = {
  __typename?: 'UpdateMasterPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Master` that was updated by this mutation. */
  master?: Maybe<Master>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Master`. May be used by Relay 1. */
  masterEdge?: Maybe<MastersEdge>;
};


/** The output of our update `Master` mutation. */
export type UpdateMasterPayloadMasterEdgeArgs = {
  orderBy?: Maybe<Array<MastersOrderBy>>;
};

/** All input for the `updateMasterByNodeId` mutation. */
export type UpdateMasterByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Master` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Master` being updated. */
  patch: MasterPatch;
};

/** Represents an update to a `Master`. Fields that are set will be updated. */
export type MasterPatch = {
  id?: Maybe<Scalars['String']>;
  defaultPalletQuantity?: Maybe<Scalars['String']>;
  lotNumber?: Maybe<Scalars['String']>;
};

/** All input for the `updateMaster` mutation. */
export type UpdateMasterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Master` being updated. */
  patch: MasterPatch;
  id: Scalars['String'];
};

/** The output of our update `PackAtmosphere` mutation. */
export type UpdatePackAtmospherePayload = {
  __typename?: 'UpdatePackAtmospherePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackAtmosphere` that was updated by this mutation. */
  packAtmosphere?: Maybe<PackAtmosphere>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackAtmosphere`. May be used by Relay 1. */
  packAtmosphereEdge?: Maybe<PackAtmospheresEdge>;
};


/** The output of our update `PackAtmosphere` mutation. */
export type UpdatePackAtmospherePayloadPackAtmosphereEdgeArgs = {
  orderBy?: Maybe<Array<PackAtmospheresOrderBy>>;
};

/** All input for the `updatePackAtmosphereByNodeId` mutation. */
export type UpdatePackAtmosphereByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackAtmosphere` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackAtmosphere` being updated. */
  patch: PackAtmospherePatch;
};

/** Represents an update to a `PackAtmosphere`. Fields that are set will be updated. */
export type PackAtmospherePatch = {
  shipperId?: Maybe<Scalars['String']>;
  maCode?: Maybe<Scalars['String']>;
  maDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackAtmosphere` mutation. */
export type UpdatePackAtmosphereInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackAtmosphere` being updated. */
  patch: PackAtmospherePatch;
  shipperId: Scalars['String'];
  maCode: Scalars['String'];
};

/** The output of our update `PackBoxStyle` mutation. */
export type UpdatePackBoxStylePayload = {
  __typename?: 'UpdatePackBoxStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxStyle` that was updated by this mutation. */
  packBoxStyle?: Maybe<PackBoxStyle>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxStyle`. May be used by Relay 1. */
  packBoxStyleEdge?: Maybe<PackBoxStylesEdge>;
};


/** The output of our update `PackBoxStyle` mutation. */
export type UpdatePackBoxStylePayloadPackBoxStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxStylesOrderBy>>;
};

/** All input for the `updatePackBoxStyleByNodeId` mutation. */
export type UpdatePackBoxStyleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackBoxStyle` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackBoxStyle` being updated. */
  patch: PackBoxStylePatch;
};

/** Represents an update to a `PackBoxStyle`. Fields that are set will be updated. */
export type PackBoxStylePatch = {
  shipperId?: Maybe<Scalars['String']>;
  boxStyle?: Maybe<Scalars['String']>;
  boxDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
  combineDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackBoxStyle` mutation. */
export type UpdatePackBoxStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackBoxStyle` being updated. */
  patch: PackBoxStylePatch;
  shipperId: Scalars['String'];
  boxStyle: Scalars['String'];
};

/** The output of our update `PackBoxType` mutation. */
export type UpdatePackBoxTypePayload = {
  __typename?: 'UpdatePackBoxTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxType` that was updated by this mutation. */
  packBoxType?: Maybe<PackBoxType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxType`. May be used by Relay 1. */
  packBoxTypeEdge?: Maybe<PackBoxTypesEdge>;
};


/** The output of our update `PackBoxType` mutation. */
export type UpdatePackBoxTypePayloadPackBoxTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxTypesOrderBy>>;
};

/** All input for the `updatePackBoxTypeByNodeId` mutation. */
export type UpdatePackBoxTypeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackBoxType` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackBoxType` being updated. */
  patch: PackBoxTypePatch;
};

/** Represents an update to a `PackBoxType`. Fields that are set will be updated. */
export type PackBoxTypePatch = {
  shipperId?: Maybe<Scalars['String']>;
  boxType?: Maybe<Scalars['String']>;
  boxDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackBoxType` mutation. */
export type UpdatePackBoxTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackBoxType` being updated. */
  patch: PackBoxTypePatch;
  shipperId: Scalars['String'];
  boxType: Scalars['String'];
};

/** The output of our update `PackDestination` mutation. */
export type UpdatePackDestinationPayload = {
  __typename?: 'UpdatePackDestinationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackDestination` that was updated by this mutation. */
  packDestination?: Maybe<PackDestination>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackDestination`. May be used by Relay 1. */
  packDestinationEdge?: Maybe<PackDestinationsEdge>;
};


/** The output of our update `PackDestination` mutation. */
export type UpdatePackDestinationPayloadPackDestinationEdgeArgs = {
  orderBy?: Maybe<Array<PackDestinationsOrderBy>>;
};

/** All input for the `updatePackDestinationByNodeId` mutation. */
export type UpdatePackDestinationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackDestination` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackDestination` being updated. */
  patch: PackDestinationPatch;
};

/** Represents an update to a `PackDestination`. Fields that are set will be updated. */
export type PackDestinationPatch = {
  shipperId?: Maybe<Scalars['String']>;
  destinationCode?: Maybe<Scalars['String']>;
  destinationDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackDestination` mutation. */
export type UpdatePackDestinationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackDestination` being updated. */
  patch: PackDestinationPatch;
  shipperId: Scalars['String'];
  destinationCode: Scalars['String'];
};

/** The output of our update `PackGrade` mutation. */
export type UpdatePackGradePayload = {
  __typename?: 'UpdatePackGradePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackGrade` that was updated by this mutation. */
  packGrade?: Maybe<PackGrade>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackGrade`. May be used by Relay 1. */
  packGradeEdge?: Maybe<PackGradesEdge>;
};


/** The output of our update `PackGrade` mutation. */
export type UpdatePackGradePayloadPackGradeEdgeArgs = {
  orderBy?: Maybe<Array<PackGradesOrderBy>>;
};

/** All input for the `updatePackGradeByNodeId` mutation. */
export type UpdatePackGradeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackGrade` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackGrade` being updated. */
  patch: PackGradePatch;
};

/** Represents an update to a `PackGrade`. Fields that are set will be updated. */
export type PackGradePatch = {
  shipperId?: Maybe<Scalars['String']>;
  gradeCode?: Maybe<Scalars['String']>;
  gradeDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackGrade` mutation. */
export type UpdatePackGradeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackGrade` being updated. */
  patch: PackGradePatch;
  shipperId: Scalars['String'];
  gradeCode: Scalars['String'];
};

/** The output of our update `PackHold` mutation. */
export type UpdatePackHoldPayload = {
  __typename?: 'UpdatePackHoldPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackHold` that was updated by this mutation. */
  packHold?: Maybe<PackHold>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackHold`. May be used by Relay 1. */
  packHoldEdge?: Maybe<PackHoldsEdge>;
};


/** The output of our update `PackHold` mutation. */
export type UpdatePackHoldPayloadPackHoldEdgeArgs = {
  orderBy?: Maybe<Array<PackHoldsOrderBy>>;
};

/** All input for the `updatePackHoldByNodeId` mutation. */
export type UpdatePackHoldByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackHold` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackHold` being updated. */
  patch: PackHoldPatch;
};

/** Represents an update to a `PackHold`. Fields that are set will be updated. */
export type PackHoldPatch = {
  shipperId?: Maybe<Scalars['String']>;
  holdCode?: Maybe<Scalars['String']>;
  holdDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackHold` mutation. */
export type UpdatePackHoldInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackHold` being updated. */
  patch: PackHoldPatch;
  shipperId: Scalars['String'];
  holdCode: Scalars['String'];
};

/** The output of our update `PackLabel` mutation. */
export type UpdatePackLabelPayload = {
  __typename?: 'UpdatePackLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLabel` that was updated by this mutation. */
  packLabel?: Maybe<PackLabel>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLabel`. May be used by Relay 1. */
  packLabelEdge?: Maybe<PackLabelsEdge>;
};


/** The output of our update `PackLabel` mutation. */
export type UpdatePackLabelPayloadPackLabelEdgeArgs = {
  orderBy?: Maybe<Array<PackLabelsOrderBy>>;
};

/** All input for the `updatePackLabelByNodeId` mutation. */
export type UpdatePackLabelByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackLabel` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackLabel` being updated. */
  patch: PackLabelPatch;
};

/** Represents an update to a `PackLabel`. Fields that are set will be updated. */
export type PackLabelPatch = {
  labelCode?: Maybe<Scalars['String']>;
  labelName?: Maybe<Scalars['String']>;
  shipperId?: Maybe<Scalars['String']>;
  shipperName?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackLabel` mutation. */
export type UpdatePackLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackLabel` being updated. */
  patch: PackLabelPatch;
  shipperId: Scalars['String'];
  labelCode: Scalars['String'];
};

/** The output of our update `PackLiner` mutation. */
export type UpdatePackLinerPayload = {
  __typename?: 'UpdatePackLinerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLiner` that was updated by this mutation. */
  packLiner?: Maybe<PackLiner>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLiner`. May be used by Relay 1. */
  packLinerEdge?: Maybe<PackLinersEdge>;
};


/** The output of our update `PackLiner` mutation. */
export type UpdatePackLinerPayloadPackLinerEdgeArgs = {
  orderBy?: Maybe<Array<PackLinersOrderBy>>;
};

/** All input for the `updatePackLinerByNodeId` mutation. */
export type UpdatePackLinerByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackLiner` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackLiner` being updated. */
  patch: PackLinerPatch;
};

/** Represents an update to a `PackLiner`. Fields that are set will be updated. */
export type PackLinerPatch = {
  shipperId?: Maybe<Scalars['String']>;
  linerCode?: Maybe<Scalars['String']>;
  linerDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackLiner` mutation. */
export type UpdatePackLinerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackLiner` being updated. */
  patch: PackLinerPatch;
  shipperId: Scalars['String'];
  linerCode: Scalars['String'];
};

/** The output of our update `PackOut` mutation. */
export type UpdatePackOutPayload = {
  __typename?: 'UpdatePackOutPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackOut` that was updated by this mutation. */
  packOut?: Maybe<PackOut>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackOut`. May be used by Relay 1. */
  packOutEdge?: Maybe<PackOutsEdge>;
};


/** The output of our update `PackOut` mutation. */
export type UpdatePackOutPayloadPackOutEdgeArgs = {
  orderBy?: Maybe<Array<PackOutsOrderBy>>;
};

/** All input for the `updatePackOutByNodeId` mutation. */
export type UpdatePackOutByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackOut` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackOut` being updated. */
  patch: PackOutPatch;
};

/** Represents an update to a `PackOut`. Fields that are set will be updated. */
export type PackOutPatch = {
  shipperId?: Maybe<Scalars['String']>;
  outCode?: Maybe<Scalars['String']>;
  outDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackOut` mutation. */
export type UpdatePackOutInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackOut` being updated. */
  patch: PackOutPatch;
  shipperId: Scalars['String'];
  outCode: Scalars['String'];
};

/** The output of our update `PackPalletType` mutation. */
export type UpdatePackPalletTypePayload = {
  __typename?: 'UpdatePackPalletTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackPalletType` that was updated by this mutation. */
  packPalletType?: Maybe<PackPalletType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackPalletType`. May be used by Relay 1. */
  packPalletTypeEdge?: Maybe<PackPalletTypesEdge>;
};


/** The output of our update `PackPalletType` mutation. */
export type UpdatePackPalletTypePayloadPackPalletTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackPalletTypesOrderBy>>;
};

/** All input for the `updatePackPalletTypeByNodeId` mutation. */
export type UpdatePackPalletTypeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackPalletType` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackPalletType` being updated. */
  patch: PackPalletTypePatch;
};

/** Represents an update to a `PackPalletType`. Fields that are set will be updated. */
export type PackPalletTypePatch = {
  shipperId?: Maybe<Scalars['String']>;
  palletType?: Maybe<Scalars['String']>;
  palletTypeDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackPalletType` mutation. */
export type UpdatePackPalletTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackPalletType` being updated. */
  patch: PackPalletTypePatch;
  shipperId: Scalars['String'];
  palletType: Scalars['String'];
};

/** The output of our update `PackProduction` mutation. */
export type UpdatePackProductionPayload = {
  __typename?: 'UpdatePackProductionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackProduction` that was updated by this mutation. */
  packProduction?: Maybe<PackProduction>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackProduction`. May be used by Relay 1. */
  packProductionEdge?: Maybe<PackProductionsEdge>;
};


/** The output of our update `PackProduction` mutation. */
export type UpdatePackProductionPayloadPackProductionEdgeArgs = {
  orderBy?: Maybe<Array<PackProductionsOrderBy>>;
};

/** All input for the `updatePackProductionByNodeId` mutation. */
export type UpdatePackProductionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackProduction` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackProduction` being updated. */
  patch: PackProductionPatch;
};

/** Represents an update to a `PackProduction`. Fields that are set will be updated. */
export type PackProductionPatch = {
  shipperId?: Maybe<Scalars['String']>;
  productionCode?: Maybe<Scalars['String']>;
  productionDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackProduction` mutation. */
export type UpdatePackProductionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackProduction` being updated. */
  patch: PackProductionPatch;
  shipperId: Scalars['String'];
  productionCode: Scalars['String'];
};

/** The output of our update `PackSpecial` mutation. */
export type UpdatePackSpecialPayload = {
  __typename?: 'UpdatePackSpecialPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackSpecial` that was updated by this mutation. */
  packSpecial?: Maybe<PackSpecial>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackSpecial`. May be used by Relay 1. */
  packSpecialEdge?: Maybe<PackSpecialsEdge>;
};


/** The output of our update `PackSpecial` mutation. */
export type UpdatePackSpecialPayloadPackSpecialEdgeArgs = {
  orderBy?: Maybe<Array<PackSpecialsOrderBy>>;
};

/** All input for the `updatePackSpecialByNodeId` mutation. */
export type UpdatePackSpecialByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackSpecial` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackSpecial` being updated. */
  patch: PackSpecialPatch;
};

/** Represents an update to a `PackSpecial`. Fields that are set will be updated. */
export type PackSpecialPatch = {
  shipperId?: Maybe<Scalars['String']>;
  customerCode?: Maybe<Scalars['String']>;
  customerId?: Maybe<Scalars['String']>;
  customerName?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackSpecial` mutation. */
export type UpdatePackSpecialInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackSpecial` being updated. */
  patch: PackSpecialPatch;
  shipperId: Scalars['String'];
  customerCode: Scalars['String'];
};

/** The output of our update `PackStyle` mutation. */
export type UpdatePackStylePayload = {
  __typename?: 'UpdatePackStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackStyle` that was updated by this mutation. */
  packStyle?: Maybe<PackStyle>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackStyle`. May be used by Relay 1. */
  packStyleEdge?: Maybe<PackStylesEdge>;
};


/** The output of our update `PackStyle` mutation. */
export type UpdatePackStylePayloadPackStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackStylesOrderBy>>;
};

/** All input for the `updatePackStyleByNodeId` mutation. */
export type UpdatePackStyleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackStyle` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackStyle` being updated. */
  patch: PackStylePatch;
};

/** Represents an update to a `PackStyle`. Fields that are set will be updated. */
export type PackStylePatch = {
  shipperId?: Maybe<Scalars['String']>;
  packStyle?: Maybe<Scalars['String']>;
  styleDescription?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackStyle` mutation. */
export type UpdatePackStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackStyle` being updated. */
  patch: PackStylePatch;
  shipperId: Scalars['String'];
  packStyle: Scalars['String'];
};

/** The output of our update `PackTreeRipe` mutation. */
export type UpdatePackTreeRipePayload = {
  __typename?: 'UpdatePackTreeRipePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackTreeRipe` that was updated by this mutation. */
  packTreeRipe?: Maybe<PackTreeRipe>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackTreeRipe`. May be used by Relay 1. */
  packTreeRipeEdge?: Maybe<PackTreeRipesEdge>;
};


/** The output of our update `PackTreeRipe` mutation. */
export type UpdatePackTreeRipePayloadPackTreeRipeEdgeArgs = {
  orderBy?: Maybe<Array<PackTreeRipesOrderBy>>;
};

/** All input for the `updatePackTreeRipeByNodeId` mutation. */
export type UpdatePackTreeRipeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackTreeRipe` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PackTreeRipe` being updated. */
  patch: PackTreeRipePatch;
};

/** Represents an update to a `PackTreeRipe`. Fields that are set will be updated. */
export type PackTreeRipePatch = {
  shipperId?: Maybe<Scalars['String']>;
  treeRipe?: Maybe<Scalars['String']>;
  treeRipeDescription?: Maybe<Scalars['String']>;
};

/** All input for the `updatePackTreeRipe` mutation. */
export type UpdatePackTreeRipeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PackTreeRipe` being updated. */
  patch: PackTreeRipePatch;
  shipperId: Scalars['String'];
  treeRipe: Scalars['String'];
};

/** The output of our update `Size` mutation. */
export type UpdateSizePayload = {
  __typename?: 'UpdateSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Size` that was updated by this mutation. */
  size?: Maybe<Size>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Size`. May be used by Relay 1. */
  sizeEdge?: Maybe<SizesEdge>;
};


/** The output of our update `Size` mutation. */
export type UpdateSizePayloadSizeEdgeArgs = {
  orderBy?: Maybe<Array<SizesOrderBy>>;
};

/** All input for the `updateSizeByNodeId` mutation. */
export type UpdateSizeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Size` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Size` being updated. */
  patch: SizePatch;
};

/** Represents an update to a `Size`. Fields that are set will be updated. */
export type SizePatch = {
  id?: Maybe<Scalars['BigInt']>;
  speciesId?: Maybe<Scalars['String']>;
  varietyId?: Maybe<Scalars['String']>;
  jvCode?: Maybe<Scalars['String']>;
  jvDescription?: Maybe<Scalars['String']>;
  shipperCode?: Maybe<Scalars['String']>;
  shipperDescription?: Maybe<Scalars['String']>;
  combinedCode?: Maybe<Scalars['String']>;
  combinedDescription?: Maybe<Scalars['String']>;
  shipperId?: Maybe<Scalars['String']>;
};

/** All input for the `updateSize` mutation. */
export type UpdateSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Size` being updated. */
  patch: SizePatch;
  id: Scalars['BigInt'];
};

/** The output of our update `Species` mutation. */
export type UpdateSpeciesPayload = {
  __typename?: 'UpdateSpeciesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Species` that was updated by this mutation. */
  species?: Maybe<Species>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Species`. May be used by Relay 1. */
  speciesEdge?: Maybe<SpeciesEdge>;
};


/** The output of our update `Species` mutation. */
export type UpdateSpeciesPayloadSpeciesEdgeArgs = {
  orderBy?: Maybe<Array<SpeciesOrderBy>>;
};

/** All input for the `updateSpeciesByNodeId` mutation. */
export type UpdateSpeciesByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Species` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Species` being updated. */
  patch: SpeciesPatch;
};

/** Represents an update to a `Species`. Fields that are set will be updated. */
export type SpeciesPatch = {
  id?: Maybe<Scalars['String']>;
  speciesDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  fdaProductCode?: Maybe<Scalars['String']>;
  fdaIndustryCode?: Maybe<Scalars['String']>;
  defaultTemperature?: Maybe<Scalars['String']>;
};

/** All input for the `updateSpecies` mutation. */
export type UpdateSpeciesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Species` being updated. */
  patch: SpeciesPatch;
  id: Scalars['String'];
};

/** The output of our update `Variety` mutation. */
export type UpdateVarietyPayload = {
  __typename?: 'UpdateVarietyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Variety` that was updated by this mutation. */
  variety?: Maybe<Variety>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Variety`. May be used by Relay 1. */
  varietyEdge?: Maybe<VarietiesEdge>;
};


/** The output of our update `Variety` mutation. */
export type UpdateVarietyPayloadVarietyEdgeArgs = {
  orderBy?: Maybe<Array<VarietiesOrderBy>>;
};

/** All input for the `updateVarietyByNodeId` mutation. */
export type UpdateVarietyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Variety` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Variety` being updated. */
  patch: VarietyPatch;
};

/** Represents an update to a `Variety`. Fields that are set will be updated. */
export type VarietyPatch = {
  id?: Maybe<Scalars['String']>;
  varietyDescription?: Maybe<Scalars['String']>;
  secondaryDescription?: Maybe<Scalars['String']>;
  customerLetterSequence?: Maybe<Scalars['String']>;
  summaryCode?: Maybe<Scalars['String']>;
  varietyGroup?: Maybe<Scalars['String']>;
  combineWith?: Maybe<Scalars['String']>;
};

/** All input for the `updateVariety` mutation. */
export type UpdateVarietyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Variety` being updated. */
  patch: VarietyPatch;
  id: Scalars['String'];
};

/** The output of our delete `ContactAlias` mutation. */
export type DeleteContactAliasPayload = {
  __typename?: 'DeleteContactAliasPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAlias` that was deleted by this mutation. */
  contactAlias?: Maybe<ContactAlias>;
  deletedContactAliasNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ContactAlias`. */
  user?: Maybe<User>;
  /** An edge for our `ContactAlias`. May be used by Relay 1. */
  contactAliasEdge?: Maybe<ContactAliasesEdge>;
};


/** The output of our delete `ContactAlias` mutation. */
export type DeleteContactAliasPayloadContactAliasEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasesOrderBy>>;
};

/** All input for the `deleteContactAliasByNodeId` mutation. */
export type DeleteContactAliasByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ContactAlias` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteContactAlias` mutation. */
export type DeleteContactAliasInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `ContactAliasPersonContact` mutation. */
export type DeleteContactAliasPersonContactPayload = {
  __typename?: 'DeleteContactAliasPersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ContactAliasPersonContact` that was deleted by this mutation. */
  contactAliasPersonContact?: Maybe<ContactAliasPersonContact>;
  deletedContactAliasPersonContactNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ContactAlias` that is related to this `ContactAliasPersonContact`. */
  alias?: Maybe<ContactAlias>;
  /** Reads a single `PersonContact` that is related to this `ContactAliasPersonContact`. */
  personContact?: Maybe<PersonContact>;
  /** An edge for our `ContactAliasPersonContact`. May be used by Relay 1. */
  contactAliasPersonContactEdge?: Maybe<ContactAliasPersonContactsEdge>;
};


/** The output of our delete `ContactAliasPersonContact` mutation. */
export type DeleteContactAliasPersonContactPayloadContactAliasPersonContactEdgeArgs = {
  orderBy?: Maybe<Array<ContactAliasPersonContactsOrderBy>>;
};

/** All input for the `deleteContactAliasPersonContactByNodeId` mutation. */
export type DeleteContactAliasPersonContactByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ContactAliasPersonContact` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteContactAliasPersonContact` mutation. */
export type DeleteContactAliasPersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  aliasId: Scalars['BigInt'];
  personContactId: Scalars['BigInt'];
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

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  deletedUserNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteUserByNodeId` mutation. */
export type DeleteUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteUserByPin` mutation. */
export type DeleteUserByPinInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  pin: Scalars['String'];
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

/** The output of our delete `PsaArrivalPicture` mutation. */
export type DeletePsaArrivalPicturePayload = {
  __typename?: 'DeletePsaArrivalPicturePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalPicture` that was deleted by this mutation. */
  psaArrivalPicture?: Maybe<PsaArrivalPicture>;
  deletedPsaArrivalPictureNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalPicture`. May be used by Relay 1. */
  psaArrivalPictureEdge?: Maybe<PsaArrivalPicturesEdge>;
};


/** The output of our delete `PsaArrivalPicture` mutation. */
export type DeletePsaArrivalPicturePayloadPsaArrivalPictureEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalPicturesOrderBy>>;
};

/** All input for the `deletePsaArrivalPictureByNodeId` mutation. */
export type DeletePsaArrivalPictureByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PsaArrivalPicture` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePsaArrivalPicture` mutation. */
export type DeletePsaArrivalPictureInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `PsaArrivalReport` mutation. */
export type DeletePsaArrivalReportPayload = {
  __typename?: 'DeletePsaArrivalReportPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PsaArrivalReport` that was deleted by this mutation. */
  psaArrivalReport?: Maybe<PsaArrivalReport>;
  deletedPsaArrivalReportNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PsaArrivalReport`. May be used by Relay 1. */
  psaArrivalReportEdge?: Maybe<PsaArrivalReportsEdge>;
};


/** The output of our delete `PsaArrivalReport` mutation. */
export type DeletePsaArrivalReportPayloadPsaArrivalReportEdgeArgs = {
  orderBy?: Maybe<Array<PsaArrivalReportsOrderBy>>;
};

/** All input for the `deletePsaArrivalReportByNodeId` mutation. */
export type DeletePsaArrivalReportByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PsaArrivalReport` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePsaArrivalReport` mutation. */
export type DeletePsaArrivalReportInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `Master` mutation. */
export type DeleteMasterPayload = {
  __typename?: 'DeleteMasterPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Master` that was deleted by this mutation. */
  master?: Maybe<Master>;
  deletedMasterNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Master`. May be used by Relay 1. */
  masterEdge?: Maybe<MastersEdge>;
};


/** The output of our delete `Master` mutation. */
export type DeleteMasterPayloadMasterEdgeArgs = {
  orderBy?: Maybe<Array<MastersOrderBy>>;
};

/** All input for the `deleteMasterByNodeId` mutation. */
export type DeleteMasterByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Master` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteMaster` mutation. */
export type DeleteMasterInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `PackAtmosphere` mutation. */
export type DeletePackAtmospherePayload = {
  __typename?: 'DeletePackAtmospherePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackAtmosphere` that was deleted by this mutation. */
  packAtmosphere?: Maybe<PackAtmosphere>;
  deletedPackAtmosphereNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackAtmosphere`. May be used by Relay 1. */
  packAtmosphereEdge?: Maybe<PackAtmospheresEdge>;
};


/** The output of our delete `PackAtmosphere` mutation. */
export type DeletePackAtmospherePayloadPackAtmosphereEdgeArgs = {
  orderBy?: Maybe<Array<PackAtmospheresOrderBy>>;
};

/** All input for the `deletePackAtmosphereByNodeId` mutation. */
export type DeletePackAtmosphereByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackAtmosphere` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackAtmosphere` mutation. */
export type DeletePackAtmosphereInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  maCode: Scalars['String'];
};

/** The output of our delete `PackBoxStyle` mutation. */
export type DeletePackBoxStylePayload = {
  __typename?: 'DeletePackBoxStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxStyle` that was deleted by this mutation. */
  packBoxStyle?: Maybe<PackBoxStyle>;
  deletedPackBoxStyleNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxStyle`. May be used by Relay 1. */
  packBoxStyleEdge?: Maybe<PackBoxStylesEdge>;
};


/** The output of our delete `PackBoxStyle` mutation. */
export type DeletePackBoxStylePayloadPackBoxStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxStylesOrderBy>>;
};

/** All input for the `deletePackBoxStyleByNodeId` mutation. */
export type DeletePackBoxStyleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackBoxStyle` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackBoxStyle` mutation. */
export type DeletePackBoxStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  boxStyle: Scalars['String'];
};

/** The output of our delete `PackBoxType` mutation. */
export type DeletePackBoxTypePayload = {
  __typename?: 'DeletePackBoxTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackBoxType` that was deleted by this mutation. */
  packBoxType?: Maybe<PackBoxType>;
  deletedPackBoxTypeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackBoxType`. May be used by Relay 1. */
  packBoxTypeEdge?: Maybe<PackBoxTypesEdge>;
};


/** The output of our delete `PackBoxType` mutation. */
export type DeletePackBoxTypePayloadPackBoxTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackBoxTypesOrderBy>>;
};

/** All input for the `deletePackBoxTypeByNodeId` mutation. */
export type DeletePackBoxTypeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackBoxType` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackBoxType` mutation. */
export type DeletePackBoxTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  boxType: Scalars['String'];
};

/** The output of our delete `PackDestination` mutation. */
export type DeletePackDestinationPayload = {
  __typename?: 'DeletePackDestinationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackDestination` that was deleted by this mutation. */
  packDestination?: Maybe<PackDestination>;
  deletedPackDestinationNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackDestination`. May be used by Relay 1. */
  packDestinationEdge?: Maybe<PackDestinationsEdge>;
};


/** The output of our delete `PackDestination` mutation. */
export type DeletePackDestinationPayloadPackDestinationEdgeArgs = {
  orderBy?: Maybe<Array<PackDestinationsOrderBy>>;
};

/** All input for the `deletePackDestinationByNodeId` mutation. */
export type DeletePackDestinationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackDestination` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackDestination` mutation. */
export type DeletePackDestinationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  destinationCode: Scalars['String'];
};

/** The output of our delete `PackGrade` mutation. */
export type DeletePackGradePayload = {
  __typename?: 'DeletePackGradePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackGrade` that was deleted by this mutation. */
  packGrade?: Maybe<PackGrade>;
  deletedPackGradeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackGrade`. May be used by Relay 1. */
  packGradeEdge?: Maybe<PackGradesEdge>;
};


/** The output of our delete `PackGrade` mutation. */
export type DeletePackGradePayloadPackGradeEdgeArgs = {
  orderBy?: Maybe<Array<PackGradesOrderBy>>;
};

/** All input for the `deletePackGradeByNodeId` mutation. */
export type DeletePackGradeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackGrade` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackGrade` mutation. */
export type DeletePackGradeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  gradeCode: Scalars['String'];
};

/** The output of our delete `PackHold` mutation. */
export type DeletePackHoldPayload = {
  __typename?: 'DeletePackHoldPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackHold` that was deleted by this mutation. */
  packHold?: Maybe<PackHold>;
  deletedPackHoldNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackHold`. May be used by Relay 1. */
  packHoldEdge?: Maybe<PackHoldsEdge>;
};


/** The output of our delete `PackHold` mutation. */
export type DeletePackHoldPayloadPackHoldEdgeArgs = {
  orderBy?: Maybe<Array<PackHoldsOrderBy>>;
};

/** All input for the `deletePackHoldByNodeId` mutation. */
export type DeletePackHoldByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackHold` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackHold` mutation. */
export type DeletePackHoldInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  holdCode: Scalars['String'];
};

/** The output of our delete `PackLabel` mutation. */
export type DeletePackLabelPayload = {
  __typename?: 'DeletePackLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLabel` that was deleted by this mutation. */
  packLabel?: Maybe<PackLabel>;
  deletedPackLabelNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLabel`. May be used by Relay 1. */
  packLabelEdge?: Maybe<PackLabelsEdge>;
};


/** The output of our delete `PackLabel` mutation. */
export type DeletePackLabelPayloadPackLabelEdgeArgs = {
  orderBy?: Maybe<Array<PackLabelsOrderBy>>;
};

/** All input for the `deletePackLabelByNodeId` mutation. */
export type DeletePackLabelByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackLabel` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackLabel` mutation. */
export type DeletePackLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  labelCode: Scalars['String'];
};

/** The output of our delete `PackLiner` mutation. */
export type DeletePackLinerPayload = {
  __typename?: 'DeletePackLinerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackLiner` that was deleted by this mutation. */
  packLiner?: Maybe<PackLiner>;
  deletedPackLinerNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackLiner`. May be used by Relay 1. */
  packLinerEdge?: Maybe<PackLinersEdge>;
};


/** The output of our delete `PackLiner` mutation. */
export type DeletePackLinerPayloadPackLinerEdgeArgs = {
  orderBy?: Maybe<Array<PackLinersOrderBy>>;
};

/** All input for the `deletePackLinerByNodeId` mutation. */
export type DeletePackLinerByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackLiner` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackLiner` mutation. */
export type DeletePackLinerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  linerCode: Scalars['String'];
};

/** The output of our delete `PackOut` mutation. */
export type DeletePackOutPayload = {
  __typename?: 'DeletePackOutPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackOut` that was deleted by this mutation. */
  packOut?: Maybe<PackOut>;
  deletedPackOutNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackOut`. May be used by Relay 1. */
  packOutEdge?: Maybe<PackOutsEdge>;
};


/** The output of our delete `PackOut` mutation. */
export type DeletePackOutPayloadPackOutEdgeArgs = {
  orderBy?: Maybe<Array<PackOutsOrderBy>>;
};

/** All input for the `deletePackOutByNodeId` mutation. */
export type DeletePackOutByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackOut` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackOut` mutation. */
export type DeletePackOutInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  outCode: Scalars['String'];
};

/** The output of our delete `PackPalletType` mutation. */
export type DeletePackPalletTypePayload = {
  __typename?: 'DeletePackPalletTypePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackPalletType` that was deleted by this mutation. */
  packPalletType?: Maybe<PackPalletType>;
  deletedPackPalletTypeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackPalletType`. May be used by Relay 1. */
  packPalletTypeEdge?: Maybe<PackPalletTypesEdge>;
};


/** The output of our delete `PackPalletType` mutation. */
export type DeletePackPalletTypePayloadPackPalletTypeEdgeArgs = {
  orderBy?: Maybe<Array<PackPalletTypesOrderBy>>;
};

/** All input for the `deletePackPalletTypeByNodeId` mutation. */
export type DeletePackPalletTypeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackPalletType` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackPalletType` mutation. */
export type DeletePackPalletTypeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  palletType: Scalars['String'];
};

/** The output of our delete `PackProduction` mutation. */
export type DeletePackProductionPayload = {
  __typename?: 'DeletePackProductionPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackProduction` that was deleted by this mutation. */
  packProduction?: Maybe<PackProduction>;
  deletedPackProductionNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackProduction`. May be used by Relay 1. */
  packProductionEdge?: Maybe<PackProductionsEdge>;
};


/** The output of our delete `PackProduction` mutation. */
export type DeletePackProductionPayloadPackProductionEdgeArgs = {
  orderBy?: Maybe<Array<PackProductionsOrderBy>>;
};

/** All input for the `deletePackProductionByNodeId` mutation. */
export type DeletePackProductionByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackProduction` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackProduction` mutation. */
export type DeletePackProductionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  productionCode: Scalars['String'];
};

/** The output of our delete `PackSpecial` mutation. */
export type DeletePackSpecialPayload = {
  __typename?: 'DeletePackSpecialPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackSpecial` that was deleted by this mutation. */
  packSpecial?: Maybe<PackSpecial>;
  deletedPackSpecialNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackSpecial`. May be used by Relay 1. */
  packSpecialEdge?: Maybe<PackSpecialsEdge>;
};


/** The output of our delete `PackSpecial` mutation. */
export type DeletePackSpecialPayloadPackSpecialEdgeArgs = {
  orderBy?: Maybe<Array<PackSpecialsOrderBy>>;
};

/** All input for the `deletePackSpecialByNodeId` mutation. */
export type DeletePackSpecialByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackSpecial` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackSpecial` mutation. */
export type DeletePackSpecialInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  customerCode: Scalars['String'];
};

/** The output of our delete `PackStyle` mutation. */
export type DeletePackStylePayload = {
  __typename?: 'DeletePackStylePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackStyle` that was deleted by this mutation. */
  packStyle?: Maybe<PackStyle>;
  deletedPackStyleNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackStyle`. May be used by Relay 1. */
  packStyleEdge?: Maybe<PackStylesEdge>;
};


/** The output of our delete `PackStyle` mutation. */
export type DeletePackStylePayloadPackStyleEdgeArgs = {
  orderBy?: Maybe<Array<PackStylesOrderBy>>;
};

/** All input for the `deletePackStyleByNodeId` mutation. */
export type DeletePackStyleByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackStyle` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackStyle` mutation. */
export type DeletePackStyleInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  packStyle: Scalars['String'];
};

/** The output of our delete `PackTreeRipe` mutation. */
export type DeletePackTreeRipePayload = {
  __typename?: 'DeletePackTreeRipePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PackTreeRipe` that was deleted by this mutation. */
  packTreeRipe?: Maybe<PackTreeRipe>;
  deletedPackTreeRipeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PackTreeRipe`. May be used by Relay 1. */
  packTreeRipeEdge?: Maybe<PackTreeRipesEdge>;
};


/** The output of our delete `PackTreeRipe` mutation. */
export type DeletePackTreeRipePayloadPackTreeRipeEdgeArgs = {
  orderBy?: Maybe<Array<PackTreeRipesOrderBy>>;
};

/** All input for the `deletePackTreeRipeByNodeId` mutation. */
export type DeletePackTreeRipeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PackTreeRipe` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deletePackTreeRipe` mutation. */
export type DeletePackTreeRipeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  shipperId: Scalars['String'];
  treeRipe: Scalars['String'];
};

/** The output of our delete `Size` mutation. */
export type DeleteSizePayload = {
  __typename?: 'DeleteSizePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Size` that was deleted by this mutation. */
  size?: Maybe<Size>;
  deletedSizeNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Size`. May be used by Relay 1. */
  sizeEdge?: Maybe<SizesEdge>;
};


/** The output of our delete `Size` mutation. */
export type DeleteSizePayloadSizeEdgeArgs = {
  orderBy?: Maybe<Array<SizesOrderBy>>;
};

/** All input for the `deleteSizeByNodeId` mutation. */
export type DeleteSizeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Size` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteSize` mutation. */
export type DeleteSizeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** The output of our delete `Species` mutation. */
export type DeleteSpeciesPayload = {
  __typename?: 'DeleteSpeciesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Species` that was deleted by this mutation. */
  species?: Maybe<Species>;
  deletedSpeciesNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Species`. May be used by Relay 1. */
  speciesEdge?: Maybe<SpeciesEdge>;
};


/** The output of our delete `Species` mutation. */
export type DeleteSpeciesPayloadSpeciesEdgeArgs = {
  orderBy?: Maybe<Array<SpeciesOrderBy>>;
};

/** All input for the `deleteSpeciesByNodeId` mutation. */
export type DeleteSpeciesByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Species` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteSpecies` mutation. */
export type DeleteSpeciesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our delete `Variety` mutation. */
export type DeleteVarietyPayload = {
  __typename?: 'DeleteVarietyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Variety` that was deleted by this mutation. */
  variety?: Maybe<Variety>;
  deletedVarietyNodeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Variety`. May be used by Relay 1. */
  varietyEdge?: Maybe<VarietiesEdge>;
};


/** The output of our delete `Variety` mutation. */
export type DeleteVarietyPayloadVarietyEdgeArgs = {
  orderBy?: Maybe<Array<VarietiesOrderBy>>;
};

/** All input for the `deleteVarietyByNodeId` mutation. */
export type DeleteVarietyByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Variety` to be deleted. */
  nodeId: Scalars['ID'];
};

/** All input for the `deleteVariety` mutation. */
export type DeleteVarietyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

/** The output of our `bulkAddContactsToAlias` mutation. */
export type BulkAddContactsToAliasPayload = {
  __typename?: 'BulkAddContactsToAliasPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  contactAliasPersonContacts?: Maybe<Array<Maybe<ContactAliasPersonContact>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkAddContactsToAlias` mutation. */
export type BulkAddContactsToAliasInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  items: Array<Maybe<ContactAliasPersonContactInput>>;
};

/** The output of our `bulkRemoveContactAliasPersonContact` mutation. */
export type BulkRemoveContactAliasPersonContactPayload = {
  __typename?: 'BulkRemoveContactAliasPersonContactPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  contactAliasPersonContacts?: Maybe<Array<Maybe<ContactAliasPersonContact>>>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** All input for the `bulkRemoveContactAliasPersonContact` mutation. */
export type BulkRemoveContactAliasPersonContactInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  items: Array<Maybe<ContactAliasPersonContactInput>>;
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

export type PriceSheetUpdateInput = {
  message: Scalars['String'];
};
