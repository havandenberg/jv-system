import React from 'react';
import { differenceInDays } from 'date-fns';
import { isEmpty, sortBy as sortByFunc } from 'ramda';

import { getSortedItems } from 'components/column-label';
import { OrderItemInvoiceItem } from 'components/inventory/orders/data-utils';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { InvoiceHeader, InvoiceItem, OrderItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { listLabels, itemListLabels } from './data-utils';

const gridTemplateColumns =
  '60px 0.7fr 1fr 0.7fr 75px 70px 80px 60px 1fr 60px 60px 100px';
const itemGridTemplateColumns = '200px 1fr 1fr 30px';

type Props = {
  deletedItems?: OrderItemInvoiceItem[];
  items: OrderItemInvoiceItem[];
  rejectedItems?: OrderItemInvoiceItem[];
  rejectedInvoices?: InvoiceHeader[];
  originalInvoice?: InvoiceHeader;
};

const List = ({
  deletedItems = [],
  items,
  rejectedItems = [],
  rejectedInvoices,
  originalInvoice,
}: Props) => {
  const [{ sortBy, sortOrder }] = useSortQueryParams();
  const columnLabels = useColumns<OrderItem>(
    'lineId',
    SORT_ORDER.ASC,
    listLabels,
    'operations',
    'order_item',
  );

  const itemColumnLabels = useColumns<InvoiceItem>(
    'sequenceId',
    SORT_ORDER.ASC,
    itemListLabels,
    'accounting',
    'invoice_item',
  );

  const sortedItems = getSortedItems(listLabels, items, sortBy, sortOrder);

  const rejectedLoadId = rejectedInvoices?.[0]?.truckLoadId;

  const sortedRejectedItems = getSortedItems(
    listLabels,
    rejectedItems,
    sortBy,
    sortOrder,
  );

  const sortedDeletedItems = getSortedItems(
    listLabels,
    deletedItems,
    sortBy,
    sortOrder,
  );

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        ml={th.spacing.lg}
      >
        {columnLabels}
      </l.Grid>
      {rejectedInvoices && rejectedItems.length > 0 && (
        <l.Div mb={th.spacing.md}>
          <l.Flex alignCenter my={th.spacing.md}>
            <ty.CaptionText bold color={th.colors.status.errorAlt}>
              !! Rejected Items:
            </ty.CaptionText>
            <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
              Load:
            </ty.CaptionText>
            <ty.LinkText
              hover="false"
              to={`/inventory/truck-loads/${rejectedLoadId}`}
            >
              {rejectedLoadId}
            </ty.LinkText>
            <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
              Invoice(s):
            </ty.CaptionText>
            {(rejectedInvoices || []).map((rejectedInvoice) => (
              <ty.LinkText
                hover="false"
                key={rejectedInvoice?.orderId}
                mr={th.spacing.sm}
                to={`/accounting/invoices/${rejectedInvoice?.orderId}`}
              >
                {rejectedInvoice?.orderId}
              </ty.LinkText>
            ))}
          </l.Flex>
          {sortedRejectedItems.map((item) => {
            const invoiceItems = sortByFunc(
              (it) => parseInt(it.sequenceId, 10),
              (item.items || []) as InvoiceItem[],
            );
            return (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                highlightColor={th.colors.status.errorAlt}
                isHighlight
                key={`${item.orderId}-${item.backOrderId}-${item.lineId}`}
                listLabels={listLabels}
                content={
                  <>
                    <l.Grid
                      gridTemplateColumns={itemGridTemplateColumns}
                      my={th.spacing.sm}
                      px={th.spacing.sm}
                    >
                      {itemColumnLabels}
                    </l.Grid>
                    {invoiceItems.map((item) => (
                      <l.Div
                        key={item.id}
                        pl={th.spacing.sm}
                        pr={th.spacing.md}
                        mb={`-${th.spacing.xs}`}
                      >
                        <ListItem<InvoiceItem>
                          data={item as InvoiceItem}
                          gridTemplateColumns={itemGridTemplateColumns}
                          listLabels={itemListLabels}
                        />
                      </l.Div>
                    ))}
                    <l.Div height={th.spacing.sm} />
                  </>
                }
              />
            );
          })}
        </l.Div>
      )}
      {originalInvoice && (
        <l.Flex alignCenter my={th.spacing.md}>
          <ty.CaptionText bold color={th.colors.status.errorAlt}>
            !! Rejected From:
          </ty.CaptionText>
          <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
            Load:
          </ty.CaptionText>
          <ty.LinkText
            hover="false"
            to={`/inventory/truck-loads/${originalInvoice.truckLoadId}`}
          >
            {originalInvoice.truckLoadId}
          </ty.LinkText>
          <ty.CaptionText ml={th.spacing.lg} mr={th.spacing.sm}>
            Invoice:
          </ty.CaptionText>
          <ty.LinkText
            hover="false"
            key={originalInvoice?.orderId}
            mr={th.spacing.sm}
            to={`/accounting/invoices/${originalInvoice?.orderId}`}
          >
            {originalInvoice?.orderId}
          </ty.LinkText>
        </l.Flex>
      )}
      {!isEmpty(items) ? (
        sortedItems.map((item) => {
          const invoiceItems = sortByFunc(
            (it) => parseInt(it.sequenceId, 10),
            (item.items || []) as InvoiceItem[],
          );
          return (
            <ListItem
              data={item}
              gridTemplateColumns={gridTemplateColumns}
              highlightColor={th.colors.status.warningSecondary}
              isHighlight={
                item.order?.expectedShipDate &&
                differenceInDays(
                  new Date(item.order?.expectedShipDate.replace(/-/g, '/')),
                  new Date(
                    item.inventoryItem?.vessel?.dischargeDate.replace(
                      /-/g,
                      '/',
                    ),
                  ),
                ) > 7
              }
              key={`${item.orderId}-${item.backOrderId}-${item.lineId}`}
              listLabels={listLabels}
              content={
                <>
                  <l.Grid
                    gridTemplateColumns={itemGridTemplateColumns}
                    my={th.spacing.sm}
                    px={th.spacing.sm}
                  >
                    {itemColumnLabels}
                  </l.Grid>
                  {invoiceItems.map((item) => (
                    <l.Div
                      key={item.id}
                      pl={th.spacing.sm}
                      pr={th.spacing.md}
                      mb={`-${th.spacing.xs}`}
                    >
                      <ListItem<InvoiceItem>
                        data={item as InvoiceItem}
                        gridTemplateColumns={itemGridTemplateColumns}
                        listLabels={itemListLabels}
                      />
                    </l.Div>
                  ))}
                  <l.Div height={th.spacing.sm} />
                </>
              }
            />
          );
        })
      ) : (
        <DataMessage
          data={items}
          error={null}
          loading={false}
          emptyProps={{
            header: 'No invoice items found',
          }}
        />
      )}
      {deletedItems.length > 0 && (
        <l.Div mb={th.spacing.md}>
          <l.Flex alignCenter my={th.spacing.md}>
            <ty.CaptionText bold color={th.colors.status.errorAlt}>
              !! Deleted Items:
            </ty.CaptionText>
          </l.Flex>
          {sortedDeletedItems.map((item) => {
            const invoiceItems = sortByFunc(
              (it) => parseInt(it.sequenceId, 10),
              (item.items || []) as InvoiceItem[],
            );
            return (
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns}
                highlightColor={th.colors.status.errorAlt}
                isHalfHighlight
                key={`${item.orderId}-${item.backOrderId}-${item.lineId}`}
                listLabels={listLabels}
                content={
                  <>
                    <l.Grid
                      gridTemplateColumns={itemGridTemplateColumns}
                      my={th.spacing.sm}
                      px={th.spacing.sm}
                    >
                      {itemColumnLabels}
                    </l.Grid>
                    {invoiceItems.map((item) => (
                      <l.Div
                        key={item.id}
                        pl={th.spacing.sm}
                        pr={th.spacing.md}
                        mb={`-${th.spacing.xs}`}
                      >
                        <ListItem<InvoiceItem>
                          data={item as InvoiceItem}
                          gridTemplateColumns={itemGridTemplateColumns}
                          listLabels={itemListLabels}
                        />
                      </l.Div>
                    ))}
                    <l.Div height={th.spacing.sm} />
                  </>
                }
              />
            );
          })}
        </l.Div>
      )}
    </>
  );
};

export default List;
