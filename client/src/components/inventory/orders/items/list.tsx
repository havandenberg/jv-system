import React from 'react';
import { differenceInDays } from 'date-fns';
import { isEmpty } from 'ramda';

import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import {
  useOrdersQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { OrderItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = (backOrderId?: string) =>
  `${
    backOrderId ? '' : '60px '
  }60px repeat(2, 1fr) 0.7fr 75px 70px 60px 80px 100px 60px 60px 100px 60px 30px`;

const OrderItemList = ({ items }: { items: OrderItem[] }) => {
  const [{ sortBy = 'backOrderId', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [{ backOrderId }] = useOrdersQueryParams();

  const columnLabels = useColumns<OrderItem>(
    'backOrderId',
    SORT_ORDER.ASC,
    listLabels(backOrderId),
    'operations',
    'order_item',
  );

  const sortedOrderItems = getSortedItems(
    listLabels(backOrderId),
    items,
    sortBy,
    sortOrder,
  );

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns(backOrderId)}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(sortedOrderItems) ? (
        sortedOrderItems.map(
          (item) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(backOrderId)}
                highlightColor={th.colors.status.warningSecondary}
                isHighlight={
                  item.order?.expectedShipDate &&
                  differenceInDays(
                    new Date(item.order?.expectedShipDate.replace(/-/g, '/')),
                    new Date(
                      item.inventoryItem?.vessel?.dischargeDate.replace(
                        /-/g,
                        '/',
                      ),
                    ),
                  ) > 7
                }
                key={`${item.backOrderId}-${item.lineId}`}
                listLabels={listLabels(backOrderId)}
                to={
                  item?.inventoryItem
                    ? `/inventory/items/${item?.inventoryItem?.id}`
                    : undefined
                }
              />
            ),
        )
      ) : (
        <DataMessage
          data={sortedOrderItems}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No order items found',
          }}
        />
      )}
    </>
  );
};

export default OrderItemList;
