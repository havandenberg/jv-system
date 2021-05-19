import React, { Fragment, useEffect, useState } from 'react';
import { pick } from 'ramda';
import { useParams } from 'react-router-dom';
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

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/internal`,
  },
  { text: 'Contact', to: `/directory/internal/${id}` },
];

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useInternalContact(id);
  const previousData = usePrevious(data);

  const [editing, setEditing] = useState(false);

  const [handleUpdate] = api.useUpdatePersonContact(id);
  const [updateLoading, setLoading] = useState(false);

  const [changes, setChanges] = useState<PersonContact>(data as PersonContact);

  const handleCancel = () => {
    setChanges(data as PersonContact);
    setEditing(false);
  };

  const handleChange = (field: keyof PersonContact, value: any) => {
    setChanges({ ...changes, [field]: value } as PersonContact);
  };

  const handleSave = () => {
    setLoading(true);
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
          ],
          changes,
        ),
      },
    }).then(() => {
      setLoading(false);
      handleCancel();
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
                <b.Primary mr={th.spacing.sm} onClick={show} width={88}>
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
            <b.Primary onClick={handleSave} width={88}>
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
          <b.Primary
            key={0}
            onClick={() => {
              setEditing(true);
            }}
            width={88}
          >
            Edit
          </b.Primary>
        ),
      ]}
      breadcrumbs={breadcrumbs(id)}
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
