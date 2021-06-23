import React, { Fragment, useCallback, useState } from 'react';
import { sortBy as sortByFunc } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { ContactAlias, PersonContact } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import AddContactsToAlias from './add-contacts';
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
    text: `Contacts`,
  },
];

interface FinalItem extends PersonContact {
  checked: boolean;
}

const initialState = {
  aliasName: '',
  aliasType: 'General',
  aliasDescription: '',
};

const Details = () => {
  const { id } =
    useParams<{
      id: string;
    }>();
  const history = useHistory();
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [handleCreate] = api.useCreateContactAlias();

  const { TabBar } = useTabBar(tabs);

  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [selectedItems] = useDirectorySelectionContext();

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
      selectedItems.aliases
        .map((alias) =>
          alias.selectedContacts.map((item) => ({
            ...item,
            checked: false,
          })),
        )
        .flat() as FinalItem[],
    );
    return flattenedItems;
  }, [selectedItems]);

  const [personContacts, setPersonContacts] = useState<FinalItem[]>(
    getFlattenedItems(),
  );
  const getSortedContacts = () => {
    const sortedContacts = sortByFunc(
      (c) => (c[sortBy as keyof FinalItem] || '').toLowerCase(),
      personContacts,
    );
    const isReverseOrder = ['firstName', 'lastName'].includes(sortBy);
    return sortOrder === SORT_ORDER.ASC && isReverseOrder
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

  const [changes, setChanges] = useState<ContactAlias>(
    initialState as ContactAlias,
  );

  const handleChange = (field: keyof ContactAlias, value: any) => {
    setChanges({ ...changes, [field]: value } as ContactAlias);
  };

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          ...changes,
          contacts: personContacts.map((c) => ({ personContactId: c.id })),
        },
      }).then(() => {
        history.push('/directory/aliases');
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to="/directory/aliases">
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
      breadcrumbs={breadcrumbs(id)}
      title="New Contact Alias"
    >
      <l.Div pb={th.spacing.xl}>
        <BaseData<ContactAlias>
          changes={changes}
          data={changes}
          editing={true}
          handleChange={handleChange}
          labels={baseLabels}
          showValidation={saveAttempt}
        />
        <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
          <TabBar />
          <l.Flex>
            <AddContactsToAlias
              addContacts={handleAddContacts}
              alias={{
                ...changes,
                personContactsByContactAliasPersonContactAliasIdAndPersonContactId:
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
          isAlias
        />
      </l.Div>
    </Page>
  );
};

export default Details;
