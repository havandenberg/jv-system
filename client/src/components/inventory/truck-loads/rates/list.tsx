import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { TruckRate } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';

export const gridTemplateColumns = '80px 80px 100px 1fr 0.4fr 30px';

const TruckRateList = ({ truckRates }: { truckRates: TruckRate[] }) => {
  const columnLabels = useColumns<TruckRate>(
    'postalState',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'truck_rate',
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
      {!isEmpty(truckRates) ? (
        truckRates.map(
          (item, idx) =>
            item && (
              <ListItem<TruckRate>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                to={`/directory/vendors/${item.vendor?.id}/rates/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={truckRates}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No truck rates found',
          }}
        />
      )}
    </>
  );
};

export default TruckRateList;
