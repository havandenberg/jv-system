import React from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { isEmpty } from 'ramda';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import {
  useSortQueryParams,
  useTruckLoadsQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { TruckLoad } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ResetButton } from '../inventory/use-filters';
import { getSortedItems } from '../orders/data-utils';
import { indexListLabels } from './data-utils';
import ListItem from './list-item';

export const breadcrumbs = [
  { text: 'Truck Loads', to: `/inventory/truck-loads` },
];

const gridTemplateColumns = '1fr 1fr 1fr 2fr 1fr 0.5fr 30px';

const TruckLoads = () => {
  const { Search } = useSearch();
  const [{ sortBy = 'shipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ coast = 'EC' }] = useTruckLoadsQueryParams();
  const { data, loading, error } = api.useTruckLoads();
  const items = (data ? data.nodes : []) as TruckLoad[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<TruckLoad>(
    'shipDate',
    SORT_ORDER.DESC,
    indexListLabels,
    'operations',
    'truck_load',
  );

  const sortedItems = getSortedItems(indexListLabels, items, sortBy, sortOrder);

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={115}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {data ? data.totalCount : '-'}
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
                  to={`/inventory/truck-loads?coast=${coast}`}
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
      title="Truck Loads"
    >
      {!isEmpty(sortedItems) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? sortedItems.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedItems[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<TruckLoad>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={indexListLabels}
                    slug={`truck-loads/${item.loadId}`}
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
            header: 'No truck loads found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default TruckLoads;
