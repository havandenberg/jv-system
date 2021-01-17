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
  othersDefectsPct: number;
  stemDehyPct: number;
  glassyWeakPct: number;
  decayPct: number;
  splitCrushedPct: number;
  drySplitPct: number;
  wetStickyPct: number;
  waterberriesPct: number;
  shatterPct: number;
}

export interface PeruInspectionReport {
  bagsPerBox: string;
  brand: string;
  category: string;
  comments: string;
  containerId: string;
  destination: string;
  departureWeek: string;
  exporter: string;
  inspectionDate: Date;
  imageUrls: string[];
  packingDate: Date;
  packingHouse: string;
  packingMaterial: string;
  pallets: Pallet[];
  presentation: string;
  variety: string;
}
