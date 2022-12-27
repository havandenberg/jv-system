import React from 'react';
import { isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import {
  useInventoryQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { USE_NEW_PRE_INVENTORY } from '..';
import { listLabels } from './data-utils';

const gridTemplateColumns = (secondaryDetailsIndex: string) =>
  `3.5fr ${
    secondaryDetailsIndex ? 'repeat(5, 1.5fr)' : '7.5fr'
  } repeat(3, 70px)${secondaryDetailsIndex ? ' 50px' : ''} 30px`;

const InventoryItemList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: InventoryItem[];
}) => {
  const { search } = useLocation();

  const [{ sortBy = 'shipper', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [{ secondaryDetailsIndex }] = useInventoryQueryParams();

  const columnLabels = useColumns<InventoryItem>(
    'shipper',
    SORT_ORDER.ASC,
    listLabels(secondaryDetailsIndex),
    'product',
    'inventory_item',
  );

  const sortedItems = getSortedItems(
    listLabels(secondaryDetailsIndex),
    items,
    sortBy,
    sortOrder,
  );

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns(secondaryDetailsIndex)}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(sortedItems) ? (
        sortedItems.map(
          (item) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(secondaryDetailsIndex)}
                key={item.id}
                listLabels={listLabels(secondaryDetailsIndex)}
                isHighlight={item.jvLotNumber === 'D0000'}
                isHalfHighlight={item.jvLotNumber === 'PARTIAL_DISTRESS'}
                to={
                  secondaryDetailsIndex
                    ? item.vessel?.isPre && USE_NEW_PRE_INVENTORY
                      ? `/sales/projections?coast=${item.vessel?.coast}&startDate=${item.vessel?.departureDate}&endDate=${item.vessel?.departureDate}&projectionsView=grid&shipperId=${item.shipper?.id}&vesselId=${item.vessel?.id}&projectionId=all`
                      : `${baseUrl}/items/${item.id}${search}`
                    : `${baseUrl}${search}&secondaryDetailsIndex=${item.vessel?.id}-${item.shipper?.id}-${item.product?.species?.id}`
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
