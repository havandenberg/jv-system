import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import { useSortQueryParams } from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { Container } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';

const gridTemplateColumns = '130px 100px 1fr 1fr 1.3fr 50px 30px';

const breadcrumbs = [{ text: 'Containers', to: '/inventory/containers' }];

const Containers = () => {
  const { Search } = useSearch();
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const { data, loading, error } = api.useContainers(false);
  const containers = (data?.nodes || []) as Container[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange();

  const columnLabels = useColumns<Container>(
    'dischargeDate',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'container',
  );

  const sortedContainers = getSortedItems(
    listLabels,
    containers,
    sortBy,
    sortOrder,
  );

  return (
    <Page
      actions={[
        <l.AreaLink key="schedule" to="/inventory/containers/schedule">
          <b.Primary>Schedule</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={111}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {!loading ? sortedContainers.length : '-'}
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
                  to="/inventory/containers"
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns}
            mb={th.spacing.sm}
            pl={th.spacing.sm}
            pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
          >
            {columnLabels}
          </l.Grid>
        </>
      }
      title="Containers"
    >
      {!isEmpty(sortedContainers) ? (
        <VirtualizedList
          rowCount={data ? sortedContainers.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedContainers[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Container>
                    data={item as Container}
                    gridTemplateColumns={gridTemplateColumns}
                    index={index}
                    listLabels={listLabels}
                    to={`/inventory/containers/${item.containerId}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={sortedContainers}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No containers found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Containers;
