import React, { ChangeEvent, useEffect, useState } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { min, sortBy, times } from 'ramda';
import { Redirect, useLocation } from 'react-router-dom';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import ItemLinkRow from 'components/item-selector/link';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { useTabBar } from 'components/tab-bar';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import { useActiveUser } from 'components/user/context';
import usePrevious from 'hooks/use-previous';
import { Customer, LoadNumber } from 'types';
import b from 'ui/button';
import TextInput from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { IS_PRODUCTION } from 'utils/env';

import { filterLoadNumbersByCoast } from './entry/data-utils';

const MAX_AVAILABLE_LOAD_NUMBERS = 40;

const Wrapper = styled(l.Div)({
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  padding: th.spacing.sm,
});

interface Props {
  coast: string;
  customers: Customer[];
  error?: ApolloError;
  handleUpdate: (
    updatedLoadNumber: Pick<
      LoadNumber,
      'customerId' | 'id' | 'notes' | 'userId'
    >,
  ) => void;
  loading: boolean;
  loadNumber: LoadNumber;
  isPrint?: boolean;
  userId: number;
}

const StyledLoadNumber = ({
  coast,
  customers,
  error,
  handleUpdate,
  loading,
  loadNumber,
  isPrint,
  userId,
}: Props) => {
  const [customerId, setCustomerId] = useState(loadNumber.customerId || '');
  const loadNumberCustomer = customers.find(
    (customer) => customer.id === customerId,
  );
  const [notes, setNotes] = useState(loadNumber.notes || '');

  const { invoiceHeaders, orderEntries, orderMaster } = loadNumber;
  const orderEntry = orderEntries?.nodes[0];
  const invoiceHeader = invoiceHeaders?.nodes[0];
  const billingCustomer =
    orderEntry?.billingCustomer ||
    invoiceHeader?.billingCustomer ||
    orderMaster?.billingCustomer;
  const customer = billingCustomer || loadNumberCustomer;

  let allItems = customerId
    ? customers.filter((customer) =>
        `${customer.id} ${customer.customerName}`
          .toLowerCase()
          .includes(customerId.toLowerCase()),
      )
    : customers;

  if (loadNumber.customerId || customerId) {
    allItems = [{ id: '' }, ...allItems] as Customer[];
  }

  const { ItemSelector } = useItemSelector<Customer>({
    allItems: () => allItems,
    closeOnSelect: true,
    editableCellProps: {
      bypassLocalValue: true,
      content: {
        dirty: customerId !== loadNumber.customerId,
        value: customer
          ? `${customer.customerName} (${customer.id})`
          : customerId || '',
      },
      defaultChildren: null,
      editing: true,
      error: !!error,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setCustomerId(e.target.value);
      },
      warning: !isPrint && !customer,
      inputProps: {
        placeholder: isPrint ? '' : 'Customer',
        width: !isPrint && loadNumber.customerId ? 135 : 80,
      },
    },
    error,
    errorLabel: 'customers',
    getItemContent: (c: Customer) =>
      c.id ? (
        <ItemLinkRow
          active={c.id === customerId}
          link={{
            id: c.id,
            text: `${c.customerName} (${c.id})`,
          }}
        />
      ) : (
        <ty.CaptionText ml={th.spacing.sm} secondary>
          Unassign
        </ty.CaptionText>
      ),
    loading,
    nameKey: 'customerName',
    panelGap: th.spacing.tn,
    selectItem: (c) => {
      setCustomerId(c.id);
      handleUpdate({
        id: loadNumber.id,
        customerId: c.id,
        notes: loadNumber.notes,
        userId,
      });
    },
    width: 350,
  });

  const notesInput = billingCustomer ? (
    <ty.CaptionText my={th.spacing.xs} secondary>
      {notes || '-'}
    </ty.CaptionText>
  ) : (
    <EditableCell
      content={{
        dirty: loadNumber.notes !== notes,
        value: notes,
      }}
      debounce={500}
      defaultChildren={null}
      editing={true}
      error={!!error}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        setNotes(e.target.value);
        handleUpdate({
          id: loadNumber.id,
          customerId: loadNumber.customerId,
          notes: e.target.value,
          userId,
        });
      }}
      warning={false}
      inputProps={{
        mt: th.spacing.tn,
        placeholder: isPrint ? '' : 'Notes',
        width: th.sizes.fill,
      }}
    />
  );

  return (
    <l.Flex alignStart>
      <Wrapper minWidth={isPrint ? 155 : th.sizes.fill}>
        <l.Flex alignCenter justifyBetween>
          <ty.BodyText>{loadNumber.id.padStart(5, '0')}</ty.BodyText>
          {billingCustomer ? (
            <ty.LinkText
              ellipsis
              my={th.spacing.xs}
              hover={false}
              to={`/directory/customers/${billingCustomer.id}`}
              width={135}
            >{`${billingCustomer.customerName} (${billingCustomer.id})`}</ty.LinkText>
          ) : (
            ItemSelector
          )}
        </l.Flex>
        {customer && !isPrint && (
          <>
            {notesInput}
            <l.Flex justifyCenter mt={th.spacing.xs}>
              <ty.LinkText
                fontSize={th.fontSizes.caption}
                secondary
                to={
                  invoiceHeader
                    ? `/accounting/invoices/${invoiceHeader.orderId}`
                    : orderMaster
                    ? `/inventory/orders/${orderMaster.orderId}`
                    : orderEntry
                    ? `/inventory/orders/${orderEntry.orderId}?orderView=orderEntries`
                    : `/inventory/orders/create?coast=${coast}&loadNumber=${loadNumber.id}&customerId=${customer.id}`
                }
              >
                {invoiceHeader || orderMaster || orderEntry ? 'View' : 'Create'}{' '}
                {invoiceHeader ? 'Invoice' : 'Order'}
                {invoiceHeader
                  ? ` ${invoiceHeader.orderId}`
                  : orderMaster
                  ? ` ${orderMaster.orderId}`
                  : ''}
              </ty.LinkText>
            </l.Flex>
          </>
        )}
      </Wrapper>
      {isPrint && (
        <l.Flex ml={th.spacing.md} width={th.sizes.fill}>
          {notesInput}
        </l.Flex>
      )}
    </l.Flex>
  );
};

export const breadcrumbs = [
  { text: 'Orders', to: '/inventory/orders' },
  { text: 'Load Numbers', to: '/inventory/orders/load-numbers' },
];

const tabs = [
  { id: 'available', text: 'Available' },
  { id: 'used', text: 'Used' },
];

const LoadNumberManager = () => {
  const { pathname } = useLocation();
  const { TabBar: CoastFilter, selectedTabId: coast } = useCoastTabBar();
  const { TabBar: StatusFilter, selectedTabId: status } = useTabBar({
    tabs,
    paramName: 'status',
  });
  const isAvailable = status === 'available';
  const isPrint = pathname.includes('print');

  const {
    apiData: { data, loading: userDataLoading },
    roles: { isSalesAssoc },
  } = useActiveUser();
  const userId = data?.id;
  const userCode = data?.userCode;
  const userName = data?.personContact?.firstName;

  const {
    data: loadNumbersData,
    loading: loadNumbersLoading,
    refetch,
  } = api.useLoadNumbersByUser(userId, true);
  const loadNumbers = (loadNumbersData?.nodes || []) as LoadNumber[];

  const sortedLoadNumbers = sortBy(
    ({ id }) => parseInt(id, 10),
    filterLoadNumbersByCoast(loadNumbers, coast),
  ) as LoadNumber[];
  const availableLoadNumbers = sortedLoadNumbers.filter(
    ({ isUsed }) => !isUsed,
  );
  const usedLoadNumbers = sortedLoadNumbers
    .filter(({ isUsed }) => !!isUsed)
    .reverse();
  const assignedLoadNumbers = availableLoadNumbers.filter(
    ({ customerId }) => customerId,
  );
  const unassignedLoadNumbers = availableLoadNumbers.filter(
    ({ customerId }) => !customerId,
  );

  const availableCount = min(
    20,
    MAX_AVAILABLE_LOAD_NUMBERS - unassignedLoadNumbers.length,
  );
  const prevAvailableCount = usePrevious(availableCount);
  const isMax = availableCount <= 0;

  const [upsertCount, setUpsertCount] = useState(isMax ? 0 : availableCount);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');
  const loading = userDataLoading || customerDataLoading || loadNumbersLoading;

  const customers = (customerData ? customerData.nodes : []) as Customer[];

  const [handleUpsert, { loading: upsertLoading, error: upsertError }] =
    api.useUpsertLoadNumbers();

  const disableGenerate =
    userDataLoading ||
    loadNumbersLoading ||
    isGenerating ||
    upsertCount === 0 ||
    isMax ||
    upsertLoading ||
    upsertError;

  const upsertLoadNumbers = () => {
    setIsGenerating(true);
    handleUpsert({
      variables: {
        loadNumbers: times(
          () => ({
            customerId: '',
            id: 0,
            notes: '',
            userId,
          }),
          upsertCount,
        ),
        coast,
      },
    })
      .then(() =>
        refetch({
          userId,
          getUsedLoadNumbers: [true, false],
        }),
      )
      .then(() => {
        setIsGenerating(false);
      });
  };

  const handleUpdateLoadNumber = (
    updatedLoadNumber: Pick<
      LoadNumber,
      'id' | 'customerId' | 'notes' | 'userId'
    >,
  ) => {
    setIsGenerating(true);
    handleUpsert({
      variables: {
        loadNumbers: [updatedLoadNumber],
        coast,
      },
    })
      .then(() =>
        refetch({
          userId,
          getUsedLoadNumbers: [true, false],
        }),
      )
      .then(() => {
        setIsGenerating(false);
      });
  };

  useEffect(() => {
    if (prevAvailableCount !== availableCount) {
      setUpsertCount(isMax ? 0 : availableCount);
    }
  }, [prevAvailableCount, isMax, availableCount]);

  if (!loading && !isSalesAssoc) {
    return <Redirect to="/inventory/orders" />;
  }

  return (
    <Page
      actions={[
        isAvailable && (
          <l.AreaLink
            key="print"
            mr={th.spacing.lg}
            to={`/inventory/orders/load-numbers${
              isPrint ? '' : '/print?status=available&coast=' + coast
            }`}
          >
            <b.Primary>{isPrint ? 'Default View' : 'Print View'}</b.Primary>
          </l.AreaLink>
        ),
        <l.AreaLink
          key="my-orders"
          to={`/inventory/orders?salesUserCode=${userCode}`}
        >
          <b.Primary>My Orders</b.Primary>
        </l.AreaLink>,
        !IS_PRODUCTION && (
          <l.AreaLink
            key="create"
            ml={th.spacing.lg}
            to={`/inventory/orders/create?coast=${coast}`}
          >
            <b.Success>New Order</b.Success>
          </l.AreaLink>
        ),
      ]}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={isPrint ? 40 : 90}
      headerChildren={
        <l.Flex
          alignEnd
          justifyBetween
          height={isPrint ? undefined : 58}
          mb={th.spacing.lg}
        >
          {isPrint ? (
            <l.Flex alignCenter>
              <ty.LargeText>
                User: <ty.Span bold>{userName}</ty.Span>
              </ty.LargeText>
              <ty.LargeText ml={th.spacing.lg}>
                Coast:{' '}
                <ty.Span bold>{coast === 'EC' ? 'East' : 'West'}</ty.Span>
              </ty.LargeText>
              <ty.LargeText ml={th.spacing.lg}>
                Updated: <ty.Span bold>{formatDate(new Date())}</ty.Span>
              </ty.LargeText>
            </l.Flex>
          ) : (
            <l.Flex alignEnd>
              <StatusFilter />
              <l.Div ml={th.spacing.lg}>
                <ty.CaptionText mb={th.spacing.sm} mr={th.spacing.lg} secondary>
                  Coast
                </ty.CaptionText>
                <CoastFilter />
              </l.Div>
            </l.Flex>
          )}
          {!isPrint && isAvailable && (
            <l.Flex alignCenter>
              <l.Flex alignCenter mr={th.spacing.md}>
                <ty.CaptionText mr={th.spacing.md} secondary>
                  New:
                </ty.CaptionText>
                <TextInput
                  key="count"
                  max={
                    40 - unassignedLoadNumbers.length >= 0
                      ? 40 - unassignedLoadNumbers.length
                      : 0
                  }
                  min={0}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value, 10);
                    setUpsertCount(newVal > 40 ? 40 : newVal);
                  }}
                  type="number"
                  value={upsertCount}
                  width={80}
                />
              </l.Flex>
              <b.Success
                alignSelf="flex-end"
                key="upsert"
                disabled={disableGenerate}
                onClick={upsertLoadNumbers}
              >
                Generate
              </b.Success>
            </l.Flex>
          )}
        </l.Flex>
      }
      title="My Load Numbers"
    >
      {isAvailable ? (
        <>
          {!isPrint && (
            <ty.BodyText bold my={th.spacing.md}>
              Unassigned:
              <ty.Span
                fontWeight={th.fontWeights.normal}
                ml={th.spacing.sm}
                secondary
              >
                ({unassignedLoadNumbers.length} / {MAX_AVAILABLE_LOAD_NUMBERS})
              </ty.Span>
            </ty.BodyText>
          )}
          {
            <l.Div mt={isPrint ? th.spacing.md : 0}>
              {!loading &&
              (isPrint ? availableLoadNumbers : unassignedLoadNumbers).length >
                0 ? (
                <l.Grid
                  alignStart
                  gridColumnGap={th.spacing.lg}
                  gridRowGap={th.spacing.md}
                  gridTemplateColumns={`repeat(${isPrint ? 2 : 5}, 1fr)`}
                >
                  {(isPrint ? availableLoadNumbers : unassignedLoadNumbers).map(
                    (loadNumber) => (
                      <StyledLoadNumber
                        coast={coast}
                        customers={customers}
                        error={customerDataError}
                        key={loadNumber.id}
                        loading={customerDataLoading}
                        loadNumber={loadNumber}
                        handleUpdate={(updatedLoadNumber) =>
                          handleUpdateLoadNumber(updatedLoadNumber)
                        }
                        isPrint={isPrint}
                        userId={userId}
                      />
                    ),
                  )}
                </l.Grid>
              ) : (
                <DataMessage
                  data={isPrint ? availableLoadNumbers : unassignedLoadNumbers}
                  error={customerDataError}
                  loading={loading}
                  emptyProps={{
                    header: `No${isPrint ? '' : ' unassigned'} load numbers`,
                  }}
                />
              )}
            </l.Div>
          }
          {!isPrint && (
            <>
              <ty.BodyText bold mb={th.spacing.md} mt={th.spacing.lg}>
                Assigned:
              </ty.BodyText>
              {!loading && assignedLoadNumbers.length > 0 ? (
                <l.Grid
                  alignStart
                  gridColumnGap={th.spacing.lg}
                  gridRowGap={th.spacing.md}
                  gridTemplateColumns="repeat(4, 1fr)"
                >
                  {assignedLoadNumbers.map((loadNumber) => (
                    <StyledLoadNumber
                      coast={coast}
                      customers={customers}
                      error={customerDataError}
                      key={loadNumber.id}
                      loading={customerDataLoading}
                      loadNumber={loadNumber}
                      handleUpdate={(updatedLoadNumber) =>
                        handleUpdateLoadNumber(updatedLoadNumber)
                      }
                      userId={userId}
                    />
                  ))}
                </l.Grid>
              ) : (
                <DataMessage
                  data={assignedLoadNumbers}
                  error={customerDataError}
                  loading={loading}
                  emptyProps={{
                    header: 'No assigned load numbers',
                  }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <l.Div height={th.spacing.md} />
          {!loading && usedLoadNumbers.length > 0 ? (
            <l.Grid
              alignStart
              gridColumnGap={th.spacing.lg}
              gridRowGap={th.spacing.md}
              gridTemplateColumns="repeat(4, 1fr)"
            >
              {usedLoadNumbers.map((loadNumber) => (
                <StyledLoadNumber
                  coast={coast}
                  customers={customers}
                  error={customerDataError}
                  key={loadNumber.id}
                  loading={customerDataLoading}
                  loadNumber={loadNumber}
                  handleUpdate={(updatedLoadNumber) =>
                    handleUpdateLoadNumber(updatedLoadNumber)
                  }
                  userId={userId}
                />
              ))}
            </l.Grid>
          ) : (
            <DataMessage
              data={usedLoadNumbers}
              error={customerDataError}
              loading={loading}
              emptyProps={{
                header: 'No used load numbers',
              }}
            />
          )}
        </>
      )}
      <l.Div height={th.spacing.xxl} />
    </Page>
  );
};

export default LoadNumberManager;
