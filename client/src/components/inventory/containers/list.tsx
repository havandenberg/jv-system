import React from 'react';
import { isEmpty } from 'ramda';

import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { Container } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

const gridTemplateColumns = '1fr 120px repeat(3, 1fr) 1.5fr 80px 50px 30px';

const ContainerList = ({ containers }: { containers: Container[] }) => {
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const columnLabels = useColumns<Container>(
    'dischargeDate',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'container',
  );

  const sortedContainers = getSortedItems(
    listLabels,
    containers,
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
      {!isEmpty(sortedContainers) ? (
        sortedContainers.map(
          (container, idx) =>
            container && (
              <ListItem<Container>
                data={container}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                to={`/inventory/containers/${container.containerId}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={sortedContainers}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No containers found',
          }}
        />
      )}
    </>
  );
};

export default ContainerList;
