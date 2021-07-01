import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { StringParam } from 'use-query-params';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { useQuerySet } from 'hooks/use-query-params';
import { PersonContact } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { breadcrumbs } from '..';
import { customerBreadcrumbs } from '../customers/details';
import { shipperBreadcrumbs } from '../shippers/details';
import { warehouseBreadcrumbs } from '../warehouses/details';
import { baseLabels } from './data-utils';
import useContactCompanyInfo from './use-contact-company-info';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  secondaryEmail: '',
  homePhone: '',
  cellPhone: '',
  workPhone: '',
  workExtension: '',
  roles: '',
  isPrimary: true,
  isInternal: false,
};

const CreatePersonContact = () => {
  const history = useHistory();
  const [{ customerId, shipperId, warehouseId }] = useQuerySet({
    customerId: StringParam,
    shipperId: StringParam,
    warehouseId: StringParam,
  });
  const { data: customer } = api.useCustomer(customerId);
  const { data: shipper } = api.useShipper(shipperId);
  const { data: warehouse } = api.useWarehouse(warehouseId);

  const [handleCreate] = api.useCreatePersonContact({
    customerId,
    shipperId,
    warehouseId,
  });
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<PersonContact>(
    initialState as PersonContact,
  );
  const { allCustomers, allShippers, allWarehouses, info } =
    useContactCompanyInfo({
      customer,
      editing: true,
      shipper,
      warehouse,
    });

  const getCancelLink = () => {
    if (customerId) {
      return `/directory/customers/${customerId}`;
    } else if (shipperId) {
      return `/directory/shippers/${shipperId}`;
    } else if (warehouseId) {
      return `/directory/warehouses/${warehouseId}`;
    } else {
      return `/directory/internal`;
    }
  };

  const getBreadcrumbs = () => {
    if (customerId) {
      return [
        ...customerBreadcrumbs(customerId),
        { text: 'Contact', to: `/directory/create?customerId=${customerId}` },
      ];
    } else if (shipperId) {
      return [
        ...shipperBreadcrumbs(shipperId),
        { text: 'Contact', to: `/directory/create?shipperId=${shipperId}` },
      ];
    } else if (warehouseId) {
      return [
        ...warehouseBreadcrumbs(warehouseId),
        { text: 'Contact', to: `/directory/create?warehouseId=${warehouseId}` },
      ];
    } else {
      return breadcrumbs;
    }
  };

  const handleChange = (field: keyof PersonContact, value: any) => {
    setChanges({ ...changes, [field]: value } as PersonContact);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(false))) {
      setLoading(true);
      handleCreate({
        variables: {
          personContact: {
            ...changes,
            customerPersonContactsUsingId: {
              create: customerId
                ? allCustomers.map((c) => ({ customerId: c.id }))
                : [],
            },
            shipperPersonContactsUsingId: {
              create: shipperId
                ? allShippers.map((s) => ({ shipperId: s.id }))
                : [],
            },
            warehousePersonContactsUsingId: {
              create: warehouseId
                ? allWarehouses.map((w) => ({ warehouseId: w.id }))
                : [],
            },
          },
        },
      }).then(() => {
        history.push(getCancelLink());
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={getCancelLink()}>
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          <b.Primary ml={th.spacing.md} onClick={handleSave} width={88}>
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
          </b.Primary>
        </Fragment>,
      ]}
      breadcrumbs={getBreadcrumbs()}
      title="New Contact"
    >
      <l.Div mb={th.spacing.lg} mt={th.spacing.sm}>
        {info}
      </l.Div>
      <BaseData<PersonContact>
        changes={changes}
        data={changes}
        editing={true}
        handleChange={handleChange}
        labels={baseLabels(false)}
        showValidation={saveAttempt}
      />
    </Page>
  );
};

export default CreatePersonContact;
