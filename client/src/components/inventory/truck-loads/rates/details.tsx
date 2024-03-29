import React from 'react';
import { omit } from 'ramda';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import CustomerSelector from 'components/directory/customers/selector';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useUpdateItem from 'hooks/use-update-item';
import { Customer, TruckRate } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { baseLabels } from './data-utils';

export const breadcrumbs = (
  isList: boolean,
  vendorId: string,
  rateId: string,
) =>
  isList
    ? [
        { text: 'Truck Loads', to: `/inventory/truck-loads` },
        { text: 'Rates', to: `/inventory/truck-loads/rates` },
        { text: 'Rate', to: `/inventory/truck-loads/rates/${rateId}` },
      ]
    : [
        {
          text: 'Directory',
          to: `/directory/vendors`,
        },
        {
          text: 'Vendor',
          to: `/directory/vendors/${vendorId}?view=rates`,
        },
        {
          text: 'Rate',
          to: `/directory/vendors/${vendorId}/rates/${rateId}`,
        },
      ];

const Details = () => {
  const { pathname } = useLocation();
  const isList = pathname.includes('inventory/truck-loads/rates');

  const { id, vendorId } = useParams<{
    id: string;
    vendorId: string;
  }>();
  const { data, error, loading } = api.useTruckRate(id);

  const [handleUpdate] = api.useUpdateTruckRate(id);

  const updateFields = [
    'locationDescription',
    'isDefault',
    'fullLoadRate',
    'palletRate1',
    'palletRate2',
    'palletRate3',
    'palletRate4',
    'palletRate5',
    'palletRate6',
    'palletRate7',
    'palletRate8',
    'palletRate9',
    'palletRate10',
    'palletRate11',
    'palletRate12',
    'palletRate13',
    'palletRate14',
    'palletRate15',
    'notes',
    'truckRateCustomersUsingId',
  ];
  const updateVariables = { id };

  const { changes, editing, handleChange, getUpdateActions } =
    useUpdateItem<TruckRate>({
      data: data as TruckRate,
      handleUpdate,
      transformChangesOnUpdate: (changes) => {
        const customers = changes
          .customersByTruckRateCustomerTruckRateIdAndCustomerId
          ?.nodes as Customer[];
        const customersToDelete =
          data?.customersByTruckRateCustomerTruckRateIdAndCustomerId?.nodes.filter(
            (c) => !customers.find((nc) => nc.id === c?.id),
          );
        const newCustomers = customers.filter(
          (c) =>
            !data?.customersByTruckRateCustomerTruckRateIdAndCustomerId?.nodes.find(
              (nc) => nc?.id === c?.id,
            ),
        );
        return {
          ...omit(
            [
              'customersByTruckRateCustomerTruckRateIdAndCustomerId',
              '__typename',
              'vendor',
            ],
            changes,
          ),
          truckRateCustomersUsingId: {
            deleteByTruckRateIdAndCustomerId:
              customersToDelete?.map((c) => ({
                truckRateId: changes.id,
                customerId: c?.id,
              })) || [],
            create: newCustomers.map((c) => ({
              customerId: c.id,
            })),
          },
        };
      },
      updateFields,
      updateVariables,
    });
  const customers = (changes
    ?.customersByTruckRateCustomerTruckRateIdAndCustomerId?.nodes ||
    []) as Customer[];

  return (
    <Page
      actions={[
        ...getUpdateActions().defaultActions,
        <l.AreaLink
          key="all-rates"
          ml={th.spacing.lg}
          to="/inventory/truck-loads/rates"
        >
          <b.Primary>All Rates</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs(isList, vendorId, id)}
      title={data ? data.locationDescription || 'Rate' : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<TruckRate>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels}
          />
          <CustomerSelector
            customers={customers}
            editing={editing}
            handleAdd={(customer) => {
              handleChange(
                'customersByTruckRateCustomerTruckRateIdAndCustomerId',
                {
                  nodes: [...customers, customer],
                },
              );
            }}
            handleRemove={(customer) => {
              handleChange(
                'customersByTruckRateCustomerTruckRateIdAndCustomerId',
                {
                  ...changes?.customersByTruckRateCustomerTruckRateIdAndCustomerId,
                  nodes: customers.filter((c) => c.id !== customer.id),
                },
              );
            }}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
