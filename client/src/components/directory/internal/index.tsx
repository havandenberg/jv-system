import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PersonContact } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 1.5fr 2fr 3fr 2.5fr 2fr 30px';

const InternalDirectory = ({
  actions,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: SubDirectoryProps) => {
  const { data, loading, error } = api.useInternalContacts();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<PersonContact>(
    'lastName',
    SORT_ORDER.ASC,
    listLabels,
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
        email: contact.email,
        description: 'Contact',
      })),
    );
  };

  return (
    <Page
      actions={actions}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            {Search}
            <l.Div width={th.spacing.md} />
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.lg} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
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
      title="Directory"
    >
      {!isEmpty(items) ? (
        items.map(
          (item, idx) =>
            item && (
              <ListItem<PersonContact>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                onSelectItem={() =>
                  selectItem({
                    id: item.id,
                    email: item.email,
                    description: 'Contact',
                  })
                }
                selected={!!selectedItems.find((it) => it.id === item.id)}
                slug={`internal/${item.id}`}
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
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default InternalDirectory;
