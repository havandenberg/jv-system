import React, { useState } from 'react';
import { format } from 'date-fns';
import { groupBy, isEmpty, omit, pluck, sum, uniq } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { StringParam } from 'use-query-params';

import api from 'api';
import ResetImg from 'assets/images/reset';
import { getSortedItems } from 'components/column-label';
import EditableCell from 'components/editable-cell';
import ListItem from 'components/list-item';
import Expandable, { CollapseAllControl } from 'components/expandable';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import StatusIndicator from 'components/status-indicator';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useQuerySet, useSortQueryParams } from 'hooks/use-query-params';
import {
  ExpenseHeader,
  ExpenseHeaderReview,
  ExpenseItem,
  InventoryItem,
  Shipper,
  Vessel,
} from 'types';
import b from 'ui/button';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

import {
  alwaysPaidExpenseCodes,
  alwaysPaidVendorIds,
  expenseCodeDescriptions,
  expenseStatusDescriptions,
  itemListLabels,
  listLabels,
} from './data-utils';

const gridTemplateColumns =
  '30px 2fr 1fr 1.2fr 0.7fr 55px 50px 50px 100px 100px 125px';
const itemGridTemplateColumns = '0.5fr 1fr 1fr 1fr 100px 100px 120px';

const Expenses = () => {
  const [{ vesselCode, shipperId }, setExpenseSummaryParams] = useQuerySet({
    vesselCode: StringParam,
    shipperId: StringParam,
  });
  const [{ sortBy, sortOrder }] = useSortQueryParams();

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
  } = api.useExpensesSummary(vesselCode || '', shipperId || '');
  const expenses = (expensesData ? expensesData.nodes : []) as ExpenseHeader[];

  const {
    data: expenseReviewsData,
    loading: expensesReviewsLoading,
    error: expensesReviewsError,
  } = api.useExpensesSummaryReviews(vesselCode || '', shipperId || '');
  const expenseReviews = (
    expenseReviewsData ? expenseReviewsData.nodes : []
  ) as ExpenseHeaderReview[];

  const [handleUpsert, { loading: upsertLoading }] =
    api.useUpsertExpenseReviews(vesselCode || '', shipperId || '');

  const {
    data: shippersData,
    loading: shippersLoading,
    error: shippersError,
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = (shippersData ? shippersData.nodes : []) as Shipper[];
  const shipper = shippers.find((s) => s.id === shipperId);

  const vesselsAndShipperLoading = vesselsLoading || shippersLoading;
  const loading =
    vesselsLoading ||
    expensesLoading ||
    expensesReviewsLoading ||
    shippersLoading;
  const error =
    vesselsError || expensesError || expensesReviewsError || shippersError;

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

  const filteredExpenses = expenses
    .reduce((acc, exp) => {
      const codes = uniq(
        pluck('expenseCode', exp.items.nodes as ExpenseItem[]),
      ) as string[];

      const newExps = codes.map((code) => {
        const expItems = ((exp.items.nodes || []) as ExpenseItem[]).filter(
          (item) => item.expenseCode === code,
        );
        const expAmount = sum(pluck('itemAmount', expItems));
        return {
          ...exp,
          expenseCode: code,
          expenseAmount: expAmount,
          items: {
            nodes: expItems,
          },
        } as ExpenseHeader;
      });

      return [...acc, ...newExps];
    }, [] as ExpenseHeader[])
    .filter((expense) => expense.items.nodes.length > 0);

  const groupedExpenses = groupBy(
    (expense) => expense.expenseCode || 'Other',
    filteredExpenses,
  );

  const expenseCodes = Object.keys(groupedExpenses).sort();

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

  const itemColumnLabels = useColumns<ExpenseItem>(
    'sequenceId',
    SORT_ORDER.ASC,
    itemListLabels,
    'accounting',
    'expense_item',
  );

  const columnLabels = useColumns<ExpenseHeader>(
    'vendorId',
    SORT_ORDER.ASC,
    listLabels(shipperId),
    'accounting',
    'expense_header',
  );

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleCollapseItem = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((it) => it !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const isItemExpanded = (id: string) => expandedItems.includes(id);

  const collapseAllItems = () => {
    setExpandedItems(expenseCodes);
  };

  const expandAllItems = () => {
    setExpandedItems([]);
  };

  const [changes, setChanges] = useState<ExpenseHeaderReview[]>([]);
  const hasChanges = changes.length > 0;

  const getUpdatedExpenseReview = (
    vendorId: string,
    voucherId: string,
    expenseCode: string,
  ) =>
    changes.find(
      (review) =>
        review.vendorId === vendorId &&
        review.voucherId === voucherId &&
        review.expenseCode === expenseCode,
    ) ||
    expenseReviews.find(
      (review) =>
        review.vendorId === vendorId &&
        review.voucherId === voucherId &&
        review.expenseCode === expenseCode,
    );

  const totalsByExpenseCode = expenseCodes.reduce(
    (acc, code) => ({
      ...acc,
      [code]: groupedExpenses[code].reduce<{
        categoryPrice: number;
        categoryQuantity: number;
        approvedCount: number;
        isPaid: boolean;
      }>(
        (acc2, exp) => {
          const expenseQuantity = (
            (exp.items?.nodes || []) as ExpenseItem[]
          ).reduce((acc3, it) => acc3 + parseInt(it.quantity, 10), 0);
          const review = getUpdatedExpenseReview(
            exp.vendorId || '',
            exp.voucherId || '',
            code,
          );
          return {
            categoryPrice:
              acc2.categoryPrice +
              ((exp.items?.nodes || []) as ExpenseItem[]).reduce(
                (acc3, item) => acc3 + parseFloat(item.itemAmount),
                0,
              ),
            categoryQuantity: acc2.categoryQuantity + expenseQuantity,
            approvedCount: acc2.approvedCount + (review?.isApproved ? 1 : 0),
            isPaid:
              acc2.isPaid &&
              (alwaysPaidExpenseCodes.includes(code) ||
                (exp.vendorId && alwaysPaidVendorIds.includes(exp.vendorId)) ||
                exp.paidCode === 'P'),
          };
        },
        {
          categoryPrice: 0,
          categoryQuantity: 0,
          approvedCount: 0,
          isPaid: true,
        },
      ),
    }),
    {} as {
      [key: string]: {
        categoryPrice: number;
        categoryQuantity: number;
        approvedCount: number;
        isPaid: boolean;
      };
    },
  );

  const {
    grandTotalPrice,
    grandTotalQuantity,
    grandTotalApprovedCount,
    grandTotalIsPaid,
  } = expenseCodes.reduce(
    (acc, code) => ({
      grandTotalPrice:
        acc.grandTotalPrice + totalsByExpenseCode[code].categoryPrice,
      grandTotalQuantity:
        acc.grandTotalQuantity + totalsByExpenseCode[code].categoryQuantity,
      grandTotalApprovedCount:
        acc.grandTotalApprovedCount + totalsByExpenseCode[code].approvedCount,
      grandTotalIsPaid:
        acc.grandTotalIsPaid &&
        (alwaysPaidExpenseCodes.includes(code) ||
          totalsByExpenseCode[code].isPaid),
    }),
    {
      grandTotalPrice: 0,
      grandTotalQuantity: 0,
      grandTotalApprovedCount: 0,
      grandTotalIsPaid: true,
    },
  );

  const grandIsApprovedStatus =
    grandTotalApprovedCount === filteredExpenses.length
      ? expenseStatusDescriptions.A
      : expenseStatusDescriptions.R;

  const grandIsPaidStatus = grandTotalIsPaid
    ? expenseStatusDescriptions.P
    : expenseStatusDescriptions.X;

  const toggleApproveExpense = (
    vendorId: string,
    voucherId: string,
    expenseCode: string,
  ) => {
    const review = getUpdatedExpenseReview(vendorId, voucherId, expenseCode);
    if (review) {
      setChanges([
        ...changes.filter(
          ({ vendorId: vendId, voucherId: vouchId, expenseCode: expCode }) =>
            !(
              vendId === vendorId &&
              vouchId === voucherId &&
              expCode === expenseCode
            ),
        ),
        { ...review, isApproved: !review.isApproved },
      ]);
    } else {
      setChanges([
        ...changes,
        {
          vendorId,
          voucherId,
          expenseCode,
          isApproved: true,
          notes: '',
        } as ExpenseHeaderReview,
      ]);
    }
  };

  const toggleApproveExpenseCode = (expenseCode: string) => {
    const expReviews = groupedExpenses[expenseCode].map(
      (e) =>
        getUpdatedExpenseReview(
          e.vendorId || '',
          e.voucherId || '',
          expenseCode,
        ) || {
          voucherId: e.voucherId,
          vendorId: e.vendorId,
          expenseCode,
          isApproved: false,
          notes: '',
        },
    );
    const isAllApproved = expReviews.every((r) => r.isApproved);
    const newReviews = expReviews.map((rev) => ({
      ...rev,
      isApproved: !isAllApproved,
    }));

    setChanges([
      ...changes.filter(({ expenseCode: expCode }) => expCode !== expenseCode),
      ...newReviews,
    ] as ExpenseHeaderReview[]);
  };

  const handleNotesChange = (
    vendorId: string,
    voucherId: string,
    expenseCode: string,
    notes: string,
  ) => {
    const review = getUpdatedExpenseReview(
      vendorId,
      voucherId,
      expenseCode,
    ) || {
      vendorId,
      voucherId,
      expenseCode,
      isApproved: false,
      notes: '',
    };
    setChanges([
      ...changes.filter(
        ({ vendorId: vendId, voucherId: vouchId, expenseCode: expCode }) =>
          vendId !== vendorId &&
          voucherId !== vouchId &&
          expCode !== expenseCode,
      ),
      { ...review, notes },
    ] as ExpenseHeaderReview[]);
  };

  const handleSave = () => {
    handleUpsert({
      variables: {
        reviews: changes.map((rev) => omit(['__typename'], rev)),
      },
    }).then(() => {
      setChanges([]);
    });
  };

  return (
    <Page
      actions={[
        <b.Success
          disabled={upsertLoading || !hasChanges}
          key="save"
          onClick={handleSave}
        >
          {upsertLoading ? (
            <l.Flex alignCenter justifyCenter>
              <ClipLoader
                color={th.colors.brand.secondary}
                size={th.sizes.xs}
              />
            </l.Flex>
          ) : (
            'Save'
          )}
        </b.Success>,
      ]}
      extraPaddingTop={158}
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
                  <l.Div ml={th.spacing.md}>
                    {vessel ? (
                      <div>
                        <ty.LinkText
                          hover="false"
                          to={`/inventory/vessels/${vesselCode}?isPre=0`}
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
                      </div>
                    ) : (
                      <ty.BodyText secondary>-</ty.BodyText>
                    )}
                  </l.Div>
                )}
              </l.Flex>
            </l.Div>
            <l.Div ml={th.spacing.md} width="35%">
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
                  <l.Div ml={th.spacing.md}>
                    {shipper ? (
                      <ty.LinkText
                        hover="false"
                        to={`/directory/shippers/${shipperId}`}
                      >
                        {shipper.shipperName}
                      </ty.LinkText>
                    ) : (
                      <ty.BodyText secondary>-</ty.BodyText>
                    )}
                  </l.Div>
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
                collapseAllItems={expandAllItems}
                expandAllItems={collapseAllItems}
              />
            </l.Div>
            <div />
            {columnLabels.map((label, idy) =>
              idy > 0 ? (
                label
              ) : (
                <l.Div key={label.key} pl={th.spacing.md}>
                  {label}
                </l.Div>
              ),
            )}
          </l.Grid>
          <l.Flex
            alignCenter
            justifyBetween
            mb={th.spacing.md}
            mt={th.sizes.icon}
          >
            <l.Flex alignCenter>
              <ty.LargeText bold>ALL EXPENSES TOTAL</ty.LargeText>
              {showExpenses && !isEmpty(filteredExpenses) && (
                <>
                  <ty.BodyText ml={th.spacing.sm} mr={th.spacing.md}>
                    - {grandTotalApprovedCount} / {filteredExpenses.length}{' '}
                    reviewed
                  </ty.BodyText>
                  <StatusIndicator
                    color={grandIsApprovedStatus?.color}
                    customStyles={{ wrapper: { py: th.spacing.tn } }}
                    text={grandIsApprovedStatus?.text}
                    title={grandIsApprovedStatus?.title}
                  />
                </>
              )}
            </l.Flex>
            {showExpenses && !isEmpty(filteredExpenses) && (
              <l.Flex alignCenter>
                <l.Div mr={83} width={36}>
                  <StatusIndicator
                    color={grandIsPaidStatus?.color}
                    customStyles={{ wrapper: { py: th.spacing.tn } }}
                    text={grandIsPaidStatus?.text}
                    title={grandIsPaidStatus?.title}
                  />
                </l.Div>
                <l.Div mr="5px" width={100}>
                  <ty.BodyText
                    bold
                    color={th.colors.brand.primaryAccent}
                    textAlign="right"
                  >
                    {grandTotalQuantity.toLocaleString()}
                  </ty.BodyText>
                </l.Div>
                <l.Div mr={25} width={120}>
                  <ty.BodyText
                    bold
                    color={th.colors.brand.primaryAccent}
                    textAlign="right"
                  >
                    {formatCurrency(grandTotalPrice)}
                  </ty.BodyText>
                </l.Div>
              </l.Flex>
            )}
          </l.Flex>
        </>
      }
      title="Expenses Summary"
    >
      {showExpenses && !isEmpty(filteredExpenses) ? (
        expenseCodes.map((expenseCode, idx) => {
          const exps = groupedExpenses[expenseCode] as ExpenseHeader[];

          const isAllApproved =
            totalsByExpenseCode[expenseCode].approvedCount === exps.length;

          const isAllPaid = totalsByExpenseCode[expenseCode].isPaid;

          const status = isAllPaid
            ? expenseStatusDescriptions.P
            : expenseStatusDescriptions.X;

          const { categoryPrice, categoryQuantity } =
            totalsByExpenseCode[expenseCode] || {};

          const sortedExpenses = getSortedItems(
            listLabels(shipperId),
            exps,
            sortBy,
            sortOrder,
          );

          return (
            <l.Div key={expenseCode} mb={th.spacing.md}>
              <Expandable
                content={
                  <l.Div mt={th.spacing.md}>
                    {sortedExpenses.map((exp) => {
                      const expReview = getUpdatedExpenseReview(
                        exp.vendorId || '',
                        exp.voucherId || '',
                        expenseCode,
                      );

                      const expItems = (exp.items?.nodes ||
                        []) as ExpenseItem[];

                      const sortedExpenseItems = getSortedItems(
                        itemListLabels,
                        expItems,
                        'sequenceId',
                        SORT_ORDER.ASC,
                      );
                      const hasExpenseItems = sortedExpenseItems.length > 0;

                      return (
                        <l.Flex alignCenter key={exp.id}>
                          <ListItem<ExpenseHeader>
                            data={exp as ExpenseHeader}
                            gridTemplateColumns={gridTemplateColumns}
                            highlightColor={th.colors.status.warning}
                            isHighlight={!!expReview?.notes}
                            listLabels={listLabels(shipperId)}
                            onSelectItem={() => {
                              toggleApproveExpense(
                                exp.vendorId || '',
                                exp.voucherId || '',
                                expenseCode,
                              );
                            }}
                            selected={!!expReview?.isApproved}
                            content={
                              <>
                                <l.Grid
                                  alignCenter
                                  gridColumnGap={th.spacing.sm}
                                  gridTemplateColumns="75px 1fr 60px 1fr 60px 1fr 60px 0.5fr 85px 1fr"
                                  mt={th.spacing.md}
                                  mx={th.spacing.md}
                                >
                                  <ty.SmallText secondary>
                                    Entry Date:
                                  </ty.SmallText>
                                  <ty.BodyText>
                                    {exp.entryDate || '-'}
                                  </ty.BodyText>
                                  <ty.SmallText secondary>
                                    Check #:
                                  </ty.SmallText>
                                  <ty.BodyText>
                                    {exp.checkNumber || '-'}
                                  </ty.BodyText>
                                  <ty.SmallText secondary>
                                    Recv Cut:
                                  </ty.SmallText>
                                  <ty.BodyText>
                                    {exp.receivableCut || '-'}
                                  </ty.BodyText>
                                  <ty.SmallText secondary>
                                    A/P Hide:
                                  </ty.SmallText>
                                  <ty.BodyText>{exp.apHide || '-'}</ty.BodyText>
                                  <ty.SmallText secondary>
                                    Customs Code:
                                  </ty.SmallText>
                                  <ty.BodyText>
                                    {exp.customsEntryCode || '-'}
                                  </ty.BodyText>
                                </l.Grid>
                                {hasExpenseItems ? (
                                  <>
                                    <l.Grid
                                      gridTemplateColumns={
                                        itemGridTemplateColumns
                                      }
                                      mb={th.spacing.sm}
                                      mt={th.spacing.md}
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
                                ) : null}
                                <l.Flex
                                  alignCenter
                                  mb={th.spacing.md}
                                  mt={th.spacing.sm}
                                  mx={th.spacing.md}
                                  width="70%"
                                >
                                  <ty.SmallText mr={th.spacing.md}>
                                    Notes:
                                  </ty.SmallText>
                                  <EditableCell
                                    content={{
                                      dirty: !!expReview,
                                      value: expReview?.notes || '',
                                    }}
                                    defaultChildren={null}
                                    editing={true}
                                    inputProps={{
                                      width: th.sizes.fill,
                                    }}
                                    onChange={(e) => {
                                      handleNotesChange(
                                        exp.voucherId || '',
                                        exp.vendorId || '',
                                        expenseCode,
                                        e.target.value,
                                      );
                                    }}
                                  />
                                </l.Flex>
                              </>
                            }
                          />
                        </l.Flex>
                      );
                    })}
                  </l.Div>
                }
                header={
                  <l.Flex alignCenter justifyBetween>
                    <l.Flex alignCenter>
                      <LineItemCheckbox
                        checked={isAllApproved}
                        onChange={() => {
                          toggleApproveExpenseCode(expenseCode);
                        }}
                      />
                      <ty.LargeText bold ml={th.spacing.md}>
                        {expenseCode} -{' '}
                        {expenseCodeDescriptions[expenseCode] || 'Unknown'}
                      </ty.LargeText>
                      <ty.BodyText ml={th.spacing.sm}>
                        - {totalsByExpenseCode[expenseCode].approvedCount} /{' '}
                        {exps.length}
                      </ty.BodyText>
                    </l.Flex>
                    <l.Flex alignCenter>
                      <l.Div mr={83} width={36}>
                        {!alwaysPaidExpenseCodes.includes(expenseCode) ? (
                          <StatusIndicator
                            color={status?.color}
                            customStyles={{ wrapper: { py: th.spacing.tn } }}
                            text={status?.text}
                            title={status?.title}
                          />
                        ) : (
                          <ty.BodyText center>-</ty.BodyText>
                        )}
                      </l.Div>
                      <l.Div mr="5px" width={100}>
                        <ty.BodyText
                          bold
                          color={th.colors.brand.primaryAccent}
                          textAlign="right"
                        >
                          {categoryQuantity
                            ? categoryQuantity.toLocaleString()
                            : '-'}
                        </ty.BodyText>
                      </l.Div>
                      <l.Div mr={25} width={120}>
                        <ty.BodyText
                          bold
                          color={th.colors.brand.primaryAccent}
                          textAlign="right"
                        >
                          {formatCurrency(categoryPrice)}
                        </ty.BodyText>
                      </l.Div>
                    </l.Flex>
                  </l.Flex>
                }
                isOpen={isItemExpanded(expenseCode)}
                showBorder={idx > 0}
                toggleIsOpen={() => toggleCollapseItem(expenseCode)}
              />
            </l.Div>
          );
        })
      ) : (
        <DataMessage
          data={showExpenses ? filteredExpenses : []}
          error={showExpenses && error}
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

export default Expenses;
