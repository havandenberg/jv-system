import React from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useTruckLoadsQueryParams } from 'hooks/use-query-params';
import { TruckLoad } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, indexBaseLabels } from './data-utils';
import TruckLoadList from './list';

export const breadcrumbs = (id: string) => [
  {
    text: 'Truck Loads',
    to: `/inventory/truck-loads`,
  },
  {
    text: 'Load',
    to: `/inventory/truck-loads/${id}`,
  },
];
const truckLoadTabs: (itemCount: number, pickupCount: number) => Tab[] = (
  itemCount,
  pickupCount,
) => [
  {
    id: 'pickup-locations',
    text: `Pickup Locations${pickupCount ? ' (' + pickupCount + ')' : ''}`,
  },
  {
    id: 'pallets',
    text: `Pallets${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const palletTabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'pallets',
    text: `Pallets${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const [{ location }, setTruckLoadsParams] = useTruckLoadsQueryParams();

  const { data, error, loading } = api.useTruckLoad(id);
  const truckLoads = (data?.nodes || []) as TruckLoad[];
  const truckLoad = location
    ? truckLoads.find((truckLoad) => `${truckLoad?.warehouse?.id}` === location)
    : truckLoads[0];

  const { TabBar: TruckLoadTabBar, selectedTabId: selectedTruckLoadTab } =
    useTabBar(truckLoadTabs(0, truckLoads.length));
  const { TabBar: PalletTabBar } = useTabBar(palletTabs(0));

  const isPickups = selectedTruckLoadTab === 'pickup-locations' && !location;

  const clearLocation = () => {
    setTruckLoadsParams({ location: undefined });
  };

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={truckLoad ? 'Truck Load' : 'Loading...'}
    >
      {truckLoad ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<TruckLoad> data={truckLoad} labels={indexBaseLabels} />
          {location && (
            <>
              <l.Flex alignCenter justifyBetween my={th.spacing.md}>
                <ty.CaptionText>Pickup Location:</ty.CaptionText>
                <b.Primary onClick={clearLocation}>Show All</b.Primary>
              </l.Flex>
              <BaseData<TruckLoad> data={truckLoad} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            {location ? <PalletTabBar /> : <TruckLoadTabBar />}
          </l.Flex>
          {isPickups ? (
            <TruckLoadList baseUrl={`truck-loads/`} items={truckLoads} />
          ) : (
            <DataMessage data={[]} error={error} loading={loading} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={truckLoads} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
