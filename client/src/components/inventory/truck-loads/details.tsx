import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import PalletList from 'components/inventory/inventory/pallets/list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useTruckLoadsQueryParams,
} from 'hooks/use-query-params';
import { Pallet, TruckLoad } from 'types';
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

const tabs: (itemCount: number, pickupCount: number) => Tab[] = (
  itemCount,
  pickupCount,
) => [
  ...(pickupCount && pickupCount > 1
    ? [
        {
          id: 'pickupLocations',
          text: `Pickups (${pickupCount})`,
        },
      ]
    : []),
  {
    id: 'pallets',
    text: `Pallets ${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [, setSortParams] = useSortQueryParams();
  const [{ location }, setTruckLoadsParams] = useTruckLoadsQueryParams();

  const { data, error, loading } = api.useTruckLoad(id);
  const truckLoads = useMemo(
    () => ((data?.nodes || []) as TruckLoad[]).filter((tl) => tl.loadId === id),
    [data, id],
  );
  const truckLoad = location
    ? truckLoads.find((truckLoad) => `${truckLoad?.warehouse?.id}` === location)
    : truckLoads[0];
  const pallets = location
    ? ((truckLoad?.pallets.nodes || []) as Pallet[])
    : truckLoads.map((tl) => tl.pallets.nodes as Pallet[]).flat();
  const hasPallets = pallets.length > 0;

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(pallets.length, location ? 0 : truckLoads.length),
    isRoute: false,
    defaultTabId: 'pickupLocations',
    paramName: 'truckLoadView',
  });
  const prevSelectedTabId = usePrevious(selectedTabId);

  useEffect(() => {
    if (prevSelectedTabId !== selectedTabId) {
      const isPickups = selectedTabId === 'pickupLocations';
      setSortParams(
        {
          sortBy: isPickups ? 'backOrderId' : 'palletId',
          sortOrder: SORT_ORDER.ASC,
        },
        'replaceIn',
      );
    }
  }, [prevSelectedTabId, selectedTabId, setSortParams]);

  useEffect(() => {
    if (truckLoads && truckLoads.length === 1 && truckLoad && !location) {
      setTruckLoadsParams(
        { location: `${truckLoad.warehouse?.id}`, truckLoadView: 'pallets' },
        'replaceIn',
      );
    }
  }, [location, truckLoads, truckLoad, setTruckLoadsParams]);

  const isPickups =
    selectedTabId === 'pickupLocations' && !location && truckLoads.length > 1;

  const clearLocation = () => {
    setTruckLoadsParams({
      location: undefined,
      truckLoadView: truckLoads.length > 1 ? 'pickupLocations' : 'pallets',
    });
  };

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={truckLoad ? 'Truck Load Details' : 'Loading...'}
    >
      {truckLoad ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<TruckLoad>
            data={truckLoad}
            labels={indexBaseLabels(
              (truckLoad && location) || undefined,
              hasPallets,
            )}
          />
          {(location || truckLoads.length === 1) && (
            <>
              <l.Flex alignCenter my={th.spacing.md}>
                <ty.CaptionText>Pickup Location:</ty.CaptionText>
                {truckLoads.length > 1 && (
                  <l.HoverButton
                    dark
                    ml={th.spacing.lg}
                    onClick={clearLocation}
                  >
                    <ty.CaptionText>Show All</ty.CaptionText>
                  </l.HoverButton>
                )}
              </l.Flex>
              <BaseData<TruckLoad> data={truckLoad} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
          </l.Flex>
          {isPickups ? (
            <TruckLoadList
              baseUrl="/inventory/truck-loads/"
              items={truckLoads}
            />
          ) : hasPallets ? (
            <PalletList
              pallets={pallets}
              originalLoad={truckLoad?.originalTruckLoad || undefined}
            />
          ) : (
            <DataMessage data={pallets} error={error} loading={loading} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={truckLoads} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
