import React from 'react';
import { isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { USE_NEW_PRE_INVENTORY } from '..';
import { getSortedItems } from '../utils';
import { listLabels } from './data-utils';
import ListItem from './list-item';

const gridTemplateColumns = '3.5fr repeat(5, 1.5fr) repeat(3, 90px) 30px';

const InventoryItemList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: InventoryItem[];
}) => {
  const { search } = useLocation();
  const columnLabels = useColumns<InventoryItem>(
    'shipper',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'inventory_item',
  );

  const [{ sortBy = 'shipper', sortOrder = SORT_ORDER.ASC }] =
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
                to={
                  item.vessel?.isPre && USE_NEW_PRE_INVENTORY
                    ? `/sales/projections?coast=${item.vessel?.coast}&startDate=${item.vessel?.departureDate}&endDate=${item.vessel?.departureDate}&projectionsView=grid&shipperId=${item.shipper?.id}&vesselId=${item.vessel?.id}&projectionId=all`
                    : `${baseUrl}/items/${item.id}${search}`
                }
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No inventory items found',
          }}
        />
      )}
    </>
  );
};

export default InventoryItemList;
