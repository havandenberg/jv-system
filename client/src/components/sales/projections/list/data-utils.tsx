import React from 'react';
import { loader } from 'graphql.macro';
import { pluck, uniq } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import StatusIndicator from 'components/status-indicator';
import { ShipperProjection, ShipperProjectionProduct } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

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
    key: 'completedAt',
    label: 'Date Completed',
    sortable: true,
    getValue: ({ completedAt }) => formatDate(new Date(completedAt)),
  },
  {
    key: 'totalPallets',
    label: 'Total Pallets',
    sortable: true,
  },
  {
    key: 'id',
    label: 'Summary',
    getValue: ({ shipperProjectionEntries }) => {
      if (!shipperProjectionEntries) return '';
      const speciesList = uniq(
        pluck(
          'species',
          shipperProjectionEntries.nodes.map(
            (entry) => entry?.product as ShipperProjectionProduct,
          ),
        ),
      );
      return speciesList
        .map(
          (species) =>
            `${species?.slice(0, 3)}. (${shipperProjectionEntries.nodes
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
    key: 'isReviewed',
    label: 'Reviewed',
    sortable: true,
    getValue: ({ isReviewed }) => (
      <l.Flex>
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator status={isReviewed ? 'success' : 'warning'} />
        </l.Flex>
        {!isReviewed && (
          <b.Primary
            fontSize={th.fontSizes.small}
            height={th.sizes.icon}
            ml={40}
          >
            Review
          </b.Primary>
        )}
      </l.Flex>
    ),
  },
];
