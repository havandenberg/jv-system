import React from 'react';
import { differenceInDays } from 'date-fns';
import { isEmpty } from 'ramda';

import { OrderItemInvoiceItem } from 'components/inventory/orders/data-utils';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { OrderItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';
import { getSortedItems } from 'components/column-label';
import { useSortQueryParams } from 'hooks/use-query-params';

const gridTemplateColumns = '60px 60px 1fr 60px 80px 0.7fr 60px 60px 80px 30px';

const InvoiceListItem = ({ item }: { item: OrderItem }) => {
  return (
    <ListItem
      data={item}
      gridTemplateColumns={gridTemplateColumns}
      highlightColor={th.colors.status.warningSecondary}
      isHalfHighlight={
        item.order?.expectedShipDate &&
        differenceInDays(
          new Date(item.order?.expectedShipDate.replace(/-/g, '/')),
          new Date(
            item.inventoryItem?.vessel?.dischargeDate.replace(/-/g, '/'),
          ),
        ) > 7
      }
      key={`${item.backOrderId}-${item.lineId}`}
      listLabels={listLabels}
    />
  );
};

type Props = {
  items: OrderItemInvoiceItem[];
};

const List = ({ items }: Props) => {
  const [{ sortBy, sortOrder }] = useSortQueryParams();
  const columnLabels = useColumns<OrderItem>(
    'backOrderId',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'order_item',
  );

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
      {!isEmpty(items) ? (
        sortedItems.map((item) => (
          <InvoiceListItem
            key={`${item.orderId}-${item.backOrderId}-${item.lineId}`}
            item={item}
          />
        ))
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No invoice items found',
          }}
        />
      )}
    </>
  );
};

export default List;
