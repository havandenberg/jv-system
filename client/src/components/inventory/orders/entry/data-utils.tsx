import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { groupBy, pluck, uniq, values } from 'ramda';
import { CommonSpecies, OrderEntry, OrderEntryItem } from 'types';
import l from 'ui/layout';
import ty from 'ui/typography';
import { formatDateTime } from 'utils/date';

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
    key: 'fob',
    label: 'FOB / Del',
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
    getValue: ({ reviewUserCode }) => (
      <l.Flex alignCenter justifyCenter>
        <StatusIndicator status={reviewUserCode ? 'success' : 'warning'} />
      </l.Flex>
    ),
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
    key: 'reviewUserCode',
    label: 'Status',
    getValue: ({ reviewUserCode }) => (
      <l.Flex alignCenter justifyCenter>
        <StatusIndicator status={reviewUserCode ? 'success' : 'warning'} />
      </l.Flex>
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
    key: 'label',
    label: 'Label',
    validate: ({ label }) => label !== '',
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
    key: 'locationId',
    label: 'Location',
    validate: ({ locationId }) => locationId !== '',
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
    label: 'Freight',
    show: !fob,
    validate: ({ deliveryCharge }) => fob || parseFloat(deliveryCharge) > 0,
  },
];

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
