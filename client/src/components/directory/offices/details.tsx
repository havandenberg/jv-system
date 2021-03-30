import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Office } from 'types';

import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/offices`,
  },
  { text: 'Office', to: `/directory/offices/${id}` },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useOffice(id);

  return (
    <Page breadcrumbs={breadcrumbs(id)} title="Directory - Office">
      {data ? (
        <BaseData<Office> data={data} labels={baseLabels} />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
