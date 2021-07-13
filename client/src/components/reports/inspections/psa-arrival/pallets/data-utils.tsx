import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  PsaApplePallet,
  PsaCherryPallet,
  PsaCitrusPallet,
  PsaGrapePallet,
  PsaLemonPallet,
  PsaPearPallet,
  PsaPersimmonPallet,
  PsaPomegranatePallet,
  PsaStoneFruitPallet,
} from 'types';

export type PalletLabelInfo = LabelInfo<
  | PsaGrapePallet
  | PsaCitrusPallet
  | PsaStoneFruitPallet
  | PsaPomegranatePallet
  | PsaPersimmonPallet
  | PsaPearPallet
  | PsaLemonPallet
  | PsaCherryPallet
  | PsaApplePallet
>;

export const listLabels: PalletLabelInfo[] = [
  {
    key: 'palletId',
    label: 'Pallet ID',
    sortable: true,
  },
  {
    key: 'size',
    label: 'Size',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      showSearch: true,
    },
  },
  {
    key: 'growerCode',
    label: 'Grower Code',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      showSearch: true,
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'labelCode',
    label: 'Label',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      showSearch: true,
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'overallQuality',
    label: 'Quality',
    sortable: true,
    filterable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'overallCondition',
    label: 'Condition',
    sortable: true,
    filterable: true,
  },
];

export const baseLabels: PalletLabelInfo[] = [
  { key: 'palletId', label: 'Pallet ID' },
  { key: 'inspDate', label: 'Insp Date' },
  { key: 'arrival', label: 'Arrival' },
  { key: 'exporterName', label: 'Exporter Name' },
  { key: 'location', label: 'Location' },
  { key: 'commodity', label: 'Commodity' },
  { key: 'variety', label: 'Variety' },
  { key: 'productCode', label: 'Product Code' },
  { key: 'size', label: 'Size' },
  { key: 'inspSize', label: 'Insp Size' },
  { key: 'containerId', label: 'Container ID' },
  { key: 'countryOfOrigin', label: 'Country Of Origin' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'growerCode', label: 'Grower Code' },
  { key: 'labelCode', label: 'Label Code' },
  { key: 'inspLocation', label: 'Insp Location' },
  { key: 'lotCode', label: 'Lot Code' },
  { key: 'packDate', label: 'Pack Date' },
  { key: 'packCode', label: 'Pack Code' },
  { key: 'inspectionType', label: 'Inspection Type' },
  { key: 'packDescription', label: 'Pack Description' },
  { key: 'secondaryDescription', label: 'Secondary Description' },
  { key: 'plu', label: 'PLU' },
  { key: 'pluPct', label: 'PLU %' },
  { key: 'upc', label: 'UPC' },
];

const commonFeaturedValues = (
  data:
    | PsaGrapePallet
    | PsaCitrusPallet
    | PsaStoneFruitPallet
    | PsaPomegranatePallet
    | PsaPersimmonPallet
    | PsaPearPallet
    | PsaLemonPallet
    | PsaCherryPallet
    | PsaApplePallet,
) => [
  {
    label: 'Quality Score',
    values: [{ value: data.overallQuality }],
  },
  {
    label: 'Condition Score',
    values: [{ value: data.overallCondition }],
  },
  {
    label: 'Net Weight (kg)',
    values: [{ value: data.weight }],
  },
];

export const getGrapeFeaturedValues = (data: PsaGrapePallet) => [
  ...commonFeaturedValues(data),
  {
    label: 'Bunches / Box',
    values: [{ value: data.bunches }],
  },
  {
    label: '°Brix',
    values: [
      { label: 'Max', value: data.brixMax },
      { label: 'Min', value: data.brixMin },
      { label: 'Most', value: data.brixMost },
    ],
  },
];

export const grapeGeneralLabels: LabelInfo<PsaGrapePallet>[] = [
  { key: 'autoOpening', label: 'Auto Opening' },
  { key: 'bunches', label: 'Bunches' },
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'grade', label: 'Grade' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'sizeMax', label: 'Size Max' },
  { key: 'sizeMin', label: 'Size Min' },
  { key: 'sizeMost', label: 'Size Most' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const grapeQualityLabels: LabelInfo<PsaGrapePallet>[] = [
  {
    key: 'autoUndersizeBerriesBunches',
    label: 'Auto Undersize Berries Bunches',
  },
  { key: 'autoBruisingBunches', label: 'Auto Bruising Bunches' },
  { key: 'autoBunchConformation', label: 'Auto Bunch Conformation' },
  { key: 'autoColorConsistency', label: 'Auto Color Consistency' },
  { key: 'autoDustPct', label: 'Auto Dust Pct' },
  { key: 'autoResiduesPct', label: 'Auto Residues %' },
  { key: 'autoRussetMarksPct', label: 'Auto Russet Marks %' },
  { key: 'autoSunburnBunches', label: 'Auto Sunburn Bunches' },
  { key: 'autoTightBunches', label: 'Auto Tight Bunches' },
  { key: 'bruisingBunches', label: 'Bruising Bunches' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bunchConformation', label: 'Bunch Conformation' },
  { key: 'colorConsistency', label: 'Color Consistency' },
  { key: 'colorMax', label: 'Color Max' },
  { key: 'colorMin', label: 'Color Min' },
  { key: 'colorMost', label: 'Color Most' },
  { key: 'dustPct', label: 'Dust %' },
  { key: 'residuesPct', label: 'Residues %' },
  { key: 'russetMarksBunches', label: 'Russet Marks Bunches' },
  { key: 'russetMarksPct', label: 'Russet Marks %' },
  { key: 'smallBunches', label: 'Small Bunches' },
  { key: 'stragglyBunches', label: 'Straggly Bunches' },
  { key: 'stragglyPct', label: 'Straggly %' },
  { key: 'sunburnBunches', label: 'Sunburn Bunches' },
  { key: 'sunburnBunchesDeg', label: 'Sunburn Bunches Deg' },
  { key: 'sunburnPct', label: 'Sunburn %' },
  { key: 'tightBunches', label: 'Tight Bunches' },
  { key: 'undersizeBerriesPct', label: 'Undersize Berries %' },
  { key: 'undersizeBunchesCount', label: 'Undersize Bunches Count' },
];

export const grapeConditionLabels: LabelInfo<PsaGrapePallet>[] = [
  { key: 'autoBerryCondition', label: 'Auto Berry Condition' },
  { key: 'autoDecayMoldBerries', label: 'Auto Decay Mold Berries' },
  { key: 'autoDecayNestBerries', label: 'Auto Decay Nest Berries' },
  { key: 'autoDecaySlipskinBerries', label: 'Auto Decay Slipskin Berries' },
  { key: 'autoH2OBerries', label: 'Auto H2O Berries' },
  { key: 'autoIntDisc', label: 'Auto Int Disc' },
  { key: 'autoShatterPct', label: 'Auto Shatter %' },
  { key: 'autoSo2DamagePct', label: 'Auto SO2 Damage %' },
  { key: 'autoSplitsDryPct', label: 'Auto Splits Dry %' },
  { key: 'autoSplitsHairlinePct', label: 'Auto Splits Hairline %' },
  { key: 'autoSplitsWetCrushPct', label: 'Auto Splits Wet Crush %' },
  { key: 'autoStemDehydrationPct', label: 'Auto Stem Dehydration %' },
  { key: 'autoWeakBunches', label: 'Auto Weak Bunches' },
  { key: 'berryCondition', label: 'Berry Condition' },
  { key: 'decayMoldBerries', label: 'Decay Mold Berries' },
  { key: 'decayNestBerries', label: 'Decay Nest Berries' },
  { key: 'decayNestDeg', label: 'Decay Nest Deg' },
  { key: 'decaySlipskinBerries', label: 'Decay Slipskin Berries' },
  { key: 'h2OBerries', label: 'H2O Berries' },
  { key: 'intDisc', label: 'Int Disc' },
  { key: 'intDiscDeg', label: 'Int Disc Deg' },
  { key: 'shatterPct', label: 'Shatter %' },
  { key: 'so2DamageDeg', label: 'SO2 Damage Deg' },
  { key: 'so2DamagePct', label: 'SO2 Damage %' },
  { key: 'splitsDryPct', label: 'Splits Dry %' },
  { key: 'splitsHairlinePct', label: 'Splits Hairline %' },
  { key: 'splitsWetCrushPct', label: 'Splits Wet Crush %' },
  { key: 'stemDehydrationDeg', label: 'Stem Dehydration Deg' },
  { key: 'stemDehydrationPct', label: 'Stem Dehydration %' },
  { key: 'weakBunches', label: 'Weak Bunches' },
];

export const getCitrusFeaturedValues = (data: PsaCitrusPallet) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    values: [{ value: data.brix }],
  },
  {
    label: 'Diameter (mm)',
    values: [
      { label: 'Max', value: data.diameterMaxMm },
      { label: 'Min', value: data.diameterMinMm },
      { label: 'Most', value: data.diameterMostMm },
    ],
  },
];

export const citrusGeneralLabels: LabelInfo<PsaCitrusPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'diameterMaxMm', label: 'Diameter Max (mm)' },
  { key: 'diameterMinMm', label: 'Diameter Min (mm)' },
  { key: 'diameterMostMm', label: 'Diameter Most (mm)' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const citrusQualityLabels: LabelInfo<PsaCitrusPallet>[] = [
  { key: 'dryPulpDeg', label: 'Dry Pulp Deg' },
  { key: 'dryPulpPct', label: 'Dry Pulp %' },
  { key: 'dryPulpPieces', label: 'Dry Pulp Pieces' },
  { key: 'greenHazeDeg', label: 'Green Haze Deg' },
  { key: 'greenHazePct', label: 'Green Haze %' },
  { key: 'greenHazePieces', label: 'Green Haze Pieces' },
  { key: 'oilSpotsDeg', label: 'Oil Spots Deg' },
  { key: 'oilSpotsPct', label: 'Oil Spots %' },
  { key: 'oilSpotsPieces', label: 'Oil Spots Pieces' },
  { key: 'scarsDeg', label: 'Scars Deg' },
  { key: 'scarsPct', label: 'Scars %' },
  {
    key: 'scarsPieces',
    label: 'Scars Pieces',
  },
  { key: 'seedsPct', label: 'Seeds %' },
  { key: 'seedsPieces', label: 'Seeds Pieces' },
];

export const citrusConditionLabels: LabelInfo<PsaCitrusPallet>[] = [
  { key: 'creasingDeg', label: 'Creasing Deg' },
  { key: 'creasingPct', label: 'Creasing %' },
  { key: 'creasingPieces', label: 'Creasing Pieces' },
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'puffinessDeg', label: 'Puffiness Deg' },
  { key: 'puffinessPct', label: 'Puffiness %' },
  { key: 'puffinessPieces', label: 'Puffiness Pieces' },
  { key: 'skinBreakdownDeg', label: 'Skin Breakdown %' },
  { key: 'skinBreakdownPct', label: 'Skin Breakdown %' },
  { key: 'skinBreakdownPieces', label: 'Skin Breakdown Pieces' },
  { key: 'sporesPct', label: 'Spores %' },
  { key: 'sporesPieces', label: 'Spores Pieces' },
];

export const getStoneFruitFeaturedValues = (data: PsaStoneFruitPallet) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    values: [{ value: data.brix }],
  },
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: data.pressuresMax },
      { label: 'Min', value: data.pressuresMin },
      { label: 'Avg', value: data.pressuresAvg },
    ],
  },
];

export const stoneFruitGeneralLabels: LabelInfo<PsaStoneFruitPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const stoneFruitQualityLabels: LabelInfo<PsaStoneFruitPallet>[] = [
  { key: 'blushColor', label: 'Blush Color' },
  { key: 'blushPct', label: 'Blush Pct' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bruisingPieces', label: 'Bruising Pieces' },
  { key: 'cutsSplitsDeg', label: 'Cut Splits Deg' },
  { key: 'cutsSplitsPct', label: 'Cut Splits %' },
  { key: 'cutsSplitsPieces', label: 'Cut Splits Pieces' },
  { key: 'groundColor', label: 'Ground Color' },
  { key: 'ripening', label: 'Ripening' },
  { key: 'scarsDeg', label: 'Scars Deg' },
  { key: 'scarsPct', label: 'Scars %' },
  { key: 'scarsPieces', label: 'Scars Pieces' },
  { key: 'softTipsPct', label: 'Soft Tips %' },
  { key: 'softTipsPieces', label: 'Soft Tips Pieces' },
  { key: 'splitPitPct', label: 'Split Pit %' },
  { key: 'splitPitPieces', label: 'Split Pit Pieces' },
];

export const stoneFruitConditionLabels: LabelInfo<PsaStoneFruitPallet>[] = [
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'internalDamagePer', label: 'Internal Damage %' },
  { key: 'internalDamagePieces', label: 'Internal Damage Pieces' },
  { key: 'mealinessPct', label: 'Mealiness %' },
  { key: 'mealinessPieces', label: 'Mealiness Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'pressure1', label: 'Pressure 1' },
  { key: 'pressure2', label: 'Pressure 2' },
  { key: 'pressure3', label: 'Pressure 3' },
  { key: 'pressure4', label: 'Pressure 4' },
  { key: 'pressure5', label: 'Pressure 5' },
  { key: 'pressure6', label: 'Pressure 6' },
];

export const getPomegranateFeaturedValues = (data: PsaPomegranatePallet) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    values: [
      { label: 'Max', value: data.brixMax },
      { label: 'Min', value: data.brixMin },
      { label: 'Most', value: data.brixMost },
    ],
  },
];

export const pomegranateGeneralLabels: LabelInfo<PsaPomegranatePallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const pomegranateQualityLabels: LabelInfo<PsaPomegranatePallet>[] = [
  { key: 'arilsColor', label: 'Arils Color' },
  { key: 'blushColor', label: 'Blush Color' },
  { key: 'blushPct', label: 'Blush Pct' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bruisingPieces', label: 'Bruising Pieces' },
  { key: 'cutsDeg', label: 'Cut Deg' },
  { key: 'cutsPct', label: 'Cut %' },
  { key: 'cutsPieces', label: 'Cut Pieces' },
  { key: 'scaldDeg', label: 'Scald Deg' },
  { key: 'scaldPct', label: 'Scald %' },
  { key: 'scaldPieces', label: 'Scald Pieces' },
  { key: 'scarsRussetDeg', label: 'Scars Russet Deg' },
  { key: 'scarsRussetPct', label: 'Scars Russet %' },
  { key: 'scarsRussetPieces', label: 'Scars Russet Pieces' },
  { key: 'sunScaldDeg', label: 'Sun Scald Deg' },
  { key: 'sunScaldPct', label: 'Sun Scald %' },
  { key: 'sunScaldPieces', label: 'Sun Scald Pieces' },
];

export const pomegranateConditionLabels: LabelInfo<PsaPomegranatePallet>[] = [
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
];

export const getPersimmonFeaturedValues = (data: PsaPersimmonPallet) => [
  ...commonFeaturedValues(data),
  {
    label: '°Brix',
    values: [{ value: data.brix }],
  },
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: data.pressuresMax },
      { label: 'Min', value: data.pressuresMin },
      { label: 'Avg', value: data.pressuresAvg },
    ],
  },
];

export const persimmonGeneralLabels: LabelInfo<PsaPersimmonPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const persimmonQualityLabels: LabelInfo<PsaPersimmonPallet>[] = [
  { key: 'color', label: 'Color' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bruisingPieces', label: 'Bruising Pieces' },
  { key: 'cutsSplitsDeg', label: 'Cut Splits Deg' },
  { key: 'cutsSplitsPct', label: 'Cut Splits %' },
  { key: 'cutsSplitsPieces', label: 'Cut Splits Pieces' },
  { key: 'greenColor', label: 'Green Color' },
  { key: 'greenColorDeg', label: 'Green Color Deg' },
  { key: 'greenColorPieces', label: 'Green Color Pieces' },
  { key: 'scarsMarksDeg', label: 'Scars Marks Deg' },
  { key: 'scarsMarksPct', label: 'Scars Marks %' },
  { key: 'scarsMarksPieces', label: 'Scars Marks Pieces' },
];

export const persimmonConditionLabels: LabelInfo<PsaPersimmonPallet>[] = [
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'internalDamagePer', label: 'Internal Damage %' },
  { key: 'internalDamagePieces', label: 'Internal Damage Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'seedsPct', label: 'Seeds %' },
  { key: 'seedsPieces', label: 'Seeds Pieces' },
  { key: 'pressure1', label: 'Pressure 1' },
  { key: 'pressure2', label: 'Pressure 2' },
  { key: 'pressure3', label: 'Pressure 3' },
  { key: 'pressure4', label: 'Pressure 4' },
  { key: 'pressure5', label: 'Pressure 5' },
  { key: 'pressure6', label: 'Pressure 6' },
];

export const getPearFeaturedValues = (data: PsaPearPallet) => [
  ...commonFeaturedValues(data),
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: data.pressuresMax },
      { label: 'Min', value: data.pressuresMin },
      { label: 'Avg', value: data.pressuresAvg },
    ],
  },
];

export const pearGeneralLabels: LabelInfo<PsaPearPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'runNumber', label: 'Run Number' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const pearQualityLabels: LabelInfo<PsaPearPallet>[] = [
  { key: 'blushColor', label: 'Blush Color' },
  { key: 'blushPct', label: 'Blush Pct' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bruisingPieces', label: 'Bruising Pieces' },
  { key: 'cutsDeg', label: 'Cuts Deg' },
  { key: 'cutsPct', label: 'Cuts %' },
  { key: 'cutsPieces', label: 'Cuts Pieces' },
  { key: 'groundColor', label: 'Ground Color' },
  { key: 'russetPerPiecePct', label: 'Russet Per Piece %' },
  { key: 'scarsRussetDeg', label: 'Scars Russet Deg' },
  { key: 'scarsRussetPct', label: 'Scars Russet %' },
  { key: 'scarsRussetPieces', label: 'Scars Russet Pieces' },
  { key: 'stemPuncturesPct', label: 'Stem Punctures %' },
  { key: 'stemPuncturesPieces', label: 'Stem Punctures Pieces' },
  { key: 'turningColorDeg', label: 'Turning Color Deg' },
  { key: 'turningColorPct', label: 'Turning Color %' },
  { key: 'turningColorPieces', label: 'Turning Color Pieces' },
];

export const pearConditionLabels: LabelInfo<PsaPearPallet>[] = [
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'internalDamagePer', label: 'Internal Damage %' },
  { key: 'internalDamagePieces', label: 'Internal Damage Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'pressure1', label: 'Pressure 1' },
  { key: 'pressure2', label: 'Pressure 2' },
  { key: 'pressure3', label: 'Pressure 3' },
  { key: 'pressure4', label: 'Pressure 4' },
  { key: 'pressure5', label: 'Pressure 5' },
  { key: 'pressure6', label: 'Pressure 6' },
];

export const getLemonFeaturedValues = (data: PsaLemonPallet) => [
  ...commonFeaturedValues(data),
  {
    label: 'Diameter (mm)',
    values: [
      { label: 'Max', value: data.diameterMaxMm },
      { label: 'Min', value: data.diameterMinMm },
      { label: 'Most', value: data.diameterMostMm },
    ],
  },
];

export const lemonGeneralLabels: LabelInfo<PsaLemonPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'diameterMaxMm', label: 'Diameter Max (mm)' },
  { key: 'diameterMinMm', label: 'Diameter Min (mm)' },
  { key: 'diameterMostMm', label: 'Diameter Most (mm)' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const lemonQualityLabels: LabelInfo<PsaLemonPallet>[] = [
  { key: 'color', label: 'Color' },
  { key: 'dryPulpDeg', label: 'Dry Pulp Deg' },
  { key: 'dryPulpPct', label: 'Dry Pulp %' },
  { key: 'dryPulpPieces', label: 'Dry Pulp Pieces' },
  { key: 'greenHazeDeg', label: 'Green Haze Deg' },
  { key: 'greenHazePct', label: 'Green Haze %' },
  { key: 'greenHazePieces', label: 'Green Haze Pieces' },
  { key: 'oilSpotsDeg', label: 'Oil Spots Deg' },
  { key: 'oilSpotsPct', label: 'Oil Spots %' },
  { key: 'oilSpotsPieces', label: 'Oil Spots Pieces' },
  { key: 'petecaPieces', label: 'Peteca Pieces' },
  { key: 'petecaPct', label: 'Peteca %' },
  { key: 'petecaDeg', label: 'Peteca Deg' },
  { key: 'scarsDeg', label: 'Scars Deg' },
  { key: 'scarsPct', label: 'Scars %' },
  {
    key: 'scarsPieces',
    label: 'Scars Pieces',
  },
  { key: 'skinDamagePieces', label: 'Skin Damage Pieces' },
  { key: 'skinDamagePct', label: 'Skin Damage %' },
  { key: 'skinDamageDeg', label: 'Skin Damage Deg' },
];

export const lemonConditionLabels: LabelInfo<PsaLemonPallet>[] = [
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'sporesPct', label: 'Spores %' },
  { key: 'sporesPieces', label: 'Spores Pieces' },
];

export const getCherryFeaturedValues = (data: PsaCherryPallet) => [
  ...commonFeaturedValues(data),
  {
    label: 'Size',
    values: [
      { label: 'Max', value: data.sizeMax },
      { label: 'Min', value: data.sizeMin },
      { label: 'Most', value: data.sizeMost },
    ],
  },
];

export const cherryGeneralLabels: LabelInfo<PsaCherryPallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const cherryQualityLabels: LabelInfo<PsaCherryPallet>[] = [
  { key: 'color', label: 'Color' },
  { key: 'firmness', label: 'Firmness' },
  { key: 'misshapenPct', label: 'Misshapen %' },
  { key: 'misshapenPieces', label: 'Misshapen Pieces' },
  { key: 'pittingBruisingDeg', label: 'Pitting / Bruising Deg' },
  { key: 'pittingBruisingPct', label: 'Pitting / Bruising %' },
  { key: 'pittingBruisingPieces', label: 'Pitting / Bruising Pieces' },
  { key: 'scarsMarksDeg', label: 'Scars Marks Deg' },
  { key: 'scarsMarksPct', label: 'Scars Marks %' },
  { key: 'scarsMarksPieces', label: 'Scars Marks Pieces' },
  { key: 'splitsDeg', label: 'Splits Deg' },
  { key: 'splitsPct', label: 'Splits %' },
  { key: 'splitsPieces', label: 'Splits Pieces' },
  { key: 'stemlessPct', label: 'Stemless %' },
  { key: 'stemlessPieces', label: 'Stemless Pieces' },
];

export const cherryConditionLabels: LabelInfo<PsaCherryPallet>[] = [
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'stemDehydrationDeg', label: 'Stem Dehydration Deg' },
  { key: 'stemDehydrationPct', label: 'Stem Dehydration %' },
  { key: 'stemDehydrationPieces', label: 'Stem Dehydration Pieces' },
];

export const getAppleFeaturedValues = (data: PsaApplePallet) => [
  ...commonFeaturedValues(data),
  {
    label: 'Pressures',
    values: [
      { label: 'Max', value: data.pressuresMax },
      { label: 'Min', value: data.pressuresMin },
      { label: 'Avg', value: data.pressuresAvg },
    ],
  },
];

export const appleGeneralLabels: LabelInfo<PsaApplePallet>[] = [
  { key: 'count', label: 'Count' },
  { key: 'deck', label: 'Deck' },
  { key: 'fixedWeight', label: 'Fixed Weight' },
  { key: 'fumigation', label: 'Fumigation' },
  { key: 'hatch', label: 'Hatch' },
  { key: 'inspGrowerCode', label: 'Insp Grower Code' },
  { key: 'inspLot', label: 'Insp Lot' },
  { key: 'inspPackCode', label: 'Insp Pack Code' },
  { key: 'inspPackDate', label: 'Insp Pack Date' },
  { key: 'opening', label: 'Opening' },
  { key: 'pulpTemp', label: 'Pulp Temp' },
  { key: 'runNumber', label: 'Run Number' },
  { key: 'shortInsp', label: 'Short Insp' },
  { key: 'underweightMax', label: 'Underweight Max' },
  { key: 'underweightMin', label: 'Underweight Min' },
  { key: 'underweightPct', label: 'Underweight Pct' },
  { key: 'underweightUnits', label: 'Underweight Units' },
  { key: 'weighedUnits', label: 'Weighed Units' },
];

export const appleQualityLabels: LabelInfo<PsaApplePallet>[] = [
  { key: 'bitterPitDeg', label: 'Bitter Pit Deg' },
  { key: 'bitterPitPct', label: 'Bitter Pit %' },
  { key: 'bitterPitPieces', label: 'Bitter Pit Pieces' },
  { key: 'blushColor', label: 'Blush Color' },
  { key: 'blushPct', label: 'Blush Pct' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising %' },
  { key: 'bruisingPieces', label: 'Bruising Pieces' },
  { key: 'crackingPct', label: 'Cracking %' },
  { key: 'crackingPieces', label: 'Cracking Pieces' },
  { key: 'cutsDeg', label: 'Cuts Deg' },
  { key: 'cutsPct', label: 'Cuts %' },
  { key: 'cutsPieces', label: 'Cuts Pieces' },
  { key: 'groundColor', label: 'Ground Color' },
  { key: 'scaldDeg', label: 'Scald Deg' },
  { key: 'scaldPct', label: 'Scald %' },
  { key: 'scaldPieces', label: 'Scald Pieces' },
  { key: 'scarsDeg', label: 'Scars Deg' },
  { key: 'scarsPct', label: 'Scars %' },
  {
    key: 'scarsPieces',
    label: 'Scars Pieces',
  },
  { key: 'stemPuncturesPct', label: 'Stem Punctures %' },
  { key: 'stemPuncturesPieces', label: 'Stem Punctures Pieces' },
  { key: 'sunScaldDeg', label: 'Sun Scald Deg' },
  { key: 'sunScaldPct', label: 'Sun Scald %' },
  { key: 'sunScaldPieces', label: 'Sun Scald Pieces' },
];

export const appleConditionLabels: LabelInfo<PsaApplePallet>[] = [
  { key: 'cutCount', label: 'Cut Count' },
  { key: 'decayDeg', label: 'Decay Deg' },
  { key: 'decayPct', label: 'Decay %' },
  { key: 'decayPieces', label: 'Decay Pieces' },
  { key: 'dehydrationDeg', label: 'Dehydration Deg' },
  { key: 'dehydrationPct', label: 'Dehydration %' },
  { key: 'dehydrationPieces', label: 'Dehydration Pieces' },
  { key: 'internalDamagePer', label: 'Internal Damage %' },
  { key: 'internalDamagePieces', label: 'Internal Damage Pieces' },
  { key: 'lenticelBreakdownDeg', label: 'Lenticel Breakdown Deg' },
  { key: 'lenticelBreakdownPct', label: 'Lenticel Breakdown %' },
  { key: 'lenticelBreakdownPieces', label: 'Lenticel Breakdown Pieces' },
  { key: 'moldPct', label: 'Mold %' },
  { key: 'moldPieces', label: 'Mold Pieces' },
  { key: 'pressure1', label: 'Pressure 1' },
  { key: 'pressure2', label: 'Pressure 2' },
  { key: 'pressure3', label: 'Pressure 3' },
  { key: 'pressure4', label: 'Pressure 4' },
  { key: 'pressure5', label: 'Pressure 5' },
  { key: 'pressure6', label: 'Pressure 6' },
  { key: 'watercorePct', label: 'Watercore %' },
  { key: 'watercorePieces', label: 'Watercore Pieces' },
];
