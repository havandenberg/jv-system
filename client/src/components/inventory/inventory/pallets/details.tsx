import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import api from 'api';
import InvoiceList from 'components/accounting/invoices/list';
import BaseData from 'components/base-data';
import RepackList from 'components/inventory/repacks/list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import {
  InvoiceHeader,
  Pallet,
  PalletSection as PalletSectionType,
  RepackHeader,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

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
          to: `/inventory/vessels`,
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
      : { text: 'Pallets', to: `/inventory/pallets` },
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

const tabs: (
  sectionsCount: number,
  invoicesCount: number,
  repacksCount: number,
) => Tab[] = (sectionsCount, invoicesCount, repacksCount) => [
  {
    id: 'sections',
    text: `Sections (${sectionsCount})`,
  },
  {
    id: 'invoices',
    text: `Invoices (${invoicesCount})`,
  },
  {
    id: 'repacks',
    text: `Repacks (${repacksCount})`,
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
  const sections = (pallet?.palletSections.nodes || []) as PalletSectionType[];
  const invoices = (pallet?.invoices.nodes || []) as InvoiceHeader[];
  const repacks = (pallet?.repacks.nodes || []) as RepackHeader[];

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(sections.length, invoices.length, repacks.length),
  });

  const isSections = selectedTabId === 'sections';
  const isInvoices = selectedTabId === 'invoices';

  return (
    <Page
      actions={
        pallet && pallet.psaArrivalReport
          ? [
              <l.AreaLink
                key="inspection"
                to={`/reports/inspections/arrival/${pallet.psaArrivalReport.id}`}
              >
                <b.Primary>Inspection</b.Primary>
              </l.AreaLink>,
            ]
          : [
              <b.Primary disabled key="inspection">
                Inspection
              </b.Primary>,
            ]
      }
      breadcrumbs={breadcrumbs(palletId, vesselId, itemId, search)}
      title={pallet ? 'Pallet' : 'Loading...'}
    >
      {data ? (
        pallet && (
          <>
            <BaseData<Pallet> data={pallet} labels={baseLabels} />
            <l.Div my={th.spacing.lg}>
              <TabBar />
            </l.Div>
            {isSections ? (
              sections.length > 0 ? (
                sections.map((section, idx) => (
                  <PalletSection key={idx} section={section} />
                ))
              ) : (
                <DataMessage
                  data={sections}
                  error={error}
                  loading={false}
                  emptyProps={{
                    header: 'No sections found',
                  }}
                />
              )
            ) : isInvoices ? (
              <InvoiceList invoices={invoices} palletId={palletId} />
            ) : (
              <RepackList items={repacks} />
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
