import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import FeaturedValues from 'components/featured-values';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { InventoryItem, Pallet } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import PalletList from '../pallets/list';
import { baseLabels, getFeaturedValues } from './data-utils';

export const breadcrumbs = (id: string, vesselId: string, search: string) => {
  const crumbs = [
    vesselId
      ? {
          text: 'Vessels',
          to: `inventory/vessels`,
        }
      : {
          text: 'Inventory',
          to: `/inventory${search}`,
        },
    {
      text: 'Item',
      to: `/inventory/${
        vesselId ? 'vessels/' + vesselId + '/' : ''
      }items/${id}${search}`,
    },
  ];
  if (vesselId) {
    crumbs.splice(1, 0, {
      text: 'Vessel',
      to: `/inventory/${vesselId ? 'vessels/' + vesselId : ''}${search}`,
    });
  }
  return crumbs;
};

const tabs: (loading: boolean, count: number) => Tab[] = (loading, count) => [
  {
    id: 'pallets',
    text: `Pallets${loading ? '' : ' (' + count + ')'}`,
  },
];

const Details = () => {
  const { id, vesselId } = useParams<{
    id: string;
    vesselId: string;
  }>();
  const { search } = useLocation();
  const { data, error, loading } = api.useInventoryItem(id);

  const { TabBar } = useTabBar({
    tabs: tabs(loading, data?.pallets.nodes.length || 0),
  });

  const featuredValues = data ? getFeaturedValues(data as InventoryItem) : [];

  return (
    <Page
      breadcrumbs={breadcrumbs(id, vesselId, search)}
      title={data ? 'Inventory Item' : 'Loading...'}
    >
      {data ? (
        <l.Div pb={th.spacing.xxl}>
          <BaseData<InventoryItem> data={data} labels={baseLabels} />
          <l.Div mb={th.spacing.md} mt={th.spacing.lg}>
            <TabBar />
          </l.Div>
          <FeaturedValues gap={th.spacing.lg} values={featuredValues} />
          <l.Div height={th.spacing.lg} mb={th.spacing.md} />
          <PalletList
            baseUrl={`/inventory/${
              vesselId ? 'vessels/' + vesselId + '/' : ''
            }items/${id}`}
            pallets={data.pallets.nodes as Pallet[]}
          />
        </l.Div>
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
