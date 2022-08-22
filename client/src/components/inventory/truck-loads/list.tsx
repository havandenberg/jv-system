import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { TruckLoad } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';
import ListItem from './list-item';

const gridTemplateColumns = `1fr 1fr 2fr 1fr 100px 100px 100px 30px`;

const TruckLoadList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: TruckLoad[];
}) => {
  const columnLabels = useColumns<TruckLoad>(
    'vendorId',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'truck_load',
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
                slug={`${baseUrl}${item.loadId}?location=${item.warehouse?.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No truck loads found',
          }}
        />
      )}
    </>
  );
};

export default TruckLoadList;
