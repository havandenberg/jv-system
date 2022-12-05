import { LabelInfo } from 'components/column-label';
import { getClosestPalletRate } from 'components/inventory/truck-loads/rates/data-utils';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { groupBy, pluck, uniq, values } from 'ramda';
import {
  CommonSpecies,
  LoadNumber,
  OrderEntry,
  OrderEntryItem,
  TruckRate,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatDateTime } from 'utils/date';
import { roundToNearestQuarter } from 'utils/format';

import { NewOrderEntry } from '.';

export type OrderEntryLabelInfo = LabelInfo<OrderEntry>;
export type NewOrderEntryLabelInfo = LabelInfo<NewOrderEntry>;
export type OrderEntryItemLabelInfo = LabelInfo<OrderEntryItem>;

export const listLabels: (
  commonSpecieses: CommonSpecies[],
) => OrderEntryLabelInfo[] = (commonSpecieses) => [
  {
    key: 'orderDate',
    label: 'Submitted At',
    isDate: true,
    sortable: true,
    getValue: ({ orderDate }) =>
      orderDate ? (
        <ty.BodyText>{formatDateTime(new Date(orderDate))}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'reviewDate',
    label: 'Reviewed At',
    isDate: true,
    sortable: true,
    getValue: ({ reviewDate }) =>
      reviewDate ? (
        <ty.BodyText>{formatDateTime(new Date(reviewDate))}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'reviewUserCode',
    label: 'Reviewed By',
    getValue: ({ reviewUser }) => (
      <ty.BodyText>
        {reviewUser ? reviewUser.personContact?.firstName : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'fobDate',
    label: 'FOB Date',
    isDate: true,
  },
  {
    key: 'id',
    label: 'Summary',
    getValue: ({ orderEntryItems }) => {
      const orderItems = (orderEntryItems?.nodes || []) as OrderEntryItem[];
      const speciesList = uniq(pluck('species', orderItems));
      return (
        <ty.BodyText>
          {speciesList
            .map((species) => {
              const commonSpecies = commonSpecieses.find(
                (cs) => cs.productSpeciesId === species,
              );
              return `${
                (commonSpecies?.speciesName || species || '').slice(0, 3) || '?'
              }. (${orderItems
                .filter((orderItem) => orderItem?.species === species)
                .reduce(
                  (acc, item) => acc + parseInt(item?.palletCount, 10) || 0,
                  0,
                )})`;
            })
            .join(', ')}
        </ty.BodyText>
      );
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'reviewUserCode',
    label: 'Status',
    sortable: true,
    customSortBy: ({ fobDate, reviewUserCode }) =>
      `${!reviewUserCode ? 'a' : 'b'} ${new Date(
        fobDate.replace(/-/g, '/'),
      ).getTime()}`,
    getValue: ({ reviewUserCode }) => {
      const status =
        orderEntryStatusDescriptions[reviewUserCode ? 'app' : 'rev'];
      return (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator
            color={status?.color}
            customStyles={{
              wrapper: {
                py: th.spacing.tn,
              },
            }}
            text={status?.text}
            title={status?.title || ''}
          />
        </l.Flex>
      );
    },
  },
];

export const baseLabels: OrderEntryLabelInfo[] = [
  {
    key: 'orderId',
    label: 'Order ID',
  },
  {
    key: 'truckLoadId',
    label: 'Load ID',
    getValue: ({ truckLoadId }) => (
      <ty.BodyText>{truckLoadId === '' ? 'HOLD' : truckLoadId}</ty.BodyText>
    ),
  },
  {
    key: 'customerPo',
    label: 'Customer PO',
  },
  {
    key: 'billingCustomerId',
    label: 'Customer',
    getValue: ({ billingCustomer }) =>
      billingCustomer ? (
        <ty.LinkText
          hover="false"
          to={`/directory/customers/${billingCustomer.id}`}
        >
          {billingCustomer.id} - {billingCustomer.customerName}
        </ty.LinkText>
      ) : (
        ''
      ),
  },
  {
    key: 'salesUserCode',
    label: 'Sales Assoc.',
    getValue: ({ salesUser }) =>
      salesUser ? (
        <ty.BodyText>{salesUser.personContact?.firstName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'fob',
    label: 'FOB / Delivered',
    isBoolean: true,
    getValue: ({ fob }) => (
      <ty.BodyText>{fob ? 'FOB' : 'Delivery'}</ty.BodyText>
    ),
  },
  {
    key: 'fobDate',
    label: 'FOB Date',
    isDate: true,
  },
  {
    key: 'deliveredDate',
    label: 'Delivered Date',
    isDate: true,
  },
  {
    key: 'orderDate',
    label: 'Submitted At',
    isDate: true,
    getValue: ({ orderDate }) =>
      orderDate ? (
        <ty.BodyText>{formatDateTime(new Date(orderDate))}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'submittedByUser',
    label: 'Submitted By',
    getValue: ({ submittedByUser }) => (
      <ty.BodyText>
        {submittedByUser ? submittedByUser.personContact?.firstName : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'reviewUserCode',
    label: 'Reviewed At',
    getValue: ({ reviewDate }) => (
      <ty.BodyText>
        {reviewDate ? formatDateTime(new Date(reviewDate)) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'reviewUserCode',
    label: 'Reviewed By',
    getValue: ({ reviewUser }) => (
      <ty.BodyText>
        {reviewUser ? reviewUser.personContact?.firstName : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'reviewUserCode',
    label: 'Status',
    getValue: ({ reviewUserCode }) => {
      const status =
        orderEntryStatusDescriptions[reviewUserCode ? 'app' : 'rev'];
      return (
        <l.Flex alignCenter justifyCenter>
          <StatusIndicator
            color={status?.color}
            text={status?.text}
            title={status?.title || ''}
          />
        </l.Flex>
      );
    },
  },
];

export const itemListLabels: (fob: boolean) => OrderEntryItemLabelInfo[] = (
  fob,
) => [
  {
    key: 'lineId',
    label: 'Line',
  },
  {
    key: 'species',
    label: 'Species',
    validate: ({ species }) => species !== '',
  },
  {
    key: 'variety',
    label: 'Variety',
    validate: ({ variety }) => variety !== '',
  },
  {
    key: 'size',
    label: 'Size',
    validate: ({ size }) => size !== '',
  },
  {
    key: 'packType',
    label: 'Pack Type',
    validate: ({ packType }) => packType !== '',
  },
  {
    key: 'plu',
    label: 'PLU',
    validate: ({ plu }) => plu !== '',
  },
  {
    key: 'countryOfOrigin',
    label: 'COO',
    validate: ({ countryOfOrigin }) => countryOfOrigin !== '',
  },
  {
    key: 'label',
    label: 'Label',
    validate: ({ label }) => label !== '',
  },
  {
    key: 'locationId',
    label: 'Location',
    validate: ({ locationId }) => locationId !== '',
  },
  {
    key: 'shipperId',
    label: 'Shipper',
    validate: ({ shipperId }) => shipperId !== '',
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    validate: ({ vesselCode }) => vesselCode !== '',
  },
  {
    key: 'palletCount',
    label: 'Pallet Ct.',
    validate: ({ palletCount }) => parseInt(palletCount, 10) > 0,
  },
  {
    key: 'unitSellPrice',
    label: 'Unit Price',
    validate: ({ unitSellPrice }) => parseFloat(unitSellPrice) > 0,
  },
  {
    key: 'deliveryCharge',
    label: 'Unit Frt.',
    show: !fob,
    validate: ({ deliveryCharge }) => fob || parseFloat(deliveryCharge) > 0,
  },
];

export const filterLoadNumbersByCoast = (
  loadNumbers: LoadNumber[],
  coast: string,
) =>
  loadNumbers.filter((ln) =>
    ln && coast === 'WC' ? ln.id > 400000 && ln.id < 500000 : ln.id < 400000,
  );

export const getDuplicateOrderEntryItemIds = (items: OrderEntryItem[]) =>
  values(
    groupBy(
      (item) =>
        `species=${item.species}variety=${item.variety}size=${item.size}packType=${item.packType}plu=${item.plu}label=${item.label}shipperId=${item.shipperId}vesselCode=${item.vesselCode}locationId=${item.locationId}`,
      items,
    ),
  )
    .filter((duplicateItems) => duplicateItems.length > 1)
    .map((duplicateItems) => duplicateItems.map((p) => parseInt(p.id, 10)))
    .flat();

export const getOrderEntryEstimatedWeight = (
  orderEntryItems: OrderEntryItem[],
) =>
  orderEntryItems.reduce(
    (sum, item) => sum + (item.palletWeight || 0) * item.palletCount,
    0,
  ) as number;

export const getOrderEntryItemEstimatedFreight = (
  orderEntryItem: OrderEntryItem,
  truckRate?: TruckRate,
  boxCount?: number,
) => {
  const { palletCount, deliveryCharge } = orderEntryItem;
  const palletCountInt = parseInt(palletCount, 10);
  const deliveryChargeFloat = parseFloat(deliveryCharge);
  const palletEstimate =
    truckRate && getClosestPalletRate(truckRate, palletCountInt);
  const estimate = palletEstimate && palletEstimate / (boxCount || 1);
  return +roundToNearestQuarter(
    (truckRate && (estimate || deliveryChargeFloat)) || 0,
  );
};

export const getOrderEntryEstimatedFreight = (
  orderEntryItems: OrderEntryItem[],
  truckRate?: TruckRate,
) =>
  orderEntryItems.reduce(
    (sum, item) =>
      sum +
      getOrderEntryItemEstimatedFreight(item, truckRate) * item.palletCount,
    0,
  ) as number;

export const getOrderEntryItemEstimatedTotal = (
  orderEntryItem: OrderEntryItem,
  truckRate?: TruckRate,
  boxCount?: number,
) => {
  const { unitSellPrice, palletCount } = orderEntryItem;
  const price = parseFloat(unitSellPrice) * (boxCount || 1);
  const pallets = parseInt(palletCount, 10);
  const freightPerPallet = truckRate
    ? getOrderEntryItemEstimatedFreight(orderEntryItem, truckRate)
    : 0;
  return (price + freightPerPallet) * pallets;
};

export const getOrderEntryEstimatedTotal = (
  orderEntryItems: OrderEntryItem[],
  truckRate?: TruckRate,
) =>
  orderEntryItems.reduce(
    (sum, item) =>
      sum + getOrderEntryItemEstimatedTotal(item, truckRate, item.boxCount),
    0,
  );

const orderEntryStatusDescriptions: {
  [key: string]: { color: string; text: string; title: string };
} = {
  app: {
    color: th.colors.status.success,
    text: 'APP',
    title: 'Approved',
  },
  rev: { color: th.colors.status.warning, text: 'REV', title: 'In Review' },
};
