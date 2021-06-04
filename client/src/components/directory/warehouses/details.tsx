import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { Warehouse } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { baseLabels } from './data-utils';

export const warehouseBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/warehouses`,
  },
  { text: 'Warehouse', to: `/directory/warehouses/${id}` },
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
  const { data, error, loading } = api.useWarehouse(id);

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      breadcrumbs={warehouseBreadcrumbs(id)}
      title={data ? data.warehouseName : 'Directory - Warehouse'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Warehouse> data={data} labels={baseLabels} />
          <l.Flex
            alignCenter
            justifyBetween
            mb={th.spacing.lg}
            mt={th.spacing.xl}
          >
            <TabBar />
            <l.AreaLink
              key={1}
              ml={th.spacing.md}
              to={`/directory/create?warehouseId=${data.id}`}
            >
              <b.Primary>New</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList baseUrl={`warehouses/${id}`} warehouseId={id} />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
