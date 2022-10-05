import React from 'react';
import { add, endOfISOWeek } from 'date-fns';
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
import { ExpenseHeader } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';

export const breadcrumbs = [{ text: 'Expenses', to: `/accounting/expenses` }];

const gridTemplateColumns = '2fr 0.8fr 0.8fr 2fr 1fr 1fr 0.7fr 30px';

const Expenses = () => {
  const { Search } = useSearch();
  const [{ sortBy, sortOrder }] = useSortQueryParams();

  const { data, loading, error } = api.useExpenses();
  const items = (data ? data.nodes : []) as ExpenseHeader[];

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<ExpenseHeader>(
    'vesselCode',
    SORT_ORDER.DESC,
    listLabels,
    'accounting',
    'expense_header',
  );

  const sortedExpenses = getSortedItems(listLabels, items, sortBy, sortOrder);

  return (
    <Page
      actions={[
        <l.AreaLink key="summary" to="/accounting/expenses/summary">
          <b.Primary>Summary</b.Primary>
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
                  to="/accounting/expenses"
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
      title="Expenses"
    >
      {!isEmpty(sortedExpenses) ? (
        <VirtualizedList
          height={582}
          rowCount={data ? sortedExpenses.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = sortedExpenses[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<ExpenseHeader>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    to={`/accounting/expenses/${item.vendor?.id}-${item.voucherId}`}
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
            header: 'No expenses found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Expenses;
