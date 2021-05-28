import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Warehouse } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 2fr 1.5fr 0.5fr 1.5fr 30px';

const WarehouseDirectory = ({
  actions,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: SubDirectoryProps) => {
  const { data, loading, error } = api.useWarehouses();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Warehouse>(
    'warehouseName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'warehouse',
  );

  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === (data ? data.totalCount : -1);
  const handleSelectAll = () => {
    toggleSelectAll(
      isAllSelected,
      (items as Warehouse[]).map((warehouse) => ({
        id: warehouse.id,
        email: '',
        description: ` - Warehouse`,
      })),
    );
  };

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.lg} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                <LineItemCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
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
                    onSelectItem={() =>
                      selectItem({
                        id: item.id,
                        email: '',
                        description: ` - Warehouse`,
                      })
                    }
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
