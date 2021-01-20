import React from 'react';
import styled from '@emotion/styled';

import { Tab, useTabBar } from 'components/tab-bar';
import { Pallet } from 'types/inspections';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { ChartData, getAvgPallet } from './utils';

const tabs: Tab[] = [
  {
    id: 'general',
    text: 'General',
  },
  {
    id: 'qualityDefects',
    text: 'Quality Defects',
  },
  {
    id: 'conditionDefects',
    text: 'Condition Defects',
  },
];

const data: { [key: string]: ChartData[] } = {
  general: [
    { key: 'id', label: 'Pallet Number' },
    { key: 'size', label: 'Size' },
    { key: 'netWeight', label: 'Net Weight (kg)' },
    { key: 'openingScore', label: 'Opening Score' },
    { key: 'colorScore', label: 'Color Score' },
    { key: 'stemScore', label: 'Stem Score' },
    { key: 'textureScore', label: 'Berry Texture Score' },
    { key: 'bunchesPerBox', label: 'Bunches / Box' },
    { key: 'brix', label: 'Brix' },
    { key: 'qualityScore', label: 'Quality Score' },
    { key: 'conditionScore', label: 'Condition Score' },
    { key: 'totalQualityDefectsPct', label: 'Total Quality Defects (%)' },
    {
      key: 'totalConditionDefectsPct',
      label: 'Total Condition Defects (<3%)',
    },
    { key: 'totalDefectsPct', label: 'TOTAL DEFECTS (<3%)' },
  ],
  qualityDefects: [
    { key: 'id', label: 'Pallet Number' },
    { key: 'stragglyTightPct', label: 'Straggly / Tight Bunches (0%)' },
    { key: 'surfaceDiscPct', label: 'Surface Discoloration (0%)' },
    { key: 'russetScarsPct', label: 'Russet / Scars (<5%)' },
    { key: 'sunburnPct', label: 'Sunburn (0%)' },
    { key: 'undersizedBunchesPct', label: 'Undersized Bunches (10%)' },
    { key: 'othersDefectsPct', label: 'Others Defects (%)' },
    { key: 'totalQualityDefectsPct', label: 'Total Quality Defects (%)' },
  ],
  conditionDefects: [
    { key: 'id', label: 'Pallet Number' },
    { key: 'stemDehyPct', label: 'Stem Dehydration (<10%)' },
    { key: 'glassyWeakPct', label: 'Glassy / Weak (0%)' },
    { key: 'decayPct', label: 'Decay (0%)' },
    { key: 'splitCrushedPct', label: 'Split / Crushed Berries (0%)' },
    { key: 'drySplitPct', label: 'Dry Split (<3%)' },
    { key: 'wetStickyPct', label: 'Wet & Sticky (0%)' },
    { key: 'waterberriesPct', label: 'Waterberries (0%)' },
    { key: 'shatterPct', label: 'Shatter (<3%)' },
    {
      key: 'totalConditionDefectsPct',
      label: 'Total Condition Defects (<3%)',
    },
  ],
};

const getTableData = (selectedTabId: string) => data[selectedTabId];

const StyledTable = styled.table({
  borderCollapse: 'collapse',
});

const TableHeader = styled.th({
  fontWeight: 500,
  height: 40,
  whiteSpace: 'nowrap',
  '> div': {
    transform: 'translate(10px) rotate(-60deg)',
    width: 40,
  },
  '> div > span': {
    padding: th.spacing.sm,
  },
  ':last-child': {
    fontWeight: 700,
  },
});

const TableData = styled.td({
  border: `1px solid ${th.colors.brand.disabled}`,
  padding: th.spacing.sm,
  textAlign: 'center',
  ':last-child': {
    fontWeight: 700,
  },
});

const TableRow = styled(TableData)(({ isEven }: { isEven?: boolean }) => ({
  background: isEven
    ? th.colors.brand.containerBackground
    : th.colors.brand.containerBackgroundAccent,
}));

const TableFooter = styled(TableData)({
  background: th.colors.brand.secondary,
});

interface TableProps {
  pallets: Pallet[];
}

const Table = ({ pallets }: TableProps) => {
  const { selectedTabId, TabBar } = useTabBar(tabs);
  const tableData = getTableData(selectedTabId);
  const averagePallet = getAvgPallet(pallets);
  const filteredPallets = pallets.filter((pallet) => pallet.id !== 'average');
  return (
    <>
      <ty.CaptionText secondary>Pallet Data</ty.CaptionText>
      <l.Flex justifyCenter>
        <TabBar />
      </l.Flex>
      <l.Div height={150} />
      <StyledTable>
        <thead>
          <tr>
            {tableData.map(({ key, label }) => (
              <TableHeader key={key}>
                <div>
                  <span>
                    <ty.CaptionText secondary>{label}</ty.CaptionText>
                  </span>
                </div>
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPallets.map((pallet, idx) => (
            <tr key={idx}>
              {tableData.map(({ key }) => (
                <TableRow key={key} isEven={idx % 2 === 0}>
                  <ty.BodyText>{pallet[key]}</ty.BodyText>
                </TableRow>
              ))}
            </tr>
          ))}
          <tr>
            {averagePallet &&
              tableData.map(({ key }) => (
                <TableFooter key={key}>
                  <ty.BodyText inverted textTransform="capitalize">
                    {averagePallet[key]}
                  </ty.BodyText>
                </TableFooter>
              ))}
          </tr>
        </tbody>
      </StyledTable>
    </>
  );
};

export default Table;
