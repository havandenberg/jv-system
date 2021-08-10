import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels } from './data-utils';
import ListItem from './list-item';
import useDateRange from 'hooks/use-date-range';
import { add, endOfISOWeek } from 'date-fns';

export const breadcrumbs = (slug: string) => [
  { text: 'Vessels', to: `/vessels/${slug}` },
];

const gridTemplateColumns = '1fr 0.5fr 0.5fr 2fr 1fr 2fr 30px';

const Vessels = () => {
  const { Search } = useSearch();
  const { data, loading, error } = api.useVessels();
  const items = data ? data.nodes : [];

  const { DateRangePicker } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
  });

  const columnLabels = useColumns<Vessel>(
    'dischargeDate',
    SORT_ORDER.ASC,
    listLabels,
    'product',
    'vessel',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs('')}
      extraPaddingTop={103}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.sm}>
            {Search}
            <l.Div width={th.spacing.md} />
            {DateRangePicker}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
              >
                {columnLabels}
              </l.Grid>
            </>
          )}
        </>
      }
      title="Vessels"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<Vessel>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    listLabels={listLabels}
                    slug={`vessels/${item.id}`}
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
            header: 'No Vessels Found 😔',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Vessels;
