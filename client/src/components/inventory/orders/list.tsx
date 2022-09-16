import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { OrderMaster } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = `70px 1fr 2fr 2fr 80px 30px`;

const OrderMasterList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: OrderMaster[];
}) => {
  const columnLabels = useColumns<OrderMaster>(
    'backOrderId',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'order_master',
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
                to={`${baseUrl}${item.orderId}?backOrderId=${item.backOrderId}&orderView=orderItems`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No order masters found',
          }}
        />
      )}
    </>
  );
};

export default OrderMasterList;
