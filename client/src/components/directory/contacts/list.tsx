import React from 'react';
import { isEmpty, reduce } from 'ramda';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import ListItem from '../list-item';
import { aliasContactListLabels, contactListLabels } from './data-utils';
import { LineItemCheckbox } from 'ui/checkbox';

const ContactList = ({
  baseUrl,
  isAlias,
  isAllContactsSelected,
  personContacts,
  selectContact,
  selectedItem,
  toggleAllContacts,
}: {
  baseUrl?: string;
  isAlias?: boolean;
  isAllContactsSelected?: boolean;
  personContacts: PersonContact[];
  selectedItem?: { selectedContacts: PersonContact[] } & any;
  selectContact?: (item: PersonContact) => void;
  toggleAllContacts?: () => void;
}) => {
  const hasCustomerIds = reduce(
    (acc, contact) => acc || !!contact.customerId,
    false,
    personContacts,
  );
  const hasShipperIds = reduce(
    (acc, contact) => acc || !!contact.shipperId,
    false,
    personContacts,
  );
  const hasWarehouseIds = reduce(
    (acc, contact) => acc || !!contact.warehouseId,
    false,
    personContacts,
  );

  const listLabels = isAlias
    ? aliasContactListLabels(hasCustomerIds, hasShipperIds, hasWarehouseIds)
    : contactListLabels;

  const columnLabels = useColumns<PersonContact>(
    'firstName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'person_contact',
  );

  const gridTemplateColumns = isAlias
    ? `30px 1fr 1.5fr 2.5fr ${hasCustomerIds ? '1.5fr ' : ''}${
        hasShipperIds ? '1.5fr ' : ''
      }${hasWarehouseIds ? '1.5fr ' : ''}30px`
    : '30px 1fr 1.5fr 2fr 2.5fr 90px 30px';

  const getSlug = (item: PersonContact) => {
    const baseSlug = baseUrl ? `${baseUrl}/contacts/${item.id}` : '';
    const customerSlug = item.customerId
      ? `customers/${item.customerId}/contacts/${item.id}`
      : '';
    const shipperSlug = item.shipperId
      ? `shippers/${item.shipperId}/contacts/${item.id}`
      : '';
    const warehouseSlug = item.warehouseId
      ? `warehouses/${item.warehouseId}/contacts/${item.id}`
      : '';
    const internalSlug = `internal/${item.id}`;
    return (
      baseSlug || customerSlug || shipperSlug || warehouseSlug || internalSlug
    );
  };

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
        pr={personContacts.length > 12 ? th.spacing.md : 0}
      >
        {toggleAllContacts && (
          <LineItemCheckbox
            checked={!!isAllContactsSelected}
            onChange={toggleAllContacts}
          />
        )}
        {columnLabels}
      </l.Grid>
      {!isEmpty(personContacts) ? (
        personContacts.map(
          (item, idx) =>
            item && (
              <ListItem<PersonContact>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                onSelectItem={
                  selectContact ? () => selectContact(item) : undefined
                }
                selected={
                  selectedItem
                    ? !!selectedItem.selectedContacts.find(
                        (it: PersonContact) => it.id === item.id,
                      )
                    : undefined
                }
                listLabels={listLabels}
                slug={getSlug(item)}
              />
            ),
        )
      ) : (
        <DataMessage
          data={personContacts}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No Contacts Found 😔',
          }}
        />
      )}
    </>
  );
};

export default ContactList;
