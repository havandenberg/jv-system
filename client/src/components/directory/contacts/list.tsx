import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { contactListLabels as listLabels } from './data-utils';

const gridTemplateColumns = '1fr 2fr 2fr 2.5fr 90px 30px';

const ContactList = ({
  baseUrl,
  customerId,
  shipperId,
  warehouseId,
  personContacts,
}: {
  baseUrl: string;
  customerId?: string;
  shipperId?: string;
  warehouseId?: string;
  personContacts?: PersonContact[];
}) => {
  const { data, loading, error } = api.usePersonContacts({
    customerId,
    shipperId,
    warehouseId,
  });
  const items = personContacts || (data ? data.nodes : []);

  const columnLabels = useColumns<PersonContact>(
    'firstName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'person_contact',
  );

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
        pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(items) ? (
        items.map(
          (item) =>
            item && (
              <ListItem<PersonContact>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                listLabels={listLabels}
                slug={`${baseUrl}/contacts/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Contacts Found 😔',
          }}
        />
      )}
    </>
  );
};

export default ContactList;
