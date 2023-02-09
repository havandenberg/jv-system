import React from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { isEmpty } from 'ramda';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getFilteredItems, getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import { useSortQueryParams } from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { RepackHeader } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ResetButton } from '../inventory/use-filters';
import { indexListLabels } from './data-utils';

export const breadcrumbs = [{ text: 'Repacks', to: `/inventory/repacks` }];

const gridTemplateColumns = '1fr 1fr 1fr 1fr 30px';

const Repacks = () => {
  const { Search } = useSearch();
  const [{ sortBy = 'repackDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const { data, loading, error } = api.useRepacks();
  const items = (data ? data.nodes : []) as RepackHeader[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<RepackHeader>(
    'repackDate',
    SORT_ORDER.DESC,
    indexListLabels,
    'operations',
    'repack_header',
  );

  const filteredItems = getFilteredItems(indexListLabels, items);

  const repacksGroupedByRunNumber = filteredItems.reduce((acc, item) => {
    const { runNumber } = item || {};

    if (!acc || !runNumber) {
      return acc;
    }

    if (!acc[runNumber]) {
      acc[runNumber] = [];
    }

    acc[runNumber].push(item as RepackHeader);

    return acc;
  }, {} as { [key: string]: RepackHeader[] });

  const repacks = getSortedItems(
    indexListLabels,
    Object.values(repacksGroupedByRunNumber)
      .map((repackGroup) => repackGroup[0])
      .flat(),
    sortBy,
    sortOrder,
  );

  return (
    <Page
      actions={[
        <l.AreaLink key="queue" to="/inventory/repacks/queue">
          <b.Primary>Queue</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={112}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {repacks ? repacks.length : '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Date Range
              </ty.SmallText>
              <l.Flex alignCenter>
                {DateRangePicker}
                {BackwardButton}
                {ForwardButton}
              </l.Flex>
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to="/inventory/repacks"
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
            >
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="Repacks"
    >
      {!isEmpty(repacks) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? repacks.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = repacks[index] as RepackHeader;

            const isHighlight = item.boxesIn / item.boxesOut > 1.1;

            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<RepackHeader>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    highlightColor={th.colors.status.errorAlt}
                    isHighlight={isHighlight}
                    listLabels={indexListLabels}
                    to={`/inventory/repacks/${item.repackCode}?repackView=${
                      (item.count || 0) > 1 ? 'runs' : 'pallets'
                    }`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={items}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No repacks found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Repacks;
