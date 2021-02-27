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
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /** The day, does not include a time. */
  Date: any;
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: any;
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: any;
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
  /** Reads and enables pagination through a set of `ChileDepartureInspectionPallet`. */
  chileDepartureInspectionPallets?: Maybe<ChileDepartureInspectionPalletsConnection>;
  /** Reads and enables pagination through a set of `PeruDepartureInspection`. */
  peruDepartureInspections?: Maybe<PeruDepartureInspectionsConnection>;
  /** Reads and enables pagination through a set of `PeruDepartureInspectionPallet`. */
  peruDepartureInspectionPallets?: Maybe<PeruDepartureInspectionPalletsConnection>;
  chileDepartureInspectionPallet?: Maybe<ChileDepartureInspectionPallet>;
  peruDepartureInspection?: Maybe<PeruDepartureInspection>;
  peruDepartureInspectionPallet?: Maybe<PeruDepartureInspectionPallet>;
  /** Reads and enables pagination through a set of `ChileDepartureInspection`. */
  chileDepartureInspections?: Maybe<ChileDepartureInspectionsConnection>;
  distinctValues?: Maybe<DistinctValuesConnection>;
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
export type QueryDistinctValuesArgs = {
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
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PeruDepartureInspectionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PeruDepartureInspectionFilter>>;
  /** Negates the expression. */
  not?: Maybe<PeruDepartureInspectionFilter>;
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
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PeruDepartureInspectionPalletFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PeruDepartureInspectionPalletFilter>>;
  /** Negates the expression. */
  not?: Maybe<PeruDepartureInspectionPalletFilter>;
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

/** A `PeruDepartureInspection` edge in the connection. */
export type PeruDepartureInspectionsEdge = {
  __typename?: 'PeruDepartureInspectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PeruDepartureInspection` at the end of the edge. */
  node?: Maybe<PeruDepartureInspection>;
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

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `ChileDepartureInspectionPallet`. */
  createChileDepartureInspectionPallet?: Maybe<CreateChileDepartureInspectionPalletPayload>;
  /** Creates a single `PeruDepartureInspection`. */
  createPeruDepartureInspection?: Maybe<CreatePeruDepartureInspectionPayload>;
  /** Creates a single `PeruDepartureInspectionPallet`. */
  createPeruDepartureInspectionPallet?: Maybe<CreatePeruDepartureInspectionPalletPayload>;
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
  batchCreateChileDepartureInspectionPallet?: Maybe<BatchCreateChileDepartureInspectionPalletPayload>;
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
export type MutationBatchCreateChileDepartureInspectionPalletArgs = {
  input: BatchCreateChileDepartureInspectionPalletInput;
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

/** All input for the `deleteChileDepartureInspectionPallet` mutation. */
export type DeleteChileDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
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

/** All input for the `deletePeruDepartureInspection` mutation. */
export type DeletePeruDepartureInspectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  containerId: Scalars['String'];
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

/** All input for the `deletePeruDepartureInspectionPallet` mutation. */
export type DeletePeruDepartureInspectionPalletInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
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
