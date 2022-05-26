import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useSearch from 'hooks/use-search';
import { ShipperProjection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { ShipperProjectionProps } from '../';
import ProjectionSettings from '../settings';
import { listLabels } from './data-utils';
import ListItem from './item';

const gridTemplateColumns = '1.5fr 150px 115px 2fr 100px 30px';

const ShipperProjectionList = ({
  CoastTabBar,
  ViewTabBar,
  Reset,
  DateRangePicker,
  handleDateChange,
}: ShipperProjectionProps) => {
  const { Search, clearSearch } = useSearch();

  const { data, loading, error } = api.useShipperProjections();
  const items = data ? data.nodes : [];

  const columnLabels = useColumns<ShipperProjection>(
    'submittedAt',
    SORT_ORDER.DESC,
    listLabels,
    'product',
    'shipper_projection',
  );

  return (
    <Page
      actions={[<ProjectionSettings key={0} />]}
      extraPaddingTop={107}
      headerChildren={
        <>
          <l.Flex>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                View
              </ty.SmallText>
              {ViewTabBar}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Search Projections
              </ty.SmallText>
              <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
                {Search}
              </l.Flex>
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Coast
              </ty.SmallText>
              {CoastTabBar}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.SmallText mb={th.spacing.sm} secondary>
                Date Range
              </ty.SmallText>
              {DateRangePicker}
            </l.Div>
            <div>
              <l.Div height={29} />
              <l.Div onClick={clearSearch}>{Reset}</l.Div>
            </div>
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} ml={216}>
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
      title="Shipper Projections"
    >
      {!isEmpty(items) ? (
        <VirtualizedList
          rowCount={data ? items.length : 0}
          rowRenderer={({ key, index, style }) => {
            const item = items[index];
            const submittedAt = item ? new Date(item.submittedAt) : new Date();
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<ShipperProjection>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    handleDateChange={() => {
                      handleDateChange({
                        selection: {
                          startDate: submittedAt,
                          endDate: submittedAt,
                          key: 'selection',
                        },
                      });
                    }}
                    listLabels={listLabels}
                    projectionId={item.id || ''}
                    shipperId={item.shipper?.id || ''}
                    startDate={formatDate(submittedAt)}
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
            header: 'No projections found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ShipperProjectionList;
