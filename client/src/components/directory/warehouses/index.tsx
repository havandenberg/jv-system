import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import ListItem from 'components/list-item';
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
import { useDirectorySelectionContext } from '../selection-context';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 0.5fr 2fr 1.5fr 0.5fr 1.5fr 30px';

const WarehouseDirectory = ({ actions }: SubDirectoryProps) => {
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
      extraPaddingTop={117}
      headerChildren={
        <>
          <l.Flex alignEnd mb={th.spacing.lg} justifyBetween>
            <div>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {data ? data.totalCount : '-'}
                    {selectedItems.length > 0
                      ? `, Selected: ${selectedItems.length}`
                      : ''}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </div>
          </l.Flex>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
            >
              <LineItemCheckbox
                checked={isAllWarehousesSelected(items)}
                onChange={() => toggleAllWarehouses(items)}
                status="warning"
              />
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="Warehouses"
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
                  <ListItem<Warehouse>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() => selectWarehouse(item)}
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    to={`/directory/warehouses/${item.id}`}
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
            header: `No Warehouses found`,
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default WarehouseDirectory;
