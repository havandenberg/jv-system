import React from 'react';
import { sentenceCase } from 'change-case';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { Company } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { breadcrumbs, SubDirectoryProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const gridTemplateColumns = '30px 1fr 3fr 3fr 3fr 30px';

interface Props extends SubDirectoryProps {
  companyType: 'shipper' | 'customer';
}

const CompanyDirectory = ({
  actions,
  companyType,
  Search,
  selectedItems,
  selectItem,
  TabBar,
  toggleSelectAll,
}: Props) => {
  const { data, loading, error } = api.useCompanies(companyType);
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<Company>(
    'companyName',
    SORT_ORDER.ASC,
    listLabels,
    'company',
  );

  const isAllSelected =
    selectedItems.length > 0 &&
    selectedItems.length === (data ? data.totalCount : -1);
  const handleSelectAll = () => {
    toggleSelectAll(
      isAllSelected,
      (items as Company[]).map((company) => ({
        id: company.id,
        email: company.primaryContact?.email || '',
        description: `${
          company.primaryContact?.contactName || ''
        } - ${sentenceCase(companyType)}`,
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
              <ListItem<Company>
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                key={idx}
                listLabels={listLabels}
                onSelectItem={() =>
                  selectItem({
                    id: item.id,
                    email: item.primaryContact?.email || '',
                    description: `${
                      item.primaryContact?.contactName || ''
                    } - ${sentenceCase(companyType)}`,
                  })
                }
                selected={!!selectedItems.find((it) => it.id === item.id)}
                slug={`${
                  companyType === 'shipper' ? 'shippers' : 'customers'
                }/${item.id}`}
              />
            ),
        )
      ) : (
        <DataMessage
          data={items}
          error={error}
          loading={loading}
          emptyProps={{
            header: `No ${
              companyType === 'shipper' ? 'Shippers' : 'Customers'
            } Found 😔`,
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default CompanyDirectory;
