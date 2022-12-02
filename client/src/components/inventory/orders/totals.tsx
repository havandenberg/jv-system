import React from 'react';

import { OrderEntry, OrderEntryItem, TruckRate } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatNumber, formatCurrency } from 'utils/format';

import {
  TRUCK_LOAD_MAX_WEIGHT,
  TRUCK_LOAD_MAX_PALLETS,
} from '../truck-loads/data-utils';
import {
  getOrderEntryEstimatedWeight,
  getOrderEntryEstimatedTotal,
  getOrderEntryEstimatedFreight,
} from './entry/data-utils';

type Props = {
  orderEntry: OrderEntry;
  truckRate?: TruckRate;
};

const OrderEntryTotals = ({ orderEntry, truckRate }: Props) => {
  const totalPalletCount = orderEntry.orderEntryItems.nodes.reduce(
    (acc, item) => acc + parseInt(item?.palletCount, 10) || 0,
    0,
  );
  const estimatedWeight = getOrderEntryEstimatedWeight(
    (orderEntry.orderEntryItems.nodes || []) as OrderEntryItem[],
  );
  const isFullLoad =
    estimatedWeight >= TRUCK_LOAD_MAX_WEIGHT - 2000 ||
    totalPalletCount === TRUCK_LOAD_MAX_PALLETS;
  const isOverweight =
    estimatedWeight > TRUCK_LOAD_MAX_WEIGHT ||
    totalPalletCount > TRUCK_LOAD_MAX_PALLETS;

  const estimatedTotal = getOrderEntryEstimatedTotal(
    (orderEntry.orderEntryItems.nodes || []) as OrderEntryItem[],
    truckRate,
  );

  const estimatedFreight = getOrderEntryEstimatedFreight(
    (orderEntry.orderEntryItems.nodes || []) as OrderEntryItem[],
    truckRate,
  );

  const estimatedItemsTotal = estimatedTotal - estimatedFreight;

  return (
    <l.Flex alignCenter>
      <l.Flex alignCenter mr={th.sizes.md}>
        <ty.CaptionText
          bold={isOverweight}
          color={th.colors.status.errorAlt}
          mr={th.spacing.md}
          width={th.sizes.xl}
        >
          {isOverweight ? 'Overweight' : isFullLoad ? 'Full Load' : ''}
        </ty.CaptionText>
        <l.Flex
          alignCenter
          title={`Max: ${formatNumber(TRUCK_LOAD_MAX_WEIGHT)}`}
        >
          <ty.CaptionText secondary>Est. Load Weight (lbs):</ty.CaptionText>
          <ty.CaptionText bold ml={th.spacing.md} width={60}>
            {formatNumber(estimatedWeight)}
          </ty.CaptionText>
        </l.Flex>
        <l.Flex
          alignCenter
          ml={th.spacing.md}
          title={`Max: ${TRUCK_LOAD_MAX_PALLETS}`}
        >
          <ty.CaptionText secondary>Pallets:</ty.CaptionText>
          <ty.CaptionText bold ml={th.spacing.sm} width={30}>
            {totalPalletCount}
          </ty.CaptionText>
        </l.Flex>
      </l.Flex>
      <l.Flex alignEnd column mr={th.spacing.sm}>
        {!orderEntry.fob && (
          <>
            <l.Flex alignCenter mb={th.spacing.sm}>
              <ty.CaptionText color={th.colors.brand.primaryAccent} secondary>
                Est. Items Total:
              </ty.CaptionText>
              <ty.CaptionText
                bold
                color={th.colors.brand.primaryAccent}
                ml={th.spacing.md}
                mr={88}
                width={80}
              >
                {estimatedItemsTotal
                  ? formatCurrency(estimatedItemsTotal)
                  : '$-'}
              </ty.CaptionText>
            </l.Flex>
            <l.Flex alignCenter mb={th.spacing.sm}>
              <ty.CaptionText color={th.colors.brand.primaryAccent} secondary>
                Est. Freight:
              </ty.CaptionText>
              <ty.CaptionText
                bold
                color={th.colors.brand.primaryAccent}
                mx={th.spacing.md}
                width={80}
              >
                {estimatedFreight ? formatCurrency(estimatedFreight) : '$-'}
              </ty.CaptionText>
              {truckRate ? (
                <l.AreaLink
                  target="_blank"
                  to={`/inventory/truck-loads/rates/${truckRate.id}`}
                >
                  <b.Primary small>View Rate</b.Primary>
                </l.AreaLink>
              ) : (
                <b.Primary disabled small>
                  View Rate
                </b.Primary>
              )}
            </l.Flex>
          </>
        )}
        <l.Flex alignCenter>
          <ty.CaptionText secondary>Est. Order Total:</ty.CaptionText>
          <ty.CaptionText bold ml={th.spacing.md} mr={88} width={80}>
            {(orderEntry.fob ? estimatedItemsTotal : estimatedTotal)
              ? formatCurrency(
                  orderEntry.fob ? estimatedItemsTotal : estimatedTotal,
                )
              : '$-'}
          </ty.CaptionText>
        </l.Flex>
      </l.Flex>
    </l.Flex>
  );
};

export default OrderEntryTotals;
