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
import {
  useSortQueryParams,
  useTruckLoadsQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { TruckLoad } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ResetButton } from '../inventory/use-filters';
import { indexListLabels, isTruckLoadOverweight } from './data-utils';

export const breadcrumbs = [
  { text: 'Truck Loads', to: `/inventory/truck-loads` },
];

const gridTemplateColumns = '0.4fr 0.6fr 0.6fr 1.5fr 1.5fr 0.3fr 30px';

const TruckLoads = () => {
  const { Search } = useSearch();
  const [{ sortBy = 'shipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ coast = 'EC', customerId }] = useTruckLoadsQueryParams();
  const { data, loading, error } = api.useTruckLoads(
    sortBy === 'customerId' ? 'SHIP_DATE_DESC' : undefined,
  );
  const items = (data ? data.nodes : []) as TruckLoad[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<TruckLoad>(
    'shipDate',
    SORT_ORDER.DESC,
    indexListLabels(sortOrder, customerId),
    'operations',
    'truck_load',
  );

  const filteredItems = getFilteredItems(
    indexListLabels(sortOrder, customerId),
    items,
  );

  const truckLoadsGroupedByLocation = filteredItems.reduce((acc, item) => {
    const { loadId } = item || {};

    if (!acc || !loadId) {
      return acc;
    }

    if (!acc[loadId]) {
      acc[loadId] = [];
    }

    acc[loadId].push(item as TruckLoad);

    return acc;
  }, {} as { [key: string]: TruckLoad[] });

  const truckLoads = Object.values(truckLoadsGroupedByLocation)
    .map(
      (truckLoadGroup) =>
        truckLoadGroup.find((tl) => {
          const customer = (tl.orderMaster || tl.invoiceHeaders?.nodes?.[0])
            ?.billingCustomer;
          return !!customer;
        }) || truckLoadGroup[0],
    )
    .flat();

  const sortedTruckLoads = getSortedItems(
    indexListLabels(sortOrder, customerId),
    truckLoads,
    sortBy,
    sortOrder,
  );

  return (
    <Page
      actions={[
        <l.AreaLink key="rates" to="/inventory/truck-loads/rates">
          <b.Primary>Rates</b.Primary>
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
                    Results: {sortedTruckLoads ? sortedTruckLoads.length : '-'}
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
      {!isEmpty(sortedTruckLoads) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? sortedTruckLoads.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedTruckLoads[index] as TruckLoad;

            const isOverweight = isTruckLoadOverweight(item);

            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<TruckLoad>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    highlightColor={th.colors.status.errorAlt}
                    index={index}
                    isHighlight={isOverweight}
                    listLabels={indexListLabels(sortOrder, customerId)}
                    to={`/inventory/truck-loads/${item.loadId}?truckLoadView=${
                      (item.count || 0) > 1 ? 'pickupLocations' : 'pallets'
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
            header: 'No truck loads found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default TruckLoads;
