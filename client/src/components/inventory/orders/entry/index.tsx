import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import {
  equals,
  isEmpty,
  mapObjIndexed,
  omit,
  pick,
  pluck,
  sortBy,
} from 'ramda';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { StringParam } from 'use-query-params';

import api from 'api';
import AlertImg from 'assets/images/alert';
import PlusInCircle from 'assets/images/plus-in-circle';
import BaseData from 'components/base-data';
import { validateItem } from 'components/column-label';
import { DateRangeProps, formatDate } from 'components/date-range-picker';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { useActiveUser } from 'components/user/context';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import { useQuerySet } from 'hooks/use-query-params';
import {
  CommonSpecies,
  Customer,
  InventoryItem,
  LoadNumber,
  OrderEntry,
  OrderEntryItem,
  Shipper,
  Vessel,
  Warehouse,
} from 'types';
import b from 'ui/button';
import TextInput, { Select, TextArea } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

import {
  baseLabels,
  getDuplicateOrderEntryItemIds,
  itemListLabels,
} from './data-utils';
import NewOrderEntryItem from './item';
import ReviewModal from './review-modal';

export type NewOrderEntry = Pick<
  OrderEntry,
  | 'orderId'
  | 'orderDate'
  | 'billingCustomerId'
  | 'customerPo'
  | 'fobDate'
  | 'deliveredDate'
  | 'salesUserCode'
  | 'truckLoadId'
  | 'fob'
  | 'orderEntryItems'
  | 'notes'
>;

export const breadcrumbs = (isReview: boolean, id?: string) => [
  { text: 'Orders', to: `/inventory/orders` },
  ...(id
    ? [{ text: 'Order', to: `/inventory/orders/${id}?orderView=orderEntries` }]
    : []),
  {
    text: isReview ? 'Review' : id ? 'Edit' : 'Create',
    to: `/inventory/orders/${
      id ? id + (isReview ? '/review' : '/edit') : 'create'
    }?orderView=orderEntries`,
  },
];

export const gridTemplateColumns = (fob: boolean) =>
  `40px 1fr 1fr 0.5fr 1fr 0.5fr 0.5fr 1fr 0.7fr 0.7fr 70px 70px${
    fob ? '' : ' 70px'
  } 30px`;

const tabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Order Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const CreateOrderEntry = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isReview = pathname.includes('review');

  const { id } = useParams<{
    id: string;
  }>();

  const [{ customerId: customerIdQuery, loadNumber: loadNumberQuery }] =
    useQuerySet({
      customerId: StringParam,
      loadNumber: StringParam,
    });

  const {
    apiData: {
      data: activeUser,
      error: userDataError,
      loading: userDataLoading,
    },
  } = useActiveUser();
  const loadNumbers = (activeUser?.loadNumbers.nodes || []) as LoadNumber[];
  const nextLoadNumber =
    loadNumbers.find((loadNumber) => !loadNumber.customer) || loadNumbers[0];

  const [newItemNextId, setNewItemNextId] = useState(-2);

  const newOrderItem = {
    id: -1,
    lineId: 1,
    species: '',
    variety: '',
    size: '',
    packType: '',
    plu: '',
    label: '',
    vesselCode: '',
    locationId: '',
    shipperId: '',
    palletCount: 0,
    unitSellPrice: 0,
    deliveryCharge: 0,
  };

  const autoFilledOrderItem = {
    label: 'Any',
    locationId: 'Any',
    packType: 'Any',
    plu: 'Any',
    shipperId: 'Any',
    size: 'Any',
    variety: 'Any',
    vesselCode: 'Any',
  };

  const {
    data: entriesData,
    loading: entriesDataLoading,
    error: entriesDataError,
  } = api.useOrderEntry(id);
  const orderEntries = (entriesData ? entriesData.nodes : []) as OrderEntry[];
  const latestOrderEntry = orderEntries[orderEntries.length - 1];

  const initialState = {
    orderId: '',
    orderDate: new Date(),
    billingCustomerId: customerIdQuery || nextLoadNumber?.customer?.id || '',
    truckLoadId: loadNumberQuery || nextLoadNumber?.id || '',
    salesUserCode: activeUser?.userCode || '',
    customerPo: '',
    fob: true,
    fobDate: null,
    deliveredDate: null,
    notes: '',
    orderEntryItems: {
      edges: [],
      nodes: [newOrderItem] as OrderEntryItem[],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    },
  };

  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<NewOrderEntry>(
    initialState as NewOrderEntry,
  );
  const [handleCreate] = api.useCreateOrderEntry(changes.truckLoadId || '0');
  const [handleUpdate, { loading: updateLoading }] = api.useUpdateOrderEntry(
    changes.truckLoadId || '0',
  );

  const latestOrderEntryState = useMemo(
    () =>
      latestOrderEntry && {
        ...pick(
          [
            'orderId',
            'truckLoadId',
            'customerPo',
            'fob',
            'fobDate',
            'deliveredDate',
            'salesUserCode',
            'notes',
          ],
          latestOrderEntry,
        ),
        billingCustomerId: latestOrderEntry.billingCustomer?.id || '',
        deliveredDate: latestOrderEntry.deliveredDate || null,
        orderDate: new Date(),
        orderEntryItems: {
          edges: [],
          nodes: (
            (latestOrderEntry.orderEntryItems.nodes || []) as OrderEntryItem[]
          ).map((item) => ({
            ...item,
            lineId: parseInt(item.lineId, 10),
          })),
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
          totalCount: 0,
        },
      },
    [latestOrderEntry],
  );

  const cancelLink = `/inventory/orders${
    latestOrderEntryState ? '/' + latestOrderEntryState.orderId : ''
  }?sortBy=expectedShipDate&sortOrder=DESC${
    latestOrderEntryState ? '&orderView=orderEntries' : ''
  }`;

  const isDirty = !equals(
    (id && latestOrderEntryState
      ? omit(['orderDate'], {
          ...latestOrderEntryState,
          orderEntryItems: {
            ...latestOrderEntryState.orderEntryItems,
            nodes: latestOrderEntryState.orderEntryItems.nodes.map(
              (item) => item && { ...item, id: 0 },
            ),
          },
        })
      : omit(['orderDate'], {
          ...initialState,
          orderEntryItems: {
            ...initialState.orderEntryItems,
            nodes: initialState.orderEntryItems.nodes.map(
              (item) => item && { ...item, id: 0 },
            ),
          },
        })) as NewOrderEntry,
    omit(['orderDate'], {
      ...changes,
      orderEntryItems: {
        ...changes.orderEntryItems,
        nodes: changes.orderEntryItems.nodes.map(
          (item) => item && { ...item, id: 0 },
        ),
      },
    }),
  );

  const handleChange = (field: keyof NewOrderEntry, value: any) => {
    setChanges({ ...changes, [field]: value } as NewOrderEntry);
  };

  const startDate = changes.fobDate;

  const { data: itemsData, loading: itemsDataLoading } = api.useInventoryItems(
    formatDate(
      startOfISOWeek(
        add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
          months: -4,
        }),
      ),
    ),
    formatDate(
      endOfISOWeek(
        add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
          weeks: 4,
        }),
      ),
    ),
  );
  const items = (itemsData ? itemsData.nodes : []) as InventoryItem[];

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');

  const customers = (customerData ? customerData.nodes : []) as Customer[];
  const customer = customers.find(
    (customer) => customer.id === changes.billingCustomerId,
  );

  const hasValidLoadNumber =
    !!changes.truckLoadId &&
    (!!id || pluck('id', loadNumbers).includes(changes.truckLoadId));

  const hasValidCustomer = !!customer;

  const hasValidDates = !!changes.fob
    ? !!changes.fobDate
    : !!changes.fobDate &&
      !!changes.deliveredDate &&
      isDateGreaterThanOrEqualTo(
        new Date(changes.deliveredDate.replace(/-/g, '/')),
        new Date(changes.fobDate.replace(/-/g, '/')),
      );

  const duplicateIds = getDuplicateOrderEntryItemIds(
    changes.orderEntryItems.nodes as OrderEntryItem[],
  );

  const invalidIds = (changes.orderEntryItems.nodes as OrderEntryItem[])
    .filter((item) => !validateItem(item, itemListLabels(!!changes.fob)))
    .map((item) => item.id);

  const validate = () =>
    hasValidLoadNumber &&
    hasValidCustomer &&
    hasValidDates &&
    isEmpty(duplicateIds) &&
    isEmpty(invalidIds);

  const { ItemSelector: LoadNumberSelector } = useItemSelector<LoadNumber>({
    allItems: sortBy(
      (loadNumber) =>
        loadNumber.id === changes.truckLoadId
          ? 'a'
          : loadNumber.customer
          ? 'b'
          : 'c',
      loadNumbers,
    ),
    closeOnSelect: true,
    disableSearchQuery: true,
    error: userDataError,
    errorLabel: 'load numbers',
    getItemContent: ({ id, customer }) => {
      const active = id === changes.truckLoadId;
      return (
        <l.Flex ml={th.spacing.sm}>
          <ty.CaptionText bold={active} nowrap>
            {id} -
          </ty.CaptionText>
          <ty.CaptionText
            bold={active}
            ml={th.spacing.xs}
            secondary={!customer}
          >
            {customer
              ? customer.customerName + ' (' + customer.id + ')'
              : 'Unassigned'}
          </ty.CaptionText>
        </l.Flex>
      );
    },
    isDirty:
      loadNumberQuery &&
      changes.truckLoadId &&
      changes.truckLoadId !== loadNumberQuery,
    loading: userDataLoading,
    nameKey: 'id',
    onClear: () =>
      handleChange(
        'truckLoadId',
        loadNumberQuery || latestOrderEntryState?.truckLoadId || undefined,
      ),
    selectedItem: changes.truckLoadId || undefined,
    selectItem: (ln) =>
      setChanges({
        ...changes,
        truckLoadId: ln.id,
        billingCustomerId: ln.customer
          ? ln.customer.id
          : changes.billingCustomerId,
      }),
    placeholder: 'Select',
    searchWidth: 150,
    width: 350,
    validationError: saveAttempt && !hasValidLoadNumber,
  });

  const loadNumberDataLoading = customerDataLoading || userDataLoading;
  const loadNumberDataError = customerDataError || userDataError;
  const prevLoadNumberDataLoading = usePrevious(loadNumberDataLoading);

  useEffect(() => {
    if (
      prevLoadNumberDataLoading &&
      !loadNumberDataLoading &&
      !loadNumberDataError
    ) {
      setChanges({
        ...changes,
        orderId: initialState.orderId,
        truckLoadId: initialState.truckLoadId,
        billingCustomerId: initialState.billingCustomerId || customer?.id || '',
      });
    }
  }, [
    changes,
    initialState.orderId,
    initialState.truckLoadId,
    initialState.billingCustomerId,
    loadNumberDataError,
    loadNumberDataLoading,
    prevLoadNumberDataLoading,
    customer,
  ]);

  const selectedLoadNumber = loadNumbers.find(
    (ln) => ln.id === changes.truckLoadId,
  );
  const hasLoadNumberWithCustomer = !!loadNumbers.find(
    (ln) =>
      changes.billingCustomerId &&
      ln.customer?.id === changes.billingCustomerId,
  );

  const { ItemSelector: CustomerItemSelector } = useItemSelector<Customer>({
    allItems: sortBy(
      (c) => (c.id === changes.billingCustomerId ? 'a' : 'b'),
      customers,
    ),
    closeOnSelect: true,
    disableSearchQuery: true,
    error: customerDataError,
    errorLabel: 'customers',
    getItemContent: ({ id, customerName }) => {
      const active = id === changes.billingCustomerId;
      return (
        <l.Flex ml={th.spacing.sm}>
          <ty.CaptionText bold={active} nowrap>
            {id} -
          </ty.CaptionText>
          <ty.CaptionText bold={active} ml={th.spacing.xs}>
            {customerName}
          </ty.CaptionText>
        </l.Flex>
      );
    },
    isDirty:
      customerIdQuery &&
      changes.billingCustomerId &&
      changes.billingCustomerId !== customerIdQuery,
    loading: customerDataLoading,
    nameKey: 'customerName',
    onClear: () =>
      handleChange('billingCustomerId', customerIdQuery || undefined),
    selectedItem:
      changes.billingCustomerId ||
      latestOrderEntryState?.billingCustomerId ||
      undefined,
    selectItem: (c) => handleChange('billingCustomerId', c.id),
    placeholder: 'Select',
    searchWidth: 150,
    warning:
      selectedLoadNumber && selectedLoadNumber.customer
        ? selectedLoadNumber.customer.id !== changes.billingCustomerId
        : hasLoadNumberWithCustomer,
    width: 350,
    validationError: saveAttempt && !hasValidCustomer,
  });

  const {
    data: productsData,
    loading: productsDataLoading,
    error: productsDataError,
  } = api.useCommonSpecieses();
  const commonSpecieses = (productsData?.nodes || []) as CommonSpecies[];

  const {
    data: shipperData,
    loading: shipperDataLoading,
    error: shipperDataError,
  } = api.useShippers('SHIPPER_NAME_ASC');
  const shippers = (shipperData ? shipperData.nodes : []) as Shipper[];

  const {
    data: warehouseData,
    loading: warehouseDataLoading,
    error: warehouseDataError,
  } = api.useWarehouses('WAREHOUSE_NAME_ASC');
  const warehouses = (warehouseData ? warehouseData.nodes : []) as Warehouse[];

  const {
    data: vesselData,
    loading: vesselDataLoading,
    error: vesselDataError,
  } = api.useVessels({ orderByOverride: 'VESSEL_NAME_ASC' });
  const vessels = (vesselData ? vesselData.nodes : []) as Vessel[];

  const loading =
    entriesDataLoading ||
    productsDataLoading ||
    shipperDataLoading ||
    warehouseDataLoading ||
    vesselDataLoading;

  const error =
    entriesDataError ||
    productsDataError ||
    shipperDataError ||
    warehouseDataError ||
    vesselDataError;

  const { TabBar } = useTabBar(tabs(changes.orderEntryItems.nodes.length));

  const dateRangeProps = (fieldName: 'fobDate' | 'deliveredDate') =>
    ({
      allowEmpty: true,
      hasError: saveAttempt && !hasValidDates,
      hideDefinedRanges: true,
      isDirty:
        id &&
        changes[fieldName] !==
          (latestOrderEntryState?.[fieldName] !== undefined
            ? latestOrderEntryState[fieldName]
            : initialState[fieldName]),
      onDateChange: (dateRange) => {
        handleChange(fieldName, dateRange?.startDate);
      },
      placeholder: 'Select',
      singleSelection: true,
      minDate: new Date(),
    } as Omit<DateRangeProps, 'onClear'>);

  const {
    DateRangePicker: FOBDateRangePicker,
    handleDateChange: handleFOBDateChange,
  } = useDateRange(dateRangeProps('fobDate'));

  const {
    DateRangePicker: DeliveredDateRangePicker,
    handleDateChange: handleDeliveredDateChange,
  } = useDateRange(dateRangeProps('deliveredDate'));

  useEffect(() => {
    if (
      !customerDataLoading &&
      !entriesDataLoading &&
      changes.fobDate === null &&
      latestOrderEntryState &&
      latestOrderEntryState?.fobDate
    ) {
      const updates = latestOrderEntryState;

      const fobDate = new Date(
        latestOrderEntryState.fobDate.replace(/-/g, '/'),
      );
      handleFOBDateChange({
        selection: {
          startDate: fobDate,
          endDate: fobDate,
        },
      });

      if (latestOrderEntryState.deliveredDate) {
        const deliveredDate = new Date(
          latestOrderEntryState.deliveredDate.replace(/-/g, '/'),
        );
        handleDeliveredDateChange({
          selection: {
            startDate: deliveredDate,
            endDate: deliveredDate,
          },
        });
      }

      setChanges(updates);
    }
  }, [
    changes.fobDate,
    handleDeliveredDateChange,
    handleFOBDateChange,
    latestOrderEntryState,
    customerDataLoading,
    entriesDataLoading,
  ]);

  const columnLabels = useColumns<OrderEntryItem>(
    'species',
    SORT_ORDER.ASC,
    itemListLabels(!!changes.fob),
    'operations',
    'order_entry_item',
  );

  const handleSave = () => {
    setSaveAttempt(true);
    if (validate()) {
      setLoading(true);
      handleCreate({
        variables: {
          orderEntry: {
            ...omit(['id', 'orderEntryItems'], changes),
            orderId: changes.truckLoadId,
            orderEntryItemsUsingId: {
              create: (changes.orderEntryItems.nodes as OrderEntryItem[]).map(
                (entryItem) => ({
                  ...omit(
                    [
                      'id',
                      'orderEntryId',
                      'shipper',
                      'vessel',
                      'warehouse',
                      '__typename',
                    ],
                    entryItem,
                  ),
                  reviewSpecies: entryItem.species,
                  reviewVariety: entryItem.variety,
                  reviewSize: entryItem.size,
                  reviewPackType: entryItem.packType,
                  reviewLabel: entryItem.label,
                  reviewVesselCode: entryItem.vesselCode,
                  reviewLocationId: entryItem.locationId,
                  reviewPlu: entryItem.plu,
                  reviewShipperId: entryItem.shipperId,
                  deliveryCharge: changes.fob ? 0 : entryItem.deliveryCharge,
                }),
              ),
            },
          },
        },
      }).then(() => {
        history.push(
          `/inventory/orders/${changes.truckLoadId}?sortBy=expectedShipDate&sortOrder=DESC&orderView=orderEntries`,
        );
      });
    }
  };

  const handleRequestChanges = (comments: string) => {
    // setSaveAttempt(true);
  };

  const handleApprove = () => {
    setSaveAttempt(true);
    if (validate()) {
      setLoading(true);
      handleUpdate({
        variables: {
          id: latestOrderEntry?.id,
          orderEntry: {
            reviewUserCode: activeUser?.userCode || 'UNK',
            reviewDate: new Date(),
            orderEntryItemsUsingId: {
              updateById: (
                changes.orderEntryItems.nodes as OrderEntryItem[]
              ).map((entryItem) => ({
                id: entryItem.id,
                patch: pick(
                  [
                    'reviewSpecies',
                    'reviewVariety',
                    'reviewSize',
                    'reviewPackType',
                    'reviewLabel',
                    'reviewVesselCode',
                    'reviewLocationId',
                    'reviewPlu',
                    'reviewShipperId',
                    'notes',
                  ],
                  entryItem,
                ),
              })),
            },
          },
        },
      }).then(() => {
        history.push(
          `/inventory/orders/${changes.truckLoadId}?sortBy=expectedShipDate&sortOrder=DESC&orderView=orderEntries`,
        );
      });
    }
  };

  const handleItemChange = (updatedItem: OrderEntryItem) => {
    setChanges({
      ...changes,
      orderEntryItems: {
        ...changes.orderEntryItems,
        nodes: sortBy(
          (item) => item?.lineId,
          [
            ...changes.orderEntryItems.nodes.filter(
              (it) => it?.id !== updatedItem.id,
            ),
            updatedItem,
          ],
        ),
      },
    });
  };

  const handleNewItem = (updatedItem?: OrderEntryItem) => {
    setChanges({
      ...changes,
      orderEntryItems: {
        ...changes.orderEntryItems,
        nodes: [
          ...changes.orderEntryItems.nodes,
          {
            ...(updatedItem || newOrderItem),
            id: newItemNextId,
            lineId: changes.orderEntryItems.nodes.length + 1,
          } as OrderEntryItem,
        ],
      },
    });
    setNewItemNextId(newItemNextId - 1);
  };

  const handleRemoveItem = (id: number) => {
    const filteredItems = changes.orderEntryItems.nodes.filter(
      (i) => i?.id !== id,
    );
    setChanges({
      ...changes,
      orderEntryItems: {
        ...changes.orderEntryItems,
        nodes: filteredItems.map((item, idx) => ({
          ...item,
          lineId: idx + 1,
        })) as OrderEntryItem[],
      },
    });
  };

  return (
    <Page
      actions={
        isReview ? (
          <>
            <ReviewModal
              handleConfirm={(comments) => handleRequestChanges(comments)}
              salesUserEmail={
                latestOrderEntry?.salesUser?.personContact?.email || ''
              }
              triggerDisabled={false}
              confirmLoading={updateLoading}
            />
            <l.AreaLink ml={th.spacing.lg} to={cancelLink}>
              <b.Error width={88}>Cancel</b.Error>
            </l.AreaLink>
            <b.Success
              disabled={updateLoading}
              onClick={handleApprove}
              ml={th.spacing.md}
            >
              {updateLoading ? (
                <l.Flex alignCenter justifyCenter>
                  <ClipLoader
                    color={th.colors.brand.secondary}
                    size={th.sizes.xs}
                  />
                </l.Flex>
              ) : (
                'Approve'
              )}
            </b.Success>
          </>
        ) : (
          [
            <Fragment key={0}>
              <l.AreaLink to={cancelLink}>
                <b.Error width={88}>Cancel</b.Error>
              </l.AreaLink>
              {saveAttempt && !validate() && (
                <l.Flex
                  alignCenter
                  height={th.heights.input}
                  ml={th.spacing.md}
                >
                  <AlertImg height={20} width={20} />
                </l.Flex>
              )}
              <b.Success
                disabled={!isDirty || (saveAttempt && !validate())}
                ml={th.spacing.md}
                onClick={handleSave}
              >
                {createLoading ? (
                  <l.Flex alignCenter justifyCenter>
                    <ClipLoader
                      color={th.colors.brand.secondary}
                      size={th.sizes.xs}
                    />
                  </l.Flex>
                ) : id ? (
                  'Submit Changes'
                ) : (
                  'Submit'
                )}
              </b.Success>
            </Fragment>,
          ]
        )
      }
      breadcrumbs={breadcrumbs(isReview, id)}
      title={isReview ? 'Review Order' : id ? 'Edit Order' : 'New Order'}
    >
      {!loading ? (
        <>
          {isReview ? (
            latestOrderEntry && (
              <l.Div mt={th.spacing.md}>
                <BaseData<OrderEntry>
                  data={latestOrderEntry}
                  labels={baseLabels}
                />
              </l.Div>
            )
          ) : (
            <l.Flex alignStart mt={th.spacing.lg}>
              <l.Grid
                alignCenter
                gridRowGap={th.sizes.icon}
                gridTemplateColumns="220px 1fr"
                mr={th.spacing.md}
                width="45%"
              >
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  Order / Load Number:
                </ty.CaptionText>
                <l.Flex alignCenter height={th.heights.input} zIndex={17}>
                  {id && latestOrderEntryState.truckLoadId ? (
                    <ty.BodyText>
                      {latestOrderEntryState.truckLoadId}
                    </ty.BodyText>
                  ) : (
                    LoadNumberSelector
                  )}
                </l.Flex>
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  Customer Number:
                </ty.CaptionText>
                <l.Flex alignCenter height={38} zIndex={16}>
                  {id && customer ? (
                    <ty.BodyText>{customer.id}</ty.BodyText>
                  ) : (
                    CustomerItemSelector
                  )}
                </l.Flex>
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  PO Number:
                </ty.CaptionText>
                <TextInput
                  isDirty={
                    !!(
                      id &&
                      changes.customerPo !==
                        (latestOrderEntryState?.customerPo !== undefined
                          ? latestOrderEntryState.customerPo
                          : initialState.customerPo)
                    )
                  }
                  onChange={(e) => handleChange('customerPo', e.target.value)}
                  value={changes.customerPo || ''}
                  width={150}
                />
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  FOB / Delivered:
                </ty.CaptionText>
                <Select
                  isDirty={
                    !!(
                      id &&
                      changes.fob !==
                        (latestOrderEntryState?.fob !== undefined
                          ? latestOrderEntryState.fob
                          : initialState.fob)
                    )
                  }
                  onChange={(e) => {
                    handleChange('fob', e.target.value === 'fob');
                  }}
                  value={changes.fob ? 'fob' : 'del'}
                  width={150}
                >
                  <option value="fob">FOB</option>
                  <option value="del">Delivered</option>
                </Select>
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  FOB Date:
                </ty.CaptionText>
                <l.Div zIndex={15}>{FOBDateRangePicker}</l.Div>
                {!changes.fob ? (
                  <>
                    <ty.CaptionText
                      mr={th.spacing.lg}
                      secondary
                      textAlign="right"
                    >
                      Delivered Date:
                    </ty.CaptionText>
                    {DeliveredDateRangePicker}
                  </>
                ) : null}
              </l.Grid>
              <l.Grid
                alignCenter
                gridRowGap={th.sizes.icon}
                gridTemplateColumns="170px 1fr"
                mr={th.spacing.md}
                width="45%"
              >
                <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                  Sales Assoc:
                </ty.CaptionText>
                <l.Flex alignCenter height={th.heights.input}>
                  <ty.BodyText>
                    {activeUser?.personContact?.firstName}
                  </ty.BodyText>
                </l.Flex>
                {customer ? (
                  <ty.CaptionText
                    mr={th.spacing.lg}
                    secondary
                    textAlign="right"
                  >
                    Customer Name:
                  </ty.CaptionText>
                ) : (
                  <div />
                )}
                <l.Flex alignCenter height={38}>
                  {customer ? (
                    <ty.LinkText
                      hover="false"
                      target="_blank"
                      to={`/directory/customers/${customer.id}`}
                    >
                      {customer.customerName}
                    </ty.LinkText>
                  ) : (
                    <ty.CaptionText disabled>
                      No customer selected
                    </ty.CaptionText>
                  )}
                </l.Flex>
                {customer && (
                  <l.Flex alignStart height={50} justifyEnd mr={th.spacing.lg}>
                    <ty.CaptionText secondary textAlign="right">
                      Customer Notes:
                    </ty.CaptionText>
                  </l.Flex>
                )}
                {customer && (
                  <l.Div height={50}>
                    <ty.CaptionText>{customer.notes || '-'}</ty.CaptionText>
                  </l.Div>
                )}
                <ty.CaptionText
                  alignSelf="flex-start"
                  mr={th.spacing.lg}
                  secondary
                  textAlign="right"
                >
                  Order Notes:
                </ty.CaptionText>
                <TextArea
                  fontSize={th.fontSizes.caption}
                  isDirty={
                    !!(
                      id &&
                      changes.notes !==
                        (latestOrderEntryState?.notes !== undefined
                          ? latestOrderEntryState.notes
                          : initialState.notes)
                    )
                  }
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  maxWidth={240}
                  value={changes.notes || ''}
                />
              </l.Grid>
            </l.Flex>
          )}
          <l.Div
            mb={th.spacing.lg}
            mt={isReview ? th.spacing.lg : th.spacing.xl}
          >
            <TabBar />
          </l.Div>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns(!!changes.fob)}
            gridColumnGap={th.spacing.xs}
            mb={th.spacing.sm}
            mt={th.spacing.lg}
            ml={52}
            // pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
          >
            {columnLabels}
          </l.Grid>
          {changes.orderEntryItems.nodes.map((item, idx) => (
            <l.Div
              background={
                idx % 2 === 0 ? th.colors.brand.containerBackground : undefined
              }
              border={th.borders.disabled}
              borderTop={idx === 0 ? th.borders.disabled : 0}
              key={item?.id}
              py={th.spacing.xs}
            >
              <NewOrderEntryItem
                commonSpecieses={commonSpecieses}
                currentItem={
                  ((item &&
                    latestOrderEntryState &&
                    latestOrderEntryState.orderEntryItems.nodes.find(
                      (it) => it.lineId === item.lineId,
                    )) ||
                    item) as OrderEntryItem
                }
                duplicateIds={duplicateIds}
                editing={true}
                error={error}
                fob={!!changes.fob}
                fobDate={changes.fobDate}
                handleAutoFill={() =>
                  item &&
                  handleItemChange({
                    ...item,
                    ...mapObjIndexed(
                      (val, fieldName) => item[fieldName] || val,
                      autoFilledOrderItem,
                    ),
                  } as OrderEntryItem)
                }
                handleChange={(key: keyof OrderEntryItem, value: any) => {
                  handleItemChange({ ...item, [key]: value } as OrderEntryItem);
                }}
                handleNewItem={handleNewItem}
                handleRemoveItem={handleRemoveItem}
                handleResetItem={() =>
                  item &&
                  handleItemChange({
                    ...item,
                    reviewSpecies: item.species,
                    reviewVariety: item.variety,
                    reviewSize: item.size,
                    reviewPackType: item.packType,
                    reviewLabel: item.label,
                    reviewPlu: item.plu,
                    reviewShipperId: item.shipperId,
                    reviewVesselCode: item.vesselCode,
                    reviewLocationId: item.locationId,
                    notes: item.notes,
                  } as OrderEntryItem)
                }
                inventoryItems={items}
                isReview={isReview}
                loading={loading || itemsDataLoading}
                saveAttempt={saveAttempt}
                shippers={shippers}
                showRemoveIcon={changes.orderEntryItems.nodes.length > 1}
                updatedItem={item as OrderEntryItem}
                vessels={vessels}
                warehouses={warehouses}
              />
            </l.Div>
          ))}
          <l.Div mb={th.spacing.xxxl} ml={30} mt={th.spacing.sm}>
            {!isReview && (
              <l.HoverButton
                onClick={() => {
                  handleNewItem();
                }}
              >
                <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
              </l.HoverButton>
            )}
          </l.Div>
        </>
      ) : (
        <DataMessage data={orderEntries} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CreateOrderEntry;
