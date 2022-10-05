import React, { useState } from 'react';
import { format } from 'date-fns';
import { groupBy, isEmpty, uniq } from 'ramda';
import { StringParam } from 'use-query-params';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import Expandable, { CollapseAllControl } from 'components/expandable';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useQuerySet } from 'hooks/use-query-params';
import {
  ExpenseHeader,
  ExpenseItem,
  InventoryItem,
  Shipper,
  Vessel,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

import {
  expenseCodeDescriptions,
  itemListLabels,
  listLabels,
} from './data-utils';

const breadcrumbs = [
  { text: 'Expenses', to: `/accounting/expenses` },
  { text: 'Summary', to: `/accounting/expenses/summary` },
];

const gridTemplateColumns = '2fr 1fr 1fr 0.5fr 75px 100px 125px';
const itemGridTemplateColumns = '0.5fr 1fr 1fr 1fr 100px 100px 120px';

const ExpensesSummary = () => {
  const [{ vesselCode, shipperId }, setExpenseSummaryParams] = useQuerySet({
    vesselCode: StringParam,
    shipperId: StringParam,
  });

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = api.useExpensesVessels();
  const vessels = (vesselsData ? vesselsData.nodes : []) as Vessel[];
  const vessel = vessels.find((v) => v.vesselCode === vesselCode);
  const vesselShipperIds = uniq(
    ((vessel?.inventoryItems?.nodes || []) as InventoryItem[]).map(
      (item) => item.shipper?.id,
    ) || [],
  ).filter((s) => !!s);

  const {
    data: expensesData,
    loading: expensesLoading,
    error: expensesError,
  } = api.useExpensesSummary(vesselCode || '');
  const expenses = (expensesData ? expensesData.nodes : []) as ExpenseHeader[];

  const {
    data: shippersData,
    loading: shippersLoading,
    error: shippersError,
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = (shippersData ? shippersData.nodes : []) as Shipper[];
  const shipper = shippers.find((s) => s.id === shipperId);

  const vesselsAndShipperLoading = vesselsLoading || shippersLoading;
  const loading = vesselsLoading || expensesLoading || shippersLoading;
  const error = vesselsError || expensesError || shippersError;

  const showExpenses = !!vesselCode && !!shipperId;

  const filteredShippers = vesselCode
    ? shippers.filter((s) => vesselShipperIds.includes(s.id))
    : shippers;

  const filteredVessels =
    vesselCode || !shipperId
      ? vessels
      : vessels.filter((v) =>
          (v.inventoryItems.nodes || []).some(
            (i) => i?.shipper?.id === shipperId,
          ),
        );

  const filteredExpenses = expenses.map((expense) => ({
    ...expense,
    items: {
      nodes: ((expense.items.nodes || []) as ExpenseItem[]).filter(
        (item) => item.shipper?.id === shipperId,
      ),
    },
  }));
  // .filter((expense) => expense.items.nodes.length > 0);

  const groupedExpenses = groupBy(
    (expense) => expense.expenseCode || 'Other',
    filteredExpenses,
  );

  const expenseCodes = Object.keys(groupedExpenses).sort();

  console.log(groupedExpenses);

  const { ItemSelector: VesselItemSelector } = useItemSelector<Vessel>({
    allItems: (localValue) => {
      const lv = localValue.toLowerCase();
      return filteredVessels.filter(
        (v) =>
          v.vesselCode.toLowerCase().includes(lv) ||
          v.vesselName?.toLowerCase().includes(lv),
      );
    },
    selectItem: (v) => {
      setExpenseSummaryParams({ vesselCode: v.vesselCode });
    },
    getItemContent: (v) => (
      <ty.CaptionText bold={v.vesselCode === vesselCode} pl={th.spacing.sm}>
        {v.vesselCode} - {v.vesselName}
      </ty.CaptionText>
    ),
    closeOnSelect: true,
    disableSearchQuery: true,
    error: vesselsError,
    errorLabel: 'vessels',
    loading: vesselsLoading,
    nameKey: 'vesselCode',
    onClear: () => {
      setExpenseSummaryParams({ vesselCode: undefined });
    },
    placeholder: 'Select vessel',
    selectedItem: vesselCode,
    searchParamName: 'vesselSearch',
    searchWidth: 150,
    width: 280,
  });

  const { ItemSelector: ShipperItemSelector } = useItemSelector<Shipper>({
    selectItem: (s) => {
      setExpenseSummaryParams({ shipperId: s.id });
    },
    allItems: (localValue) => {
      const lv = localValue.toLowerCase();
      return filteredShippers.filter(
        (s) =>
          s.id.toLowerCase().includes(lv) ||
          s.shipperName.toLowerCase().includes(lv),
      );
    },
    closeOnSelect: true,
    disableSearchQuery: true,
    error: shippersError,
    errorLabel: 'shippers',
    getItemContent: (s) => (
      <ty.CaptionText bold={s.id === shipperId} pl={th.spacing.sm}>
        {s.id} - {s.shipperName}
      </ty.CaptionText>
    ),
    loading: shippersLoading,
    nameKey: 'shipperName',
    onClear: () => {
      setExpenseSummaryParams({ shipperId: undefined });
    },
    placeholder: 'Select shipper',
    selectedItem: shipperId,
    searchParamName: 'shipperSearch',
    searchWidth: 150,
    width: 280,
  });

  const columnLabels = useColumns<ExpenseHeader>(
    'vendorId',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'expense_header',
  );

  const itemColumnLabels = useColumns<ExpenseItem>(
    'sequenceId',
    SORT_ORDER.ASC,
    itemListLabels,
    'accounting',
    'expense_item',
  );

  const [collapsedItems, setCollapsedItems] = useState<string[]>([]);

  const toggleCollapseItem = (id: string) => {
    if (collapsedItems.includes(id)) {
      setCollapsedItems(collapsedItems.filter((it) => it !== id));
    } else {
      setCollapsedItems([...collapsedItems, id]);
    }
  };

  const isItemCollapsed = (id: string) => collapsedItems.includes(id);

  const collapseAllItems = () => {
    setCollapsedItems(expenseCodes);
  };

  const expandAllItems = () => {
    setCollapsedItems([]);
  };

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={128}
      headerChildren={
        <>
          <l.Flex alignStart mb={th.spacing.lg}>
            <l.Div width="35%">
              <ty.SmallText mb={th.spacing.xs} secondary>
                Vessel
              </ty.SmallText>
              <l.Flex alignCenter flex={1} height={42}>
                {VesselItemSelector}
                {vesselsAndShipperLoading && vesselCode ? (
                  <ty.BodyText ml={th.spacing.md} secondary>
                    Loading...
                  </ty.BodyText>
                ) : (
                  vessel && (
                    <l.Div ml={th.spacing.md}>
                      <ty.LinkText
                        hover="false"
                        to={`/inventory/vessels/${vesselCode}`}
                      >
                        {vessel.vesselName}
                      </ty.LinkText>
                      <ty.BodyText>
                        Disch:{' '}
                        {format(
                          new Date(vessel.dischargeDate.replace(/-/g, '/')),
                          'M/dd',
                        )}
                      </ty.BodyText>
                    </l.Div>
                  )
                )}
              </l.Flex>
            </l.Div>
            <l.Div width="35%">
              <ty.SmallText mb={th.spacing.xs} secondary>
                Shipper
              </ty.SmallText>
              <l.Flex alignCenter flex={1} height={42}>
                {ShipperItemSelector}
                {vesselsAndShipperLoading && shipperId ? (
                  <ty.BodyText ml={th.spacing.md} secondary>
                    Loading...
                  </ty.BodyText>
                ) : (
                  shipper && (
                    <l.Div ml={th.spacing.md}>
                      <ty.LinkText
                        hover="false"
                        to={`/directory/shippers/${shipperId}`}
                      >
                        {shipper.shipperName}
                      </ty.LinkText>
                    </l.Div>
                  )
                )}
              </l.Flex>
            </l.Div>
            <div>
              <l.Div height={28} />
              <ResetButton>
                <l.AreaLink
                  cursor="pointer"
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                  to="/accounting/expenses/summary"
                >
                  <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                </l.AreaLink>
              </ResetButton>
            </div>
          </l.Flex>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns}
            mb={th.spacing.sm}
            pl={th.spacing.md}
            relative
          >
            <l.Div left={`-${th.spacing.sm}`} position="absolute">
              <CollapseAllControl
                collapseAllItems={collapseAllItems}
                expandAllItems={expandAllItems}
              />
            </l.Div>
            {columnLabels.map((label, idy) =>
              idy > 0 ? (
                label
              ) : (
                <l.Div key={label.key} pl={th.sizes.md}>
                  {label}
                </l.Div>
              ),
            )}
          </l.Grid>
        </>
      }
      title="Expenses Summary"
    >
      {showExpenses && !isEmpty(filteredExpenses) ? (
        expenseCodes.map((expenseCode, idx) => {
          const exps = groupedExpenses[expenseCode] as ExpenseHeader[];
          const categoryTotal = formatCurrency(
            exps.reduce<number>(
              (acc, exp) =>
                acc +
                ((exp.items?.nodes || []) as ExpenseItem[]).reduce<number>(
                  (acc, item) => acc + (parseFloat(item.itemAmount) || 0),
                  0,
                ),
              0,
            ),
          );

          const sortedExpenses = getSortedItems(
            listLabels,
            exps,
            'vendorId',
            SORT_ORDER.ASC,
          );

          return (
            <l.Div key={expenseCode} mb={th.spacing.lg}>
              <Expandable
                content={
                  <l.Div mt={th.spacing.md}>
                    {sortedExpenses.map((exp) => {
                      const expItems = (exp.items?.nodes ||
                        []) as ExpenseItem[];

                      const sortedExpenseItems = getSortedItems(
                        itemListLabels,
                        expItems,
                        'sequenceId',
                        SORT_ORDER.ASC,
                      );
                      const hasExpenseItems = sortedExpenseItems.length > 0;

                      const itemPrices = sortedExpenseItems
                        .map((item) => parseInt(item.itemAmount, 10))
                        .filter((price) => price > 0);

                      const { totalItemsPrice, totalQuantity } = hasExpenseItems
                        ? sortedExpenseItems.reduce<{
                            totalItemsPrice: number;
                            totalQuantity: number;
                          }>(
                            (acc, item) => ({
                              totalItemsPrice:
                                acc.totalItemsPrice +
                                parseFloat(item.itemAmount) *
                                  parseInt(item.quantity, 10),
                              totalQuantity:
                                acc.totalQuantity + parseInt(item.quantity, 10),
                            }),
                            { totalItemsPrice: 0, totalQuantity: 0 },
                          )
                        : { totalItemsPrice: 0, totalQuantity: 0 };

                      const averagePrice = hasExpenseItems
                        ? totalItemsPrice / totalQuantity
                        : 0;
                      const lowPrice = hasExpenseItems
                        ? Math.min(...itemPrices)
                        : 0;
                      const highPrice = hasExpenseItems
                        ? Math.max(...itemPrices)
                        : 0;

                      return (
                        <l.Flex alignCenter key={exp.id}>
                          <ListItem<ExpenseHeader>
                            data={exp as ExpenseHeader}
                            gridTemplateColumns={gridTemplateColumns}
                            listLabels={listLabels}
                            content={
                              hasExpenseItems ? (
                                <>
                                  <l.Grid
                                    gridTemplateColumns={
                                      itemGridTemplateColumns
                                    }
                                    my={th.spacing.sm}
                                    px={th.spacing.sm}
                                    pb={th.spacing.xs}
                                  >
                                    <div />
                                    <div />
                                    <div />
                                    <div />
                                    <ty.SmallText
                                      color={th.colors.status.error}
                                    >
                                      Low:
                                      <l.Span ml={th.spacing.sm}>
                                        {formatCurrency(lowPrice)}
                                      </l.Span>
                                    </ty.SmallText>
                                    <ty.SmallText
                                      color={th.colors.status.successAlt}
                                    >
                                      High:
                                      <l.Span ml={th.spacing.sm}>
                                        {formatCurrency(highPrice)}
                                      </l.Span>
                                    </ty.SmallText>
                                    <ty.SmallText>
                                      Wt. Avg:{' '}
                                      <l.Span ml={th.spacing.sm}>
                                        {formatCurrency(averagePrice)}
                                      </l.Span>
                                    </ty.SmallText>
                                  </l.Grid>
                                  <l.Grid
                                    gridTemplateColumns={
                                      itemGridTemplateColumns
                                    }
                                    mb={th.spacing.sm}
                                    px={th.spacing.sm}
                                  >
                                    {itemColumnLabels}
                                  </l.Grid>
                                  {sortedExpenseItems.map((item) => (
                                    <l.Div
                                      key={item.id}
                                      pl={th.spacing.sm}
                                      pr={th.spacing.md}
                                      mb={`-${th.spacing.xs}`}
                                    >
                                      <ListItem<ExpenseItem>
                                        data={item as ExpenseItem}
                                        gridTemplateColumns={
                                          itemGridTemplateColumns
                                        }
                                        listLabels={itemListLabels}
                                      />
                                    </l.Div>
                                  ))}
                                  <l.Div height={th.spacing.sm} />
                                </>
                              ) : null
                            }
                          />
                        </l.Flex>
                      );
                    })}
                  </l.Div>
                }
                header={
                  <l.Flex alignCenter justifyBetween>
                    <ty.LargeText bold>
                      {expenseCode} -{' '}
                      {expenseCodeDescriptions[expenseCode] || 'Unknown'}
                    </ty.LargeText>
                    <l.Flex alignCenter>
                      <ty.CaptionText secondary>Total:</ty.CaptionText>
                      <ty.BodyText
                        bold
                        color={th.colors.brand.primaryAccent}
                        ml={th.spacing.md}
                        mr={th.spacing.lg}
                      >
                        {categoryTotal}
                      </ty.BodyText>
                    </l.Flex>
                  </l.Flex>
                }
                isOpen={!isItemCollapsed(expenseCode)}
                showBorder={idx > 0}
                toggleIsOpen={() => toggleCollapseItem(expenseCode)}
              />
            </l.Div>
          );
        })
      ) : (
        <DataMessage
          data={showExpenses ? filteredExpenses : []}
          error={error}
          loading={showExpenses && loading}
          emptyProps={{
            header: showExpenses
              ? 'No expenses found'
              : 'Select a vessel and shipper',
            text: showExpenses
              ? 'Modify search parameters to view more results.'
              : undefined,
          }}
        />
      )}
    </Page>
  );
};

export default ExpensesSummary;
