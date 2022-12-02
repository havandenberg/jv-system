import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { CommonSpecies, OrderEntry } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = '1fr 1fr 0.8fr 1fr 3fr 80px 30px';

const OrderEntryList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: OrderEntry[];
}) => {
  const [{ sortBy = 'orderDate', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const { data: speciesData } = api.useCommonSpecieses();
  const specieses = (speciesData ? speciesData.nodes : []) as CommonSpecies[];

  const columnLabels = useColumns<OrderEntry>(
    'orderDate',
    SORT_ORDER.ASC,
    listLabels(specieses),
    'operations',
    'order_entry',
  );

  const sortedOrderEntries = getSortedItems(
    listLabels(specieses),
    items,
    sortBy,
    sortOrder,
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
      {!isEmpty(sortedOrderEntries) ? (
        sortedOrderEntries.map(
          (item, idx) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels(specieses)}
                to={`${baseUrl}${item.orderId}/entry/${item.id}`}
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

export default OrderEntryList;
