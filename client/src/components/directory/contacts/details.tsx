import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useUpdateItem from 'hooks/use-update-item';
import { PersonContact } from 'types';

import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';

export const internalContactBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/internal`,
  },
  { text: 'Contact', to: `/directory/internal/${id}` },
];

export const customerContactBreadcrumbs = (customerId: string, id: string) => [
  {
    text: 'Directory',
    to: `/directory/customers`,
  },
  {
    text: 'Customer',
    to: `/directory/customers/${customerId}`,
  },
  { text: 'Contact', to: `/directory/customers/${customerId}/contacts/${id}` },
];

export const shipperContactBreadcrumbs = (shipperId: string, id: string) => [
  {
    text: 'Directory',
    to: `/directory/shippers`,
  },
  {
    text: 'Shipper',
    to: `/directory/shippers/${shipperId}`,
  },
  { text: 'Contact', to: `/directory/shippers/${shipperId}/contacts/${id}` },
];

export const warehouseContactBreadcrumbs = (
  warehouseId: string,
  id: string,
) => [
  {
    text: 'Directory',
    to: `/directory/warehouses`,
  },
  {
    text: 'Warehouse',
    to: `/directory/warehouses/${warehouseId}`,
  },
  {
    text: 'Contact',
    to: `/directory/warehouses/${warehouseId}/contacts/${id}`,
  },
];

const Details = () => {
  const history = useHistory();
  const { id, customerId, shipperId, warehouseId } =
    useParams<{
      id: string;
      customerId: string;
      shipperId: string;
      warehouseId: string;
    }>();
  const isInternal = !customerId && !shipperId && !warehouseId;

  const { data, error, loading } = api.usePersonContact(id);

  const [handleUpdate] = api.useUpdatePersonContact(id);

  const updateFields = [
    'firstName',
    'lastName',
    'email',
    'secondaryEmail',
    'homePhone',
    'cellPhone',
    'workPhone',
    'workExtension',
    'roles',
    'isPrimary',
  ];
  const updateVariables = { id };

  const [handleDelete] = api.useDeletePersonContact({
    customerId,
    shipperId,
    warehouseId,
  });

  const [
    ,
    {
      removeSelectedContactsFromCustomer,
      removeSelectedContactsFromShipper,
      removeSelectedContactsFromWarehouse,
    },
  ] = useDirectorySelectionContext();

  const onAfterDelete = () => {
    if (data) {
      if (customerId) {
        removeSelectedContactsFromCustomer([data], customerId);
      }
      if (shipperId) {
        removeSelectedContactsFromShipper([data], shipperId);
      }
      if (warehouseId) {
        removeSelectedContactsFromWarehouse([data], warehouseId);
      }
    }
    const breadcrumb = breadcrumbs[isInternal ? 0 : 1];
    history.push(breadcrumb ? breadcrumb.to || '/directory' : '/directory');
  };

  const { changes, editing, handleChange, updateActions } =
    useUpdateItem<PersonContact>({
      confirmDeleteText: `Are you sure you want to delete contact for ${
        data ? data.firstName : ''
      }
      ${data ? data.lastName : ''}?`,
      data: data as PersonContact,
      deleteVariables: updateVariables,
      handleDelete: isInternal ? undefined : handleDelete,
      handleUpdate,
      onAfterDelete,
      updateFields,
      updateVariables,
    });

  const getBreadcrumbs = () => {
    if (customerId) {
      return customerContactBreadcrumbs(customerId, id);
    } else if (shipperId) {
      return shipperContactBreadcrumbs(shipperId, id);
    } else if (warehouseId) {
      return warehouseContactBreadcrumbs(warehouseId, id);
    } else {
      return internalContactBreadcrumbs(id);
    }
  };
  const breadcrumbs = getBreadcrumbs();

  return (
    <Page
      actions={updateActions}
      breadcrumbs={breadcrumbs}
      title={
        data ? `${data.firstName} ${data.lastName}` : 'Directory - Contact'
      }
    >
      {data ? (
        <BaseData<PersonContact>
          changes={changes}
          data={data}
          editing={editing}
          handleChange={handleChange}
          labels={baseLabels(isInternal)}
        />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
