import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { OrderEntry } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';
import ListItem from '../list-item';

const gridTemplateColumns = '80px 80px 90px 1fr 1fr 3fr 100px 60px 30px';

const OrderMasterList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: OrderEntry[];
}) => {
  const columnLabels = useColumns<OrderEntry>(
    'orderDate',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'order_entry',
  );

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
        items.map(
          (item, idx) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                slug={`${baseUrl}${item.orderId}/entry/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No order entries found',
          }}
        />
      )}
    </>
  );
};

export default OrderMasterList;
