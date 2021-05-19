import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Shipper } from 'types';

import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/shippers`,
  },
  { text: 'Shipper', to: `/directory/shippers/${id}` },
];

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useShipper(id);

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={data ? data.shipperName : 'Directory - Shipper'}
    >
      {data ? (
        <>
          <BaseData<Shipper> data={data} labels={baseLabels} />
        </>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
