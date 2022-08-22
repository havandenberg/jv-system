import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import {
  useOrdersQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { OrderItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { getSortedItems } from '../data-utils';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = (backOrderId?: string) =>
  `${
    backOrderId ? '' : '70px '
  }70px repeat(2, 1fr) 0.7fr 0.7fr 70px 70px 70px 100px 80px 30px`;

const OrderItemList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: OrderItem[];
}) => {
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
          (item, idx) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(backOrderId)}
                key={idx}
                listLabels={listLabels(backOrderId)}
                slug={`${baseUrl}?backOrderId=${item.backOrderId}&lineId=${item.lineId}`}
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
