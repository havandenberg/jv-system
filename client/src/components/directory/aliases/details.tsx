import React from 'react';
import { pluck } from 'ramda';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { ContactAlias, PersonContact } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/aliases`,
  },
  { text: 'Alias', to: `/directory/aliases/${id}` },
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
  const { data, error, loading } = api.useContactAlias(id);
  const personContacts = data
    ? pluck(
        'personContact',
        data.contactAliasPersonContactsByAliasId.nodes as {
          personContact: PersonContact;
        }[],
      )
    : [];

  const { TabBar } = useTabBar(tabs);

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={data ? `${data.aliasName}` : 'Directory - Alias'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<ContactAlias> data={data} labels={baseLabels} />
          <l.Flex
            alignCenter
            justifyBetween
            mb={th.spacing.lg}
            mt={th.spacing.xl}
          >
            <TabBar />
            <div />
          </l.Flex>
          <ContactList
            baseUrl={`aliases/${id}`}
            personContacts={personContacts}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
