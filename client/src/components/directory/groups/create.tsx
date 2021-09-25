import React, { Fragment, useCallback, useState } from 'react';
import { pluck, sortBy as sortByFunc, uniqBy } from 'ramda';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import { useUserContext } from 'components/user/context';
import { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import {
  ContactGroup,
  Customer,
  PersonContact,
  Shipper,
  Warehouse,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import AddContactsToGroup from './add-contacts';
import { baseLabels } from './data-utils';

const breadcrumbs = [
  {
    text: 'Directory',
    to: `/directory/groups`,
  },
  { text: 'Group', to: `/directory/groups/create` },
];

const tabs: Tab[] = [
  {
    id: 'contacts',
    text: `Contacts`,
  },
];

interface FinalItem extends PersonContact {
  checked: boolean;
}

const initialState = {
  groupName: '',
  groupDescription: '',
  userId: null,
};

const CreateContactGroup = () => {
  const history = useHistory();
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [handleCreate] = api.useCreateContactGroup();

  const { TabBar } = useTabBar(tabs);

  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [selectedItems, { clearAllSelectedItems }] =
    useDirectorySelectionContext();

  const getFlattenedItems = useCallback(() => {
    let flattenedItems: FinalItem[] = [];
    flattenedItems = flattenedItems.concat(
      selectedItems.internal.map((item) => ({
        ...item,
        checked: false,
      })),
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.customers
        .map((customer) =>
          customer.selectedContacts.map((item) => ({
            ...item,
            checked: false,
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.shippers
        .map((shipper) =>
          shipper.selectedContacts.map((item) => ({
            ...item,
            checked: false,
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.warehouses
        .map((warehouse) =>
          warehouse.selectedContacts.map((item) => ({
            ...item,
            checked: false,
          })),
        )
        .flat() as FinalItem[],
    );
    flattenedItems = flattenedItems.concat(
      selectedItems.groups
        .map((group) =>
          group.selectedContacts.map((item) => ({
            ...item,
            checked: false,
          })),
        )
        .flat() as FinalItem[],
    );
    return uniqBy((it) => it.id, flattenedItems);
  }, [selectedItems]);

  const [personContacts, setPersonContacts] = useState<FinalItem[]>(
    getFlattenedItems(),
  );
  const getSortedContacts = () => {
    const sortedContacts = sortByFunc((c) => {
      const customers =
        c.customersByCustomerPersonContactPersonContactIdAndCustomerId
          ? c.customersByCustomerPersonContactPersonContactIdAndCustomerId.nodes
          : [];
      const customersString = pluck(
        'customerName',
        customers as Customer[],
      ).join(' ');
      const shippers =
        c.shippersByShipperPersonContactPersonContactIdAndShipperId
          ? c.shippersByShipperPersonContactPersonContactIdAndShipperId.nodes
          : [];
      const shippersString = pluck('shipperName', shippers as Shipper[]).join(
        ' ',
      );
      const warehouses =
        c.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
          ? c.warehousesByWarehousePersonContactPersonContactIdAndWarehouseId
              .nodes
          : [];
      const warehousesString = pluck(
        'warehouseName',
        warehouses as Warehouse[],
      ).join(' ');
      const getSortString = () => {
        switch (sortBy) {
          case 'customersByCustomerPersonContactPersonContactIdAndCustomerId':
            return customersString;
          case 'shippersByShipperPersonContactPersonContactIdAndShipperId':
            return shippersString;
          case 'warehousesByWarehousePersonContactPersonContactIdAndWarehouseId':
            return warehousesString;
          default:
            return `${c[sortBy as keyof FinalItem] || ''}`;
        }
      };
      return getSortString().toLowerCase();
    }, personContacts);
    const isReverseOrder = ['firstName', 'lastName'].includes(sortBy);
    return (sortOrder === SORT_ORDER.ASC && isReverseOrder) ||
      (sortOrder === SORT_ORDER.DESC && !isReverseOrder)
      ? sortedContacts
      : sortedContacts.reverse();
  };
  const sortedPersonContacts = getSortedContacts();
  const selectedContacts = sortedPersonContacts.filter((c) => c.checked);

  const selectPersonContact = (contact: PersonContact) => {
    const selectedContact = personContacts.find((c) => c.id === contact.id);
    if (selectedContact) {
      setPersonContacts([
        ...personContacts.filter((c) => c.id !== selectedContact.id),
        { ...contact, checked: !selectedContact.checked },
      ]);
    }
  };

  const isAllPersonContactsSelected = () =>
    personContacts.reduce((acc, item) => acc && item.checked, true);

  const toggleAllPersonContacts = () => {
    if (isAllPersonContactsSelected()) {
      setPersonContacts(personContacts.map((c) => ({ ...c, checked: false })));
    } else {
      setPersonContacts(personContacts.map((c) => ({ ...c, checked: true })));
    }
  };

  const handleAddContacts = (selectedContacts: PersonContact[]) =>
    new Promise((resolve) => {
      setPersonContacts([
        ...personContacts,
        ...selectedContacts.map((c) => ({ ...c, checked: false })),
      ]);
      resolve('');
    });

  const removeSelectedContacts = () => {
    setPersonContacts(personContacts.filter((c) => !c.checked));
  };

  const [changes, setChanges] = useState<ContactGroup>(
    initialState as ContactGroup,
  );
  const [{ activeUserId }] = useUserContext();
  const { data: activeUser } = api.useGetUser(activeUserId || 0);

  const handleChange = (field: keyof ContactGroup, value: any) => {
    if (field === 'userId') {
      setChanges({ ...changes, userId: activeUser ? activeUser.id : null });
    } else {
      setChanges({ ...changes, [field]: value } as ContactGroup);
    }
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels(!activeUser))) {
      setLoading(true);
      handleCreate({
        variables: {
          ...changes,
          contacts: personContacts.map((c) => ({ personContactId: c.id })),
        },
      }).then(() => {
        clearAllSelectedItems();
        history.push('/directory/groups');
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to="/directory/groups">
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          <b.Primary
            disabled={personContacts.length === 0}
            ml={th.spacing.md}
            onClick={handleSave}
            width={88}
          >
            {createLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Create'
            )}
          </b.Primary>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs}
      title="Create Contact Group"
    >
      <l.Div pb={th.spacing.xl}>
        <BaseData<ContactGroup>
          changes={changes}
          data={changes}
          editing={true}
          handleChange={handleChange}
          labels={baseLabels(!activeUser)}
          showValidation={saveAttempt}
        />
        <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
          <TabBar />
          <l.Flex>
            <AddContactsToGroup
              addContacts={handleAddContacts}
              group={{
                ...changes,
                personContactsByContactGroupPersonContactGroupIdAndPersonContactId:
                  {
                    edges: [],
                    nodes: personContacts,
                    pageInfo: { hasNextPage: false, hasPreviousPage: false },
                    totalCount: 0,
                  },
              }}
            />
            <b.Primary
              disabled={selectedContacts.length === 0}
              ml={th.spacing.md}
              onClick={removeSelectedContacts}
            >
              Remove
            </b.Primary>
          </l.Flex>
        </l.Flex>
        <ContactList
          personContacts={sortedPersonContacts}
          selectedItem={{
            ...changes,
            selectedContacts,
          }}
          selectContact={selectPersonContact}
          toggleAllContacts={toggleAllPersonContacts}
          isAllContactsSelected={isAllPersonContactsSelected()}
          isGroup
        />
      </l.Div>
    </Page>
  );
};

export default CreateContactGroup;
