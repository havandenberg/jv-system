import React from 'react';
import { isEmpty } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { CommonSpecies } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { listLabels } from './data-utils';

const SpeciesList = ({
  baseUrl,
  specieses,
}: {
  baseUrl: string;
  specieses: CommonSpecies[];
}) => {
  const columnLabels = useColumns<CommonSpecies>(
    'speciesName',
    SORT_ORDER.ASC,
    listLabels(false),
    'product',
    'common_species',
  );

  const gridTemplateColumns = '100px 0.8fr 1fr 1fr 30px';

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(specieses) ? (
        specieses.map(
          (item, idx) =>
            item && (
              <ListItem<CommonSpecies>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels(false)}
                slug={`${baseUrl}/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={specieses}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No species found',
          }}
        />
      )}
    </>
  );
};

export default SpeciesList;
