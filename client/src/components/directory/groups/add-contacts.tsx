import React, { useState } from 'react';
import { sentenceCase } from 'change-case';
import { pluck, sortBy } from 'ramda';

import api from 'api';
import { BasicModal } from 'components/modal';
import { DataMessage } from 'components/page/message';
import VirtualizedList from 'components/virtualized-list';
import useSearch from 'hooks/use-search';
import {
  ContactGroup,
  Customer,
  PersonContact,
  Shipper,
  Warehouse,
} from 'types';
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
  const [hover, setHover] = useState(false);

  const customers =
    item.customersByCustomerPersonContactPersonContactIdAndCustomerId.nodes;
  const shippers =
    item.shippersByShipperPersonContactPersonContactIdAndShipperId.nodes;
  const warehouses =
    item.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId.nodes;
  const companyText =
    customers.length > 0
      ? pluck('customerName', customers as Customer[])
          .map((n) => sentenceCase(n))
          .join(', ')
      : shippers.length > 0
      ? pluck('shipperName', shippers as Shipper[])
          .map((n) => sentenceCase(n))
          .join(', ')
      : warehouses.length > 0
      ? pluck('warehouseName', warehouses as Warehouse[])
          .map((n) => sentenceCase(n))
          .join(', ')
      : 'Internal contact';

  const textProps = {
    bold: hover || checked,
    color: hover ? th.colors.brand.primaryAccent : th.colors.brand.primary,
  };

  return (
    <l.Div
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <LineItemCheckbox
        checked={checked}
        label={
          <l.Grid
            gridTemplateColumns="1fr 40px 2fr"
            ml={th.spacing.md}
            width={th.sizes.fill}
          >
            <l.Div overflow="hidden">
              <ty.CaptionText nowrap {...textProps}>
                {item.firstName} {item.lastName}
              </ty.CaptionText>
            </l.Div>
            <ty.CaptionText mx={th.spacing.md} {...textProps}>
              -
            </ty.CaptionText>
            <l.Div overflow="hidden">
              <ty.CaptionText nowrap {...textProps}>
                {companyText}
              </ty.CaptionText>
            </l.Div>
          </l.Grid>
        }
        onChange={toggleChecked}
      />
    </l.Div>
  );
};

interface Props {
  addContacts: (selectedContacts: PersonContact[]) => Promise<any>;
  group: ContactGroup;
  confirmLoading?: boolean;
}

const AddContactsToGroup = ({ addContacts, group, confirmLoading }: Props) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useAllPersonContacts();

  const groupSelectedIds =
    group.personContactsByContactGroupPersonContactGroupIdAndPersonContactId.nodes.map(
      (c) => c && c.id,
    );

  const [selectedContacts, setSelectedContacts] = useState<PersonContact[]>([]);

  const items = data
    ? sortBy(
        (contact) =>
          contact &&
          [...groupSelectedIds, ...selectedContacts.map((c) => c.id)].includes(
            contact.id,
          )
            ? 'a'
            : 'b',
        data.nodes.filter(
          (contact) => contact && !groupSelectedIds.includes(contact.id),
        ),
      )
    : [];

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
      title="Add Contacts to Group"
      content={
        <>
          <ty.BodyText mb={th.spacing.md}>
            Search for contacts to add to group "
            {group.groupName || 'Create Group'}" below.
          </ty.BodyText>
          {Search}
          <l.Div height={500} mt={th.spacing.lg}>
            {data ? (
              <VirtualizedList
                disableScrollTracking
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
                width={590}
              />
            ) : (
              <DataMessage
                data={items}
                error={error}
                loading={loading}
                emptyProps={{
                  header: 'No contacts found',
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

export default AddContactsToGroup;
