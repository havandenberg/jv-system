import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { Pallet } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';
import ListItem from './list-item';

const gridTemplateColumns =
  '1.5fr 70px 2fr repeat(2, 1fr) 60px repeat(3, 1fr) 80px 30px';

const breadcrumbs = () => [
  { text: 'Inventory', to: `/sales/inventory` },
  { text: 'Pallets', to: `/sales/inventory/pallets` },
];

const Pallets = () => {
  const { Search } = useSearch();
  const { data, loading, error } = api.usePallets();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Pallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'pallet',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs()}
      extraPaddingTop={103}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Pallet Index"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Pallet>
                    data={item as Pallet}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    to={`/sales/inventory/pallets/${item.id}`}
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
            header: 'No Pallets Found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Pallets;
