import React, { useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import { equals } from 'ramda';

import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import { ResetButton } from 'components/inventory/inventory/use-filters';
import useItemSelector from 'components/item-selector';
import { useTabBar } from 'components/tab-bar';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import useDateRange from 'hooks/use-date-range';
import useKeyboardWeekChange from 'hooks/use-keyboard-week-change';
import {
  useDateRangeQueryParams,
  useProgramsQueryParams,
} from 'hooks/use-query-params';
import { Shipper, Customer, Maybe } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export const viewTabs = [
  {
    id: 'customers',
    text: 'Customers',
  },
  {
    id: 'shippers',
    text: 'Shippers',
  },
];

type Props = {
  isCustomers: boolean;
  shippers: Shipper[];
  shipperDataError?: ApolloError;
  shipperDataLoading: boolean;
  selectedShipper?: Maybe<Shipper>;
  customers: Customer[];
  customerDataError?: ApolloError;
  customerDataLoading: boolean;
  selectedCustomer?: Maybe<Customer>;
  handleCancel: () => void;
  setEditing: (editing: boolean) => void;
};

const ProgramsFilters = ({
  isCustomers,
  shippers,
  shipperDataError,
  shipperDataLoading,
  selectedShipper,
  customers,
  customerDataError,
  customerDataLoading,
  selectedCustomer,
  handleCancel,
  setEditing,
}: Props) => {
  const [, setProgramsQueryParams] = useProgramsQueryParams();

  const { TabBar: CoastTabBar, selectedTabId: coast } = useCoastTabBar();

  const [
    { startDate = formatDate(new Date()), endDate = formatDate(new Date()) },
  ] = useDateRangeQueryParams();

  const { DateRangePicker, ForwardButton, BackwardButton, handleDateChange } =
    useDateRange({
      hideDefinedRanges: true,
      singleSelection: true,
      offsetLeft: `-${th.spacing.md}`,
    });

  useKeyboardWeekChange(handleDateChange);

  const { TabBar: ViewTabBar, selectedTabId: view } = useTabBar({
    tabs: viewTabs,
    isRoute: false,
    defaultTabId: 'customers',
    paramName: 'programsView',
    defaultTabIndex: 0,
    onSelectTab: handleCancel,
  });

  const { ItemSelector: ShipperItemSelector, clearSearch: clearShipperSearch } =
    useItemSelector<Shipper>({
      selectItem: (shipper) => {
        setProgramsQueryParams({ shipperId: shipper.id });
      },
      allItems: (localValue) =>
        (shippers as Shipper[]).filter((shipper) =>
          `${shipper.shipperName}-${shipper.id}`
            .toLowerCase()
            .includes(localValue.toLowerCase()),
        ),
      closeOnSelect: true,
      disableSearchQuery: true,
      error: shipperDataError,
      errorLabel: 'shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => {
        setProgramsQueryParams({ shipperId: undefined });
        handleCancel();
      },
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      searchParamName: 'shipperSearch',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      searchWidth: 300,
      width: 350,
    });

  const {
    ItemSelector: CustomerItemSelector,
    clearSearch: clearCustomerSearch,
  } = useItemSelector<Customer>({
    selectItem: (customer) => {
      setProgramsQueryParams({ customerId: customer.id });
    },
    allItems: (localValue) =>
      (customers as Customer[]).filter((customer) =>
        `${customer.customerName}-${customer.id}`
          .toLowerCase()
          .includes(localValue.toLowerCase()),
      ),
    closeOnSelect: true,
    disableSearchQuery: true,
    error: customerDataError,
    errorLabel: 'customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    onClear: () => {
      setProgramsQueryParams({ customerId: undefined });
      handleCancel();
    },
    onlyClearSearch: true,
    placeholder: 'Select customer',
    searchParamName: 'customerSearch',
    selectedItem: selectedCustomer
      ? `${selectedCustomer.customerName} (${selectedCustomer.id})`
      : undefined,
    searchWidth: 300,
    width: 350,
  });

  useEffect(() => {
    if (!startDate) {
      handleDateChange({
        selection: {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection',
        },
      });
    } else if (!equals(startDate, endDate)) {
      handleDateChange({
        selection: {
          startDate: new Date(startDate.replace(/-/g, '/')),
          endDate: new Date(startDate.replace(/-/g, '/')),
          key: 'selection',
        },
      });
    }
  }, [endDate, handleDateChange, startDate]);

  return (
    <l.Flex mb={th.spacing.md}>
      <l.Div mr={th.spacing.lg}>
        <ty.SmallText mb={th.spacing.sm} secondary>
          Coast
        </ty.SmallText>
        <CoastTabBar />
      </l.Div>
      <l.Div mr={th.spacing.lg}>
        <ty.SmallText mb={th.spacing.sm} secondary>
          View
        </ty.SmallText>
        <ViewTabBar />
      </l.Div>
      <l.Div mr={th.spacing.lg}>
        <ty.SmallText mb={th.spacing.sm} secondary>
          {isCustomers ? 'Customer' : 'Shipper'}
        </ty.SmallText>
        {isCustomers ? CustomerItemSelector : ShipperItemSelector}
      </l.Div>
      <div>
        <ty.SmallText mb={th.spacing.sm} secondary>
          Week Of
        </ty.SmallText>
        <l.Flex alignCenter>
          {DateRangePicker}
          {BackwardButton}
          {ForwardButton}
        </l.Flex>
      </div>
      <ResetButton
        ml={th.sizes.icon}
        mt={29}
        onClick={() => {
          clearShipperSearch();
          clearCustomerSearch();
          setEditing(false);
        }}
      >
        <l.AreaLink
          cursor="pointer"
          height={th.sizes.icon}
          width={th.sizes.icon}
          to={`/sales/programs?programsView=${view}&coast=${coast}`}
        >
          <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
        </l.AreaLink>
      </ResetButton>
    </l.Flex>
  );
};

export default ProgramsFilters;
