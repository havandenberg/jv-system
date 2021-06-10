import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Shipper } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 1fr 3fr 2fr 2fr 30px';

const ShipperDirectory = ({
  actions,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: SubDirectoryProps) => {
  const { data, loading, error } = api.useShippers();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Shipper>(
    'shipperName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'shipper',
  );

  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === (data ? data.totalCount : -1);

  const handleSelectAll = () => {
    toggleSelectAll(
      isAllSelected,
      (items as Shipper[]).map((shipper) => ({
        id: shipper.id,
        email: '',
        description: ` - Shipper`,
      })),
    );
  };

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs}
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
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Shipper Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Shipper>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() =>
                      selectItem({
                        id: item.id,
                        email: '',
                        description: ` - Shippers`,
                      })
                    }
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`shippers/${item.id}`}
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
            header: 'No Shippers Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ShipperDirectory;
