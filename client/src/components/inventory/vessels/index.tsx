import React from 'react';
import { add, endOfISOWeek } from 'date-fns';
import { isEmpty } from 'ramda';

import api from 'api';
import ResetImg from 'assets/images/reset';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import { Vessel } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { coastTabs, ResetButton } from '../inventory/use-filters';
import { listLabels } from './data-utils';

export const breadcrumbs = [{ text: 'Vessels', to: `/inventory/vessels` }];

const gridTemplateColumns = '1fr 0.5fr 2fr 1fr 2fr 0.5fr 30px';

const Vessels = () => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useVessels();
  const items = data ? data.nodes : [];

  const { TabBar: CoastFilter, selectedTabId: coast } = useTabBar(
    coastTabs,
    false,
    'EC',
    'coast',
    1,
  );

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<Vessel>(
    'dischargeDate',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'vessel',
  );

  return (
    <Page
      // actions={[
      //   <l.AreaLink
      //     key="create"
      //     to={`/inventory/vessels/create?coast=${coast}`}
      //   >
      //     <b.Success>Create</b.Success>
      //   </l.AreaLink>,
      // ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={115}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Coast
              </ty.SmallText>
              <CoastFilter />
            </l.Div>
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
                  to={`/inventory/orders?coast=${coast}`}
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
      title="Vessels"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Vessel>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    to={`/inventory/vessels/${item.vesselCode}`}
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
            header: 'No vessels found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Vessels;
