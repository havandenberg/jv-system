import React, { useCallback } from 'react';
import { ApolloError } from '@apollo/client';
import { groupBy, isEmpty } from 'ramda';
import { useLocation } from 'react-router-dom';
import { StringParam } from 'use-query-params';

import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useQuerySet } from 'hooks/use-query-params';
import {
  Maybe,
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

import { filterPallets } from '../data-utils';
import { listLabels } from './data-utils';
import ListItem from './list-item';

export const gridTemplateColumns = '1.5fr 0.8fr 1.5fr 1fr 0.9fr 0.8fr 30px';

const PsaArrivalPallets = ({
  inspection,
  loading,
  error,
}: {
  inspection?: Maybe<PsaArrivalReport>;
  loading: boolean;
  error?: ApolloError;
}) => {
  const { search } = useLocation();
  const [
    { variety, size, growerCode, labelCode, overallQuality, overallCondition },
  ] = useQuerySet({
    commodity: StringParam,
    variety: StringParam,
    size: StringParam,
    growerCode: StringParam,
    labelCode: StringParam,
    overallQuality: StringParam,
    overallCondition: StringParam,
  });

  const grapeColumnLabels = useColumns<PsaGrapePallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_grape_pallet',
  );
  const citrusColumnLabels = useColumns<PsaCitrusPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_citrus_pallet',
  );
  const stoneFruitColumnLabels = useColumns<PsaStoneFruitPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_stone_fruit_pallet',
  );
  const pomegranateColumnLabels = useColumns<PsaPomegranatePallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_pomegranate_pallet',
  );
  const persimmonColumnLabels = useColumns<PsaPersimmonPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_persimmon_pallet',
  );
  const pearColumnLabels = useColumns<PsaPearPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_pear_pallet',
  );
  const lemonColumnLabels = useColumns<PsaLemonPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_lemon_pallet',
  );
  const cherryColumnLabels = useColumns<PsaCherryPallet>(
    'size',
    SORT_ORDER.ASC,
    listLabels,
    'inspection',
    'psa_cherry_pallet',
  );
  const appleColumnLabels = useColumns<PsaApplePallet>(
    'size',
    SORT_ORDER.ASC,
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

    if (inspection) {
      const {
        grapePallets,
        citrusPallets,
        stoneFruitPallets,
        pomegranatePallets,
        persimmonPallets,
        pearPallets,
        lemonPallets,
        cherryPallets,
        applePallets,
      } = inspection;

      const palletFilters = {
        size,
        growerCode,
        labelCode,
        overallQuality,
        overallCondition,
      };

      if (grapePallets && !isEmpty(grapePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(grapePallets.nodes, palletFilters) as PsaGrapePallet[],
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

      if (citrusPallets && !isEmpty(citrusPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(
            citrusPallets.nodes,
            palletFilters,
          ) as PsaCitrusPallet[],
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

      if (stoneFruitPallets && !isEmpty(stoneFruitPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(
            stoneFruitPallets.nodes,
            palletFilters,
          ) as PsaStoneFruitPallet[],
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

      if (pomegranatePallets && !isEmpty(pomegranatePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(
            pomegranatePallets.nodes,
            palletFilters,
          ) as PsaPomegranatePallet[],
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

      if (persimmonPallets && !isEmpty(persimmonPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(
            persimmonPallets.nodes,
            palletFilters,
          ) as PsaPersimmonPallet[],
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

      if (pearPallets && !isEmpty(pearPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(pearPallets.nodes, palletFilters) as PsaPearPallet[],
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

      if (lemonPallets && !isEmpty(lemonPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(lemonPallets.nodes, palletFilters) as PsaLemonPallet[],
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

      if (cherryPallets && !isEmpty(cherryPallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(
            cherryPallets.nodes,
            palletFilters,
          ) as PsaCherryPallet[],
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

      if (applePallets && !isEmpty(applePallets.nodes)) {
        const palletsByVariety = getPalletsByVariety(
          filterPallets(applePallets.nodes, palletFilters) as PsaApplePallet[],
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
    inspection,
    search,
    variety,
    size,
    growerCode,
    labelCode,
    overallQuality,
    overallCondition,
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
            text: 'Modify filter parameters to view more results.',
          }}
        />
      )}
    </>
  );
};

export default PsaArrivalPallets;
