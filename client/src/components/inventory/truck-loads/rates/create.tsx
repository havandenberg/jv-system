import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { omit } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import CustomerSelector from 'components/directory/customers/selector';
import Page from 'components/page';
import usePrevious from 'hooks/use-previous';
import { Customer, TruckRate } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { baseLabels } from './data-utils';

export const breadcrumbs = (vendorId: string) => [
  {
    text: 'Directory',
    to: `/directory/vendors`,
  },
  { text: 'Vendor', to: `/directory/vendors/${vendorId}?view=rates` },
  {
    text: 'Create Rate',
    to: `/directory/vendors/${vendorId}/rates/create`,
  },
];

const CreateTruckRate = () => {
  const history = useHistory();

  const { vendorId } = useParams<{
    vendorId: string;
  }>();
  const { data, loading } = api.useVendor(vendorId);
  const previousLoading = usePrevious(loading);

  const cancelLink = `/directory/vendors/${vendorId}?view=rates`;

  const [handleCreate] = api.useCreateTruckRate();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const initialState = useMemo(
    () => ({
      vendorId,
      vendor: data,
      locationDescription: '',
      isDefault: false,
      fullLoadRate: 0,
      palletRate1: 0,
      palletRate2: 0,
      palletRate3: 0,
      palletRate4: 0,
      palletRate5: 0,
      palletRate6: 0,
      palletRate7: 0,
      palletRate8: 0,
      palletRate9: 0,
      palletRate10: 0,
      palletRate11: 0,
      palletRate12: 0,
      palletRate13: 0,
      palletRate14: 0,
      palletRate15: 0,
      notes: '',
    }),
    [data, vendorId],
  );

  const [changes, setChanges] = useState<TruckRate>(initialState as TruckRate);

  const handleChange = (field: keyof TruckRate, value: any) => {
    setChanges({ ...changes, [field]: value } as TruckRate);
  };
  const customers = (changes
    ?.customersByTruckRateCustomerTruckRateIdAndCustomerId?.nodes ||
    []) as Customer[];

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          truckRate: {
            ...omit(
              [
                'customersByTruckRateCustomerTruckRateIdAndCustomerId',
                'vendor',
              ],
              changes,
            ),
            truckRateCustomersUsingId: {
              create: customers.map((c) => ({ customerId: c.id })),
            },
          },
        },
      }).then(() => {
        history.push(cancelLink);
      });
    }
  };

  useEffect(() => {
    if (previousLoading && !loading) {
      setChanges(initialState as TruckRate);
    }
  }, [loading, previousLoading, initialState]);

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Error width={88}>Cancel</b.Error>
          </l.AreaLink>
          <b.Success ml={th.spacing.md} onClick={handleSave} width={88}>
            {createLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Create'
            )}
          </b.Success>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs(vendorId)}
      title="Create Truck Rate"
    >
      <BaseData<TruckRate>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels}
        showValidation={saveAttempt}
      />
      <CustomerSelector
        customers={customers}
        editing
        handleAdd={(customer) => {
          handleChange('customersByTruckRateCustomerTruckRateIdAndCustomerId', {
            nodes: [...customers, customer],
          });
        }}
        handleRemove={(customer) => {
          handleChange('customersByTruckRateCustomerTruckRateIdAndCustomerId', {
            ...changes?.customersByTruckRateCustomerTruckRateIdAndCustomerId,
            nodes: customers.filter((c) => c.id !== customer.id),
          });
        }}
      />
    </Page>
  );
};

export default CreateTruckRate;
