import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { PersonContact } from 'types';

import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/internal`,
  },
  { text: 'Contact', to: `/directory/internal/${id}` },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useInternalContact(id);

  return (
    <Page breadcrumbs={breadcrumbs(id)} title="Directory - Contact">
      {data ? (
        <BaseData<PersonContact> data={data} labels={baseLabels} />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
