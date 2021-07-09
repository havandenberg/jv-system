import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { Warehouse } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { useDirectorySelectionContext } from '../selection-context';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 0.5fr 2fr 1.5fr 0.5fr 1.5fr 30px';

const WarehouseDirectory = ({ actions, TabBar }: SubDirectoryProps) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useWarehouses();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Warehouse>(
    'warehouseName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'warehouse',
  );

  const [
    allSelectedItems,
    { selectWarehouse, isAllWarehousesSelected, toggleAllWarehouses },
  ] = useDirectorySelectionContext();

  const selectedItems = allSelectedItems.warehouses;

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs('warehouses')}
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
                  checked={isAllWarehousesSelected(items)}
                  onChange={() => toggleAllWarehouses(items)}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Warehouse Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Warehouse>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() => selectWarehouse(item)}
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`warehouses/${item.id}`}
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
            header: `No Warehouses Found 😔`,
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default WarehouseDirectory;
