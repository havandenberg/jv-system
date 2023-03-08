import React from 'react';
import { isEmpty } from 'ramda';

import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { RepackItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = '1fr 1fr 70px 1fr 100px 100px 100px 1.5fr 30px';

const RepackItemList = ({ items }: { items: RepackItem[] }) => {
  const [{ sortBy = 'palletId', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const columnLabels = useColumns<RepackItem>(
    'palletId',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'repack_item',
  );

  const sortedRepackItems = getSortedItems(
    listLabels,
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
      {!isEmpty(sortedRepackItems) ? (
        sortedRepackItems.map(
          (item) =>
            item && (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={`${item.palletId}-${item.newPalletId}`}
                listLabels={listLabels}
              />
            ),
        )
      ) : (
        <DataMessage
          data={sortedRepackItems}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No repack items found',
          }}
        />
      )}
    </>
  );
};

export default RepackItemList;
