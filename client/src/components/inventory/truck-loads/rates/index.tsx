import React from 'react';
import { groupBy, isEmpty } from 'ramda';

import api from 'api';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { TruckRate } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { indexListLabels } from './data-utils';
import postalStates from 'utils/postal-states';

export const breadcrumbs = [
  { text: 'Truck Loads', to: `/inventory/truck-loads` },
  { text: 'Rates', to: `/inventory/truck-loads/rates` },
];

export const gridTemplateColumns = '200px 80px 100px 1fr 30px';

const TruckRates = () => {
  const { data, loading, error } = api.useTruckRates();
  const truckRates = (data ? data.nodes : []) as TruckRate[];

  const columnLabels = useColumns<TruckRate>(
    'vendorId',
    SORT_ORDER.ASC,
    indexListLabels,
    'operations',
    'truck_rate',
  );

  const groupedTruckRates = groupBy(
    (item: TruckRate) => item.postalState || 'Other',
    truckRates,
  );

  const states = Object.keys(groupedTruckRates).sort();

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={65}
      headerChildren={
        <>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              mt={th.spacing.lg}
              pl={th.spacing.sm}
              pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
            >
              {columnLabels}
            </l.Grid>
          )}
        </>
      }
      title="Truck Rates"
    >
      {!isEmpty(truckRates) ? (
        states.map((state, idx) => {
          const stateInfo = postalStates.find(
            (stateInfo) => stateInfo.value === state,
          );
          const rates = groupedTruckRates[state];
          return (
            stateInfo && (
              <l.Div key={idx} mb={th.spacing.lg}>
                <ty.LargeText bold mb={th.spacing.sm}>
                  {state} - {stateInfo.content}
                </ty.LargeText>
                {rates.map((rate) => (
                  <ListItem<TruckRate>
                    data={rate}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={indexListLabels}
                    to={`/directory/vendors/${rate.vendor?.id}/rates/${rate.id}`}
                  />
                ))}
              </l.Div>
            )
          );
        })
      ) : (
        <DataMessage
          data={truckRates}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No truck rates found',
          }}
        />
      )}
    </Page>
  );
};

export default TruckRates;
