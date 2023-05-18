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
import { WireRequest } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels as getListLabels } from './data-utils';

const gridTemplateColumns = '120px 120px 1fr 100px 80px 50px 30px';

const breadcrumbs = [{ text: 'Wire Requests', to: '/accounting/wires' }];

const Wires = () => {
  const {
    roles: { isAccounting, isEditWires },
  } = useActiveUser();

  const { Search } = useSearch();
  const [{ sortBy = 'wireDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const { data: wires, vendorOptions, loading, error } = api.useWireRequests();

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange();

  const listLabels = getListLabels(vendorOptions);

  const columnLabels = useColumns<WireRequest>(
    'wireDate',
    SORT_ORDER.DESC,
    listLabels,
    'accounting',
    'wire_request',
  );

  const sortedWires = getSortedItems(listLabels, wires, sortBy, sortOrder);

  if (!isAccounting) {
    return <Redirect to="/accounting" />;
  }

  return (
    <Page
      actions={[
        isEditWires && (
          <l.AreaLink key="create" to="/accounting/wires/create">
            <b.Success>Create</b.Success>
          </l.AreaLink>
        ),
        process.env.REACT_APP_IS_PRODUCTION === 'false' && (
          <l.AreaLink
            key="wire-control"
            ml={th.spacing.lg}
            to="/accounting/wire-control"
          >
            <b.Primary>Control Log</b.Primary>
          </l.AreaLink>
        ),
      ]}
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
                    Results: {!loading ? sortedWires.length : '-'}
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
                  to="/accounting/wires"
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
      title="Wires"
    >
      {!isEmpty(sortedWires) ? (
        <VirtualizedList
          rowCount={loading ? 0 : sortedWires.length}
          rowRenderer={({ key, index, style }) => {
            const item = sortedWires[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<WireRequest>
                    data={item as WireRequest}
                    gridTemplateColumns={gridTemplateColumns}
                    index={index}
                    listLabels={listLabels}
                    to={`/accounting/wires/${item.id}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={sortedWires}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No wires found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Wires;
