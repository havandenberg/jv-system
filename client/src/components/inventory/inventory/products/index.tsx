import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { ProductMaster } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';

export const breadcrumbs = (slug: string) => [
  { text: 'Products', to: `/products/${slug}` },
];

const tabs: Tab[] = [
  {
    id: 'products',
    text: 'Products',
    to: `/inventory/products`,
  },
  {
    id: 'species',
    text: 'Species',
    to: `/inventory/products/species`,
  },
  {
    id: 'varieties',
    text: 'Varieties',
    to: `/inventory/products/varieties`,
  },
  {
    id: 'sizes',
    text: 'Sizes',
    to: `/inventory/products/sizes`,
  },
  {
    id: 'pack-types',
    text: 'Pack Types',
    to: `/inventory/products/pack-types`,
  },
];

const gridTemplateColumns = 'repeat(5, 1fr) 30px';

const ProductIndex = () => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useProductMasters();
  const items = data ? data.nodes : [];

  const { TabBar } = useTabBar({ tabs, isRoute: true });

  const columnLabels = useColumns<ProductMaster>(
    'id',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'product_master',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs('')}
      extraPaddingTop={103}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            <TabBar />
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm} secondary>
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
      title="Product Index"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<ProductMaster>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    index={index}
                    listLabels={listLabels}
                    to={`/inventory/products/${item.id}`}
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
            header: 'No products found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ProductIndex;
