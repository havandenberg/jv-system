import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { Shipper } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { baseLabels } from './data-utils';

export const shipperBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/shippers`,
  },
  { text: 'Shipper', to: `/directory/shippers/${id}` },
];

const tabs: Tab[] = [
  {
    id: 'contacts',
    text: 'Contacts',
  },
];

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useShipper(id);

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      breadcrumbs={shipperBreadcrumbs(id)}
      title={data ? data.shipperName : 'Directory - Shipper'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Shipper> data={data} labels={baseLabels} />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.AreaLink
              key={1}
              ml={th.spacing.md}
              to={`/directory/create?shipperId=${data.id}`}
            >
              <b.Primary>New</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList baseUrl={`shippers/${id}`} shipperId={id} />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
