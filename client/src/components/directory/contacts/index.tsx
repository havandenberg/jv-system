import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { internalListLabels as listLabels } from './data-utils';

const gridTemplateColumns = '30px 1.5fr 2fr 3.5fr 2fr 30px';

const ContactDirectory = ({
  actions,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: SubDirectoryProps) => {
  const { data, loading, error } = api.usePersonContacts({ isInternal: true });
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<PersonContact>(
    'firstName',
    SORT_ORDER.ASC,
    listLabels,
    'directory',
    'person_contact',
  );

  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === (data ? data.totalCount : -1);
  const handleSelectAll = () => {
    toggleSelectAll(
      isAllSelected,
      (items as PersonContact[]).map((contact) => ({
        id: contact.id,
        email: contact.email || '',
        description: 'Contact',
      })),
    );
  };

  return (
    <Page
      actions={[
        <l.AreaLink key={1} mr={th.spacing.md} to={`/directory/create`}>
          <b.Primary>New</b.Primary>
        </l.AreaLink>,
        ...actions,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={103}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
                {selectedItems.length > 0
                  ? `, Selected: ${selectedItems.length}`
                  : ''}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                <LineItemCheckbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Internal Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<PersonContact>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    onSelectItem={() =>
                      selectItem({
                        id: item.id,
                        email: '',
                        description: ` - Contacts`,
                      })
                    }
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`internal/${item.id}`}
                  />
                </div>
              )
            );
          }}
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
    </Page>
  );
};

export default ContactDirectory;
