import React, { useState } from 'react';
import { pluck } from 'ramda';

import api from 'api';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import { ContactAlias, PersonContact } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface LineItemProps {
  checked: boolean;
  item: PersonContact;
  toggleChecked: () => void;
}

const LineItem = ({ checked, item, toggleChecked }: LineItemProps) => {
  const companyText = item.customer
    ? item.customer.customerName
    : item.shipper
    ? item.shipper.shipperName
    : item.warehouse
    ? item.warehouse.warehouseName
    : 'Internal contact';
  return (
    <LineItemCheckbox
      checked={checked}
      label={
        <l.Grid
          gridTemplateColumns="1fr 40px 2fr"
          ml={th.spacing.md}
          width={th.sizes.fill}
        >
          <ty.CaptionText>
            {item.firstName} {item.lastName}
          </ty.CaptionText>
          <ty.CaptionText mx={th.spacing.md}>-</ty.CaptionText>
          <ty.CaptionText>{companyText}</ty.CaptionText>
        </l.Grid>
      }
      onChange={toggleChecked}
    />
  );
};

interface Props {
  addContacts: (selectedContacts: PersonContact[]) => Promise<any>;
  alias: ContactAlias;
  confirmLoading?: boolean;
}

const AddContactsToAlias = ({ addContacts, alias, confirmLoading }: Props) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useAllPersonContacts();
  const items = data
    ? data.nodes.filter(
        (contact) =>
          contact &&
          !alias.personContactsByContactAliasPersonContactAliasIdAndPersonContactId.nodes
            .map((c) => c && c.id)
            .includes(contact.id),
      )
    : [];

  const [selectedContacts, setSelectedContacts] = useState<PersonContact[]>([]);

  const handleAddContacts = () => {
    addContacts(selectedContacts).then(() => {
      setSelectedContacts([]);
    });
  };

  const toggleContact = (contact: PersonContact) => {
    if (pluck('id', selectedContacts).includes(contact.id)) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  return (
    <BasicModal
      title="Add Contacts to Alias"
      content={
        <>
          <ty.BodyText mb={th.spacing.md}>
            Search for contacts to add to alias "
            {alias.aliasName || 'New Alias'}" below.
          </ty.BodyText>
          {Search}
          <l.Div height={500} mt={th.spacing.lg}>
            {data ? (
              <VirtualizedList
                height={500}
                rowCount={items.length}
                rowHeight={28}
                rowRenderer={({ key, index, style }) => {
                  const item = items[index];
                  return (
                    item && (
                      <div key={key} style={style}>
                        <LineItem
                          checked={pluck('id', selectedContacts).includes(
                            item.id,
                          )}
                          item={item}
                          toggleChecked={() => {
                            toggleContact(item);
                          }}
                        />
                      </div>
                    )
                  );
                }}
                width={620}
              />
            ) : (
              <DataMessage
                data={items}
                error={error}
                loading={loading}
                emptyProps={{
                  header: 'No Contacts Found 😔',
                  text: 'Modify search parameters to view more results.',
                }}
              />
            )}
          </l.Div>
        </>
      }
      confirmLoading={confirmLoading}
      confirmText="Add Contacts"
      confirmDisabled={selectedContacts.length === 0}
      handleConfirm={handleAddContacts}
      triggerText="Add"
    />
  );
};

export default AddContactsToAlias;
