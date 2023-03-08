import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { RepackQueue } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = `0.7fr 0.7fr 2fr 1.2fr 0.6fr 0.7fr 0.7fr 30px`;

const RepackQueueList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: RepackQueue[];
}) => {
  const columnLabels = useColumns<RepackQueue>(
    'repackDate',
    SORT_ORDER.DESC,
    listLabels,
    'operations',
    'repack_queue',
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
                to={`${baseUrl}${item.repackCode}?repackView=items`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No repacks found',
          }}
        />
      )}
    </>
  );
};

export default RepackQueueList;
