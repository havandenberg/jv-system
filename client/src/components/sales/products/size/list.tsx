import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { CommonSize } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { listLabels } from './data-utils';

const SizeList = ({
  baseUrl,
  sizes,
}: {
  baseUrl: string;
  sizes: CommonSize[];
}) => {
  const columnLabels = useColumns<CommonSize>(
    'sizeName',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'common_size',
  );

  const gridTemplateColumns = '1fr 0.5fr 1fr 1fr 30px';

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(sizes) ? (
        sizes.map(
          (item, idx) =>
            item && (
              <ListItem<CommonSize>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                slug={`${baseUrl}/sizes/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={sizes}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No sizes found',
          }}
        />
      )}
    </>
  );
};

export default SizeList;
