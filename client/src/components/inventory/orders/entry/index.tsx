import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import { validateItem } from 'components/column-label';
import { DateRangeProps } from 'components/date-range-picker';
import useItemSelector from 'components/item-selector';
import Page from 'components/page';
import { Tab, useTabBar } from 'components/tab-bar';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import { Customer, OrderEntry, OrderEntryItem, Warehouse } from 'types';
import b from 'ui/button';
import TextInput, { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, itemListLabels } from './data-utils';

export type NewOrderEntry = Pick<
  OrderEntry,
  | 'orderId'
  | 'orderDate'
  | 'billingCustomerId'
  | 'customerPo'
  | 'salesUserCode'
  | 'truckLoadId'
  | 'fob'
  | 'orderEntryItems'
>;

export const breadcrumbs = [
  { text: 'Orders', to: `/inventory/orders` },
  { text: 'Create', to: `/inventory/orders/create` },
];

export const gridTemplateColumns =
  '40px 1fr 1fr 0.5fr 1fr 0.5fr 0.5fr 1fr 0.5fr 0.5fr 70px 70px 1fr 30px';

const tabs: (itemCount: number) => Tab[] = (itemCount) => [
  {
    id: 'orderItems',
    text: `Order Items${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const CreateOrderEntry = () => {
  const history = useHistory();

  const nextOrderId = 61234;
  const nextTruckLoadId = '62345';

  const { data: warehouseData } = api.useWarehouses('WAREHOUSE_NAME_ASC');
  const warehouses = (warehouseData ? warehouseData.nodes : []) as Warehouse[];

  const initialState = {
    orderId: nextOrderId,
    orderDate: new Date(),
    billingCustomerId: '',
    truckLoadId: nextTruckLoadId,
    salesUserCode: '',
    customerPo: '',
    fob: true,
    orderEntryItems: {
      edges: [],
      nodes: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      totalCount: 0,
    },
  };

  const cancelLink = '/inventory/orders';

  const [handleCreate] = api.useCreateOrderEntry();
  const [createLoading, setLoading] = useState(false);
  const [saveAttempt, setSaveAttempt] = useState(false);

  const [changes, setChanges] = useState<NewOrderEntry>(
    initialState as NewOrderEntry,
  );

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');

  const customers = (customerData ? customerData.nodes : []) as Customer[];
  const customer = customers.find(
    (customer) => customer.id === changes.billingCustomerId,
  );

  const handleChange = (field: keyof NewOrderEntry, value: any) => {
    setChanges({ ...changes, [field]: value } as NewOrderEntry);
  };

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
  });

  const { TabBar } = useTabBar(tabs(changes.orderEntryItems.nodes.length));

  const dateRangeProps = (fieldName: any) =>
    ({
      allowEmpty: true,
      hideDefinedRanges: true,
      internalOnly: true,
      onDateChange: (dateRange) => {
        handleChange(fieldName, dateRange?.startDate);
      },
      placeholder: 'Select',
      singleSelection: true,
      minDate: new Date(),
    } as Omit<DateRangeProps, 'onClear'>);

  const { DateRangePicker: FOBDateRangePicker } = useDateRange(
    dateRangeProps('fobDate'),
  );
  const { DateRangePicker: DeliveredDateRangePicker } = useDateRange(
    dateRangeProps('deliveredDate'),
  );

  const columnLabels = useColumns<OrderEntryItem>(
    'species',
    SORT_ORDER.ASC,
    itemListLabels,
    'operations',
    'order_entry_item',
  );

  const handleSave = () => {
    setSaveAttempt(true);
    if (validateItem(changes, baseLabels)) {
      setLoading(true);
      handleCreate({
        variables: {
          orderEntry: changes,
        },
      }).then(() => {
        history.push(cancelLink);
      });
    }
  };

  return (
    <Page
      actions={[
        <Fragment key={0}>
          <l.AreaLink to={cancelLink}>
            <b.Primary width={88}>Cancel</b.Primary>
          </l.AreaLink>
          <b.Primary ml={th.spacing.md} onClick={handleSave} width={88}>
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
      breadcrumbs={breadcrumbs}
      title="New Order"
    >
      <l.Grid
        alignCenter
        gridRowGap={th.sizes.icon}
        gridTemplateColumns="170px 1fr 170px 1fr"
        mt={th.spacing.lg}
        width="80%"
      >
        <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
          Customer:
        </ty.CaptionText>
        <l.Div zIndex={15}>{CustomerItemSelector}</l.Div>
        <l.Div gridColumn={'3 / 5'}>
          {customer && (
            <ty.LinkText
              hover="false"
              ml={th.spacing.lg}
              target="_blank"
              to={`/directory/customers/${customer.id}`}
            >
              {customer.customerName}
            </ty.LinkText>
          )}
        </l.Div>
        <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
          PO Number:
        </ty.CaptionText>
        <TextInput
          onChange={(e) => handleChange('customerPo', e.target.value)}
          value={changes.customerPo || ''}
          width={150}
        />
        <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
          Order Number:
        </ty.CaptionText>
        <l.Flex alignCenter height={th.heights.input}>
          <ty.BodyText ml={th.spacing.md}>{nextOrderId}</ty.BodyText>
        </l.Flex>
        <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
          FOB / Delivered:
        </ty.CaptionText>
        <Select
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
          Load Number:
        </ty.CaptionText>
        <l.Flex alignCenter height={th.heights.input}>
          <ty.BodyText ml={th.spacing.md}>{nextTruckLoadId}</ty.BodyText>
        </l.Flex>
        <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
          FOB Date:
        </ty.CaptionText>
        {FOBDateRangePicker}
        {!changes.fob && (
          <>
            <ty.CaptionText mr={th.spacing.lg} secondary textAlign="right">
              Delivered Date:
            </ty.CaptionText>
            {DeliveredDateRangePicker}
          </>
        )}
      </l.Grid>
      <l.Div mb={th.spacing.lg} mt={th.spacing.xl}>
        <TabBar />
      </l.Div>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        mt={th.spacing.lg}
        pl={th.spacing.sm}
        // pr={data ? (data.totalCount > 12 ? th.spacing.md : 0) : 0}
      >
        {columnLabels}
      </l.Grid>
    </Page>
  );
};

export default CreateOrderEntry;
