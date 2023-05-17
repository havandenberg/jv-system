import React from 'react';
import { isEmpty } from 'ramda';
import { Redirect } from 'react-router-dom';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useActiveUser } from 'components/user/context';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import { useSortQueryParams } from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { CheckHeader } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels as getListLabels } from './data-utils';

const gridTemplateColumns = '120px 120px 1fr 200px 80px 50px 30px';

const breadcrumbs = [{ text: 'Checks', to: '/accounting/checks' }];

const Checks = () => {
  const {
    roles: { isAccounting },
  } = useActiveUser();

  const { Search } = useSearch();
  const [{ sortBy = 'checkDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const {
    data: checks,
    vendorOptions,
    statusOptions,
    loading,
    error,
  } = api.useChecks();

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange();

  const listLabels = getListLabels(vendorOptions, statusOptions);

  const columnLabels = useColumns<CheckHeader>(
    'checkDate',
    SORT_ORDER.DESC,
    listLabels,
    'accounting',
    'check_header',
  );

  const sortedChecks = getSortedItems(listLabels, checks, sortBy, sortOrder);

  if (!isAccounting) {
    return <Redirect to="/accounting" />;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={111}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
                <ty.SmallText secondary>Search</ty.SmallText>
                {!loading && (
                  <ty.SmallText secondary>
                    Results: {!loading ? sortedChecks.length : '-'}
                  </ty.SmallText>
                )}
              </l.Flex>
              {Search}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Date Range
              </ty.SmallText>
              <l.Flex alignCenter>
                {DateRangePicker}
                {BackwardButton}
                {ForwardButton}
              </l.Flex>
            </l.Div>
            <div>
              <l.Div height={24} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to="/accounting/checks"
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns}
            mb={th.spacing.sm}
            pl={th.spacing.sm}
          >
            {columnLabels}
          </l.Grid>
        </>
      }
      title="Checks"
    >
      {!isEmpty(sortedChecks) ? (
        <VirtualizedList
          rowCount={loading ? 0 : sortedChecks.length}
          rowRenderer={({ key, index, style }) => {
            const item = sortedChecks[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<CheckHeader>
                    data={item as CheckHeader}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    to={`/accounting/checks/${item.checkNumber}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={sortedChecks}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No checks found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Checks;
