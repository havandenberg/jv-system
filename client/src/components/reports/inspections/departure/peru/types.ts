export interface Pallet {
  id: string;
  size: string;
  netWeight: number;
  openingScore: number;
  colorScore: number;
  stemScore: number;
  textureScore: number;
  bunchesPerBox: number;
  brix: number;
  qualityScore: number;
  conditionScore: number;
  stragglyTightPct: number;
  surfaceDiscPct: number;
  russetScarsPct: number;
  sunburnPct: number;
  undersizedBunchesPct: number;
  otherDefectsPct: number;
  totalQualityDefectsPct: number;
  stemDehyPct: number;
  glassyWeakPct: number;
  decayPct: number;
  splitCrushedPct: number;
  drySplitPct: number;
  wetStickyPct: number;
  waterberriesPct: number;
  shatterPct: number;
  totalConditionDefectsPct: number;
  totalDefectsPct: number;
}

export interface PeruInspectionReport {
  avgBunchesPerBox: number;
  avgNetWeight: number;
  bagsPerBox: string;
  bagType: string;
  brand: string;
  brixAvg: number;
  brixMax: number;
  brixMin: number;
  category: string;
  comments: string;
  conditionScore: number;
  containerId: string;
  departureWeek: string;
  destination: string;
  exporter: string;
  imageUrls: string[];
  inspectionDate: Date;
  packingDate: Date;
  packingHouse: string;
  packingMaterial: string;
  pallets: Pallet[];
  presentation: string;
  qualityScore: number;
  variety: string;
}
