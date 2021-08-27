import React from 'react';
import { isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { getSortedItems } from '../utils';
import ListItem from './list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '80px 2.5fr repeat(5, 1.5fr) repeat(3, 90px) 30px';

const InventoryItemList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: InventoryItem[];
}) => {
  const { search } = useLocation();
  const columnLabels = useColumns<InventoryItem>(
    'id',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'inventory_item',
  );

  const [{ sortBy = 'vessel', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const sortedItems = getSortedItems(listLabels, items, sortBy, sortOrder);

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(sortedItems) ? (
        sortedItems.map(
          (item, idx) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                to={`${baseUrl}/items/${item.id}${search}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No Inventory Items Found',
          }}
        />
      )}
    </>
  );
};

export default InventoryItemList;
