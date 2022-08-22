import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { CommonVariety } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { listLabels } from './data-utils';

const VarietyList = ({
  baseUrl,
  varieties,
}: {
  baseUrl: string;
  varieties: CommonVariety[];
}) => {
  const columnLabels = useColumns<CommonVariety>(
    'varietyName',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'common_variety',
  );

  const gridTemplateColumns = '100px 0.8fr 0.5fr 1fr 1fr 30px';

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(varieties) ? (
        varieties.map(
          (item, idx) =>
            item && (
              <ListItem<CommonVariety>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                slug={`${baseUrl}/varieties/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={varieties}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No varieties found',
          }}
        />
      )}
    </>
  );
};

export default VarietyList;
