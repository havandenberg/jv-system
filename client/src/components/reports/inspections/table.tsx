import React from 'react';
import styled from '@emotion/styled';

import { useTabBar } from 'components/tab-bar';
import { Pallet } from 'components/reports/inspections/types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getTableData, getAvgPallet, tableTabs } from './data-utils';

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
  const { selectedTabId, TabBar } = useTabBar(tableTabs);
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
