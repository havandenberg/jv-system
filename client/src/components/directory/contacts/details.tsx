import React, { Fragment, useEffect, useState } from 'react';
import { equals, pick } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import Modal from 'components/modal';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import usePrevious from 'hooks/use-previous';
import { PersonContact } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

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
  const previousData = usePrevious(data);

  const [editing, setEditing] = useState(false);

  const [handleUpdate] = api.useUpdatePersonContact(id);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [changes, setChanges] = useState<PersonContact>(data as PersonContact);
  const hasChanges = !equals(changes, data);

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

  const handleCancel = () => {
    setChanges(data as PersonContact);
    setEditing(false);
  };

  const handleChange = (field: keyof PersonContact, value: any) => {
    setChanges({ ...changes, [field]: value } as PersonContact);
  };

  const handleSave = () => {
    setUpdateLoading(true);
    handleUpdate({
      variables: {
        id,
        updates: pick(
          [
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
          ],
          changes,
        ),
      },
    }).then(() => {
      setUpdateLoading(false);
      handleCancel();
    });
  };

  const [handleDelete] = api.useDeletePersonContact({
    isInternal,
    customerId,
    shipperId,
    warehouseId,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const onDelete = () => {
    setDeleteLoading(true);
    handleDelete({ variables: { id: (data as PersonContact).id } }).then(() => {
      const breadcrumb = breadcrumbs[isInternal ? 0 : 1];
      history.push(breadcrumb ? breadcrumb.to || '/directory' : '/directory');
    });
  };

  useEffect(() => {
    if (data !== previousData) {
      setChanges(data as PersonContact);
    }
  }, [data, previousData, setChanges]);

  return (
    <Page
      actions={[
        editing ? (
          <Fragment key={0}>
            <Modal
              trigger={(show) => (
                <b.Primary
                  mr={th.spacing.md}
                  onClick={hasChanges ? show : handleCancel}
                  width={88}
                >
                  Cancel
                </b.Primary>
              )}
            >
              {({ hide }) => (
                <>
                  <ty.TitleText>Confirm discard changes</ty.TitleText>
                  <ty.BodyText>You will lose all unsaved changes.</ty.BodyText>
                  <l.Flex justifyCenter mt={th.spacing.xl}>
                    <b.Primary mr={th.spacing.lg} onClick={hide}>
                      Cancel
                    </b.Primary>
                    <b.Primary onClick={handleCancel}>Discard</b.Primary>
                  </l.Flex>
                </>
              )}
            </Modal>
            <b.Primary onClick={!updateLoading && handleSave} width={88}>
              {updateLoading ? (
                <l.Flex alignCenter justifyCenter>
                  <ClipLoader
                    color={th.colors.brand.secondary}
                    size={th.sizes.xs}
                  />
                </l.Flex>
              ) : (
                'Save'
              )}
            </b.Primary>
          </Fragment>
        ) : (
          <Fragment key={0}>
            <b.Primary
              onClick={() => {
                setEditing(true);
              }}
              width={88}
            >
              Edit
            </b.Primary>
            {data && (
              <Modal
                trigger={(show) => (
                  <b.Primary ml={th.spacing.md} onClick={show}>
                    Delete
                  </b.Primary>
                )}
              >
                {({ hide }) => (
                  <>
                    <ty.TitleText>Confirm Delete Contact</ty.TitleText>
                    <ty.BodyText mb={th.spacing.md}>
                      Are you sure you want to delete contact for{' '}
                      {data.firstName} {data.lastName}?
                    </ty.BodyText>
                    <l.Flex justifyCenter mt={th.spacing.xl}>
                      <b.Primary mr={th.spacing.lg} onClick={hide}>
                        Cancel
                      </b.Primary>
                      <b.Primary onClick={!deleteLoading && onDelete}>
                        {deleteLoading ? (
                          <l.Flex alignCenter justifyCenter>
                            <ClipLoader
                              color={th.colors.brand.secondary}
                              size={th.sizes.xs}
                            />
                          </l.Flex>
                        ) : (
                          'Confirm Delete'
                        )}
                      </b.Primary>
                    </l.Flex>
                  </>
                )}
              </Modal>
            )}
          </Fragment>
        ),
      ]}
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
          labels={baseLabels}
        />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
