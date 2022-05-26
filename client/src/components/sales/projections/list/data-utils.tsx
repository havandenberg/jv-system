import React from 'react';
import { loader } from 'graphql.macro';
import { pluck, uniq } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import StatusIndicator from 'components/status-indicator';
import {
  ShipperProjection,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';
import l from 'ui/layout';

const SHIPPER_DISTINCT_VALUES_QUERY = loader(
  '../../../../api/directory/shipper/distinct-values.gql',
);

export type ShipperProjectionLabelInfo = LabelInfo<ShipperProjection>;

export const listLabels: ShipperProjectionLabelInfo[] = [
  {
    key: 'shipperId',
    label: 'Shipper',
    sortable: true,
    filterable: true,
    filterPanelProps: {
      customStyles: {
        width: 400,
      },
      queryProps: {
        query: SHIPPER_DISTINCT_VALUES_QUERY,
        queryName: 'shipperDistinctValues',
      },
      showSearch: true,
    },
    getValue: ({ shipper }) => `${shipper?.shipperName} (${shipper?.id})`,
  },
  {
    key: 'submittedAt',
    label: 'Date Submitted',
    sortable: true,
    getValue: ({ submittedAt }) => formatDate(new Date(submittedAt)),
  },
  {
    key: 'totalPallets',
    label: 'Total Pallets',
    sortable: true,
  },
  {
    key: 'id',
    label: 'Summary',
    getValue: ({ shipperProjectionVesselInfosByProjectionId }) => {
      if (!shipperProjectionVesselInfosByProjectionId) return '';
      const shipperProjectionEntries = pluck(
        'shipperProjectionEntriesByVesselInfoId',
        shipperProjectionVesselInfosByProjectionId.nodes as ShipperProjectionVesselInfo[],
      )
        .map(({ nodes }) => nodes)
        .flat();
      const speciesList = uniq(
        pluck(
          'species',
          shipperProjectionEntries.map(
            (entry) => entry?.product as ShipperProjectionProduct,
          ),
        ),
      );
      return speciesList
        .map(
          (species) =>
            `${species?.slice(0, 3)}. (${shipperProjectionEntries
              .filter((entry) => entry?.product?.species === species)
              .reduce(
                (acc, entry) => acc + parseInt(entry?.palletCount, 10) || 0,
                0,
              )})`,
        )
        .join(', ');
    },
  },
  {
    allowClick: true,
    key: 'reviewStatus',
    label: 'Reviewed',
    sortable: true,
    getValue: ({ reviewStatus }) => (
      <l.Flex alignCenter justifyCenter>
        <StatusIndicator
          status={
            reviewStatus === 2
              ? 'success'
              : reviewStatus === 0
              ? 'error'
              : 'warning'
          }
        />
      </l.Flex>
    ),
  },
];
