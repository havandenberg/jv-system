import React, { ChangeEvent, useState } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { sortBy, times } from 'ramda';
import { Redirect } from 'react-router-dom';

import api from 'api';
import useItemSelector from 'components/item-selector';
import ItemLinkRow from 'components/item-selector/link';
import Page from 'components/page';
import { useActiveUser } from 'components/user/context';
import { Customer, LoadNumber } from 'types';
import b from 'ui/button';
import TextInput from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Div)({
  background: th.colors.brand.containerBackground,
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  padding: th.spacing.sm,
});

interface Props {
  customers: Customer[];
  error?: ApolloError;
  handleUpdate: (
    updatedLoadNumber: Pick<LoadNumber, 'customerId' | 'id' | 'userId'>,
  ) => void;
  loading: boolean;
  loadNumber: LoadNumber;
  userId: number;
}

const StyledLoadNumber = ({
  customers,
  error,
  handleUpdate,
  loading,
  loadNumber,
  userId,
}: Props) => {
  const [customerId, setCustomerId] = useState(loadNumber.customerId || '');
  const customer = customers.find((customer) => customer.id === customerId);

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
    allItems,
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
      warning: !customer,
      inputProps: {
        placeholder: 'Customer',
        width: loadNumber.customerId ? 135 : 80,
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
        userId,
      });
    },
    width: 350,
  });

  return (
    <Wrapper>
      <l.Flex alignCenter justifyBetween>
        <ty.BodyText>{loadNumber.id}</ty.BodyText>
        {ItemSelector}
      </l.Flex>
      {customer && (
        <l.Flex justifyCenter mt={th.spacing.tn}>
          <ty.LinkText
            fontSize={th.fontSizes.small}
            secondary
            to={`/inventory/orders/create?loadNumber=${loadNumber.id}&customerId=${customer.id}`}
          >
            Create Order
          </ty.LinkText>
        </l.Flex>
      )}
    </Wrapper>
  );
};

export const breadcrumbs = [
  { text: 'Orders', to: '/inventory/orders' },
  { text: 'Load Numbers', to: '/inventory/orders/load-numbers' },
];

const LoadNumberManager = () => {
  const {
    apiData: { data, loading },
    roles: { isSalesAssoc },
  } = useActiveUser();
  const userId = data?.id;
  const userCode = data?.userCode;
  const loadNumbers = (data?.loadNumbers?.nodes || []) as LoadNumber[];

  const sortedLoadNumbers = sortBy(
    ({ customerId }) => (customerId ? 'b' : 'a'),
    sortBy(({ id }) => parseInt(id, 10), loadNumbers),
  );
  const assignedLoadNumbers = sortedLoadNumbers.filter(
    ({ customerId }) => customerId,
  );
  const unassignedLoadNumbers = sortedLoadNumbers.filter(
    ({ customerId }) => !customerId,
  );

  const [upsertCount, setUpsertCount] = useState(20);

  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');

  const customers = (customerData ? customerData.nodes : []) as Customer[];

  const [handleUpsert, { loading: upsertLoading, error: upsertError }] =
    api.useUpsertLoadNumbers(userId || 0);

  const upsertLoadNumbers = () => {
    handleUpsert({
      variables: {
        loadNumbers: times(
          () => ({
            customerId: '',
            userId,
          }),
          upsertCount,
        ),
      },
    });
  };

  if (!loading && !isSalesAssoc) {
    return <Redirect to="/inventory/orders" />;
  }

  return (
    <Page
      actions={[
        <l.AreaLink
          key="my-orders"
          to={`/inventory/orders?salesUserCode=${userCode}`}
        >
          <b.Primary>My Orders</b.Primary>
        </l.AreaLink>,
      ]}
      breadcrumbs={breadcrumbs}
      title="My Load Numbers"
    >
      <l.Flex alignCenter mb={th.spacing.lg} mt={th.spacing.md}>
        <ty.CaptionText mr={th.spacing.lg} secondary>
          Generate new load numbers:
        </ty.CaptionText>
        <TextInput
          key="count"
          max={40 - unassignedLoadNumbers.length}
          min={1}
          onChange={(e) => {
            const newVal = parseInt(e.target.value, 10);
            setUpsertCount(newVal > 40 ? 40 : newVal);
          }}
          type="number"
          value={upsertCount}
          width={100}
        />
        <b.Primary
          key="upsert"
          disabled={upsertLoading || upsertError}
          ml={th.spacing.lg}
          onClick={upsertLoadNumbers}
        >
          Generate
        </b.Primary>
      </l.Flex>
      <ty.CaptionText my={th.spacing.lg} secondary>
        Unassigned load numbers:
      </ty.CaptionText>
      <l.Grid
        alignStart
        gridColumnGap={th.spacing.lg}
        gridRowGap={th.spacing.md}
        gridTemplateColumns="repeat(5, 1fr)"
      >
        {unassignedLoadNumbers.map((loadNumber) => (
          <StyledLoadNumber
            customers={customers}
            error={customerDataError}
            key={loadNumber.id}
            loading={customerDataLoading}
            loadNumber={loadNumber}
            handleUpdate={(updatedLoadNumber) => {
              handleUpsert({
                variables: {
                  loadNumbers: [updatedLoadNumber],
                },
              });
            }}
            userId={userId}
          />
        ))}
      </l.Grid>
      <ty.CaptionText my={th.spacing.lg} secondary>
        Assigned load numbers:
      </ty.CaptionText>
      <l.Grid
        alignStart
        gridColumnGap={th.spacing.lg}
        gridRowGap={th.spacing.md}
        gridTemplateColumns="repeat(4, 1fr)"
      >
        {assignedLoadNumbers.map((loadNumber) => (
          <StyledLoadNumber
            customers={customers}
            error={customerDataError}
            key={loadNumber.id}
            loading={customerDataLoading}
            loadNumber={loadNumber}
            handleUpdate={(updatedLoadNumber) => {
              handleUpsert({
                variables: {
                  loadNumbers: [updatedLoadNumber],
                },
              });
            }}
            userId={userId}
          />
        ))}
      </l.Grid>
    </Page>
  );
};

export default LoadNumberManager;
