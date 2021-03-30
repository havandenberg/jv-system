import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Company } from 'types';

import { baseLabels } from './data-utils';
import { sentenceCase } from 'sentence-case';

const breadcrumbs = (companyType: string, id: string) => [
  {
    text: 'Directory',
    to: `/directory/${companyType}`,
  },
  { text: 'Company', to: `/directory/${companyType}/${id}` },
];

const Details = ({ companyType }: { companyType: string }) => {
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useCompany(companyType, id);
  const companySlug =
    companyType === 'shipper'
      ? 'shippers'
      : companyType === 'customer'
      ? 'customers'
      : companyType;

  return (
    <Page
      breadcrumbs={breadcrumbs(companySlug, id)}
      title={`Directory - ${sentenceCase(companyType)}`}
    >
      {data ? (
        <BaseData<Company> data={data} labels={baseLabels} />
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
