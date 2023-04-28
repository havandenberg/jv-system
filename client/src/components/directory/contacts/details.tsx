import React, { Fragment } from 'react';
import { equals, pluck, sortBy } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useUpdateItem from 'hooks/use-update-item';
import { Customer, PersonContact, Shipper, Vendor, Warehouse } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { useDirectorySelectionContext } from '../selection-context';
import { baseLabels } from './data-utils';
import useContactCompanyInfo from './use-contact-company-info';

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

export const vendorContactBreadcrumbs = (vendorId: string, id: string) => [
  {
    text: 'Directory',
    to: `/directory/vendors`,
  },
  {
    text: 'Vendor',
    to: `/directory/vendors/${vendorId}`,
  },
  {
    text: 'Contact',
    to: `/directory/vendors/${vendorId}/contacts/${id}`,
  },
];

const Details = () => {
  const history = useHistory();
  const { id, customerId, shipperId, warehouseId, vendorId } = useParams<{
    id: string;
    customerId: string;
    shipperId: string;
    warehouseId: string;
    vendorId: string;
  }>();
  const isInternal = !customerId && !shipperId && !warehouseId && !vendorId;

  const { data, error, loading } = api.usePersonContact(id);
  const { data: customer } = api.useCustomer(customerId);
  const { data: shipper } = api.useShipper(shipperId);
  const { data: warehouse } = api.useWarehouse(warehouseId);
  const { data: vendor } = api.useVendor(vendorId);

  const [handleUpdate] = api.useUpdatePersonContact(id);

  const updateFields = [
    'firstName',
    'lastName',
    'email',
    'secondaryEmail',
    'homePhone',
    'homeExtension',
    'cellPhone',
    'workPhone',
    'workExtension',
    'roles',
    'location',
    'isPrimary',
  ];
  const updateVariables = { id };

  const [handleDelete] = api.useDeletePersonContact({
    customerId,
    shipperId,
    warehouseId,
    vendorId,
  });

  const [
    ,
    {
      removeSelectedContactsFromCustomer,
      removeSelectedContactsFromShipper,
      removeSelectedContactsFromWarehouse,
      removeSelectedContactsFromVendor,
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
      if (vendorId) {
        removeSelectedContactsFromVendor([data], vendorId);
      }
    }
    const breadcrumb = breadcrumbs[isInternal ? 0 : 1];
    history.push(breadcrumb ? breadcrumb.to || '/directory' : '/directory');
  };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<PersonContact>({
      confirmDeleteText: `Are you sure you want to delete contact for ${
        data ? data.firstName : ''
      }
      ${data ? data.lastName : ''}?`,
      data: data as PersonContact,
      deleteVariables: updateVariables,
      handleDelete: isInternal ? undefined : handleDelete,
      handleUpdate,
      updateFields,
      updateVariables,
      validationLabels: baseLabels(true, isInternal),
    });

  const {
    allCustomers,
    allShippers,
    allWarehouses,
    allVendors,
    info,
    handleReset,
  } = useContactCompanyInfo({
    customer,
    defaultAdditionalCustomers: data
      ? (
          data.customersByCustomerPersonContactPersonContactIdAndCustomerId
            .nodes as Customer[]
        ).filter((c) => c.id !== customerId)
      : [],
    editing,
    shipper,
    defaultAdditionalShippers: data
      ? (
          data.shippersByShipperPersonContactPersonContactIdAndShipperId
            .nodes as Shipper[]
        ).filter((s) => s.id !== shipperId)
      : [],
    warehouse,
    defaultAdditionalWarehouses: data
      ? (
          data.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
            .nodes as Warehouse[]
        ).filter((w) => w.id !== warehouseId)
      : [],
    vendor,
    defaultAdditionalVendors: data
      ? (
          data.vendorsByVendorPersonContactPersonContactIdAndVendorId
            .nodes as Vendor[]
        ).filter((w) => w.id !== vendorId)
      : [],
  });

  const hasCompanyChanges = data
    ? !equals(
        sortBy(
          (cid) => `${cid}`,
          pluck(
            'id',
            data.customersByCustomerPersonContactPersonContactIdAndCustomerId
              .nodes as Customer[],
          ),
        ),
        sortBy((cid) => `${cid}`, pluck('id', allCustomers)),
      ) ||
      !equals(
        sortBy(
          (sid) => `${sid}`,
          pluck(
            'id',
            data.shippersByShipperPersonContactPersonContactIdAndShipperId
              .nodes as Shipper[],
          ),
        ),
        sortBy((sid) => `${sid}`, pluck('id', allShippers)),
      ) ||
      !equals(
        sortBy(
          (wid) => `${wid}`,
          pluck(
            'id',
            data.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
              .nodes as Warehouse[],
          ),
        ),
        sortBy((wid) => `${wid}`, pluck('id', allWarehouses)),
      ) ||
      !equals(
        sortBy(
          (vid) => `${vid}`,
          pluck(
            'id',
            data.vendorsByVendorPersonContactPersonContactIdAndVendorId
              .nodes as Vendor[],
          ),
        ),
        sortBy((vid) => `${vid}`, pluck('id', allVendors)),
      )
    : false;

  const handleUpdateCompanies = () => {
    const currentCustomers = data
      ? data.customersByCustomerPersonContactPersonContactIdAndCustomerId.nodes
      : [];
    const customersToAdd = allCustomers.filter(
      (c) => !pluck('id', currentCustomers as Customer[]).includes(c.id),
    );
    const customersToRemove = (currentCustomers as Customer[]).filter(
      (c) => !pluck('id', allCustomers).includes(c.id),
    );
    const currentShippers = data
      ? data.shippersByShipperPersonContactPersonContactIdAndShipperId.nodes
      : [];
    const shippersToAdd = allShippers.filter(
      (s) => !pluck('id', currentShippers as Shipper[]).includes(s.id),
    );
    const shippersToRemove = (currentShippers as Shipper[]).filter(
      (s) => !pluck('id', allShippers).includes(s.id),
    );
    const currentWarehouses = data
      ? data.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
          .nodes
      : [];
    const warehousesToAdd = allWarehouses.filter(
      (w) => !pluck('id', currentWarehouses as Warehouse[]).includes(w.id),
    );
    const warehousesToRemove = (currentWarehouses as Warehouse[]).filter(
      (w) => !pluck('id', allWarehouses).includes(w.id),
    );
    const currentVendors = data
      ? data.vendorsByVendorPersonContactPersonContactIdAndVendorId.nodes
      : [];
    const vendorsToAdd = allVendors.filter(
      (v) => !pluck('id', currentVendors as Vendor[]).includes(v.id),
    );
    const vendorsToRemove = (currentVendors as Vendor[]).filter(
      (v) => !pluck('id', allVendors).includes(v.id),
    );
    handleUpdate({
      variables: {
        id,
        updates: {
          customerPersonContactsUsingId: {
            create: customersToAdd.map((c) => ({ customerId: c.id })),
            deleteByCustomerIdAndPersonContactId: customersToRemove.map(
              (c) => ({
                customerId: c.id,
                personContactId: id,
              }),
            ),
          },
          shipperPersonContactsUsingId: {
            create: shippersToAdd.map((s) => ({ shipperId: s.id })),
            deleteByShipperIdAndPersonContactId: shippersToRemove.map((s) => ({
              shipperId: s.id,
              personContactId: id,
            })),
          },
          warehousePersonContactsUsingId: {
            create: warehousesToAdd.map((w) => ({ warehouseId: w.id })),
            deleteByWarehouseIdAndPersonContactId: warehousesToRemove.map(
              (w) => ({
                warehouseId: w.id,
                personContactId: id,
              }),
            ),
          },
          vendorPersonContactsUsingId: {
            create: vendorsToAdd.map((v) => ({ vendorId: v.id })),
            deleteByVendorIdAndPersonContactId: vendorsToRemove.map((v) => ({
              vendorId: v.id,
              personContactId: id,
            })),
          },
        },
      },
    });
  };

  const getBreadcrumbs = () => {
    if (customerId) {
      return customerContactBreadcrumbs(customerId, id);
    } else if (shipperId) {
      return shipperContactBreadcrumbs(shipperId, id);
    } else if (warehouseId) {
      return warehouseContactBreadcrumbs(warehouseId, id);
    } else if (vendorId) {
      return vendorContactBreadcrumbs(vendorId, id);
    } else {
      return internalContactBreadcrumbs(id);
    }
  };
  const breadcrumbs = getBreadcrumbs();

  return (
    <Page
      actions={
        getUpdateActions({
          onAfterDelete,
          onCancel: handleReset,
          onSave: handleUpdateCompanies,
          shouldConfirmCancel: hasCompanyChanges,
        }).defaultActions
      }
      breadcrumbs={breadcrumbs}
      title={data ? `${data.firstName} ${data.lastName}` : 'Loading...'}
    >
      {data ? (
        <>
          <BaseData<PersonContact>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={handleChange}
            labels={baseLabels(editing, isInternal)}
            showValidation={saveAttempt}
          />
          <l.Div mt={th.spacing.lg}>{info}</l.Div>
        </>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
