import React from 'react';
import { isEmpty } from 'ramda';

import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { TruckRate } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { gridTemplateColumns } from '.';
import { listLabels } from './data-utils';

const TruckRateList = ({
  baseUrl,
  truckRates,
}: {
  baseUrl: string;
  truckRates: TruckRate[];
}) => {
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
                to={`${baseUrl}/rates/${item.id}`}
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