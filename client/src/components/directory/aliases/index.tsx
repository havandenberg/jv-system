import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useUserContext } from 'components/user/context';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { ContactAlias } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { useDirectorySelectionContext } from '../selection-context';
import { listLabels } from './data-utils';

const AliasDirectory = ({ actions, TabBar }: SubDirectoryProps) => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useContactAliases();
  const items = data ? data.nodes : [];

  const [{ activeUser }] = useUserContext();

  const columnLabels = useColumns<ContactAlias>(
    'aliasName',
    SORT_ORDER.ASC,
    listLabels(!!activeUser),
    'directory',
    'contact_alias',
  );

  const [
    allSelectedItems,
    { selectAlias, isAllAliasesSelected, toggleAllAliases },
  ] = useDirectorySelectionContext();

  const selectedItems = allSelectedItems.aliases;

  const gridTemplateColumns = `30px 1fr 2fr ${
    !!activeUser ? '0.5fr ' : ''
  }30px`;

  return (
    <Page
      actions={[
        <l.AreaLink
          key="create"
          to="/directory/aliases/create"
          mr={th.spacing.md}
        >
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
                  checked={isAllAliasesSelected(items)}
                  onChange={() => toggleAllAliases(items)}
                />
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Alias Directory"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<ContactAlias>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels(!!activeUser)}
                    onSelectItem={() => selectAlias(item)}
                    selected={!!selectedItems.find((it) => it.id === item.id)}
                    slug={`aliases/${item.id}`}
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
            header: 'No Aliases Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default AliasDirectory;
