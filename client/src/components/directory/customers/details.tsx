import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { Customer } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { baseLabels } from './data-utils';

export const customerBreadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/customers`,
  },
  { text: 'Customer', to: `/directory/customers/${id}` },
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
  const { data, error, loading } = api.useCustomer(id);

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      breadcrumbs={customerBreadcrumbs(id)}
      title={data ? data.customerName : 'Directory - Customer'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<Customer> data={data} labels={baseLabels} />
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
              to={`/directory/create?customerId=${data.id}`}
            >
              <b.Primary>New</b.Primary>
            </l.AreaLink>
          </l.Flex>
          <ContactList baseUrl={`customers/${id}`} customerId={id} />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
