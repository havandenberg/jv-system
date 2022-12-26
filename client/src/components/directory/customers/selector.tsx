import React, { Fragment } from 'react';
import { sortBy, prop } from 'ramda';

import RemoveImg from 'assets/images/remove';
import api from 'api';
import useItemSelector from 'components/item-selector';
import { Tab, useTabBar } from 'components/tab-bar';
import { Customer } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { DataMessage } from 'components/page/message';

const tabs: Tab[] = [
  {
    id: 'customers',
    text: 'Customers',
  },
];

interface Props {
  customers: Customer[];
  editing: boolean;
  handleAdd: (customer: Customer) => void;
  handleRemove: (customer: Customer) => void;
}

const CustomerSelector = ({
  customers,
  editing,
  handleAdd,
  handleRemove,
}: Props) => {
  const {
    data: customerData,
    loading: customerDataLoading,
    error: customerDataError,
  } = api.useCustomers();

  const { TabBar } = useTabBar({ tabs });

  const allCustomers = sortBy(
    prop('customerName'),
    (customerData ? customerData.nodes : []) as Customer[],
  );

  const { ItemSelector } = useItemSelector<Customer>({
    selectItem: (c) => {
      handleAdd(c);
    },
    allItems: () => allCustomers,
    clearSearchOnSelect: false,
    excludedItems: customers,
    error: customerDataError,
    errorLabel: 'customers',
    loading: customerDataLoading,
    nameKey: 'customerName',
    placeholder: 'Add customers',
    searchParamName: 'customerSearch',
    searchWidth: 350,
    width: 350,
  });

  return (
    <>
      <l.Flex alignCenter my={th.spacing.lg}>
        <l.Div width={300}>
          <TabBar />
        </l.Div>
        {editing && ItemSelector}
      </l.Flex>
      {customers.length > 0 ? (
        sortBy(prop('customerName'), customers).map((it, idx) => (
          <l.Flex alignCenter key={idx} mb={th.spacing.tn}>
            <l.Div width={400}>
              <ty.LinkText
                mr={th.spacing.sm}
                to={`/directory/customers/${it.id}?view=truck-rates`}
              >
                <ty.Span bold>{it.customerName}</ty.Span> ({it.id})
              </ty.LinkText>
            </l.Div>
            {editing && (
              <l.Div
                cursor="pointer"
                height={th.sizes.xs}
                onClick={() => {
                  handleRemove(it);
                }}
              >
                <RemoveImg height={th.sizes.xs} width={th.sizes.xs} />
              </l.Div>
            )}
          </l.Flex>
        ))
      ) : editing ? (
        <ty.BodyText>No customers linked.</ty.BodyText>
      ) : (
        <DataMessage
          data={customers}
          error={customerDataError}
          loading={customerDataLoading}
          emptyProps={{ header: 'No customers linked' }}
        />
      )}
    </>
  );
};

export default CustomerSelector;
