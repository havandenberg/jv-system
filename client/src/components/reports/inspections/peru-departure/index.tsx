import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PeruDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns, InspectionTypes, SubInspectionsProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

const PeruDepartureInspections = ({
  breadcrumbs,
  DateRangePicker,
  Search,
  TabBar,
}: SubInspectionsProps) => {
  const { data, loading, error } = api.usePeruDepartureInspections();
  const inspections = data ? data.nodes : [];

  const columnLabels = useColumns<PeruDepartureInspection>(
    'inspectionDate',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'peru_departure_inspection',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={101}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            <l.Flex>
              {Search}
              <l.Div width={th.spacing.md} />
              {DateRangePicker}
              <l.Div width={th.spacing.md} />
            </l.Flex>
            {TabBar}
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
                pr={data ? (data.totalCount > 7 ? th.spacing.md : 0) : 0}
              >
                {columnLabels}
                <ty.SmallText px={th.spacing.sm} secondary>
                  Images
                </ty.SmallText>
              </l.Grid>
            </>
          )}
        </>
      }
      title="Product Inspection Reports"
    >
      {!isEmpty(inspections) ? (
        <VirtualizedList
          rowCount={data ? data.totalCount : 0}
          rowHeight={74}
          rowRenderer={({ key, index, style }) => {
            const item = inspections[index];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<PeruDepartureInspection>
                    data={item}
                    key={key}
                    lightboxTitle={item.containerId}
                    listLabels={listLabels}
                    slug={`${InspectionTypes.PERU_DEPARTURE}/${item.containerId}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={inspections}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Reports Found 😔',
            text: 'Modify search and date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default PeruDepartureInspections;
