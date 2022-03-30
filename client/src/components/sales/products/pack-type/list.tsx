import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { CommonPackType } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { listLabels } from './data-utils';

const PackTypeList = ({
  baseUrl,
  packTypes,
}: {
  baseUrl: string;
  packTypes: CommonPackType[];
}) => {
  const columnLabels = useColumns<CommonPackType>(
    'packTypeName',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'common_pack_type',
  );

  const gridTemplateColumns = '1fr 2fr 30px';

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(packTypes) ? (
        packTypes.map(
          (item, idx) =>
            item && (
              <ListItem<CommonPackType>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                slug={`${baseUrl}/packTypes/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={packTypes}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No pack types found',
          }}
        />
      )}
    </>
  );
};

export default PackTypeList;
