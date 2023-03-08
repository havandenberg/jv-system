import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { RepackHeader } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = `1fr 1fr 100px 100px 100px 2fr 30px`;

const RepackList = ({
  baseUrl,
  items,
}: {
  baseUrl?: string;
  items: RepackHeader[];
}) => {
  const columnLabels = useColumns<RepackHeader>(
    'repackDate',
    SORT_ORDER.DESC,
    listLabels,
    'operations',
    'repack_header',
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
                to={`${baseUrl}${item.repackCode}?runNumber=${item.runNumber}&repackView=items`}
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

export default RepackList;
