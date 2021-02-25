import React from 'react';
import styled from '@emotion/styled';

import { LabelInfo } from 'components/column-label';
import { Tab, useTabBar } from 'components/tab-bar';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { fontWeight } from 'onno-react';

export const tableTabs: Tab[] = [
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

const StyledTable = styled.table({
  borderCollapse: 'collapse',
});

const TableHeader = styled.th(
  {
    height: 40,
    whiteSpace: 'nowrap',
    '> div': {
      transform: 'translate(10px) rotate(-60deg)',
      width: 40,
    },
    '> div > span': {
      padding: th.spacing.sm,
    },
    ':first-of-type': {
      transform: 'translateX(24px)',
    },
  },
  fontWeight,
);

const TableData = styled.td(
  {
    border: `1px solid ${th.colors.brand.disabled}`,
    padding: th.spacing.sm,
    textAlign: 'center',
  },
  fontWeight,
);

const TableRow = styled(TableData)(({ isEven }: { isEven?: boolean }) => ({
  background: isEven
    ? th.colors.brand.containerBackground
    : th.colors.brand.containerBackgroundAccent,
}));

const TableFooter = styled(TableData)({
  background: th.colors.brand.secondary,
});

interface TableProps<T> {
  avgPallet?: T;
  getTableData: (selectedTabId: string) => LabelInfo<T>[];
  pallets: T[];
}

const Table = <T extends {}>({
  avgPallet,
  getTableData,
  pallets,
}: TableProps<T>) => {
  const { selectedTabId, TabBar } = useTabBar(tableTabs);
  const tableData = getTableData(selectedTabId);
  return (
    <>
      <ty.CaptionText mb={th.spacing.sm} secondary>
        Pallet Data
      </ty.CaptionText>
      <l.Flex justifyCenter>
        <TabBar />
      </l.Flex>
      <l.Div height={160} />
      <StyledTable>
        <thead>
          <tr>
            {tableData.map(({ key, label, boldColumn }) => (
              <TableHeader key={`${key}`} fontWeight={boldColumn ? 700 : 500}>
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
          {pallets.map((pallet, idx) => (
            <tr key={idx}>
              {tableData.map(({ key, transformValue, boldColumn }) => (
                <TableRow
                  key={`${key}`}
                  isEven={idx % 2 === 0}
                  fontWeight={boldColumn ? 700 : 500}
                >
                  <ty.BodyText>
                    {transformValue ? transformValue(pallet[key]) : pallet[key]}
                  </ty.BodyText>
                </TableRow>
              ))}
            </tr>
          ))}
          <tr>
            {avgPallet &&
              tableData.map(({ key, transformValue }) => (
                <TableFooter key={`${key}`}>
                  <ty.BodyText inverted textTransform="capitalize">
                    {transformValue
                      ? transformValue(avgPallet[key])
                      : avgPallet[key]}
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
