import React, { useCallback } from 'react';
import { groupBy, isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useQueryValue } from 'hooks/use-query-params';
import {
  PsaApplePallet,
  PsaArrivalReport,
  PsaCherryPallet,
  PsaCitrusPallet,
  PsaGrapePallet,
  PsaLemonPallet,
  PsaPearPallet,
  PsaPersimmonPallet,
  PsaPomegranatePallet,
  PsaStoneFruitPallet,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { listLabels } from './data-utils';
import ListItem from './list-item';

export const gridTemplateColumns = 'repeat(2, 2fr) repeat(4, 1fr) 30px';

const PsaArrivalPallets = ({
  inspection,
}: {
  inspection: PsaArrivalReport;
}) => {
  const { search } = useLocation();
  const { data, loading, error } = api.usePsaArrivalPallets(
    `${inspection.arrivalCode} ${inspection.arrivalName}`,
    `${inspection.exporterName}`,
  );
  const [variety] = useQueryValue('variety');

  const grapeColumnLabels = useColumns<PsaGrapePallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_grape_pallet',
  );
  const citrusColumnLabels = useColumns<PsaCitrusPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_citrus_pallet',
  );
  const stoneFruitColumnLabels = useColumns<PsaStoneFruitPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_stone_fruit_pallet',
  );
  const pomegranateColumnLabels = useColumns<PsaPomegranatePallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_pomegranate_pallet',
  );
  const persimmonColumnLabels = useColumns<PsaPersimmonPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_persimmon_pallet',
  );
  const pearColumnLabels = useColumns<PsaPearPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_pear_pallet',
  );
  const lemonColumnLabels = useColumns<PsaLemonPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_lemon_pallet',
  );
  const cherryColumnLabels = useColumns<PsaCherryPallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_cherry_pallet',
  );
  const appleColumnLabels = useColumns<PsaApplePallet>(
    'palletId',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_apple_pallet',
  );

  const getData = useCallback(() => {
    const getPalletsByVariety = <
      T extends
        | PsaGrapePallet[]
        | PsaCitrusPallet[]
        | PsaStoneFruitPallet[]
        | PsaPomegranatePallet[]
        | PsaPersimmonPallet[]
        | PsaPearPallet[]
        | PsaLemonPallet[]
        | PsaCherryPallet[]
        | PsaApplePallet[],
    >(
      pallets: T,
    ) =>
      groupBy(
        (p) => `${p.variety}`,
        pallets as (
          | PsaGrapePallet
          | PsaCitrusPallet
          | PsaStoneFruitPallet
          | PsaPomegranatePallet
          | PsaPersimmonPallet
          | PsaPearPallet
          | PsaLemonPallet
          | PsaCherryPallet
          | PsaApplePallet
        )[],
      );

    if (data) {
      const {
        psaGrapePallets,
        psaCitrusPallets,
        psaStoneFruitPallets,
        psaPomegranatePallets,
        psaPersimmonPallets,
        psaPearPallets,
        psaLemonPallets,
        psaCherryPallets,
        psaApplePallets,
      } = data;

      if (psaGrapePallets && !isEmpty(psaGrapePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaGrapePallets.nodes as PsaGrapePallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaGrapePallet[])
            : [];
        return {
          columnLabels: grapeColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaGrapePallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaCitrusPallets && !isEmpty(psaCitrusPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaCitrusPallets.nodes as PsaCitrusPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaCitrusPallet[])
            : [];
        return {
          columnLabels: citrusColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaCitrusPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaStoneFruitPallets && !isEmpty(psaStoneFruitPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaStoneFruitPallets.nodes as PsaStoneFruitPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaStoneFruitPallet[])
            : [];
        return {
          columnLabels: stoneFruitColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaStoneFruitPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaPomegranatePallets && !isEmpty(psaPomegranatePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaPomegranatePallets.nodes as PsaPomegranatePallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaPomegranatePallet[])
            : [];
        return {
          columnLabels: pomegranateColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaPomegranatePallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaPersimmonPallets && !isEmpty(psaPersimmonPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaPersimmonPallets.nodes as PsaPersimmonPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaPersimmonPallet[])
            : [];
        return {
          columnLabels: persimmonColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaPersimmonPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaPearPallets && !isEmpty(psaPearPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaPearPallets.nodes as PsaPearPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaPearPallet[])
            : [];
        return {
          columnLabels: pearColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaPearPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaLemonPallets && !isEmpty(psaLemonPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaLemonPallets.nodes as PsaLemonPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaLemonPallet[])
            : [];
        return {
          columnLabels: lemonColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaLemonPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaCherryPallets && !isEmpty(psaCherryPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaCherryPallets.nodes as PsaCherryPallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaCherryPallet[])
            : [];
        return {
          columnLabels: cherryColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaCherryPallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }

      if (psaApplePallets && !isEmpty(psaApplePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          psaApplePallets.nodes as PsaApplePallet[],
        );
        const selectedPallets =
          variety && palletsByVariety[variety]
            ? (palletsByVariety[variety] as PsaApplePallet[])
            : [];
        return {
          columnLabels: appleColumnLabels,
          listItems: selectedPallets.map((pallet, idx) => (
            <ListItem<PsaApplePallet>
              data={pallet}
              key={idx}
              listLabels={listLabels}
              slug={`${inspection.id}/pallets/${pallet.id}${search}`}
            />
          )),
        };
      }
    }
    return {
      columnLabels: [],
      listItems: [],
    };
  }, [
    citrusColumnLabels,
    grapeColumnLabels,
    stoneFruitColumnLabels,
    pomegranateColumnLabels,
    persimmonColumnLabels,
    pearColumnLabels,
    lemonColumnLabels,
    cherryColumnLabels,
    appleColumnLabels,
    data,
    inspection.id,
    search,
    variety,
  ]);

  const { columnLabels, listItems } = getData();

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!loading && !isEmpty(listItems) && variety ? (
        listItems
      ) : (
        <DataMessage
          data={listItems}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Pallets Found 😔',
          }}
        />
      )}
    </>
  );
};

export default PsaArrivalPallets;
