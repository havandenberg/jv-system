import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { Customer } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { useDirectorySelectionContext } from '../selection-context';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 0.8fr 2.5fr 1.5fr 1.5fr 0.5fr 30px';

const CustomerDirectory = ({ actions, TabBar }: SubDirectoryProps) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useCustomers();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Customer>(
    'customerName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'customer',
  );

  const [
    allSelectedItems,
    { selectCustomer, isAllCustomersSelected, toggleAllCustomers },
  ] = useDirectorySelectionContext();

  const selectedItems = allSelectedItems.customers;

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs('customers')}
      extraPaddingTop={103}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
                {selectedItems.length > 0
                  ? `, Selected: ${selectedItems.length}`
                  : ''}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                <LineItemCheckbox
                  checked={isAllCustomersSelected(items)}
                  onChange={() => toggleAllCustomers(items)}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Customer Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Customer>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() => selectCustomer(item)}
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`customers/${item.id}`}
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
            header: 'No Customers Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default CustomerDirectory;
