import React, { useEffect } from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { ChileDepartureInspection, PeruDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels as chileListLabels } from './chile-departure/data-utils';
import { listLabels as peruListLabels } from './peru-departure/data-utils';
import ListItem from './list-item';

const breadcrumbs = (params: string = '') => [
  { text: 'All Inspections', to: `/reports/inspections${params}` },
];
export const gridTemplateColumns = '3.5fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

export enum InspectionType {
  PERU_DEPARTURE = 'peru_departure_inspection',
  CHILE_DEPARTURE = 'chile_departure_inspection',
  PSA_ARRIVAL = 'psa_arrival_inspection',
  UNKNOWN = 'unknown',
}

const tabs: Tab[] = [
  {
    id: InspectionType.PSA_ARRIVAL,
    text: 'Arrival',
    disabled: true,
  },
  {
    id: InspectionType.PERU_DEPARTURE,
    text: 'D - Peru',
  },
  {
    id: InspectionType.CHILE_DEPARTURE,
    text: 'D - Chile',
  },
];

const Inspections = () => {
  const chileQuery = api.useChileDepartureInspections();
  const peruQuery = api.usePeruDepartureInspections();

  const { DateRangePicker } = useDateRange();
  const { Search } = useSearch();
  const [{ sortBy, sortOrder }, setSortParams] = useSortQueryParams();
  const { selectedTabId, TabBar } = useTabBar(
    tabs,
    InspectionType.PERU_DEPARTURE,
    true,
  );

  const query =
    selectedTabId === InspectionType.PERU_DEPARTURE ? peruQuery : chileQuery;
  const { data, loading, error } = query;
  const inspections = data ? data.nodes : [];

  const peruColumnLabels = useColumns<PeruDepartureInspection>(
    'inspectionDate',
    SORT_ORDER.DESC,
    peruListLabels,
    'peru_departure_inspection',
  );

  const chileColumnLabels = useColumns<ChileDepartureInspection>(
    'inspectionDate',
    SORT_ORDER.DESC,
    chileListLabels,
    'chile_departure_inspection_pallet',
  );

  const columnLabels =
    selectedTabId === InspectionType.PERU_DEPARTURE
      ? peruColumnLabels
      : chileColumnLabels;

  useEffect(() => {
    if (selectedTabId === InspectionType.PERU_DEPARTURE) {
      if (sortBy === 'shipper') {
        setSortParams({ sortBy: 'exporter', sortOrder });
      } else if (sortBy === 'lotNumber') {
        setSortParams({ sortBy: 'containerId', sortOrder });
      }
    } else {
      if (sortBy === 'exporter') {
        setSortParams({ sortBy: 'shipper', sortOrder });
      } else if (sortBy === 'containerId') {
        setSortParams({ sortBy: 'lotNumber', sortOrder });
      }
    }
  }, [selectedTabId, setSortParams, sortBy, sortOrder]);

  const listItems = () =>
    inspections &&
    (inspections as Array<
      PeruDepartureInspection | ChileDepartureInspection
    >).map((inspection, idx) => {
      const peruInspection = inspection as PeruDepartureInspection;
      const chileInspection = inspection as ChileDepartureInspection;
      return selectedTabId === InspectionType.PERU_DEPARTURE ? (
        <ListItem<PeruDepartureInspection>
          data={peruInspection}
          key={idx}
          lightboxTitle={peruInspection.containerId}
          listLabels={peruListLabels}
          slug={`d-peru/${peruInspection.containerId}`}
        />
      ) : (
        <ListItem<ChileDepartureInspection>
          data={chileInspection}
          key={idx}
          lightboxTitle={`${chileInspection.lotNumber}`}
          listLabels={chileListLabels}
          slug={`d-chile/${chileInspection.lotNumber}`}
        />
      );
    });

  return (
    <Page
      breadcrumbs={breadcrumbs(`?reportType=${selectedTabId}`)}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm}>
            {Search}
            <l.Div width={th.spacing.md} />
            {DateRangePicker}
            <l.Div width={th.spacing.md} />
            <TabBar />
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
        listItems()
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

export default Inspections;
