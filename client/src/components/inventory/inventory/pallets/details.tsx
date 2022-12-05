import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import { Tab, useTabBar } from 'components/tab-bar';
import { Pallet, PalletSection as PalletSectionType } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels } from './data-utils';
import PalletSection from './section';

const breadcrumbs = (
  id: string,
  vesselId: string,
  itemId: string,
  search: string,
) => {
  const crumbs = [
    vesselId
      ? {
          text: 'Vessels',
          to: `/inventory/vessels${search}`,
        }
      : {
          text: 'Inventory',
          to: `/inventory${search}`,
        },
    itemId
      ? {
          text: 'Item',
          to: `/inventory/${
            vesselId ? 'vessels/' + vesselId + '/' : ''
          }items/${itemId}${search}`,
        }
      : { text: 'Pallets', to: `/inventory/pallets${search}` },
    {
      text: 'Pallet',
      to: `/inventory/${vesselId ? 'vessels/' + vesselId + '/' : ''}${
        itemId ? 'items/' + itemId + '/' : ''
      }pallets/${id}${search}`,
    },
  ];
  if (vesselId) {
    crumbs.splice(1, 0, {
      text: 'Vessel',
      to: `/inventory/${vesselId ? 'vessels/' + vesselId + '/' : ''}${search}`,
    });
  }
  return crumbs;
};

const tabs: Tab[] = [
  {
    id: 'sections',
    text: 'Sections',
  },
];

const Details = () => {
  const { search } = useLocation();
  const { palletId, vesselId, itemId } = useParams<{
    palletId: string;
    vesselId: string;
    itemId: string;
  }>();
  const { data, error, loading } = api.usePallet(palletId);
  const pallet = ((data?.nodes || []) as Pallet[])[0] || null;
  const palletSections = (pallet?.palletSections.nodes ||
    []) as PalletSectionType[];

  const { TabBar } = useTabBar({ tabs });

  const hasOrder = ![undefined, null, '0'].includes(pallet?.orderId);
  const hasBackOrder =
    hasOrder && ![undefined, null, '0'].includes(pallet?.backOrderId);

  return (
    <Page
      actions={
        pallet && pallet.psaArrivalReport
          ? [
              <l.AreaLink
                key={0}
                to={`/reports/inspections/arrival/${pallet.psaArrivalReport.id}`}
              >
                <b.Primary>Inspection</b.Primary>
              </l.AreaLink>,
            ]
          : []
      }
      breadcrumbs={breadcrumbs(palletId, vesselId, itemId, search)}
      title={pallet ? 'Pallet' : 'Loading...'}
    >
      {data ? (
        pallet && (
          <>
            <l.Flex mb={th.spacing.md}>
              <l.Flex
                alignCenter
                bg={th.colors.brand.containerBackground}
                border={th.borders.primary}
                borderRadius={th.borderRadii.default}
                p={th.spacing.md}
              >
                <ty.CaptionText mr={th.spacing.md}>
                  {pallet.shipped ? 'Invoice' : 'Order'} ID:
                </ty.CaptionText>
                {hasOrder ? (
                  <ty.LinkText
                    hover="false"
                    mr={th.spacing.lg}
                    to={`/${
                      pallet.shipped
                        ? 'accounting/invoices'
                        : 'inventory/orders'
                    }/${pallet.orderId}?`}
                  >
                    {pallet.orderId}
                  </ty.LinkText>
                ) : (
                  <ty.BodyText mr={th.spacing.lg}>-</ty.BodyText>
                )}
                <ty.CaptionText mr={th.spacing.md}>
                  Back Order ID:
                </ty.CaptionText>
                {hasBackOrder ? (
                  <ty.LinkText
                    hover="false"
                    to={`/inventory/orders/${pallet.orderId}?backOrderId=${pallet.backOrderId}`}
                    mr={th.spacing.lg}
                  >
                    {pallet.backOrderId}
                  </ty.LinkText>
                ) : (
                  <ty.BodyText mr={th.spacing.lg}>-</ty.BodyText>
                )}
                <ty.CaptionText mr={th.spacing.md}>Shipped:</ty.CaptionText>
                <StatusIndicator
                  status={pallet.shipped ? 'success' : 'error'}
                />
              </l.Flex>
            </l.Flex>
            <BaseData<Pallet> data={pallet} labels={baseLabels} />
            <l.Div my={th.spacing.lg}>
              <TabBar />
            </l.Div>
            {palletSections.length > 0 ? (
              palletSections.map((section, idx) => (
                <PalletSection key={idx} section={section} />
              ))
            ) : (
              <DataMessage
                data={palletSections}
                error={error}
                loading={false}
                emptyProps={{
                  header: 'No sections found',
                }}
              />
            )}
            <l.Div height={th.spacing.xxl} />
          </>
        )
      ) : (
        <DataMessage data={data || []} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
