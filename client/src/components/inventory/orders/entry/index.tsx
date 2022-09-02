import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { equals, isEmpty, omit, pick, sortBy } from 'ramda';
import { useHistory, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import AlertImg from 'assets/images/alert';
import PlusInCircle from 'assets/images/plus-in-circle';
import { validateItem } from 'components/column-label';
import { DateRangeProps, formatDate } from 'components/date-range-picker';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import { useUserContext } from 'components/user/context';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import {
  CommonSpecies,
  Customer,
  InventoryItem,
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

import { getDuplicateOrderEntryItemIds, itemListLabels } from './data-utils';
import NewOrderEntryItem from './item';
import { DataMessage } from 'components/page/message';

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

export const breadcrumbs = (id?: string) => [
  { text: 'Orders', to: `/inventory/orders` },
  ...(id ? [{ text: 'Order', to: `/inventory/orders/${id}` }] : []),
  {
    text: id ? 'Edit' : 'Create',
    to: `/inventory/orders/${id ? id + '/edit' : 'create'}`,
  },
];

export const gridTemplateColumns =
  '40px 1fr 1fr 0.5fr 1fr 0.5fr 0.5fr 1fr 0.7fr 0.7fr 70px 70px 70px 30px';

const tabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Order Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const CreateOrderEntry = () => {
  const history = useHistory();

  const { id } = useParams<{
    id: string;
  }>();

  const [{ activeUserId }] = useUserContext();
  const { data: activeUser } = api.useGetUser(activeUserId || 0);

  const nextOrderId = 61234;
  const nextTruckLoadId = '62345';

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

  const {
    data: entriesData,
    loading: entriesDataLoading,
    error: entriesDataError,
  } = api.useOrderEntry(id);
  const orderEntries = (entriesData ? entriesData.nodes : []) as OrderEntry[];
  const latestOrderEntry = orderEntries[orderEntries.length - 1];

  const initialState = {
    orderId: nextOrderId,
    orderDate: new Date(),
    billingCustomerId: '',
    truckLoadId: nextTruckLoadId,
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

  const cancelLink = '/inventory/orders?sortBy=expectedShipDate&sortOrder=DESC';

  const [handleCreate] = api.useCreateOrderEntry();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<NewOrderEntry>(
    initialState as NewOrderEntry,
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
        deliveredDate: latestOrderEntry.deliveredDate || undefined,
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

  const isDirty = !equals(
    (id && latestOrderEntry
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

  const {
    data: itemsData,
    loading: itemsDataLoading,
    error: itemsDataError,
  } = api.useInventoryItems(
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
    .filter((item) => !validateItem(item, itemListLabels))
    .map((item) => item.id);

  const validate = () =>
    hasValidCustomer &&
    hasValidDates &&
    isEmpty(duplicateIds) &&
    isEmpty(invalidIds);

  const { ItemSelector: CustomerItemSelector } = useItemSelector<Customer>({
    allItems: customers,
    closeOnSelect: true,
    error: customerDataError,
    errorLabel: 'customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    onClear: () => handleChange('billingCustomerId', undefined),
    searchParamName: 'customerSearch',
    selectedItem: changes.billingCustomerId || undefined,
    selectItem: (c) => handleChange('billingCustomerId', c.id),
    placeholder: 'Select',
    searchWidth: 150,
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
    customerDataLoading ||
    itemsDataLoading ||
    shipperDataLoading ||
    warehouseDataLoading ||
    vesselDataLoading;

  const error =
    entriesDataError ||
    productsDataError ||
    customerDataError ||
    itemsDataError ||
    shipperDataError ||
    warehouseDataError ||
    vesselDataError;

  const { TabBar } = useTabBar(tabs(changes.orderEntryItems.nodes.length));

  const dateRangeProps = (fieldName: any) =>
    ({
      allowEmpty: true,
      hasError: saveAttempt && !hasValidDates,
      hideDefinedRanges: true,
      isDirty: true,
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
      handleFOBDateChange(
        {
          selection: {
            startDate: fobDate,
            endDate: fobDate,
          },
        },
        'replaceIn',
      );

      if (latestOrderEntryState.deliveredDate) {
        const deliveredDate = new Date(
          latestOrderEntryState.deliveredDate.replace(/-/g, '/'),
        );
        handleDeliveredDateChange(
          {
            selection: {
              startDate: deliveredDate,
              endDate: deliveredDate,
            },
          },
          'replaceIn',
        );
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
    itemListLabels,
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
            orderEntryItemsUsingId: {
              create: (changes.orderEntryItems.nodes as OrderEntryItem[]).map(
                (entryItem) => ({
                  ...omit(['id', '__typename'], entryItem),
                }),
              ),
            },
          },
        },
      }).then(() => {
        history.push(cancelLink);
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
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          {saveAttempt && !validate() && (
            <l.Flex alignCenter height={th.heights.input} ml={th.spacing.md}>
              <AlertImg height={20} width={20} />
            </l.Flex>
          )}
          <b.Primary
            disabled={!isDirty || (saveAttempt && !validate())}
            ml={th.spacing.md}
            onClick={handleSave}
            width={88}
          >
            {createLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              'Submit'
            )}
          </b.Primary>
        </Fragment>,
      ]}
      breadcrumbs={breadcrumbs(id)}
      title={id ? 'Edit Order' : 'New Order'}
    >
      {!loading ? (
        <>
          <l.Flex alignStart mt={th.spacing.lg}>
            <l.Grid
              alignCenter
              gridRowGap={th.sizes.icon}
              gridTemplateColumns="170px 1fr"
              mr={th.spacing.md}
              width="40%"
            >
              <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                Customer:
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
                  changes.customerPo !==
                  (id && latestOrderEntryState?.customerPo !== undefined
                    ? latestOrderEntryState.customerPo
                    : initialState.customerPo)
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
                  changes.fob !==
                  (id && latestOrderEntryState?.fob !== undefined
                    ? latestOrderEntryState.fob
                    : initialState.fob)
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
                  changes.notes !==
                  (id && latestOrderEntryState?.notes !== undefined
                    ? latestOrderEntryState.notes
                    : initialState.notes)
                }
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
                maxWidth={240}
                value={changes.notes || ''}
              />
            </l.Grid>
            <l.Grid
              alignCenter
              gridRowGap={th.sizes.icon}
              gridTemplateColumns="170px 1fr"
              mr={th.spacing.md}
              width="30%"
            >
              <l.Flex alignCenter gridColumn={'1 / 3'} height={38}>
                {customer ? (
                  <ty.LinkText
                    hover="false"
                    ml={th.spacing.lg}
                    target="_blank"
                    to={`/directory/customers/${customer.id}`}
                  >
                    {customer.customerName}
                  </ty.LinkText>
                ) : (
                  <ty.CaptionText ml={38} disabled>
                    No customer selected
                  </ty.CaptionText>
                )}
              </l.Flex>
              <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                Order Number:
              </ty.CaptionText>
              <l.Flex alignCenter height={th.heights.input}>
                <ty.BodyText ml={th.spacing.md}>{nextOrderId}</ty.BodyText>
              </l.Flex>
              <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                Load Number:
              </ty.CaptionText>
              <l.Flex alignCenter height={th.heights.input}>
                <ty.BodyText ml={th.spacing.md}>{nextTruckLoadId}</ty.BodyText>
              </l.Flex>
              <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
                Sales Assoc:
              </ty.CaptionText>
              <l.Flex alignCenter height={th.heights.input}>
                <ty.BodyText ml={th.spacing.md}>
                  {activeUser?.personContact?.firstName}
                </ty.BodyText>
              </l.Flex>
            </l.Grid>
            {customer && (
              <l.Div flex={1}>
                <ty.CaptionText
                  height={38}
                  mb={th.spacing.md}
                  mt={th.spacing.sm}
                  secondary
                >
                  Customer Notes:
                </ty.CaptionText>
                <ty.CaptionText>{customer.notes || '-'}</ty.CaptionText>
              </l.Div>
            )}
          </l.Flex>
          <l.Div mb={th.spacing.lg} mt={th.spacing.xl}>
            <TabBar />
          </l.Div>
          <l.Grid
            gridTemplateColumns={gridTemplateColumns}
            gridColumnGap={th.spacing.xs}
            mb={th.spacing.sm}
            mt={th.spacing.lg}
            ml={52}
            // pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
          >
            {columnLabels}
          </l.Grid>
          {changes.orderEntryItems.nodes.map((item) => (
            <NewOrderEntryItem
              commonSpecieses={commonSpecieses}
              currentItem={
                ((item &&
                  latestOrderEntryState.orderEntryItems.nodes.find(
                    (it) => it.lineId === item.lineId,
                  )) ||
                  item) as OrderEntryItem
              }
              duplicateIds={duplicateIds}
              editing={true}
              error={error}
              fobDate={changes.fobDate}
              handleChange={(key: keyof OrderEntryItem, value: any) => {
                handleItemChange({ ...item, [key]: value } as OrderEntryItem);
              }}
              handleNewItem={handleNewItem}
              handleRemoveItem={handleRemoveItem}
              inventoryItems={items}
              key={item?.id}
              loading={loading}
              saveAttempt={saveAttempt}
              shippers={shippers}
              showRemoveIcon={changes.orderEntryItems.nodes.length > 1}
              updatedItem={item as OrderEntryItem}
              vessels={vessels}
              warehouses={warehouses}
            />
          ))}
          <l.Div mb={th.spacing.xxxl} ml={30} mt={th.spacing.sm}>
            <l.HoverButton
              onClick={() => {
                handleNewItem();
              }}
            >
              <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
            </l.HoverButton>
          </l.Div>
        </>
      ) : (
        <DataMessage data={orderEntries} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default CreateOrderEntry;
