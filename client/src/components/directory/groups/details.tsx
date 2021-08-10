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
import { ContactGroup, PersonContact } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import ContactList from '../contacts/list';
import { useDirectorySelectionContext } from '../selection-context';
import AddContactsToGroup from './add-contacts';
import { baseLabels } from './data-utils';

const breadcrumbs = (id: string) => [
  {
    text: 'Directory',
    to: `/directory/groups`,
  },
  { text: 'Group', to: `/directory/groups/${id}` },
];

const tabs: Tab[] = [
  {
    id: 'contacts',
    text: `Contacts`,
  },
];

const Details = () => {
  const history = useHistory();
  const { id } = useParams<{
    id: string;
  }>();
  const { data, error, loading } = api.useContactGroup(id);
  const personContacts = data
    ? (data.personContactsByContactGroupPersonContactGroupIdAndPersonContactId
        .nodes as PersonContact[])
    : [];

  const [removeContacts, { loading: removeLoading }] =
    api.useRemoveContactsFromGroup(id);

  const { TabBar } = useTabBar(tabs);

  const [handleUpdate] = api.useUpdateContactGroup(id);

  const updateFields = ['groupName', 'groupDescription', 'userId'];
  const updateVariables = { id };

  const [handleDelete] = api.useDeleteContactGroup();

  const onAfterDelete = () => {
    removeSelectedContactsFromGroup(
      data?.personContactsByContactGroupPersonContactGroupIdAndPersonContactId
        .nodes || [],
      id,
    );
    history.push('/directory/groups');
  };

  const { changes, editing, handleChange, getUpdateActions, saveAttempt } =
    useUpdateItem<ContactGroup>({
      data: data as ContactGroup,
      handleDelete,
      handleUpdate,
      deleteVariables: updateVariables,
      confirmDeleteText: `Are you sure you want to delete group "${
        data ? data.groupName : ''
      }"`,
      updateFields,
      updateVariables,
      validationLabels: baseLabels(true),
    });

  const [{ activeUser }] = useUserContext();

  const onChange = (field: keyof ContactGroup, value: any) => {
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
      selectGroupPersonContact,
      isAllGroupPersonContactsSelected,
      toggleAllGroupPersonContacts,
      removeSelectedContactsFromGroup,
    },
  ] = useDirectorySelectionContext();

  const selectedGroup = selectedItems.groups.find((c) => c.id === id);

  const [addContacts, { loading: addLoading }] = api.useAddContactsToGroup(id);

  const handleAddContacts = (selectedContacts: PersonContact[]) =>
    addContacts({
      variables: {
        items: pluck('id', selectedContacts).map((contactId) => ({
          groupId: id,
          personContactId: contactId,
        })),
      },
    });

  const handleRemoveContacts = () => {
    if (selectedGroup) {
      const contactsToRemove = selectedGroup.selectedContacts.map(
        (contact) => ({ groupId: id, personContactId: contact.id }),
      );
      removeContacts({ variables: { items: contactsToRemove } }).then(() => {
        removeSelectedContactsFromGroup(contactsToRemove, id);
      });
    }
  };

  return (
    <Page
      actions={getUpdateActions({ onAfterDelete }).defaultActions}
      breadcrumbs={breadcrumbs(id)}
      title={data ? `${data.groupName}` : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<ContactGroup>
            changes={changes}
            data={data}
            editing={editing}
            handleChange={onChange}
            labels={baseLabels(true)}
            showValidation={saveAttempt}
          />
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
            <l.Flex>
              <AddContactsToGroup
                addContacts={handleAddContacts}
                group={data}
                confirmLoading={addLoading}
              />
              <BasicModal
                title="Confirm Remove Contacts"
                content={
                  <ty.BodyText>
                    Are you sure you want to remove the selected contacts from
                    group "{data.groupName}"?
                  </ty.BodyText>
                }
                confirmLoading={removeLoading}
                confirmText="Confirm Remove"
                handleConfirm={handleRemoveContacts}
                triggerDisabled={
                  !selectedGroup || selectedGroup.selectedContacts.length === 0
                }
                triggerStyles={{ ml: th.spacing.md }}
                triggerText="Remove"
              />
            </l.Flex>
          </l.Flex>
          <ContactList
            personContacts={personContacts}
            selectedItem={selectedGroup}
            selectContact={selectGroupPersonContact(data)}
            toggleAllContacts={() => toggleAllGroupPersonContacts(data)}
            isAllContactsSelected={isAllGroupPersonContactsSelected(data)}
            isGroup
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
