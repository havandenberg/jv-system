import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { PsaGrapePallet } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export type PalletLabelInfo = LabelInfo<PsaGrapePallet>;

export const listLabels: PalletLabelInfo[] = [
  {
    key: 'palletId',
    label: 'Pallet ID',
    sortable: true,
  },
  {
    key: 'inspDate',
    label: 'Inspection Date',
    sortable: true,
  },
  {
    key: 'quantity',
    label: 'Quantity',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'labelCode',
    label: 'Label',
    sortable: true,
  },
  {
    key: 'overallQuality',
    label: 'Quality',
    sortable: true,
  },
  {
    key: 'overallCondition',
    label: 'Condition',
    sortable: true,
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

export const getFeaturedValues = (data: PsaGrapePallet) => [
  {
    label: 'Quality Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.overallQuality || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Condition Score',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.overallCondition || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Net Weight (kg)',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.weight || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: 'Bunches / Box',
    value: (
      <ty.HugeText fontFamily={th.fontFamilies.body} inverted>
        {data.bunches || '-'}
      </ty.HugeText>
    ),
  },
  {
    label: '°Brix',
    value: (
      <l.Div width={th.sizes.fill}>
        {(
          [
            { label: 'Max', key: 'brixMax' },
            { label: 'Min', key: 'brixMin' },
            { label: 'Most', key: 'brixMost' },
          ] as PalletLabelInfo[]
        ).map(({ label, key }, idx) => (
          <l.Flex
            alignCenter
            justifyBetween
            key={idx}
            mb={th.spacing.xs}
            mx={th.spacing.sm}
          >
            <ty.CaptionText inverted secondary>
              {label}
            </ty.CaptionText>
            <ty.LargeText inverted my={0}>
              {data[key] || '-'}
            </ty.LargeText>
          </l.Flex>
        ))}
      </l.Div>
    ),
  },
];

export const generalLabels: PalletLabelInfo[] = [
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

export const qualityLabels: PalletLabelInfo[] = [
  {
    key: 'autoUndersizeBerriesBunches',
    label: 'Auto Undersize Berries Bunches',
  },
  { key: 'autoBruisingBunches', label: 'Auto Bruising Bunches' },
  { key: 'autoBunchConformation', label: 'Auto Bunch Conformation' },
  { key: 'autoColorConsistency', label: 'Auto Color Consistency' },
  { key: 'autoDustPct', label: 'Auto Dust Pct' },
  { key: 'autoResiduesPct', label: 'Auto Residues Pct' },
  { key: 'autoRussetMarksPct', label: 'Auto Russet Marks Pct' },
  { key: 'autoSunburnBunches', label: 'Auto Sunburn Bunches' },
  { key: 'autoTightBunches', label: 'Auto Tight Bunches' },
  { key: 'bruisingBunches', label: 'Bruising Bunches' },
  { key: 'bruisingDeg', label: 'Bruising Deg' },
  { key: 'bruisingPct', label: 'Bruising Pct' },
  { key: 'bunchConformation', label: 'Bunch Conformation' },
  { key: 'colorConsistency', label: 'Color Consistency' },
  { key: 'colorMax', label: 'Color Max' },
  { key: 'colorMin', label: 'Color Min' },
  { key: 'colorMost', label: 'Color Most' },
  { key: 'dustPct', label: 'Dust Pct' },
  { key: 'residuesPct', label: 'Residues Pct' },
  { key: 'russetMarksBunches', label: 'Russet Marks Bunches' },
  { key: 'russetMarksPct', label: 'Russet Marks Pct' },
  { key: 'smallBunches', label: 'Small Bunches' },
  { key: 'stragglyBunches', label: 'Straggly Bunches' },
  { key: 'stragglyPct', label: 'Straggly Pct' },
  { key: 'sunburnBunches', label: 'Sunburn Bunches' },
  { key: 'sunburnBunchesDeg', label: 'Sunburn Bunches Deg' },
  { key: 'sunburnPct', label: 'Sunburn Pct' },
  { key: 'tightBunches', label: 'Tight Bunches' },
  { key: 'undersizeBerriesPct', label: 'Undersize Berries Pct' },
  { key: 'undersizeBunchesCount', label: 'Undersize Bunches Count' },
];

export const conditionLabels: PalletLabelInfo[] = [
  { key: 'autoBerryCondition', label: 'Auto Berry Condition' },
  { key: 'autoDecayMoldBerries', label: 'Auto Decay Mold Berries' },
  { key: 'autoDecayNestBerries', label: 'Auto Decay Nest Berries' },
  { key: 'autoDecaySlipskinBerries', label: 'Auto Decay Slipskin Berries' },
  { key: 'autoH2OBerries', label: 'Auto H2 O Berries' },
  { key: 'autoIntDisc', label: 'Auto Int Disc' },
  { key: 'autoShatterPct', label: 'Auto Shatter Pct' },
  { key: 'autoSo2DamagePct', label: 'Auto So2 Damage Pct' },
  { key: 'autoSplitsDryPct', label: 'Auto Splits Dry Pct' },
  { key: 'autoSplitsHairlinePct', label: 'Auto Splits Hairline Pct' },
  { key: 'autoSplitsWetCrushPct', label: 'Auto Splits Wet Crush Pct' },
  { key: 'autoStemDehydrationPct', label: 'Auto Stem Dehydration Pct' },
  { key: 'autoWeakBunches', label: 'Auto Weak Bunches' },
  { key: 'berryCondition', label: 'Berry Condition' },
  { key: 'decayMoldBerries', label: 'Decay Mold Berries' },
  { key: 'decayNestBerries', label: 'Decay Nest Berries' },
  { key: 'decayNestDeg', label: 'Decay Nest Deg' },
  { key: 'decaySlipskinBerries', label: 'Decay Slipskin Berries' },
  { key: 'h2OBerries', label: 'H2 O Berries' },
  { key: 'intDisc', label: 'Int Disc' },
  { key: 'intDiscDeg', label: 'Int Disc Deg' },
  { key: 'shatterPct', label: 'Shatter Pct' },
  { key: 'so2DamageDeg', label: 'So2 Damage Deg' },
  { key: 'so2DamagePct', label: 'So2 Damage Pct' },
  { key: 'splitsDryPct', label: 'Splits Dry Pct' },
  { key: 'splitsHairlinePct', label: 'Splits Hairline Pct' },
  { key: 'splitsWetCrushPct', label: 'Splits Wet Crush Pct' },
  { key: 'stemDehydrationDeg', label: 'Stem Dehydration Deg' },
  { key: 'stemDehydrationPct', label: 'Stem Dehydration Pct' },
  { key: 'weakBunches', label: 'Weak Bunches' },
];
