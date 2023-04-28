import { sum, uniqBy } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { InventoryItem, InvoiceItem, Pallet } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

export type SalesReportLineItem = {
  description: string;
  available: number;
  onHand: number;
  received: number;
  high: number;
  low: number;
  avg: number;
  netAvg: number;
  creditBoxQty: number;
  creditAmount: number;
  troubleQty: number;
};

export type SalesReportLineItemLabelInfo = LabelInfo<SalesReportLineItem>;

export const listLabels: (
  descriptionContent?: JSX.Element,
  bold?: boolean,
) => SalesReportLineItemLabelInfo[] = (descriptionContent, bold) => [
  {
    key: 'description',
    label: 'Description',
    getValue: (item) =>
      descriptionContent || (
        <ty.BodyText bold={bold}>{item.description}</ty.BodyText>
      ),
  },
  {
    key: 'received',
    label: 'Rcvd',
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {item.received}
      </ty.BodyText>
    ),
  },
  {
    key: 'onHand',
    label: 'On Hand',
    customStyles: { label: { color: th.colors.brand.primaryAccent } },
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {item.onHand}
      </ty.BodyText>
    ),
  },
  {
    key: 'available',
    label: 'Avail',
    customStyles: { label: { color: th.colors.status.successAlt } },
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {item.available}
      </ty.BodyText>
    ),
  },
  {
    key: 'high',
    label: 'High',
    customStyles: {
      label: {
        color: th.colors.status.success,
        fontWeight: th.fontWeights.bold,
      },
    },
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {formatCurrency(item.high)}
      </ty.BodyText>
    ),
  },
  {
    key: 'low',
    label: 'Low',
    customStyles: {
      label: { color: th.colors.status.error, fontWeight: th.fontWeights.bold },
    },
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {formatCurrency(item.low)}
      </ty.BodyText>
    ),
  },
  {
    key: 'avg',
    label: 'Avg',
    customStyles: {
      label: {
        color: th.colors.status.warningAlt,
        fontWeight: th.fontWeights.bold,
      },
    },
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {formatCurrency(item.avg)}
      </ty.BodyText>
    ),
  },
  {
    key: 'creditBoxQty',
    label: 'Crdt Boxes',
    getValue: (item) => (
      <ty.BodyText
        bold={bold}
        color={item.creditBoxQty > 0 ? th.colors.status.errorAlt : undefined}
        textAlign="right"
      >
        {item.creditBoxQty || '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'creditAmount',
    label: 'Crdt Amt',
    getValue: (item) => (
      <ty.BodyText
        bold={bold}
        color={item.creditAmount > 0 ? th.colors.status.errorAlt : undefined}
        textAlign="right"
      >
        {item.creditAmount ? formatCurrency(item.creditAmount) : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'netAvg',
    label: 'Net Avg',
    getValue: (item) => (
      <ty.BodyText bold={bold} textAlign="right">
        {formatCurrency(item.netAvg)}
      </ty.BodyText>
    ),
  },
  {
    key: 'troubleQty',
    label: 'Trb Qty',
    getValue: (item) => (
      <ty.BodyText
        bold={bold}
        color={item.troubleQty > 0 ? th.colors.status.errorAlt : undefined}
        textAlign="right"
      >
        {item.troubleQty}
      </ty.BodyText>
    ),
  },
];

export const groupInventoryItems = (items: InventoryItem[]) =>
  items?.reduce<{
    [key: string]: { [key: string]: { [key: string]: InventoryItem[] } };
  }>((acc, item) => {
    const { product, sizes } = item;
    const species = product?.species?.speciesDescription || '';
    const variety = product?.variety?.varietyDescription || '';
    const size = sizes?.nodes[0]?.combineDescription || '';
    return {
      ...acc,
      [species]: {
        ...acc[species],
        [variety]: {
          ...(acc[species]?.[variety] || []),
          [size]: [
            ...(acc[species]?.[variety]?.[size] || []),
            item,
          ] as InventoryItem[],
        },
      },
    };
  }, {});

export const buildSalesReportLineItem = (
  items: InventoryItem[],
): SalesReportLineItem => {
  const invoiceItems = items
    .map((i) =>
      ((i.pallets.nodes || []) as Pallet[])
        .map((p) => ((p.invoiceItems.nodes || []) as InvoiceItem[]).flat())
        .flat(),
    )
    .flat();
  const invoiceItemPrices = invoiceItems.map((i) =>
    parseFloat(parseFloat(i.unitSellPrice).toFixed(2)),
  );

  const avg = sum(invoiceItemPrices) / invoiceItems.length;
  const creditBoxQty = sum(
    invoiceItems.map((i) => parseInt(i.creditedQty, 10)),
  );
  const creditAmount =
    sum(invoiceItems.map((i) => parseFloat(i.creditAmount))) || 0;

  return {
    description: '',
    available: sum(items.map((i) => parseInt(i.palletsAvailable, 10))),
    onHand: sum(items.map((i) => parseInt(i.palletsOnHand, 10))),
    received: sum(items.map((i) => i.pallets.nodes.length)),
    high: Math.max(...invoiceItemPrices),
    low: Math.min(...invoiceItemPrices),
    avg: parseFloat(avg.toFixed(2)),
    creditBoxQty,
    creditAmount: parseFloat(creditAmount.toFixed(2)),
    netAvg: creditAmount > 0 ? (avg + creditAmount) / 2 : avg,
    troubleQty: uniqBy((i) => i.palletId, invoiceItems).filter(
      (i) => i.creditedQty > 0,
    ).length,
  };
};
