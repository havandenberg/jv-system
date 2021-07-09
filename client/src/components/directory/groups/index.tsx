import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useUserContext } from 'components/user/context';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { ContactGroup } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { useDirectorySelectionContext } from '../selection-context';
import { listLabels } from './data-utils';

const GroupDirectory = ({ actions, TabBar }: SubDirectoryProps) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useContactGroups();
  const items = data ? data.nodes : [];

  const [{ activeUser }] = useUserContext();

  const columnLabels = useColumns<ContactGroup>(
    'groupName',
    SORT_ORDER.ASC,
    listLabels(!!activeUser),
    'directory',
    'contact_group',
  );

  const [
    allSelectedItems,
    { selectGroup, isAllGroupsSelected, toggleAllGroups },
  ] = useDirectorySelectionContext();

  const selectedItems = allSelectedItems.groups;

  const gridTemplateColumns = `30px 1fr 2fr ${
    !!activeUser ? '0.5fr ' : ''
  }30px`;

  return (
    <Page
      actions={[
        <l.AreaLink
          key="create"
          to="/directory/groups/create"
          mr={th.spacing.md}
        >
          <b.Primary>New</b.Primary>
        </l.AreaLink>,
        ...actions,
      ]}
      breadcrumbs={breadcrumbs('groups')}
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
                  checked={isAllGroupsSelected(items)}
                  onChange={() => toggleAllGroups(items)}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Group Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<ContactGroup>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels(!!activeUser)}
                    onSelectItem={() => selectGroup(item)}
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`groups/${item.id}`}
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
            header: 'No Groups Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default GroupDirectory;