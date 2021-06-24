import React from 'react';
import { pluck } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import { BasicModal } from 'components/modal';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useUserContext } from 'components/user/context';
import useUpdateItem from 'hooks/use-update-item';
import { ContactAlias, PersonContact } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

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

const Details = () => {
  const history = useHistory();
  const { id } =
    useParams<{
      id: string;
    }>();
  const { data, error, loading } = api.useContactAlias(id);
  const personContacts = data
    ? (data.personContactsByContactAliasPersonContactAliasIdAndPersonContactId
        .nodes as PersonContact[])
    : [];

  const [removeContacts, { loading: removeLoading }] =
    api.useRemoveContactsFromAlias(id);

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateContactAlias(id);

  const updateFields = ['aliasName', 'aliasDescription', 'userId'];
  const updateVariables = { id };

  const [handleDelete] = api.useDeleteContactAlias();

  const onAfterDelete = () => {
    removeSelectedContactsFromAlias(
      data?.personContactsByContactAliasPersonContactAliasIdAndPersonContactId
        .nodes || [],
      id,
    );
    history.push('/directory/aliases');
  };

  const { changes, editing, handleChange, updateActions } =
    useUpdateItem<ContactAlias>({
      data: data as ContactAlias,
      handleDelete,
      handleUpdate,
      onAfterDelete,
      deleteVariables: updateVariables,
      confirmDeleteText: `Are you sure you want to delete alias "${
        data ? data.aliasName : ''
      }"`,
      updateFields,
      updateVariables,
    });

  const [{ activeUser }] = useUserContext();

  const onChange = (field: keyof ContactAlias, value: any) => {
    if (field === 'userId') {
      if (activeUser) {
        handleChange('userId', changes.userId ? null : activeUser.id);
      }
    } else {
      handleChange(field, value);
    }
  };

  const [
    selectedItems,
    {
      selectAliasPersonContact,
      isAllAliasPersonContactsSelected,
      toggleAllAliasPersonContacts,
      removeSelectedContactsFromAlias,
    },
  ] = useDirectorySelectionContext();

  const selectedAlias = selectedItems.aliases.find((c) => c.id === id);

  const [addContacts, { loading: addLoading }] = api.useAddContactsToAlias(id);

  const handleAddContacts = (selectedContacts: PersonContact[]) =>
    addContacts({
      variables: {
        items: pluck('id', selectedContacts).map((contactId) => ({
          aliasId: id,
          personContactId: contactId,
        })),
      },
    });

  const handleRemoveContacts = () => {
    if (selectedAlias) {
      const contactsToRemove = selectedAlias.selectedContacts.map(
        (contact) => ({ aliasId: id, personContactId: contact.id }),
      );
      removeContacts({ variables: { items: contactsToRemove } }).then(() => {
        removeSelectedContactsFromAlias(contactsToRemove, id);
      });
    }
  };

  return (
    <Page
      actions={updateActions}
      breadcrumbs={breadcrumbs(id)}
      title={data ? `${data.aliasName}` : 'Directory - Alias'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<ContactAlias>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={onChange}
            labels={baseLabels(true)}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.Flex>
              <AddContactsToAlias
                addContacts={handleAddContacts}
                alias={data}
                confirmLoading={addLoading}
              />
              <BasicModal
                title="Confirm Remove Contacts"
                content={
                  <ty.BodyText>
                    Are you sure you want to remove the selected contacts from
                    alias "{data.aliasName}"?
                  </ty.BodyText>
                }
                confirmLoading={removeLoading}
                confirmText="Confirm Remove"
                handleConfirm={handleRemoveContacts}
                triggerDisabled={
                  !selectedAlias || selectedAlias.selectedContacts.length === 0
                }
                triggerStyles={{ ml: th.spacing.md }}
                triggerText="Remove"
              />
            </l.Flex>
          </l.Flex>
          <ContactList
            personContacts={personContacts}
            selectedItem={selectedAlias}
            selectContact={selectAliasPersonContact(data)}
            toggleAllContacts={() => toggleAllAliasPersonContacts(data)}
            isAllContactsSelected={isAllAliasPersonContactsSelected(data)}
            isAlias
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
