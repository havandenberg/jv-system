function camelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

const snakeCase = (string) => {
  return string
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_');
};

const sentenceWithSpacesCase = (str) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  const final = result.charAt(0).toUpperCase() + result.slice(1);
  return final;
};

const keys = [
  'location',
  'arrival',
  'importerName',
  'exporterName',
  'commodity',
  'productCode',
  'variety',
  'inspDate',
  'quantity',
  'hatch',
  'deck',
  'containerId',
  'fumigation',
  'labelCode',
  'inspLocation',
  'importerCode',
  'lotCode',
  'inspLot',
  'runNumber',
  'palletId',
  'growerCode',
  'inspGrowerCode',
  'packDate',
  'inspPackDate',
  'size',
  'inspSize',
  'packCode',
  'packDescription',
  'secondaryDescription',
  'inspPackCode',
  'grade',
  'inspGrade',
  'count',
  'plu',
  'pluPct',
  'countryOfOrigin',
  'upc',
  'weight',
  'underweightMin',
  'underweightMax',
  'weighedUnits',
  'underweightUnits',
  'underweightPct',
  'pulpTemp',
  'opening',
  'groundColor',
  'blushColor',
  'blushPct',
  'scarsPieces',
  'scarsPct',
  'scarsDeg',
  'stemPuncturesPieces',
  'stemPuncturesPct',
  'cutsPieces',
  'cutsPct',
  'cutsDeg',
  'sunScaldPieces',
  'sunScaldPct',
  'sunScaldDeg',
  'scaldPieces',
  'scaldPct',
  'scaldDeg',
  'bruisingPieces',
  'bruisingPct',
  'bruisingDeg',
  'crackingPieces',
  'crackingPct',
  'bitterPitPieces',
  'bitterPitPct',
  'bitterPitDeg',
  'lenticelBreakdownPieces',
  'lenticelBreakdownPct',
  'lenticelBreakdownDeg',
  'dehydrationPieces',
  'dehydrationPct',
  'dehydrationDeg',
  'cutCount',
  'watercorePieces',
  'watercorePct',
  'internalDamagePieces',
  'internalDamagePer',
  'decayPieces',
  'decayPct',
  'decayDeg',
  'moldPieces',
  'moldPct',
  'pressure1',
  'pressure2',
  'pressure3',
  'pressure4',
  'pressure5',
  'pressure6',
  'pressuresMin',
  'pressuresMax',
  'pressuresAvg',
  'overallQuality',
  'overallCondition',
  'comment1',
  'comment2',
  'inspectionType',
  'shortInsp',
  'fixedWeight',
];

console.log(
  // JSON.stringify(keys.map((key) => camelCase(key))),
  // JSON.stringify(
  //   keys.map((key) =>
  //     `${snakeCase(key)} ${
  //       ['quantity', 'overallQuality', 'overallCondition'].includes(key)
  //         ? 'NUMERIC'
  //         : 'TEXT'
  //     },`
  //       .replace("'", '')
  //       .replace(',', ''),
  //   ),
  // ),
  JSON.stringify(keys.map((key) => snakeCase(key))),
);
