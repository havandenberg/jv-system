import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { Vessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { scheduleListLabels } from './data-utils';

const gridTemplateColumns = '80px 80px 50px 1fr 100px 50px 1fr 30px';

const breadcrumbs = [
  { text: 'Vessels', to: '/inventory/vessels' },
  { text: 'Schedule', to: '/inventory/vessels/schedule' },
];

const VesselSchedule = () => {
  const { TabBar: CoastFilter, selectedTabId: coast } = useCoastTabBar();
  const [{ sortBy, sortOrder }] = useSortQueryParams();

  const { data, loading, error } = api.useVesselSchedule();
  const vessels = (data?.nodes || []) as Vessel[];
  const filteredVessels = getSortedItems(
    scheduleListLabels,
    vessels.filter((vessel) => vessel?.coast === coast),
    sortBy,
    sortOrder,
  );

  const columnLabels = useColumns<Vessel>(
    'dischargeDate',
    SORT_ORDER.ASC,
    scheduleListLabels,
    'product',
    'vessel',
  );

  return (
    <Page
      actions={[
        <l.Flex justifyBetween key="actions" width={300}>
          <CoastFilter />
          <div />
        </l.Flex>,
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={22}
      headerChildren={
        <l.Grid
          alignCenter
          bg={th.colors.background}
          gridTemplateColumns={gridTemplateColumns}
          pb={th.spacing.sm}
          pl={th.spacing.sm}
          width={`calc(80% - ${th.spacing.md} - 2px)`}
        >
          {columnLabels}
        </l.Grid>
      }
      title={`${coast === 'EC' ? 'East' : 'West'} Coast Vessel Schedule`}
    >
      {!isEmpty(filteredVessels) ? (
        <VirtualizedList
          height={700}
          rowCount={data ? filteredVessels.length : 0}
          rowRenderer={({ key, index, style }) => {
            const vessel = filteredVessels[index];
            return (
              vessel && (
                <div key={key} style={style}>
                  <ListItem<Vessel>
                    customStyles={{ wrapper: { width: '80%' } }}
                    data={vessel}
                    gridTemplateColumns={gridTemplateColumns}
                    index={index}
                    listLabels={scheduleListLabels}
                    to={`/inventory/vessels/${vessel.vesselCode}`}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={vessels}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No vessels found',
          }}
        />
      )}
    </Page>
  );
};

export default VesselSchedule;
